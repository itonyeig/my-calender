import React from 'react';
import { Modal } from './Modal';
import LabelCreationForm from './LabelCreationForm';

interface LabelCreationModalProps {
  onClose: () => void;
}

export const LabelCreationModal: React.FC<LabelCreationModalProps> = ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <h2>Create a New Label</h2>
      <LabelCreationForm onClose={onClose} />
    </Modal>
  );
};
