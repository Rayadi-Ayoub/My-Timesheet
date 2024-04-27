import mongoose from "mongoose";

const PointingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },

    location: {
      type: String,
    },

    noms: {
      type: String,
    },

    heuresdetravaillees: {
      type: Number,
    },

    typetache: {
      type: String,
    },

    nomtache: {
      type: String,
    },

    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    Users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    TypeTaches: [{ type: mongoose.Schema.Types.ObjectId, ref: "TypeTache" }],
    
    taches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tache" }],

    societes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Societe" }],
  },
  { timestamps: true }
);

export default mongoose.model("Pointing", PointingSchema);
