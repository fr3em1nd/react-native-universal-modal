/**
 * Tests for ModalStackManager
 */

import { ModalStackManager } from '../../src/core/ModalStackManager';

describe('ModalStackManager', () => {
  let stackManager: ModalStackManager;

  beforeEach(() => {
    stackManager = new ModalStackManager(1000, 10);
  });

  afterEach(() => {
    stackManager.removeAllListeners();
  });

  describe('push', () => {
    it('should add a modal to the stack', () => {
      const { id, zIndex } = stackManager.push('modal-1');

      expect(id).toBe('modal-1');
      expect(zIndex).toBe(1000);
      expect(stackManager.getStackSize()).toBe(1);
    });

    it('should generate ID if not provided', () => {
      const { id } = stackManager.push();

      expect(id).toMatch(/^modal_\d+_/);
    });

    it('should increment z-index for each modal', () => {
      stackManager.push('modal-1');
      const { zIndex } = stackManager.push('modal-2');

      expect(zIndex).toBe(1010);
    });

    it('should respect priority ordering', () => {
      stackManager.push('modal-1', 0);
      stackManager.push('modal-2', 10);
      stackManager.push('modal-3', 5);

      expect(stackManager.getTopModal()).toBe('modal-2');
    });
  });

  describe('pop', () => {
    it('should remove a modal from the stack', () => {
      stackManager.push('modal-1');

      const removed = stackManager.pop('modal-1');

      expect(removed).toBe(true);
      expect(stackManager.isEmpty()).toBe(true);
    });

    it('should return false if modal not found', () => {
      const removed = stackManager.pop('nonexistent');

      expect(removed).toBe(false);
    });
  });

  describe('getTopModal', () => {
    it('should return the topmost modal', () => {
      stackManager.push('modal-1');
      stackManager.push('modal-2');

      expect(stackManager.getTopModal()).toBe('modal-2');
    });

    it('should return null when stack is empty', () => {
      expect(stackManager.getTopModal()).toBeNull();
    });
  });

  describe('isTopModal', () => {
    it('should return true for topmost modal', () => {
      stackManager.push('modal-1');
      stackManager.push('modal-2');

      expect(stackManager.isTopModal('modal-2')).toBe(true);
      expect(stackManager.isTopModal('modal-1')).toBe(false);
    });
  });

  describe('closeAll', () => {
    it('should remove all modals', () => {
      stackManager.push('modal-1');
      stackManager.push('modal-2');
      stackManager.push('modal-3');

      const closed = stackManager.closeAll();

      expect(closed).toEqual(['modal-1', 'modal-2', 'modal-3']);
      expect(stackManager.isEmpty()).toBe(true);
    });
  });

  describe('closeTop', () => {
    it('should close the specified number of top modals', () => {
      stackManager.push('modal-1');
      stackManager.push('modal-2');
      stackManager.push('modal-3');

      const closed = stackManager.closeTop(2);

      expect(closed).toEqual(['modal-3', 'modal-2']);
      expect(stackManager.getStackSize()).toBe(1);
      expect(stackManager.getTopModal()).toBe('modal-1');
    });
  });

  describe('subscribe', () => {
    it('should notify listeners on stack changes', () => {
      const listener = jest.fn();
      stackManager.subscribe(listener);

      stackManager.push('modal-1');

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should allow unsubscribing', () => {
      const listener = jest.fn();
      const unsubscribe = stackManager.subscribe(listener);

      unsubscribe();
      stackManager.push('modal-1');

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('event listeners', () => {
    it('should emit modal:pushed event', () => {
      const listener = jest.fn();
      stackManager.on('modal:pushed', listener);

      stackManager.push('modal-1');

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'modal:pushed',
          modalId: 'modal-1',
        })
      );
    });

    it('should emit modal:popped event', () => {
      const listener = jest.fn();
      stackManager.on('modal:popped', listener);

      stackManager.push('modal-1');
      stackManager.pop('modal-1');

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'modal:popped',
          modalId: 'modal-1',
        })
      );
    });

    it('should emit top:changed event', () => {
      const listener = jest.fn();
      stackManager.on('top:changed', listener);

      stackManager.push('modal-1');

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'top:changed',
          previousTopId: null,
          newTopId: 'modal-1',
        })
      );
    });
  });
});
