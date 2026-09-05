from django.db import models

# apps/leads/models.py
class Lead(models.Model):
    # ---------------------------------------------------------------
    # Ye humara mini-CRM hai. Har contact form submission yahan aata hai.
    # Kabhi bhi is table ko public expose mat karna kisi bhi API me.
    # ---------------------------------------------------------------
    STATUS_CHOICES = [
        ("new", "New"),
        ("contacted", "Contacted"),
        ("closed", "Closed"),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField()
    interested_service = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    source_page = models.CharField(max_length=200, blank=True, null=True)  # kis page se aaya
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
