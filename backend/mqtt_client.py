import json
import os

import paho.mqtt.client as mqtt
from dotenv import load_dotenv

from supabase_client import (
    buscar_dispositivo_por_id_unico,
    salvar_leitura
)

load_dotenv()

MQTT_BROKER = os.getenv("MQTT_BROKER")
MQTT_PORT = int(os.getenv("MQTT_PORT", "8883"))
MQTT_USER = os.getenv("MQTT_USER")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")
MQTT_TOPIC = os.getenv("MQTT_TOPIC")


def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print("Conectado ao HiveMQ Cloud!")

        client.subscribe(MQTT_TOPIC)

        print(f"Inscrito no tópico: {MQTT_TOPIC}")

        client.subscribe("safira/devices/+/status/request")

        print(
            "Inscrito no tópico: "
            "safira/devices/+/status/request"
        )

    else:
        print(
            f"Falha na conexão com o HiveMQ. "
            f"Código: {reason_code}"
        )


def publicar_status_dispositivo(client, id_unico, cadastrado):
    topico_status = f"safira/devices/{id_unico}/status"

    mensagem = json.dumps({
        "cadastrado": cadastrado
    })

    client.publish(
        topico_status,
        mensagem
    )

    print(
        f"Status enviado | "
        f"Dispositivo: {id_unico} | "
        f"Cadastrado: {cadastrado}"
    )


def processar_solicitacao_status(client, message):
    partes_topico = message.topic.split("/")

    if len(partes_topico) != 5:
        print(
            f"Solicitação ignorada: tópico inválido "
            f"'{message.topic}'."
        )
        return

    if (
        partes_topico[0] != "safira"
        or partes_topico[1] != "devices"
        or partes_topico[3] != "status"
        or partes_topico[4] != "request"
    ):
        print(
            f"Solicitação ignorada: tópico inválido "
            f"'{message.topic}'."
        )
        return

    id_unico = partes_topico[2]

    print(
        f"Solicitação de status recebida | "
        f"Dispositivo: {id_unico}"
    )

    dispositivo = buscar_dispositivo_por_id_unico(id_unico)

    if dispositivo is None:
        publicar_status_dispositivo(
            client,
            id_unico,
            False
        )

        print(
            f"Dispositivo '{id_unico}' não cadastrado."
        )

        return

    publicar_status_dispositivo(
        client,
        id_unico,
        True
    )

    print(
        f"Dispositivo '{id_unico}' cadastrado."
    )


def processar_telemetria(client, message):
    partes_topico = message.topic.split("/")

    if len(partes_topico) != 4:
        print(
            f"Leitura ignorada: tópico inválido "
            f"'{message.topic}'."
        )
        return

    if (
        partes_topico[0] != "safira"
        or partes_topico[1] != "devices"
        or partes_topico[3] != "telemetry"
    ):
        print(
            f"Leitura ignorada: tópico inválido "
            f"'{message.topic}'."
        )
        return

    id_unico = partes_topico[2]

    print(
        f"Dispositivo identificado: {id_unico}"
    )

    payload = message.payload.decode("utf-8")
    dados = json.loads(payload)

    luminosidade = dados.get("luminosidade")
    ruido = dados.get("ruido")

    if luminosidade is None or ruido is None:
        print("Leitura ignorada: campos ausentes.")
        return

    dispositivo = buscar_dispositivo_por_id_unico(id_unico)

    if dispositivo is None:
        print(
            f"Leitura ignorada: dispositivo "
            f"'{id_unico}' não cadastrado."
        )
        return

    if dispositivo["status"] is not True:
        print(
            f"Leitura ignorada: dispositivo "
            f"'{id_unico}' está inativo."
        )
        return

    salvar_leitura(
        id_dispositivo=dispositivo["iddispositivos"],
        luminosidade=luminosidade,
        ruido=ruido
    )

    print(
        f"Leitura salva | "
        f"Dispositivo: {id_unico} | "
        f"Luz: {luminosidade} | "
        f"Som: {ruido}"
    )


def on_message(client, userdata, message):
    try:
        if message.topic.endswith("/status/request"):
            processar_solicitacao_status(
                client,
                message
            )

        elif message.topic.endswith("/telemetry"):
            processar_telemetria(
                client,
                message
            )

        else:
            print(
                f"Mensagem ignorada: tópico não reconhecido "
                f"'{message.topic}'."
            )

    except json.JSONDecodeError:
        print("Mensagem ignorada: JSON inválido.")

    except Exception as erro:
        print(
            f"Erro ao processar mensagem: {erro}"
        )


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