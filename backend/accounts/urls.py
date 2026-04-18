# backend/accounts/urls.py
from django.urls import path
from .views import RegisterView, LoginView, RefreshTokenView, LogoutView, UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserDetailView.as_view(), name='me'),
]