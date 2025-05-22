import amqplib from 'amqplib';
const EXCHANGE = 'delivery.exchange';

export async function publishEvent(routingKey: string, payload: any) {
  const conn = await amqplib.connect(process.env.RABBIT_URL!);
  const ch = await conn.createChannel();
  await ch.assertExchange(EXCHANGE, 'topic', { durable: true });

  ch.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );

  await ch.close();
  await conn.close();
}