from django.shortcuts import render, get_object_or_404, redirect
import datetime
from .models import Pacientes, Terapias, Fisioterapeutas, Movimientos, Sesiones, Motivos, Rehabilitaciones
from django.contrib import messages
from django.contrib.auth import authenticate, login,logout,get_user_model
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from .models import Fisioterapeutas
from django.db.models import Q  # Importar Q para las consultas OR
#Leap
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from leap.leap import procesar_toma

import datetime
from django.db.models.functions import TruncMonth

from django.db.models.functions import ExtractMonth, ExtractYear
from datetime import datetime as dt
from django.db.models import Count, Q,Avg

# Renderiza la plantilla index.html
def home_view(request):
    return render(request, 'index.html') 
# Login

def index_view(request):
    if request.method == "POST":
        email = request.POST['username']
        password = request.POST['password']

        # Intentar autenticar como usuario de Django
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            request.session['fisioterapeuta_id'] = None  # Reiniciar fisioterapeuta_id en la sesión
            print("Usuario de Django autenticado.")
            return JsonResponse({'success': True, 'redirect_url': 'TerapeutaOpciones/'})
        else:
            # Intentar autenticar como Fisioterapeuta
            try:
                fisioterapeuta = Fisioterapeutas.objects.get(email=email)
                if fisioterapeuta.contrasena == password:
                    print(f"Fisioterapeuta encontrado: {fisioterapeuta.cedula}")
                    request.session['fisioterapeuta_id'] = fisioterapeuta.cedula
                    request.session['is_superuser'] = False
                    print(f"Fisioterapeuta ID guardado en la sesión: {request.session['fisioterapeuta_id']}")
                    return JsonResponse({'success': True, 'redirect_url': 'TerapeutaOpciones/'})
                else:
                    print("Contraseña incorrecta para el fisioterapeuta.")
                    return JsonResponse({'success': False, 'error': 'Usuario o contraseña incorrecta'}, status=400)
            except Fisioterapeutas.DoesNotExist:
                print("Fisioterapeuta no encontrado.")
                return JsonResponse({'success': False, 'error': 'Usuario o contraseña incorrecta'}, status=400)
    return render(request, 'index.html')


def TerapeutaOpciones_view(request):
    is_superuser = request.user.is_superuser if request.user.is_authenticated else False
    fisioterapeuta_id = request.session.get('fisioterapeuta_id')
    print(f"Fisioterapeuta ID almacenado en la sesión: {fisioterapeuta_id}")
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

def gestion_paciente(request, cedula):
    try:
        paciente = Pacientes.objects.get(cedula=cedula)
        rehabilitaciones = Rehabilitaciones.objects.filter(paciente=paciente)
        motivos = Motivos.objects.all()  # Obtener todos los motivos disponibles

    except Pacientes.DoesNotExist:
        paciente = None
        rehabilitacion = None
        motivos = None

    return render(request, 'rehabilitacion.html', {
            'paciente': paciente,
            'rehabilitaciones': rehabilitaciones,
            'motivos': motivos,  # Pasar los motivos al contexto del template
        })
##################################################
#Gestion de Rehabilitaciones-Terapias-Movimientos#
#Rehabilitacion

