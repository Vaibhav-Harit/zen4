import os
import requests
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, Project, ErrorSnap
from .serializers import ProjectSerializer, ErrorSnapSerializer
import json
from django.http import StreamingHttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
from .rag_service import extract_text_from_image, analyze_with_rag_stream, memorize_fix
from .github_service import create_pull_request
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings

class GitHubCallbackView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # Skip JWT auth entirely for this view

    def _handle_oauth(self, code):
        if not code:
            return Response({'error': 'No code provided'}, status=400)

        client_id = os.environ.get('GITHUB_CLIENT_ID', os.getenv('GITHUB_CLIENT_ID'))
        client_secret = os.environ.get('GITHUB_CLIENT_SECRET', os.getenv('GITHUB_CLIENT_SECRET'))

        print(f"[GITHUB OAUTH_DEBUG] Client ID present: {bool(client_id)} | Client Secret present: {bool(client_secret)}")

        token_response = requests.post(
            'https://github.com/login/oauth/access_token',
            data={
                'client_id': client_id,
                'client_secret': client_secret,
                'code': code,
            },
            headers={'Accept': 'application/json'}
        )

        try:
            token_data = token_response.json()
            print(f"[GITHUB OAUTH_DEBUG] Raw JSON Response: {token_data}")
        except Exception:
            print(f"[GITHUB OAUTH_DEBUG] Non-JSON Response text: {token_response.text}")
            return Response({'error': 'Failed to parse JSON token response.'}, status=400)

        if 'error' in token_data:
            return Response({
                'error': token_data['error'], 
                'error_description': token_data.get('error_description', '')
            }, status=400)

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
        avatar_url = user_info.get('avatar_url', "")

        if not login or not github_id:
            return Response({'error': 'Incomplete user info from GitHub'}, status=400)

        user, created = User.objects.get_or_create(username=login)
        if created:
            user.set_unusable_password()
            user.save()

        UserProfile.objects.update_or_create(
            user=user,
            defaults={
                'github_id': github_id,
                'github_token': access_token,
                'avatar_url': avatar_url
            }
        )

        repos_response = requests.get(
            'https://api.github.com/user/repos',
            headers={
                'Authorization': f'token {access_token}',
                'Accept': 'application/json'
            },
            params={'per_page': 100, 'sort': 'updated'}
        )

        if repos_response.ok:
            repos_data = repos_response.json()
            for repo in repos_data:
                is_group = repo['owner']['login'] != login
                Project.objects.update_or_create(
                    repo_id=str(repo['id']),
                    defaults={
                        'user': user,
                        'name': repo.get('name', ''),
                        'repo_full_name': repo.get('full_name', ''),
                        'html_url': repo.get('html_url', ''),
                        'is_group': is_group
                    }
                )

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'avatar_url': avatar_url,
                'github_id': github_id
            }
        })

    def get(self, request, *args, **kwargs):
        code = request.GET.get('code')
        return self._handle_oauth(code)

    def post(self, request, *args, **kwargs):
        code = request.data.get('code')
        return self._handle_oauth(code)


class ProjectsMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        projects = Project.objects.filter(user=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class AnalyzeErrorView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        error_text = request.data.get('error_text') or request.data.get('error_log', '')
        code_snippet = request.data.get('code_snippet', '')
        project_id = request.data.get('project_id', 'unknown')
        screenshot = request.FILES.get('screenshot')

        ocr_text = ""
        if screenshot:
            # Save screenshot temporarily
            path = default_storage.save(f'tmp/{screenshot.name}', ContentFile(screenshot.read()))
            full_path = os.path.join(settings.MEDIA_ROOT, path)
            
            # Extract text using Vision OCR
            ocr_text = extract_text_from_image(full_path)
            
            # Clean up temp file
            default_storage.delete(path)

        def event_stream():
            for chunk in analyze_with_rag_stream(error_text, code_snippet, ocr_text, project_id):
                yield f"data: {json.dumps(chunk)}\n\n"

        return StreamingHttpResponse(event_stream(), content_type='text/event-stream')
class MemorizeFixView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        project_id = request.data.get('project_id')
        error_text = request.data.get('error_text')
        fixed_code = request.data.get('fixed_code')
        is_global = request.data.get('is_global', False)

        if not all([project_id, error_text, fixed_code]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ensure project exists
            project = Project.objects.get(id=project_id)
            
            # 1. Vector Storage (Pinecone)
            memorize_fix(project_id, error_text, fixed_code, is_global=is_global)
            
            # 2. SQL Storage (History)
            ErrorSnap.objects.create(
                project=project,
                error_text=error_text,
                ai_fixed_code=fixed_code,
                ai_explanation="Resolved via Snap.it AI and saved to memory."
            )
            return Response({'message': 'Memory saved successfully'}, status=status.HTTP_201_CREATED)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MySnapsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            snaps = ErrorSnap.objects.filter(project_id=project_id).order_by('-created_at')
            serializer = ErrorSnapSerializer(snaps, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class CreatePRView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        project_id = request.data.get('project_id')
        file_path = request.data.get('file_path')
        fixed_code = request.data.get('fixed_code')
        commit_message = request.data.get('commit_message', "Fix: Bug resolved via Snap.it AI")

        if not all([project_id, file_path, fixed_code]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Get Project & Repo Info
            project = Project.objects.get(id=project_id)
            repo_full_name = project.repo_full_name

            # 2. Get User GitHub Token
            profile = request.user.profile
            user_token = profile.github_token

            if not user_token:
                return Response({'error': 'GitHub token not found. Please re-login.'}, status=status.HTTP_401_UNAUTHORIZED)

            # 3. Call GitHub Service to create PR
            pr_url = create_pull_request(
                user_token=user_token,
                repo_full_name=repo_full_name,
                file_path=file_path,
                fixed_code=fixed_code,
                commit_message=commit_message
            )

            if pr_url:
                return Response({'pr_url': pr_url}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Failed to create PR'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
