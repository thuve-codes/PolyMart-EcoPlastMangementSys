const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a unique username"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"]
  },
  email: {
    type: String,
    required: [true, "Please provide a unique email"],
    unique: true
  },
  firstName: String,
  lastName: String,
  mobile: Number,
  address: String,
  profile: String,
  points: {
    type: Number,
    default: 0
  },
  welcomeBonusClaimed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", UserSchema);
