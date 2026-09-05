import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.projects.models import Project

def seed():
    Project.objects.get_or_create(
        slug="studioikonic",
        defaults={
            "title": "StudioIkonic",
            "tagline": "Portfolio website for Iconic.Design, an interior design company.",
            "category": "web",
            "status": "live",
            "live_url": "https://studioikonic.co",
            "github_url": "https://github.com/Ayaan-Saifi-1/Iconic.Design",
            "is_featured": True,
            "problem_statement": "The client needed a highly visual, aesthetic portfolio to showcase their interior design work.",
            "approach": "Built a custom Next.js frontend with smooth animations to emphasize the visual assets.",
            "key_features": ["High-performance image galleries", "Custom scroll animations", "Responsive mobile experience"],
            "tech_stack": ["Next.js", "React", "Framer Motion", "Tailwind CSS"],
            "display_order": 1,
        }
    )
    print("Seeded StudioIkonic")

if __name__ == '__main__':
    seed()
