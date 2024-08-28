from django.urls import path
from .views import UsersView, RegisterView, MyTokenObtainPairView, UpdateUserView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', UsersView.as_view(), name="users"),
    path('register/', RegisterView.as_view(), name="register"),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('update-user/', UpdateUserView.as_view(), name='update-user'),
]