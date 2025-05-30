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
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { storage } from '../services/storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [batterySaver, setBatterySaver] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (nickname) {
      console.log('Nickname atualizado:', nickname);
    }
  }, [nickname]);

  const loadSettings = async () => {
    try {
      const settings = await storage.getSettings();
      setNotificationsEnabled(settings.notificationsEnabled);
      setAutoConnect(settings.autoConnect);
      setBatterySaver(settings.batterySaver);
      setNickname(settings.nickname || '');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const settings = {
        notificationsEnabled,
        autoConnect,
        batterySaver,
        nickname,
      };
      console.log('Salvando configurações:', settings);
      await storage.saveSettings(settings);
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    }
  };

  const handleClearData = async () => {
    try {
      await storage.clearAllData();
      setShowClearDialog(false);
      Alert.alert('Sucesso', 'Todos os dados foram apagados.');
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Erro', 'Não foi possível apagar os dados.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.content}>
        <Text style={styles.title}>Configurações</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil</Text>
          <List.Item
            title="Seu Nome"
            description={nickname || 'Não definido'}
            left={(props) => (
              <List.Icon {...props} icon="account" color={colors.text.secondary} />
            )}
            onPress={() => setIsEditingNickname(true)}
            right={(props) => (
              <IconButton
                {...props}
                icon="pencil"
                size={20}
                onPress={() => setIsEditingNickname(true)}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <List.Item
            title="Notificações"
            description="Receber alertas de novas mensagens"
            left={(props) => (
              <List.Icon
                {...props}
                icon="bell"
                color={colors.text.secondary}
              />
            )}
            right={(props) => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={colors.primary}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conexão</Text>
          <List.Item
            title="Conexão Automática"
            description="Conectar automaticamente a dispositivos próximos"
            left={(props) => (
              <List.Icon
                {...props}
                icon="bluetooth-connect"
                color={colors.text.secondary}
              />
            )}
            right={(props) => (
              <Switch
                value={autoConnect}
                onValueChange={setAutoConnect}
                color={colors.primary}
              />
            )}
          />
          <List.Item
            title="Modo Economia"
            description="Reduz o uso de bateria (pode afetar a conectividade)"
            left={(props) => (
              <List.Icon
                {...props}
                icon="battery"
                color={colors.text.secondary}
              />
            )}
            right={(props) => (
              <Switch
                value={batterySaver}
                onValueChange={setBatterySaver}
                color={colors.primary}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>
          <List.Item
            title="Apagar Todos os Dados"
            description="Remove todas as mensagens e configurações"
            left={(props) => (
              <List.Icon
                {...props}
                icon="delete"
                color={colors.error}
              />
            )}
            onPress={() => setShowClearDialog(true)}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSaveSettings}
          style={styles.saveButton}
          labelStyle={styles.buttonLabel}
        >
          Salvar Configurações
        </Button>
      </Surface>

      <Portal>
        <Dialog
          visible={isEditingNickname}
          onDismiss={() => setIsEditingNickname(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Editar Nome</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Seu nome"
              value={nickname}
              onChangeText={setNickname}
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsEditingNickname(false)}>Cancelar</Button>
            <Button onPress={async () => {
              try {
                const settings = {
                  notificationsEnabled,
                  autoConnect,
                  batterySaver,
                  nickname,
                };
                await storage.saveSettings(settings);
                setIsEditingNickname(false);
                Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
              } catch (error) {
                console.error('Error saving nickname:', error);
                Alert.alert('Erro', 'Não foi possível salvar o nome.');
              }
            }}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={showClearDialog}
          onDismiss={() => setShowClearDialog(false)}
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  saveButton: {
    marginTop: spacing.md,
  },
  buttonLabel: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
  },
  dialog: {
    backgroundColor: colors.surface,
  },
  input: {
    backgroundColor: colors.surface,
  },
});

export default SettingsScreen; 