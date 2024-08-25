from rest_framework.serializers import ModelSerializer
from .models import Blog, Comment, Like

class BlogSerializer(ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'created_at', 'updated_at', 'author', 'title', 'body', 'image']
        read_only_fields = ['id', 'created_at', 'updated_at']

class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'created_at', 'updated_at', 'author', 'blog', 'body', 'image']
        read_only_fields = ['id', 'created_at', 'updated_at']

class LikeSerializer(ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'created_at', 'updated_at', 'author', 'blog']
        read_only_fields = ['id', 'created_at', 'updated_at']