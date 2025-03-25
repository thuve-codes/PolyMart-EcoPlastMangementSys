import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import transporter from '../config/nodemailer.js';

export const FormSubmission = async(req, res)=>{
    const {
        name, 
        email,  
        contactNumber, 
        address, 
        bottleType, 
        weight, 
        feedback, 
        disposalPurpose, 
        pickupDate} = req.body;

    if(!name || !email || !contactNumber || !address || !bottleType || !weight || !disposalPurpose || !pickupDate){
        return res.json({success:false, message:'Missing Details'})
    }

    try{
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false, message:"User already Exists"});   
        }

        const user = new userModel({ name,
            email,
            contactNumber,
            address,
            bottleType,
            weight,
            feedback: feedback || '', 
            disposalPurpose,
            pickupDate,
            redeemPoints: 0, });
        
            await user.save();

            
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d'});
            
            res.cookie('token',token, {
                httpOnly:true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ?
                'none' :'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000   
            });
            //Sending the welcome email
            const mailOptions ={
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Welcome to Polymart',
                text:`Welcome to Polymart website.Your account has been created with email id: ${email}`    
            }
            await transporter.sendMail(mailOptions)

            return res.json({success:true});

    }catch(error){
        res.json({success:false, message:error.message})
    }
}

/*export const form = async ()=>{
    const {
        name, 
        email,  
        contactNumber, 
        address, 
        bottleType, 
        weight, 
        feedback, 
        disposalPurpose, 
        pickupDate} = req.body;

        if(!name || !email ){
            return res.json({success:false, message:'Email and name are requires'})
        }

        try{
            const user = await userModel.findOne({email});

            if(!user){
                return res.json({success:false, message:'Invalid email'})
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d'});
            
            res.cookie('token',token, {
                httpOnly:true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ?
                'none' :'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000   
            });

            return res.json({success:true});

        }catch(error){
            return res.json({success: false, message:error.message});
        }
}
*/
