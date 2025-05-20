import amqplib from 'amqplib';
const EXCHANGE = 'delivery.exchange';
const QUEUE = 'delivery.queue';
const ROUTING_KEY = 'delivery.created';

export async function publishDeliveryCreated(delivery: any) {
  const conn = await amqplib.connect(process.env.RABBIT_URL!);
  const ch = await conn.createChannel();
  await ch.assertExchange(EXCHANGE, 'topic', { durable: true });
  ch.publish(EXCHANGE, ROUTING_KEY, Buffer.from(JSON.stringify(delivery)));
  await ch.close();
  await conn.close();
}
export async function consumeDeliveryQueue() {
  const conn = await amqplib.connect(process.env.RABBIT_URL!);
  const ch = await conn.createChannel();
  await ch.assertExchange(EXCHANGE, 'topic', { durable: true });
  await ch.assertQueue(QUEUE, { durable: true });
  await ch.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);
  ch.consume(QUEUE, msg => {
    ch.consume(QUEUE, (msg: any) => {
      if (msg) {
        console.log('Delivery event received:', msg.content.toString());
        ch.ack(msg);
      }
    });
  })
}