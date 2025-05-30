import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Surface, ActivityIndicator, FAB } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { storage } from '../services/storage';
import { Message } from '../types';
import MessageCard from '../components/MessageCard';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SentMessages'>;
};

const SentMessagesScreen: React.FC<Props> = ({ navigation }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            const allMessages = await storage.getMessages();
            console.log('Mensagens carregadas:', allMessages);
            setMessages(allMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadMessages();
        });

        return unsubscribe;
    }, [navigation, loadMessages]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadMessages();
    }, [loadMessages]);

    const handleMessagePress = (message: Message) => {
        navigation.navigate('MessageDetails', { messageId: message.id });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {messages.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Surface style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>Nenhuma mensagem enviada</Text>
                        <Text style={styles.emptyText}>
                            Você ainda não enviou nenhuma mensagem. Use o botão + para criar uma nova mensagem.
                        </Text>
                    </Surface>
                </View>
            ) : (
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <MessageCard
                            message={item}
                            onPress={() => handleMessagePress(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('SendMessage')}
                color={colors.text.inverse}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    emptyContainer: {
        flex: 1,
        padding: spacing.lg,
        backgroundColor: colors.background,
    },
    emptyCard: {
        padding: spacing.lg,
        borderRadius: layout.borderRadius.lg,
        backgroundColor: colors.surface,
        ...layout.shadow.medium,
    },
    emptyTitle: {
        fontSize: typography.fontSize.xl,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: typography.fontSize.md,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    listContent: {
        padding: spacing.md,
    },
    fab: {
        position: 'absolute',
        margin: spacing.md,
        right: 0,
        bottom: 0,
        backgroundColor: colors.primary,
    },
});

export default SentMessagesScreen; 