def rehabilitacion_paciente(request):
    if not request.user.is_authenticated and 'fisioterapeuta_id' not in request.session:
        return redirect('index')

    paciente = None
    rehabilitaciones = None
    motivos = Motivos.objects.all()  # Obtener todos los motivos disponibles

    cedula = request.POST.get('cedula', '') or request.GET.get('cedula', '')

    fisioterapeuta_id = request.session.get('fisioterapeuta_id', '') if not request.user.is_authenticated else ''

    if request.method == 'POST':
        if 'buscar_paciente' in request.POST:
            # Procesar búsqueda de paciente por cédula
            cedula = request.POST.get('cedula', '')
            if cedula:
                try:
                    paciente = Pacientes.objects.get(cedula=cedula)
                    rehabilitaciones = Rehabilitaciones.objects.filter(paciente=paciente)
                except Pacientes.DoesNotExist:
                    paciente = None
                    messages.error(request, 'Paciente no encontrado. Intenta buscarlo en la lista de pacientes.')

        elif 'crear_rehabilitacion' in request.POST:
            if request.user.is_superuser:
                messages.error(request, 'Los administradores no pueden crear rehabilitaciones.')
            else:
                # Procesar creación de rehabilitación para el paciente
                paciente_id = request.POST.get('paciente_id', '')
                motivo_id = request.POST.get('motivo_id', '')

                if paciente_id and motivo_id:
                    fecha_inicio = datetime.date.today()
                    paciente = get_object_or_404(Pacientes, pk=paciente_id)
                    motivo = get_object_or_404(Motivos, pk=motivo_id)

                    fisioterapeuta = None
                    if request.user.is_authenticated:
                        fisioterapeuta = get_object_or_404(Fisioterapeutas, email=request.user.email)
                    elif 'fisioterapeuta_id' in request.session:
                        fisioterapeuta = get_object_or_404(Fisioterapeutas, cedula=request.session['fisioterapeuta_id'])

                    if fisioterapeuta:
                        rehabilitacion = Rehabilitaciones(
                            motivoID=motivo,
                            fechaInicio=fecha_inicio,
                            fisioterapeuta=fisioterapeuta,
                            paciente=paciente
                        )
                        rehabilitacion.save()
                        messages.success(request, 'Rehabilitación creada exitosamente.', extra_tags='success')
                        rehabilitaciones = Rehabilitaciones.objects.filter(paciente=paciente)
                    else:
                        messages.error(request, 'No se pudo identificar al fisioterapeuta.')

        elif 'eliminar_rehabilitacion' in request.POST:
            # Procesar eliminación de rehabilitación
            rehabilitacion_id = request.POST.get('eliminar_rehabilitacion', '')
            paciente_id = request.POST.get('paciente_id', '')
            if rehabilitacion_id and paciente_id:
                rehabilitacion = get_object_or_404(Rehabilitaciones, pk=rehabilitacion_id)
                rehabilitacion.delete()
                messages.success(request, 'Rehabilitación eliminada exitosamente.')
                paciente = get_object_or_404(Pacientes, pk=paciente_id)
                rehabilitaciones = Rehabilitaciones.objects.filter(paciente=paciente)

        elif 'limpiar_pantalla' in request.POST:
            # Restablecer la pantalla a su estado inicial
            paciente = None
            rehabilitaciones = None

    return render(request, 'rehabilitacion.html', {
        'paciente': paciente,
        'rehabilitaciones': rehabilitaciones,
        'motivos': motivos,  # Pasar los motivos al contexto del template
        'fisioterapeuta_id': fisioterapeuta_id  # Pasar el fisioterapeuta_id al contexto
    })


#Terapias
def terapias(request, rehabilitacion_id):
    rehabilitacion = get_object_or_404(Rehabilitaciones, pk=rehabilitacion_id)
    terapias = Terapias.objects.filter(rehabilitacionID=rehabilitacion)
    movimientos = Movimientos.objects.all()

    if request.method == 'POST':
        if 'crear_terapia' in request.POST:
            if movimientos.count() == 5:
                fecha_actual = datetime.date.today()
                terapia = Terapias(fecha=fecha_actual, rehabilitacionID=rehabilitacion)
                terapia.save()

                for i in range(1, 6):  # Movimientos del 1 al 5
                    movimiento = get_object_or_404(Movimientos, pk=i)
                    sesion = Sesiones(movimientoID=movimiento, terapiaID=terapia, estado=False, porcentaje=0, repeticiones="10")
                    sesion.save()
                return redirect('terapias', rehabilitacion_id=rehabilitacion_id)

        elif 'eliminar_terapia' in request.POST:
            terapia_id = request.POST.get('terapia_id')
            if terapia_id:
                terapia = get_object_or_404(Terapias, pk=terapia_id)
                terapia.delete()
                return redirect('terapias', rehabilitacion_id=rehabilitacion_id)

    return render(request, 'terapias.html', {
        'rehabilitacion': rehabilitacion,
        'terapias': terapias,
        'movimientos': movimientos,
    })

#Movimientos
def movimientos(request, terapia_id):
    terapia = get_object_or_404(Terapias, pk=terapia_id)
    sesiones = Sesiones.objects.filter(terapiaID=terapia)
    
    return render(request, 'movimientos.html', {
        'terapia': terapia,
        'sesiones': sesiones,
    })
    
#Gestion de Pacientes-Terapeutas#
#Pacientes
def pacientes(request):
    pacientes = Pacientes.objects.all()
    query = request.GET.get('query', '')

    if query:
        pacientes = pacientes.filter(
            Q(cedula__icontains=query) | 
            Q(nombre1__icontains=query) | 
            Q(nombre2__icontains=query) | 
            Q(apellido1__icontains=query) | 
            Q(apellido2__icontains=query)
        )

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
                messages.success(request, 'Paciente creado exitosamente')

        elif 'update' in request.POST:
            paciente = get_object_or_404(Pacientes, cedula=request.POST['cedula'])
            paciente.nombre1 = request.POST['nombre1']
            paciente.nombre2 = request.POST.get('nombre2', '')
            paciente.apellido1 = request.POST['apellido1']
            paciente.apellido2 = request.POST.get('apellido2', '')
            paciente.celular = request.POST.get('celular', '')
            paciente.direccion = request.POST.get('direccion', '')
            paciente.email = request.POST['email']
            #paciente.contrasena = request.POST['contrasena']
            paciente.save()
            messages.success(request, 'Paciente actualizado exitosamente')

        elif 'delete' in request.POST:
            paciente = get_object_or_404(Pacientes, cedula=request.POST['cedula'])
            paciente.delete()
            messages.success(request, 'Paciente eliminado exitosamente')

        return redirect('pacientes')

    return render(request, 'pacientes.html', {'pacientes': pacientes})


