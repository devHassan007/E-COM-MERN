const { Conversation, Message } = require("../model/chatModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

// Get or create conversation for customer
exports.getOrCreateConversation = catchAsyncError(async (req, res, next) => {
  const { orderId } = req.query;

  // Find existing open conversation
  let conversation;
  if (orderId) {
    conversation = await Conversation.findOne({
      order: orderId,
      status: "open",
    });
  } else {
    conversation = await Conversation.findOne({
      customer: req.user._id,
      order: null,
      status: "open",
    });
  }

  // Create new conversation if none exists
  if (!conversation) {
    conversation = await Conversation.create({
      customer: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      order: orderId || null,
    });
  }

  // Get all messages for this conversation
  const messages = await Message.find({ conversation: conversation._id })
    .sort({ createdAt: 1 })
    .lean();

  // Calculate unread count (admin messages not read by customer)
  const unreadCount = await Message.countDocuments({
    conversation: conversation._id,
    senderRole: "admin",
    isRead: false,
  });

  res.status(200).json({
    success: true,
    conversation,
    messages,
    unreadCount,
  });
});

// Send message (customer or admin)
exports.sendMessage = catchAsyncError(async (req, res, next) => {
  const { conversationId, messageText } = req.body;

  if (!messageText || !messageText.trim()) {
    return next(new ErrorHandler("Message text is required", 400));
  }

  // Verify conversation exists
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return next(new ErrorHandler("Conversation not found", 404));
  }

  // Verify user is participant
  const isCustomer = conversation.customer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isCustomer && !isAdmin) {
    return next(new ErrorHandler("Unauthorized access to conversation", 403));
  }

  // Create message
  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    senderRole: isAdmin ? "admin" : "customer",
    messageText: messageText.trim(),
    isRead: false,
  });

  // Update conversation last message timestamp
  conversation.lastMessageAt = new Date();
  
  // Assign admin if this is an admin message and no admin assigned yet
  if (isAdmin && !conversation.admin) {
    conversation.admin = req.user._id;
  }
  
  await conversation.save();

  res.status(201).json({
    success: true,
    message,
  });
});

// Get all conversations (Admin only)
exports.getAllConversations = catchAsyncError(async (req, res, next) => {
  const conversations = await Conversation.find()
    .sort({ lastMessageAt: -1 })
    .lean();

  // Get unread count and last message for each conversation
  const conversationsWithDetails = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await Message.countDocuments({
        conversation: conv._id,
        senderRole: "customer",
        isRead: false,
      });

      const lastMessage = await Message.findOne({
        conversation: conv._id,
      })
        .sort({ createdAt: -1 })
        .lean();

      return {
        ...conv,
        unreadCount,
        lastMessage,
      };
    })
  );

  res.status(200).json({
    success: true,
    conversations: conversationsWithDetails,
  });
});

// Get messages for a conversation (Admin)
exports.getConversationMessages = catchAsyncError(async (req, res, next) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return next(new ErrorHandler("Conversation not found", 404));
  }

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .lean();

  res.status(200).json({
    success: true,
    conversation,
    messages,
  });
});

// Mark messages as read
exports.markMessagesAsRead = catchAsyncError(async (req, res, next) => {
  const { conversationId } = req.params;
  const isAdmin = req.user.role === "admin";

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return next(new ErrorHandler("Conversation not found", 404));
  }

  // Admin marks customer messages as read
  // Customer marks admin messages as read
  const senderRole = isAdmin ? "customer" : "admin";

  await Message.updateMany(
    {
      conversation: conversationId,
      senderRole: senderRole,
      isRead: false,
    },
    {
      $set: { isRead: true },
    }
  );

  res.status(200).json({
    success: true,
    message: "Messages marked as read",
  });
});

// Close conversation (Admin only)
exports.closeConversation = catchAsyncError(async (req, res, next) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return next(new ErrorHandler("Conversation not found", 404));
  }

  conversation.status = "closed";
  await conversation.save();

  res.status(200).json({
    success: true,
    message: "Conversation closed successfully",
  });
});

// Reopen conversation (Customer)
exports.reopenConversation = catchAsyncError(async (req, res, next) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return next(new ErrorHandler("Conversation not found", 404));
  }

  // Verify customer owns this conversation
  if (conversation.customer.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  conversation.status = "open";
  await conversation.save();

  res.status(200).json({
    success: true,
    message: "Conversation reopened",
  });
});
