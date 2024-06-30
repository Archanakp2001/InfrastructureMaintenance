# models.py 

from django.db import models
from django.contrib.auth.models import User

# ---------------------- User -------------------------
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=10)
    place = models.CharField(max_length=50)

    def __str__(self):
        return self.user.username


# ------------------------ Authority -------------------------
class AuthorityProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='authority_profile')
    phone = models.CharField(max_length=10)
    place = models.CharField(max_length=50)
    department = models.CharField(max_length=50)
    license_no = models.CharField(max_length=50)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username



