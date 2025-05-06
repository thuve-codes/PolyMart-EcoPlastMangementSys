// const PlasticRequest = require('../models/PlasticRequest');
// const ErrorResponse = require('../utils/errorResponse');
// const asyncHandler = require('../middleware/async');
// const sendEmail = require('../utils/email');
//
// // @desc    Get all plastic requests
// // @route   GET /api/requests
// // @access  Private/Admin
// exports.getRequests = asyncHandler(async (req, res, next) => {
//   res.status(200).json(res.advancedResults);
// });
//
// // @desc    Get single plastic request
// // @route   GET /api/requests/:id
// // @access  Private/Admin
// exports.getRequest = asyncHandler(async (req, res, next) => {
//   const request = await PlasticRequest.findById(req.params.id)
//     .populate('user', 'name email')
//     .populate('processedBy', 'name email');
//
//   if (!request) {
//     return next(
//       new ErrorResponse(`Request not found with id of ${req.params.id}`, 404)
//     );
//   }
//
//   res.status(200).json({
//     success: true,
//     data: request
//   });
// });
//
// // @desc    Create plastic request
// // @route   POST /api/requests
// // @access  Private
// exports.createRequest = asyncHandler(async (req, res, next) => {
//   // Add user to req.body
//   req.body.user = req.user.id;
//
//   const request = await PlasticRequest.create(req.body);
//
//   // Send notification email to admin
//   const message = `New plastic collection request received from ${req.user.name}.`;
//
//   try {
//     await sendEmail({
//       email: 'admin@polymart.com',
//       subject: 'New Plastic Collection Request',
//       message
//     });
//   } catch (err) {
//     console.error('Email could not be sent');
//   }
//
//   res.status(201).json({
//     success: true,
//     data: request
//   });
// });
//
// // @desc    Update plastic request status
// // @route   PUT /api/requests/:id
// // @access  Private/Admin
// exports.updateRequest = asyncHandler(async (req, res, next) => {
//   const { status, notes } = req.body;
//
//   let request = await PlasticRequest.findById(req.params.id);
//
//   if (!request) {
//     return next(
//       new ErrorResponse(`Request not found with id of ${req.params.id}`, 404)
//     );
//   }
//
//   // Update status and processed info
//   request.status = status;
//   request.processedBy = req.user.id;
//   request.processedAt = Date.now();
//   if (notes) request.notes = notes;
//
//   await request.save();
//
//   // Send status update email to user
//   const user = await User.findById(request.user);
//   if (user) {
//     const message = `Your plastic collection request (ID: ${request._id}) has been ${status}.`;
//
//     try {
//       await sendEmail({
//         email: user.email,
//         subject: 'Plastic Collection Request Update',
//         message
//       });
//     } catch (err) {
//       console.error('Email could not be sent');
//     }
//   }
//
//   res.status(200).json({
//     success: true,
//     data: request
//   });
// });
//
// // @desc    Get plastic collection statistics
// // @route   GET /api/requests/stats
// // @access  Private/Admin
// exports.getRequestStats = asyncHandler(async (req, res, next) => {
//   const stats = await PlasticRequest.aggregate([
//     {
//       $unwind: '$plastics'
//     },
//     {
//       $group: {
//         _id: '$plastics.type',
//         totalKgs: { $sum: '$plastics.kgs' },
//         count: { $sum: 1 }
//       }
//     },
//     {
//       $project: {
//         plasticType: '$_id',
//         totalKgs: 1,
//         count: 1,
//         _id: 0
//       }
//     }
//   ]);
//
//   res.status(200).json({
//     success: true,
//     data: stats
//   });
// });

const Bottle = require("../models/Bottle");

// CREATE a new bottle
exports.createRequest = async (req, res) => {
  try {
    const bottle = await Bottle.create(req.body);
    res.status(201).json({ success: true, data: bottle });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// READ all bottles
exports.getRequests = async (req, res) => {
  try {
    const bottles = await Bottle.find();
    res.status(200).json({ success: true, data: bottles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// READ a single bottle by ID
exports.getRequest = async (req, res) => {
  try {
    const bottle = await Bottle.findById(req.params.id);
    if (!bottle)
      return res
        .status(404)
        .json({ success: false, message: "Bottle not found" });
    res.status(200).json({ success: true, data: bottle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE a bottle by ID
exports.updateRequest = async (req, res) => {
  try {
    const updatedBottle = await Bottle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedBottle)
      return res
        .status(404)
        .json({ success: false, message: "Bottle not found" });
    res.status(200).json({ success: true, data: updatedBottle });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE a bottle by ID
exports.deleteRequest = async (req, res) => {
  try {
    const bottle = await Bottle.findByIdAndDelete(req.params.id);
    if (!bottle)
      return res
        .status(404)
        .json({ success: false, message: "Bottle not found" });
    res
      .status(200)
      .json({ success: true, message: "Bottle deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
