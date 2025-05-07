const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  messages: [
    {
      sender: {
        type: String, // This will now store the actual username
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Chat', chatSchema);
