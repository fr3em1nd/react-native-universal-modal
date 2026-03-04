/**
 * AccessibilityAnnouncer - Native implementation
 * Uses AccessibilityInfo to announce messages to screen readers
 */

import { useCallback, useEffect, useRef } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import type { AnnouncementPriority } from '../../types';

// Global announce function reference
let globalAnnounce: ((message: string, priority?: AnnouncementPriority) => void) | null = null;

/**
 * Hook to announce messages to screen readers
 */
export function useAnnouncer() {
  const announce = useCallback(
    (message: string, priority: AnnouncementPriority = 'polite') => {
      // Use the global announce function if available
      if (globalAnnounce) {
        globalAnnounce(message, priority);
        return;
      }

      // Fallback: directly call AccessibilityInfo
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        AccessibilityInfo.announceForAccessibility(message);
      }
    },
    []
  );

  const clear = useCallback(() => {
    // Not implemented for native - announcements can't be cancelled
  }, []);

  return { announce, clear };
}

/**
 * AccessibilityAnnouncer component for native platforms
 * No visual component needed - uses AccessibilityInfo directly
 */
export function AccessibilityAnnouncer(): null {
  const announcementQueue = useRef<string[]>([]);
  const isProcessing = useRef(false);

  useEffect(() => {
    // Process announcement queue
    const processQueue = () => {
      if (isProcessing.current || announcementQueue.current.length === 0) {
        return;
      }

      isProcessing.current = true;
      const message = announcementQueue.current.shift();

      if (message) {
        AccessibilityInfo.announceForAccessibility(message);
      }

      // Allow time for the announcement before processing next
      setTimeout(() => {
        isProcessing.current = false;
        processQueue();
      }, 500);
    };

    globalAnnounce = (message: string, _priority?: AnnouncementPriority) => {
      announcementQueue.current.push(message);
      processQueue();
    };

    return () => {
      globalAnnounce = null;
      announcementQueue.current = [];
    };
  }, []);

  // No visual component needed
  return null;
}

AccessibilityAnnouncer.displayName = 'AccessibilityAnnouncer';
