import numpy as np
from scipy.signal import cheby2, filtfilt

def to_array(data):
    return np.array(data)


def aplicar_filtro_cheby(vector, corte, fs, orden=5):
    nyquist = 0.5 * fs
    corte_normalizado = corte / nyquist
    b, a = cheby2(orden, 5, corte_normalizado, btype='low')
    padlen = 3 * max(len(b), len(a))
    if len(vector) > padlen:
        return filtfilt(b, a, vector)
    print(
        f"Advertencia: No hay suficientes puntos de datos para el filtrado. Se requiere > {padlen}, se obtuvo {len(vector)}.")
    return vector


def calcular_segmentos(frames_con_datos, segmentos_deseados=70):
    if frames_con_datos < segmentos_deseados:
        print("Menos de 70 frames con datos. No hay suficientes frames para calcular segmentos.")
        return []
    frames_por_segmento, frames_extras = divmod(
        frames_con_datos, segmentos_deseados)
    return [(i * frames_por_segmento + min(i, frames_extras), (i + 1) * frames_por_segmento + min(i + 1, frames_extras) - 1) for i in range(segmentos_deseados)]


def calcular_promedio_segmentos(data, segmentos, calcular_suma_func, es_direccion=False):
    resultados = []
    for inicio, fin in segmentos:
        suma_segmento = [0, 0, 0] if es_direccion else 0
        num_frames = 0
        for frame in range(inicio, fin + 1):
            if frame < len(data):
                suma_actual = calcular_suma_func(data[frame]['dedos'])
                if es_direccion:
                    suma_segmento = [suma_segmento[i] +
                                     suma_actual[i] for i in range(3)]
                else:
                    suma_segmento += sum(suma_actual)
                num_frames += 1
        if num_frames > 0:
            if es_direccion:
                promedio = [-suma_segmento[i] / num_frames for i in range(3)]
                resultados.append([round(val, 2) for val in promedio])
            else:
                promedio = -suma_segmento / num_frames
                resultados.append(round(promedio, 2))
        else:
            resultados.append([0, 0, 0] if es_direccion else 0)
    return resultados


def calcular_suma_coordenadas(dedos):
    return [sum(dedo['posicion'][i] for dedo in dedos) for i in range(3)]


def calcular_suma_direcciones(dedos):
    return [sum(dedo['direccion'][i] for dedo in dedos) for i in range(3)]


def normalizar_vector(vector):
    min_val, max_val = min(vector), max(vector)
    return [round((x - min_val) / (max_val - min_val), 5) for x in vector]


def crear_vector(data):
    frames_con_datos = data['framesConDatos']
    datos = data['datos']
    segmentos = calcular_segmentos(frames_con_datos)
    if not segmentos:
        return [], [], [], [], [], []
    promedios_segmentos_posiciones = calcular_promedio_segmentos(
        datos, segmentos, calcular_suma_coordenadas)
    promedios_segmentos_direcciones = calcular_promedio_segmentos(
        datos, segmentos, calcular_suma_direcciones, es_direccion=True)
    promedios_filtrados = aplicar_filtro_cheby(
        promedios_segmentos_posiciones, 10, 140)
    normalizados = normalizar_vector(promedios_filtrados)
    return datos, promedios_segmentos_posiciones, promedios_segmentos_direcciones, promedios_filtrados, normalizados, segmentos


def procesar_datos_promediados(data, segmentos, etiqueta):
    array_datos_mano = []
    for inicio, fin in segmentos:
        frames = [data[frame]
                  for frame in range(inicio, min(fin + 1, len(data)))]
        if len(frames) > 70:
            frames = frames[:70]
        dedos_posiciones = np.mean([np.array(
            [dedo['posicion'] for dedo in frame['dedos']]) for frame in frames], axis=0)
        dedos_direcciones = np.mean([np.array(
            [dedo['direccion'] for dedo in frame['dedos']]) for frame in frames], axis=0)
        muneca = np.mean([frame['muneca'] for frame in frames], axis=0)
        array_datos_mano.append({
            'dedos_posiciones': dedos_posiciones.tolist(),
            'dedos_direcciones': dedos_direcciones.tolist(),
            'muneca': muneca.tolist()
        })
    return {'etiqueta': etiqueta, 'array_datos_mano': array_datos_mano} if array_datos_mano else None
