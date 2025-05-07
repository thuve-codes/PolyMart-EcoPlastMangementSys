// const mongoose = require('mongoose');

// const MessageSchema = new mongoose.Schema({
//   sender: {
//     type: String,
//     required: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const ChatSchema = new mongoose.Schema({
//   productName: {
//     type: String,
//     required: true,
//   },
//   sellerName: {
//     type: String,
//     required: true,
//   },
//   messages: [MessageSchema],
//   user: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Chat', ChatSchema);

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
