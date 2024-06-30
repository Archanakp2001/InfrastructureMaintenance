# urls.py

"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from login.views import UserCreate, CustomObtainAuthToken, UserProfileView, UserProfileViewSet, UpdateUserProfile, PasswordChangeAPIView, AuthorityCreate, AuthorityProfileView, UpdateAuthorityProfile, AuthorityApproval
from complaints.views import ComplaintViewSet, UpdateComplaintStatus, predict_complaint
from feedback.views import FeedbackViewSet
from calendarnote.views import AuthorityCalendarNoteViewSet

router = DefaultRouter()
router.register(r'users', UserProfileViewSet, basename='user')
router.register(r'complaints', ComplaintViewSet, basename='complaint')
router.register(r'feedbacks', FeedbackViewSet, basename='feedback')
router.register(r'authority-calendar-notes', AuthorityCalendarNoteViewSet, basename='authority-calendar-note')

user_list = UserProfileViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-token-auth/', CustomObtainAuthToken.as_view(), name='api_token_auth'),
    
    path('create-user/', UserCreate.as_view(), name='account-create'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('update-profile/', UpdateUserProfile.as_view(), name='update-profile'),
    path('api/password/change/', PasswordChangeAPIView.as_view(), name='password_change'),

    path('signup-authority/', AuthorityCreate.as_view(), name='signup-authority'),
    path('authority-profile/', AuthorityProfileView.as_view(), name='authority-profile'),
    path('authority-update/', UpdateAuthorityProfile.as_view(), name='authority-update'),
    path('api/authority/<int:authority_id>/approve/', AuthorityApproval.as_view(), name='authority-approval'),

    path('api/', include(router.urls)),
    path('api/complaints/<int:complaint_id>/update_status/', UpdateComplaintStatus.as_view(), name='update_complaint_status'),
    path('api/predict_complaint/', predict_complaint, name='predict_complaint'),

    path('api/authority-calendar-notes/<str:date>/', AuthorityCalendarNoteViewSet.as_view({'delete': 'destroy_by_date'}), name='delete_authority_calendar_note'),
    # path('api/users/', user_list, name='user_list_api'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


