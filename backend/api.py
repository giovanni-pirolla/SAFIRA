from fastapi import FastAPI, HTTPException, CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
import threading

from mqtt_client import iniciar_mqtt
from supabase_client import cadastrar_dispositivo

def iniciar_mqtt_em_background():
    iniciar_mqtt()
    
@asynccontextmanager
async def lifespan(app: FastAPI):
    thread_mqtt = threading.Thread(
        target=iniciar_mqtt_em_background,
        daemon=True
    )
    thread_mqtt.start()

    yield
    
    print("Desconectando do MQTT e encerrando a API...")

app = FastAPI(
    title="SAFIRA API",
    description="API responsável pela comunicação entre o aplicativo e o backend.",
    version="1.0.0"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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