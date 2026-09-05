from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import ServiceOffering

@admin.register(ServiceOffering)
class ServiceOfferingAdmin(ModelAdmin):
    list_display = ('title', 'icon_name', 'display_order')
    prepopulated_fields = {'slug': ('title',)}
