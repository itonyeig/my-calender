import React, { createContext, useContext } from 'react';
import { Label } from '../interfaces/Label';

interface LabelContextProps {
  labels: Label[];
  createLabel: (label: Omit<Label, 'id'>) => void;
  updateLabel: (id: string, updatedLabel: Omit<Label, 'id'>) => void;
  deleteLabel: (id: string) => void;
}

export const LabelContext = createContext<LabelContextProps | undefined>(undefined);

export const useLabels = () => {
  const context = useContext(LabelContext);
  if (!context) throw new Error('useLabels must be used within a LabelProvider');
  return context;
};
