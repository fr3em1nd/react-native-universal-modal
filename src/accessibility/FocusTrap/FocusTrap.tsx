/**
 * FocusTrap - Web implementation
 * Traps keyboard focus within the modal for accessibility
 */

import React, { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import type { FocusTrapConfig } from '../../types';
import { FOCUSABLE_SELECTORS } from '../../core/constants';
import { isWeb } from '../../utils';

export interface FocusTrapProps extends ViewProps {
  /** Whether the focus trap is active */
  active?: boolean;
  /** Focus trap configuration */
  config?: FocusTrapConfig;
  /** Children to render inside the focus trap */
  children: ReactNode;
}

/**
 * FocusTrap component for web
 * Traps Tab navigation within the modal content
 */
export function FocusTrap({
  active = true,
  config = {},
  children,
  ...viewProps
}: FocusTrapProps): JSX.Element {
  const containerRef = useRef<View>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const {
    initialFocus,
    returnFocusOnDeactivate = true,
    preventScroll = true,
    allowOutsideClick = false,
  } = config;

  /**
   * Get all focusable elements within the container
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!isWeb || !containerRef.current) return [];

    const container = containerRef.current as unknown as HTMLElement;
    const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);

    // Filter out hidden elements
    return Array.from(elements).filter(
      (el) => el.offsetParent !== null && !el.hasAttribute('disabled')
    );
  }, []);

  /**
   * Focus the first focusable element or custom initial focus
   */
  const focusFirstElement = useCallback(() => {
    if (!isWeb) return;

    const focusableElements = getFocusableElements();

    if (initialFocus === false) return;

    if (typeof initialFocus === 'string') {
      const container = containerRef.current as unknown as HTMLElement;
      const customInitial = container?.querySelector<HTMLElement>(initialFocus);
      if (customInitial) {
        customInitial.focus({ preventScroll });
        return;
      }
    }

    const firstElement = focusableElements[0];
    if (firstElement) {
      firstElement.focus({ preventScroll });
    }
  }, [getFocusableElements, initialFocus, preventScroll]);

  /**
   * Handle Tab key navigation to trap focus
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!active || event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0]!;
      const lastElement = focusableElements[focusableElements.length - 1]!;
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        // Shift + Tab: Move backwards
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Move forwards
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [active, getFocusableElements]
  );

  /**
   * Handle clicks outside the trap
   */
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!active || allowOutsideClick) return;

      const container = containerRef.current as unknown as HTMLElement;
      if (container && !container.contains(event.target as Node)) {
        event.preventDefault();
        event.stopPropagation();
        config.onEscapeAttempt?.();
      }
    },
    [active, allowOutsideClick, config]
  );

  // Activate focus trap
  useEffect(() => {
    if (!isWeb || !active) return;

    // Store currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus first element after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      focusFirstElement();
    }, 10);

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside, true);

      // Restore focus
      if (returnFocusOnDeactivate && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, focusFirstElement, handleKeyDown, handleClickOutside, returnFocusOnDeactivate]);

  return (
    <View ref={containerRef} {...viewProps}>
      {children}
    </View>
  );
}

FocusTrap.displayName = 'FocusTrap';
