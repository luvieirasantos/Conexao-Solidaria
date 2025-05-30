import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  // Cores principais
  primary: '#FF4B4B', // Vermelho de emergência
  secondary: '#4A90E2', // Azul para elementos secundários
  accent: '#FFD700', // Dourado para elementos de destaque
  
  // Cores de fundo
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  
  // Cores de texto
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    disabled: '#999999',
    inverse: '#FFFFFF',
  },
  
  // Cores de status
  status: {
    online: '#34C759',
    offline: '#FF3B30',
    connecting: '#FF9500',
  },
  white: '#FFFFFF',
  notification: '#FFD700',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const layout = {
  screenWidth: width,
  screenHeight: height,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 4,
    },
  },
};

export const animation = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
}; 