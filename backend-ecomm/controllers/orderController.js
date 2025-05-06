const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const PDFDocument = require('pdfkit');

exports.createOrder = async (req, res) => {
  try {
    const { cartItems, formData, subtotal, shipping, tax, total, buyer } = req.body;

    if (!buyer) {
      return res.status(400).json({
        success: false,
        error: 'Buyer username is required',
      });
    }

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
      buyer, // Store the buyer username
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

    const buyer = req.params.uname; // ✅ Get buyer from route params

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (customerEmail) {
      query['customerInfo.email'] = customerEmail;
    }

    if (buyer) {
      query.buyer = buyer; // ✅ Use buyer from route
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit)));

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



// New controller to generate invoice
exports.downloadInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const doc = new PDFDocument();
    const filename = `invoice-${order._id}.pdf`;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Pipe the document to response
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('Payment Successfully Completed', { align: 'center', color: 'green' });
    doc.moveDown();

    // Customer info
    doc.fontSize(12).text(`Customer: ${order.customerInfo.fullName}`);
    doc.text(`Email: ${order.customerInfo.email}`);
    doc.text(`Phone: ${order.customerInfo.phone}`);
    doc.text(`Address: ${order.customerInfo.address}, ${order.customerInfo.city}, ${order.customerInfo.zipCode}, ${order.customerInfo.country}`);
    doc.moveDown();

    doc.fontSize(10).text('Card Details');
    
    doc.text(`Credit Card Number: **** **** **** 4242`);

    doc.moveDown();

    // Order Items
    doc.fontSize(14).text('Items:');
    order.items.forEach((item, i) => {
      doc.fontSize(12).text(`${i + 1}. ${item.name} - Qty: ${item.qty} - Price: LKR ${item.price}.00`);
    });

    doc.moveDown();
    doc.text(`Subtotal: LKR ${order.subtotal}.00`);
    doc.text(`Shipping: LKR ${order.shipping}.00`);
    doc.text(`Tax: LKR ${order.tax}.00`);
    doc.fontSize(14).text(`Total: LKR ${order.total}`, { align: 'right' });

    doc.end();
  } catch (err) {
    console.error('Invoice generation error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate invoice' });
  }
};

