from django.db import models
from django.contrib.auth.models import User

class Complaint(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.TextField()
    image = models.ImageField(upload_to='complaint_images/', blank=True, null=True)
    issue_with = models.CharField(max_length=50)
    issue_type = models.CharField(max_length=50)
    description = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    status = models.TextField(default='Issue reported')
    prediction = models.CharField(max_length=20, blank=True, null=True)  # Predicted class (good, satisfactory, poor, very_poor)
    resolved_image = models.ImageField(upload_to='complaint_resolved_images/', blank=True, null=True)


    def __str__(self):
        return self.location