#Fisioterapeutas
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

################################
#Gestion de Movimientos-Motivos#
#Actualizar movimientos
def gestion_movimiento(request):
    movimientos = Movimientos.objects.all()
    cantidad_movimientos = movimientos.count()
    movimiento_seleccionado = None
    crear_movimiento = cantidad_movimientos < 5  # Verifica si se pueden crear más movimientos

    if request.method == 'POST':
        if 'movimiento' in request.POST:  # Si se está actualizando un movimiento existente
            movimiento_id = request.POST.get('movimiento')
            movimiento_seleccionado = Movimientos.objects.get(movimientoID=movimiento_id)
            movimiento_seleccionado.nombre = request.POST['nombre']
            movimiento_seleccionado.url = request.POST['url']
            movimiento_seleccionado.save()
        else:  # Si se está creando un nuevo movimiento
            if cantidad_movimientos < 5:  # Verifica nuevamente para evitar exceder los 5 movimientos
                nuevo_movimiento = Movimientos(nombre=request.POST['nombre'], url=request.POST['url'])
                nuevo_movimiento.save()

    return render(request, 'gestion_movimiento.html', {
        'movimientos': movimientos,
        'movimiento_seleccionado': movimiento_seleccionado,
        'crear_movimiento': crear_movimiento,
    })

#Actualizar Motivos
def gestion_motivo(request):
    motivos = Motivos.objects.all()
    crear_motivo = True

    if request.method == 'POST':
        if 'crear' in request.POST:  # Verificamos si se está creando un nuevo motivo
            nombre = request.POST.get('nombre')
            # Podrías validar los datos aquí antes de guardarlos
            Motivos.objects.create(nombre=nombre)
            return redirect('gestion_motivo')  # Redirige a la misma página después de crear un motivo
        elif 'actualizar' in request.POST:  # Verificamos si se está actualizando un motivo existente
            motivo_id = request.POST.get('motivo_id')
            nombre = request.POST.get('nombre')
            # Podrías validar los datos aquí antes de actualizarlos
            motivo = Motivos.objects.get(id=motivo_id)
            motivo.nombre = nombre
            motivo.save()
            return redirect('gestion_motivo')  # Redirige a la misma página después de actualizar el motivo

    context = {
        'motivos': motivos,
        'crear_motivo': crear_motivo,
    }
    return render(request, 'gestion_motivos.html', context)


#########Leap Configuracion
#Metodo que permite actualizar las sesiones para que no vuelvan a hacer!!!
def actualizar_sesiones(request):
    if request.method == 'POST':
        sesiones_seleccionadas = request.POST.getlist('sesiones_seleccionadas', [])
        print(sesiones_seleccionadas)
        
        repeticiones = {}
        for sesion_id in sesiones_seleccionadas:
            repeticiones[sesion_id] = request.POST.get(f'repeticiones_{sesion_id}')
            
        request.session['sesiones_seleccionadas'] = sesiones_seleccionadas
        request.session['repeticiones'] = repeticiones

        return redirect(reverse('show_session', kwargs={'index': 0}))

def show_session(request, index):
    sesiones_seleccionadas = request.session.get('sesiones_seleccionadas', [])
    repeticiones = request.session.get('repeticiones', {})

    if not sesiones_seleccionadas or index >= len(sesiones_seleccionadas):
        return JsonResponse({'error': "No hay más sesiones o índice fuera de rango."}, status=400)

    try:
        index = int(index)
    except ValueError:
        return JsonResponse({'error': "Índice debe ser un número entero válido."}, status=400)

    session_id = sesiones_seleccionadas[index]
    num_repeticiones = repeticiones.get(session_id, "N/A")
    session = Sesiones.objects.get(pk=session_id)

    context = {
        'session_id': session_id,
        'repeticion': num_repeticiones,
        'terapiaID': session.terapiaID,
        'movimientos': session.movimientoID,
        'next_index': index + 1,
        'sesiones_seleccionadas': sesiones_seleccionadas
    }
    return render(request, 'show_session.html', context)

