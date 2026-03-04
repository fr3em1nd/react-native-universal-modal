/**
 * AccessibilityAnnouncer - Web implementation
 * Uses ARIA live regions to announce messages to screen readers
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { AnnouncementMessage, AnnouncementPriority } from '../../types';
import { isWeb } from '../../utils';

// Global announce function reference
let globalAnnounce: ((message: string, priority?: AnnouncementPriority) => void) | null = null;

/**
 * Hook to announce messages to screen readers
 */
export function useAnnouncer() {
  const announce = useCallback(
    (message: string, priority: AnnouncementPriority = 'polite') => {
      if (globalAnnounce) {
        globalAnnounce(message, priority);
      }
    },
    []
  );

  const clear = useCallback(() => {
    // Not implemented for now - messages auto-clear
  }, []);

  return { announce, clear };
}

/**
 * AccessibilityAnnouncer component for web
 * Renders hidden ARIA live regions for screen reader announcements
 */
export function AccessibilityAnnouncer(): JSX.Element | null {
  const [messages, setMessages] = useState<AnnouncementMessage[]>([]);
  const messageIdRef = useRef(0);

  useEffect(() => {
    globalAnnounce = (message: string, priority: AnnouncementPriority = 'polite') => {
      const id = `announcement_${++messageIdRef.current}_${Date.now()}`;

      setMessages((prev) => [...prev, { id, message, priority, timestamp: Date.now() }]);

      // Clear message after it's been announced
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, 1000);
    };

    return () => {
      globalAnnounce = null;
    };
  }, []);

  // Don't render on native platforms
  if (!isWeb) return null;

  const politeMessages = messages.filter((m) => m.priority === 'polite');
  const assertiveMessages = messages.filter((m) => m.priority === 'assertive');

  return (
    <View style={styles.container} accessibilityElementsHidden>
      {/* Polite announcements - won't interrupt current speech */}
      <View
        // @ts-expect-error - web-only props
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={styles.liveRegion}
      >
        {politeMessages.map((m) => (
          <Text key={m.id} style={styles.text}>
            {m.message}
          </Text>
        ))}
      </View>

      {/* Assertive announcements - will interrupt current speech */}
      <View
        // @ts-expect-error - web-only props
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={styles.liveRegion}
      >
        {assertiveMessages.map((m) => (
          <Text key={m.id} style={styles.text}>
            {m.message}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    // @ts-expect-error - web-only style
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  liveRegion: {
    // Hidden but accessible
  },
  text: {
    // Inherit styles
  },
});

AccessibilityAnnouncer.displayName = 'AccessibilityAnnouncer';
