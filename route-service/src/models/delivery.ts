import mongoose from 'mongoose';

export interface IDelivery extends mongoose.Document {
  driverId: mongoose.Types.ObjectId;
  truckId: mongoose.Types.ObjectId;
  origin: string;
  destination: string;
  status: 'pending' | 'en_route' | 'delivered';
}

const DeliverySchema = new mongoose.Schema<IDelivery>({
  driverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Driver' },
  truckId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Truck' },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, enum: ['pending', 'en_route', 'delivered'], default: 'pending' }
}, { timestamps: true, versionKey: false });

export default mongoose.model<IDelivery>('Delivery', DeliverySchema);
