const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');

const PlasticItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'Other'],
    required: [true, 'Please specify plastic type'],
  },
  kgs: {
    type: Number,
    required: [true, 'Please specify weight in kilograms'],
    min: [0.1, 'Weight must be at least 0.1 kg'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
});

const PlasticRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Request must belong to a user'],
  },
  collectionDate: {
    type: Date,
    required: [true, 'Please specify collection date'],
  },
  collectionAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  plastics: {
    type: [PlasticItemSchema],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: 'At least one plastic item must be specified',
    },
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Collected', 'Rejected', 'Cancelled'],
    default: 'Pending',
  },
  images: [{
    url: String,
    publicId: String,
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters'],
  },
  processedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  processedAt: Date,
  collectionProof: {
    images: [{
      url: String,
      publicId: String,
    }],
    collectedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    collectedAt: Date,
    notes: String,
  },
  rewardPoints: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Calculate total weight of plastics
PlasticRequestSchema.virtual('totalWeight').get(function () {
  return this.plastics.reduce((total, item) => total + item.kgs, 0);
});

// Update the updatedAt field before saving
PlasticRequestSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Cascade delete related data when a request is deleted
PlasticRequestSchema.pre('remove', async function (next) {
  console.log(`Removing request ${this._id}`);
  // Add any related data cleanup here if needed
  next();
});

// Static method to calculate total collected plastics
PlasticRequestSchema.statics.getTotalCollected = async function () {
  const stats = await this.aggregate([
    {
      $match: { status: 'Collected' }
    },
    {
      $unwind: '$plastics'
    },
    {
      $group: {
        _id: null,
        totalKgs: { $sum: '$plastics.kgs' },
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    totalKgs: stats.length > 0 ? stats[0].totalKgs : 0,
    count: stats.length > 0 ? stats[0].count : 0
  };
};

// Calculate reward points based on plastic type and weight
PlasticRequestSchema.pre('save', async function (next) {
  if (this.isModified('status') && this.status === 'Collected') {
    const pointValues = {
      PET: 10,
      HDPE: 8,
      PP: 6,
      LDPE: 5,
      PVC: 4,
      PS: 3,
      Other: 2
    };

    this.rewardPoints = this.plastics.reduce((total, item) => {
      return total + (pointValues[item.type] * item.kgs);
    }, 0);

    // Update user's total reward points
    if (this.user) {
      await mongoose.model('User').findByIdAndUpdate(this.user, {
        $inc: { rewardPoints: this.rewardPoints }
      });
    }
  }
  next();
});

module.exports = mongoose.model('PlasticRequest', PlasticRequestSchema);