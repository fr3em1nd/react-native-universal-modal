import { useContext } from 'react';
import {
  ModalContext,
  ModalDispatchContext,
  type ModalContextValue,
  type ModalDispatchContextValue,
} from '../ModalContext';
import { invariant } from '../../utils';

/**
 * Hook to access modal state context
 * @throws Error if used outside of ModalProvider
 */
export function useModalContext(): ModalContextValue {
  const context = useContext(ModalContext);

  invariant(
    context !== null,
    'useModalContext must be used within a ModalProvider. ' +
      'Make sure you have wrapped your app with <ModalProvider>.'
  );

  return context;
}

/**
 * Hook to access modal dispatch context
 * @throws Error if used outside of ModalProvider
 */
export function useModalDispatch(): ModalDispatchContextValue {
  const context = useContext(ModalDispatchContext);

  invariant(
    context !== null,
    'useModalDispatch must be used within a ModalProvider. ' +
      'Make sure you have wrapped your app with <ModalProvider>.'
  );

  return context;
}

/**
 * Hook to access both modal state and dispatch
 * Convenient when you need both, but be aware this will re-render
 * on any state change
 */
export function useModalState(): ModalContextValue & ModalDispatchContextValue {
  const stateContext = useModalContext();
  const dispatchContext = useModalDispatch();

  return {
    ...stateContext,
    ...dispatchContext,
  };
}
