from django.contrib import admin
from .models import AuthorityCalendarNote

@admin.register(AuthorityCalendarNote)
class AuthorityCalendarNoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date', 'note')
    search_fields = ('date', 'user')
