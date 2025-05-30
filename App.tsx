import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { RootStackParamList } from './src/navigation/types';
import { colors } from './src/styles/theme';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import MainScreen from './src/screens/MainScreen';
import SendMessageScreen from './src/screens/SendMessageScreen';
import SentMessagesScreen from './src/screens/SentMessagesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ConnectionStatusScreen from './src/screens/ConnectionStatusScreen';
import MessageDetailsScreen from './src/screens/MessageDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-Bold': Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.text.inverse,
            headerTitleStyle: {
              fontFamily: 'Poppins-Medium',
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
            options={{ title: 'Mensagens' }}
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
    </PaperProvider>
  );
} 