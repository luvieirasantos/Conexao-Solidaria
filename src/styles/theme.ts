import { DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: '#0F4C81', // Azul Petróleo
  success: '#C4E1C1', // Verde Claro
  white: '#FFFFFF',   // Branco
  background: '#F6F6F6', // Cinza Claro
  text: '#3A3A3A',    // Cinza Escuro
  error: '#FF6B6B',   // Vermelho para erros
  warning: '#FFD93D', // Amarelo para avisos
  pending: '#FFA500', // Laranja para pendente
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.white,
    text: colors.text,
    error: colors.error,
  },
  roundness: 12,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal',
  },
}; 