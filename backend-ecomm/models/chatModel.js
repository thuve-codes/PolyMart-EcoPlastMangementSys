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
        type: String,
        required: true,
        enum: ['User', 'Seller'],
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

// Export the model so it can be used in other parts of your app
module.exports = mongoose.model('Chat', chatSchema);
