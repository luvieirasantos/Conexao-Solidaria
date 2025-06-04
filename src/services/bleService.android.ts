import { BleManager, Device } from 'react-native-ble-plx';
import { Platform, Alert } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { Message } from '../types';
import { storage } from './storage';
import { Buffer } from 'buffer';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const WRITE_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const NOTIFY_CHARACTERISTIC_UUID = 'e1f404b8-7d99-4a98-a7b3-2e2c4d34d8f7';

// Define the interface for the BleService
interface IBleService {
  initialize(): Promise<boolean>;
  startScan(onDeviceFound: (device: Device) => void, onScanComplete: () => void): void;
  stopScan(): void;
  connectToDevice(deviceId: string): Promise<Device | null>;
  disconnectDevice(deviceId: string): Promise<void>;
  writeCharacteristic(deviceId: string, serviceUuid: string, characteristicUuid: string, data: string): Promise<void>;
  setupNotifications(deviceId: string, serviceUuid: string, characteristicUuid: string, onMessageReceived: (message: Message) => void): Promise<any>; // Return type depends on the library
  sendMessageToDevices(message: Message): Promise<void>;
  startReceivingMessages(onMessageReceived: (message: Message) => void): void;
  stopReceivingMessages(): void;
}

// Real BleService implementation for Android
class BleService implements IBleService {
  private manager: BleManager;
  private discoveredDevices = new Map<string, Device>();
  private isScanning = false;

  constructor() {
    this.manager = new BleManager();
  }

  async initialize(): Promise<boolean> {
    console.log('Inicializando BleService (Android)...');
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permissão de Localização para Bluetooth',
        message: 'Este aplicativo precisa de acesso à sua localização para detectar dispositivos Bluetooth.',
        buttonNeutral: 'Perguntar Depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      }
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permissão de localização negada.');
      return false;
    }

