"""
Custom Unfold admin dashboard with lead analytics.
"""
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from apps.leads.models import Lead


def get_dashboard_context():
    """
    Returns analytics data for the admin dashboard.
    Called by the custom dashboard callback.
    """
    now = timezone.now()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    total_leads = Lead.objects.count()
    leads_this_week = Lead.objects.filter(created_at__gte=week_ago).count()
    leads_this_month = Lead.objects.filter(created_at__gte=month_ago).count()
    new_leads = Lead.objects.filter(status="new").count()

    # Most popular services
    service_breakdown = (
        Lead.objects.exclude(interested_service__isnull=True)
        .exclude(interested_service="")
        .values("interested_service")
        .annotate(count=Count("id"))
        .order_by("-count")[:5]
    )

    # Recent 5 leads
    recent_leads = Lead.objects.order_by("-created_at")[:5]

    return {
        "total_leads": total_leads,
        "leads_this_week": leads_this_week,
        "leads_this_month": leads_this_month,
        "new_leads": new_leads,
        "service_breakdown": list(service_breakdown),
        "recent_leads": recent_leads,
    }
