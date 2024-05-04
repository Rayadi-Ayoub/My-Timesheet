import mongoose from 'mongoose';

const SocieteSchema = new mongoose.Schema({
  noms:{
    type: String,
  },
  
},
{ timestamps: true }
);

export default mongoose.model('Societe', SocieteSchema);