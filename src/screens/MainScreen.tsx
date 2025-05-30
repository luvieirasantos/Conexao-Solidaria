import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, StatusBar } from 'react-native';
import { FAB, Text, Surface, IconButton, useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Message } from '../types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { storage } from '../services/storage';
import MessageCard from '../components/MessageCard';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const loadMessages = useCallback(async () => {
    try {
      const allMessages = await storage.getMessages();
      const receivedMessages = allMessages.filter(
        (msg) => msg.receiver === 'current_user'
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

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <IconButton
        icon="message-off"
        size={64}
        iconColor={colors.text.secondary}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>Nenhuma mensagem</Text>
      <Text style={styles.emptySubtitle}>
        Quando você receber mensagens via Bluetooth, elas aparecerão aqui
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle="light-content"
      />
      
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mensagens</Text>
          <IconButton
            icon="bluetooth"
            size={24}
            iconColor={colors.text.inverse}
            onPress={() => navigation.navigate('ConnectionStatus')}
          />
        </View>
      </Surface>

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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyList}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('SendMessage')}
        label="Nova Mensagem"
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
  header: {
    backgroundColor: colors.primary,
    elevation: 4,
    ...layout.shadow.medium,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingTop: StatusBar.currentHeight + spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.inverse,
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
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