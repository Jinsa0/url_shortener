from django.utils.text import slugify
from rest_framework_simplejwt.tokens import RefreshToken

def custom_slugify(value):
    slug = slugify(value)
    return slug.replace("-", "_")

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
