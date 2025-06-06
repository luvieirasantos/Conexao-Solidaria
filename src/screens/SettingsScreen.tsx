import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Surface,
  List,
  Switch,
  Button,
  Dialog,
  Portal,
  TextInput,
  useTheme,
  IconButton,
  Divider,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { storage } from '../services/storage';
import axios from 'axios';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [batterySaver, setBatterySaver] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await storage.getSettings();
      if (settings) {
        setNotificationsEnabled(settings.notificationsEnabled ?? true);
        setAutoConnect(settings.autoConnect ?? true);
        setBatterySaver(settings.batterySaver ?? false);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await storage.saveSettings({
        notificationsEnabled,
        autoConnect,
        batterySaver,
      });
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    }
  };

  const handleClearData = async () => {
    console.log('Attempting to clear all data...');
    setShowClearDialog(false);
    try {
      const storedUser = await storage.getUser();
      console.log('User retrieved from local storage:', storedUser);

      if (storedUser && storedUser.id) {
        try {
          console.log('Attempting to delete profile from API:', storedUser.id);
          await axios.delete(`https://api-deploy-1-0xst.onrender.com/api/perfis/${storedUser.id}`);
          console.log('Profile deleted from API successfully.');
        } catch (apiError) {
          console.error('Erro ao deletar perfil da API:', apiError);
          Alert.alert('Aviso', 'Não foi possível deletar o perfil do servidor. Dados locais serão apagados.');
        }
      }

      await storage.clearAll();
      console.log('Local data cleared successfully.');

      setNotificationsEnabled(true);
      setAutoConnect(true);
      setBatterySaver(false);

      Alert.alert('Sucesso', 'Todos os dados (locais e do servidor, se aplicável) foram apagados.');
    } catch (error) {
      console.error('Erro geral ao apagar dados:', error);
      Alert.alert('Erro', 'Não foi possível apagar os dados.');
    }
  };

  const handleSimulateAlert = async () => {
    try {
      const alertMessage = {
        id: Date.now().toString(),
        title: 'ALERTA DA DEFESA CIVIL',
        content: 'CUIDADO! EVENTOS EXTREMOS NA SUA REGIÃO',
        priority: 'alta' as const,
        location: 'Sua região',
        sender: 'Defesa Civil',
        receiver: 'broadcast',
        timestamp: new Date().toISOString(),
        status: 'pending' as const,
      };

      await storage.saveMessage(alertMessage);
      Alert.alert('Sucesso', 'Alerta simulado enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao simular alerta:', error);
      Alert.alert('Erro', 'Não foi possível simular o alerta.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configurações</Text>

        <Surface style={styles.sectionContainer}>
          <List.Section>
            <List.Subheader style={styles.sectionTitle}>Perfil</List.Subheader>
            <List.Item
              title="Gerenciar Perfil"
              description="Edite seu nome, tipo sanguíneo, alergias, etc."
              left={(props) => <List.Icon {...props} icon="account" />}
              onPress={() => navigation.navigate('Perfil')}
              style={{ paddingHorizontal: spacing.lg }}
            />
          </List.Section>
        </Surface>

        <Surface style={styles.sectionContainer}>
          <List.Section>
            <List.Subheader style={styles.sectionTitle}>Notificações</List.Subheader>
            <List.Item
              title="Notificações"
              description="Receber notificações de novas mensagens"
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={colors.primary}
                />
              )}
            />
          </List.Section>
        </Surface>

        <Surface style={styles.sectionContainer}>
          <List.Section>
            <List.Subheader style={styles.sectionTitle}>Conexão</List.Subheader>
            <List.Item
              title="Conexão automática"
              description="Conectar automaticamente quando disponível"
              right={() => (
                <Switch
                  value={autoConnect}
                  onValueChange={setAutoConnect}
                  color={colors.primary}
                />
              )}
            />
            <List.Item
              title="Modo economia de bateria"
              description="Reduzir o uso de bateria"
              right={() => (
                <Switch
                  value={batterySaver}
                  onValueChange={setBatterySaver}
                  color={colors.primary}
                />
              )}
            />
          </List.Section>
        </Surface>

        <Surface style={styles.sectionContainer}>
          <List.Section>
            <List.Subheader style={styles.sectionTitle}>Simulação</List.Subheader>
            <Button
              mode="contained"
              onPress={handleSimulateAlert}
              style={[styles.button, styles.simulateButton]}
              labelStyle={styles.buttonLabel}
            >
              Simular alerta da defesa civil
            </Button>
          </List.Section>
        </Surface>

        <Surface style={styles.sectionContainer}>
          <List.Section>
            <List.Subheader style={styles.sectionTitle}>Dados</List.Subheader>
            <Button
              mode="contained"
              onPress={() => {
                console.log('Botão Apagar todos os dados pressionado');
                handleClearData();
              }}
              style={[styles.button, styles.clearButton]}
              labelStyle={styles.buttonLabel}
            >
              Apagar todos os dados
            </Button>
          </List.Section>
        </Surface>

        <Button
          mode="contained"
          onPress={handleSaveSettings}
          style={[styles.button, styles.saveButton]}
          labelStyle={styles.buttonLabel}
        >
          Salvar Configurações
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={showClearDialog}
          onDismiss={() => setShowClearDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Atenção</Dialog.Title>
          <Dialog.Content>
            <Text>
              Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDialog(false)}>Cancelar</Button>
            <Button onPress={handleClearData} textColor={colors.error}>
              Apagar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  sectionContainer: {
    marginBottom: spacing.md,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.surface,
    ...layout.shadow.small,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  input: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  button: {
    height: layout.button.height,
    borderRadius: layout.borderRadius.lg,
    marginBottom: spacing.md,
    marginHorizontal: spacing.lg,
  },
  buttonLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
  },
  saveButton: {
    backgroundColor: colors.primary,
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
  },
  clearButton: {
    backgroundColor: colors.error,
  },
  simulateButton: {
    backgroundColor: colors.warning,
  },
  dialog: {
    backgroundColor: colors.surface,
  },
});

export default SettingsScreen; 