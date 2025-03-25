import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    bottleType: { type: String, required: true },
    weight: { type: Number, required: true },
    feedback: { type: String, default: '' },
    disposalPurpose: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    redeemPoints: { type: Number, default: 0 }
     //verifyOtp: { type: String, default: '' },
    //verifyOtpExpireAt: { type: Date, default:0},
    //isAccountVerified: { type: Boolean, default: false }, 

})

const userModel = mongoose.model('user', userSchema);

export default userModel;