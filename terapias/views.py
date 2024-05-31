from django.shortcuts import render, get_object_or_404, redirect
import datetime
from .models import Pacientes, Terapias, Fisioterapeutas, Movimientos, Sesiones
from django.contrib import messages

def terapia_paciente(request):
    paciente = None
    terapias = None
    cedula = request.POST.get('cedula', '') or request.GET.get('cedula', '')

    if request.method == 'POST':
        if 'buscar_paciente' in request.POST:
            # Procesar búsqueda de paciente por cédula
            cedula = request.POST.get('cedula', '')
            if cedula:
                paciente = get_object_or_404(Pacientes, cedula=cedula)
                terapias = Terapias.objects.filter(paciente=paciente)

        elif 'crear_terapia' in request.POST:
            # Procesar creación de terapia para el paciente
            paciente_id = request.POST.get('paciente_id', '')
            if paciente_id:
                paciente = get_object_or_404(Pacientes, pk=paciente_id)
                # Aquí deberías tener la lógica para seleccionar un terapeuta, por ejemplo:
                terapeuta = get_object_or_404(Fisioterapeutas, cedula="1800000000")
                # Para simplificar, supongamos que ya tienes el terapeuta seleccionado

                fecha_actual = datetime.date.today()
                terapia = Terapias(fecha=fecha_actual, paciente=paciente, fisioterapeuta=terapeuta)
                terapia.save()

                for i in range(1, 6):
                    movimiento = get_object_or_404(Movimientos, pk=i)
                    sesion = Sesiones(movimientoID=movimiento, terapiaID=terapia, estado=False, porcentaje=0, repeticiones="15")
                    sesion.save()

                terapias = Terapias.objects.filter(paciente=paciente)



                # Recargar las terapias actualizadas del paciente después de la creación
                terapias = Terapias.objects.filter(paciente=paciente)

        elif 'eliminar_terapia' in request.POST:
            # Procesar eliminación de terapia
            terapia_id = request.POST.get('eliminar_terapia', '')
            paciente_id = request.POST.get('paciente_id', '')
            if terapia_id and paciente_id:
                terapia = get_object_or_404(Terapias, pk=terapia_id)
                terapia.delete()

                # Recargar las terapias actualizadas del paciente después de la eliminación
                paciente = get_object_or_404(Pacientes, pk=paciente_id)
                terapias = Terapias.objects.filter(paciente=paciente)
                
        elif 'limpiar_pantalla' in request.POST:
            # Restablecer la pantalla a su estado inicial
            paciente = None
            terapias = None

    return render(request, 'terapias.html', {
        'paciente': paciente,
        'terapias': terapias,
    })

def gestion_paciente(request, cedula):
    try:
        paciente = Pacientes.objects.get(cedula=cedula)
        terapias = Terapias.objects.filter(paciente=paciente)
    except Pacientes.DoesNotExist:
        paciente = None
        terapias = None

    return render(request, 'terapias.html', {
            'paciente': paciente,
            'terapias': terapias,
        })

#Movimientos
def movimientos(request, terapia_id):
    terapia = get_object_or_404(Terapias, pk=terapia_id)
    sesiones = Sesiones.objects.filter(terapiaID=terapia)
    
    return render(request, 'movimientos.html', {
        'terapia': terapia,
        'sesiones': sesiones,
    })

def actualizar_sesiones(request):
    if request.method == 'POST':
        sesiones_seleccionadas = request.POST.getlist('sesiones_seleccionadas')
        for sesion_id in sesiones_seleccionadas:
            sesion = Sesiones.objects.get(pk=sesion_id)
            sesion.estado = True  # Actualiza el estado de la sesión seleccionada
            sesion.repeticiones = request.POST.get(f'repeticiones_{sesion_id}')
            sesion.save()
        return redirect('movimientos', terapia_id=sesion.terapiaID.pk)
    
    else:
        # Manejo si el método no es POST (opcional dependiendo de la lógica deseada)
        pass

###########################################################################
#Pacientes
def pacientes(request):
    pacientes = Pacientes.objects.all()
    if 'cedula' in request.GET:
        cedula = request.GET['cedula']
        pacientes = pacientes.filter(cedula__icontains=cedula)

    if request.method == 'POST':
        if 'create' in request.POST:
            #Validar que no se ingrese cedula repetida
            cedula = request.POST['cedula']
            if Pacientes.objects.filter(cedula=cedula).exists():
                messages.error(request, f'La cédula {cedula} ya está en uso.')

            else:
                Pacientes.objects.create(
                    cedula=request.POST['cedula'],
                    nombre1=request.POST['nombre1'],
                    nombre2=request.POST.get('nombre2', ''),
                    apellido1=request.POST['apellido1'],
                    apellido2=request.POST.get('apellido2', ''),
                    celular=request.POST.get('celular', ''),
                    direccion=request.POST.get('direccion', ''),
                    email=request.POST['email']
                    #contrasena=request.POST['contrasena']
                )
            

        elif 'update' in request.POST:
            patiente = get_object_or_404(Pacientes, cedula=request.POST['cedula'])
            patiente.nombre1 = request.POST['nombre1']
            patiente.nombre2 = request.POST.get('nombre2', '')
            patiente.apellido1 = request.POST['apellido1']
            patiente.apellido2 = request.POST.get('apellido2', '')
            patiente.celular = request.POST.get('celular', '')
            patiente.direccion = request.POST.get('direccion', '')
            patiente.email = request.POST['email']
            #patiente.contrasena = request.POST['contrasena']
            patiente.save()
        elif 'delete' in request.POST:
            patiente = get_object_or_404(Pacientes, cedula=request.POST['cedula'])
            patiente.delete()

        return redirect('pacientes')

    return render(request, 'pacientes.html', {'pacientes': pacientes})

