const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
//Create order- api/v1/order
exports.createOrder =async(req,res, next) => {
    //console.log(req.body, 'DATA');
    const cartItems = req.body;
    const amount=Number(cartItems.reduce((acc, item) => (acc + item.product.price * item.qty), 0)).toFixed(2);
    const status='Processing';

    //updating product stock
    cartItems.forEach(async (item) => {
        const product = await productModel.findById(item.product._id);
            product.stock = product.stock - item.qty   
            await product.save();
        })
    

    const order = await orderModel.create({
        cartItems,
        amount,
        status,
        createdAt: Date.now()
    })

    console.log(amount, 'AMOUNT');
    
    res.json({
        success: true,
        order
      //  message: 'Create order working!'
    })  
}