from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import TeamMember

@admin.register(TeamMember)
class TeamMemberAdmin(ModelAdmin):
    list_display = ('name', 'role', 'is_founder', 'display_order')
    list_filter = ('is_founder',)
