# serializers.py 

# ----------------------- imports ----------------------------
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import UserProfile, AuthorityProfile



# --------------------- User ---------------------------

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('phone', 'place')


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(
                queryset=User.objects.all(),
                message="This email is already in use."
            )]
            )
    username = serializers.CharField(
            required=True,
            max_length=32,
            validators=[UniqueValidator(
                queryset=User.objects.all(),
                message="This username is already in use."
            )]
            )
    password = serializers.CharField(
            required=True,
            min_length=8, 
            # write_only=True
            )

    def create(self, validated_data):
        
        # user = User(
        #     email=validated_data['email'],
        #     username=validated_data['username'], 
        # )
        # user.set_password(validated_data['password'])
        # user.save()

        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, **profile_data)
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'groups', 'profile', 'authority_profile')
        extra_kwargs = {'password': {'write_only': True}}

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        # Update user fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update profile fields
        profile.phone = profile_data.get('phone', profile.phone)
        profile.place = profile_data.get('place', profile.place)
        profile.save()

        return instance


# --------------------- Change password -------------------------
class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=50)
    new_password = serializers.CharField(max_length=50)
    confirm_password = serializers.CharField(max_length=50)

    def validate(self, data):
        
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError('New password and Confirm password do not match')
            
        return data


# ------------------------ Authority --------------------------
class AuthorityProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    verified = serializers.BooleanField()

    class Meta:
        model = AuthorityProfile
        fields = ('username', 'email', 'phone', 'place', 'department', 'license_no', 'verified')


class AuthoritySerializer(serializers.ModelSerializer):
    profile = AuthorityProfileSerializer()

    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="This email is already in use."
        )]
    )
    username = serializers.CharField(
        required=True,
        max_length=32,
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="This username is already in use."
        )]
    )
    password = serializers.CharField(
        required=True,
        min_length=8,
        write_only=True
    )

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(**validated_data)
        AuthorityProfile.objects.create(user=user, **profile_data)
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'profile')

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.authority_profile

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile.phone = profile_data.get('phone', profile.phone)
        profile.place = profile_data.get('place', profile.place)
        profile.department = profile_data.get('department', profile.department)
        profile.license_no = profile_data.get('license_no', profile.license_no)
        profile.verified = profile_data.get('verified', profile.verified)
        profile.save()

        return instance