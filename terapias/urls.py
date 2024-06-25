from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('/menu/', views.terapia_paciente, name='terapia_paciente'),

    path('/<str:cedula>/', views.gestion_paciente, name='gestion_paciente'),

    path('rehabilitacion_paciente/', views.rehabilitacion_paciente, name='rehabilitacion_paciente'), ##Esta es la nueva vista de rehabilitaciones
    path('terapias/<int:rehabilitacion_id>/', views.terapias, name='terapias'), ##Esta es la nueva vista de terapias
    
    path('movimientos/<int:terapia_id>/', views.movimientos, name='movimientos'), #Movimientos
    path('actualizar_sesiones/', views.actualizar_sesiones, name='actualizar_sesiones'),
    path('actualizar_sesiones/session/<int:index>/', views.show_session, name='show_session'),


    path('/movimientos/editar/', views.gestion_movimiento, name='gestion_movimiento'), #Agregar y editar Movimientos
    path('gestion_motivo/', views.gestion_motivo, name='gestion_motivo'), #Agregar y editar Motivos

    path('index/', views.index_view, name='index'),  # no cambiar

    path('TerapeutaOpciones/', views.TerapeutaOpciones_view, name='TerapeutaOpciones'),
    path('pacientes/', views.pacientes, name='pacientes'),
    path('fisioterapeutas/', views.fisioterapeutas_view, name='fisioterapeutas'),
  path('reporte_paciente/<int:rehabilitacion_id>/', views.reporte_paciente, name='reporte_paciente'), ## Nueva vista para el reporte del paciente

    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('logout/', views.logout_view, name='logout'),  # no cambiar
    
    #Leap
    path('session/<int:index>/', views.show_session, name='show_session'),
    path('procesar-repeticion/', views.procesar_repeticion, name='procesar_repeticion'),
    path('actualizar-porcentaje/', views.actualizar_porcentaje, name='actualizar_porcentaje'),
]

