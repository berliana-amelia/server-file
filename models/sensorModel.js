const mongoose = require("mongoose");

const inorwatSchema = new mongoose.Schema({
  motor: Number,
  sprayer: Number,
  ph: Number,
  humidity: Number,
  amonia: Number,
  temperature: Number,
  nama: { type: String, unique: true },
});

const Inorwat = mongoose.model("Inorwat", inorwatSchema);

module.exports = Inorwat;
