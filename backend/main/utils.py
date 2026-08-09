from django.utils.text import slugify

from rest_framework_simplejwt.tokens import RefreshToken
import secrets
import string

def generate_unique_short_code(length=8):
    """Генерує унікальний короткий код"""
    chars = string.ascii_letters + string.digits
    
    while True:
        code = ''.join(secrets.choice(chars) for _ in range(length))
        
        from shortener.models import ShortenedURL
        if not ShortenedURL.objects.filter(short_code=code).exists():
            return code

def custom_slugify(value):
    slug = slugify(value)
    return slug.replace("-", "_")

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
