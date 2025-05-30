import os
import json
import aio_pika
from redis_client import redis

EXCHANGE = "delivery.exchange"
QUEUE = "driver.pending.queue"
ROUTING_CREATED = "delivery.created"
ROUTING_STATUS = "delivery.statusUpdated"

_conn: aio_pika.RobustConnection | None = None
_channel: aio_pika.RobustChannel | None = None

async def get_channel() -> aio_pika.RobustChannel:
    global _conn, _channel
    if _conn is None:
        _conn = await aio_pika.connect_robust(
            os.getenv("RABBIT_URL", "amqp://rabbitmq")
        )
    if _channel is None:
        _channel = await _conn.channel()
        await _channel.set_qos(prefetch_count=10)
        await _channel.declare_exchange(
            EXCHANGE, aio_pika.ExchangeType.TOPIC, durable=True
        )
    return _channel

async def start_delivery_consumer() -> None:
    channel = await get_channel()
    exch = await channel.get_exchange(EXCHANGE)
    queue = await channel.declare_queue(QUEUE, durable=True)

    await queue.bind(exch, ROUTING_CREATED)
    await queue.bind(exch, ROUTING_STATUS)

    print(" [*] Waiting for delivery events. To exit press CTRL+C")
    async with queue.iterator() as queue_iter:
        async for msg in queue_iter:
            async with msg.process():
                delivery = json.loads(msg.body)
                driver_key = f"driver:{delivery['driverId']}:pending"
                rk = msg.routing_key

                if rk == ROUTING_CREATED:
                    await redis.rpush(driver_key, msg.body.decode())
                    await redis.expire(driver_key, 60 * 60 * 24)
                    print(f"[+] Stored new delivery {delivery['id']} for driver {delivery['driverId']}")

                elif rk == ROUTING_STATUS:
                    status = delivery.get("status")
                    if status == "delivered":
                        removed = await redis.lrem(driver_key, 0, json.dumps(delivery))
                        print(f"[-] Removed delivery {delivery['id']} (delivered) from driver {delivery['driverId']}'s pending list ({removed} entries removed)")
                    else:
                        print(f"[!] Received status update for delivery {delivery['id']}: {status} (no action taken)")

                else:
                    print(f"[!] Unknown routing key: {rk}")