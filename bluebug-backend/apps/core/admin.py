from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import HeadlineMetric, TechSkillMetric, WorkMixMetric, SprintPhaseMetric

@admin.register(HeadlineMetric)
class HeadlineMetricAdmin(ModelAdmin):
    list_display = ('label', 'target', 'suffix', 'order', 'is_active')
    list_editable = ('target', 'suffix', 'order', 'is_active')
    search_fields = ('label',)
    list_filter = ('is_active',)


@admin.register(TechSkillMetric)
class TechSkillMetricAdmin(ModelAdmin):
    list_display = ('skill_name', 'score', 'order', 'is_active')
    list_editable = ('score', 'order', 'is_active')
    search_fields = ('skill_name',)
    list_filter = ('is_active',)


@admin.register(WorkMixMetric)
class WorkMixMetricAdmin(ModelAdmin):
    list_display = ('category_name', 'percentage', 'color_hex', 'order', 'is_active')
    list_editable = ('percentage', 'color_hex', 'order', 'is_active')
    search_fields = ('category_name',)
    list_filter = ('is_active',)


@admin.register(SprintPhaseMetric)
class SprintPhaseMetricAdmin(ModelAdmin):
    list_display = ('phase_name', 'duration_weeks', 'order', 'is_active')
    list_editable = ('duration_weeks', 'order', 'is_active')
    search_fields = ('phase_name',)
    list_filter = ('is_active',)
