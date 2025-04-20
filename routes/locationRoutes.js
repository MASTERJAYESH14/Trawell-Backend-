const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Location = require("../models/Location"); // Import the Location model

// POST /api/locations - Save a new location
router.post("/locations", async (req, res) => {
  try {
    const { userId, startLocation, endLocation, distanceInKm } = req.body;

    // Validate the request body
    if (!userId || !startLocation || !endLocation || !distanceInKm) {
      return res.status(400).json({ error: "Missing required fields: userId, startLocation, endLocation, and distanceInKm" });
    }

    // Create a new location document
    const location = new Location({
      userId,
      startLocation,
      endLocation,
      distanceInKm,
    });

    // Save the location to the database
    const savedLocation = await location.save();

    // Respond with the saved location
    res.status(201).json(savedLocation);
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ error: "Failed to save location" });
  }
});

// GET /api/locations/:id - Get location by ID
router.get("/locations/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid location ID format" });
    }

    // Find the location by ID
    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

module.exports = router;