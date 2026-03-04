import type {
  ModalStateShape,
  ModalAction,
  ActiveModal,
  ModalState,
} from '../types';

/**
 * Initial modal state
 */
export const initialModalState: ModalStateShape = {
  activeModals: [],
  isAnyModalVisible: false,
  topModalId: null,
};

/**
 * Modal state reducer
 *
 * Handles all modal state transitions:
 * - SHOW_MODAL: Add a new modal to the stack
 * - HIDE_MODAL: Mark a modal as exiting (start exit animation)
 * - REMOVE_MODAL: Actually remove the modal from state (after animation)
 * - UPDATE_MODAL_STATE: Update a modal's lifecycle state
 * - UPDATE_MODAL_PROPS: Update a modal's props
 */
export function modalReducer(
  state: ModalStateShape,
  action: ModalAction
): ModalStateShape {
  switch (action.type) {
    case 'SHOW_MODAL': {
      const { id, zIndex, component, props, config, state: modalState } = action.payload;

      // Check if modal already exists
      const existingIndex = state.activeModals.findIndex((m) => m.id === id);
      if (existingIndex !== -1) {
        // Update existing modal instead of adding
        const updatedModals = [...state.activeModals];
        updatedModals[existingIndex] = {
          ...updatedModals[existingIndex]!,
          props,
          state: 'entering',
        };
        return {
          ...state,
          activeModals: updatedModals,
        };
      }

      const newModal: ActiveModal = {
        id,
        zIndex,
        component,
        props,
        config: config ?? {},
        state: modalState ?? 'entering',
      };

      // Insert and sort by z-index
      const activeModals = [...state.activeModals, newModal].sort(
        (a, b) => a.zIndex - b.zIndex
      );

      return {
        ...state,
        activeModals,
        isAnyModalVisible: true,
        topModalId: activeModals[activeModals.length - 1]?.id ?? null,
      };
    }

    case 'HIDE_MODAL': {
      const { id } = action.payload;
      const modalIndex = state.activeModals.findIndex((m) => m.id === id);

      if (modalIndex === -1) {
        return state;
      }

      // Mark as exiting - don't remove yet (wait for animation)
      const updatedModals = [...state.activeModals];
      const modal = updatedModals[modalIndex];
      if (modal) {
        updatedModals[modalIndex] = {
          ...modal,
          state: 'exiting' as ModalState,
        };
      }

      return {
        ...state,
        activeModals: updatedModals,
      };
    }

    case 'REMOVE_MODAL': {
      const { id } = action.payload;
      const activeModals = state.activeModals.filter((m) => m.id !== id);

      return {
        ...state,
        activeModals,
        isAnyModalVisible: activeModals.length > 0,
        topModalId: activeModals[activeModals.length - 1]?.id ?? null,
      };
    }

    case 'UPDATE_MODAL_STATE': {
      const { id, state: newModalState } = action.payload;
      const modalIndex = state.activeModals.findIndex((m) => m.id === id);

      if (modalIndex === -1) {
        return state;
      }

      const updatedModals = [...state.activeModals];
      const modal = updatedModals[modalIndex];
      if (modal) {
        updatedModals[modalIndex] = {
          ...modal,
          state: newModalState,
        };
      }

      return {
        ...state,
        activeModals: updatedModals,
      };
    }

    case 'UPDATE_MODAL_PROPS': {
      const { id, props } = action.payload;
      const modalIndex = state.activeModals.findIndex((m) => m.id === id);

      if (modalIndex === -1) {
        return state;
      }

      const updatedModals = [...state.activeModals];
      const modal = updatedModals[modalIndex];
      if (modal) {
        updatedModals[modalIndex] = {
          ...modal,
          props: { ...modal.props, ...props },
        };
      }

      return {
        ...state,
        activeModals: updatedModals,
      };
    }

    default:
      return state;
  }
}

/**
 * Action creators for type-safe dispatch
 */
export const modalActions = {
  showModal: (payload: ActiveModal): ModalAction => ({
    type: 'SHOW_MODAL',
    payload,
  }),

  hideModal: (id: string): ModalAction => ({
    type: 'HIDE_MODAL',
    payload: { id },
  }),

  removeModal: (id: string): ModalAction => ({
    type: 'REMOVE_MODAL',
    payload: { id },
  }),

  updateModalState: (id: string, state: ModalState): ModalAction => ({
    type: 'UPDATE_MODAL_STATE',
    payload: { id, state },
  }),

  updateModalProps: (
    id: string,
    props: Record<string, unknown>
  ): ModalAction => ({
    type: 'UPDATE_MODAL_PROPS',
    payload: { id, props },
  }),
};
