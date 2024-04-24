import mongoose from 'mongoose';

const SocieteSchema = new mongoose.Schema({
  noms: String,
});

export default mongoose.model('Societe', SocieteSchema);