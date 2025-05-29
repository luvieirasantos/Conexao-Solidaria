import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../styles/theme';
import { storage } from '../services/storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleEnter = async () => {
    if (!nickname.trim()) {
      setError('Por favor, insira um nome ou apelido');
      return;
    }

    try {
      await storage.saveUser({
        id: Date.now().toString(),
        nickname: nickname.trim(),
        lastSeen: Date.now(),
      });
      navigation.replace('Main');
    } catch (error) {
      setError('Erro ao salvar dados. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Conexão Solidária</Text>
        <Text style={styles.subtitle}>
          Comunicação offline para comunidades em situação de emergência
        </Text>

        <TextInput
          label="Seu nome ou apelido"
          value={nickname}
          onChangeText={(text) => {
            setNickname(text);
            setError('');
          }}
          style={styles.input}
          mode="outlined"
          error={!!error}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleEnter}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Entrar
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
    padding: spacing.xl,
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  button: {
    marginTop: spacing.md,
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

export default WelcomeScreen; 