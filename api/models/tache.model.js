import mongoose from 'mongoose';

const TacheSchema = new mongoose.Schema({
  nomtache: {
    type: String,
    required: true,
  },
  prixforfitaire: {
    type: Number,
    required: function() {
      return this.prixType === 'forfitaire';
    },
    default: 0,
  },
  prixType: {
    type: String,
    required: true,
    enum: ['forfitaire', 'horraire'],
  },
  prixHoraire: {
    type: Number,
    required: function() {
      return this.prixType === 'horraire';
    },
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model('Tache', TacheSchema);
