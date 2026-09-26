from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from supabase_client import cadastrar_dispositivo

app = FastAPI(
    title="SAFIRA API",
    description="API responsável pela comunicação entre o aplicativo e o backend.",
    version="1.0.0"
)

class DispositivoCadastro(BaseModel):
    idusuario: str
    id_unico: str
    nome: str

@app.get("/")
def health_check():
    return {
        "mensagem": "SAFIRA funcionando!"
    }

@app.post("/dispositivos")
def cadastrar_novo_dispositivo(dispositivo: DispositivoCadastro):
    try:
        resultado = cadastrar_dispositivo(
            id_usuario=dispositivo.idusuario,
            nome=dispositivo.nome,
            id_unico=dispositivo.id_unico
        )

        return {
            "mensagem": "Dispositivo cadastrado com sucesso.",
            "dispositivo": resultado
        }

    except Exception as erro:

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao cadastrar dispositivo: {erro}"
        )