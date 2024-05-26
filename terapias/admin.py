from django.contrib import admin
from .models import Pacientes, Fisioterapeutas, Terapias, Movimientos, Sesiones

# Registro de modelos en el admin
@admin.register(Pacientes)
class PacientesAdmin(admin.ModelAdmin):
    list_display = ['cedula', 'nombre1', 'apellido1', 'celular', 'email']
    search_fields = ['nombre1', 'apellido1', 'cedula']

@admin.register(Fisioterapeutas)
class FisioterapeutasAdmin(admin.ModelAdmin):
    list_display = ['cedula', 'nombre', 'apellido', 'celular']
    search_fields = ['nombre', 'apellido', 'cedula']

@admin.register(Terapias)
class TerapiasAdmin(admin.ModelAdmin):
    list_display = ['terapiaID', 'fecha', 'fisioterapeuta', 'paciente']
    list_filter = ['fecha']

@admin.register(Movimientos)
class MovimientosAdmin(admin.ModelAdmin):
    list_display = ['movimientoID', 'nombre', 'url']

@admin.register(Sesiones)
class SesionesAdmin(admin.ModelAdmin):
    list_display = ['sesionID', 'movimientoID', 'terapiaID', 'estado', 'porcentaje', 'repeticiones']
    list_filter = ['estado']
    search_fields = ['movimientoID__nombre', 'terapiaID__nombre']