@csrf_exempt
def procesar_repeticion(request):
    if request.method == 'POST':
        sesionID = request.POST.get('sesionID')
        num_repeticion = request.POST.get('num_repeticion')
        try:
            sesionID = int(sesionID)
            num_repeticion = int(num_repeticion)
            resultado = procesar_toma(sesionID, num_repeticion)
            
            
            return JsonResponse({'numero_repeticion': num_repeticion, 'resultado': resultado})
        except ValueError:
            return JsonResponse({'error': "Sesión ID y Número de Repetición deben ser números enteros."}, status=400)


@csrf_exempt
def actualizar_porcentaje(request):
    if request.method == 'POST':
        sesionID = request.POST.get('sesionID')
        porcentaje = request.POST.get('porcentaje')
        repeticiones = request.POST.get('totalRepeticiones')
        try:
            sesion = Sesiones.objects.get(pk=sesionID)
            sesion.estado = True  # Actualiza el estado de la sesión seleccionada
            sesion.repeticiones = repeticiones
            #sesion.porcentaje = float(porcentaje) * 100  # Guarda el porcentaje multiplicado por 100
            sesion.porcentaje = round(float(porcentaje) * 100, 2)
            sesion.save()
            
            return JsonResponse({'message': "Porcentaje actualizado correctamente."})
        except Sesiones.DoesNotExist:
            return JsonResponse({'error': "Sesión no encontrada."}, status=404)
        except ValueError:
            return JsonResponse({'error': "Porcentaje debe ser un número válido."}, status=400)



##########################Dahsboard
# Vista del dashboard
def dashboard_view(request):
    year = request.GET.get('year', datetime.datetime.now().year)
    year = int(year)  # Convertir el año a entero
    rehabilitaciones = Rehabilitaciones.objects.filter(fechaInicio__year=year)

    # Agrupar rehabilitaciones por mes en Python
    rehabilitaciones_por_mes = {}
    for rehabilitacion in rehabilitaciones:
        mes = rehabilitacion.fechaInicio.month
        if mes not in rehabilitaciones_por_mes:
            rehabilitaciones_por_mes[mes] = 0
        rehabilitaciones_por_mes[mes] += 1

    # Ordenar los resultados por mes
    sorted_rehabilitaciones_por_mes = sorted(rehabilitaciones_por_mes.items())

    labels = [datetime.date(1900, mes, 1).strftime('%B') for mes, _ in sorted_rehabilitaciones_por_mes]
    data = [total for _, total in sorted_rehabilitaciones_por_mes]

    total_rehabilitaciones = Rehabilitaciones.objects.count()
    total_pacientes = Pacientes.objects.count()
    total_fisioterapeutas = Fisioterapeutas.objects.count()
    rehabilitaciones_por_motivo = Motivos.objects.annotate(total=Count('rehabilitaciones')).order_by('nombre')

    motivo_labels = [entry.nombre for entry in rehabilitaciones_por_motivo]
    motivo_data = [entry.total for entry in rehabilitaciones_por_motivo]
    
    context = {
        'total_rehabilitaciones': total_rehabilitaciones,
        'total_pacientes': total_pacientes,
        'total_fisioterapeutas': total_fisioterapeutas,
        'labels': labels,
        'data': data,
        'motivo_labels': motivo_labels,
        'motivo_data': motivo_data,
        'year_range': range(2023, 2035),
        'selected_year': year,
    }
    return render(request, 'dashboard.html', context)


from django.db import connection
from django.shortcuts import render, get_object_or_404

import datetime


from django.shortcuts import render, get_object_or_404
from .models import Rehabilitaciones, Terapias, Sesiones
from django.utils.dateformat import DateFormat


def reporte_rehabilitacion_view(request, rehabilitacion_id):
    rehabilitacion = get_object_or_404(Rehabilitaciones, pk=rehabilitacion_id)
    terapias = Terapias.objects.filter(rehabilitacionID=rehabilitacion)

    terapias_report = []
    labels = []
    correctas_data = []
    incorrectas_data = []

    for terapia in terapias:
        sesiones = Sesiones.objects.filter(terapiaID=terapia)
        correctas = sum(1 for sesion in sesiones if sesion.estado)
        incorrectas = sum(1 for sesion in sesiones if not sesion.estado)
        
        labels.append(DateFormat(terapia.fecha).format('Y-m-d'))
        correctas_data.append(correctas)
        incorrectas_data.append(incorrectas)
        
        terapias_report.append({
            'terapia': terapia,
            'correctas': correctas,
            'incorrectas': incorrectas
        })

    context = {
        'rehabilitacion': rehabilitacion,
        'terapias_report': terapias_report,
        'labels': labels,
        'correctas_data': correctas_data,
        'incorrectas_data': incorrectas_data
    }
    return render(request, 'reporte_rehabilitacion.html', context)