"""
Core app views — health check aur utility endpoints yahan hain.
"""
import logging
from django.db import connection, OperationalError
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

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
