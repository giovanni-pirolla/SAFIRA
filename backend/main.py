import threading
import uvicorn
from api import app
from mqtt_client import iniciar_mqtt

def iniciar_mqtt_em_background():
    iniciar_mqtt()

if __name__ == "__main__":
    thread_mqtt = threading.Thread(
        target=iniciar_mqtt_em_background,
        daemon=True
    )

    thread_mqtt.start()

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )