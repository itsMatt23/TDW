from django.shortcuts import render
from terapias.models import Sesiones, leapMotion
from .leap import procesar_toma
from django.http import JsonResponse


def principal(request):
    resultado = None
    if request.method == 'POST':
        sesionID = request.POST.get('sesionID')  # Cambiado de id_Registro a sesionID
        num_repeticion = request.POST.get('num_repeticion')

        if sesionID and num_repeticion:
            resultado = procesar_toma(int(sesionID), int(num_repeticion))
        
    return render(request, 'resultado.html', {'resultado': resultado})

def procesar_vista(request):
    resultados = []
    if request.method == 'POST':
        sesionID = request.POST.get('sesionID')
        num_repeticiones = request.POST.get('num_repeticiones')

        if sesionID and num_repeticiones:
            try:
                sesionID = int(sesionID)
                num_repeticiones = int(num_repeticiones)
                for num_repeticion in range(1, num_repeticiones + 1):
                    resultado = procesar_toma(sesionID, num_repeticion)
                    resultados.append({'numero_repeticion': num_repeticion, 'resultado': resultado})
            except ValueError:
                resultados.append({'numero_repeticion': None, 'resultado': "Sesión ID y Número de Repeticiones deben ser números enteros."})

    return render(request, 'resultado.html', {'resultados': resultados})

def procesar_vista2(request):
    if request.method == 'POST':
        sesionID = request.POST.get('sesionID')
        num_repeticiones = request.POST.get('num_repeticiones')

        if sesionID and num_repeticiones:
            try:
                sesionID = int(sesionID)
                num_repeticiones = int(num_repeticiones)
                resultados = []

                for num_repeticion in range(1, num_repeticiones + 1):
                    resultado = procesar_toma(sesionID, num_repeticion)
                    resultados.append({
                        'numero_repeticion': num_repeticion,
                        'resultado': resultado
                    })

                return JsonResponse(resultados, safe=False)

            except ValueError:
                return JsonResponse({'error': "Sesión ID y Número de Repeticiones deben ser números enteros."})

    return render(request, 'resultado.html')