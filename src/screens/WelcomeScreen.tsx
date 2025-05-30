import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, layout } from '../styles/theme';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Conexão Solidária</Text>
        <Text style={styles.subtitle}>
          Conectando pessoas em momentos de necessidade
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SentMessages')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Começar
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Settings')}
          style={[styles.button, styles.settingsButton]}
          labelStyle={styles.buttonLabel}
        >
          Configurações
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: layout.screen.width * 0.6,
    height: layout.screen.width * 0.6,
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxl,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  button: {
    height: layout.button.height,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.primary,
  },
  settingsButton: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  buttonLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
  },
}); 