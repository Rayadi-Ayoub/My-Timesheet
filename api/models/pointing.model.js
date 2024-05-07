import mongoose from 'mongoose';

const PointingSchema = new mongoose.Schema(
  {
    timeStart: {
      type: String,
      required: true,
    },
    timeEnd: {
      type: String,
      required: true,
    },
    pole: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Pole',
    },
    societe: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Societe',
    },
    typeTache: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'TypeTache',
    },
    tache: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Tache',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    timeDifference: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  
 

);

const Pointing = mongoose.model('Pointing', PointingSchema);
export default Pointing;