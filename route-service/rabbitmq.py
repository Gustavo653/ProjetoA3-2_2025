import os, json, asyncio
import aio_pika

EXCHANGE = "delivery.exchange"

async def publish_event(routing_key: str, payload: any):
    conn    = await aio_pika.connect_robust(os.getenv("RABBIT_URL", "amqp://rabbitmq"))
    ch      = await conn.channel()
    exch    = await ch.declare_exchange(EXCHANGE, aio_pika.ExchangeType.TOPIC, durable=True)
    msg     = aio_pika.Message(body=json.dumps(payload).encode())
    await exch.publish(msg, routing_key=routing_key)
    await ch.close()
    await conn.close()
