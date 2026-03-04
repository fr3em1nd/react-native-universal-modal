/**
 * useEscapeKey - Web-only hook for handling Escape key presses
 */

import { useEffect, useCallback } from 'react';
import type { UseEscapeKeyOptions } from '../../types';
import { isWeb } from '../../utils';

/**
 * Hook to handle Escape key presses (web only)
 *
 * @param options.enabled - Whether the handler is active
 * @param options.onEscape - Callback when Escape is pressed
 */
export function useEscapeKey({ enabled = true, onEscape }: UseEscapeKeyOptions): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && enabled) {
        event.preventDefault();
        event.stopPropagation();
        onEscape();
      }
    },
    [enabled, onEscape]
  );

  useEffect(() => {
    // Only attach on web platform
    if (!isWeb || !enabled) return;

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}
