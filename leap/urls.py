from django.urls import path
from . import views

urlpatterns = [
    #path('', views.procesar_vista, name='principal'),
    path('', views.formulario_view, name='formulario_view'),
    path('procesar-formulario/', views.procesar_formulario, name='procesar_formulario'),
    path('procesar-repeticiones/', views.procesar_repeticiones_view, name='procesar_repeticiones'),
    path('procesar-repeticion/', views.procesar_repeticion, name='procesar_repeticion'),
]
