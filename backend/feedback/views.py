from rest_framework import viewsets, permissions
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework.permissions import IsAuthenticated

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_specific = self.request.query_params.get('user_specific', 'false').lower()
        if user_specific == 'true':
            return Feedback.objects.filter(user=self.request.user)
        return Feedback.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
