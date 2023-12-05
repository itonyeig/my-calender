import React from 'react';
import styled from '@emotion/styled';

const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 1040;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalBox = styled.div`
  position: fixed;
  background: white;
  width: 50%;
  border-radius: 11px;
  padding: 2rem;
  z-index: 1050;
  max-height: 70vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow-y: auto;
`;

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <ModalBox>
        {children}
      </ModalBox>
    </>
  );
};
