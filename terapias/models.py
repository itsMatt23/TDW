from django.db import models

# Modelo para Paciente
class Pacientes(models.Model):
    cedula = models.CharField(max_length=10, primary_key=True)
    nombre1 = models.CharField(max_length=255)
    nombre2 = models.CharField(max_length=255, blank=True)
    apellido1 = models.CharField(max_length=255)
    apellido2 = models.CharField(max_length=255, blank=True)
    celular = models.CharField(max_length=10, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255)
    #contrasena = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.nombre1} {self.apellido1}"

class Fisioterapeutas(models.Model):
    cedula = models.CharField(max_length=10, primary_key=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    celular = models.CharField(max_length=10, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, unique=True)  # Añadir campo de correo electrónico
    contrasena = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

#Motivos
class Motivos(models.Model):
    motivoID = models.AutoField(primary_key=True)  # Este campo es solo para Django
    nombre = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre
    
#Rehabilitaciones
class Rehabilitaciones (models.Model):
    rehabilitacionID = models.AutoField(primary_key=True)
    motivoID = models.ForeignKey(Motivos, on_delete=models.CASCADE)
    fechaInicio = models.DateField(null=True)
    fechaFin = models.DateField(null=True)
    fisioterapeuta = models.ForeignKey(Fisioterapeutas, on_delete=models.CASCADE)
    paciente = models.ForeignKey(Pacientes, on_delete=models.CASCADE)

# Modelo para Terapia
class Terapias(models.Model):
    terapiaID = models.AutoField(primary_key=True)
    fecha = models.DateField(null=True)
    rehabilitacionID = models.ForeignKey(Rehabilitaciones, on_delete=models.CASCADE)
    
# Modelo para Movimiento
class Movimientos(models.Model):
    movimientoID = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    url = models.URLField(max_length=255)

    def __str__(self):
        return self.nombre

# Modelo para Sesiones
class Sesiones(models.Model):
    sesionID = models.AutoField(primary_key=True)
    movimientoID = models.ForeignKey(Movimientos, on_delete=models.CASCADE)
    terapiaID = models.ForeignKey(Terapias, on_delete=models.CASCADE)
    estado = models.BooleanField()  # Campo booleano para estado
    porcentaje = models.FloatField(null=True)  # Campo float para porcentaje
    repeticiones = models.CharField(max_length=255)

    def __str__(self):
        return f"Sesión {self.sesionID} - Movimiento: {self.movimientoID.nombre}"

####################################################################
class leapMotion(models.Model):
    registroID = models.AutoField(primary_key=True)
    sesionID = models.ForeignKey(Sesiones, on_delete=models.CASCADE)
    repeticion = models.IntegerField()
    resultado = models.IntegerField()
    arrayDatos = models.JSONField()