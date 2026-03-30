from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import GitHubCallbackView, ProjectsMeView, AnalyzeErrorView, MemorizeFixView, MySnapsView, CreatePRView

urlpatterns = [
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/github/', GitHubCallbackView.as_view(), name='github_callback'),
    path('projects/me/', ProjectsMeView.as_view(), name='projects_me'),
    path('errors/analyze/', AnalyzeErrorView.as_view(), name='analyze_error'),
    path('memory/memorize/', MemorizeFixView.as_view(), name='memorize_fix'),
    path('projects/<int:project_id>/snaps/', MySnapsView.as_view(), name='project_snaps'),
    path('github/create-pr/', CreatePRView.as_view(), name='create_pr'),
]
