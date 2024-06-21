from django.urls import path
from . import views

urlpatterns = [
    path('', views.procesar_vista2, name='principal'),
]
