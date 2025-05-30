import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton, useTheme } from 'react-native-paper';
import { colors, spacing, typography, layout } from '../styles/theme';
import { Message } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  message: Message;
  onPress?: () => void;
};

const MessageCard: React.FC<Props> = ({ message, onPress }) => {
  const theme = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return [colors.error, '#E57373'];
      case 'média':
        return [colors.warning, '#FFE082'];
      case 'baixa':
        return [colors.success, '#81C784'];
      default:
        return [colors.text.secondary, '#BDBDBD'];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const [gradientStart, gradientEnd] = getPriorityColor(message.priority);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Surface style={styles.container}>
        <LinearGradient
          colors={[gradientStart, gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.priorityIndicator}
        />
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View style={styles.titleWrapper}>
              <Text style={styles.title} numberOfLines={1}>
                {message.title}
              </Text>
              <Text style={styles.sender} numberOfLines={1}>
                De: {message.sender}
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              size={24}
              iconColor={colors.text.secondary}
            />
          </View>

          <Text style={styles.content} numberOfLines={2}>
            {message.content}
          </Text>

          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <View style={[styles.priorityBadge, { backgroundColor: gradientStart }]}>
                <Text style={styles.priorityText}>
                  {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                </Text>
              </View>
              {message.location && (
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
              )}
            </View>
            <Text style={styles.timestamp}>
              {formatDate(message.timestamp)}
            </Text>
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    borderRadius: layout.borderRadius.xl,
    backgroundColor: colors.surface,
    ...layout.shadow.medium,
    overflow: 'hidden',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sender: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  content: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    marginBottom: spacing.md,
    lineHeight: typography.lineHeight.md,
    textAlign: 'justify',
    flexWrap: 'wrap',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.md,
    marginRight: spacing.sm,
  },
  priorityText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    margin: 0,
    marginRight: -spacing.xs,
  },
  location: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    flex: 1,
  },
  timestamp: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
});

export default MessageCard; 