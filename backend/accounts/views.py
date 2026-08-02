from django.contrib.auth import authenticate, login, logout, get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from rest_framework.permissions import IsAuthenticated

from . import serializers
from main import utils, permissions 

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.IsAnonymous]

    def post(self, request):
        serializer = serializers.UserRegisterSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.IsAnonymous]
    
    def post(self, request):
        serializer = serializers.UserLoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = authenticate(request=request, **serializer.validated_data)
        if user:
            login(request, user)
            token = utils.get_tokens_for_user(user)
            return Response(token, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)

class RefreshTokenView(TokenRefreshView):
    pass

class LogoutView(TokenBlacklistView):
    pass

class AccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug=None):
        if slug:
            account = get_object_or_404(User, slug=slug)
        else:
            account = request.user

        serializer = serializers.AccountSerializer(account)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, slug=None):
        account = request.user if not slug or slug == request.user.slug else get_object_or_404(User, slug=slug)
        if account != request.user:
            self.permission_denied(request, message="Only owner can edit their account.")

        serializer = serializers.AccountSerializer(instance=account, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
