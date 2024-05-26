from django.urls import path
from . import views

urlpatterns = [
    path('', views.gestion_paciente, name='gestion_paciente'),
]
