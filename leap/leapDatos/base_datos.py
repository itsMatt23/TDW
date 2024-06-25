from pymongo import MongoClient

BASE_DATOS = 'terapias'
COLECCION_LEAP_MOTION = 'LEAP_MOTION'


def conectar_mongo(db_name, collection_name):
    cliente = MongoClient("mongodb://localhost:27017/")
    db = cliente[db_name]
    coleccion = db[collection_name]
    return coleccion


def guardar_en_mongo(datos_procesados, sesionID, num_repeticion):
    try:
        coleccion = conectar_mongo(BASE_DATOS, COLECCION_LEAP_MOTION)
        filtro = {'id_Registro': sesionID, 'num_repeticion': num_repeticion}
        actualizacion = {'$set': datos_procesados}
        
        resultado = coleccion.update_one(filtro, actualizacion, upsert=True)
        if resultado.upserted_id is not None:
            print(
                f"Se insertó un nuevo documento en MongoDB con id: {resultado.upserted_id}")
        else:
            print(f"Se actualizó el documento existente en MongoDB")

    except Exception as e:
        print(f"Error al insertar o actualizar documentos: {str(e)}")
        exit(1)
