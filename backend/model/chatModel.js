const mongoose = require("mongoose");

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    default: null,
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
    default: null,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Message Schema
const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: "Conversation",
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  senderRole: {
    type: String,
    enum: ["customer", "admin"],
    required: true,
  },
  messageText: {
    type: String,
    required: true,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
conversationSchema.index({ customer: 1, status: 1 });
conversationSchema.index({ order: 1 });
messageSchema.index({ conversation: 1, createdAt: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { Conversation, Message };
