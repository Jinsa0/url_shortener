# backend/shortener/services.py
import secrets
import string
from .models import ShortenedURL

def generate_unique_short_code(length=8):
    """Генерує унікальний короткий код"""
    chars = string.ascii_letters + string.digits  # a-z, A-Z, 0-9
    
    while True:
        code = ''.join(secrets.choice(chars) for _ in range(length))
        
        # Перевіряємо, чи такий код вже існує в базі
        if not ShortenedURL.objects.filter(short_code=code).exists():
            return code