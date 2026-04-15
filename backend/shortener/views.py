# views.py
from rest_framework import viewsets
from .models import ShortenedURL
from .serializers import ShortenedURLSerializer
from django.shortcuts import get_object_or_404, redirect
from django.utils import timezone
from .services import generate_unique_short_code

class ShortenedURLViewSet(viewsets.ModelViewSet):
    queryset = ShortenedURL.objects.all()
    serializer_class = ShortenedURLSerializer

    def perform_create(self, serializer):
        short_code = generate_unique_short_code()

        original_url = serializer.validated_data.get('original_url')
        existing = ShortenedURL.objects.filter(original_url=original_url).first()
        if existing:
            return existing
        serializer.save(
            short_code=short_code,
            user=self.request.user if self.request.user.is_authenticated else None)
        

def redirect_to_original(request, short_code):
    url_obj = get_object_or_404(ShortenedURL, short_code=short_code)
    url_obj.clicks += 1
    url_obj.save(update_fields=['clicks'])
    return redirect(url_obj.original_url)