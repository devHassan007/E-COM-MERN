const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  orderItem: {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  returnType: {
    type: String,
    enum: ["Refund", "Replacement"],
    required: true,
  },
  reason: {
    type: String,
    enum: [
      "Damaged Product",
      "Wrong Item Received",
      "Size/Fit Issue",
      "Not as Described",
      "Quality Issue",
      "Other",
    ],
    required: true,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  images: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  status: {
    type: String,
    enum: [
      "REQUESTED",
      "APPROVED",
      "REJECTED",
      "PICKUP_SCHEDULED",
      "ITEM_RECEIVED",
      "REFUNDED",
      "REPLACED",
    ],
    default: "REQUESTED",
  },
  adminComment: {
    type: String,
    maxlength: 500,
  },
  pickupScheduledAt: {
    type: Date,
  },
  itemReceivedAt: {
    type: Date,
  },
  refundAmount: {
    type: Number,
  },
  refundedAt: {
    type: Date,
  },
  replacementOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
  },
  rejectedAt: {
    type: Date,
  },
  returnWindow: {
    type: Number,
    default: 7, // Days allowed for return
  },
});

module.exports = mongoose.model("Return", returnSchema);
