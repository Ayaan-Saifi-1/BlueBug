"""
API URL configuration for BlueBug backend.
Yahan sab API endpoints register hain — health check se le kar projects tak.
"""
from django.urls import path

from apps.projects.views import ProjectList, ProjectDetail, TestimonialList
from apps.services.views import ServiceList
from apps.team.views import TeamList
from apps.leads.views import LeadCreate
from apps.core.views import health_check

urlpatterns = [
    # Health check — uptime monitor ke liye, DB connectivity test karta hai
    path('health/', health_check, name='health-check'),

    # Projects — public read only
    path('projects/', ProjectList.as_view(), name='project-list'),
    path('projects/<slug:slug>/', ProjectDetail.as_view(), name='project-detail'),

    # Testimonials — sirf published waale
    path('testimonials/', TestimonialList.as_view(), name='testimonial-list'),

    # Services — public read only
    path('services/', ServiceList.as_view(), name='service-list'),

    # Team — public read only
    path('team/', TeamList.as_view(), name='team-list'),

    # Leads — rate limited POST only, no GET
    path('leads/', LeadCreate.as_view(), name='lead-create'),
]
