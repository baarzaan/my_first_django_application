from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from django.http import HttpResponse
from .serializers import BlogSerializer, CommentSerializer, LikeSerializer
from .models import Blog, Comment, Like
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class BlogsView(APIView):
    def get(self, request):
        blogs = Blog.objects.all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateBlogView(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = BlogSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'data': serializer.data,
                    'message': 'Blog created',
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({
                'data': None,
                'message': "Bad request",
            }, status=status.HTTP_400_BAD_REQUEST)

class UpdateBlogView(APIView):
    def patch(self, request, pk):
        try:
            instance = get_object_or_404(Blog, pk=pk)
            data = request.data
            serializer = BlogSerializer(instance, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()   
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({
                'data': None,
                'message': "Bad request",
            }, status=status.HTTP_400_BAD_REQUEST)

class DeleteBlogView(APIView):
    def delete(self, request, pk):
        try:
            data = get_object_or_404(Blog, pk=pk)
            data.delete()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({
                'data': None,
                'message': "Bad request",
            }, status=status.HTTP_400_BAD_REQUEST)
        
class CommentsView(APIView):
    def get(self, request):
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateCommentView(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = CommentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # print(e)
            return Response({
                'data': None,
                'message': 'Comment not created!'
            }, status=status.HTTP_400_BAD_REQUEST)
        
class UpdateCommentView(APIView):
    def patch(self, request, pk):
        try:
            comment = get_object_or_404(Comment, pk=pk)
            serializer = CommentSerializer(comment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status.HTTP_200_OK)
            
        except Exception as e:
            # print(e)
             return Response({
                'data': None,
                'message': 'Comment not updated!'
            }, status=status.HTTP_400_BAD_REQUEST)
        
class DeleteCommentView(APIView):
    def delete(self, request, pk):
        try:
            comment = get_object_or_404(Comment, pk=pk)
            comment.delete()
            return Response({
                'message': 'Comment deleted successfully!'
            }, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response({
                'data': None,
                'message': 'Comment not deleted!'
            }, status=status.HTTP_400_BAD_REQUEST)
        
class LikesView(APIView):
    def get(self, request):
        likes = Like.objects.all()
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AddLikeView(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = LikeSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'data': None,
                'message': 'Like not added!'
            }, status=status.HTTP_400_BAD_REQUEST)
        
class DeleteLikeView(APIView):
    def delete(self, request, pk):
        try:
            like = get_object_or_404(Like, pk=pk)
            like.delete()
            return Response({
                'data': 'Success',
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'data': None,
                'message': 'Like not deleted!'
            }, status=status.HTTP_400_BAD_REQUEST)