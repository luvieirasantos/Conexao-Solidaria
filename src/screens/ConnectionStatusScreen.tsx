import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../styles/theme';
import { ConnectionStatus } from '../types';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ConnectionStatus'>;
};

const ConnectionStatusScreen: React.FC<Props> = () => {
    const [status, setStatus] = useState<ConnectionStatus>({
        isBluetoothActive: false,
        discoveredDevices: 0,
        pendingMessages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simular carregamento do status
        const timer = setTimeout(() => {
            setStatus({
                isBluetoothActive: true,
                discoveredDevices: 3,
                pendingMessages: 2,
            });
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleSync = () => {
        // TODO: Implementar sincronização
        console.log('Sincronizando...');
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Carregando status...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Status do Bluetooth</Text>
                    <View style={styles.statusRow}>
                        <Text style={styles.label}>Estado:</Text>
                        <Text
                            style={[
                                styles.value,
                                { color: status.isBluetoothActive ? colors.success : colors.error },
                            ]}
                        >
                            {status.isBluetoothActive ? 'Ativo' : 'Inativo'}
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Dispositivos</Text>
                    <View style={styles.statusRow}>
                        <Text style={styles.label}>Dispositivos detectados:</Text>
                        <Text style={styles.value}>{status.discoveredDevices}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Mensagens</Text>
                    <View style={styles.statusRow}>
                        <Text style={styles.label}>Pendentes de sincronização:</Text>
                        <Text style={styles.value}>{status.pendingMessages}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Button
                mode="contained"
                onPress={handleSync}
                style={styles.syncButton}
                labelStyle={styles.syncButtonLabel}
            >
                Forçar Sincronização
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        ...typography.body,
        color: colors.text,
        marginTop: spacing.md,
    },
    card: {
        marginBottom: spacing.md,
    },
    title: {
        ...typography.subtitle,
        color: colors.primary,
        marginBottom: spacing.md,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    label: {
        ...typography.body,
        color: colors.text,
    },
    value: {
        ...typography.body,
        fontWeight: '600',
    },
    syncButton: {
        marginTop: spacing.md,
        padding: spacing.sm,
    },
    syncButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ConnectionStatusScreen; 