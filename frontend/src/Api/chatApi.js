import API from './config';

// Customer endpoints
export const getOrCreateConversation = (orderId = null) => {
  const params = orderId ? { orderId } : {};
  return API.get('/chat/conversation', { params });
};

export const sendMessage = (conversationId, messageText) =>
  API.post('/chat/message', { conversationId, messageText });

export const markMessagesAsRead = (conversationId) =>
  API.put(`/chat/conversation/${conversationId}/read`);

export const reopenConversation = (conversationId) =>
  API.put(`/chat/conversation/${conversationId}/reopen`);

// Admin endpoints
export const getAllConversations = () => API.get('/admin/conversations');

export const getConversationMessages = (conversationId) =>
  API.get(`/admin/conversation/${conversationId}/messages`);

export const closeConversation = (conversationId) =>
  API.put(`/admin/conversation/${conversationId}/close`);
