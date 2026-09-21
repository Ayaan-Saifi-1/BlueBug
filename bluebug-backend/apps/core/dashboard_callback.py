"""
Unfold dashboard callback — returns context for the admin dashboard.
"""
from .dashboard import get_dashboard_context


def dashboard_callback(request, context):
    """
    Called by Unfold to populate the admin dashboard.
    """
    analytics = get_dashboard_context()
    context.update(analytics)
    return context
