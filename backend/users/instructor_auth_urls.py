# users/instructor_auth_urls.py
from django.urls import path
from . import instructor_auth_views

urlpatterns = [
    path('login/', instructor_auth_views.instructor_login, name='instructor_login'),
    path('info/', instructor_auth_views.instructor_info, name='instructor_info'),
]
