"""
Project views — all read-only, paginated, filtered.
Queries are optimized with prefetch/select_related to avoid N+1 problem.
"""
import logging
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from .models import Project, Testimonial
from .serializers import ProjectListSerializer, ProjectDetailSerializer, TestimonialSerializer

logger = logging.getLogger('apps.projects')

VALID_CATEGORIES = ['web', 'pwa', 'ai_ml', 'data', 'healthcare']


class ProjectList(generics.ListAPIView):
    """
    GET /api/projects/
    ?category=web|pwa|ai_ml|data|healthcare
    ?featured=true
    Paginated: PAGE_SIZE defined in base.py REST_FRAMEWORK settings.
    """
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        queryset = Project.objects.all()
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')

        if category:
            # Invalid category params ko silently ignore nahi karte — 400 dete hain
            if category not in VALID_CATEGORIES:
                raise ValidationError(
                    {"error": f"Invalid category '{category}'. Valid choices: {VALID_CATEGORIES}"}
                )
            queryset = queryset.filter(category=category)

        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)

        return queryset


class ProjectDetail(generics.RetrieveAPIView):
    """
    GET /api/projects/<slug>/
    Full case study data — gallery images aur testimonials bhi include hain.
    prefetch_related se N+1 queries avoid ki hain.
    """
    serializer_class = ProjectDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        # gallery_images aur testimonials prefetch karo — separate queries nahi chahiye
        return Project.objects.prefetch_related(
            'gallery_images',
            'testimonials'
        ).all()


class TestimonialList(generics.ListAPIView):
    """
    GET /api/testimonials/
    Sirf published testimonials — is_published=False waale kabhi expose nahi hote.
    Server-side filter enforce hota hai — client-side bypass impossible.
    """
    serializer_class = TestimonialSerializer

    def get_queryset(self):
        return Testimonial.objects.filter(is_published=True).select_related('project')
