import json
import os

import paho.mqtt.client as mqtt
from dotenv import load_dotenv

from supabase_client import (
    buscar_dispositivo_por_nome,
    salvar_leitura
)


load_dotenv()

MQTT_BROKER = os.getenv("MQTT_BROKER")
MQTT_PORT = int(os.getenv("MQTT_PORT", "8883"))
MQTT_USER = os.getenv("MQTT_USER")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")
MQTT_TOPIC = os.getenv("MQTT_TOPIC")
DEVICE_NAME = os.getenv("DEVICE_NAME")


def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print("Conectado ao HiveMQ Cloud!")

        client.subscribe(MQTT_TOPIC)

        print(f"Inscrito no tópico: {MQTT_TOPIC}")

    else:
        print(f"Falha na conexão com o HiveMQ. Código: {reason_code}")


def on_message(client, userdata, message):
    try:
        payload = message.payload.decode("utf-8")
        dados = json.loads(payload)

        luminosidade = dados.get("luminosidade")
        ruido = dados.get("ruido")

        if luminosidade is None or ruido is None:
            print("Leitura ignorada: campos ausentes.")
            return

        dispositivo = buscar_dispositivo_por_nome(DEVICE_NAME)

        if dispositivo is None:
            print(
                f"Leitura ignorada: dispositivo "
                f"'{DEVICE_NAME}' não cadastrado."
            )
            return

        if dispositivo["status"] is not True:
            print(
                f"Leitura ignorada: dispositivo "
                f"'{DEVICE_NAME}' está inativo."
            )
            return

        salvar_leitura(
            id_dispositivo=dispositivo["iddispositivos"],
            luminosidade=luminosidade,
            ruido=ruido
        )

        print(
            f"Leitura salva | "
            f"Dispositivo: {dispositivo['nome']} | "
            f"Luz: {luminosidade} | "
            f"Som: {ruido}"
        )

    except json.JSONDecodeError:
        print("Leitura ignorada: JSON inválido.")

    except Exception as erro:
        print(f"Erro ao processar leitura: {erro}")


def iniciar_mqtt():
    client = mqtt.Client(
        mqtt.CallbackAPIVersion.VERSION2
    )

    client.username_pw_set(
        MQTT_USER,
        MQTT_PASSWORD
    )

    client.tls_set()

    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(
        MQTT_BROKER,
        MQTT_PORT
    )

    client.loop_forever()
    
