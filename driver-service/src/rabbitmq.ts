import amqplib from 'amqplib';
import { redis } from './redis.js';

const EXCHANGE = 'delivery.exchange';
const QUEUE    = 'driver.pending.queue';
const ROUTING  = 'delivery.created';

const keyFor = (driverId: string) => `driver:${driverId}:pending`;

export async function getPendingDeliveries(driverId: string) {
  const raw = await redis.lrange(keyFor(driverId), 0, -1);
  return raw.map(item => JSON.parse(item));
}

export async function startDeliveryConsumer() {
  const conn = await amqplib.connect(process.env.RABBIT_URL!);
  const ch   = await conn.createChannel();

  await ch.assertExchange(EXCHANGE, 'topic', { durable: true });
  await ch.assertQueue(QUEUE,          { durable: true });
  await ch.bindQueue(QUEUE, EXCHANGE, ROUTING);

  ch.consume(QUEUE, async msg => {
    if (!msg) return;
    const delivery = JSON.parse(msg.content.toString());
    const dId = delivery.driverId as string;

    await redis.rpush(keyFor(dId), JSON.stringify(delivery));
    await redis.expire(keyFor(dId), 60 * 60 * 24);

    console.log(`📦  Nova entrega armazenada para o motorista ${dId}`);
    ch.ack(msg);
  });

  console.log('✅  Driver-service consumindo do RabbitMQ');
}