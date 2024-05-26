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
class Terapias(models.Model):
    terapiaID = models.AutoField(primary_key=True)
    fecha = models.DateField(null=True)
    fisioterapeuta = models.ForeignKey(Fisioterapeutas, on_delete=models.CASCADE)
    paciente = models.ForeignKey(Pacientes, on_delete=models.CASCADE)


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
        return f"Sesión {self.sesionID} - Movimiento: {self.movimiento.nombre}"
