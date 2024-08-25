from django.urls import path, include

urlpatterns = [
    path('blogs/', include('blog.urls')),
    path('users/', include('users.urls')),
]
