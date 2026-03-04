import type { ModalId, ModalStackEntry } from '../types';
import { generateId } from '../utils';

/**
 * Stack event types
 */
export type StackEventType =
  | 'modal:pushed'
  | 'modal:popped'
  | 'stack:cleared'
  | 'top:changed';

/**
 * Stack event payload
 */
export interface StackEvent {
  type: StackEventType;
  modalId?: ModalId;
  previousTopId?: ModalId | null;
  newTopId?: ModalId | null;
  timestamp: number;
}

/**
 * Callback for stack change events
 */
export type StackChangeListener = () => void;

/**
 * Callback for specific stack events
 */
export type StackEventListener = (event: StackEvent) => void;

/**
 * ModalStackManager - Manages the stack of active modals
 *
 * Responsibilities:
 * - Track order of modal presentation
 * - Calculate z-index values for proper layering
 * - Provide stack-aware utilities (isTop, position, etc.)
 * - Emit events for stack changes
 */
export class ModalStackManager {
  private stack: ModalStackEntry[] = [];
  private readonly baseZIndex: number;
  private readonly zIndexIncrement: number;
  private changeListeners: Set<StackChangeListener> = new Set();
  private eventListeners: Map<StackEventType, Set<StackEventListener>> =
    new Map();

  constructor(baseZIndex = 1000, zIndexIncrement = 10) {
    this.baseZIndex = baseZIndex;
    this.zIndexIncrement = zIndexIncrement;
  }

  /**
   * Push a modal onto the stack
   * @param id - Modal identifier (auto-generated if not provided)
   * @param priority - Priority level for ordering (higher = on top of same-level modals)
   * @returns The z-index assigned to this modal
   */
  push(id?: ModalId, priority = 0): { id: ModalId; zIndex: number } {
    const modalId = id ?? generateId();
    const previousTopId = this.getTopModal();

    const zIndex = this.calculateZIndex(priority);

    const entry: ModalStackEntry = {
      id: modalId,
      zIndex,
      priority,
      timestamp: Date.now(),
    };

    // Insert at correct position based on priority
    const insertIndex = this.findInsertIndex(priority);
    this.stack.splice(insertIndex, 0, entry);

    // Emit events
    this.emitEvent({
      type: 'modal:pushed',
      modalId,
      timestamp: Date.now(),
    });

    const newTopId = this.getTopModal();
    if (previousTopId !== newTopId) {
      this.emitEvent({
        type: 'top:changed',
        previousTopId,
        newTopId,
        timestamp: Date.now(),
      });
    }

    this.notifyChangeListeners();

    return { id: modalId, zIndex };
  }

  /**
   * Remove a modal from the stack
   * @param id - Modal identifier
   * @returns true if modal was found and removed
   */
  pop(id: ModalId): boolean {
    const index = this.stack.findIndex((entry) => entry.id === id);
    if (index === -1) return false;

    const previousTopId = this.getTopModal();

    this.stack.splice(index, 1);

    // Emit events
    this.emitEvent({
      type: 'modal:popped',
      modalId: id,
      timestamp: Date.now(),
    });

    const newTopId = this.getTopModal();
    if (previousTopId !== newTopId) {
      this.emitEvent({
        type: 'top:changed',
        previousTopId,
        newTopId,
        timestamp: Date.now(),
      });
    }

    this.notifyChangeListeners();

    return true;
  }

  /**
   * Get the topmost modal ID
   */
  getTopModal(): ModalId | null {
    if (this.stack.length === 0) return null;
    return this.stack[this.stack.length - 1]?.id ?? null;
  }

  /**
   * Check if a modal is the topmost
   */
  isTopModal(id: ModalId): boolean {
    return this.getTopModal() === id;
  }

  /**
   * Get the stack position of a modal (0 = bottom)
   */
  getStackPosition(id: ModalId): number {
    return this.stack.findIndex((entry) => entry.id === id);
  }

  /**
   * Get the z-index for a specific modal
   */
  getZIndex(id: ModalId): number | null {
    const entry = this.stack.find((e) => e.id === id);
    return entry?.zIndex ?? null;
  }

  /**
   * Get a read-only copy of the current stack
   */
  getStack(): ReadonlyArray<ModalStackEntry> {
    return [...this.stack];
  }

  /**
   * Get the number of modals in the stack
   */
  getStackSize(): number {
    return this.stack.length;
  }

  /**
   * Check if the stack is empty
   */
  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  /**
   * Check if a modal is in the stack
   */
  has(id: ModalId): boolean {
    return this.stack.some((entry) => entry.id === id);
  }

  /**
   * Close all modals and clear the stack
   * @returns Array of modal IDs that were closed
   */
  closeAll(): ModalId[] {
    const closedIds = this.stack.map((entry) => entry.id);
    const previousTopId = this.getTopModal();

    this.stack = [];

    this.emitEvent({
      type: 'stack:cleared',
      timestamp: Date.now(),
    });

    if (previousTopId !== null) {
      this.emitEvent({
        type: 'top:changed',
        previousTopId,
        newTopId: null,
        timestamp: Date.now(),
      });
    }

    this.notifyChangeListeners();

    return closedIds;
  }

  /**
   * Close the top N modals
   * @param count - Number of modals to close from the top
   * @returns Array of modal IDs that were closed
   */
  closeTop(count = 1): ModalId[] {
    const closedIds: ModalId[] = [];

    for (let i = 0; i < count && this.stack.length > 0; i++) {
      const entry = this.stack.pop();
      if (entry) {
        closedIds.push(entry.id);
        this.emitEvent({
          type: 'modal:popped',
          modalId: entry.id,
          timestamp: Date.now(),
        });
      }
    }

    if (closedIds.length > 0) {
      this.notifyChangeListeners();
    }

    return closedIds;
  }

  /**
   * Subscribe to all stack changes
   * @param listener - Callback function
   * @returns Unsubscribe function
   */
  subscribe(listener: StackChangeListener): () => void {
    this.changeListeners.add(listener);
    return () => {
      this.changeListeners.delete(listener);
    };
  }

  /**
   * Subscribe to specific stack events
   * @param eventType - Event type to listen for
   * @param listener - Callback function
   * @returns Unsubscribe function
   */
  on(eventType: StackEventType, listener: StackEventListener): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(listener);
    return () => {
      this.eventListeners.get(eventType)?.delete(listener);
    };
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    this.changeListeners.clear();
    this.eventListeners.clear();
  }

  /**
   * Calculate z-index for a modal based on stack position and priority
   */
  private calculateZIndex(priority: number): number {
    const stackIndex = this.stack.length;
    return (
      this.baseZIndex +
      stackIndex * this.zIndexIncrement +
      priority * 100
    );
  }

  /**
   * Find the correct insert index based on priority
   * Modals with same priority are ordered by timestamp (FIFO)
   */
  private findInsertIndex(priority: number): number {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if ((this.stack[i]?.priority ?? 0) <= priority) {
        return i + 1;
      }
    }
    return 0;
  }

  /**
   * Notify all change listeners
   */
  private notifyChangeListeners(): void {
    this.changeListeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.error(
          '[ModalStackManager] Error in change listener:',
          error
        );
      }
    });
  }

  /**
   * Emit a stack event
   */
  private emitEvent(event: StackEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(
            `[ModalStackManager] Error in ${event.type} listener:`,
            error
          );
        }
      });
    }
  }
}
