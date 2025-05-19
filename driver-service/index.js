require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const { Kafka }  = require('kafkajs');
const { collectDefaultMetrics, register } = require('prom-client');

collectDefaultMetrics();
const app = express();
app.use(express.json());

// 🔗 MongoDB --------------------------------------------------------------
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/fleet';
mongoose.connect(mongoUrl)
        .then(() => console.log('Mongo connected'))
        .catch(err => console.error('Mongo error', err));

// 📦 Schemas --------------------------------------------------------------
const driverSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true }
}, { timestamps: true });

const truckSchema = new mongoose.Schema({
  plate:        { type: String, required: true, unique: true },
  model:        { type: String, required: true },
  capacityTon:  { type: Number, required: true },
  driverId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);
const Truck  = mongoose.model('Truck',  truckSchema);

// 📨 Kafka (para ouvir atualizações de rota) ------------------------------
const kafka     = new Kafka({ clientId: 'driver-service', brokers: [process.env.KAFKA_BROKER || 'kafka:9092'] });
const producer  = kafka.producer();
const consumer  = kafka.consumer({ groupId: 'driver-service' });
(async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: 'route-updates', fromBeginning: false });
  consumer.run({ eachMessage: async ({ message }) => console.log('📬 Route update:', message.value.toString()) });
})();

// 🛣 Rotas REST – Drivers -------------------------------------------------
app.route('/drivers')
  .post(async (req, res) => res.status(201).json(await Driver.create(req.body)))
  .get (async (_ , res) => res.json(await Driver.find()));

app.route('/drivers/:id')
  .get   (async (req, res) => res.json(await Driver.findById(req.params.id)))
  .put   (async (req, res) => res.json(await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })))
  .delete(async (req, res) => { await Driver.findByIdAndDelete(req.params.id); res.status(204).end(); });

// 🛻 Rotas REST – Trucks --------------------------------------------------
app.route('/trucks')
  .post(async (req, res) => res.status(201).json(await Truck.create(req.body)))
  .get (async (_ , res) => res.json(await Truck.find().populate('driverId')));

app.route('/trucks/:id')
  .get   (async (req, res) => res.json(await Truck.findById(req.params.id).populate('driverId')))
  .put   (async (req, res) => res.json(await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })))
  .delete(async (req, res) => { await Truck.findByIdAndDelete(req.params.id); res.status(204).end(); });

// 🔀 Proxy para criar rota de entrega (chama routing-service) -------------
const axios = require('axios');
app.post('/routes', async (req, res) => {
  try {
    const r = await axios.post(process.env.ROUTING_URL || 'http://routing-service:3000/routes', req.body);
    res.status(r.status).json(r.data);
  } catch (err) {
    console.error(err.message);
    res.status(502).json({ error: 'routing service unavailable' });
  }
});

// 📈 Prometheus -----------------------------------------------------------
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(process.env.PORT || 3000, () => console.log('🚚 Driver service UP'));