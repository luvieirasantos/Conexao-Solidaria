import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Message } from '../types';
import { colors, spacing, typography } from '../styles/theme';
import { storage } from '../services/storage';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'MessageDetails'>;
    route: RouteProp<RootStackParamList, 'MessageDetails'>;
};

const MessageDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    const [message, setMessage] = useState<Message | null>(null);

    useEffect(() => {
        loadMessage();
    }, []);

    const loadMessage = async () => {
        try {
            const messages = await storage.getMessages();
            const foundMessage = messages.find((msg) => msg.id === route.params.messageId);
            if (foundMessage) {
                setMessage(foundMessage);
                // Marcar como lida se for uma mensagem recebida
                if (foundMessage.receiver === 'current_user' && foundMessage.status === 'new') {
                    const updatedMessage = { ...foundMessage, status: 'read' };
                    const updatedMessages = messages.map((msg) =>
                        msg.id === foundMessage.id ? updatedMessage : msg
                    );
                    await storage.saveMessages(updatedMessages);
                    setMessage(updatedMessage);
                }
            }
        } catch (error) {
            console.error('Error loading message:', error);
        }
    };

    if (!message) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Mensagem não encontrada</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.header}>
                        <Text style={styles.sender}>{message.sender}</Text>
                        <Text style={styles.timestamp}>
                            {new Date(message.timestamp).toLocaleString()}
                        </Text>
                    </View>

                    <Text style={styles.content}>{message.content}</Text>

                    <View style={styles.statusContainer}>
                        <Text style={styles.statusLabel}>Status:</Text>
                        <Text
                            style={[
                                styles.status,
                                {
                                    color:
                                        message.status === 'delivered' || message.status === 'synced'
                                            ? colors.success
                                            : message.status === 'pending'
                                                ? colors.pending
                                                : colors.primary,
                                },
                            ]}
                        >
                            {message.status === 'new'
                                ? 'Novo'
                                : message.status === 'read'
                                    ? 'Lido'
                                    : message.status === 'pending'
                                        ? 'Pendente'
                                        : message.status === 'delivered'
                                            ? 'Entregue'
                                            : 'Sincronizado'}
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            {message.status === 'pending' && (
                <Button
                    mode="contained"
                    onPress={() => {
                        // TODO: Implementar reenvio da mensagem
                        console.log('Reenviando mensagem...');
                    }}
                    style={styles.resendButton}
                >
                    Reenviar Mensagem
                </Button>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    card: {
        marginBottom: spacing.md,
    },
    header: {
        marginBottom: spacing.md,
    },
    sender: {
        ...typography.subtitle,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    timestamp: {
        ...typography.caption,
        color: colors.text,
        opacity: 0.7,
    },
    content: {
        ...typography.body,
        color: colors.text,
        marginBottom: spacing.md,
        lineHeight: 24,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    statusLabel: {
        ...typography.body,
        color: colors.text,
        marginRight: spacing.sm,
    },
    status: {
        ...typography.body,
        fontWeight: '600',
    },
    errorText: {
        ...typography.body,
        color: colors.error,
        textAlign: 'center',
        marginTop: spacing.xl,
    },
    resendButton: {
        marginTop: spacing.md,
    },
});

export default MessageDetailsScreen; 