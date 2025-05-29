import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, User } from '../types';

const STORAGE_KEYS = {
  USER: '@user',
  MESSAGES: '@messages',
};

export const storage = {
  // User
  saveUser: async (user: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  getUser: async (): Promise<User | null> => {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Messages
  saveMessages: async (messages: Message[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
      throw error;
    }
  },

  getMessages: async (): Promise<Message[]> => {
    try {
      const messages = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  },

  // Clear all data
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.MESSAGES,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
}; 