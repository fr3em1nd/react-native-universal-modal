/**
 * ModalController - Global imperative API for modals
 *
 * Use this when you need to show modals from outside React components,
 * or when you want a simpler imperative API.
 */

import type {
  ModalComponent,
  ModalConfig,
  ShowModalOptions,
  ModalResult,
  ModalId,
  ModalAction,
  ActiveModal,
} from '../types';
import type { ModalStackManager } from './ModalStackManager';
import type { ModalRegistry } from './ModalRegistry';

/**
 * Provider ref interface
 */
interface ProviderRef {
  stackManager: ModalStackManager;
  registry: ModalRegistry;
  dispatch: (action: ModalAction) => void;
  getState: () => { activeModals: ActiveModal[] };
}

/**
 * ModalController singleton class
 *
 * Usage:
 * ```tsx
 * // In a ModalProvider setup file
 * import { ModalController } from 'react-native-unified-modal';
 *
 * // The controller is automatically connected when using ModalProvider
 *
 * // Anywhere in your app (including non-React code)
 * ModalController.show(MyModal, { title: 'Hello' });
 * ModalController.hideAll();
 * ```
 */
class ModalControllerClass {
  private static instance: ModalControllerClass;
  private providerRef: ProviderRef | null = null;
  private pendingResults: Map<ModalId, (result: ModalResult<unknown>) => void> = new Map();

  static getInstance(): ModalControllerClass {
    if (!ModalControllerClass.instance) {
      ModalControllerClass.instance = new ModalControllerClass();
    }
    return ModalControllerClass.instance;
  }

  /**
   * Connect to a ModalProvider (called internally by ModalProvider)
   */
  connect(ref: ProviderRef): void {
    this.providerRef = ref;
  }

  /**
   * Disconnect from the ModalProvider
   */
  disconnect(): void {
    // Resolve all pending results as dismissed
    this.pendingResults.forEach((resolve) => {
      resolve({ data: undefined, dismissed: true });
    });
    this.pendingResults.clear();
    this.providerRef = null;
  }

  /**
   * Check if the controller is connected to a provider
   */
  isConnected(): boolean {
    return this.providerRef !== null;
  }

  /**
   * Show a modal
   */
  async show<TProps = Record<string, unknown>, TResult = void>(
    Component: ModalComponent<TProps, TResult>,
    props?: TProps,
    options?: ShowModalOptions
  ): Promise<ModalResult<TResult>> {
    if (!this.providerRef) {
      throw new Error(
        '[ModalController] Not connected to a ModalProvider. ' +
          'Make sure ModalProvider is mounted before using ModalController.'
      );
    }

    const { stackManager, registry, dispatch } = this.providerRef;

    // Generate ID
    const id = options?.id ?? registry.generateId();

    // Merge configs
    const config: ModalConfig = { ...options };

    // Push to stack
    const priority = config.priority ?? 0;
    const { zIndex } = stackManager.push(id, priority);

    // Create result promise
    const resultPromise = new Promise<ModalResult<TResult>>((resolve) => {
      this.pendingResults.set(id, resolve as (result: ModalResult<unknown>) => void);
    });

    // Dispatch show action
    dispatch({
      type: 'SHOW_MODAL',
      payload: {
        id,
        zIndex,
        component: Component as ModalComponent,
        props: (props ?? {}) as Record<string, unknown>,
        state: 'entering',
        config,
      },
    });

    return resultPromise;
  }

  /**
   * Hide a specific modal
   */
  hide<TResult = void>(modalId: ModalId, result?: TResult): boolean {
    if (!this.providerRef) return false;

    const { dispatch } = this.providerRef;

    // Resolve the pending result
    const resolver = this.pendingResults.get(modalId);
    if (resolver) {
      resolver({
        data: result,
        dismissed: result === undefined,
      });
      this.pendingResults.delete(modalId);
    }

    // Dispatch hide action
    dispatch({ type: 'HIDE_MODAL', payload: { id: modalId } });

    return true;
  }

  /**
   * Hide the topmost modal
   */
  hideTop<TResult = void>(result?: TResult): boolean {
    if (!this.providerRef) return false;

    const topModalId = this.providerRef.stackManager.getTopModal();
    if (!topModalId) return false;

    return this.hide(topModalId, result);
  }

  /**
   * Hide all modals
   */
  hideAll(): ModalId[] {
    if (!this.providerRef) return [];

    const { stackManager, dispatch } = this.providerRef;
    const closedIds = stackManager.closeAll();

    // Resolve all pending results as dismissed
    closedIds.forEach((id) => {
      const resolver = this.pendingResults.get(id);
      if (resolver) {
        resolver({ data: undefined, dismissed: true });
        this.pendingResults.delete(id);
      }
      dispatch({ type: 'REMOVE_MODAL', payload: { id } });
    });

    return closedIds;
  }

  /**
   * Get the number of open modals
   */
  getOpenCount(): number {
    return this.providerRef?.stackManager.getStackSize() ?? 0;
  }

  /**
   * Check if any modals are open
   */
  hasOpenModals(): boolean {
    return this.getOpenCount() > 0;
  }

  /**
   * Get the topmost modal ID
   */
  getTopModalId(): ModalId | null {
    return this.providerRef?.stackManager.getTopModal() ?? null;
  }
}

// Export singleton instance
export const ModalController = ModalControllerClass.getInstance();
