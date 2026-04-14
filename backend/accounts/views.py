# backend/accounts/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "message": "Користувач успішно зареєстрований",
            "username": user.username
        }, status=status.HTTP_201_CREATED)


# Використовуємо готові JWT views від simplejwt
class LoginView(TokenObtainPairView):
    pass   # використовує вбудований serializer

class RefreshTokenView(TokenRefreshView):
    pass

class LogoutView(TokenBlacklistView):
    pass