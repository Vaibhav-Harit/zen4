from django.urls import path
from .views import GitHubCallbackView, ProjectsMeView

urlpatterns = [
    path('auth/github/callback/', GitHubCallbackView.as_view(), name='github_callback'),
    path('projects/me/', ProjectsMeView.as_view(), name='projects_me'),
]
