/**
 * Dark theme for modals
 */

import type { ModalTheme } from '../types';

export const darkTheme: ModalTheme = {
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#1C1C1E',
    surface: '#2C2C2E',
    text: '#FFFFFF',
    textOnPrimary: '#FFFFFF',
    border: '#38383A',
    error: '#FF453A',
    success: '#30D158',
  },
  backdrop: {
    color: '#000000',
    opacity: 0.7,
  },
  content: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 20,
    shadow: {
      color: '#000000',
      offset: { width: 0, height: 4 },
      opacity: 0.3,
      radius: 16,
      elevation: 12,
    },
    maxWidth: 400,
    maxHeight: '80%',
  },
  animation: {
    preset: 'fade',
    duration: 300,
    config: {
      easing: 'easeOut',
    },
  },
  typography: {
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      color: '#EBEBF5',
      lineHeight: 22,
    },
    button: {
      fontSize: 17,
      fontWeight: '600',
    },
  },
};
