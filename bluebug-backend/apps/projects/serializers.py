from rest_framework import serializers
from .models import Project, ProjectImage, Testimonial

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'caption', 'order']

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'client_name', 'client_role', 'client_company', 'quote', 'client_photo']

class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'slug', 'tagline', 'category', 'status', 'live_url', 'github_url', 'cover_image', 'is_featured']

class ProjectDetailSerializer(serializers.ModelSerializer):
    gallery_images = ProjectImageSerializer(many=True, read_only=True)
    testimonials = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_testimonials(self, obj):
        qs = obj.testimonials.filter(is_published=True)
        return TestimonialSerializer(qs, many=True).data
