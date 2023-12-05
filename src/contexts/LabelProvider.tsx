import React, { FC, ReactNode, useState, useEffect } from 'react';
import { LabelContext } from './LabelContext';
import { Label } from '../interfaces/Label';
import { generateUniqueId } from '../utils/helper';

export const LabelProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [labels, setLabels] = useState<Label[]>(() => {
    const localData = localStorage.getItem('labels');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('labels', JSON.stringify(labels));
  }, [labels]);

  const createLabel = (newLabel: Omit<Label, 'id'>) => {
    setLabels(prevLabels => [...prevLabels, { ...newLabel, id: generateUniqueId() }]);
  };

  const updateLabel = (id: string, updatedLabel: Omit<Label, 'id'>) => {
    setLabels(prevLabels =>
      prevLabels.map(label => (label.id === id ? { ...label, ...updatedLabel } : label))
    );
  };

  const deleteLabel = (id: string) => {
    setLabels(prevLabels => prevLabels.filter(label => label.id !== id));
  };

  return (
    <LabelContext.Provider value={{ labels, createLabel, updateLabel, deleteLabel }}>
      {children}
    </LabelContext.Provider>
  );
};
