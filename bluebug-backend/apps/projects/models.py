# apps/projects/models.py
# ---------------------------------------------------------------
# Yaha par sab projects ka data store hota hai. Naya project 
# add karna ho to bas Django admin se karo, code touch mat karo.
# ---------------------------------------------------------------

from django.db import models
from django.utils.text import slugify
from apps.core.validators import validate_image_file


class Project(models.Model):
    CATEGORY_CHOICES = [
        ("web", "Web App"),
        ("pwa", "PWA"),
        ("ai_ml", "AI/ML"),
        ("data", "Data Engineering"),
        ("healthcare", "Healthcare / Institutional System"),
    ]
    STATUS_CHOICES = [
        ("live", "Live"),
        ("in_progress", "In Progress"),
        ("archived", "Archived"),
    ]

    title = models.CharField(max_length=200)
    # slug ek baar set ho jaye to change nahi karna, warna purane links tut jayenge
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    tagline = models.CharField(max_length=280)  # ek line ka hook
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="live")

    problem_statement = models.TextField()
    approach = models.TextField()
    key_features = models.JSONField(default=list, blank=True)   # list of strings
    tech_stack = models.JSONField(default=list, blank=True)      # e.g. ["Django", "React"]
    # agar nahi pata to blank hi rehne do, kabhi fake mat likhna
    outcome = models.TextField(blank=True, null=True)

    live_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    demo_video_url = models.URLField(blank=True, null=True)

    # cover_image pe size + type validation — neeche validate_image_file dekho
    cover_image = models.ImageField(
        upload_to="projects/covers/",
        validators=[validate_image_file]
    )

    team_credit = models.CharField(max_length=300, blank=True, null=True)

    is_featured = models.BooleanField(default=False)   # home page bento grid ke liye
    display_order = models.PositiveIntegerField(default=0)  # manual sorting control

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-created_at"]

    def save(self, *args, **kwargs):
        # slug ek baar set ho jaye to change nahi karna, warna purane links tut jayenge
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    # ek project ki multiple gallery images — cover_image se alag
    project = models.ForeignKey(Project, related_name="gallery_images", on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to="projects/gallery/",
        validators=[validate_image_file]
    )
    caption = models.CharField(max_length=200, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.project.title} — image {self.order}"


class Testimonial(models.Model):
    # optional hai — jab tak client testimonial na mile, ye table khali reh sakta hai
    project = models.ForeignKey(
        Project, related_name="testimonials", on_delete=models.SET_NULL, null=True, blank=True
    )
    client_name = models.CharField(max_length=150)
    client_role = models.CharField(max_length=150, blank=True, null=True)
    client_company = models.CharField(max_length=150, blank=True, null=True)
    quote = models.TextField()
    client_photo = models.ImageField(
        upload_to="testimonials/", blank=True, null=True,
        validators=[validate_image_file]
    )
    # draft rakh sakte ho jab tak client review na ho jaye
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.client_name} ({self.project})"
