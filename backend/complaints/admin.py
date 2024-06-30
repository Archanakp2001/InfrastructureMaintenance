from django.contrib import admin
from .models import Complaint

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'location', 'image', 'issue_with', 'issue_type', 'description', 'created_at', 'status', 'prediction', 'resolved_image')
    search_fields = ('location', 'issue_with', 'issue_type', 'status')
