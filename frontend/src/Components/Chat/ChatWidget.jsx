import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { FiMessageCircle, FiX, FiSend, FiUser, FiClock, FiCheck } from 'react-icons/fi';
import {
  getOrCreateConversation,
  sendMessage,
  markMessagesAsRead,
} from '../../Api/chatApi';

const ChatWidget = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';
      const newSocket = io(socketUrl, {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        newSocket.emit('user_online', user._id);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  // Load conversation when widget opens
  useEffect(() => {
    if (isOpen && !conversation && isAuthenticated) {
      loadConversation();
    }
  }, [isOpen, isAuthenticated, conversation]);

  // Socket event listeners
  useEffect(() => {
    if (socket && conversation) {
      socket.emit('join_conversation', conversation._id);

      // Listen for admin messages
      socket.on('admin_message', (data) => {
        if (data.conversationId === conversation._id) {
          setMessages((prev) => [...prev, data.message]);
          if (!isOpen) {
            setUnreadCount((prev) => prev + 1);
          }
          scrollToBottom();
        }
      });

      // Listen for messages in conversation room
      socket.on('message_received', (data) => {
        if (data.conversationId === conversation._id) {
          setMessages((prev) => [...prev, data.message]);
          scrollToBottom();
        }
      });

      // Listen for typing indicator
      socket.on('user_typing', (data) => {
        if (data.conversationId === conversation._id && data.role === 'admin') {
          setTyping(data.typing);
        }
      });

      return () => {
        socket.off('admin_message');
        socket.off('message_received');
        socket.off('user_typing');
      };
    }
  }, [socket, conversation, isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    setLoading(true);
    try {
      const { data } = await getOrCreateConversation();
      setConversation(data.conversation);
      setMessages(data.messages);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const { data } = await sendMessage(conversation._id, messageText);
      
      // Add message to local state immediately
      setMessages((prev) => [...prev, data.message]);

      // Emit socket event for real-time delivery
      if (socket) {
        socket.emit('new_message', {
          conversationId: conversation._id,
          messageId: data.message._id,
        });
      }

      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleTyping = () => {
    if (socket && conversation) {
      socket.emit('typing_start', {
        conversationId: conversation._id,
        role: 'customer',
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', {
          conversationId: conversation._id,
          role: 'customer',
        });
      }, 2000);
    }
  };

  const handleOpenChat = async () => {
    setIsOpen(true);
    
    // Mark messages as read when opening chat
    if (conversation && unreadCount > 0) {
      try {
        await markMessagesAsRead(conversation._id);
        setUnreadCount(0);
        
        // Update message read status locally
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderRole === 'admin' ? { ...msg, isRead: true } : msg
          )
        );

        if (socket) {
          socket.emit('messages_read', { conversationId: conversation._id });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 rounded-full shadow-2xl hover:shadow-amber-500/50 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
        >
          <FiMessageCircle size={26} className="group-hover:rotate-12 transition-transform duration-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold animate-pulse shadow-lg">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-gray-900 border-2 border-amber-500/20 rounded-2xl shadow-2xl flex flex-col z-50 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FiUser size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Support Chat</h3>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online - We're here to help</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <FiX size={22} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-950 to-gray-900">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
                <div className="text-gray-400">Loading conversation...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <div className="bg-gray-800 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center mb-4">
                    <FiMessageCircle size={48} className="opacity-50" />
                  </div>
                  <p className="text-lg font-semibold mb-2">Start a conversation</p>
                  <p className="text-sm">We typically reply within minutes</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderRole === 'customer' ? 'justify-end' : 'justify-start'
                  } animate-fadeIn`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 shadow-md ${
                      msg.senderRole === 'customer'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.messageText}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FiClock size={10} className="opacity-60" />
                      <span className="text-xs opacity-75">
                        {formatTime(msg.createdAt)}
                      </span>
                      {msg.senderRole === 'customer' && msg.isRead && (
                        <FiCheck size={12} className="opacity-75 ml-1" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {typing && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-gray-800 text-gray-100 rounded-2xl rounded-bl-none p-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm italic">Admin is typing</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-gray-900 border-t border-gray-700 rounded-b-2xl"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                <FiSend size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
