from rest_framework import serializers
from .models import HeadlineMetric, TechSkillMetric, WorkMixMetric, SprintPhaseMetric

class HeadlineMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeadlineMetric
        fields = ['id', 'label', 'target', 'suffix', 'order']


class TechSkillMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechSkillMetric
        fields = ['id', 'skill_name', 'score', 'order']


class WorkMixMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkMixMetric
        fields = ['id', 'category_name', 'percentage', 'color_hex', 'order']


class SprintPhaseMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = SprintPhaseMetric
        fields = ['id', 'phase_name', 'duration_weeks', 'order']
