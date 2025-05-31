import mongoose from 'mongoose';

export interface IUsuario {
  usuario: string;
  senha: string;
}

const UsuarioSchema = new mongoose.Schema<IUsuario>({
  usuario: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
}, { timestamps: true, versionKey: false });

export default mongoose.model('Usuario', UsuarioSchema);
