import type {
  ModalId,
  ModalComponent,
  ModalConfig,
  RegisteredModal,
} from '../types';
import { generateId } from '../utils';

/**
 * ModalRegistry - Stores modal component references for imperative API
 *
 * Responsibilities:
 * - Register modal components with their configurations
 * - Store props and resolve functions for promise-based API
 * - Manage modal lifecycle for imperative calls
 */
export class ModalRegistry {
  private registry: Map<ModalId, RegisteredModal> = new Map();

  /**
   * Register a modal component
   * @param component - The modal component
   * @param config - Default configuration
   * @returns The assigned modal ID
   */
  register<TProps = Record<string, unknown>, TResult = void>(
    component: ModalComponent<TProps, TResult>,
    config: ModalConfig = {}
  ): ModalId {
    const id = generateId('registered');

    const entry: RegisteredModal = {
      id,
      component: component as unknown as ModalComponent,
      config,
      props: null,
      resolve: null,
    };

    this.registry.set(id, entry);

    return id;
  }

  /**
   * Unregister a modal
   * @param id - Modal identifier
   * @returns true if modal was found and removed
   */
  unregister(id: ModalId): boolean {
    const entry = this.registry.get(id);

    // Resolve with undefined if there's a pending promise
    if (entry?.resolve) {
      entry.resolve(undefined);
    }

    return this.registry.delete(id);
  }

  /**
   * Get a registered modal by ID
   */
  get(id: ModalId): RegisteredModal | undefined {
    return this.registry.get(id);
  }

  /**
   * Check if a modal is registered
   */
  has(id: ModalId): boolean {
    return this.registry.has(id);
  }

  /**
   * Update modal props
   * @param id - Modal identifier
   * @param props - New props
   */
  updateProps<TProps = Record<string, unknown>>(
    id: ModalId,
    props: TProps
  ): boolean {
    const entry = this.registry.get(id);
    if (!entry) return false;

    entry.props = props as Record<string, unknown>;
    return true;
  }

  /**
   * Set the resolve function for promise-based API
   * @param id - Modal identifier
   * @param resolve - Promise resolve function
   */
  setResolver<TResult = void>(
    id: ModalId,
    resolve: (result: TResult | undefined) => void
  ): boolean {
    const entry = this.registry.get(id);
    if (!entry) return false;

    entry.resolve = resolve as (result: unknown) => void;
    return true;
  }

  /**
   * Resolve a modal's promise
   * @param id - Modal identifier
   * @param result - The result value
   */
  resolve<TResult = void>(id: ModalId, result?: TResult): boolean {
    const entry = this.registry.get(id);
    if (!entry?.resolve) return false;

    (entry.resolve as (r: unknown) => void)(result);
    entry.resolve = null;
    return true;
  }

  /**
   * Get all registered modal IDs
   */
  getAllIds(): ModalId[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Get the number of registered modals
   */
  size(): number {
    return this.registry.size;
  }

  /**
   * Clear all registered modals
   * Resolves all pending promises with undefined
   */
  clear(): void {
    // Resolve all pending promises
    this.registry.forEach((entry) => {
      if (entry.resolve) {
        entry.resolve(undefined);
      }
    });

    this.registry.clear();
  }

  /**
   * Generate a unique modal ID
   */
  generateId(): ModalId {
    return generateId('modal');
  }
}
