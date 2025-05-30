import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {
  Text,
  Button,
  Surface,
  useTheme,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, layout } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>CS</Text>
            </View>
            <Text style={styles.title}>Conexão Solidária</Text>
            <Text style={styles.subtitle}>
              Comunicação offline em situações de emergência
            </Text>
          </View>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Surface style={styles.featureIcon}>
                <Text style={styles.featureIconText}>📡</Text>
              </Surface>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Comunicação Offline</Text>
                <Text style={styles.featureDescription}>
                  Troque mensagens via Bluetooth mesmo sem internet
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Surface style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🔋</Text>
              </Surface>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Economia de Bateria</Text>
                <Text style={styles.featureDescription}>
                  Otimizado para uso em situações de emergência
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Surface style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🔒</Text>
              </Surface>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Privacidade</Text>
                <Text style={styles.featureDescription}>
                  Suas mensagens são transmitidas apenas localmente
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('SentMessages')}
              style={[styles.button, styles.startButton]}
              labelStyle={styles.buttonLabel}
              icon="message-text"
            >
              Começar
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Settings')}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              icon="cog"
            >
              Configurações
            </Button>
          </View>

          <Text style={styles.version}>Versão 1.0.0</Text>
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.surface,
    ...layout.shadow.medium,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...layout.shadow.medium,
  },
  logoText: {
    fontSize: typography.fontSize.xxxl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.inverse,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  features: {
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...layout.shadow.small,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
  buttonLabel: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
  },
  startButton: {
    marginRight: spacing.md,
  },
  version: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default WelcomeScreen; 