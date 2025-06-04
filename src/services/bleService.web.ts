import { Message } from '../types';
import { Device } from 'react-native-ble-plx'; // Import Device type even in dummy

// Define the interface for the BleService (should be the same as in .android.ts)
interface IBleService {
  initialize(): Promise<boolean>;
  startScan(onDeviceFound: (device: Device) => void, onScanComplete: () => void): void;
  stopScan(): void;
  connectToDevice(deviceId: string): Promise<Device | null>;
  disconnectDevice(deviceId: string): Promise<void>;
  writeCharacteristic(deviceId: string, serviceUuid: string, characteristicUuid: string, data: string): Promise<void>;
  setupNotifications(deviceId: string, serviceUuid: string, characteristicUuid: string, onMessageReceived: (message: Message) => void): Promise<any>;
  sendMessageToDevices(message: Message): Promise<void>;
  startReceivingMessages(onMessageReceived: (message: Message) => void): void;
  stopReceivingMessages(): void;
}

// Web implementation of BleService
class BleService implements IBleService {
  async initialize(): Promise<boolean> {
    console.log('BLE not supported on web platform');
    return false;
  }

  startScan(onDeviceFound: (device: Device) => void, onScanComplete: () => void): void {
    console.log('BLE scanning not supported on web platform');
    onScanComplete();
  }

  stopScan(): void {
    console.log('BLE scanning not supported on web platform');
  }

  async connectToDevice(deviceId: string): Promise<Device | null> {
    console.log('BLE connection not supported on web platform');
    return null;
  }

  async disconnectDevice(deviceId: string): Promise<void> {
    console.log('BLE disconnection not supported on web platform');
  }

  async writeCharacteristic(deviceId: string, serviceUuid: string, characteristicUuid: string, data: string): Promise<void> {
    console.log('BLE writing not supported on web platform');
  }

  async setupNotifications(deviceId: string, serviceUuid: string, characteristicUuid: string, onMessageReceived: (message: Message) => void): Promise<any> {
    console.log('BLE notifications not supported on web platform');
    return null;
  }

  async sendMessageToDevices(message: Message): Promise<void> {
    console.log('BLE messaging not supported on web platform');
  }

  startReceivingMessages(onMessageReceived: (message: Message) => void): void {
    console.log('BLE message receiving not supported on web platform');
  }

  stopReceivingMessages(): void {
    console.log('BLE message receiving not supported on web platform');
  }
}

export const bleService = new BleService(); 