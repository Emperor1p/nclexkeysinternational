from django.urls import path
from . import views

urlpatterns = [
    # Admin endpoints
    path('codes/', views.RegistrationCodeListCreateView.as_view(), name='registration-code-list-create'),
    path('codes/<str:code>/', views.RegistrationCodeDetailView.as_view(), name='registration-code-detail'),
    path('generate/', views.generate_codes, name='generate-codes'),
    
    # Public endpoints
    path('validate/', views.validate_registration_code, name='validate-registration-code'),
    path('use/', views.use_registration_code, name='use-registration-code'),
]
