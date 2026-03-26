from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    github_id = models.CharField(max_length=64, unique=True)
    avatar_url = models.URLField(blank=True, null=True)

    def __str__(self) -> str:
        return self.user.username


class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")
    repo_id = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    repo_full_name = models.CharField(max_length=255)
    html_url = models.URLField()
    is_group = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name


class ErrorSnap(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="error_snaps")
    error_text = models.TextField()
    code_snippet = models.TextField(blank=True)
    ai_explanation = models.TextField(blank=True)
    ai_fixed_code = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
