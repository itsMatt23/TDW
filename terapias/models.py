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
    contrasena = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.nombre1} {self.apellido1}"

# Modelo para Fisioterapeuta
class Fisioterapeutas(models.Model):
    cedula = models.CharField(max_length=10, primary_key=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    celular = models.CharField(max_length=10, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    contrasena = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

# Modelo para Terapia
class Terapia(models.Model):
    terapiaID = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    fecha = models.DateField(null=True)
    fisioterapeuta = models.ForeignKey(Fisioterapeuta, on_delete=models.CASCADE)
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

# Modelo para Movimiento
class Movimiento(models.Model):
    movimientoID = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    url = models.URLField(max_length=255)

    def __str__(self):
        return self.nombre

# Modelo para Sesiones
class Sesion(models.Model):
    sesionID = models.AutoField(primary_key=True)
    movimiento = models.ForeignKey(Movimiento, on_delete=models.CASCADE)
    estado = models.BooleanField()  # Campo booleano para estado
    porcentaje = models.FloatField(null=True)  # Campo float para porcentaje
    repeticiones = models.CharField(max_length=255)

    def __str__(self):
        return f"Sesión {self.sesionID} - Movimiento: {self.movimiento.nombre}"
