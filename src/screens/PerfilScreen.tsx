import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { TextInput, Button, Surface, Text, Divider, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography, layout } from '../styles/theme';
import { storage } from '../services/storage';
import { User } from '../types'; // Precisamos definir este tipo expandido
import * as ImagePicker from 'expo-image-picker'; // Importar ImagePicker
import axios from 'axios';

type PerfilScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Perfil'>;

const PerfilScreen: React.FC = () => {
  const navigation = useNavigation<PerfilScreenNavigationProp>();
  const [user, setUser] = useState<User>({
    nickname: '',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    continuousMedication: '',
    observations: '',
    avatarUri: undefined, // Opcional
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedUser = await storage.getUser();
      setLoading(true);

      if (storedUser && storedUser.id) {
        // Try fetching from API if user has an ID in local storage
        try {
          const response = await axios.get(`https://api-deploy-1-0xst.onrender.com/api/perfis/${storedUser.id}`);
          // Map avatarUrl from API to avatarUri for local state
          const apiUser = { ...response.data, avatarUri: response.data.avatarUrl };
          setUser(apiUser);
          console.log('Perfil carregado da API:', apiUser);
        } catch (apiError) {
          console.error('Erro ao carregar perfil da API:', apiError);
          // Fallback to local storage if API fetch fails
          setUser(storedUser);
          console.log('Perfil carregado do Local Storage (API erro):', storedUser);
        }
      } else if (storedUser) {
         // If no ID but user data exists in local storage, use it
         setUser(storedUser);
         console.log('Perfil carregado do Local Storage (sem ID):', storedUser);
      }
      else {
        // If no user data in local storage, initialize with default nickname
        setUser({ 
          nickname: 'Usuário',
          bloodType: '',
          allergies: '',
          medicalConditions: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          continuousMedication: '',
          observations: '',
          avatarUri: undefined,
         });
         console.log('Perfil inicializado com dados padrão:');
      }
    } catch (error) {
      console.error('Erro geral ao carregar perfil:', error);
      // In case of any other error, initialize with default nickname
      setUser({ 
        nickname: 'Usuário',
        bloodType: '',
        allergies: '',
        medicalConditions: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        continuousMedication: '',
        observations: '',
        avatarUri: undefined,
       });
       console.log('Perfil inicializado com dados padrão (erro geral):');
    } finally {
      setLoading(false);
    }
  };

  const saveProfileToAPI = async (profileData: User) => {
    try {
      let response;
      const apiPayload = {
        nickname: profileData.nickname,
        bloodType: profileData.bloodType || null, // API expects null for empty string
        allergies: profileData.allergies || null,
        medicalConditions: profileData.medicalConditions || null,
        continuousMedication: profileData.continuousMedication || null,
        observations: profileData.observations || null,
        avatarUrl: profileData.avatarUri || null, // API expects null for empty string/undefined
        emergencyContactName: profileData.emergencyContactName || null,
        emergencyContactPhone: profileData.emergencyContactPhone || null
      };

      if (profileData.id) {
        // Update existing profile (PUT)
        console.log('Atualizando perfil na API (PUT):', profileData.id, apiPayload);
        response = await axios.put(`https://api-deploy-1-0xst.onrender.com/api/perfis/${profileData.id}`, apiPayload);
      } else {
        // Create new profile (POST)
        console.log('Criando novo perfil na API (POST):', apiPayload);
        response = await axios.post('https://api-deploy-1-0xst.onrender.com/api/perfis', apiPayload);
      }

      console.log('Resposta da API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar perfil na API:', error);
      throw error;
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // First, attempt to save/update in the API
      const apiResponse = await saveProfileToAPI(user);

      // Update local state and storage with data from API (including generated ID if POST)
      const updatedUser = { ...apiResponse, avatarUri: apiResponse.avatarUrl };
      setUser(updatedUser);
      await storage.saveUser(updatedUser);

      Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      // If API save fails, still attempt to save locally if the error is not critical
      // (e.g., network error, but not data validation errors that might come from API)
      // For now, we'll show an error and rely on local storage for the next load attempt
      Alert.alert('Erro', 'Não foi possível salvar o perfil no servidor. Dados salvos localmente.');
      // Re-save locally just in case the API call somehow corrupted the local state/storage logic before the catch block
       try {
            await storage.saveUser(user);
       } catch (localSaveError) {
            console.error('Erro ao salvar perfil localmente após falha da API:', localSaveError);
       }
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    // Pedir permissão para acessar a galeria de imagens
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Desculpe, precisamos de permissão para acessar a galeria de imagens para que isso funcione!');
      return;
    }

    // Abrir a galeria de imagens
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Reduzir a qualidade para economizar espaço
    });

    if (!result.canceled) {
      // Salvar a URI da imagem no estado do usuário
      setUser({ ...user, avatarUri: result.assets[0].uri });
    } else {
      // Usuário cancelou a seleção
      console.log('Seleção de imagem cancelada.');
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.content}>
        <Text style={styles.title}>Meu Perfil</Text>

        {/* Foto/Avatar Opcional */}
        <View style={styles.avatarContainer}>
          {user.avatarUri ? (
            <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>+</Text>
            </View>
          )}
          <Button onPress={handlePickImage}>Escolher Foto</Button>
        </View>

        {/* Nome / Apelido */}
        <TextInput
          label="Nome / Apelido"
          value={user.nickname}
          onChangeText={(text) => setUser({ ...user, nickname: text })}
          style={styles.input}
          mode="outlined"
        />

        <Divider style={styles.divider} />

        {/* Tipo Sanguíneo */}
        <Text style={styles.label}>Tipo Sanguíneo:</Text>
        <View style={styles.chipsContainer}>
          {bloodTypes.map((type) => (
            <Chip
              key={type}
              selected={user.bloodType === type}
              onPress={() => setUser({ ...user, bloodType: type })}
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {type}
            </Chip>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Alergias */}
        <TextInput
          label="Alergias"
          value={user.allergies}
          onChangeText={(text) => setUser({ ...user, allergies: text })}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />

        {/* Condições médicas */}
        <TextInput
          label="Condições médicas"
          value={user.medicalConditions}
          onChangeText={(text) => setUser({ ...user, medicalConditions: text })}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />

        {/* Medicação contínua */}
        <TextInput
          label="Medicação contínua"
          value={user.continuousMedication}
          onChangeText={(text) => setUser({ ...user, continuousMedication: text })}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />

        <Divider style={styles.divider} />

        {/* Contato de emergência */}
        <Text style={styles.label}>Contato de Emergência:</Text>
        <TextInput
          label="Nome"
          value={user.emergencyContactName}
          onChangeText={(text) => setUser({ ...user, emergencyContactName: text })}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Telefone"
          value={user.emergencyContactPhone}
          onChangeText={(text) => setUser({ ...user, emergencyContactPhone: text })}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
        />

        <Divider style={styles.divider} />

        {/* Observações */}
        <TextInput
          label="Observações"
          value={user.observations}
          onChangeText={(text) => setUser({ ...user, observations: text })}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
        />

        <Button
          mode="contained"
          onPress={handleSaveProfile}
          style={styles.saveButton}
          labelStyle={styles.buttonLabel}
        >
          Salvar Perfil
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: typography.fontSize.xxxl,
    color: colors.text.secondary,
  },
  avatar: { // Estilo para a imagem selecionada
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.sm,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  chipText: {
    fontSize: typography.fontSize.sm,
  },
  divider: {
    marginVertical: spacing.md,
  },
  saveButton: {
    height: layout.button.height,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.primary,
    marginTop: spacing.lg,
  },
  buttonLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
  },
});

export default PerfilScreen; 