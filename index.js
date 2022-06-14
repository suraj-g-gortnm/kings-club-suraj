const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();

// routes
const user = require("./src/routes/auth");
const wallet = require("./src/routes/walletRoutes");
const challenges = require("./src/routes/challengeRoutes");
const privacyPolicy = require("./src/routes/privacyPolicy");

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// custom middlewares
app.use("/api/userData", user);
app.use("/api/walletData", wallet);
app.use("/api/challengesData", challenges);
app.use("/api/privacypolicy", privacyPolicy);

// const db =
//   "mongodb+srv://suraj:SURAJ@cluster0.84ifn.mongodb.net/kingsclub?retryWrites=true&w=majority";

const localDB = "mongodb://localhost:27017/kingsclub";
mongoose
  .connect(localDB)
  .then(() => console.log("Connected to mongodb"))
  .catch((error) => console.error("Could not connect to mongodb"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
