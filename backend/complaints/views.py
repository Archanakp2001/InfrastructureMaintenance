from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Complaint
from .serializers import ComplaintSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all().order_by('-created_at')
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_specific = self.request.query_params.get('user_specific', 'false').lower()
        if user_specific == 'true':
            return Complaint.objects.filter(user=self.request.user)
        return Complaint.objects.all()
    

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UpdateComplaintStatus(APIView):
    def post(self, request, complaint_id):
        # Get the complaint object
        try:
            complaint = Complaint.objects.get(id=complaint_id)
        except Complaint.DoesNotExist:
            return Response({"error": "Complaint not found"}, status=status.HTTP_404_NOT_FOUND)

        # Update the status
        new_status = request.data.get('status', None)
        if new_status:
            complaint.status = new_status

        # Handle the resolved image upload
        if 'resolved_image' in request.FILES:
            complaint.resolved_image = request.FILES['resolved_image']

        complaint.save()
        return Response({"success": "Status updated successfully"}, status=status.HTTP_200_OK)
        

        
# ------------------------ ML Model -------------------------
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from rest_framework.decorators import api_view
import tensorflow as tf
import numpy as np
import io

# Load your trained Keras model
model_path = r'D:\Workspace\mainProject\backend\complaints\road_damage_classification_model_new.h5'
model = load_model(model_path)

# Define class labels
class_labels = ['good', 'satisfactory', 'poor', 'very_poor']

@api_view(['POST'])
def predict_complaint(request):
    if request.method == 'POST':
        serializer = ComplaintSerializer(data=request.data)
        if serializer.is_valid():
            complaint = serializer.save(user=request.user)

            # Process image for prediction
            img = tf.keras.preprocessing.image.load_img(complaint.image.path, target_size=(128, 128))
            img_array = tf.keras.preprocessing.image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0) / 255.0

            # Make prediction
            predictions = model.predict(img_array)
            predicted_class_index = np.argmax(predictions)
            predicted_class = class_labels[predicted_class_index]

            # Log the prediction
            print(f"Predictions: {predictions}")
            print(f"Predicted class index: {predicted_class_index}")
            print(f"Predicted class: {predicted_class}")

            # Save predicted class to complaint
            complaint.prediction = predicted_class
            complaint.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)