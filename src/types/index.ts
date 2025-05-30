export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'error';

export interface Message {
    id: string;
    title: string;
    content: string;
    priority: 'baixa' | 'média' | 'alta';
    location?: string;
    sender: string;
    receiver: string;
    timestamp: string;
    status: MessageStatus;
}

export interface Settings {
    notificationsEnabled: boolean;
    autoConnect: boolean;
    batterySaver: boolean;
    nickname: string;
}

export interface User {
    id: string;
    nickname: string;
    lastSeen: number;
}

export interface ConnectionStatus {
    isBluetoothActive: boolean;
    discoveredDevices: number;
    pendingMessages: number;
} 