"""
Custom DRF exception handler for BlueBug backend.
Yahan sabhi exceptions ek clean JSON format me return hote hain.
Client ko kabhi bhi raw Django traceback nahi dikhna chahiye.
"""
import logging
import traceback

from django.http import Http404
from django.core.exceptions import PermissionDenied, ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.exceptions import (
    APIException,
    NotFound,
    PermissionDenied as DRFPermissionDenied,
    ValidationError,
    Throttled,
)
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger('apps.core')


def _build_error_payload(error_msg: str, code: str, details=None) -> dict:
    """Standard error response shape — frontend is parsing this contract."""
    payload = {"error": str(error_msg), "code": code}
    if details is not None:
        payload["details"] = details
    return payload


def custom_exception_handler(exc, context):
    """
    Sab exceptions yahan se guzarti hain.
    - 4xx errors: clean message, no traceback to client
    - 5xx errors: full traceback server-side log, generic message to client
    """
    # Pehle DRF ka default handler try karo
    response = exception_handler(exc, context)

    # Request context log ke liye
    request = context.get('request')
    view = context.get('view')
    request_info = f"{request.method} {request.path}" if request else "unknown request"

    if isinstance(exc, Throttled):
        # Rate limit — 429
        wait = exc.wait
        msg = f"Too many requests. Please wait {int(wait)} seconds." if wait else "Too many requests."
        return Response(
            _build_error_payload(msg, "throttled"),
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    if isinstance(exc, (Http404, NotFound)):
        return Response(
            _build_error_payload("The requested resource was not found.", "not_found"),
            status=status.HTTP_404_NOT_FOUND
        )

    if isinstance(exc, (PermissionDenied, DRFPermissionDenied)):
        return Response(
            _build_error_payload("You do not have permission to perform this action.", "permission_denied"),
            status=status.HTTP_403_FORBIDDEN
        )

    if isinstance(exc, ValidationError):
        # Serializer validation errors — structured details milte hain
        logger.warning(f"Validation error on {request_info}: {exc.detail}")
        return Response(
            _build_error_payload("Invalid input.", "validation_error", details=exc.detail),
            status=status.HTTP_400_BAD_REQUEST
        )

    if isinstance(exc, DjangoValidationError):
        logger.warning(f"Django validation error on {request_info}: {exc.message}")
        return Response(
            _build_error_payload(exc.message if exc.message else "Validation failed.", "validation_error"),
            status=status.HTTP_400_BAD_REQUEST
        )

    if response is not None:
        # Other DRF-handled exceptions
        detail = response.data.get("detail", "") if isinstance(response.data, dict) else ""
        logger.warning(f"API exception on {request_info}: {exc}")
        response.data = _build_error_payload(str(detail) or str(exc), "error")
        return response

    # Unhandled / 5xx — server-side full traceback, generic message to client
    logger.error(
        f"Unhandled exception on {request_info} (view: {view.__class__.__name__ if view else 'unknown'}):\n"
        f"{traceback.format_exc()}"
    )
    return Response(
        _build_error_payload(
            "An internal server error occurred. Please try again later.",
            "internal_server_error"
        ),
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
