require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const { Kafka }  = require('kafkajs');
const { collectDefaultMetrics, register } = require('prom-client');

collectDefaultMetrics();
const app = express();
app.use(express.json());

// 🔗 MongoDB (opcional: banco separado ou o mesmo) ------------------------
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/fleet';
mongoose.connect(mongoUrl).then(() => console.log('Mongo connected (routing)'));

const routeSchema = new mongoose.Schema({
  truckId:     { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Truck' },
  origin:      { type: String },
  destination: { type: String, required: true },
  status:      { type: String, enum: ['scheduled','en-route','delivered','cancelled'], default: 'scheduled' },
  checkpoints: [{ lat:Number, lng:Number, ts:Date }]
}, { timestamps: true });

const Route = mongoose.model('Route', routeSchema);

// 📨 Kafka ----------------------------------------------------------------
const kafka    = new Kafka({ clientId: 'routing-service', brokers: [process.env.KAFKA_BROKER || 'kafka:9092'] });
const producer = kafka.producer();
(async () => await producer.connect())();

// 📑 CRUD de Rotas --------------------------------------------------------
app.route('/routes')
  .post(async (req, res) => {
    const route = await Route.create(req.body);
    await producer.send({ topic: 'route-updates', messages: [{ value: JSON.stringify(route) }] });
    res.status(201).json(route);
  })
  .get(async (_ , res) => res.json(await Route.find()));

app.route('/routes/:id')
  .get(async (req, res) => res.json(await Route.findById(req.params.id)))
  .put(async (req, res) => {
    const updated = await Route.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true });
    await producer.send({ topic:'route-updates', messages:[{ value: JSON.stringify(updated) }]});
    res.json(updated);
  })
  .delete(async (req, res) => { await Route.findByIdAndDelete(req.params.id); res.status(204).end(); });

// Health & metrics -------------------------------------------------------
app.get('/health', (_req, res) => res.json({ status:'ok' }));
app.get('/metrics', async (_req,res) => { res.set('Content-Type',register.contentType); res.end(await register.metrics()); });

app.listen(process.env.PORT || 3000, () => console.log('🛰  Routing service UP'));