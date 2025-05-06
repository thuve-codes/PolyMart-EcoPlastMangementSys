const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStatistics,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const User = require("../models/User");

// Include other resource routers
const orderRouter = require("./orderRoutes");
const requestRouter = require("./requestRoutes");

// Re-route into other resource routers
router.use("/:userId/orders", orderRouter);
router.use("/:userId/requests", requestRouter);

// router
//   .route('/')
//   .get(
//     protect,
//     authorize('admin'),
//     advancedResults(User, {
//       path: 'orders requests',
//       select: 'status totalAmount plastics'
//     }),
//     getUsers
//   )
//   .post(protect, authorize('admin'), createUser);
router.route("/").get(getUsers).post(createUser);

// router
//   .route('/:id')
//   .get(protect, authorize('admin'), getUser)
//   .put(protect, authorize('admin'), updateUser)
//   .delete(protect, authorize('admin'), deleteUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

// router
//   .route('/stats')
//   .get(protect, authorize('admin'), getUserStats);
router.route("/stats").get(getUserStatistics);

module.exports = router;
