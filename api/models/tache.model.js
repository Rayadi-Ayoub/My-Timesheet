import mongoose from 'mongoose';


const TacheSchema = new mongoose.Schema({
    nomtache:{
        type: String,
        required: true,
    },
    
    prixforfitaire:{
        type: Number,
        required: true,
        default: 0,
    },
    
    },
    { timestamps: true });
    

export default mongoose.model('Tache', TacheSchema);