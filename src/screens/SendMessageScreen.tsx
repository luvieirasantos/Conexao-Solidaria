import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../styles/theme';
import { storage } from '../services/storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SendMessage'>;
};

const SendMessageScreen: React.FC<Props> = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!content.trim()) {
      setError('Por favor, digite uma mensagem');
      return;
    }

    setSending(true);
    try {
      const allMessages = await storage.getMessages();
      const newMessage = {
        id: Date.now().toString(),
        content: content.trim(),
        sender: 'current_user', // TODO: Substituir pelo ID do usuário atual
        receiver: 'broadcast', // Por enquanto, envia para broadcast
        timestamp: Date.now(),
        status: 'pending',
      };

      await storage.saveMessages([...allMessages, newMessage]);
      navigation.goBack();
    } catch (error) {
      setError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextInput
          label="Digite sua mensagem"
          value={content}
          onChangeText={(text) => {
            setContent(text);
            setError('');
          }}
          multiline
          numberOfLines={6}
          style={styles.input}
          mode="outlined"
          error={!!error}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleSend}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          loading={sending}
          disabled={sending}
        >
          Enviar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  button: {
    padding: spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.md,
  },
});

export default SendMessageScreen; 