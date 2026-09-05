from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import Project, ProjectImage, Testimonial

class ProjectImageInline(TabularInline):
    model = ProjectImage
    extra = 1

@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = ('title', 'category', 'status', 'is_featured', 'display_order')
    list_filter = ('category', 'status', 'is_featured')
    search_fields = ('title', 'tagline')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProjectImageInline]

@admin.register(Testimonial)
class TestimonialAdmin(ModelAdmin):
    list_display = ('client_name', 'project', 'is_published')
    list_filter = ('is_published',)
    search_fields = ('client_name', 'quote')
