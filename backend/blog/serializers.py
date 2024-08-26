from rest_framework import serializers
from .models import Blog, Comment, Like
from django.contrib.auth import get_user_model

User = get_user_model()

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'profile_pic']

class BlogSerializer(serializers.ModelSerializer):
    author = UserInfoSerializer(read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'created_at', 'updated_at', 'author', 'title', 'body', 'image']
        read_only_fields = ['id', 'created_at', 'updated_at']

class CommentSerializer(serializers.ModelSerializer):
    author = UserInfoSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'created_at', 'updated_at', 'author', 'blog', 'body', 'image']
        read_only_fields = ['id', 'created_at', 'updated_at']

class LikeSerializer(serializers.ModelSerializer):
    user = UserInfoSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'created_at', 'updated_at', 'user', 'blog']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        user = self.context['request'].user
        if user.is_anonymous:
            raise serializers.ValidationError("User must be authenticated.")
        blog = attrs['blog']

        if Like.objects.filter(user=user, blog=blog).exists():
            raise serializers.ValidationError("You have already liked this blog.")
        return attrs