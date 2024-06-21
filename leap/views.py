from django.shortcuts import render
import json
import joblib
import subprocess
from django.shortcuts import render
from django.http import JsonResponse
from terapias.models import leapMotion
from .leapDatos.procesos_datos import crear_vector, procesar_datos_promediados

RUTA_NODO = "C:/Program Files/nodejs/node.exe"
ARCHIVO_JS = "leapDatos/recoleccion_datos.js"
ARCHIVO_MODELO = 'clf_svm_poly.sav'

modelo_df = joblib.load(ARCHIVO_MODELO)

def ejecutar_script_js():
    try:
        resultado = subprocess.run([RUTA_NODO, ARCHIVO_JS], capture_output=True, text=True)
        if resultado.stderr:
            return False, resultado.stderr
        return resultado.returncode == 0, None
    except Exception as e:
        return False, str(e)

def cargar_datos():
    try:
        with open('data.json', 'r') as archivo:
            return json.load(archivo), None
    except (FileNotFoundError, json.JSONDecodeError) as e:
        return None, str(e)

def obtener_datos_procesados(data):
    try:
        datos, promedios_posiciones, _, _, normalizados, segmentos = crear_vector(data)
        return datos, promedios_posiciones, normalizados, segmentos, None
    except ValueError as e:
        return None, None, None, None, str(e)

def realizar_prediccion(normalizados):
    try:
        return modelo_df.predict([normalizados]), None
    except Exception as e:
        return None, str(e)

def guardar_en_django(datos_procesados, id_Registro, num_repeticion):
    try:
        # Crear o actualizar un registro en la base de datos de Django
        registro, creado = leapMotion.objects.update_or_create(
            sesionID=id_Registro,
            repeticion=num_repeticion,
            defaults={
                'resultado': datos_procesados['resultado'],  # Ajusta esto según tus datos
                'arrayDatos': datos_procesados['arrayDatos']  # Ajusta esto según tus datos
            }
        )

    #registroID = models.AutoField(primary_key=True)
    #sesionID = models.ForeignKey(Sesiones, on_delete=models.CASCADE)
    #repeticion = models.IntegerField()
    #resultado = models.IntegerField()
    #arrayDatos = models.JSONField()

        if creado:
            print(f"Se insertó un nuevo registro en Django con id: {registro.registroID}")
        else:
            print(f"Se actualizó el registro existente en Django")

    except Exception as e:
        print(f"Error al insertar o actualizar registros: {str(e)}")

def procesar_toma(id_Registro, num_repeticion):
    while True:
        exito, error = ejecutar_script_js()
        if not exito:
            return {"error": f"Error al ejecutar script JS: {error}"}

        data, error = cargar_datos()
        if data is None:
            return {"error": f"Error al cargar datos: {error}"}

        datos, promedios_posiciones, normalizados, segmentos, error = obtener_datos_procesados(data)
        if not promedios_posiciones:
            return {"error": f"Error al procesar datos: {error}"}

        etiqueta, error = realizar_prediccion(normalizados)
        if etiqueta is None:
            return {"error": f"Error al realizar predicción: {error}"}

        datos_procesados = procesar_datos_promediados(datos, segmentos, int(etiqueta))
        if datos_procesados is None:
            return {"error": "Error al procesar datos promediados"}

        guardar_en_django(datos_procesados, id_Registro, num_repeticion)
        return {"success": f"Predicción con clf: {etiqueta}. Repetición completada y guardada."}

def principal(request):
    resultado = None
    if request.method == 'POST':
        id_Registro = request.POST.get('id_Registro', 1)  # Ajusta esto según los datos que envíes desde el formulario
        num_repeticion = request.POST.get('num_repeticion', 2)  # Ajusta esto según los datos que envíes desde el formulario
        resultado = procesar_toma(id_Registro, num_repeticion)
    return render(request, 'resultado.html', {'resultado': resultado})

