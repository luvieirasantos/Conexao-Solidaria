import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { theme } from '../styles/theme';

// Import screens (to be created)
import WelcomeScreen from '../screens/WelcomeScreen';
import MainScreen from '../screens/MainScreen';
import SendMessageScreen from '../screens/SendMessageScreen';
import SentMessagesScreen from '../screens/SentMessagesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ConnectionStatusScreen from '../screens/ConnectionStatusScreen';
import MessageDetailsScreen from '../screens/MessageDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: 'Mensagens Recebidas' }}
        />
        <Stack.Screen
          name="SendMessage"
          component={SendMessageScreen}
          options={{ title: 'Nova Mensagem' }}
        />
        <Stack.Screen
          name="SentMessages"
          component={SentMessagesScreen}
          options={{ title: 'Mensagens Enviadas' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Configurações' }}
        />
        <Stack.Screen
          name="ConnectionStatus"
          component={ConnectionStatusScreen}
          options={{ title: 'Status da Conexão' }}
        />
        <Stack.Screen
          name="MessageDetails"
          component={MessageDetailsScreen}
          options={{ title: 'Detalhes da Mensagem' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 