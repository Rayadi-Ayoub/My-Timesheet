import mongoose from 'mongoose';


const TacheSchema = new mongoose.Schema({
    nomtache:{
        type: String,
        required: true,
    },
    
    prixforfitaire:{
        type: Number,
        required: true,
    },
    
    },
    { timestamps: true });
    

export default mongoose.model('Tache', TacheSchema);