# serializers.py
from rest_framework import serializers
from .models import ShortenedURL

class ShortenedURLSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = ShortenedURL
        fields = ['id', 'original_url', 'short_code', 'created_at', 'clicks', 'notes', 'user_id']
        read_only_fields = ['id', 'short_code', 'created_at', 'clicks', 'user_id']