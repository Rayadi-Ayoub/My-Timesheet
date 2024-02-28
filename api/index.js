import Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./routes/user.route.js";
import registerRoutes from "./routes/register.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });



const app = Express();

app.use(Express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


app.use("/api/user", userRoutes);
app.use("/api/register", registerRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode || 500;
const message = res.message || "Internal Server Error";
res.status(statusCode).json({
  success: false,
  statusCode,
  message,
   });
});