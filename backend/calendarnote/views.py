from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import AuthorityCalendarNote
from .serializers import AuthorityCalendarNoteSerializer

class AuthorityCalendarNoteViewSet(viewsets.ViewSet):
    queryset = AuthorityCalendarNote.objects.all()
    serializer_class = AuthorityCalendarNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AuthorityCalendarNote.objects.filter(user=self.request.user)

    def create(self, request):
        serializer = AuthorityCalendarNoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        notes = self.get_queryset()
        serializer = AuthorityCalendarNoteSerializer(notes, many=True)
        response_data = {
            "notes": serializer.data  # wrapping the list in a dictionary
        }
        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path='(?P<date>[^/.]+)')
    def destroy_by_date(self, request, date=None):
        try:
            note = AuthorityCalendarNote.objects.get(date=date, user=request.user)
            note.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except AuthorityCalendarNote.DoesNotExist:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)