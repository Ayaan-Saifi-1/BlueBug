from rest_framework import serializers
from .models import ServiceOffering

class ServiceOfferingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceOffering
        fields = '__all__'
