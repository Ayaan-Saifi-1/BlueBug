import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.core.models import HeadlineMetric, TechSkillMetric, WorkMixMetric, SprintPhaseMetric

def seed():
    print("Seeding metrics...")

    headlines = [
        {"label": "Projects Shipped", "target": 12, "suffix": "+", "order": 1},
        {"label": "Service Offerings", "target": 6, "suffix": "", "order": 2},
        {"label": "Client Satisfaction", "target": 100, "suffix": "%", "order": 3},
        {"label": "Years Building", "target": 3, "suffix": "+", "order": 4},
    ]
    for h in headlines:
        HeadlineMetric.objects.update_or_create(
            label=h["label"],
            defaults=h
        )

    skills = [
        {"skill_name": "Django", "score": 9.0, "order": 1},
        {"skill_name": "Next.js", "score": 8.0, "order": 2},
        {"skill_name": "React Native", "score": 7.0, "order": 3},
        {"skill_name": "PostgreSQL", "score": 9.0, "order": 4},
        {"skill_name": "Python", "score": 8.0, "order": 5},
        {"skill_name": "TypeScript", "score": 8.0, "order": 6},
        {"skill_name": "AI/ML", "score": 7.0, "order": 7},
    ]
    for s in skills:
        TechSkillMetric.objects.update_or_create(
            skill_name=s["skill_name"],
            defaults=s
        )

    work_mix = [
        {"category_name": "Web App", "percentage": 40, "color_hex": "#1481F8", "order": 1},
        {"category_name": "AI/ML", "percentage": 20, "color_hex": "#38bdf8", "order": 2},
        {"category_name": "PWA", "percentage": 20, "color_hex": "#6366f1", "order": 3},
        {"category_name": "Data", "percentage": 10, "color_hex": "#0ea5e9", "order": 4},
        {"category_name": "Healthcare", "percentage": 10, "color_hex": "#34D399", "order": 5},
    ]
    for w in work_mix:
        WorkMixMetric.objects.update_or_create(
            category_name=w["category_name"],
            defaults=w
        )

    sprints = [
        {"phase_name": "Discovery", "duration_weeks": 1.0, "order": 1},
        {"phase_name": "Design", "duration_weeks": 1.5, "order": 2},
        {"phase_name": "Build", "duration_weeks": 6.0, "order": 3},
        {"phase_name": "QA", "duration_weeks": 1.5, "order": 4},
        {"phase_name": "Ship", "duration_weeks": 0.5, "order": 5},
    ]
    for sp in sprints:
        SprintPhaseMetric.objects.update_or_create(
            phase_name=sp["phase_name"],
            defaults=sp
        )

    print("Successfully seeded all metrics!")

if __name__ == "__main__":
    seed()
