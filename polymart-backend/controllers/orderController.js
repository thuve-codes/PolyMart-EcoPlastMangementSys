const Order = require("../models/Order");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  // res.status(200).json(res.advancedResults);
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .populate("cartItems.product", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private/Admin
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Create order
// @route   POST /api/orders
// @access  Private/Admin
exports.createOrder = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  try {
    // req.body.user = req.user.id;
    const { cartItems, user } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const populatedCartItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await Product.findById(item.product);
          if (!product) {
            throw new Error(`Product not found: ${item.product}`);
          }
          return {
            product: product._id,
            qty: item.qty,
            price: product.price, // capture price directly
          };
        })
    );

    const amount = populatedCartItems.reduce((total, item) => {
      return total + (item?.price || 0) * (item.qty || 0);
    }, 0);

    req.body.amount = amount;

    const order = await Order.create({
      cartItems: cartItems, // original cartItems with product ids
      user,
      status: req.body.status || 'Processing',
      amount,
    });


    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin
// exports.updateOrder = asyncHandler(async (req, res, next) => {
//   const { status } = req.body;

//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return next(
//         new ErrorResponse(`Order not found with id of ${req.params.id}`, 404),
//       );
//     }
//     console.log("test");
//     order.status = status;
//     const updatedOrder = await order.save();
//     res.status(200).json(updatedOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
exports.updateOrder = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return next(
        new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  // Make sure user is order owner or admin
  // if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to update this order`,
  //       401,
  //     ),
  //   );
  // }
  //
  // order = await Order.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

  // res.status(200).json({
  //   success: true,
  //   data: order,
  // });


// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Order ID from URL parameters

  try {
    // Delete the order by its ID
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
exports.getOrderStats = asyncHandler(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        totalAmount: 1,
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats,
  });
});
