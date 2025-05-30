import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  Button,
  ProgressBar,
  List,
  Switch,
  useTheme,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, layout } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ConnectionStatus'>;
};

const ConnectionStatusScreen: React.FC<Props> = ({ navigation }) => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [batteryLevel, setBatteryLevel] = useState(0.75);
  const theme = useTheme();

  useEffect(() => {
    // TODO: Implementar lógica real de Bluetooth
    // Por enquanto, apenas simulação
    const interval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(0, prev - 0.01));
    }, 60000); // Diminui 1% a cada minuto

    return () => clearInterval(interval);
  }, []);

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

  const handleStartScan = () => {
    setIsScanning(true);
    // TODO: Implementar lógica real de scan
    setTimeout(() => {
      setIsScanning(false);
      setConnectedDevices(['Dispositivo 1', 'Dispositivo 2']);
    }, 3000);
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

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Status da Conexão</Text>
          <IconButton
            icon="bluetooth"
            size={24}
            iconColor={isBluetoothEnabled ? colors.primary : colors.text.secondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bluetooth</Text>
          <List.Item
            title="Status do Bluetooth"
            description={isBluetoothEnabled ? 'Ativado' : 'Desativado'}
            left={(props) => (
              <List.Icon
                {...props}
                icon={isBluetoothEnabled ? 'bluetooth' : 'bluetooth-off'}
                color={isBluetoothEnabled ? colors.primary : colors.text.secondary}
              />
            )}
            right={(props) => (
              <Switch
                value={isBluetoothEnabled}
                onValueChange={handleToggleBluetooth}
                color={colors.primary}
              />
            )}
          />
        </View>

        {isBluetoothEnabled && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Configurações</Text>
              <List.Item
                title="Modo Visível"
                description="Permite que outros dispositivos encontrem você"
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={isDiscoverable ? 'eye' : 'eye-off'}
                    color={colors.text.secondary}
                  />
                )}
                right={(props) => (
                  <Switch
                    value={isDiscoverable}
                    onValueChange={handleToggleDiscoverable}
                    color={colors.primary}
                  />
                )}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dispositivos</Text>
              <Button
                mode="contained"
                onPress={handleStartScan}
                loading={isScanning}
                disabled={isScanning}
                style={styles.scanButton}
                icon="magnify"
              >
                {isScanning ? 'Procurando...' : 'Procurar Dispositivos'}
              </Button>

              {connectedDevices.length > 0 && (
                <View style={styles.devicesList}>
                  {connectedDevices.map((device, index) => (
                    <List.Item
                      key={index}
                      title={device}
                      description="Conectado"
                      left={(props) => (
                        <List.Icon
                          {...props}
                          icon="bluetooth-connect"
                          color={colors.success}
                        />
                      )}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        <View style={styles.section}>
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
        </View>

        <View style={styles.section}>
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
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.surface,
    ...layout.shadow.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  scanButton: {
    marginBottom: spacing.md,
  },
  devicesList: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
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