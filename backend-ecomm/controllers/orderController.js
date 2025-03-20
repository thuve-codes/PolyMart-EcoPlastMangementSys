const orderModel = require('../models/orderModel');
exports.createOrder =(req,res, next) => {
    console.log(req.body, 'DATA');
    
    res.json({
        success: true,
        message: 'Create order working!'
    })  
}