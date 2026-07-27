const express = require("express");
const {
  getOrCreateConversation,
  sendMessage,
  getAllConversations,
  getConversationMessages,
  markMessagesAsRead,
  closeConversation,
  reopenConversation,
} = require("../controllers/chatController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

// Customer routes
router
  .route("/chat/conversation")
  .get(isAuthenticatedUser, getOrCreateConversation);

router.route("/chat/message").post(isAuthenticatedUser, sendMessage);

router
  .route("/chat/conversation/:conversationId/read")
  .put(isAuthenticatedUser, markMessagesAsRead);

router
  .route("/chat/conversation/:conversationId/reopen")
  .put(isAuthenticatedUser, reopenConversation);

// Admin routes
router
  .route("/admin/conversations")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllConversations);

router
  .route("/admin/conversation/:conversationId/messages")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getConversationMessages);

router
  .route("/admin/conversation/:conversationId/close")
  .put(isAuthenticatedUser, authorizedRoles("admin"), closeConversation);

module.exports = router;
