# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status, viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import RetrieveAPIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser


from .models import UserProfile
from .serializers import UserSerializer, PasswordChangeSerializer, AuthoritySerializer, AuthorityProfileSerializer, UserProfileSerializer


# -------------------------- User Signup -----------------------------
class UserCreate(APIView):
    """
    Creates the user
    """
    permission_classes = (AllowAny,)
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token = Token.objects.create(user=user)
                json = serializer.data
                json['token'] = token.key
                return Response(json, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------- Token creation ---------------------------------
class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        if hasattr(user, 'authority_profile'):
            authority_profile = user.authority_profile
            if authority_profile.verified:
                data = {
                    'token': token.key,
                    'user': AuthorityProfileSerializer(authority_profile).data
                }
                return Response(data)
            else:
                return Response({'error': 'Authority not verified by admin'}, status=status.HTTP_403_FORBIDDEN)
        else:
            data = {
                'token': token.key,
                'user': UserSerializer(user).data
            }
            return Response(data)
        


# ----------------------------- Get user details ------------------------------
class UserProfileView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all().order_by('id')
    serializer_class = UserSerializer


# --------------------- To update profile ------------------------------
class UpdateUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------- Change password ----------------------------

@method_decorator(csrf_exempt, name='dispatch')
class PasswordChangeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']
            

            # Check if the old password is correct
            if not user.check_password(old_password):
                return Response({"error":"Old Password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Change the password
            user.set_password(new_password)
            user.save()
            return Response({"message":"Password changed succesfully"}, status=status.HTTP_200_OK)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------- Authority create --------------------------
class AuthorityCreate(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format='json'):
        serializer = AuthoritySerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token = Token.objects.create(user=user)
                json = serializer.data
                json['token'] = token.key
                return Response(json, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------- Get Authority details -------------------------
class AuthorityProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            authority_profile = request.user.authority_profile
            serializer = AuthorityProfileSerializer(authority_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AuthorityProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)


# --------------------- Update Authority profile -------------------------
class UpdateAuthorityProfile(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = AuthoritySerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthorityApproval(APIView):
    permission_classes = (IsAdminUser,)

    def post(self, request, authority_id, format=None):
        try:
            authority = AuthorityProfile.objects.get(id=authority_id)
            authority.is_approved = True
            authority.save()
            return Response({'message': 'Authority approved successfully'}, status=status.HTTP_200_OK)
        except AuthorityProfile.DoesNotExist:
            return Response({'error': 'Authority not found'}, status=status.HTTP_404_NOT_FOUND)