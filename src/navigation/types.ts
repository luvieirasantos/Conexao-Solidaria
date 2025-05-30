import { Message } from '../types';

export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  SendMessage: undefined;
  SentMessages: undefined;
  Settings: undefined;
  ConnectionStatus: undefined;
  MessageDetails: { message: Message };
}; 