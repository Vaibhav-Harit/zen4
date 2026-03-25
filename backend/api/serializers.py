from rest_framework.serializers import ModelSerializer

from .models import ErrorSnap, Project, UserProfile


class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"


class ProjectSerializer(ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class ErrorSnapSerializer(ModelSerializer):
    class Meta:
        model = ErrorSnap
        fields = "__all__"
        read_only_fields = ("ai_explanation", "ai_fixed_code")
