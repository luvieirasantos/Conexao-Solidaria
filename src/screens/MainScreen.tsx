import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, StatusBar, Alert } from 'react-native';
import { FAB, Text, Surface, IconButton, useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Message } from '../types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { storage } from '../services/storage';
import MessageCard from '../components/MessageCard';
import { bleService } from '../services/bleService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isBleInitialized, setIsBleInitialized] = useState(false);
  const theme = useTheme();

  const loadMessages = useCallback(async () => {
    try {
      const allMessages = await storage.getMessages();
      const receivedMessages = allMessages.filter(
        (msg) => msg.receiver === 'broadcast'
      );
      setMessages(receivedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  const initializeBle = useCallback(async () => {
    try {
      const initialized = await bleService.initialize();
      if (initialized) {
        setIsBleInitialized(true);
        console.log('BLE inicializado com sucesso');
        
        // Iniciar recebimento de mensagens
        bleService.startReceivingMessages((message: Message) => {
          console.log('Nova mensagem recebida:', message);
          loadMessages(); // Recarregar mensagens quando uma nova for recebida
        });
      } else {
        Alert.alert(
          'Bluetooth Desligado',
          'Por favor, ligue o Bluetooth para receber mensagens.',
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
  }, [loadMessages]);

  useEffect(() => {
    loadMessages();
    initializeBle();

    // Cleanup function
    return () => {
      bleService.stopReceivingMessages();
    };
  }, [loadMessages, initializeBle]);

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
        {isBleInitialized 
          ? 'Quando você receber mensagens via Bluetooth, elas aparecerão aqui'
          : 'Ligue o Bluetooth para receber mensagens'}
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
            iconColor={isBleInitialized ? colors.success : colors.error}
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
    paddingTop: StatusBar.currentHeight,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.inverse,
  },
  listContent: {
    padding: spacing.md,
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
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.md,
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