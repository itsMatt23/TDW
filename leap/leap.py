import json
import joblib
import subprocess
from django.shortcuts import render
from django.http import JsonResponse
from terapias.models import leapMotion, Sesiones
from .leapDatos.procesos_datos import crear_vector, procesar_datos_promediados
import os

RUTA_NODO = "C:/Program Files/nodejs/node.exe"
#ARCHIVO_JS = "leapDatos/recoleccion_datos.js"
ARCHIVO_JS = os.path.join(os.path.dirname(__file__), 'leapDatos', 'recoleccion_datos.js')

ARCHIVO_MODELO = os.path.join(os.path.dirname(__file__), 'leapDatos', 'clf_svm_poly.sav')
#ARCHIVO_MODELO = '/leap/leapDatos/clf_svm_poly.sav'

modelo_df = joblib.load(ARCHIVO_MODELO)

def ejecutar_script_js():
    try:
        resultado = subprocess.run([RUTA_NODO, ARCHIVO_JS], capture_output=True, text=True)
        if resultado.stderr:
            print("Errores:", resultado.stderr)
            return False
        return resultado.returncode == 0
    except Exception as e:
        print(f"Error al ejecutar el script JS: {str(e)}")
        return False

def cargar_datos():
    try:
        with open('data.json', 'r') as archivo:
            return json.load(archivo)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error al cargar el archivo 'data.json': {str(e)}")
        return None

def obtener_datos_procesados(data):
    try:
        datos, promedios_posiciones, _, _, normalizados, segmentos = crear_vector(data)
        return datos, promedios_posiciones, normalizados, segmentos
    except ValueError as e:
        print(f"Error: {str(e)}. Verifica la salida de la función 'crear_vector'.")
        return None, None, None, None

def realizar_prediccion(normalizados):
    try:
        return modelo_df.predict([normalizados])
    except Exception as e:
        print(f"Error al realizar la predicción: {str(e)}")
        return None

def guardar_en_django(datos_procesados, sesionID, num_repeticion):
    try:
        array_datos_mano = datos_procesados.get('array_datos_mano', [])

        # Crear o actualizar un registro en la base de datos de Django
        registro, creado = leapMotion.objects.update_or_create(
            sesionID=sesionID,
            num_repeticion=num_repeticion,
            defaults={
                'resultado': datos_procesados.get('etiqueta'),  # Ajusta según tus datos
                'arrayDatos': array_datos_mano,
            }
        )

        if creado:
            print(f"Se insertó un nuevo registro en Django con id: {registro.registroID}")
        else:
            print(f"Se actualizó el registro existente en Django con id: {registro.registroID}")

    except Exception as e:
        print(f"Error al insertar o actualizar registros: {str(e)}")


def procesar_toma(sesionID, num_repeticion):
    try:
        sesion = Sesiones.objects.get(sesionID=sesionID)  # Usando sesionID en lugar de id
    except Sesiones.DoesNotExist:
        print(f"Sesión con ID {sesionID} no encontrada.")
        return {"error": f"Sesión con ID {sesionID} no encontrada."}

    exito = False
    while not exito:
        if not ejecutar_script_js():
            print(f"Repetición {num_repeticion} fallida. Inténtelo de nuevo.")
            continue

        data = cargar_datos()
        if data is None:
            print(f"Repetición {num_repeticion} fallida. Inténtelo de nuevo.")
            continue

        datos, promedios_posiciones, normalizados, segmentos = obtener_datos_procesados(data)
        if not promedios_posiciones:
            print(f"Repetición {num_repeticion} fallida. Inténtelo de nuevo.")
            continue

        etiqueta = realizar_prediccion(normalizados)
        if etiqueta is None:
            print(f"Repetición {num_repeticion} fallida. Inténtelo de nuevo.")
            continue

        datos_procesados = procesar_datos_promediados(datos, segmentos, int(etiqueta))
        if datos_procesados is None:
            print(f"Repetición {num_repeticion} fallida. Inténtelo de nuevo.")
            continue

        guardar_en_django(datos_procesados, sesion, num_repeticion)
        print("Predicción con clf:", etiqueta)
        print(f"Repetición {num_repeticion} completada y guardada.")
        exito = True

    return {"success": f"Predicción con clf: {etiqueta}. Repetición completada y guardada."}





