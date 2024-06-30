from rest_framework import serializers
from .models import AuthorityCalendarNote

class AuthorityCalendarNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorityCalendarNote
        fields = ['id', 'date', 'note']
