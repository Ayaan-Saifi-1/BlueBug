from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class HeadlineMetric(models.Model):
    """
    Headline counter stats displayed on the homepage and about page
    (e.g., 'Projects Shipped', '12', '+').
    """
    label = models.CharField(max_length=100, help_text="Metric label, e.g. Projects Shipped")
    target = models.IntegerField(help_text="Numerical counter target value, e.g. 12")
    suffix = models.CharField(max_length=20, blank=True, default="", help_text="Suffix symbol, e.g. '+', '%'")
    order = models.PositiveIntegerField(default=0, help_text="Display order sequence")
    is_active = models.BooleanField(default=True, help_text="Whether this metric is displayed on the site")

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Headline Metric"
        verbose_name_plural = "Headline Metrics"

    def __str__(self):
        return f"{self.label}: {self.target}{self.suffix}"


class TechSkillMetric(models.Model):
    """
    Technology depth skills displayed on the Plotly radar chart.
    """
    skill_name = models.CharField(max_length=100, help_text="Technology or domain name, e.g. Django, Next.js, AI/ML")
    score = models.FloatField(
        default=8.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)],
        help_text="Proficiency/Depth score out of 10.0 (e.g. 9.0)"
    )
    order = models.PositiveIntegerField(default=0, help_text="Display order around the radar")
    is_active = models.BooleanField(default=True, help_text="Whether to include in the radar chart")

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Tech Skill Metric (Radar)"
        verbose_name_plural = "Tech Skill Metrics (Radar)"

    def __str__(self):
        return f"{self.skill_name} ({self.score}/10)"


class WorkMixMetric(models.Model):
    """
    Work breakdown percentages displayed on the Plotly donut chart.
    """
    category_name = models.CharField(max_length=100, help_text="Category name, e.g. Web App, AI/ML, PWA")
    percentage = models.PositiveIntegerField(
        default=20,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Share percentage or relative weight (e.g. 40)"
    )
    color_hex = models.CharField(
        max_length=20,
        blank=True,
        default="",
        help_text="Hex color code (e.g. #1481F8). Leave blank for default palette."
    )
    order = models.PositiveIntegerField(default=0, help_text="Display order sequence")
    is_active = models.BooleanField(default=True, help_text="Whether to include in donut chart")

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Work Mix Category (Donut)"
        verbose_name_plural = "Work Mix Categories (Donut)"

    def __str__(self):
        return f"{self.category_name} ({self.percentage}%)"


class SprintPhaseMetric(models.Model):
    """
    Average sprint timeline durations displayed on the Plotly bar chart.
    """
    phase_name = models.CharField(max_length=100, help_text="Phase label, e.g. Discovery, Design, Build")
    duration_weeks = models.FloatField(
        default=1.0,
        validators=[MinValueValidator(0.1)],
        help_text="Average duration in weeks (e.g. 1.5, 6.0)"
    )
    order = models.PositiveIntegerField(default=0, help_text="Timeline sequence order")
    is_active = models.BooleanField(default=True, help_text="Whether to include in the bar chart")

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Sprint Phase (Bar Chart)"
        verbose_name_plural = "Sprint Phases (Bar Chart)"

    def __str__(self):
        return f"{self.phase_name}: {self.duration_weeks}w"
