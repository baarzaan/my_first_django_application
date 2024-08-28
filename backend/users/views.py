from django.shortcuts import render, get_object_or_404
from .models import User
from .serializers import UserSerializer, UpdateUserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated

# View to list all users (for reference)
class UsersView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Custom JWT Token Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['username'] = user.username
        token['email'] = user.email
        if user.profile_pic and hasattr(user.profile_pic, 'url'):
            token['profile_pic'] = user.profile_pic.url

        return token

# Custom JWT Token View (if needed elsewhere)
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Register View to handle user registration and return custom JWT tokens
class RegisterView(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                user = serializer.save()

                # Generate tokens using the custom serializer
                refresh = RefreshToken.for_user(user)
                custom_token = MyTokenObtainPairSerializer.get_token(user)
                access_token = str(custom_token.access_token)

                tokens = {
                    'refresh': str(refresh),
                    'access': access_token,
                }

                # Construct the response data with user details
                response_data = {
                    'user' : {
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'username': user.username,
                        'email': user.email,
                        'profile_pic': user.profile_pic.url if user.profile_pic else None,
                    },
                    'tokens': tokens
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "data": None,
                "message": "Bad request"
            }, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            data = request.data
            print(data)
            user = request.user
            serializer = UpdateUserSerializer(user, data=data, partial=True)
            # print(serializer.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "data": None,
                "message": "Bad request"
            }, status=status.HTTP_400_BAD_REQUEST)