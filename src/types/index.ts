export type MessageStatus = 'new' | 'read' | 'pending' | 'delivered' | 'synced';

export interface Message {
    id: string;
    content: string;
    sender: string;
    receiver: string;
    timestamp: number;
    status: MessageStatus;
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