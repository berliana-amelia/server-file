const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Inorwat = require("../models/sensorModel");
const authenticateToken = require("../middleware/authMiddleware");

router.put("/", authenticateToken, async (req, res) => {
  try {
    // Ensure that the user making the request has the necessary permissions

    const updatedData = req.body;

    // Update Inorwat data in the database
    const updatedInorwat = await Inorwat.findOneAndUpdate(
      { nama: "example" },
      updatedData,
      { new: true }
    );

    if (!updatedInorwat) {
      return res.status(404).send("Inorwat not found");
    }

    res.json({
      message: "Data updated successfully",
      ph: updatedInorwat.ph,
      motor: updatedInorwat.motor,
      temperature: updatedInorwat.temperature,
      amonia: updatedInorwat.amonia,
      sprayer: updatedInorwat.sprayer,
      humidity: updatedInorwat.humidity,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Existing GET endpoint
router.get("/", authenticateToken, async (req, res) => {
  try {
    const inorwat = await Inorwat.findOne({ nama: "example" });
    if (!inorwat) return res.status(404).send("Inorwat not found");

    res.json({
      message: "Data accessed successfully",
      ph: inorwat.ph,
      motor: inorwat.motor,
      temperature: inorwat.temperature,
      amonia: inorwat.amonia,
      sprayer: inorwat.sprayer,
      humidity: inorwat.humidity,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
