import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
    {
        nomPr: {
            type: String,
        },
        description: {
            type: String,
        },
        societe_concernes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Societe" }],
        date_debut: {
            type: Date,
        },
        date_fin: {
            type: Date,
        },
        budget: {
            type: Number,
        },
        stage: {
            type: String,
            default: "todo",
        },
        pole: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pole",
        },
        tache: {
            type: String,
        },
        employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default mongoose.model("Projet", ProjectSchema);
