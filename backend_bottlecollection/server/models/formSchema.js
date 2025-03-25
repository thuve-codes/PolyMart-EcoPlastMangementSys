const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pickupForm', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const formSchema = new mongoose.Schema({
    name: String,
    email: String ,
    contactNumber: String,
    address: String,
    bottleType: String,
    weight: Number,
    feedback: String,
    disposalPurpose: String,
    pickupDate: String,
    points: Number,
});

const Form = mongoose.model('Form', formSchema);
