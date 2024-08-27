from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from django.http import HttpResponse
from .serializers import BlogSerializer, CommentSerializer, LikeSerializer
from .models import Blog, Comment, Like
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

# Create your views here.
class BlogsView(APIView):
    def get(self, request):
        blogs = Blog.objects.all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateBlogView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            serializer = BlogSerializer(data=data)
            print(data)
            if serializer.is_valid():
                serializer.save(author=request.user)
                return Response({
                    'data': serializer.data,
                    'message': 'Blog created',
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'data': None,
                    'message': 'Invalid data'
                }, status=status.HTTP_400_BAD_REQUEST)
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
                serializer.save(author=request.user)   
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({
                'data': None,
                'message': "Bad request",
            }, status=status.HTTP_400_BAD_REQUEST)

class DeleteBlogView(APIView):
    permissions_classes = [IsAuthenticated]

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

""" class CreateCommentView(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = CommentSerializer(data=data)
            print(serializer)
            if serializer.is_valid():
                serializer.save(author=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # print(e)
            return Response({
                'data': None,
                'message': 'Comment not created!'
            }, status=status.HTTP_400_BAD_REQUEST) """

class CreateCommentView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permissions_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
class UpdateCommentView(APIView):
    def patch(self, request, pk):
        try:
            comment = get_object_or_404(Comment, pk=pk)
            data = request.data
            data['author'] = request.user.id # Set the author to the currently authenticated user
            serializer = CommentSerializer(comment, data=data, partial=True)
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
    permission_classes = [IsAuthenticated]

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

class LikeBlogView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, blog_id):
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Create a dictionary with the blog and user data
        data = {
            'user': request.user.id,  # Correctly set the user to the current authenticated user
            'blog': blog.id  # Set the blog field to the blog ID
        }
        
        serializer = LikeSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save(user=request.user)  # Pass the user explicitly during save
            return Response({"message": "Blog liked"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, blog_id):
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found."}, status=status.HTTP_404_NOT_FOUND)

        like = Like.objects.filter(user=request.user, blog=blog).first()

        if like:
            like.delete()
            return Response({"message": "Blog unliked."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Like not found."}, status=status.HTTP_404_NOT_FOUND)