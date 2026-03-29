from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from .models import UserProfile, Project
from .serializers import ProjectSerializer

class GitHubCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        code = request.data.get('code')
        if not code:
            return Response({"error": "code not provided"}, status=status.HTTP_400_BAD_REQUEST)

        token_url = "https://github.com/login/oauth/access_token"
        token_data = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
        }
        headers = {"Accept": "application/json"}
        
        token_response = requests.post(token_url, data=token_data, headers=headers)
        if token_response.status_code != 200:
            return Response({"error": "Failed to authenticate with GitHub"}, status=status.HTTP_400_BAD_REQUEST)
            
        token_json = token_response.json()
        access_token = token_json.get("access_token")
        
        if not access_token:
            return Response({"error": token_json.get('error_description', 'Invalid code')}, status=status.HTTP_400_BAD_REQUEST)
            
        user_url = "https://api.github.com/user"
        user_headers = {"Authorization": f"Bearer {access_token}"}
        user_response = requests.get(user_url, headers=user_headers)
        
        if user_response.status_code != 200:
            return Response({"error": "Failed to fetch user data from GitHub"}, status=status.HTTP_400_BAD_REQUEST)
            
        user_data = user_response.json()
        github_username = user_data.get("login")
        github_id = str(user_data.get("id"))
        avatar_url = user_data.get("avatar_url", "")
        
        if not github_username or not github_id:
            return Response({"error": "GitHub user data incomplete"}, status=status.HTTP_400_BAD_REQUEST)
            
        user, created = User.objects.get_or_create(username=github_username)
        if created:
            user.set_unusable_password()
            user.save()
            
        profile, profile_created = UserProfile.objects.get_or_create(
            user=user,
            defaults={"github_id": github_id, "avatar_url": avatar_url}
        )
        if not profile_created:
            profile.github_id = github_id
            profile.avatar_url = avatar_url
            profile.save()
            
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })

class ProjectsMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        projects = Project.objects.filter(user=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
