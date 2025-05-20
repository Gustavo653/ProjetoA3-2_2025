import mongoose from 'mongoose';

export interface IDriver {
  name: string;
  licenseNumber: string;
  phone?: string;
}

const DriverSchema = new mongoose.Schema<IDriver>({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  phone: String
}, { timestamps: true, versionKey: false });

export default mongoose.model('Driver', DriverSchema);