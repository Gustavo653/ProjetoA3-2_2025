
import mongoose from 'mongoose';

export interface IDriver {
  name: string;
  licenseNumber: string;
  cpf?: string;
  registrationNumber?: string;
  phone?: string;
  password?: string;
}

const DriverSchema = new mongoose.Schema<IDriver>({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  cpf: { type: String, unique: true, sparse: true },
  registrationNumber: { type: String, unique: true, sparse: true },
  phone: String,
  password: { type: String, default: 'motorista' }
}, { timestamps: true, versionKey: false });

export default mongoose.model('Driver', DriverSchema);
