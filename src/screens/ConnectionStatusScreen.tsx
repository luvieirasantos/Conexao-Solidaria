import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  Button,
  ProgressBar,
  List,
  Switch,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { bleService } from '../services/bleService';
import { Device } from 'react-native-ble-plx';

type ConnectionStatusScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConnectionStatus'>;

const ConnectionStatusScreen: React.FC = () => {
  const navigation = useNavigation<ConnectionStatusScreenNavigationProp>();
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [batteryLevel, setBatteryLevel] = useState(0.75);
  const [isInitialized, setIsInitialized] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
  const theme = useTheme();

  const initializeBle = useCallback(async () => {
    try {
      const initialized = await bleService.initialize();
      setIsInitialized(initialized);
      if (!initialized) {
        Alert.alert(
          'Bluetooth Desligado',
          'Por favor, ligue o Bluetooth para usar o aplicativo.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro ao inicializar BLE:', error);
      Alert.alert(
        'Erro',
        'Não foi possível inicializar o Bluetooth. Verifique as permissões do aplicativo.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  const startScan = useCallback(() => {
    if (!isInitialized) {
      Alert.alert(
        'Bluetooth Desligado',
        'Por favor, ligue o Bluetooth para escanear dispositivos.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsScanning(true);
    setDiscoveredDevices([]);

    bleService.startScan(
      (device: Device) => {
        setDiscoveredDevices(prev => {
          const exists = prev.some(d => d.id === device.id);
          if (!exists) {
            return [...prev, device];
          }
          return prev;
        });
      },
      () => {
        setIsScanning(false);
      }
    );
  }, [isInitialized]);

  const stopScan = useCallback(() => {
    bleService.stopScan();
    setIsScanning(false);
  }, []);

  useEffect(() => {
    initializeBle();
    return () => {
      stopScan();
    };
  }, [initializeBle, stopScan]);

  const handleToggleBluetooth = () => {
    setIsBluetoothEnabled(!isBluetoothEnabled);
    if (!isBluetoothEnabled) {
      setIsDiscoverable(false);
      setIsScanning(false);
      setConnectedDevices([]);
    }
  };

  const handleToggleDiscoverable = () => {
    setIsDiscoverable(!isDiscoverable);
  };

  const getBatteryColor = (level: number) => {
    if (level > 0.5) return colors.success;
    if (level > 0.2) return colors.warning;
    return colors.error;
  };

  const getBatteryIcon = (level: number) => {
    if (level > 0.75) return 'battery-high';
    if (level > 0.5) return 'battery-medium';
    if (level > 0.25) return 'battery-low';
    return 'battery-alert';
  };

  const renderDeviceItem = (device: Device) => (
    <List.Item
      key={device.id}
      title={device.name || 'Dispositivo Desconhecido'}
      description={`ID: ${device.id}`}
      left={props => <List.Icon {...props} icon="bluetooth" />}
      right={props => (
        <IconButton
          {...props}
          icon="information"
          onPress={() => {
            Alert.alert(
              'Informações do Dispositivo',
              `Nome: ${device.name || 'Desconhecido'}\nID: ${device.id}\nRSSI: ${device.rssi}`
            );
          }}
        />
      )}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <IconButton
            icon="bluetooth"
            size={32}
            iconColor={isInitialized ? colors.success : colors.error}
          />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              Status do Bluetooth
            </Text>
            <Text style={[
              styles.statusText,
              { color: isInitialized ? colors.success : colors.error }
            ]}>
              {isInitialized ? 'Conectado' : 'Desconectado'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={startScan}
            disabled={isScanning || !isInitialized}
            style={styles.actionButton}
            icon="bluetooth-search"
          >
            {isScanning ? 'Escaneando...' : 'Escanear Dispositivos'}
          </Button>
          {isScanning && (
            <Button
              mode="outlined"
              onPress={stopScan}
              style={styles.actionButton}
              icon="stop"
            >
              Parar Scan
            </Button>
          )}
        </View>
      </Surface>

      <Surface style={styles.devicesCard}>
        <Text style={styles.sectionTitle}>Dispositivos Encontrados</Text>
        {isScanning ? (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.scanningText}>Procurando dispositivos...</Text>
          </View>
        ) : discoveredDevices.length > 0 ? (
          <List.Section>
            {discoveredDevices.map(renderDeviceItem)}
          </List.Section>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isInitialized
                ? 'Nenhum dispositivo encontrado. Tente escanear novamente.'
                : 'Ligue o Bluetooth para procurar dispositivos.'}
            </Text>
          </View>
        )}
      </Surface>

      <Surface style={styles.section}>
        <Text style={styles.sectionTitle}>Bateria</Text>
        <View style={styles.batteryContainer}>
          <IconButton
            icon={getBatteryIcon(batteryLevel)}
            size={32}
            iconColor={getBatteryColor(batteryLevel)}
            style={styles.batteryIcon}
          />
          <View style={styles.batteryInfo}>
            <Text style={styles.batteryText}>
              {Math.round(batteryLevel * 100)}%
            </Text>
            <ProgressBar
              progress={batteryLevel}
              color={getBatteryColor(batteryLevel)}
              style={styles.batteryProgress}
            />
          </View>
        </View>
      </Surface>

      <Surface style={styles.section}>
        <Text style={styles.sectionTitle}>Dicas</Text>
        <List.Item
          title="Economize Bateria"
          description="Mantenha o Bluetooth desativado quando não estiver em uso"
          left={(props) => (
            <List.Icon {...props} icon="battery-saver" color={colors.warning} />
          )}
        />
        <List.Item
          title="Alcance"
          description="O alcance máximo é de aproximadamente 10 metros"
          left={(props) => (
            <List.Icon {...props} icon="map-marker-distance" color={colors.info} />
          )}
        />
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  statusCard: {
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    ...layout.shadow.medium,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  statusInfo: {
    marginLeft: spacing.md,
  },
  statusTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statusText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  devicesCard: {
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.surface,
    ...layout.shadow.medium,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  scanningContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  scanningText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.md,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  batteryIcon: {
    margin: 0,
    marginRight: spacing.md,
  },
  batteryInfo: {
    flex: 1,
  },
  batteryText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  batteryProgress: {
    height: 8,
    borderRadius: 4,
  },
});

export default ConnectionStatusScreen; 