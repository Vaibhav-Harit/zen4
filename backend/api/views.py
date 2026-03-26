import os
import requests
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, Project

class GitHubCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        code = request.GET.get('code')
        if not code:
            return Response({'error': 'No code provided'}, status=400)

        client_id = os.environ.get('GITHUB_CLIENT_ID')
        client_secret = os.environ.get('GITHUB_CLIENT_SECRET')

        token_response = requests.post(
            'https://github.com/login/oauth/access_token',
            data={
                'client_id': client_id,
                'client_secret': client_secret,
                'code': code,
            },
            headers={'Accept': 'application/json'}
        )

        if not token_response.ok:
            return Response({'error': 'Failed to exchange token'}, status=400)

        token_data = token_response.json()
        access_token = token_data.get('access_token')

        if not access_token:
            return Response({'error': 'No access token in response'}, status=400)

        user_response = requests.get(
            'https://api.github.com/user',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json'
            }
        )

        if not user_response.ok:
            return Response({'error': 'Failed to fetch user info'}, status=400)

        user_info = user_response.json()
        login = user_info.get('login')
        github_id = str(user_info.get('id'))
        avatar_url = user_info.get('avatar_url')

        if not login or not github_id:
            return Response({'error': 'Incomplete user info from GitHub'}, status=400)

        user, created = User.objects.get_or_create(username=login)
        UserProfile.objects.update_or_create(
            user=user,
            defaults={
                'github_id': github_id,
                'avatar_url': avatar_url
            }
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
