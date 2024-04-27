import mongoose from 'mongoose';

const PoleSchema = new mongoose.Schema({
  NomP:{
    type: String,
  },
  
  location:{
    type: String,
  },
 
  imagepole:{
    type: String,
  },

  societes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Societe' }]

},
{ timestamps: true });

export default mongoose.model('Pole', PoleSchema);