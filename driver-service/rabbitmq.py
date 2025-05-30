import os, json, asyncio
import aio_pika
from redis_client import redis

EXCHANGE = "delivery.exchange"
QUEUE    = "driver.pending.queue"
ROUTING  = "delivery.created"

async def start_delivery_consumer():
    conn    = await aio_pika.connect_robust(os.getenv("RABBIT_URL", "amqp://rabbitmq"))
    channel = await conn.channel()
    exch    = await channel.declare_exchange(EXCHANGE, aio_pika.ExchangeType.TOPIC, durable=True)
    queue   = await channel.declare_queue(QUEUE, durable=True)
    await queue.bind(exch, ROUTING)

    async with queue.iterator() as it:
        async for msg in it:
            async with msg.process():
                delivery = json.loads(msg.body)
                key = f"driver:{delivery['driverId']}:pending"
                await redis.rpush(key, json.dumps(delivery))
                await redis.expire(key, 60*60*24)
                print(f"Stored delivery for driver {delivery['driverId']}")
