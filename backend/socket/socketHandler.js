const { Conversation, Message } = require("../model/chatModel");

const socketHandler = (io) => {
  // Store connected users: userId -> socket.id
  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // User joins with their ID
    socket.on("user_online", (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`User ${userId} is online`);
    });

    // Admin joins admin room
    socket.on("admin_online", () => {
      socket.join("admin_room");
      console.log("Admin joined:", socket.id);
    });

    // Join specific conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Real-time message delivery (message already saved in DB via HTTP)
    socket.on("new_message", async (data) => {
      try {
        const { conversationId, messageId } = data;

        // Fetch the message from DB
        const message = await Message.findById(messageId).lean();
        const conversation = await Conversation.findById(conversationId).lean();

        if (!message || !conversation) return;

        // Notify the other party
        if (message.senderRole === "customer") {
          // Notify all admins
          io.to("admin_room").emit("customer_message", {
            conversationId,
            message,
            conversation,
          });
        } else {
          // Notify specific customer
          const customerSocketId = connectedUsers.get(
            conversation.customer.toString()
          );
          if (customerSocketId) {
            io.to(customerSocketId).emit("admin_message", {
              conversationId,
              message,
            });
          }
        }

        // Notify all users in conversation room
        socket.to(`conversation_${conversationId}`).emit("message_received", {
          conversationId,
          message,
        });
      } catch (error) {
        console.error("Error broadcasting message:", error);
      }
    });

    // Typing indicators
    socket.on("typing_start", (data) => {
      const { conversationId, role } = data;
      socket.to(`conversation_${conversationId}`).emit("user_typing", {
        conversationId,
        role,
        typing: true,
      });
    });

    socket.on("typing_stop", (data) => {
      const { conversationId, role } = data;
      socket.to(`conversation_${conversationId}`).emit("user_typing", {
        conversationId,
        role,
        typing: false,
      });
    });

    // Mark messages as read notification
    socket.on("messages_read", (data) => {
      const { conversationId } = data;
      socket.to(`conversation_${conversationId}`).emit("messages_marked_read", {
        conversationId,
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });
};

module.exports = socketHandler;
