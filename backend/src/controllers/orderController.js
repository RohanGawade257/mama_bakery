import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import Setting from "../models/Setting.js";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

const PAYMENT_STATUSES = [
  "Pending",
  "Pending Verification",
  "Paid",
  "Failed",
  "Refunded"
];

const requiredAddressFields = ["fullName", "phone", "line1", "city", "state", "postalCode"];

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");
const normalizeAddress = (address = {}) => ({
  fullName: sanitizeString(address.fullName),
  phone: sanitizeString(address.phone),
  line1: sanitizeString(address.line1),
  line2: sanitizeString(address.line2),
  city: sanitizeString(address.city),
  state: sanitizeString(address.state),
  postalCode: sanitizeString(address.postalCode),
  notes: sanitizeString(address.notes)
});

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentMeta } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      const error = new Error("Order items are required.");
      error.statusCode = 400;
      throw error;
    }

    if (!shippingAddress) {
      const error = new Error("Shipping address is required.");
      error.statusCode = 400;
      throw error;
    }

    const normalizedShippingAddress = normalizeAddress(shippingAddress);
    const missingAddressField = requiredAddressFields.find(
      (field) => !normalizedShippingAddress[field]
    );

    if (missingAddressField) {
      const error = new Error(`Shipping address field "${missingAddressField}" is required.`);
      error.statusCode = 400;
      throw error;
    }

    const normalizedPaymentMethod = paymentMethod === "UPI" ? "UPI" : "COD";

    if (normalizedPaymentMethod === "UPI") {
      const settings = await Setting.findOne({ singletonKey: "global" }).lean();
      if (settings?.upi?.enabled === false) {
        const error = new Error("UPI payments are currently disabled.");
        error.statusCode = 400;
        throw error;
      }
    }

    const productIds = items.map((item) => item.product);
    for (const productId of productIds) {
      if (!mongoose.isValidObjectId(productId)) {
        const error = new Error("One or more ordered products are invalid.");
        error.statusCode = 400;
        throw error;
      }
    }

    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [String(product._id), product]));
    const requestedQuantities = new Map();

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(String(item.product));
      const quantity = Number(item.quantity);

      if (!product) {
        const error = new Error("One or more ordered products do not exist.");
        error.statusCode = 400;
        throw error;
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        const error = new Error("Each item quantity must be at least 1.");
        error.statusCode = 400;
        throw error;
      }

      const productKey = String(product._id);
      const aggregatedQuantity = (requestedQuantities.get(productKey) || 0) + quantity;
      requestedQuantities.set(productKey, aggregatedQuantity);

      if (product.stock < aggregatedQuantity) {
        const error = new Error(`Insufficient stock for ${product.name}.`);
        error.statusCode = 400;
        throw error;
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity
      });

      subtotal += product.price * quantity;
    }

    const deliveryFee =
      req.body.deliveryFee !== undefined
        ? Math.max(Number(req.body.deliveryFee) || 0, 0)
        : subtotal > 0
          ? 49
          : 0;

    const total = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: normalizedShippingAddress,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: normalizedPaymentMethod === "UPI" ? "Pending Verification" : "Pending",
      paymentMeta: {
        transactionNote: sanitizeString(paymentMeta?.transactionNote)
      }
    });

    await Promise.all(
      orderItems.map((item) => {
        const product = productMap.get(String(item.product));
        product.stock -= item.quantity;
        return product.save();
      })
    );

    res.status(201).json({ data: order, message: "Order placed successfully." });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("paymentMeta.verifiedBy", "name email");

    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      throw error;
    }

    const isOwner = String(order.user._id) === String(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      const error = new Error("You cannot view this order.");
      error.statusCode = 403;
      throw error;
    }

    res.json({ data: order });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.query;
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const status = req.body.status || req.body.orderStatus;
    if (!ORDER_STATUSES.includes(status)) {
      const error = new Error("Invalid order status.");
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      throw error;
    }

    order.orderStatus = status;
    await order.save();

    res.json({ data: order, message: "Order status updated." });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const orderStatus = req.body.orderStatus ?? req.body.status;
    const { paymentStatus, transactionNote } = req.body;

    if (orderStatus !== undefined && !ORDER_STATUSES.includes(orderStatus)) {
      const error = new Error("Invalid order status.");
      error.statusCode = 400;
      throw error;
    }

    if (paymentStatus !== undefined && !PAYMENT_STATUSES.includes(paymentStatus)) {
      const error = new Error("Invalid payment status.");
      error.statusCode = 400;
      throw error;
    }

    if (orderStatus === undefined && paymentStatus === undefined && transactionNote === undefined) {
      const error = new Error("No valid update fields provided.");
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      throw error;
    }

    if (orderStatus !== undefined) {
      order.orderStatus = orderStatus;
    }

    if (!order.paymentMeta) {
      order.paymentMeta = { transactionNote: "" };
    }

    if (paymentStatus !== undefined) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "Paid") {
        order.paymentMeta.verifiedAt = new Date();
        order.paymentMeta.verifiedBy = req.user?._id;
        if (order.orderStatus === "Pending") {
          order.orderStatus = "Confirmed";
        }
      } else {
        order.paymentMeta.verifiedAt = undefined;
        order.paymentMeta.verifiedBy = undefined;
      }
    }

    if (transactionNote !== undefined) {
      order.paymentMeta.transactionNote = sanitizeString(transactionNote);
    }

    await order.save();

    res.json({ data: order, message: "Order updated." });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, transactionNote } = req.body;

    if (!PAYMENT_STATUSES.includes(paymentStatus)) {
      const error = new Error("Invalid payment status.");
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      throw error;
    }

    order.paymentStatus = paymentStatus;
    if (!order.paymentMeta) {
      order.paymentMeta = { transactionNote: "" };
    }
    order.paymentMeta.transactionNote =
      transactionNote !== undefined ? sanitizeString(transactionNote) : order.paymentMeta.transactionNote;

    if (paymentStatus === "Paid") {
      order.paymentMeta.verifiedAt = new Date();
      order.paymentMeta.verifiedBy = req.user?._id;
      if (order.orderStatus === "Pending") {
        order.orderStatus = "Confirmed";
      }
    } else {
      order.paymentMeta.verifiedAt = undefined;
      order.paymentMeta.verifiedBy = undefined;
    }

    await order.save();

    res.json({ data: order, message: "Payment status updated." });
  } catch (error) {
    next(error);
  }
};
