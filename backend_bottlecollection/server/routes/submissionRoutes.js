// routes/submissionRoutes.js
const express = require('express');
const {
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmission,
} = require('../controllers/submissionController');

const router = express.Router();

// Route to create a new submission
router.post('/submissions', createSubmission);

// Route to update an existing submission by ID
router.put('/submissions/:id', updateSubmission);

// Route to delete a submission by ID
router.delete('/submissions/:id', deleteSubmission);

// Route to get a submission by ID
router.get('/submissions/:id', getSubmission);

module.exports = router;
