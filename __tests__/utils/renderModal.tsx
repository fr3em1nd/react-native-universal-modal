/**
 * Test utilities for modal testing
 */

import React, { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { ModalProvider } from '../../src/core/ModalProvider';
import { ModalRoot } from '../../src/core/ModalRoot';
import type { ModalConfig } from '../../src/types';

/**
 * Options for renderWithModal
 */
interface RenderWithModalOptions extends Omit<RenderOptions, 'wrapper'> {
  modalConfig?: ModalConfig;
}

/**
 * Wrapper component that provides modal context
 */
function ModalWrapper({
  children,
  config,
}: {
  children: ReactNode;
  config?: ModalConfig;
}): JSX.Element {
  return (
    <ModalProvider config={config}>
      {children}
      <ModalRoot />
    </ModalProvider>
  );
}

/**
 * Render a component with modal provider
 */
export function renderWithModal(
  ui: ReactElement,
  options: RenderWithModalOptions = {}
) {
  const { modalConfig, ...renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <ModalWrapper config={modalConfig}>{children}</ModalWrapper>
    ),
    ...renderOptions,
  });
}

/**
 * Create a test modal component
 */
export function createTestModal(name = 'TestModal') {
  const TestModal = ({
    title = 'Test Modal',
    onClose,
  }: {
    title?: string;
    onClose?: () => void;
  }) => {
    const { Text, View, Pressable } = require('react-native');
    return (
      <View testID={`${name}-container`}>
        <Text testID={`${name}-title`}>{title}</Text>
        {onClose && (
          <Pressable testID={`${name}-close`} onPress={onClose}>
            <Text>Close</Text>
          </Pressable>
        )}
      </View>
    );
  };

  TestModal.displayName = name;
  return TestModal;
}