    // Android 12+ permissions
    if (Number(Platform.Version) >= 31) {
      const bluetoothScanGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: 'Permissão de Scan Bluetooth',
          message: 'Este aplicativo precisa de permissão para escanear dispositivos Bluetooth.',
          buttonNeutral: 'Perguntar Depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        }
      );
      const bluetoothConnectGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: 'Permissão de Conexão Bluetooth',
          message: 'Este aplicativo precisa de permissão para se conectar a dispositivos Bluetooth.',
          buttonNeutral: 'Perguntar Depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        }
      );
      if (bluetoothScanGranted !== PermissionsAndroid.RESULTS.GRANTED || bluetoothConnectGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permissões de scan/conexão Bluetooth negadas.');
        return false;
      }
    }

    return new Promise((resolve) => {
      const subscription = this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          subscription.remove();
          console.log('Bluetooth ligado e pronto.');
          resolve(true);
        }
        console.log('Estado do Bluetooth:', state);
        if (state === 'PoweredOff') {
           Alert.alert('Bluetooth Desligado', 'Por favor, ligue o Bluetooth para usar o aplicativo.');
           resolve(false);
        }
      }, true);
    });
  }

  async startScan(onDeviceFound: (device: Device) => void, onScanComplete: () => void) {
    if (this.isScanning) {
      console.log('Scan já em andamento.');
      return;
    }
    this.isScanning = true;
    this.discoveredDevices.clear();
    console.log('Iniciando scan por serviço:', SERVICE_UUID);

    this.manager.startDeviceScan(
      [SERVICE_UUID],
      null,
      (error, device) => {
        if (error) {
          console.error('Erro durante o scan:', error);
          this.stopScan();
          onScanComplete();
          return;
        }
        if (device && !this.discoveredDevices.has(device.id)) {
          console.log('Dispositivo encontrado:', device.name || device.id);
          this.discoveredDevices.set(device.id, device);
          onDeviceFound(device);
        }
      }
    );

    setTimeout(() => {
      this.stopScan();
      onScanComplete();
      console.log('Scan concluído.');
    }, 10000);
  }

  stopScan() {
    if (this.isScanning) {
      this.manager.stopDeviceScan();
      this.isScanning = false;
      console.log('Scan parado.');
    }
  }

  async connectToDevice(deviceId: string): Promise<Device | null> {
    try {
      console.log('Conectando a:', deviceId);
      const device = await this.manager.connectToDevice(deviceId);
      console.log('Conectado a:', device.id);
      await device.discoverAllServicesAndCharacteristics();
      console.log('Serviços e características descobertos.');
      return device;
    } catch (error) {
      console.error('Erro ao conectar a', deviceId, ':', error);
      return null;
    }
  }

  async disconnectDevice(deviceId: string): Promise<void> {
    try {
      console.log('Desconectando de:', deviceId);
      await this.manager.cancelDeviceConnection(deviceId);
      console.log('Desconectado de:', deviceId);
    } catch (error) {
      console.error('Erro ao desconectar de', deviceId, ':', error);
    }
  }

  async writeCharacteristic(deviceId: string, serviceUuid: string, characteristicUuid: string, data: string): Promise<void> {
    try {
      const base64Data = Buffer.from(data).toString('base64');
      console.log(`Escrevendo em ${deviceId}/${characteristicUuid}: ${data}`);
      await this.manager.writeCharacteristicWithResponseForDevice(
        deviceId,
        serviceUuid,
        characteristicUuid,
        base64Data
      );
      console.log('Escrita bem-sucedida.');
    } catch (error) {
      console.error(`Erro ao escrever em ${deviceId}/${characteristicUuid}:`, error);
      throw error;
    }
  }

  async setupNotifications(deviceId: string, serviceUuid: string, characteristicUuid: string, onMessageReceived: (message: Message) => void): Promise<any> {
    try {
      const characteristic = await this.manager.monitorCharacteristicForDevice(
        deviceId,
        serviceUuid,
        characteristicUuid,
        (error, char) => {
          if (error) {
            console.error(`Erro na notificação para ${deviceId}/${characteristicUuid}:`, error);
            return;
          }
          if (char?.value) {
            const receivedData = Buffer.from(char.value, 'base64').toString();
            console.log(`Dados recebidos via notificação de ${deviceId}/${characteristicUuid}: ${receivedData}`);
            try {
              const messageObject = JSON.parse(receivedData);
              const receivedMessage: Message = {
                 id: messageObject.id || Date.now().toString(),
                 title: messageObject.titulo || 'Sem Título',
                 content: messageObject.mensagem || 'Sem Conteúdo',
                 priority: messageObject.prioridade as any || 'média',
                 location: messageObject.localizacao || undefined,
                 sender: messageObject.perfil?.nickname || messageObject.remetente || 'Desconhecido',
                 receiver: messageObject.destinatario || 'broadcast',
                 timestamp: messageObject.timestamp || new Date().toISOString(),
                 status: 'received' as const,
                 senderProfile: messageObject.perfil,
              };
              console.log('Mensagem recebida parseada:', receivedMessage);
              storage.saveMessage(receivedMessage);
              onMessageReceived(receivedMessage);

            } catch (parseError) {
              console.error('Erro ao parsear JSON da mensagem recebida:', parseError);
            }
          }
        }
      );
      console.log(`Notificações configuradas para ${deviceId}/${characteristicUuid}`);
      return characteristic;
    } catch (error) {
      console.error(`Erro ao configurar notificações para ${deviceId}/${characteristicUuid}:`, error);
      throw error;
    }
  }

  async sendMessageToDevices(message: Message) {
    this.stopScan();

    const devicesToSend = Array.from(this.discoveredDevices.values());

    if (devicesToSend.length === 0) {
      console.log('Nenhum dispositivo descoberto para enviar a mensagem.');
      return;
    }

    const messageJson = JSON.stringify({
      id: message.id,
      titulo: message.title,
      mensagem: message.content,
      prioridade: message.priority,
      localizacao: message.location,
      perfil: message.senderProfile,
      remetente: message.sender,
      timestamp: message.timestamp,
      status: message.status,
    });

    for (const device of devicesToSend) {
      try {
        const connectedDevice = await this.connectToDevice(device.id);
        if (connectedDevice) {
          await this.writeCharacteristic(
            connectedDevice.id,
            SERVICE_UUID,
            WRITE_CHARACTERISTIC_UUID,
            messageJson
          );
          console.log(`Mensagem enviada para ${connectedDevice.id}.`);
        }
      } catch (error) {
        console.error(`Erro ao enviar mensagem para ${device.id}:`, error);
      }
    }
    console.log('Processo de envio para todos os dispositivos descobertos concluído.');
    this.discoveredDevices.clear();
  }

  async startReceivingMessages(onMessageReceived: (message: Message) => void) {
    console.log('Iniciando recebimento de mensagens via BLE (Android)...');
    this.manager.startDeviceScan(
      [SERVICE_UUID],
      null,
      async (error, device) => {
        if (error) {
          console.error('Erro durante o scan para recebimento:', error);
          return;
        }

        if (device && !this.discoveredDevices.has(device.id)) {
          console.log('Dispositivo encontrado para recebimento:', device.name || device.id);
          this.discoveredDevices.set(device.id, device);

          try {
            const connectedDevice = await this.connectToDevice(device.id);
            if (connectedDevice) {
              this.setupNotifications(
                connectedDevice.id,
                SERVICE_UUID,
                NOTIFY_CHARACTERISTIC_UUID,
                onMessageReceived
              );
              console.log(`Notificações configuradas para ${connectedDevice.id} para recebimento.`);
            }
          } catch (connError) {
            console.error(`Erro ao conectar e configurar notificações para ${device.id}:`, connError);
          }
        }
      }
    );
  }

  stopReceivingMessages() {
    console.log('Parando recebimento de mensagens BLE (Android)...');
    this.stopScan();
  }
}

export const bleService: IBleService = new BleService(); 