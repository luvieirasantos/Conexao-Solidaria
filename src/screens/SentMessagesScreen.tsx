import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Message } from '../types';
import { colors, spacing } from '../styles/theme';
import { storage } from '../services/storage';
import MessageCard from '../components/MessageCard';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SentMessages'>;
};

const SentMessagesScreen: React.FC<Props> = ({ navigation }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    const loadMessages = useCallback(async () => {
        try {
            const allMessages = await storage.getMessages();
            // Filtrar apenas mensagens enviadas pelo usuário atual
            const sentMessages = allMessages.filter(
                (msg) => msg.sender === 'current_user' // TODO: Substituir pelo ID do usuário atual
            );
            setMessages(sentMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }, []);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const handleEdit = (message: Message) => {
        // TODO: Implementar edição de mensagem
        Alert.alert('Em desenvolvimento', 'Funcionalidade em desenvolvimento');
    };

    const handleDelete = async (messageId: string) => {
        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir esta mensagem?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const allMessages = await storage.getMessages();
                            const updatedMessages = allMessages.filter(
                                (msg) => msg.id !== messageId
                            );
                            await storage.saveMessages(updatedMessages);
                            loadMessages();
                        } catch (error) {
                            console.error('Error deleting message:', error);
                            Alert.alert('Erro', 'Não foi possível excluir a mensagem');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MessageCard
                        message={item}
                        showActions
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        padding: spacing.md,
    },
});

export default SentMessagesScreen; 