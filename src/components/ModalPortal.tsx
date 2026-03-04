/**
 * ModalPortal - Portal rendering for individual modals
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { ModalStackContext, type ModalStackContextValue } from '../context/ModalStackContext';
import { useModalContext, useModalDispatch } from '../context/hooks/useModalContext';
import { ModalBackdrop } from './ModalBackdrop';
import { ModalContainer } from './ModalContainer';
import { ModalContent } from './ModalContent';
import { NativeModalHost } from '../platform/native/NativeModalHost';
import { WebPortalTarget, useBodyScrollLock } from '../platform/web/WebPortalTarget';
import { useEscapeKey } from '../accessibility/keyboard/useEscapeKey';
import { useBackHandler } from '../accessibility/keyboard/useBackHandler';
import { useAnnouncer } from '../accessibility/Announcer';
import type { ModalId, ModalState, ActiveModal } from '../types';
import { isWeb } from '../utils';

interface ModalPortalProps {
  /** Modal data */
  modal: ActiveModal;
  /** Whether this modal is the topmost */
  isTopModal: boolean;
  /** Position in the stack */
  stackPosition: number;
  /** Total stack size */
  stackSize: number;
}

/**
 * ModalPortal - Renders a single modal with all its features
 *
 * Responsibilities:
 * - Provides ModalStackContext to the modal component
 * - Handles backdrop, container, and content rendering
 * - Manages keyboard dismissal (Escape, back button)
 * - Handles accessibility announcements
 * - Lazy mounts and unmounts based on state
 */
export const ModalPortal = memo(function ModalPortal({
  modal,
  isTopModal,
  stackPosition,
  stackSize,
}: ModalPortalProps): JSX.Element | null {
  const { id, zIndex, component: ModalComponent, props, state, config } = modal;
  const { dispatch } = useModalDispatch();
  const { stackManager } = useModalContext();
  const { announce } = useAnnouncer();

  const [isMounted, setIsMounted] = useState(false);

  // Lazy mount - only mount when entering
  useEffect(() => {
    if (state === 'entering' || state === 'visible') {
      setIsMounted(true);
    }
  }, [state]);

  // Handle close
  const handleClose = useCallback(() => {
    dispatch({ type: 'HIDE_MODAL', payload: { id } });

    // Announce close
    if (config.closeAnnouncement) {
      announce(config.closeAnnouncement, 'polite');
    }
  }, [dispatch, id, config.closeAnnouncement, announce]);

  // Handle animation complete
  const handleAnimationComplete = useCallback(
    (newState: ModalState) => {
      if (newState === 'visible') {
        dispatch({ type: 'UPDATE_MODAL_STATE', payload: { id, state: 'visible' } });

        // Announce open
        if (config.openAnnouncement) {
          announce(config.openAnnouncement, 'assertive');
        }
      } else if (newState === 'hidden') {
        stackManager.pop(id);
        dispatch({ type: 'REMOVE_MODAL', payload: { id } });
        setIsMounted(false);
      }
    },
    [dispatch, id, stackManager, config.openAnnouncement, announce]
  );

  // Handle backdrop press
  const handleBackdropPress = useCallback(() => {
    if (config.closeOnBackdropPress !== false) {
      handleClose();
    }
  }, [config.closeOnBackdropPress, handleClose]);

  // Escape key handling (web)
  useEscapeKey({
    enabled: isTopModal && isWeb && config.closeOnEscape !== false,
    onEscape: handleClose,
  });

  // Back button handling (Android)
  useBackHandler({
    enabled: isTopModal && Platform.OS === 'android' && config.closeOnBackButton !== false,
    onBack: () => {
      handleClose();
      return true; // Prevent default back behavior
    },
  });

  // Body scroll lock (web)
  if (isWeb) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBodyScrollLock(state !== 'hidden' && state !== 'exiting');
  }

  // Don't render if not mounted
  if (!isMounted) {
    return null;
  }

  // Stack context value
  const stackContextValue: ModalStackContextValue = {
    modalId: id,
    zIndex,
    isTopModal,
    stackPosition,
    stackSize,
  };

  // Modal content
  const modalContent = (
    <ModalStackContext.Provider value={stackContextValue}>
      <ModalBackdrop
        visible={state !== 'hidden'}
        state={state}
        onPress={handleBackdropPress}
        color={config.backdropColor}
        opacity={config.backdropOpacity}
        animationDuration={config.animationDuration}
      />
      <ModalContainer
        zIndex={zIndex + 1}
        state={state}
        animation={config.animationIn}
        animationConfig={{ duration: config.animationDuration }}
        onAnimationComplete={handleAnimationComplete}
        contentStyle={config.contentStyle}
      >
        <ModalContent
          trapFocus={config.trapFocus !== false}
          accessibilityConfig={{
            accessibilityLabel: config.accessibilityLabel,
            restoreFocus: config.restoreFocus,
          }}
        >
          <ModalComponent
            {...props}
            modalId={id}
            hide={handleClose}
            isTopModal={isTopModal}
            stackPosition={stackPosition}
          />
        </ModalContent>
      </ModalContainer>
    </ModalStackContext.Provider>
  );

  // Render with platform-specific wrapper
  if (isWeb) {
    return (
      <WebPortalTarget zIndex={zIndex}>
        {modalContent}
      </WebPortalTarget>
    );
  }

  return (
    <NativeModalHost zIndex={zIndex} state={state}>
      {modalContent}
    </NativeModalHost>
  );
});

ModalPortal.displayName = 'ModalPortal';
