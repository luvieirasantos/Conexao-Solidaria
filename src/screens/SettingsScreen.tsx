import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Switch, List } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../styles/theme';
import { storage } from '../services/storage';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const [nickname, setNickname] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = await storage.getUser();
            if (user) {
                setNickname(user.nickname);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleSaveNickname = async () => {
        if (!nickname.trim()) {
            Alert.alert('Erro', 'O nome não pode estar vazio');
            return;
        }

        try {
            const user = await storage.getUser();
            if (user) {
                await storage.saveUser({
                    ...user,
                    nickname: nickname.trim(),
                });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving nickname:', error);
            Alert.alert('Erro', 'Não foi possível salvar o nome');
        }
    };

    const handleResetData = () => {
        Alert.alert(
            'Confirmar redefinição',
            'Tem certeza que deseja redefinir todos os dados? Esta ação não pode ser desfeita.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Redefinir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await storage.clearAll();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Welcome' }],
                            });
                        } catch (error) {
                            console.error('Error resetting data:', error);
                            Alert.alert('Erro', 'Não foi possível redefinir os dados');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <List.Section>
                <List.Subheader>Perfil</List.Subheader>
                <View style={styles.nicknameContainer}>
                    {isEditing ? (
                        <>
                            <TextInput
                                label="Seu nome ou apelido"
                                value={nickname}
                                onChangeText={setNickname}
                                style={styles.input}
                                mode="outlined"
                            />
                            <Button
                                mode="contained"
                                onPress={handleSaveNickname}
                                style={styles.saveButton}
                            >
                                Salvar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Text style={styles.nickname}>{nickname}</Text>
                            <Button
                                mode="text"
                                onPress={() => setIsEditing(true)}
                                style={styles.editButton}
                            >
                                Editar
                            </Button>
                        </>
                    )}
                </View>
            </List.Section>

            <List.Section>
                <List.Subheader>Aparência</List.Subheader>
                <List.Item
                    title="Modo escuro"
                    right={() => (
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            color={colors.primary}
                        />
                    )}
                />
            </List.Section>

            <List.Section>
                <List.Subheader>Dados</List.Subheader>
                <List.Item
                    title="Redefinir dados"
                    description="Limpa todas as mensagens e configurações"
                    onPress={handleResetData}
                    right={(props) => (
                        <List.Icon {...props} icon="delete" color={colors.error} />
                    )}
                />
            </List.Section>

            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Versão 1.0.0</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    nicknameContainer: {
        padding: spacing.md,
        backgroundColor: colors.white,
    },
    input: {
        marginBottom: spacing.md,
    },
    saveButton: {
        marginTop: spacing.sm,
    },
    nickname: {
        ...typography.subtitle,
        color: colors.text,
    },
    editButton: {
        marginTop: spacing.sm,
    },
    versionContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    versionText: {
        ...typography.caption,
        color: colors.text,
        opacity: 0.7,
    },
});

export default SettingsScreen; 