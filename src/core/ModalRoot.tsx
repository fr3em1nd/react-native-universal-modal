/**
 * ModalRoot - Root component that renders all active modals
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useModalContext } from '../context/hooks/useModalContext';
import { ModalPortal } from '../components/ModalPortal';
import { AccessibilityAnnouncer } from '../accessibility/Announcer';

/**
 * ModalRoot - Renders all active modals from the stack
 *
 * This component should be placed at the root of your app,
 * alongside your main content:
 *
 * ```tsx
 * <ModalProvider>
 *   <App />
 *   <ModalRoot />
 * </ModalProvider>
 * ```
 */
export const ModalRoot = memo(function ModalRoot(): JSX.Element {
  const { state, stackManager } = useModalContext();
  const { activeModals } = state;

  return (
    <View style={styles.root} pointerEvents="box-none">
      {/* Accessibility announcer for screen readers */}
      <AccessibilityAnnouncer />

      {/* Render all active modals */}
      {activeModals.map((modal, index) => {
        const isTopModal = stackManager.isTopModal(modal.id);

        return (
          <ModalPortal
            key={modal.id}
            modal={modal}
            isTopModal={isTopModal}
            stackPosition={index}
            stackSize={activeModals.length}
          />
        );
      })}
    </View>
  );
});

ModalRoot.displayName = 'ModalRoot';

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
});
