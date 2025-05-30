import React from 'react';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { Navigation } from './src/navigation';
import { colors } from './src/styles/theme';

const paperTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...colors,
    background: colors.background,
    surface: colors.surface,
    primary: colors.primary,
    accent: colors.accent,
    error: colors.error,
    text: colors.text.primary,
    notification: colors.accent,
  },
};

const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text.primary,
    border: colors.secondary || NavigationDefaultTheme.colors.border,
    notification: colors.accent,
    primary: colors.primary,
  },
};

const App = () => {
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <Navigation />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App; 