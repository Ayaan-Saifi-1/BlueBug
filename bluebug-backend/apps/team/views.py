from rest_framework import generics
from .models import TeamMember
from .serializers import TeamMemberSerializer

class TeamList(generics.ListAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
