import { useState } from 'react';

export function useConfirm() {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    onConfirm: null,
    onCancel: null
  });

  const confirm = ({
    title = 'Confirmation',
    message,
    type = 'danger',
    confirmText = 'Confirmer',
    cancelText = 'Annuler'
  }) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        type,
        confirmText,
        cancelText,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  const closeConfirm = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
    if (confirmState.onCancel) {
      confirmState.onCancel();
    }
  };

  return {
    confirm,
    confirmState,
    closeConfirm
  };
}
