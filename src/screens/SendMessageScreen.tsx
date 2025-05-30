import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  IconButton,
  SegmentedButtons,
  HelperText,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { storage } from '../services/storage';
import { Message } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SendMessage'>;
};

const SendMessageScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('média');
  const [location, setLocation] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const settings = await storage.getSettings();
      setSenderName(settings.nickname || 'Usuário');
    } catch (error) {
      console.error('Error loading user settings:', error);
      setSenderName('Usuário');
    }
  };

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsSending(true);
    setError('');

    try {
      const message: Message = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        priority,
        location: location.trim(),
        sender: senderName,
        receiver: 'broadcast',
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      console.log('Enviando mensagem:', message);
      await storage.saveMessage(message);
      console.log('Mensagem salva com sucesso');
      
      // Limpar os campos após enviar
      setTitle('');
      setContent('');
      setLocation('');
      setPriority('média');
      
      navigation.navigate('SentMessages');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={styles.formContainer}>
          <Text style={styles.title}>Nova Mensagem</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              label="Título"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
              maxLength={100}
              right={
                <TextInput.Icon
                  icon="format-title"
                  color={colors.text.secondary}
                />
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="Mensagem"
              value={content}
              onChangeText={setContent}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
              maxLength={500}
              right={
                <TextInput.Icon
                  icon="message-text"
                  color={colors.text.secondary}
                />
              }
            />
          </View>

          <View style={styles.priorityContainer}>
            <Text style={styles.priorityLabel}>Prioridade</Text>
            <SegmentedButtons
              value={priority}
              onValueChange={setPriority}
              buttons={[
                {
                  value: 'baixa',
                  label: 'Baixa',
                  icon: 'information',
                  style: { backgroundColor: priority === 'baixa' ? colors.success : undefined },
                },
                {
                  value: 'média',
                  label: 'Média',
                  icon: 'alert',
                  style: { backgroundColor: priority === 'média' ? colors.warning : undefined },
                },
                {
                  value: 'alta',
                  label: 'Alta',
                  icon: 'alert-circle',
                  style: { backgroundColor: priority === 'alta' ? colors.error : undefined },
                },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="Localização (opcional)"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              mode="outlined"
              maxLength={100}
              right={
                <TextInput.Icon
                  icon="map-marker"
                  color={colors.text.secondary}
                />
              }
            />
          </View>

          {error ? (
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          ) : null}

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSend}
              style={[styles.button, styles.sendButton]}
              labelStyle={styles.buttonLabel}
              loading={isSending}
              disabled={isSending}
            >
              Enviar
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
  },
  formContainer: {
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.surface,
    ...layout.shadow.medium,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
  },
  priorityContainer: {
    marginBottom: spacing.lg,
  },
  priorityLabel: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
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
  sendButton: {
    backgroundColor: colors.primary,
  },
  buttonLabel: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
  },
});

export default SendMessageScreen; 