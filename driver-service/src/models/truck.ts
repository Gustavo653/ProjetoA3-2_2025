import mongoose from 'mongoose';

export interface ITruck {
  plate: string;
  model: string;
  capacityKg?: number;
}

const TruckSchema = new mongoose.Schema<ITruck>({
  plate: { type: String, required: true, unique: true },
  model: String,
  capacityKg: Number
}, { timestamps: true, versionKey: false });

export default mongoose.model('Truck', TruckSchema);