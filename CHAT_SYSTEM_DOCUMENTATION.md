# Chat Support System Documentation

## Overview
Complete customer-admin chat support system with persistent conversation history, real-time messaging using Socket.IO, and proper conversation management.

## Architecture

### Database Design

#### Conversations Collection
- `customer` (ObjectId) - Reference to User
- `customerName` (String) - Customer name
- `customerEmail` (String) - Customer email  
- `admin` (ObjectId) - Reference to assigned admin (nullable)
- `order` (ObjectId) - Reference to Order (nullable)
- `status` (String) - "open" | "closed"
- `lastMessageAt` (Date) - Last message timestamp
- `createdAt` (Date) - Conversation creation date

#### Messages Collection
- `conversation` (ObjectId) - Reference to Conversation (indexed)
- `sender` (ObjectId) - Reference to User
- `senderRole` (String) - "customer" | "admin"
- `messageText` (String) - Message content
- `isRead` (Boolean) - Read status
- `createdAt` (Date) - Message timestamp

### Key Features

1. **Persistent Conversations**: One conversation per customer that persists across login sessions
2. **Real-time Messaging**: Socket.IO for instant message delivery
3. **Read/Unread Tracking**: Tracks which messages have been read by each party
4. **Conversation Status**: Open/closed status management
5. **Typing Indicators**: Real-time typing status
6. **Auto-scroll**: Messages automatically scroll to bottom
7. **Responsive UI**: Works on all screen sizes

## API Endpoints

### Customer Endpoints

#### GET `/api/v1/chat/conversation`
Get or create conversation for logged-in customer
- **Query Params**: `orderId` (optional)
- **Returns**: conversation object, messages array, unreadCount

#### POST `/api/v1/chat/message`
Send a message
- **Body**: `{ conversationId, messageText }`
- **Returns**: created message object

#### PUT `/api/v1/chat/conversation/:conversationId/read`
Mark messages as read
- **Returns**: success message

#### PUT `/api/v1/chat/conversation/:conversationId/reopen`
Reopen closed conversation
- **Returns**: success message

### Admin Endpoints

#### GET `/api/v1/admin/conversations`
Get all conversations with unread counts and last message
- **Returns**: array of conversations with metadata

#### GET `/api/v1/admin/conversation/:conversationId/messages`
Get all messages for a conversation
- **Returns**: conversation object and messages array

#### PUT `/api/v1/admin/conversation/:conversationId/close`
Close a conversation
- **Returns**: success message

## Socket.IO Events

### Client → Server

#### `user_online`
User connects and identifies themselves
- **Payload**: `userId`

#### `admin_online`
Admin connects and joins admin room

#### `join_conversation`
Join a specific conversation room
- **Payload**: `conversationId`

#### `new_message`
Notify about new message (after HTTP POST)
- **Payload**: `{ conversationId, messageId }`

#### `typing_start`
User starts typing
- **Payload**: `{ conversationId, role }`

#### `typing_stop`
User stops typing
- **Payload**: `{ conversationId, role }`

#### `messages_read`
Messages marked as read
- **Payload**: `{ conversationId }`

### Server → Client

#### `admin_message`
Customer receives admin reply
- **Payload**: `{ conversationId, message }`

#### `customer_message`
Admin receives customer message
- **Payload**: `{ conversationId, message, conversation }`

#### `message_received`
Message received in conversation room
- **Payload**: `{ conversationId, message }`

#### `user_typing`
Typing indicator update
- **Payload**: `{ conversationId, role, typing }`

#### `messages_marked_read`
Messages marked as read notification
- **Payload**: `{ conversationId }`

## Component Flow

### Customer Flow

1. **Entry Point**: Floating chat button (bottom-right) on all pages
2. **Click Button**: Opens chat widget
3. **First Load**: 
   - Calls `GET /api/v1/chat/conversation`
   - Finds existing conversation OR creates new one
   - Loads all message history
4. **Send Message**:
   - HTTP POST to save to database
   - Socket event for real-time delivery
5. **Receive Reply**:
   - Socket.IO delivers instantly if online
   - Shows unread badge if widget closed
6. **Persistence**: Conversation reloads on every login with full history

### Admin Flow

1. **Entry Point**: Admin Dashboard → Support Chats menu
2. **View List**: See all conversations with:
   - Customer name/email
   - Last message preview
   - Unread count badge
   - Status (open/closed)
3. **Select Conversation**:
   - Load full message history
   - Auto-mark customer messages as read
   - Join socket room for real-time updates
4. **Send Reply**:
   - HTTP POST to save to database
   - Socket event notifies customer instantly
5. **Close Conversation**: Mark as closed (customer can reopen)

## Security

1. **Authentication Required**: All endpoints require authentication
2. **Role Validation**: Admin endpoints check for admin role
3. **Conversation Ownership**: Users can only access their own conversations
4. **Socket Auth**: Socket connections verify user authentication
5. **Message Validation**: Text validation and sanitization

## Persistence Logic

### How Chats Persist

1. **Database Storage**: All messages saved in MongoDB
2. **Conversation Lookup**: 
   - On login, finds existing open conversation by customer ID
   - If none exists, creates new one
   - Never creates duplicate conversations
3. **Message History**: Always fetches from database on load
4. **WebSocket Only for Real-time**: Sockets only deliver messages instantly, don't store them

### Reload Scenarios

