import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Share } from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  Button,
  Divider,
  useTheme,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Message } from '../types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { storage } from '../services/storage';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MessageDetails'>;
  route: RouteProp<RootStackParamList, 'MessageDetails'>;
};

const MessageDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    loadMessage();
  }, [route.params.messageId]);

  const loadMessage = async () => {
    try {
      const allMessages = await storage.getMessages();
      const foundMessage = allMessages.find(
        (msg) => msg.id === route.params.messageId
      );
      if (foundMessage) {
        setMessage(foundMessage);
        // Marcar como lida
        if (foundMessage.status === 'new') {
          const updatedMessage = { ...foundMessage, status: 'read' };
          await storage.updateMessage(updatedMessage);
          setMessage(updatedMessage);
        }
      }
    } catch (error) {
      console.error('Error loading message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!message) return;

    try {
      await Share.share({
        message: `${message.title}\n\n${message.content}\n\nPrioridade: ${message.priority}\n${
          message.location ? `Localização: ${message.location}\n` : ''
        }Enviado por: ${message.sender}\nData: ${new Date(
          message.timestamp
        ).toLocaleString()}`,
      });
    } catch (error) {
      console.error('Error sharing message:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return colors.error;
      case 'média':
        return colors.warning;
      case 'baixa':
        return colors.success;
      default:
        return colors.secondary;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return 'alert-circle';
      case 'média':
        return 'alert';
      case 'baixa':
        return 'information';
      default:
        return 'message';
    }
  };

  if (isLoading || !message) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando mensagem...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <IconButton
              icon={getPriorityIcon(message.priority)}
              size={24}
              iconColor={getPriorityColor(message.priority)}
              style={styles.priorityIcon}
            />
            <Text style={styles.title}>{message.title}</Text>
          </View>
          <IconButton
            icon="share-variant"
            size={24}
            onPress={handleShare}
            iconColor={colors.text.secondary}
          />
        </View>

        <Divider style={styles.divider} />

        <Text style={styles.content}>{message.content}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <IconButton
              icon="account"
              size={20}
              iconColor={colors.text.secondary}
              style={styles.detailIcon}
            />
            <Text style={styles.detailLabel}>Remetente:</Text>
            <Text style={styles.detailValue}>{message.sender}</Text>
          </View>

          {message.location && (
            <View style={styles.detailRow}>
              <IconButton
                icon="map-marker"
                size={20}
                iconColor={colors.text.secondary}
                style={styles.detailIcon}
              />
              <Text style={styles.detailLabel}>Localização:</Text>
              <Text style={styles.detailValue}>{message.location}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <IconButton
              icon="clock-outline"
              size={20}
              iconColor={colors.text.secondary}
              style={styles.detailIcon}
            />
            <Text style={styles.detailLabel}>Enviado:</Text>
            <Text style={styles.detailValue}>
              {formatDistanceToNow(new Date(message.timestamp), {
                addSuffix: true,
                locale: ptBR,
              })}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Voltar
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('SendMessage')}
            style={[styles.button, styles.replyButton]}
            labelStyle={styles.buttonLabel}
          >
            Responder
          </Button>
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
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIcon: {
    margin: 0,
    marginRight: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  divider: {
    marginVertical: spacing.md,
  },
  content: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  detailsContainer: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailIcon: {
    margin: 0,
    marginRight: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  detailValue: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  replyButton: {
    backgroundColor: colors.primary,
  },
  buttonLabel: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
  },
  loadingText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default MessageDetailsScreen; 