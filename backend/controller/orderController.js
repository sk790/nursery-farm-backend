import Order from "../models/orderModel.js";
import ErrorHander from "../utils/errorhander.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import Product from "../models/productModel.js";

//Create new order

export const newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shppingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shppingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//Get Single Order
export const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHander("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});
//Get LoggedIn user Orders it means user ke apne orders
export const myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//Get all orders --> Admin
export const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmonunt = 0;
  orders.forEach((order) => {
    totalAmonunt += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmonunt,
  });
});

//Update order status --> Admin
export const updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found ", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("Yor have already delivered this order", 404));
  }
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

//Delete Order --> Admin

export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Orders not found", 404));
  }

  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
  });
});
