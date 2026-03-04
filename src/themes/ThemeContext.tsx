/**
 * ThemeContext - Theme provider for modal styling
 */

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import type { ModalTheme, ThemeContextValue, ThemeProviderProps } from '../types';
import { defaultTheme } from './defaultTheme';
import { darkTheme } from './darkTheme';

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Deep merge two theme objects
 */
function mergeThemes(base: ModalTheme, override: Partial<ModalTheme>): ModalTheme {
  // Use spread to create a new object, then override with merged values
  const result = { ...base } as Record<string, unknown>;

  for (const key of Object.keys(override)) {
    const overrideValue = override[key as keyof ModalTheme];
    const baseValue = base[key as keyof ModalTheme];
    if (overrideValue && typeof overrideValue === 'object' && !Array.isArray(overrideValue)) {
      result[key] = {
        ...(baseValue as object),
        ...(overrideValue as object),
      };
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue;
    }
  }

  return result as ModalTheme;
}

/**
 * ThemeProvider - Provides theme context for modal styling
 *
 * Usage:
 * ```tsx
 * <ThemeProvider theme={customTheme} darkMode={isDark}>
 *   <ModalProvider>
 *     <App />
 *     <ModalRoot />
 *   </ModalProvider>
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  theme: customTheme,
  darkMode = false,
  darkTheme: customDarkTheme,
}: ThemeProviderProps): JSX.Element {
  const [isDark, setIsDark] = useState(darkMode);
  const [themeOverride, setThemeOverride] = useState<ModalTheme | undefined>(customTheme);

  // Compute the current theme
  const theme = useMemo(() => {
    const baseTheme = isDark
      ? (customDarkTheme ?? darkTheme)
      : defaultTheme;

    if (themeOverride) {
      return mergeThemes(baseTheme, themeOverride);
    }

    return baseTheme;
  }, [isDark, themeOverride, customDarkTheme]);

  // Set a new theme
  const setTheme = useCallback((newTheme: ModalTheme) => {
    setThemeOverride(newTheme);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      isDark,
      setTheme,
      toggleDarkMode,
    }),
    [theme, isDark, setTheme, toggleDarkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    // Return default theme if not within provider
    return {
      theme: defaultTheme,
      isDark: false,
      setTheme: () => {
        console.warn('[useTheme] Not within a ThemeProvider');
      },
      toggleDarkMode: () => {
        console.warn('[useTheme] Not within a ThemeProvider');
      },
    };
  }

  return context;
}

/**
 * Hook to get just the theme object
 */
export function useModalTheme(): ModalTheme {
  const { theme } = useTheme();
  return theme;
}

ThemeProvider.displayName = 'ThemeProvider';
