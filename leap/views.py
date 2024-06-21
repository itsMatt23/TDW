from django.shortcuts import render
from .leap import procesar_toma

def principal(request):
    resultado = None
    if request.method == 'POST':
        sesionID = request.POST.get('sesionID')  # Cambiado de id_Registro a sesionID
        num_repeticion = request.POST.get('num_repeticion')

        if sesionID and num_repeticion:
            resultado = procesar_toma(int(sesionID), int(num_repeticion))
        
    return render(request, 'resultado.html', {'resultado': resultado})
