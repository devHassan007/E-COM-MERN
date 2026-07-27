// Script to clean up admin-to-admin conversations
// Run this with: node cleanupAdminChats.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load config
dotenv.config({ path: "config/config.env" });

// Models
const { Conversation, Message } = require("./model/chatModel");
const User = require("./model/userModel");

const cleanupAdminChats = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://samiullahglotar420:malikecomerceappsami@ecommerce.jkzlt.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Find all conversations
    const conversations = await Conversation.find();
    console.log(`📊 Total conversations found: ${conversations.length}`);

    let deletedCount = 0;

    for (const conv of conversations) {
      // Check if customer is an admin
      const customer = await User.findById(conv.customer);
      
      if (customer && customer.role === "admin") {
        // Delete all messages in this conversation
        await Message.deleteMany({ conversation: conv._id });
        
        // Delete the conversation
        await Conversation.findByIdAndDelete(conv._id);
        
        console.log(`🗑️  Deleted admin-to-admin conversation: ${conv._id} (Customer: ${customer.name})`);
        deletedCount++;
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   - Deleted ${deletedCount} admin-to-admin conversations`);
    console.log(`   - Remaining conversations: ${conversations.length - deletedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  }
};

cleanupAdminChats();
