// controllers/submissionController.js
const Submission = require('../models/Submission'); // Import the Submission model

// Create a new submission
const createSubmission = async (req, res) => {
  try {
    const submissionData = req.body;

    // Create a new submission entry
    const newSubmission = new Submission(submissionData);

    // Save the submission in the database
    await newSubmission.save();

    res.status(201).json({
      message: 'Submission created successfully!',
      data: newSubmission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the submission.' });
  }
};

// Update an existing submission by its ID
const updateSubmission = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  const updatedData = req.body;

  try {
    // Find and update the submission
    const updatedSubmission = await Submission.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedSubmission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({
      message: 'Submission updated successfully!',
      data: updatedSubmission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the submission.' });
  }
};

// Delete a submission by its ID
const deleteSubmission = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSubmission = await Submission.findByIdAndDelete(id);

    if (!deletedSubmission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({
      message: 'Submission deleted successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the submission.' });
  }
};

// Get a single submission by its ID
const getSubmission = async (req, res) => {
  const { id } = req.params;

  try {
    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({
      message: 'Submission retrieved successfully!',
      data: submission,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'An error occurred while retrieving the submission.' });
  }
};

module.exports = {
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmission,
};
