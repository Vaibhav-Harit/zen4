from django.urls import path
from .views import GitHubCallbackView

urlpatterns = [
    path('auth/github/callback/', GitHubCallbackView.as_view(), name='github_callback'),
]
