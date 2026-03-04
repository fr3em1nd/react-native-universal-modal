/**
 * useFocusRestoration - Hook to restore focus when modal closes
 */

import { useRef, useEffect, useCallback, type ComponentClass, type Component } from 'react';
import { findNodeHandle, AccessibilityInfo } from 'react-native';
import type { UseFocusRestorationOptions } from '../types';
import { isWeb } from '../utils';

type FindNodeHandleArg = ComponentClass<unknown, unknown> | Component<unknown, unknown, unknown> | number | null;

/**
 * Hook to save and restore focus when a modal opens/closes
 *
 * On web: Saves document.activeElement and restores it on close
 * On native: Uses AccessibilityInfo.setAccessibilityFocus
 *
 * @param options.isOpen - Whether the modal is currently open
 * @param options.enabled - Whether focus restoration is enabled (default: true)
 * @param options.returnFocusRef - Optional ref to element to focus on close
 */
export function useFocusRestoration(options: UseFocusRestorationOptions): {
  restoreFocus: () => void;
} {
  const { isOpen, enabled = true, returnFocusRef } = options;
  const previousFocusRef = useRef<HTMLElement | number | null>(null);

  // Store the currently focused element when modal opens
  useEffect(() => {
    if (!enabled) return;

    if (isOpen) {
      if (isWeb) {
        // Web: Store the active element
        previousFocusRef.current = document.activeElement as HTMLElement;
      } else {
        // Native: We can't easily capture the currently focused element
        // but we can store a node handle if returnFocusRef is provided
        if (returnFocusRef?.current) {
          previousFocusRef.current = findNodeHandle(returnFocusRef.current as FindNodeHandleArg);
        }
      }
    }
  }, [isOpen, enabled, returnFocusRef]);

  // Restore focus function
  const restoreFocus = useCallback(() => {
    if (!enabled) return;

    if (isWeb) {
      // Web: Focus the stored element or returnFocusRef
      const elementToFocus =
        (returnFocusRef?.current as unknown as HTMLElement) ??
        (previousFocusRef.current as HTMLElement);

      if (elementToFocus && typeof elementToFocus.focus === 'function') {
        elementToFocus.focus();
      }
    } else {
      // Native: Use AccessibilityInfo to set focus
      const nodeHandle =
        (returnFocusRef?.current ? findNodeHandle(returnFocusRef.current as FindNodeHandleArg) : null) ??
        (typeof previousFocusRef.current === 'number' ? previousFocusRef.current : null);

      if (nodeHandle) {
        AccessibilityInfo.setAccessibilityFocus(nodeHandle);
      }
    }
  }, [enabled, returnFocusRef]);

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      restoreFocus();
      previousFocusRef.current = null;
    }
  }, [isOpen, restoreFocus]);

  return { restoreFocus };
}
