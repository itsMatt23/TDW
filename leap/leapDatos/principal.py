import json
import joblib
import subprocess
from base_datos import guardar_en_mongo
from procesos_datos import crear_vector, procesar_datos_promediados

RUTA_NODO = "C:/Program Files/nodejs/node.exe"
ARCHIVO_JS = "recoleccion_datos.js"
ARCHIVO_MODELO = 'clf_svm_poly.sav'

modelo_df = joblib.load(ARCHIVO_MODELO)

def ejecutar_script_js():
    try:
        resultado = subprocess.run(
            [RUTA_NODO, ARCHIVO_JS], capture_output=True, text=True)
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
        print(f"Error al cargar el archivo {'data.json'}: {str(e)}")
        return None


def obtener_datos_procesados(data):
    try:
        datos, promedios_posiciones, _, _, normalizados, segmentos = crear_vector(
            data)
        return datos, promedios_posiciones, normalizados, segmentos
    except ValueError as e:
        print(
            f"Error: {str(e)}. Verifica la salida de la función 'crear_vector'.")
        return None, None, None, None


def realizar_prediccion(normalizados):
    try:
        return modelo_df.predict([normalizados])
    except Exception as e:
        print(f"Error al realizar la predicción: {str(e)}")
        return None


def procesar_toma(id_Registro, num_repeticion):
    exito = False
    while not exito:
        if not ejecutar_script_js():
            print(f"Repeticion {num_repeticion} fallida. Inténtelo de nuevo.")
            continue

        data = cargar_datos()
        if data is None:
            print(f"Repeticion {num_repeticion} fallida. Inténtelo de nuevo.")
            continue

        datos, promedios_posiciones, normalizados, segmentos = obtener_datos_procesados(
            data)
        if not promedios_posiciones:
            print(f"Repeticion {num_repeticion} fallida. Inténtelo de nuevo.")
            continue

        etiqueta = realizar_prediccion(normalizados)
        if etiqueta is None:
            print(f"Repeticion {num_repeticion} fallida. Inténtelo de nuevo.")
            continue

        datos_procesados = procesar_datos_promediados(
            datos, segmentos, int(etiqueta))
        if datos_procesados is None:
            print(f"Repeticion {num_repeticion} fallida. Inténtelo de nuevo.")
            continue

        guardar_en_mongo(datos_procesados, id_Registro, num_repeticion)
        print("Predicción con clf:", etiqueta)
        print(f"Repeticion {num_repeticion} completada y guardada.")
        exito = True


def principal(id_Registro, num_repeticion):
    procesar_toma(id_Registro, num_repeticion)


if __name__ == "__main__":
    print("Si vale")
    principal(1, 2)
