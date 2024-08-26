from django.urls import path
from .views import BlogsView, CreateBlogView, UpdateBlogView, DeleteBlogView, CommentsView, CreateCommentView, UpdateCommentView, DeleteCommentView, LikesView, AddLikeView, LikeBlogView

urlpatterns = [
    path("", BlogsView.as_view(), name="blogs"),
    path("create-blog/", CreateBlogView.as_view(), name="create-blog"),
    path("update-blog/<str:pk>/", UpdateBlogView.as_view(), name="update-blog"),
    path("delete-blog/<str:pk>/", DeleteBlogView.as_view(), name="delete-blog"),
    path("comments/", CommentsView.as_view(), name="comments"),
    path("create-comment/", CreateCommentView.as_view(), name="create-comment"),
    path("update-comment/<str:pk>/", UpdateCommentView.as_view(), name="update-comment"),
    path("delete-comment/<str:pk>/", DeleteCommentView.as_view(), name="delete-comment"),
    path("blog/<str:blog_id>/like", LikeBlogView.as_view(), name="like-blog"),
    path("likes/", LikesView.as_view(), name="likes"),
    path("add-like/", AddLikeView.as_view(), name="add-like"),
]