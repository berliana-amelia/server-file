const express = require("express");
const router = express.Router();
const Inorwat = require("../models/sensorModel");
const authenticateToken = require("../middleware/authMiddleware");
const moment = require("moment-timezone");
const schedule = require("node-schedule");

// Function to update motor and sprayer status
const updateMotorAndSprayerStatus = async (inorwat) => {
  try {
    // Check if startStatus is 1
    if (inorwat.startStatus === 1) {
      const now = new Date();

      // Extract hours and minutes from the start time
      const [startHour, startMinute] = inorwat.startTime.split(":");

      // Set the scheduled time based on the start time
      const scheduledTime = new Date(now);
      scheduledTime.setHours(Number(startHour), Number(startMinute), 0, 0); // Set hours, minutes, seconds, and milliseconds

      // Check if the current time is within a 5-minute range of the scheduled time
      const timeDifference = Math.abs(now.getTime() - scheduledTime.getTime());
      const withinRange = timeDifference <= 2 * 60 * 1000; // 5 minutes in milliseconds

      if (withinRange) {
        // Set motor and sprayer to 1
        inorwat.motor = 1;
        inorwat.sprayer = 1;
        console.log("change to 1");
        // Save the changes to the document
        await inorwat.save();

        // Schedule a job to reset motor and sprayer after 15 minutes
        schedule.scheduleJob(
          new Date(now.getTime() + 15 * 60 * 1000),
          async () => {
            // Reset motor and sprayer to 0
            inorwat.motor = 0;
            inorwat.sprayer = 0;
            console.log("change to 0");
            // Save the changes to the document after 15 minutes
            await inorwat.save();
          }
        );
      }
    }
  } catch (error) {
    console.error("Error updating motor and sprayer status:", error.message);
  }
};

// Schedule the job every hour
const scheduleJob = schedule.scheduleJob("0 * * * *", async () => {
  try {
    // Find documents with startStatus value 1
    const inorwats = await Inorwat.find({ startStatus: 1 });

    // Update motor and sprayer status for each document
    inorwats.forEach(async (inorwat) => {
      updateMotorAndSprayerStatus(inorwat);
    });
  } catch (error) {
    console.error("Error updating motor and sprayer status:", error.message);
  }
});

router.put("/", authenticateToken, async (req, res) => {
  try {
    const updatedData = req.body;

    // Find the current document
    const currentInorwat = await Inorwat.findOne({ nama: "example" });

    if (!currentInorwat) {
      return res.status(404).send("Inorwat not found");
    }

    // Update the endDate based on the new startDate + 5 days
    if (updatedData.startDate) {
      const newEndDate = new Date(updatedData.startDate);
      newEndDate.setDate(newEndDate.getDate() + 5);
      updatedData.endDate = newEndDate;
    }

    // Check if startStatus is changed to 1
    if (updatedData.startStatus === 1) {
      // Update startTime to the current time in the format "15:59"
      const currentTime = moment().tz("Asia/Jakarta").format("HH:mm");
      updatedData.startTime = currentTime;
    }

    // Perform the update
    const updatedInorwat = await Inorwat.findOneAndUpdate(
      { nama: "example" },
      updatedData,
      { new: true }
    );

    res.json({
      message: "Data updated successfully",
      motor: updatedInorwat.motor,
      temperature: updatedInorwat.temperature,
      sprayer: updatedInorwat.sprayer,
      humidity: updatedInorwat.humidity,
      endDate: updatedInorwat.endDate,
      startDate: updatedInorwat.startDate,
      startTime: updatedInorwat.startTime,
      startStatus: updatedInorwat.startStatus,
      lastOnline: updatedInorwat.lastOnline,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.post("/", authenticateToken, async (req, res) => {
  try {
    const newInorwat = await Inorwat.create(req.body);
    return res.status(201).json(newInorwat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const inorwat = await Inorwat.findOneAndUpdate(
      { nama: "example" },
      { $set: { timestamp: new Date() } },
      { new: true }
    );

    if (!inorwat) return res.status(404).send("Inorwat not found");

    // Update motor and sprayer status based on startStatus
    await updateMotorAndSprayerStatus(inorwat);

    res.json({
      message: "Data accessed successfully",
      motor: inorwat.motor,
      temperature: inorwat.temperature,
      sprayer: inorwat.sprayer,
      humidity: inorwat.humidity,
      startTime: inorwat.startTime,
      startStatus: inorwat.startStatus,
      endDate: inorwat.endDate,
      startDate: inorwat.startDate,
      lastOnline: inorwat.lastOnline,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
