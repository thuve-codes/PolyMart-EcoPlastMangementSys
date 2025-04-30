const express = require('express');
const router = express.Router();
const { handleGenerateReport } = require('../controllers/reportController');  // Import the controller function

// Define the route to generate the report
router.get('/generate-report', handleGenerateReport);

module.exports = router;
