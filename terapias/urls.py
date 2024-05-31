from django.urls import path
from . import views

urlpatterns = [
    path('/menu/', views.terapia_paciente, name='terapia_paciente'),
    path('/<str:cedula>', views.gestion_paciente, name='gestion_paciente'),

    path('movimientos/<int:terapia_id>/', views.movimientos, name='movimientos'),
    path('movimientos/<int:terapia_id>/', views.movimientos, name='movimientos'),
    path('actualizar_sesiones/', views.actualizar_sesiones, name='actualizar_sesiones'),
    path('/pacientes/', views.pacientes, name='pacientes'),

    path('/movimientos/editar/', views.gestion_movimiento, name='gestion_movimiento'),
]
