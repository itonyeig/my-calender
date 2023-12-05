import React, { useState, useContext } from 'react';
import { LabelContext, useLabels } from '../contexts/LabelContext'; // Adjust the import path as needed
import styled from '@emotion/styled';
import { generateUniqueId } from '../utils/helper';
import { Label } from '../interfaces/Label';

const LabelManagerContainer = styled.div`
  padding: 1em;
  background-color: #f3f3f3;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 1em;
`;

const LabelInput = styled.input`
  padding: 0.5em;
  margin-right: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const LabelColorPicker = styled.input`
  width: 40px;
  height: 40px;
  border: none;
  margin-right: 0.5em;
  cursor: pointer;
`;

const LabelButton = styled.button`
  padding: 0.5em 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;


const LabelManager: React.FC = () => {
    const { createLabel } = useLabels();
    const [newLabel, setNewLabel] = useState({ name: '', color: '#FFFFFF' });

    
  
    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log('selected color ', event.target.value)
      setNewLabel({ ...newLabel, color: event.target.value });
    };
  
    const handleCreateLabel = () => {
      createLabel(newLabel);
      setNewLabel({ name: '', color: '#FFFFFF' }); // Reset the form after creating the label
    };
  
  
    // const handleUpdateLabel = (id: string, updatedFields: Partial<Omit<Label, 'id'>>) => {
    //     updateLabel(id, { ...updatedFields } as Omit<Label, 'id'>);

    //   };
      
  
    // const handleDeleteLabel = (id: string) => {
    //   deleteLabel(id);
    // };
  
    return (
      <LabelManagerContainer>
        <h2>Manage Labels</h2>
        <div>
          <LabelInput
            type="text"
            placeholder="Label name"
            value={newLabel.name}
            onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
          />
          <LabelInput
            type="color"
            value={newLabel.color}
            onChange={handleColorChange}

          />
          <LabelButton onClick={handleCreateLabel}>Create Label</LabelButton>
        </div>
        {/* {labels.map((label) => (
          <div key={label.id}>
            <LabelInput
              type="text"
              value={label.name}
              onChange={(e) => handleUpdateLabel(label.id, { name: e.target.value })}
            />
            <LabelInput
              type="color"
              value={label.color}
              onChange={(e) => handleUpdateLabel(label.id, { color: e.target.value })}
            />
            <LabelButton onClick={() => handleDeleteLabel(label.id)}>Delete</LabelButton>
          </div>
        ))} */}
      </LabelManagerContainer>
    );
  };
  

export default LabelManager;
