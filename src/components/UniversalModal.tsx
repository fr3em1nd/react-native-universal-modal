/**
 * UniversalModal - Declarative modal component
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { useModalContext, useModalDispatch } from '../context/hooks/useModalContext';
import type {
  UniversalModalProps,
  ModalId,
  ModalConfig,
  ModalComponent,
} from '../types';

/**
 * Simple content wrapper component for declarative API
 */
function ModalContentWrapper({
  children,
}: {
  children: ReactNode;
  modalId?: ModalId;
  hide?: () => void;
  isTopModal?: boolean;
  stackPosition?: number;
}): JSX.Element {
  return <>{children}</>;
}

/**
 * UniversalModal - Declarative API for modals
 *
 * Usage:
 * ```tsx
 * <UniversalModal
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   animation="slideUp"
 *   closeOnBackdropPress
 * >
 *   <YourModalContent />
 * </UniversalModal>
 * ```
 *
 * This component doesn't render anything directly - it manages
 * the modal through the ModalProvider context.
 */
export function UniversalModal({
  visible,
  onClose,
  onShow,
  onDismiss,
  onAnimationStart,
  onAnimationEnd,
  children,
  animation = 'fade',
  animationConfig,
  closeOnBackdropPress = true,
  closeOnEscape = true,
  closeOnBackButton = true,
  backdropOpacity,
  backdropColor,
  avoidKeyboard,
  trapFocus = true,
  restoreFocus = true,
  accessibilityLabel,
  openAnnouncement,
  closeAnnouncement,
  priority = 0,
  containerStyle,
  contentStyle,
  testID,
}: UniversalModalProps): null {
  const { stackManager, registry } = useModalContext();
  const { dispatch } = useModalDispatch();

  const modalIdRef = useRef<ModalId | null>(null);
  const isShowingRef = useRef(false);
  const prevVisibleRef = useRef(visible);

  // Build config - only include defined values to satisfy exactOptionalPropertyTypes
  const config: ModalConfig = {
    animationIn: animation,
    animationOut: animation,
    closeOnBackdropPress,
    closeOnEscape,
    closeOnBackButton,
    trapFocus,
    restoreFocus,
    priority,
    ...(onClose !== undefined && { onClose }),
    ...(onAnimationEnd !== undefined && { onAnimationEnd }),
    ...(testID !== undefined && { testID }),
    ...(animationConfig?.duration !== undefined && { animationDuration: animationConfig.duration }),
    ...(backdropOpacity !== undefined && { backdropOpacity }),
    ...(backdropColor !== undefined && { backdropColor }),
    ...(avoidKeyboard !== undefined && { avoidKeyboard }),
    ...(accessibilityLabel !== undefined && { accessibilityLabel }),
    ...(openAnnouncement !== undefined && { openAnnouncement }),
    ...(closeAnnouncement !== undefined && { closeAnnouncement }),
    ...(containerStyle !== undefined && { containerStyle }),
    ...(contentStyle !== undefined && { contentStyle }),
  };

  // Handle visibility changes
  useEffect(() => {
    const wasVisible = prevVisibleRef.current;
    prevVisibleRef.current = visible;

    if (visible && !wasVisible && !isShowingRef.current) {
      // Show modal
      const id = registry.generateId();
      modalIdRef.current = id;
      isShowingRef.current = true;

      const { zIndex } = stackManager.push(id, priority);

      onAnimationStart?.();

      dispatch({
        type: 'SHOW_MODAL',
        payload: {
          id,
          zIndex,
          component: ModalContentWrapper as ModalComponent,
          props: { children },
          state: 'entering',
          config,
        },
      });

      onShow?.();
    } else if (!visible && wasVisible && isShowingRef.current) {
      // Hide modal
      const id = modalIdRef.current;
      if (id) {
        onAnimationStart?.();
        dispatch({ type: 'HIDE_MODAL', payload: { id } });
        isShowingRef.current = false;
        onDismiss?.();
      }
    }
  }, [
    visible,
    children,
    config,
    dispatch,
    onAnimationStart,
    onDismiss,
    onShow,
    priority,
    registry,
    stackManager,
  ]);

  // Update props when children change (while visible)
  useEffect(() => {
    const id = modalIdRef.current;
    if (id && isShowingRef.current) {
      dispatch({
        type: 'UPDATE_MODAL_PROPS',
        payload: {
          id,
          props: { children },
        },
      });
    }
  }, [children, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const id = modalIdRef.current;
      if (id && isShowingRef.current) {
        stackManager.pop(id);
        dispatch({ type: 'REMOVE_MODAL', payload: { id } });
      }
    };
  }, [stackManager, dispatch]);

  // This component doesn't render anything
  // Modals are rendered by ModalRoot through ModalPortal
  return null;
}

UniversalModal.displayName = 'UniversalModal';
