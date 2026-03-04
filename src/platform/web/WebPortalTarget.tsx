/**
 * WebPortalTarget - Creates a portal container for modals on web
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { WEB_PORTAL_CONTAINER_ID } from '../../core/constants';

interface WebPortalTargetProps {
  children: ReactNode;
  /** Z-index for the portal container */
  zIndex?: number;
}

/**
 * Create or get the portal container element
 */
function getOrCreatePortalContainer(): HTMLDivElement {
  let container = document.getElementById(WEB_PORTAL_CONTAINER_ID) as HTMLDivElement | null;

  if (!container) {
    container = document.createElement('div');
    container.id = WEB_PORTAL_CONTAINER_ID;
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(container);
  }

  return container;
}

/**
 * WebPortalTarget - Renders children into a portal at document.body
 */
export function WebPortalTarget({ children, zIndex = 9999 }: WebPortalTargetProps): React.ReactPortal | null {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current = getOrCreatePortalContainer();

    if (containerRef.current) {
      containerRef.current.style.zIndex = String(zIndex);
    }

    return () => {
      // Clean up container if empty
      const container = containerRef.current;
      if (container && container.childNodes.length === 0) {
        container.remove();
        containerRef.current = null;
      }
    };
  }, [zIndex]);

  if (!containerRef.current) {
    // First render - create container synchronously
    containerRef.current = getOrCreatePortalContainer();
  }

  return createPortal(children, containerRef.current);
}

WebPortalTarget.displayName = 'WebPortalTarget';

/**
 * Hook to manage scroll lock on body element
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const originalStyle = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Calculate scrollbar width to prevent layout shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [active]);
}
