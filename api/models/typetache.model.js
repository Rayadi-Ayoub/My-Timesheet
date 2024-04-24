import mongoose from "mongoose";

const TypeTacheSchema = new mongoose.Schema({
  typetache: String,

  taches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tache" }],
});

export default mongoose.model("TypeTache", TypeTacheSchema);
