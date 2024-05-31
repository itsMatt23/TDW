from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('/menu/', views.terapia_paciente, name='terapia_paciente'),
    path('/<str:cedula>/', views.gestion_paciente, name='gestion_paciente'),
    path('movimientos/<int:terapia_id>/', views.movimientos, name='movimientos'),
    path('actualizar_sesiones/', views.actualizar_sesiones, name='actualizar_sesiones'),
    path('pacientes/', views.pacientes, name='pacientes'),
    path('/movimientos/editar/', views.gestion_movimiento, name='gestion_movimiento'),
    path('index/', views.index_view, name='index'),  # no cambiar
    path('TerapeutaOpciones/', views.TerapeutaOpciones_view, name='TerapeutaOpciones'),
    path('terapia_paciente/', views.terapia_paciente, name='terapia_paciente'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('logout/', views.logout_view, name='logout'),  # no cambiar
    path('fisioterapeutas/', views.fisioterapeutas_view, name='fisioterapeutas'),
]

