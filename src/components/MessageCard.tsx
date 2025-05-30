import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { Message } from '../types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Props = {
  message: Message;
  onPress: () => void;
};

const MessageCard: React.FC<Props> = ({ message, onPress }) => {
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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Surface style={[styles.container, { borderLeftColor: getPriorityColor(message.priority) }]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <IconButton
              icon={getPriorityIcon(message.priority)}
              size={20}
              iconColor={getPriorityColor(message.priority)}
              style={styles.priorityIcon}
            />
            <View style={styles.titleWrapper}>
              <Text style={styles.title} numberOfLines={1}>
                {message.title}
              </Text>
              <View style={styles.senderContainer}>
                <IconButton
                  icon="account"
                  size={16}
                  iconColor={colors.text.secondary}
                  style={styles.senderIcon}
                />
                <Text style={styles.sender} numberOfLines={1}>
                  {message.sender}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.timestamp}>
            {formatDistanceToNow(new Date(message.timestamp), {
              addSuffix: true,
              locale: ptBR,
            })}
          </Text>
        </View>

        <Text style={styles.content} numberOfLines={2}>
          {message.content}
        </Text>

        {message.location && (
          <View style={styles.footer}>
            <View style={styles.locationContainer}>
              <IconButton
                icon="map-marker"
                size={16}
                iconColor={colors.text.secondary}
                style={styles.locationIcon}
              />
              <Text style={styles.location} numberOfLines={1}>
                {message.location}
              </Text>
            </View>
          </View>
        )}
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    ...layout.shadow.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  priorityIcon: {
    margin: 0,
    marginRight: spacing.xs,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
  },
  timestamp: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  content: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  senderIcon: {
    margin: 0,
    marginRight: spacing.xs,
  },
  sender: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.regular,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.md,
  },
  locationIcon: {
    margin: 0,
    marginRight: spacing.xs,
  },
  location: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    flex: 1,
  },
});

export default MessageCard; 