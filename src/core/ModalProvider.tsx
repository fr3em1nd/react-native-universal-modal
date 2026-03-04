import React, { useReducer, useMemo, useRef, useEffect } from 'react';
import {
  ModalContext,
  ModalDispatchContext,
  type ModalContextValue,
  type ModalDispatchContextValue,
} from '../context/ModalContext';
import { ModalStackManager } from './ModalStackManager';
import { ModalRegistry } from './ModalRegistry';
import { modalReducer, initialModalState } from './modalReducer';
import { DEFAULT_BASE_Z_INDEX, DEFAULT_Z_INDEX_INCREMENT } from './constants';
import type { ModalConfig, ModalProviderProps } from '../types';

/**
 * Props for internal ModalProvider
 */
interface InternalModalProviderProps extends ModalProviderProps {
  /** Base z-index for modal layering */
  baseZIndex?: number;
  /** Z-index increment between stacked modals */
  zIndexIncrement?: number;
}

/**
 * ModalProvider - Root provider for the modal system
 *
 * Initializes and provides:
 * - Modal state via useReducer
 * - ModalStackManager for stack operations
 * - ModalRegistry for imperative API
 * - Global configuration
 *
 * Uses split contexts (state/dispatch) to minimize re-renders
 */
export function ModalProvider({
  children,
  config = {},
  baseZIndex = DEFAULT_BASE_Z_INDEX,
  zIndexIncrement = DEFAULT_Z_INDEX_INCREMENT,
}: InternalModalProviderProps): JSX.Element {
  // Modal state via reducer
  const [state, dispatch] = useReducer(modalReducer, initialModalState);

  // Refs for stable instances
  const stackManagerRef = useRef<ModalStackManager | null>(null);
  const registryRef = useRef<ModalRegistry | null>(null);

  // Initialize instances lazily
  if (stackManagerRef.current === null) {
    stackManagerRef.current = new ModalStackManager(baseZIndex, zIndexIncrement);
  }

  if (registryRef.current === null) {
    registryRef.current = new ModalRegistry();
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stackManagerRef.current?.removeAllListeners();
      registryRef.current?.clear();
    };
  }, []);

  // Memoized context value for state (prevents re-renders when config doesn't change)
  const contextValue = useMemo<ModalContextValue>(
    () => ({
      state,
      stackManager: stackManagerRef.current!,
      registry: registryRef.current!,
      config,
    }),
    [state, config]
  );

  // Memoized dispatch context (stable reference)
  const dispatchValue = useMemo<ModalDispatchContextValue>(
    () => ({ dispatch }),
    [] // dispatch is stable from useReducer
  );

  return (
    <ModalContext.Provider value={contextValue}>
      <ModalDispatchContext.Provider value={dispatchValue}>
        {children}
      </ModalDispatchContext.Provider>
    </ModalContext.Provider>
  );
}

ModalProvider.displayName = 'ModalProvider';

/**
 * Higher-order component to wrap a component with ModalProvider
 */
export function withModalProvider<P extends object>(
  Component: React.ComponentType<P>,
  config?: ModalConfig
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <ModalProvider {...(config ? { config } : {})}>
      <Component {...props} />
    </ModalProvider>
  );

  WrappedComponent.displayName = `withModalProvider(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
}
