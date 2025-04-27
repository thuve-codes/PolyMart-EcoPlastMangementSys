const Order = require('../models/orderModel');
const Product = require('../models/productModel');



exports.createOrder = async (req, res) => {
  try {
    const { cartItems, formData, subtotal, shipping, tax, total } = req.body;

    // Validate input data
    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({
        success: false,
        error: 'Cart items must be an array',
      });
    }

    if (!formData?.fullName || !formData?.email || !formData?.phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields (fullName, email, phone)',
      });
    }

    // Check product stock and prepare updates
    const products = await Product.find({
      _id: { $in: cartItems.map((item) => item.product._id) },
    });

    const stockIssues = [];
    const validItems = [];
    const stockUpdates = []; // To track stock reductions

    cartItems.forEach((cartItem) => {
      const product = products.find(
        (p) => p._id.toString() === cartItem.product._id
      );

      if (!product) {
        stockIssues.push({
          productId: cartItem.product._id,
          error: 'Product not found',
        });
      } else if (product.stock < cartItem.qty) {
        stockIssues.push({
          productId: product._id,
          name: product.name,
          available: product.stock,
          requested: cartItem.qty,
          error: 'Insufficient stock',
        });
      } else {
        validItems.push({
          product: product._id,
          name: product.name,
          qty: cartItem.qty,
          price: product.price,
          image: product.images[0]?.image || '',
        });

        // Add to stock updates
        stockUpdates.push({
          productId: product._id,
          decrement: cartItem.qty,
        });
      }
    });

    // If any stock issues, abort
    if (stockIssues.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock issues found',
        stockIssues,
      });
    }

    // Create the order
    const order = await Order.create({
      items: validItems,
      customerInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || '',
        city: formData.city || '',
        zipCode: formData.zipCode || '',
        country: formData.country || '',
      },
      subtotal,
      shipping,
      tax,
      total,
      status: 'Processing',
    });

  // Update product stocks (reduce stock) when stock is stored as string
await Promise.all(
  stockUpdates.map(async (update) => {
    const product = await Product.findById(update.productId);
    if (product) {
      const currentStock = parseInt(product.stock) || 0; // Convert string to number
      const newStock = Math.max(0, currentStock - update.decrement); // Ensure doesn't go below 0
      await Product.findByIdAndUpdate(
        update.productId,
        { $set: { stock: newStock.toString() } }, // Set new stock as string
        { new: true }
      );
    }
  })
);

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully. Stock updated.',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to place order',
      message: error.message,
    });
  }
};

// Get all orders
// Get all orders with improved filtering and sorting
exports.getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      customerEmail,
      startDate,
      endDate
    } = req.query;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (customerEmail) {
      query['customerInfo.email'] = customerEmail;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Validate numerical parameters
    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit)));

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [orders, count] = await Promise.all([
      Order.find(query)
        .sort(sort)
        .limit(parsedLimit)
        .skip((parsedPage - 1) * parsedLimit)
        .populate('items.product', 'name price images'),
      Order.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        totalPages: Math.ceil(count / parsedLimit),
        currentPage: parsedPage,
        totalOrders: count,
        limit: parsedLimit
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    // Check if order exists
    const order = await Order.findById(orderId); // use Order model directly
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);

    res.status(204).send(); // success, no content
  } catch (error) {
    next(error);
  }
};


