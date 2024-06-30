from rest_framework import serializers
from .models import Complaint
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  
        

class ComplaintSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = Complaint
        fields = '__all__'
        # fields = ['id', 'location', 'image', 'video', 'issue_with', 'issue_type', 'description', 'created_at', 'status']

    