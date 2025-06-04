import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  IconButton,
  SegmentedButtons,
  HelperText,
  Chip,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { storage } from '../services/storage';
import { Message, User } from '../types';
import { useNavigation } from '@react-navigation/native';
import { bleService, BleService } from '../services/bleService';
import { Device } from 'react-native-ble-plx';

type SendMessageScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SendMessage'>;

const SendMessageScreen: React.FC = () => {
  const navigation = useNavigation<SendMessageScreenNavigationProp>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'baixa' | 'média' | 'alta'>('média');
  const [location, setLocation] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bleStatus, setBleStatus] = useState<'idle' | 'scanning' | 'sending'>('idle');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await storage.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Erro ao carregar usuário para envio de mensagem:', error);
    }
  };

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios (Título e Mensagem)');
      return;
    }

    if (!currentUser) {
      Alert.alert('Erro', 'Não foi possível carregar as informações do remetente. Tente novamente.');
      return;
    }

    setError('');

    try {
      setIsSending(true);
      setBleStatus('scanning');

      const message: Message = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        priority,
        location: location.trim() || undefined,
        sender: currentUser.nickname || 'Usuário',
        receiver: 'broadcast',
        timestamp: new Date().toISOString(),
        status: 'pending',
        senderProfile: {
          bloodType: currentUser.bloodType || '',
          allergies: currentUser.allergies || '',
          medicalConditions: currentUser.medicalConditions || '',
          emergencyContactName: currentUser.emergencyContactName || '',
          emergencyContactPhone: currentUser.emergencyContactPhone || '',
          continuousMedication: currentUser.continuousMedication || '',
          observations: currentUser.observations || '',
          avatarUri: currentUser.avatarUri || undefined,
        },
      };

      console.log('Criando mensagem:', message);
      await storage.saveMessage(message);
      console.log('Mensagem salva localmente.');

      console.log('Iniciando scan BLE para enviar mensagem...');
      bleService.startScan(
        (device: Device) => {
          console.log('Dispositivo BLE encontrado durante o scan:', device.name || device.id);
        },
        async () => {
          console.log('Scan BLE concluído.');
          setBleStatus('sending');
          await bleService.sendMessageToDevices(message);
          setBleStatus('idle');
          setTitle('');
          setContent('');
          setLocation('');
          setPriority('média');

          Alert.alert('Sucesso', 'Mensagem salva localmente e tentativa de envio BLE iniciada.');
          navigation.goBack();
        }
      );
    } catch (error) {
      console.error('Error handling message send via BLE:', error);
      setError('Ocorreu um erro ao tentar enviar a mensagem via BLE.');
    } finally {
      setIsSending(false);
    }
  };

  const priorityOptions = ['baixa', 'média', 'alta'];

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
              error={!!error && !title.trim()}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="Mensagem"
              value={content}
              onChangeText={setContent}
              style={[styles.input, styles.messageInput]}
              mode="outlined"
              multiline
              numberOfLines={6}
              maxLength={500}
              right={
                <TextInput.Icon
                  icon="message-text"
                  color={colors.text.secondary}
                />
              }
              error={!!error && !content.trim()}
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

          <View style={styles.priorityContainer}>
            <Text style={styles.priorityLabel}>Prioridade</Text>
            <View style={styles.priorityChips}>
              {priorityOptions.map((option) => (
                <Chip
                  key={option}
                  selected={priority === option}
                  onPress={() => setPriority(option as 'baixa' | 'média' | 'alta')}
                  selectedColor={colors.text.inverse}
                  style={[
                    styles.priorityChip,
                    {
                      backgroundColor: priority === option ? colors[option === 'alta' ? 'error' : option === 'média' ? 'warning' : 'success'] : colors.background,
                    }
                  ]}
                  textStyle={[
                    styles.chipText,
                    {
                      color: priority === option ? colors.text.inverse : colors.text.primary
                    }
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Chip>
              ))}
            </View>
          </View>

          {error ? (
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          ) : null}

          {bleStatus !== 'idle' && (
            <Text style={styles.bleStatusText}>
              {bleStatus === 'scanning' ? 'Escaneando dispositivos...' : 'Enviando mensagem via BLE...'}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.actionButton}
              labelStyle={styles.buttonLabel}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSend}
              style={[styles.actionButton, styles.sendButton]}
              labelStyle={styles.buttonLabel}
              loading={isSending || bleStatus !== 'idle'}
              disabled={isSending || bleStatus !== 'idle' || !currentUser}
            >
              {isSending || bleStatus !== 'idle' ? 'Enviando...' : 'Enviar Mensagem'}
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
    padding: layout.padding.screen,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: layout.padding.screen,
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
    height: layout.input.height,
  },
  messageInput: {
    height: layout.input.height * 2,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    marginBottom: spacing.lg,
  },
  priorityLabel: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  priorityChips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  priorityChip: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: layout.borderRadius.md,
    paddingVertical: spacing.sm,
  },
  chipText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    height: layout.button.height,
    borderRadius: layout.borderRadius.lg,
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
  buttonLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
    textAlign: 'center',
  },
  bleStatusText: {
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
});

export default SendMessageScreen; 