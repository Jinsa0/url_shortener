# backend/shortener/models.py
from django.db import models
from django.contrib.auth import get_user_model
from main.models import BaseModel

User = get_user_model()

class ShortenedURL(BaseModel):
    original_url = models.URLField(
        max_length=2048,
        unique=True,
        help_text="Оригінальне довге посилання"
    )

    short_code = models.CharField(
        max_length=10,
        unique=True,
        db_index=True,
        blank=True,
        help_text="Короткий код, наприклад: aB3x9K"
    )

    clicks = models.IntegerField(
        blank=True, 
        null=True,
        default=0
    )

    notes = models.CharField(
        max_length=2048, 
        blank=True, 
        null=True
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="shortened_urls"
    )

    class Meta:
        verbose_name = "Shortened URL"
        verbose_name_plural = "Shortened URLs"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.short_code or '---'} → {self.original_url[:60]}..."