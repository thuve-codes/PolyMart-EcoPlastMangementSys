const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String }
  }],
  customerInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  payment: {
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvv: { type: String }
  },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "Processing" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

// const mongoose = require('mongoose');
// const { create } = require('./productModel');

// const orderSchema = new mongoose.Schema({
//     cartItems: Array,
//     amount:String,
//     status: String,
//     createdAt: Date
// })

// const orderModel = mongoose.model('Order', orderSchema);

// module.exports = orderModel;