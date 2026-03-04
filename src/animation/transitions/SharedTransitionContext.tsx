/**
 * SharedTransitionContext - Context for managing shared transitions between modals
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import type { ModalAnimationState, SharedTransitionConfig } from '../../types';

/**
 * Shared transition context value
 */
interface SharedTransitionContextValue {
  /** Register a modal for shared transitions */
  registerModal: (id: string, initialState?: Partial<ModalAnimationState>) => void;
  /** Unregister a modal */
  unregisterModal: (id: string) => void;
  /** Get the current state of a modal */
  getModalState: (id: string) => ModalAnimationState | undefined;
  /** Update a modal's state */
  updateModalState: (id: string, state: Partial<ModalAnimationState>) => void;
  /** Transition from one modal to another */
  transitionBetween: (
    fromId: string,
    toId: string,
    config?: SharedTransitionConfig
  ) => Promise<void>;
  /** Whether a transition is currently in progress */
  isTransitioning: boolean;
  /** The currently active modal ID */
  activeModalId: string | null;
}

const SharedTransitionContext = createContext<SharedTransitionContextValue | null>(null);

/**
 * Provider props
 */
interface SharedTransitionProviderProps {
  children: ReactNode;
}

/**
 * SharedTransitionProvider - Provides shared transition functionality
 */
export function SharedTransitionProvider({
  children,
}: SharedTransitionProviderProps): JSX.Element {
  const modalStates = useRef<Map<string, ModalAnimationState>>(new Map());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  const registerModal = useCallback(
    (id: string, initialState?: Partial<ModalAnimationState>) => {
      modalStates.current.set(id, {
        id,
        progress: 0,
        position: { x: 0, y: 0, width: 0, height: 0 },
        opacity: 0,
        ...initialState,
      });
    },
    []
  );

  const unregisterModal = useCallback((id: string) => {
    modalStates.current.delete(id);
  }, []);

  const getModalState = useCallback((id: string) => {
    return modalStates.current.get(id);
  }, []);

  const updateModalState = useCallback(
    (id: string, state: Partial<ModalAnimationState>) => {
      const current = modalStates.current.get(id);
      if (current) {
        modalStates.current.set(id, { ...current, ...state });
      }
    },
    []
  );

  const transitionBetween = useCallback(
    async (
      fromId: string,
      toId: string,
      config?: SharedTransitionConfig
    ): Promise<void> => {
      const fromState = modalStates.current.get(fromId);
      const toState = modalStates.current.get(toId);

      if (!fromState || !toState) {
        console.warn(
          '[SharedTransition] Cannot transition: modal not found',
          { fromId, toId }
        );
        return;
      }

      setIsTransitioning(true);

      const duration = config?.duration ?? 300;
      const type = config?.type ?? 'crossfade';

      // Simulate transition animation
      // In a real implementation, this would use Reanimated or Animated
      await new Promise<void>((resolve) => {
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Update states based on transition type
          if (type === 'crossfade') {
            updateModalState(fromId, { opacity: 1 - progress, progress: 1 - progress });
            updateModalState(toId, { opacity: progress, progress });
          } else if (type === 'slide') {
            const fromX = -progress * 100;
            const toX = (1 - progress) * 100;
            updateModalState(fromId, {
              position: { ...fromState.position, x: fromX },
              opacity: 1 - progress,
            });
            updateModalState(toId, {
              position: { ...toState.position, x: toX },
              opacity: progress,
            });
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(animate);
      });

      setActiveModalId(toId);
      setIsTransitioning(false);
    },
    [updateModalState]
  );

  const value: SharedTransitionContextValue = {
    registerModal,
    unregisterModal,
    getModalState,
    updateModalState,
    transitionBetween,
    isTransitioning,
    activeModalId,
  };

  return (
    <SharedTransitionContext.Provider value={value}>
      {children}
    </SharedTransitionContext.Provider>
  );
}

/**
 * Hook to access shared transition context
 */
export function useSharedTransitionContext(): SharedTransitionContextValue {
  const context = useContext(SharedTransitionContext);

  if (!context) {
    throw new Error(
      'useSharedTransitionContext must be used within a SharedTransitionProvider'
    );
  }

  return context;
}

SharedTransitionProvider.displayName = 'SharedTransitionProvider';
