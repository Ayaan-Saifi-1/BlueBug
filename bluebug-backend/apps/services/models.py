from django.db import models

# apps/services/models.py
class ServiceOffering(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True)
    icon_name = models.CharField(max_length=100)  # lucide-react icon name, e.g. "code-2"
    short_description = models.CharField(max_length=280)
    full_description = models.TextField()
    proof_project = models.ForeignKey(
        "projects.Project", null=True, blank=True, on_delete=models.SET_NULL,
        help_text="Kaunsa project isko prove karta hai — 'See it in action' link ke liye"
    )
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order"]
