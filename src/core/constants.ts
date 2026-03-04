/**
 * Default z-index base for modals
 */
export const DEFAULT_BASE_Z_INDEX = 1000;

/**
 * Z-index increment between stacked modals
 */
export const DEFAULT_Z_INDEX_INCREMENT = 10;

/**
 * Default animation duration in milliseconds
 */
export const DEFAULT_ANIMATION_DURATION = 300;

/**
 * Default backdrop opacity
 */
export const DEFAULT_BACKDROP_OPACITY = 0.5;

/**
 * Default backdrop color
 */
export const DEFAULT_BACKDROP_COLOR = '#000000';

/**
 * Portal container ID for web
 */
export const WEB_PORTAL_CONTAINER_ID = 'universal-modal-root';

/**
 * Focusable element selectors for focus trap (web)
 */
export const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');
