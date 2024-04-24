import mongoose from 'mongoose';

const PoleSchema = new mongoose.Schema({
  NomP: String,
  location: String,
  imagepole: String,
  societes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Societe' }]
});

export default mongoose.model('Pole', PoleSchema);