✅ **Works After**:
- Logout and login
- Browser refresh
- Device change
- Network reconnection
- Server restart

## Frontend Components

### ChatWidget.jsx
Location: `frontend/src/Components/Chat/ChatWidget.jsx`

**Features**:
- Floating button with unread count badge
- Expandable chat window (96x500px)
- Real-time messaging
- Typing indicators
- Auto-scroll to latest message
- Connection state management

### AdminChatDashboard.jsx
Location: `frontend/src/Components/Admin/AdminChatDashboard.jsx`

**Features**:
- Conversation list sidebar (80px width)
- Unread count badges
- Last message preview
- Full message view
- Real-time message updates
- Close conversation functionality
- Typing indicators

## Backend Files

### Models
- `backend/model/chatModel.js` - Conversation & Message schemas

### Controllers
- `backend/controllers/chatController.js` - All chat business logic

### Routes
- `backend/routes/chatRoute.js` - API endpoints

### Socket Handler
- `backend/socket/socketHandler.js` - Socket.IO event handling

## Installation & Setup

### 1. Install Dependencies

Backend:
```bash
cd backend
npm install socket.io
```

Frontend:
```bash
cd frontend
npm install socket.io-client --legacy-peer-deps
```

### 2. Start Servers

Backend:
```bash
cd backend
npm start
```
Server runs on port 4000

Frontend:
```bash
cd frontend
npm start
```
App runs on port 3000

### 3. Access Points

**Customer**:
- Login to any account
- Click floating chat button (bottom-right)
- Start conversation

**Admin**:
1. Update user role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```
2. Logout and login again
3. Navigate to Admin Dashboard → Support Chats

## Testing Checklist

### Customer Tests
- [ ] Chat button appears when logged in
- [ ] Click opens chat widget
- [ ] Can send messages
- [ ] Messages persist after refresh
- [ ] Receives admin replies in real-time
- [ ] Typing indicator shows when admin types
- [ ] Unread count shows when widget closed
- [ ] Messages mark as read when widget opens

### Admin Tests
- [ ] Can access /admin/chats route
- [ ] Sees list of all conversations
- [ ] Unread count displays correctly
- [ ] Can click to open conversation
- [ ] Sees full message history
- [ ] Can send replies
- [ ] Customer receives reply in real-time
- [ ] Can close conversations
- [ ] Typing indicator shows when customer types

### Persistence Tests
- [ ] Logout → Login: conversation reloads
- [ ] Browser refresh: messages persist
- [ ] Multiple devices: same conversation
- [ ] Server restart: data intact

## Common Issues

### Socket not connecting
- Check if socket.io packages are installed
- Verify CORS settings in server.js
- Check browser console for connection errors

### Messages not persisting
- Verify MongoDB connection
- Check database for conversations and messages collections
- Ensure HTTP POST completes before socket emit

### Duplicate conversations
- Check query logic in `getOrCreateConversation`
- Ensure conversation lookup by customer + order is unique

### Unread count incorrect
- Verify `markMessagesAsRead` is called when opening chat
- Check senderRole matches in query

## Future Enhancements

1. **File Uploads**: Support image/file sharing
2. **Admin Assignment**: Auto-assign conversations to available admins
3. **Auto-bot**: Greeting message before admin joins
4. **Activity Timeout**: Auto-close after N days inactivity
5. **Search**: Search conversations and messages
6. **Notifications**: Browser/email notifications for new messages
7. **Message Reactions**: Emoji reactions
8. **Canned Responses**: Quick reply templates for admins
9. **Analytics**: Response time, resolution metrics

## Code Examples

### Customer - Open Chat from Order Page

```jsx
// In OrderDetails.jsx
import { useNavigate } from 'react-router-dom';

function OrderDetails({ order }) {
  const openChatForOrder = () => {
    // Open chat widget with order context
    window.dispatchEvent(new CustomEvent('openChat', { 
      detail: { orderId: order._id } 
    }));
  };

  return (
    <button onClick={openChatForOrder}>
      Chat Support for this Order
    </button>
  );
}
```

### Update ChatWidget to handle order-specific chats

```jsx
// In ChatWidget.jsx - add useEffect
useEffect(() => {
  const handleOpenChat = (event) => {
    const { orderId } = event.detail || {};
    setIsOpen(true);
    if (orderId) {
      loadConversation(orderId);
    }
  };

  window.addEventListener('openChat', handleOpenChat);
  return () => window.removeEventListener('openChat', handleOpenChat);
}, []);

const loadConversation = async (orderId = null) => {
  // ... existing code but pass orderId
  const { data } = await getOrCreateConversation(orderId);
  // ...
};
```

## Performance Considerations

1. **Message Pagination**: Currently loads all messages (good for small chats, needs pagination for 100+ messages)
2. **Socket Rooms**: Efficient - only users in conversation receive updates
3. **Database Indexes**: Conversation and message indexes for fast queries
4. **Lean Queries**: Use `.lean()` for read-only operations

## Security Best Practices

1. **Sanitize Input**: Always trim and validate message text
2. **Rate Limiting**: Add rate limits to prevent spam (not implemented yet)
3. **XSS Protection**: React automatically escapes JSX content
4. **CORS**: Only allow frontend origin
5. **Authentication**: All routes protected with JWT middleware

---

**Last Updated**: January 28, 2026  
**Version**: 2.0  
**Status**: Production Ready ✅
