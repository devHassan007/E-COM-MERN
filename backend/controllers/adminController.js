const Return = require("../model/returnModel");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const ErrorHander = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");

// Get Admin Dashboard Stats
exports.getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  // Get total products
  const totalProducts = await Product.countDocuments();

  // Get total orders
  const totalOrders = await Order.countDocuments();

  // Get total users (excluding admin)
  const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });

  // Calculate total revenue
  const orders = await Order.find();
  let totalRevenue = 0;
  orders.forEach((order) => {
    totalRevenue += order.paymentInfo.totalPrice || 0;
  });

  // Get recent orders (last 5)
  const recentOrders = await Order.find()
    .sort({ "paymentInfo.createdAt": -1 })
    .limit(5)
    .populate("user", "name email");

  // Get top selling products
  const topProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalSold: { $sum: "$orderItems.quantity" },
        productName: { $first: "$orderItems.name" },
        productImage: { $first: "$orderItems.image" },
        productPrice: { $first: "$orderItems.price" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  // Get order status breakdown
  const orderStatusBreakdown = await Order.aggregate([
    {
      $group: {
        _id: "$paymentInfo.orderStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  // Get revenue by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const revenueByMonth = await Order.aggregate([
    {
      $match: {
        "paymentInfo.createdAt": { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$paymentInfo.createdAt" },
          month: { $month: "$paymentInfo.createdAt" },
        },
        revenue: { $sum: "$paymentInfo.totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      topProducts,
      orderStatusBreakdown,
      revenueByMonth,
    },
  });
});

// Create Return Request -- Customer
exports.createReturnRequest = catchAsyncErrors(async (req, res, next) => {
  const { orderId, productId, returnType, reason, comment, images } = req.body;

  if (!orderId || !productId || !returnType || !reason) {
    return next(new ErrorHander("All required fields must be provided", 400));
  }

  // Find the order
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ErrorHander("Order not found", 404));
  }

  // Check if order belongs to the user
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHander("You are not authorized to return this order", 403));
  }

  // Check if order is delivered
  if (order.paymentInfo.orderStatus !== "Delivered") {
    return next(new ErrorHander("Only delivered orders can be returned", 400));
  }

  // Check if within return window (7 days by default)
  const deliveredDate = order.paymentInfo.deliveredAt;
  const currentDate = new Date();
  const daysSinceDelivery = Math.floor((currentDate - deliveredDate) / (1000 * 60 * 60 * 24));
  const returnWindow = 7; // days

  if (daysSinceDelivery > returnWindow) {
    return next(
      new ErrorHander(
        `Return window has expired. Returns are only allowed within ${returnWindow} days of delivery`,
        400
      )
    );
  }

  // Find the order item
  const orderItem = order.orderItems.find(
    (item) => item.product.toString() === productId
  );

  if (!orderItem) {
    return next(new ErrorHander("Product not found in this order", 404));
  }

  // Check if return already exists for this product
  const existingReturn = await Return.findOne({
    order: orderId,
    "orderItem.product": productId,
    status: { $nin: ["REJECTED"] }, // Allow new request if previous was rejected
  });

  if (existingReturn) {
    return next(
      new ErrorHander("A return request already exists for this product", 400)
    );
  }

  // Create return request
  const returnRequest = await Return.create({
    order: orderId,
    orderItem: {
      product: orderItem.product,
      name: orderItem.name,
      quantity: orderItem.quantity,
      price: orderItem.price,
      image: orderItem.image,
    },
    user: req.user._id,
    returnType,
    reason,
    comment,
    images: images || [],
    returnWindow,
  });

  res.status(201).json({
    success: true,
    message: "Return request submitted successfully. We will review it soon.",
    return: returnRequest,
  });
});

// Get User's Returns
exports.getMyReturns = catchAsyncErrors(async (req, res, next) => {
  const returns = await Return.find({ user: req.user._id })
    .populate("order")
    .populate("orderItem.product")
    .sort({ requestedAt: -1 });

  res.status(200).json({
    success: true,
    returns,
  });
});

// Get All Returns -- Admin
exports.getAllReturns = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.query;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  const returns = await Return.find(filter)
    .populate("user", "name email")
    .populate("order")
    .populate("orderItem.product")
    .sort({ requestedAt: -1 });

  res.status(200).json({
    success: true,
    count: returns.length,
    returns,
  });
});

// Get Single Return Details
exports.getSingleReturn = catchAsyncErrors(async (req, res, next) => {
  const returnRequest = await Return.findById(req.params.id)
    .populate("user", "name email")
    .populate("order")
    .populate("orderItem.product");

  if (!returnRequest) {
    return next(new ErrorHander("Return request not found", 404));
  }

  // Check authorization
  if (
    req.user.role !== "admin" &&
    returnRequest.user._id.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorHander("Not authorized to view this return", 403));
  }

  res.status(200).json({
    success: true,
    return: returnRequest,
  });
});

