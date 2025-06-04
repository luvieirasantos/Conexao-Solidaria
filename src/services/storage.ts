import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, User, Settings } from '../types';

const STORAGE_KEYS = {
  USER: '@user',
  MESSAGES: '@messages',
  SETTINGS: '@settings',
};

class StorageService {
  // User
  async saveUser(user: User): Promise<void> {
    try {
      console.log('Saving user profile:', user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      console.log('User profile saved successfully.');
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const user = userJson ? JSON.parse(userJson) : null;
      console.log('User profile retrieved:', user);
      // Retorna um objeto User vazio se não houver usuário salvo, com nickname padrão
      return user || { 
        nickname: 'Usuário',
        bloodType: '',
        allergies: '',
        medicalConditions: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        continuousMedication: '',
        observations: '',
        avatarUri: undefined,
       };
    } catch (error) {
      console.error('Error getting user profile:', error);
      // Retorna um objeto User vazio com nickname padrão em caso de erro
      return { 
        nickname: 'Usuário',
        bloodType: '',
        allergies: '',
        medicalConditions: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        continuousMedication: '',
        observations: '',
        avatarUri: undefined,
       };
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
      // Certifica-se de não salvar o nickname aqui
      const { notificationsEnabled, autoConnect, batterySaver } = settings;
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ notificationsEnabled, autoConnect, batterySaver }));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  async getSettings(): Promise<Settings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      // Retorna um objeto Settings com valores padrão, sem nickname
      return settingsJson ? JSON.parse(settingsJson) : {
        notificationsEnabled: true,
        autoConnect: true,
        batterySaver: false,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
       // Retorna um objeto Settings com valores padrão em caso de erro
      return {
        notificationsEnabled: true,
        autoConnect: true,
        batterySaver: false,
      };
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      console.log('Limpando todos os dados do storage...');
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.MESSAGES,
        STORAGE_KEYS.SETTINGS,
      ]);
      console.log('Todos os dados foram limpos com sucesso');
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