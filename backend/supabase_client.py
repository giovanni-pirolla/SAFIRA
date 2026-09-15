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

def buscar_dispositivo_por_nome(nome: str):
    resposta = (
        supabase
        .table('dispositivos')
        .select('iddispositivos, idusuario, nome, status')
        .eq('nome', nome)
        .limit(1)
        .execute()
    )
    
    if not resposta.data:
        return None
    
    return resposta.data[0]

def salvar_leitura(
    id_dispositivo: str,
    luminosidade: int,
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