// Approve Return -- Admin
exports.approveReturn = catchAsyncErrors(async (req, res, next) => {
  const returnRequest = await Return.findById(req.params.id);

  if (!returnRequest) {
    return next(new ErrorHander("Return request not found", 404));
  }

  if (returnRequest.status !== "REQUESTED") {
    return next(
      new ErrorHander(
        `Cannot approve return with status: ${returnRequest.status}`,
        400
      )
    );
  }

  returnRequest.status = "APPROVED";
  returnRequest.approvedAt = Date.now();
  if (req.body.adminComment) {
    returnRequest.adminComment = req.body.adminComment;
  }

  await returnRequest.save();

  res.status(200).json({
    success: true,
    message: "Return request approved successfully",
    return: returnRequest,
  });
});

// Reject Return -- Admin
exports.rejectReturn = catchAsyncErrors(async (req, res, next) => {
  const { adminComment } = req.body;

  if (!adminComment) {
    return next(new ErrorHander("Please provide a reason for rejection", 400));
  }

  const returnRequest = await Return.findById(req.params.id);

  if (!returnRequest) {
    return next(new ErrorHander("Return request not found", 404));
  }

  if (returnRequest.status !== "REQUESTED") {
    return next(
      new ErrorHander(
        `Cannot reject return with status: ${returnRequest.status}`,
        400
      )
    );
  }

  returnRequest.status = "REJECTED";
  returnRequest.rejectedAt = Date.now();
  returnRequest.adminComment = adminComment;

  await returnRequest.save();

  res.status(200).json({
    success: true,
    message: "Return request rejected",
    return: returnRequest,
  });
});

// Schedule Pickup -- Admin
exports.schedulePickup = catchAsyncErrors(async (req, res, next) => {
  const { pickupDate } = req.body;

  const returnRequest = await Return.findById(req.params.id);

  if (!returnRequest) {
    return next(new ErrorHander("Return request not found", 404));
  }

  if (returnRequest.status !== "APPROVED") {
    return next(
      new ErrorHander("Return must be approved before scheduling pickup", 400)
    );
  }

  returnRequest.status = "PICKUP_SCHEDULED";
  returnRequest.pickupScheduledAt = pickupDate || Date.now();

  await returnRequest.save();

  res.status(200).json({
    success: true,
    message: "Pickup scheduled successfully",
    return: returnRequest,
  });
});

// Confirm Item Received -- Admin
exports.confirmItemReceived = catchAsyncErrors(async (req, res, next) => {
  const returnRequest = await Return.findById(req.params.id);

  if (!returnRequest) {
    return next(new ErrorHander("Return request not found", 404));
  }

  if (returnRequest.status !== "PICKUP_SCHEDULED") {
    return next(new ErrorHander("Invalid return status for this action", 400));
  }

  returnRequest.status = "ITEM_RECEIVED";
  returnRequest.itemReceivedAt = Date.now();

  // Restore product stock
  const product = await Product.findById(returnRequest.orderItem.product);
  if (product) {
    product.Stock += returnRequest.orderItem.quantity;
    await product.save();
  }

  await returnRequest.save();

  res.status(200).json({
    success: true,
    message: "Item received confirmation updated",
    return: returnRequest,
  });
});

// Process Refund -- Admin
exports.processRefund = catchAsyncErrors(async (req, res, next) => {
  const { refundAmount } = req.body;

  const returnRequest = await Return.findById(req.params.id).populate("order");

  if (!returnRequest) {
    return next(new ErrorHander("Return request not found", 404));
  }

  if (returnRequest.status !== "ITEM_RECEIVED") {
    return next(
      new ErrorHander("Item must be received before processing refund", 400)
    );
  }

  if (returnRequest.returnType !== "Refund") {
    return next(new ErrorHander("This return is not for refund", 400));
  }

  // Calculate refund amount if not provided
  const calculatedRefund =
    refundAmount || returnRequest.orderItem.price * returnRequest.orderItem.quantity;

  returnRequest.status = "REFUNDED";
  returnRequest.refundAmount = calculatedRefund;
  returnRequest.refundedAt = Date.now();

  await returnRequest.save();

  res.status(200).json({
    success: true,
    message: `Refund of $${calculatedRefund} processed successfully`,
    return: returnRequest,
  });
});

// Process Replacement -- Admin
exports.processReplacement = catchAsyncErrors(async (req, res, next) => {
  const returnRequest = await Return.findById(req.params.id).populate("order");

  if (!returnRequest) {
    return next(new ErrorHander("Return request not found", 404));
  }

  if (returnRequest.status !== "ITEM_RECEIVED") {
    return next(
      new ErrorHander("Item must be received before processing replacement", 400)
    );
  }

  if (returnRequest.returnType !== "Replacement") {
    return next(new ErrorHander("This return is not for replacement", 400));
  }

  returnRequest.status = "REPLACED";
  // In a real scenario, create a new order for replacement
  // returnRequest.replacementOrderId = newOrder._id;

  await returnRequest.save();

  res.status(200).json({
    success: true,
    message: "Replacement order created successfully",
    return: returnRequest,
  });
});

// Delete Return -- Admin
exports.deleteReturn = catchAsyncErrors(async (req, res, next) => {
  const returnRequest = await Return.findById(req.params.id);

  if (!returnRequest) {
    return next(new ErrorHander("Return request not found", 404));
  }

  await returnRequest.deleteOne();

  res.status(200).json({
    success: true,
    message: "Return request deleted successfully",
  });
});
