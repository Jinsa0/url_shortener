# views.py
from django.db.models import Avg, Count, Max, Sum
from django.db.models.functions import Coalesce, Length, TruncDate
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ShortenedURL
from .serializers import ShortenedURLSerializer
from django.shortcuts import get_object_or_404, redirect
from .services import generate_unique_short_code

class ShortenedURLViewSet(viewsets.ModelViewSet):
    serializer_class = ShortenedURLSerializer
    queryset = ShortenedURL.objects.none()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return ShortenedURL.objects.none()
        return ShortenedURL.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        original_url = serializer.validated_data.get('original_url')

        existing = ShortenedURL.objects.filter(
            original_url=original_url,
            user=self.request.user
        ).first()

        if existing:
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Створюємо нове
        short_code = generate_unique_short_code()
        serializer.save(
            short_code=short_code,
            user=self.request.user
        )

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        all_urls = ShortenedURL.objects.all()
        my_urls = ShortenedURL.objects.filter(user=request.user)

        all_aggregates = all_urls.aggregate(
            total_urls=Count('id'),
            total_clicks=Coalesce(Sum('clicks'), 0),
            average_clicks=Coalesce(Avg('clicks'), 0.0),
        )
        my_aggregates = my_urls.aggregate(
            total_urls=Count('id'),
            total_clicks=Coalesce(Sum('clicks'), 0),
            average_clicks=Coalesce(Avg('clicks'), 0.0),
        )

        top_popular_all = list(
            all_urls.order_by('-clicks', '-created_at').values(
                'id', 'original_url', 'short_code', 'clicks', 'created_at'
            )[:3]
        )
        newest_all = list(
            all_urls.order_by('-created_at').values(
                'id', 'original_url', 'short_code', 'clicks', 'created_at'
            )[:3]
        )

        longest_item = (
            all_urls.annotate(url_length=Length('original_url'))
            .order_by('-url_length', '-created_at')
            .values('id', 'original_url', 'short_code', 'url_length')
            .first()
        )

        my_popular = list(
            my_urls.order_by('-clicks', '-created_at').values(
                'id', 'original_url', 'short_code', 'clicks', 'created_at'
            )[:3]
        )

        my_daily_counts = list(
            my_urls.annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(total=Count('id'))
            .order_by('-total', '-day')
        )
        max_day_total = my_daily_counts[0]['total'] if my_daily_counts else 0
        busiest_days = [
            {
                'day': item['day'].isoformat() if item['day'] else None,
                'total': item['total'],
            }
            for item in my_daily_counts
            if item['total'] == max_day_total
        ]

        response_data = {
            'global': {
                'total_urls': all_aggregates['total_urls'],
                'total_clicks': all_aggregates['total_clicks'],
                'average_clicks': round(float(all_aggregates['average_clicks']), 2),
                'top_popular_urls': top_popular_all,
                'top_newest_urls': newest_all,
                'longest_original_url': longest_item,
            },
            'my': {
                'total_urls': my_aggregates['total_urls'],
                'total_clicks': my_aggregates['total_clicks'],
                'average_clicks': round(float(my_aggregates['average_clicks']), 2),
                'busiest_creation_days': busiest_days,
                'top_popular_urls': my_popular,
            },
        }
        return Response(response_data, status=status.HTTP_200_OK)

def redirect_to_original(request, short_code):
    url_obj = get_object_or_404(ShortenedURL, short_code=short_code)
    url_obj.clicks += 1
    url_obj.save(update_fields=['clicks'])
    return redirect(url_obj.original_url)