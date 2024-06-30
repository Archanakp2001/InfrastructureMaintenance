from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, AuthorityProfile

# Register your models here.
admin.site.unregister(User) # Necessary

class UserProfileInline(admin.TabularInline):
    model = UserProfile
    fields = ('phone', 'place')
    extra = 1

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    model = UserProfile
    list_display = ('user', 'phone', 'place')

@admin.register(AuthorityProfile)
class AuthorityProfileAdmin(admin.ModelAdmin):
    model = AuthorityProfile
    list_display = ('user', 'phone', 'place', 'department', 'license_no', 'verified')
    actions = ['approve_profiles', 'disapprove_profiles']

    def approve_profiles(self, request, queryset):
        queryset.update(verified=True)

    def disapprove_profiles(self, request, queryset):
        queryset.update(verified=False)
