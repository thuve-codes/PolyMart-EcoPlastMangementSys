const asyncHandler = require("../middleware/async");
const Product = require("../models/Product");
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getTotalProducts = asyncHandler(async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      total: totalProducts,
    });
  } catch (error) {
    console.error("Error getting total products:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});