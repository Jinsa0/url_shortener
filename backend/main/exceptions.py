# exceptions.py
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import TokenError

class InvalidRefreshTokenError(TokenError):
    """Raised when invalid refresh token is provided."""
    def __init__(self):
        super().__init__({
            "token": "Invalid refresh token."
        })


class PasswordMismatchError(ValidationError):
    """Raised when password and confirm password doesn't match."""
    def __init__(self):
        super().__init__({
            "password": "Password and confirm password doesn't match."
        })