from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Lead

@admin.register(Lead)
class LeadAdmin(ModelAdmin):
    list_display = ('name', 'email', 'status', 'interested_service', 'created_at')
    list_filter = ('status', 'interested_service')
    search_fields = ('name', 'email')
