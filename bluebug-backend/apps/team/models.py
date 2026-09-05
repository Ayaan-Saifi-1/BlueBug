from django.db import models

# apps/team/models.py
class TeamMember(models.Model):
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    bio_line = models.CharField(max_length=280)  # ek honest line, generic fluff nahi
    photo = models.ImageField(upload_to="team/")
    is_founder = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order"]
