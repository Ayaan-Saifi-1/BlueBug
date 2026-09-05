"""
Lead serializer — yahan saari validation hoti hai.
Server-side validation ALWAYS required, client-side par kabhi trust mat karo.
"""
import re
import html
from rest_framework import serializers
from .models import Lead

# Service choices se match karna chahiye frontend ke dropdown se
VALID_SERVICES = [
    "web", "app", "pwa", "ai_ml", "data", "healthcare", ""
]


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['name', 'email', 'phone', 'message', 'interested_service', 'source_page']

    def validate_name(self, value):
        # Strip extra whitespace
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        if len(value) > 150:
            raise serializers.ValidationError("Name must be at most 150 characters long.")
        # Basic sanity — no HTML/script tags
        if re.search(r'<[^>]+>', value):
            raise serializers.ValidationError("Name contains invalid characters.")
        return html.escape(value)

    def validate_email(self, value):
        # Django ka built-in EmailField validate karta hai, but extra lowercase normalize
        return value.strip().lower()

    def validate_phone(self, value):
        if value:
            value = value.strip()
            # Sirf digits, spaces, +, -, () allow karo
            if not re.match(r'^[0-9\s\+\-\(\)]{7,20}$', value):
                raise serializers.ValidationError("Phone number contains invalid characters.")
        return value

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        if len(value) > 3000:
            raise serializers.ValidationError("Message cannot exceed 3000 characters.")
        # Basic XSS strip — script tags nahi chahiye
        if re.search(r'<script', value, re.IGNORECASE):
            raise serializers.ValidationError("Message contains invalid content.")
        return value

    def validate_interested_service(self, value):
        if value and value not in VALID_SERVICES:
            raise serializers.ValidationError(f"Invalid service choice: '{value}'.")
        return value

    def validate_source_page(self, value):
        # Source page — bas 200 char, nothing dangerous
        if value:
            return value.strip()[:200]
        return value
