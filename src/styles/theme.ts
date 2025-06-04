import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const colors = {
  // Cores principais
  primary: '#1D3557', // Azul Petróleo
  secondary: '#2E2E2E', // Cinza Escuro
  accent: '#FFD700', // Dourado para elementos de destaque
  
  // Cores de fundo
  background: '#F1F1F1', // Cinza Claro
  surface: '#FFFFFF', // Branco
  error: '#D94C4C', // Vermelho Calmo
  success: '#2BAF66', // Verde Esperança
  warning: '#F6C833', // Amarelo Quente
  
  // Cores de texto
  text: {
    primary: '#2E2E2E',
    secondary: '#666666',
    disabled: '#999999',
    inverse: '#FFFFFF',
  },
  
  // Cores de status
  status: {
    pending: '#FFA000',
    sent: '#4CAF50',
    received: '#2196F3',
    delivered: '#4CAF50',
    error: '#B00020',
    new: '#1D3557',
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
    regular: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'Poppins-Medium',
      android: 'Poppins-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'Poppins-Bold',
      android: 'Poppins-Bold',
      default: 'System',
    }),
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 28,
    xxxl: 36,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
};

export const layout = {
  screen: {
    width: screenWidth,
    height: screenHeight,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  button: {
    height: 48,
  },
  input: {
    height: 48,
  },
  padding: {
    screen: spacing.md,
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

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android'; 