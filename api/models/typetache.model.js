import mongoose from "mongoose";

const TypeTacheSchema = new mongoose.Schema({
  typetache: {
    type: String,
    required: true,
  },

  taches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tache" }],
},
{ timestamps: true });

export default mongoose.model("TypeTache", TypeTacheSchema);
