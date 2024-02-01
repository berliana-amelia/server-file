require("dotenv").config();
const express = require("express");
const mongose = require("mongoose");
const app = express();
const authRoute = require("./routes/authRoutes");
const dataRoute = require("./routes/dataRoutes");
const sensorRoute = require("./routes/sensorRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const cors = require("cors");

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const FRONTEND = process.env.FRONTEND;

var corsOptions = {
  origin: FRONTEND,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/auth", authRoute);
app.use("/data", dataRoute);
app.use("/sensor", sensorRoute);

app.get("/", (req, res) => {
  res.send("Hello NODE API");
});

// Middleware
app.use(errorMiddleware);

mongose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected to mongoDB");
    app.listen(PORT, () => {
      console.log(`running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
