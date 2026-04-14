from django.contrib import admin
from shortener.models import ShortenedURL

@admin.register(ShortenedURL)
class ShortenedURLAdmin(admin.ModelAdmin):
    list_display = ('original_url', 'short_code', 'created_at')
    search_fields = ('original_url', 'short_code')
    ordering = ('-created_at',)