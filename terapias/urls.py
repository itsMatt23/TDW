from django.urls import path
from . import views

urlpatterns = [
    path('', views.terapia_paciente, name='terapia_paciente'),
    path('movimientos/<int:terapia_id>/', views.movimientos, name='movimientos'),
    path('movimientos/<int:terapia_id>/', views.movimientos, name='movimientos'),
    #path('actualizar_sesion/<int:sesion_id>/', views.actualizar_sesion, name='actualizar_sesion'),
    path('actualizar_sesiones/', views.actualizar_sesiones, name='actualizar_sesiones'),
]
