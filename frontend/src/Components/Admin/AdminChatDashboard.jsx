import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import {
  FiMessageCircle,
  FiSend,
  FiX,
  FiCheckCircle,
  FiArrowLeft,
  FiUser,
  FiMail,
  FiClock,
} from 'react-icons/fi';
import {
  getAllConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  closeConversation,
} from '../../Api/chatApi';

const AdminChatDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket
  useEffect(() => {
    if (user) {
      const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';
      const newSocket = io(socketUrl, {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log('Admin socket connected');
        newSocket.emit('admin_online');
      });

      // Listen for customer messages
      newSocket.on('customer_message', (data) => {
        // Update conversation list
        loadConversations();

        // Update messages if this conversation is open
        if (selectedConversation && data.conversationId === selectedConversation._id) {
          setMessages((prev) => [...prev, data.message]);
          scrollToBottom();
        }
      });

      // Listen for typing indicators
      newSocket.on('user_typing', (data) => {
        if (selectedConversation && data.conversationId === selectedConversation._id && data.role === 'customer') {
          setTyping(data.typing);
        }
      });

      // Listen for messages in conversation room
      newSocket.on('message_received', (data) => {
        if (selectedConversation && data.conversationId === selectedConversation._id) {
          setMessages((prev) => [...prev, data.message]);
          scrollToBottom();
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, selectedConversation]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const { data } = await getAllConversations();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setLoading(true);

    try {
      const { data } = await getConversationMessages(conversation._id);
      setMessages(data.messages);

      // Join conversation room
      if (socket) {
        socket.emit('join_conversation', conversation._id);
      }

      // Mark messages as read
      if (conversation.unreadCount > 0) {
        await markMessagesAsRead(conversation._id);
        loadConversations(); // Refresh conversation list

        if (socket) {
          socket.emit('messages_read', { conversationId: conversation._id });
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const { data } = await sendMessage(selectedConversation._id, messageText);
      
      // Add message to local state
      setMessages((prev) => [...prev, data.message]);

      // Emit socket event for real-time delivery
      if (socket) {
        socket.emit('new_message', {
          conversationId: selectedConversation._id,
          messageId: data.message._id,
        });
      }

      // Refresh conversation list
      loadConversations();
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleTyping = () => {
    if (socket && selectedConversation) {
      socket.emit('typing_start', {
        conversationId: selectedConversation._id,
        role: 'admin',
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', {
          conversationId: selectedConversation._id,
          role: 'admin',
        });
      }, 2000);
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConversation) return;

    if (window.confirm('Are you sure you want to close this conversation?')) {
      try {
        await closeConversation(selectedConversation._id);
        setSelectedConversation(null);
        setMessages([]);
        loadConversations();
      } catch (error) {
        console.error('Error closing conversation:', error);
        alert('Failed to close conversation');
      }
    }
  };

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="flex h-screen">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-amber-500/20 flex flex-col">
          <div className="p-6 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-4 transition-colors"
            >
              <FiArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <FiMessageCircle className="text-amber-500" size={24} />
              </div>
              Support Chats
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              {conversations.filter(c => c.status === 'open').length} active conversations
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <div className="bg-gray-800/50 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <FiMessageCircle size={40} className="opacity-50" />
                </div>
                <p className="font-semibold">No conversations yet</p>
                <p className="text-sm mt-2">Customer chats will appear here</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 border-b border-gray-800/50 cursor-pointer hover:bg-gray-800/30 transition-all duration-200 ${
                    selectedConversation?._id === conv._id
                      ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-l-amber-500'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <FiUser size={16} className="text-amber-500" />
                      </div>
                      <h3 className="font-semibold">{conv.customerName}</h3>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse shadow-lg">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                    <FiMail size={12} />
                    <p className="truncate">{conv.customerEmail}</p>
                  </div>
                  {conv.lastMessage && (
                    <div className="flex justify-between items-center mt-2 bg-gray-800/30 rounded-lg p-2">
                      <p className="text-sm text-gray-300 truncate flex-1">
                        {conv.lastMessage.messageText}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 flex items-center gap-1">
                        <FiClock size={10} />
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        conv.status === 'open'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                      }`}
                    >
                      {conv.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-gray-900/90 to-gray-900/50 backdrop-blur-sm border-b border-amber-500/20 p-6 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-full shadow-lg">
                    <FiUser size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">
                      {selectedConversation.customerName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <FiMail size={14} />
                      {selectedConversation.customerEmail}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  {selectedConversation.status === 'open' && (
                    <button
                      onClick={handleCloseConversation}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg hover:shadow-red-500/30 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <FiX size={18} />
                      Close Chat
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-gray-950 to-gray-900 custom-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mb-4"></div>
                    <div className="text-gray-400 font-medium">Loading messages...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <div className="bg-gray-800/50 rounded-full p-8 w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                        <FiMessageCircle size={60} className="opacity-30" />
                      </div>
                      <p className="text-lg font-semibold">No messages yet</p>
                      <p className="text-sm mt-2">
                        Waiting for customer to start conversation
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.senderRole === 'admin'
                          ? 'justify-end'
                          : 'justify-start'
                      } animate-fadeIn`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl p-4 shadow-lg ${
                          msg.senderRole === 'admin'
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-br-none'
                            : 'bg-gray-800/70 backdrop-blur-sm text-gray-100 rounded-bl-none border border-gray-700/50'
                        }`}
                      >
                        <p className="text-sm mb-2 leading-relaxed">{msg.messageText}</p>
                        <div className="flex items-center justify-between gap-2 text-xs opacity-75">
                          <div className="flex items-center gap-1">
                            <FiClock size={12} />
                            <span>{formatTime(msg.createdAt)}</span>
                          </div>
                          {msg.senderRole === 'admin' && msg.isRead && (
                            <div className="flex items-center gap-1">
                              <FiCheckCircle size={14} />
                              <span>Read</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {typing && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="bg-gray-800/70 backdrop-blur-sm text-gray-100 rounded-2xl rounded-bl-none p-4 shadow-lg border border-gray-700/50">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce"></div>
                          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm italic">Customer is typing</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {selectedConversation.status === 'open' && (
                <form
                  onSubmit={handleSendMessage}
                  className="bg-gray-900/80 backdrop-blur-sm border-t border-amber-500/20 p-6"
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-800/50 backdrop-blur-sm text-white border border-gray-700/50 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center gap-2 font-semibold"
                    >
                      <FiSend size={20} />
                      Send
                    </button>
                  </div>
                </form>
              )}

              {selectedConversation.status === 'closed' && (
                <div className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 p-6 text-center">
                  <div className="bg-gray-800/50 rounded-lg p-4 inline-block">
                    <FiX size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 font-medium">This conversation is closed</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900">
              <div className="text-center text-gray-400">
                <div className="bg-gray-800/30 rounded-full p-10 w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                  <FiMessageCircle size={80} className="opacity-20" />
                </div>
                <p className="text-2xl mb-3 font-semibold">Select a conversation</p>
                <p className="text-sm text-gray-500">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatDashboard;
