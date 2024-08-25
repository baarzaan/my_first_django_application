from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'profile_pic', 'password', 'created_at', 'last_login']
        read_only_fields = ['created_at', 'last_login']

    def create(self, validated_data):
        user = User.objects.create(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            email=validated_data['email'],
            profile_pic=validated_data.get('profile_pic')
        )
        user.set_password(validated_data['password'])
        user.save()

        return user
