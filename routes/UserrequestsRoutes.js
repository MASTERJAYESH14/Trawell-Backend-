const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// MongoDB Connection (Agency Database)
const agencyConnection = mongoose.createConnection(
  'mongodb+srv://MasterJayesh:trawell%40123@trawell.zn1kld5.mongodb.net/agency?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Define the schema for requests
const requestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  tripType: { type: String, required: true },
  fare: { type: Number, required: true },
  city: { type: String, required: true, default: 'Default City' },
  dateTime: { type: Date, required: true }, // Add dateTime field
  carType: { type: String, required: true }, // Add carType field
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// Create the Request model using the agency connection
const Request = agencyConnection.model('Request', requestSchema);

// POST /requests - Save a Trip Request
router.post('/', async (req, res) => {
  const { userId, startLocation, endLocation, tripType, fare, city, dateTime, carType } = req.body; // Destructure dateTime and carType

  try {
    // Validate required fields
    if (!userId || !startLocation || !endLocation || !tripType || !fare || !city || !dateTime || !carType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRequest = new Request({
      userId,
      startLocation,
      endLocation,
      tripType,
      fare,
      city,
      dateTime, // Save the dateTime
      carType, // Save the car type
      status: 'pending', // Default status
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request created successfully.' });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Failed to create request.' });
  }
});

module.exports = router;