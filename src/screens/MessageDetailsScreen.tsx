import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Message } from '../types';
import { colors, spacing, typography, layout } from '../styles/theme';

type MessageDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MessageDetails'>;
type MessageDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MessageDetails'>;

export default function MessageDetailsScreen() {
  const navigation = useNavigation<MessageDetailsScreenNavigationProp>();
  const route = useRoute<MessageDetailsScreenRouteProp>();
  const { message } = route.params;

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'alta':
        return colors.error;
      case 'média':
        return colors.warning;
      case 'baixa':
        return colors.success;
      default:
        return colors.text.secondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{message.title}</Text>
          <IconButton
            icon="close"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Prioridade:</Text>
            <Text
              style={[
                styles.value,
                { color: getPriorityColor(message.priority) },
              ]}
            >
              {message.priority.toUpperCase()}
            </Text>
          </View>

          {message.location && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Localização:</Text>
              <Text style={styles.value}>{message.location}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Remetente:</Text>
            <Text style={styles.value}>{message.sender}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>{formatDate(message.timestamp)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Status:</Text>
            <Text
              style={[
                styles.value,
                { color: colors.status[message.status] },
              ]}
            >
              {message.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message.content}</Text>
        </View>
      </Surface>
    </ScrollView>
  );
}

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
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
  },
  closeButton: {
    margin: 0,
  },
  infoContainer: {
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    width: 100,
  },
  value: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  messageContainer: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.md,
  },
  messageText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.lg,
  },
}); 