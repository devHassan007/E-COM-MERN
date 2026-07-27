const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const ErrorHander = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (
    !shippingInfo ||
    !orderItems ||
    !paymentInfo ||
    !itemsPrice ||
    !taxPrice ||
    !shippingPrice ||
    !totalPrice
  ) {
    return next(new ErrorHander("All fields are required", 400));
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    user: req.user._id,
    paymentInfo: {
      id: paymentInfo.id,
      status: paymentInfo.status,
      paidAt: paymentInfo.paidAt || Date.now(),
      method: paymentInfo.method,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    },
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged-in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.paymentInfo.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.paymentInfo.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    for (const item of order.orderItems) {
      await updateStock(item.product, item.quantity);
    }
  }

  order.paymentInfo.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.paymentInfo.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
});

// Update product stock
async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);

  if (!product) throw new ErrorHander("Product not found", 404);

  product.Stock -= quantity;

  if (product.Stock < 0) {
    throw new ErrorHander("Insufficient stock for product", 400);
  }

  await product.save({ validateBeforeSave: false });
}

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
