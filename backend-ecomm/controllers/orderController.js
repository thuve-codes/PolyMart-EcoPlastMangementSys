const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.createOrder = async (req, res) => {
  try {
    const { cartItems, formData, subtotal, shipping, tax, total } = req.body;

    // Validate input data
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    if (!formData || !subtotal || !shipping || !tax || !total) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Verify stock for all items
    const products = await Product.find({
      _id: { $in: cartItems.map(item => item.product._id) }
    });

    const stockIssues = [];
    const validItems = [];
    
    cartItems.forEach(cartItem => {
      const product = products.find(p => p._id.toString() === cartItem.product._id);
      
      if (!product) {
        stockIssues.push({
          productId: cartItem.product._id,
          name: cartItem.product.name,
          error: 'Product not found'
        });
      } else if (product.stock < cartItem.qty) {
        stockIssues.push({
          productId: product._id,
          name: product.name,
          available: product.stock,
          requested: cartItem.qty,
          error: 'Insufficient stock'
        });
      } else {
        validItems.push({
          cartItem,
          product
        });
      }
    });

    // If any stock issues, return them
    if (stockIssues.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock issues found',
        stockIssues
      });
    }

    // Prepare items for order
    const orderItems = validItems.map(({ cartItem, product }) => ({
      product: product._id,
      name: product.name,
      qty: cartItem.qty,
      price: product.price,
      image: product.images[0]?.image || ''
    }));

    // Create the order
    const order = await Order.create({
      items: orderItems,
      customerInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country
      },
      payment: {
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv
      },
      subtotal,
      shipping,
      tax,
      total,
      status: 'Processing'
    });

    // // Update product stocks
    // const bulkOps = validItems.map(({ cartItem, product }) => ({
    //   updateOne: {
    //     filter: { _id: product._id },
    //     update: { $inc: { stock: -cartItem.qty } }
    //   }
    // }));

    // await Product.bulkWrite(bulkOps);

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to plackkkkkkkkkkkkkke order',
      message: error.message
    });
  }
};



