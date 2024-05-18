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
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },

  societes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Societe' }]

},
{ timestamps: true });

export default mongoose.model('Pole', PoleSchema);