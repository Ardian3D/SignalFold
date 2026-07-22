import React from 'react';
import { Dialog } from './Dialog';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Modal compatibility wrapper around canonical Dialog
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title = '',
  description,
  children,
  footer,
  size = 'md',
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      footer={footer}
      maxWidth={size}
    >
      {children}
    </Dialog>
  );
};
