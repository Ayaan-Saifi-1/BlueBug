from rest_framework import generics
from .models import ServiceOffering
from .serializers import ServiceOfferingSerializer

class ServiceList(generics.ListAPIView):
    queryset = ServiceOffering.objects.all()
    serializer_class = ServiceOfferingSerializer
