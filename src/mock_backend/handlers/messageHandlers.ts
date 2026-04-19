import DB from '../database/db';
import type { Message } from '../../types/models/Message';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const messageHandlers = {
  async getConversationMessages(conversationId: string) {
    await delay(300);
    const messages = DB.getMessagesByConversation(conversationId);
    
    // Enrich with sender data
    return messages.map(msg => {
      const sender = DB.getUserById(msg.senderId);
      return { ...msg, sender };
    });
  },

  async sendMessage(data: Partial<Message>) {
    await delay(500);
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: data.conversationId!,
      senderId: data.senderId!,
      content: data.content || '',
      type: data.type || 'text',
      createdAt: new Date().toISOString(),
      isRead: false,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
    };
    return DB.addMessage(newMessage);
  },

  async markAsRead(messageIds: string[]) {
    await delay(200);
    const messages = DB.getMessagesByConversation('all');
    messageIds.forEach(id => {
      const msg = messages.find(m => m.id === id);
      if (msg) msg.isRead = true;
    });
    return { success: true };
  },
};
