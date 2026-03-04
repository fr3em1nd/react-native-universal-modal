/**
 * Tests for ModalRegistry
 */

import { ModalRegistry } from '../../src/core/ModalRegistry';
import { resetIdCounter } from '../../src/utils/generateId';

describe('ModalRegistry', () => {
  let registry: ModalRegistry;

  beforeEach(() => {
    registry = new ModalRegistry();
    resetIdCounter();
  });

  describe('register', () => {
    it('should register a modal and return an ID', () => {
      const Component = () => null;
      const id = registry.register(Component);

      expect(id).toMatch(/^registered_\d+_/);
      expect(registry.has(id)).toBe(true);
    });

    it('should store the component and config', () => {
      const Component = () => null;
      const config = { priority: 5 };
      const id = registry.register(Component, config);

      const entry = registry.get(id);

      expect(entry?.component).toBe(Component);
      expect(entry?.config).toEqual(config);
    });
  });

  describe('unregister', () => {
    it('should remove a registered modal', () => {
      const Component = () => null;
      const id = registry.register(Component);

      const removed = registry.unregister(id);

      expect(removed).toBe(true);
      expect(registry.has(id)).toBe(false);
    });

    it('should resolve pending promise with undefined', (done) => {
      const Component = () => null;
      const id = registry.register(Component);

      registry.setResolver(id, (result) => {
        expect(result).toBeUndefined();
        done();
      });

      registry.unregister(id);
    });
  });

  describe('updateProps', () => {
    it('should update modal props', () => {
      const Component = () => null;
      const id = registry.register(Component);

      registry.updateProps(id, { title: 'Hello' });

      const entry = registry.get(id);
      expect(entry?.props).toEqual({ title: 'Hello' });
    });

    it('should return false for unknown modal', () => {
      const result = registry.updateProps('unknown', { title: 'Hello' });

      expect(result).toBe(false);
    });
  });

  describe('resolve', () => {
    it('should call the resolver with the result', () => {
      const Component = () => null;
      const id = registry.register(Component);
      const resolver = jest.fn();

      registry.setResolver(id, resolver);
      registry.resolve(id, 'success');

      expect(resolver).toHaveBeenCalledWith('success');
    });

    it('should clear the resolver after calling', () => {
      const Component = () => null;
      const id = registry.register(Component);
      const resolver = jest.fn();

      registry.setResolver(id, resolver);
      registry.resolve(id, 'success');

      const entry = registry.get(id);
      expect(entry?.resolve).toBeNull();
    });
  });

  describe('clear', () => {
    it('should remove all registered modals', () => {
      const Component = () => null;
      registry.register(Component);
      registry.register(Component);

      registry.clear();

      expect(registry.size()).toBe(0);
    });

    it('should resolve all pending promises', () => {
      const Component = () => null;
      const resolver1 = jest.fn();
      const resolver2 = jest.fn();

      const id1 = registry.register(Component);
      const id2 = registry.register(Component);

      registry.setResolver(id1, resolver1);
      registry.setResolver(id2, resolver2);

      registry.clear();

      expect(resolver1).toHaveBeenCalledWith(undefined);
      expect(resolver2).toHaveBeenCalledWith(undefined);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = registry.generateId();
      const id2 = registry.generateId();

      expect(id1).not.toBe(id2);
    });
  });
});
