/**
 * Tests for modalReducer
 */

import {
  modalReducer,
  initialModalState,
  modalActions,
} from '../../src/core/modalReducer';
import type { ModalStateShape, ActiveModal } from '../../src/types';

describe('modalReducer', () => {
  const createMockModal = (id: string, zIndex: number = 1000): ActiveModal => ({
    id,
    zIndex,
    component: () => null,
    props: {},
    state: 'entering',
    config: {},
  });

  describe('SHOW_MODAL', () => {
    it('should add a modal to the state', () => {
      const modal = createMockModal('modal-1');
      const action = modalActions.showModal(modal);

      const state = modalReducer(initialModalState, action);

      expect(state.activeModals).toHaveLength(1);
      expect(state.activeModals[0]?.id).toBe('modal-1');
      expect(state.isAnyModalVisible).toBe(true);
      expect(state.topModalId).toBe('modal-1');
    });

    it('should sort modals by z-index', () => {
      let state = initialModalState;

      state = modalReducer(state, modalActions.showModal(createMockModal('modal-1', 1000)));
      state = modalReducer(state, modalActions.showModal(createMockModal('modal-2', 1020)));
      state = modalReducer(state, modalActions.showModal(createMockModal('modal-3', 1010)));

      expect(state.activeModals.map((m) => m.id)).toEqual([
        'modal-1',
        'modal-3',
        'modal-2',
      ]);
      expect(state.topModalId).toBe('modal-2');
    });

    it('should update existing modal if already present', () => {
      const modal = createMockModal('modal-1');
      let state = modalReducer(initialModalState, modalActions.showModal(modal));

      const updatedModal = { ...modal, props: { title: 'Updated' } };
      state = modalReducer(state, modalActions.showModal(updatedModal));

      expect(state.activeModals).toHaveLength(1);
      expect(state.activeModals[0]?.props).toEqual({ title: 'Updated' });
    });
  });

  describe('HIDE_MODAL', () => {
    it('should mark a modal as exiting', () => {
      const modal = createMockModal('modal-1');
      let state = modalReducer(initialModalState, modalActions.showModal(modal));

      state = modalReducer(state, modalActions.hideModal('modal-1'));

      expect(state.activeModals[0]?.state).toBe('exiting');
    });

    it('should not change state if modal not found', () => {
      const modal = createMockModal('modal-1');
      let state = modalReducer(initialModalState, modalActions.showModal(modal));

      state = modalReducer(state, modalActions.hideModal('nonexistent'));

      expect(state.activeModals[0]?.state).toBe('entering');
    });
  });

  describe('REMOVE_MODAL', () => {
    it('should remove a modal from state', () => {
      const modal = createMockModal('modal-1');
      let state = modalReducer(initialModalState, modalActions.showModal(modal));

      state = modalReducer(state, modalActions.removeModal('modal-1'));

      expect(state.activeModals).toHaveLength(0);
      expect(state.isAnyModalVisible).toBe(false);
      expect(state.topModalId).toBeNull();
    });

    it('should update topModalId when removing top modal', () => {
      let state = initialModalState;
      state = modalReducer(state, modalActions.showModal(createMockModal('modal-1', 1000)));
      state = modalReducer(state, modalActions.showModal(createMockModal('modal-2', 1010)));

      state = modalReducer(state, modalActions.removeModal('modal-2'));

      expect(state.topModalId).toBe('modal-1');
    });
  });

  describe('UPDATE_MODAL_STATE', () => {
    it('should update modal lifecycle state', () => {
      const modal = createMockModal('modal-1');
      let state = modalReducer(initialModalState, modalActions.showModal(modal));

      state = modalReducer(state, modalActions.updateModalState('modal-1', 'visible'));

      expect(state.activeModals[0]?.state).toBe('visible');
    });
  });

  describe('UPDATE_MODAL_PROPS', () => {
    it('should merge new props with existing props', () => {
      const modal = { ...createMockModal('modal-1'), props: { a: 1, b: 2 } };
      let state = modalReducer(initialModalState, modalActions.showModal(modal));

      state = modalReducer(
        state,
        modalActions.updateModalProps('modal-1', { b: 3, c: 4 })
      );

      expect(state.activeModals[0]?.props).toEqual({ a: 1, b: 3, c: 4 });
    });
  });
});
