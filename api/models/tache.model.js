import mongoose from 'mongoose';


const TacheSchema = new mongoose.Schema({
    nomtache: String,
    prixforfitaire: Number,
   
    });

export default mongoose.model('Tache', TacheSchema);