import os

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

def buscar_dispositivo_por_id_unico(id_unico: str):
    resposta = (
        supabase
        .table('dispositivos')
        .select('iddispositivos, idusuario, nome, status, id_unico')
        .eq('id_unico', id_unico)
        .limit(1)
        .execute()
    )
    
    if not resposta.data:
        return None
    
    return resposta.data[0]

def buscar_usuario_por_dispositivo(id_unico: str):
    resposta = (
        supabase
        .table('dispositivos')
        .select('idusuario')
        .eq('id_unico', id_unico)
        .limit(1)
        .execute()
    )
    
    if not resposta.data:
        return None
    
    return resposta.data[0]

def buscar_limites_sensoriais(idusuario: str):
    resposta = (
        supabase
        .table('usuario')
        .select('limites_som, limites_luz')
        .eq('id', idusuario)
        .limit(1)
        .execute()
    )

    if not resposta.data:
        return None

    return resposta.data[0]

def buscar_limites_por_dispositivo(id_unico: str):
    usuario = buscar_usuario_por_dispositivo(id_unico)

    if usuario is None:
        return None

    idusuario = usuario["idusuario"]

    return buscar_limites_sensoriais(idusuario)

def salvar_leitura(
    id_dispositivo: str,
    luminosidade: float,
    ruido: int
):
    dados = {
        "iddispositivos": id_dispositivo,
        "luminosidade": luminosidade,
        "temperatura": None,
        "ruidos": ruido
    }

    resposta = (
        supabase
        .table("leituradossensores")
        .insert(dados)
        .execute()
    )

    return resposta.data

def cadastrar_dispositivo(id_usuario: str, nome: str, id_unico:str):
    dados = {
        "idusuario": id_usuario,
        "nome": nome,
        "id_unico": id_unico,
        "status": True
    }

    resposta = (
        supabase
        .table("dispositivos")
        .insert(dados)
        .execute()
    )

    return resposta.data