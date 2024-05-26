from django.shortcuts import render, get_object_or_404
import datetime
from .models import Pacientes, Terapias, Fisioterapeutas

def gestion_paciente(request):
    paciente = None
    terapias = None

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

    return render(request, 'gestion_paciente.html', {
        'paciente': paciente,
        'terapias': terapias,
    })
