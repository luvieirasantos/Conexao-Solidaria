import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, User, Settings } from '../types';

interface Settings {
  notificationsEnabled: boolean;
  autoConnect: boolean;
  batterySaver: boolean;
  nickname: string;
}

const STORAGE_KEYS = {
  USER: '@user',
  MESSAGES: '@messages',
  SETTINGS: '@settings',
};

class StorageService {
  // User
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Messages
  async saveMessages(messages: Message[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
      throw error;
    }
  }

  async getMessages(): Promise<Message[]> {
    try {
      const messagesJson = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
      const messages = messagesJson ? JSON.parse(messagesJson) : [];
      console.log('Mensagens recuperadas:', messages);
      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  // Configurações
  async saveSettings(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  async getSettings(): Promise<Settings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settingsJson ? JSON.parse(settingsJson) : { nickname: 'Usuário' };
    } catch (error) {
      console.error('Error getting settings:', error);
      return { nickname: 'Usuário' };
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.MESSAGES,
        STORAGE_KEYS.SETTINGS,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // Mensagens
  async saveMessage(message: Message): Promise<void> {
    try {
      const messages = await this.getMessages();
      messages.unshift(message);
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      console.log('Mensagem salva com sucesso:', message);
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      const messages = await this.getMessages();
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}

export const storage = new StorageService(); 