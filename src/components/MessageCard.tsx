import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { Message, MessageStatus } from '../types';
import { colors, spacing, typography } from '../styles/theme';

interface Props {
  message: Message;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const getStatusColor = (status: MessageStatus) => {
  switch (status) {
    case 'new':
      return colors.primary;
    case 'read':
      return colors.success;
    case 'pending':
      return colors.pending;
    case 'delivered':
      return colors.success;
    case 'synced':
      return colors.success;
    default:
      return colors.text;
  }
};

const getStatusText = (status: MessageStatus) => {
  switch (status) {
    case 'new':
      return 'Novo';
    case 'read':
      return 'Lido';
    case 'pending':
      return 'Pendente';
    case 'delivered':
      return 'Entregue';
    case 'synced':
      return 'Sincronizado';
    default:
      return status;
  }
};

const MessageCard: React.FC<Props> = ({
  message,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const statusColor = getStatusColor(message.status);
  const statusText = getStatusText(message.status);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.sender}>{message.sender}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.status, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>

        <Text style={styles.content} numberOfLines={2}>
          {message.content}
        </Text>

        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleString()}
        </Text>

        {showActions && (
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={onEdit}
              iconColor={colors.primary}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={onDelete}
              iconColor={colors.error}
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sender: {
    ...typography.subtitle,
    color: colors.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  status: {
    ...typography.caption,
  },
  content: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  timestamp: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
});

export default MessageCard; 