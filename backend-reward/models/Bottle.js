// backend/models/Bottle.js
import mongoose from 'mongoose';

const bottleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  bottleType: { type: String, required: true },
  weight: { type: Number, required: true },
  feedback: { type: String },
  disposalPurpose: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  points: { type: Number, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Available', 'Picked Up', 'Completed'],
    default: 'Pending'
  },
}, { 
  timestamps: true 
});

const Bottle = mongoose.model('Bottle', bottleSchema);

export default Bottle;