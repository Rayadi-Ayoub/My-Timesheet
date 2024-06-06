import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    matricule: {
      type: String,
      required: true,
      unique: true,
    },
    poste: {
      type: String,
      required: true,
      default: "basic",
      enum: ["user", "controller", "manager", "admin"],
    },
    departement: {
      type: String,
      required: true,
    },
    hiringDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    employeeCost: {
      type: Number,
      required: true,
      default: 0,
    },
    billingcost: {
      type: Number,
      required: true,
      default: 0,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
