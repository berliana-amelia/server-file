const mongoose = require("mongoose");

const inorwatSchema = new mongoose.Schema({
  motor: Number,
  sprayer: Number,
  humidity: Number,
  temperature: Number,
  nama: { type: String, unique: true },
  endDate: Date,
  startDate: Date,
  startTime: String,
  startStatus: Number,
  lastOnline: String,
});

// Pre-save middleware to calculate endDate
inorwatSchema.pre("save", function (next) {
  // Check if startDate exists and endDate is not set
  if (this.startDate && !this.endDate) {
    // Calculate endDate by adding 5 days to startDate
    const fiveDaysLater = new Date(this.startDate);
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

    // Set the calculated endDate
    this.endDate = fiveDaysLater;
  }

  next();
});

const Inorwat = mongoose.model("Inorwat", inorwatSchema);

module.exports = Inorwat;
