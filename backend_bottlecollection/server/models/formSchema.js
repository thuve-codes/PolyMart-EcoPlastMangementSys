const mongoose = require('mongoose');


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

module.exports = Form;