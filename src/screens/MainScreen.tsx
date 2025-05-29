import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Message } from '../types';
import { colors, spacing } from '../styles/theme';
import { storage } from '../services/storage';
import MessageCard from '../components/MessageCard';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadMessages = useCallback(async () => {
    try {
      const allMessages = await storage.getMessages();
      // Filtrar apenas mensagens recebidas (não enviadas pelo usuário atual)
      const receivedMessages = allMessages.filter(
        (msg) => msg.receiver === 'current_user' // TODO: Substituir pelo ID do usuário atual
      );
      setMessages(receivedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  }, [loadMessages]);

  const handleMessagePress = (messageId: string) => {
    navigation.navigate('MessageDetails', { messageId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageCard
            message={item}
            onPress={() => handleMessagePress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('SendMessage')}
        label="Nova Mensagem"
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
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default MainScreen; 