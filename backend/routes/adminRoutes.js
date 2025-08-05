const express = require('express');
const router = express.Router();

// Import your auth and admin middleware
const protect = require('../middleware/authMiddleware'); // adjust the path
const isAdmin = require('../middleware/isAdmin'); // adjust the path
