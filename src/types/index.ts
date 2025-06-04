import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  SendMessage: undefined;
  SentMessages: undefined;
  Settings: undefined;
  ConnectionStatus: undefined;
  MessageDetails: { messageId: string };
};

export type MessageStatus = 'pending' | 'sent' | 'received' | 'delivered' | 'error' | 'new';
export type MessagePriority = 'baixa' | 'média' | 'alta';

export type Message = {
  id: string;
  title: string;
  content: string;
  priority: MessagePriority;
  location?: string;
  sender: string;
  receiver: string;
  timestamp: string;
  status: MessageStatus;
  senderProfile?: {
    bloodType?: string;
    allergies?: string;
    medicalConditions?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    continuousMedication?: string;
    observations?: string;
    avatarUri?: string;
  };
};

export type User = {
  id?: number;
  nickname: string;
  bloodType?: string;
  allergies?: string;
  medicalConditions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  continuousMedication?: string;
  observations?: string;
  avatarUri?: string;
};

export type Settings = {
  notificationsEnabled: boolean;
  autoConnect: boolean;
  batterySaver: boolean;
  // Nickname foi movido para o User type
};

export interface ConnectionStatus {
    isBluetoothActive: boolean;
    discoveredDevices: number;
    pendingMessages: number;
} 