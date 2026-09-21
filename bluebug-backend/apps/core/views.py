"""
Core app views — health check aur utility endpoints yahan hain.
"""
import logging
from django.db import connection, OperationalError
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle

from .models import HeadlineMetric, TechSkillMetric, WorkMixMetric, SprintPhaseMetric
from .serializers import (
    HeadlineMetricSerializer,
    TechSkillMetricSerializer,
    WorkMixMetricSerializer,
    SprintPhaseMetricSerializer,
)

logger = logging.getLogger('apps.core')


@api_view(['GET'])
def health_check(request):
    """
    GET /api/health/ — hosting platform ka uptime monitor yahan ping karta hai.
    DB connectivity bhi check karta hai — agar DB down ho to 503 deta hai.
    """
    db_ok = False
    db_error = None
    try:
        # Actual query execute karo — sirf connection check enough nahi hai
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        db_ok = True
    except OperationalError as e:
        db_error = str(e)
        logger.error(f"Health check DB failure: {e}")

    if not db_ok:
        return Response(
            {"status": "error", "db": "disconnected", "detail": "Database unreachable."},
            status=503
        )

    return Response({
        "status": "ok",
        "db": "connected",
        "version": "1.0.0",
    })


class StatsSummaryView(APIView):
    """
    GET /api/stats/ — Public endpoint returning all editable metrics
    for the Plotly charts and headline counters.
    """
    def get(self, request, *args, **kwargs):
        headline_qs = HeadlineMetric.objects.filter(is_active=True).order_by('order', 'id')
        tech_qs = TechSkillMetric.objects.filter(is_active=True).order_by('order', 'id')
        work_qs = WorkMixMetric.objects.filter(is_active=True).order_by('order', 'id')
        sprint_qs = SprintPhaseMetric.objects.filter(is_active=True).order_by('order', 'id')

        headline_data = HeadlineMetricSerializer(headline_qs, many=True).data

        radar_categories = [t.skill_name for t in tech_qs]
        radar_values = [t.score for t in tech_qs]

        work_labels = [w.category_name for w in work_qs]
        work_values = [w.percentage for w in work_qs]
        work_colors = [w.color_hex for w in work_qs if w.color_hex]

        sprint_phases = [s.phase_name for s in sprint_qs]
        sprint_weeks = [s.duration_weeks for s in sprint_qs]

        return Response({
            "headline_stats": headline_data,
            "radar_chart": {
                "categories": radar_categories,
                "values": radar_values,
            },
            "work_mix_chart": {
                "labels": work_labels,
                "values": work_values,
                "colors": work_colors,
            },
            "sprint_timeline_chart": {
                "phases": sprint_phases,
                "weeks": sprint_weeks,
            },
        })
