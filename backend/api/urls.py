from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import GitHubCallbackView, ProjectsMeView, AnalyzeErrorView

urlpatterns = [
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/github/', GitHubCallbackView.as_view(), name='github_callback'),
    path('projects/me/', ProjectsMeView.as_view(), name='projects_me'),
    path('errors/analyze/', AnalyzeErrorView.as_view(), name='analyze_error'),
]
