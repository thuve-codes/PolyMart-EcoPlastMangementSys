const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats,
} = require("../controllers/orderController");
const { protect, authorize, verified } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Order = require("../models/Order");

router
  .route("/")
  .get(
    // protect,
    advancedResults(Order, "user"),
    getOrders,
  )
  .post(createOrder);

router
  .route("/:id")
  // .get(protect, getOrder)
  // .put(protect, verified, updateOrder)
  // .delete(protect, verified, deleteOrder);
  .get(getOrder)
  .put(updateOrder)
  .delete(deleteOrder);

// router.route("/stats").get(protect, authorize("admin"), getOrderStats);
router.route("/stats").get(getOrderStats);

module.exports = router;
