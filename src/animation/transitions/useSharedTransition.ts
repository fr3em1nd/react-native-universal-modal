/**
 * useSharedTransition - Hook for modals participating in shared transitions
 */

import { useEffect, useRef, useCallback } from 'react';
import { View } from 'react-native';
import { useSharedTransitionContext } from './SharedTransitionContext';
import type { SharedTransitionConfig } from '../../types';

/**
 * Options for useSharedTransition hook
 */
export interface UseSharedTransitionOptions {
  /** Unique identifier for this modal */
  modalId: string;
  /** Callback when transition starts */
  onTransitionStart?: () => void;
  /** Callback when transition ends */
  onTransitionEnd?: () => void;
}

/**
 * Return type for useSharedTransition hook
 */
export interface UseSharedTransitionReturn {
  /** Ref to attach to the modal container for layout measurement */
  measureRef: React.RefObject<View>;
  /** Trigger a transition to another modal */
  transitionTo: (targetModalId: string, config?: SharedTransitionConfig) => Promise<void>;
  /** Measure and update the modal's layout */
  measureLayout: () => void;
  /** Whether a transition is currently in progress */
  isTransitioning: boolean;
  /** Whether this modal is currently active */
  isActive: boolean;
}

/**
 * useSharedTransition - Hook for shared transitions between modals
 *
 * Usage:
 * ```tsx
 * function Modal1({ modalId }) {
 *   const { measureRef, transitionTo, isActive } = useSharedTransition({
 *     modalId,
 *   });
 *
 *   const handleNavigate = async () => {
 *     await transitionTo('modal-2', { type: 'crossfade' });
 *   };
 *
 *   return (
 *     <View ref={measureRef}>
 *       <Button onPress={handleNavigate} title="Go to Modal 2" />
 *     </View>
 *   );
 * }
 * ```
 */
export function useSharedTransition(
  options: UseSharedTransitionOptions
): UseSharedTransitionReturn {
  const { modalId, onTransitionStart, onTransitionEnd } = options;
  const context = useSharedTransitionContext();
  const measureRef = useRef<View>(null);

  // Register modal on mount
  useEffect(() => {
    context.registerModal(modalId, { opacity: 1, progress: 1 });

    return () => {
      context.unregisterModal(modalId);
    };
  }, [modalId, context]);

  // Measure and update layout
  const measureLayout = useCallback(() => {
    if (measureRef.current) {
      measureRef.current.measureInWindow((x, y, width, height) => {
        context.updateModalState(modalId, {
          position: { x, y, width, height },
        });
      });
    }
  }, [modalId, context]);

  // Transition to another modal
  const transitionTo = useCallback(
    async (targetModalId: string, config?: SharedTransitionConfig) => {
      onTransitionStart?.();
      await context.transitionBetween(modalId, targetModalId, config);
      onTransitionEnd?.();
    },
    [modalId, context, onTransitionStart, onTransitionEnd]
  );

  return {
    measureRef,
    transitionTo,
    measureLayout,
    isTransitioning: context.isTransitioning,
    isActive: context.activeModalId === modalId,
  };
}
