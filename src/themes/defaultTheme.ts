/**
 * Default light theme for modals
 */

import type { ModalTheme } from '../types';

export const defaultTheme: ModalTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textOnPrimary: '#FFFFFF',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
  },
  backdrop: {
    color: '#000000',
    opacity: 0.5,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadow: {
      color: '#000000',
      offset: { width: 0, height: 4 },
      opacity: 0.15,
      radius: 12,
      elevation: 8,
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
      color: '#000000',
      marginBottom: 8,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      color: '#3C3C43',
      lineHeight: 22,
    },
    button: {
      fontSize: 17,
      fontWeight: '600',
    },
  },
};
