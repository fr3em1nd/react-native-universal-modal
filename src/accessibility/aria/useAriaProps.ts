/**
 * useAriaProps - Hook to generate ARIA attributes for web accessibility
 */

import { useMemo } from 'react';
import type { AccessibilityConfig, AriaProps } from '../../types';
import { isWeb } from '../../utils';

interface AriaIds {
  /** ID of the element that labels the modal (e.g., title) */
  titleId?: string;
  /** ID of the element that describes the modal (e.g., description) */
  descriptionId?: string;
}

/**
 * Hook to generate ARIA props for modal accessibility
 *
 * On native platforms, returns an empty object since ARIA is web-only.
 * On web, returns proper ARIA attributes for screen readers.
 *
 * @param config - Accessibility configuration
 * @param ids - Element IDs for labeling
 * @returns ARIA props object (empty on native)
 */
export function useAriaProps(
  config: AccessibilityConfig,
  ids?: AriaIds
): AriaProps | Record<string, never> {
  return useMemo(() => {
    // Return empty object on native platforms
    if (!isWeb) {
      return {};
    }

    const { role = 'dialog', modal = true, accessibilityLabel } = config;

    const ariaProps: AriaProps = {
      role,
      'aria-modal': modal,
    };

    // Set aria-labelledby if we have a title ID
    if (ids?.titleId) {
      ariaProps['aria-labelledby'] = ids.titleId;
    } else if (accessibilityLabel) {
      // Fall back to aria-label if no labelledby
      ariaProps['aria-label'] = accessibilityLabel;
    }

    // Set aria-describedby if we have a description ID
    if (ids?.descriptionId) {
      ariaProps['aria-describedby'] = ids.descriptionId;
    }

    return ariaProps;
  }, [config, ids]);
}

/**
 * Generate a unique ID for accessibility purposes
 */
let ariaIdCounter = 0;

export function generateAriaId(prefix = 'modal'): string {
  return `${prefix}-${++ariaIdCounter}`;
}

/**
 * Generate a pair of IDs for title and description
 */
export function generateAriaIds(
  prefix = 'modal'
): { titleId: string; descriptionId: string } {
  const base = generateAriaId(prefix);
  return {
    titleId: `${base}-title`,
    descriptionId: `${base}-description`,
  };
}
