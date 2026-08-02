from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from main import exceptions

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise exceptions.PasswordMismatchError()
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=128)
    password = serializers.CharField(write_only=True)

class UserLogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        try:
            token = RefreshToken(attrs["refresh"])
            attrs["token"] = token
        except TokenError:
            raise exceptions.InvalidRefreshTokenError()
        return attrs

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "slug",
            "bio",
            "avatar",
        ]
        read_only_fields = [
            "id",
            "slug",
        ]
