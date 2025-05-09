const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db'); // Connect to the user database
const userRoutes = require('./routes/userRoutes'); // Use userRoutes.js
const rideRoutes = require('./routes/rideRoutes'); // Use rideRoutes.js
const locationRoutes = require('./routes/locationRoutes'); // Use locationRoutes.js
const tripRoutes = require('./routes/tripRoutes'); // Use tripRoutes.js
const userRequestsRoutes = require('./routes/UserrequestsRoutes'); // Import the route

// Connect to the database
connectToDb();

// Middleware
const allowedOrigins = [
  'https://trawell-frontend.vercel.app',
  'https://trawell-frontend-r9t4g5fvi-masterjayesh14s-projects.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS
  credentials: true
}));

// Explicitly handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
    res.send('BACKEND CONNECTED');
});

// Register routes
app.use('/users', userRoutes); // Register user routes
app.use('/rides', rideRoutes); // Register ride routes
app.use('/api', locationRoutes); // Register location routes
app.use('/trips', tripRoutes); // Register trip routes
app.use('/requests', userRequestsRoutes); // Register the requests route

// Fallback route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

module.exports = app;