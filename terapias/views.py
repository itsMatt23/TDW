from django.shortcuts import render, get_object_or_404, redirect
import datetime
from .models import Pacientes, Terapias, Fisioterapeutas, Movimientos, Sesiones
from django.contrib import messages
from django.contrib.auth import authenticate, login,logout,get_user_model
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from .models import Fisioterapeutas
def home_view(request):
    return render(request, 'index.html')  # Renderiza la plantilla index.html

# Login
def index_view(request):
    if request.method == "POST":
        email = request.POST['username']
        password = request.POST['password']

        # Intentar autenticar como usuario de Django
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'redirect_url': 'TerapeutaOpciones/'})
        else:
            # Intentar autenticar como Fisioterapeuta
            try:
                fisioterapeuta = Fisioterapeutas.objects.get(email=email)
                if fisioterapeuta.contrasena == password:
                    request.session['fisioterapeuta_id'] = fisioterapeuta.cedula
                    return JsonResponse({'success': True, 'redirect_url': 'TerapeutaOpciones/'})
                else:
                    return JsonResponse({'success': False, 'error': 'Usuario o contraseña incorrecta'}, status=400)
            except Fisioterapeutas.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Usuario o contraseña incorrecta'}, status=400)
    return render(request, 'index.html')

def TerapeutaOpciones_view(request):
    is_superuser = request.user.is_superuser if request.user.is_authenticated else False
    context = {'is_superuser': is_superuser}
    return render(request, 'TerapeutaOpciones.html', context)

def logout_view(request):
    logout(request)
    return redirect('index')

# otras opciones
def dashboard_view(request):
    # Lógica de la vista del dashboard
    return render(request, 'dashboard.html')

def terapia_paciente(request):
    # Lógica de la vista de terapia paciente
    return render(request, 'terapias.html')

def pacientes(request):
    # Lógica de la vista de pacientes
    return render(request, 'pacientes.html')





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
                terapeuta = get_object_or_404(Fisioterapeutas, cedula="0987654321")
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


# Actualizar movimientos
def gestion_movimiento(request):
    movimientos = Movimientos.objects.all()
    movimiento_seleccionado = None

    if request.method == 'POST':
        movimiento_id = request.POST.get('movimiento')
        movimiento_seleccionado = get_object_or_404(Movimientos, movimientoID=movimiento_id)
        
        movimiento_seleccionado.nombre = request.POST['nombre']
        movimiento_seleccionado.url = request.POST['url']
        movimiento_seleccionado.save()

    return render(request, 'gestion_movimiento.html', {
        'movimientos': movimientos,
        'movimiento_seleccionado': movimiento_seleccionado,
    })


#################
def fisioterapeutas_view(request):
    if request.method == 'POST':
        if 'create' in request.POST:
            try:
                Fisioterapeutas.objects.create(
                    cedula=request.POST['cedula'],
                    nombre=request.POST['nombre'],
                    apellido=request.POST['apellido'],
                    celular=request.POST['celular'],
                    direccion=request.POST['direccion'],
                    email=request.POST['email'],
                    contrasena=request.POST['contrasena']
                )
                messages.success(request, 'Fisioterapeuta creado exitosamente')
            except Exception as e:
                messages.error(request, f'Error al crear fisioterapeuta: {e}')
        elif 'update' in request.POST:
            try:
                fisioterapeuta = get_object_or_404(Fisioterapeutas, cedula=request.POST['cedula'])
                fisioterapeuta.nombre = request.POST['nombre']
                fisioterapeuta.apellido = request.POST['apellido']
                fisioterapeuta.celular = request.POST['celular']
                fisioterapeuta.direccion = request.POST['direccion']
                fisioterapeuta.email = request.POST['email']
                fisioterapeuta.contrasena = request.POST['contrasena']
                fisioterapeuta.save()
                messages.success(request, 'Fisioterapeuta actualizado exitosamente')
            except Exception as e:
                messages.error(request, f'Error al actualizar fisioterapeuta: {e}')
        elif 'delete' in request.POST:
            try:
                fisioterapeuta = get_object_or_404(Fisioterapeutas, cedula=request.POST['cedula'])
                fisioterapeuta.delete()
                messages.success(request, 'Fisioterapeuta eliminado exitosamente')
            except Exception as e:
                messages.error(request, f'Error al eliminar fisioterapeuta: {e}')

    query = request.GET.get('query', '')
    fisioterapeutas = Fisioterapeutas.objects.filter(nombre__icontains=query) | Fisioterapeutas.objects.filter(cedula__icontains=query)
    context = {'fisioterapeutas': fisioterapeutas}
    return render(request, 'fisioterapeutas.html', context)