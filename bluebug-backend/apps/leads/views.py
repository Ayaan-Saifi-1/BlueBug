"""
Lead views — POST /api/leads/ only.
Rate limited, validated, logs every submission (without PII ke saath spam alerts).
"""
import logging
from rest_framework import generics, status
from rest_framework.throttling import AnonRateThrottle
from rest_framework.response import Response
from .models import Lead
from .serializers import LeadSerializer

logger = logging.getLogger('apps.leads')


class LeadCreateThrottle(AnonRateThrottle):
    # base.py me 'lead_create' rate defined hai (5/hour per IP)
    scope = 'lead_create'


class LeadCreate(generics.CreateAPIView):
    """
    POST /api/leads/ — Contact form submissions yahan aate hain.
    Rate limited: 5 per hour per IP — spam flood nahi ho sakta.
    Ye endpoint publicly accessible hai lekin throttled aur validated.
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    throttle_classes = [LeadCreateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(
                f"Lead submission validation failed from {request.META.get('REMOTE_ADDR', 'unknown')}: "
                f"{serializer.errors}"
            )
            return Response(
                {"error": "Invalid form data.", "code": "validation_error", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        self.perform_create(serializer)

        # Log lead created (no sensitive info in logs — just metadata)
        logger.info(
            f"New lead created | service: {serializer.validated_data.get('interested_service', 'not specified')} "
            f"| source: {serializer.validated_data.get('source_page', 'unknown')}"
        )

        return Response(
            {"message": "Your message has been received. We'll be in touch shortly."},
            status=status.HTTP_201_CREATED
        )
