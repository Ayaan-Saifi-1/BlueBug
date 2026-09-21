from django.db import models

class TeamMember(models.Model):
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    bio_line = models.CharField(max_length=280, help_text="A concise bio line (no generic fluff)")
    photo = models.ImageField(upload_to="team/", blank=True, null=True, help_text="Upload founder portrait photo")
    github_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    is_founder = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order"]
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"

    def __str__(self):
        return f"{self.name} - {self.role}"
