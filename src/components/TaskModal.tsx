import React from 'react';
import { Formik, Form, Field } from 'formik';
import { taskSchema } from '../validation/taskSchema';
import { Task } from '../interfaces/Task';
import styled from '@emotion/styled';
import { useLabels } from '../contexts/LabelContext';
import { Label } from '../interfaces/Label';
import { Modal } from './Modal';


interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const StyledForm = styled(Form)`
  margin-left: 32px; 
  margin-right: 32px; 
  display: flex;
  flex-direction: column;
`;

const StyledField = styled(Field)`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #FFC436;
  border-radius: 4px;

`;

const StyledTextArea = styled(StyledField)`
  height: 100px;
  resize: vertical;
`;

const StyledCheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const StyledCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-right: 12px;
  cursor: pointer;

  // Custom styling for checkbox here if needed
  input[type="checkbox"] {
    margin-right: 4px;
  }
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  cursor: pointer;
  font-weight: bold;
  

  &:first-of-type {
    background-color: #FFC436;
    color: white;
    margin-left: 32px; 
  }

  &:last-of-type {
    background-color: #6c757d;
    color: white;
  }

  &:hover {
    opacity: 0.85;
  }
`;

const StyledErrorMessage = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-bottom: 8px;
`;


const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  const { labels } = useLabels();

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <Formik
          initialValues={task || { id: '', title: '', description: '', labelIds: [], date: '' }}
          validationSchema={taskSchema}
          onSubmit={(values, actions) => {
            onSave(values as Task);
            actions.setSubmitting(false);
            onClose();
          }}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <StyledForm>
              <StyledField name="title" type="text" placeholder="Title" />
            {errors.title && touched.title ? <StyledErrorMessage>{errors.title}</StyledErrorMessage> : null}
          
            <StyledTextArea name="description" as="textarea" placeholder="Description" />
          
            {/* Label Selection */}
            <StyledCheckboxContainer>
              {labels.map((label: Label) => (
                <StyledCheckboxLabel key={label.id}>
                  <input
                    type="checkbox"
                    name="labelIds"
                    value={label.id}
                    checked={values.labelIds.includes(label.id)}
                    onChange={() => {
                      const set = new Set(values.labelIds);
                      if (set.has(label.id)) {
                        set.delete(label.id);
                      } else {
                        set.add(label.id);
                      }
                      setFieldValue('labelIds', Array.from(set));
                    }}
                  />
                  {label.name}
                </StyledCheckboxLabel>
              ))}
            </StyledCheckboxContainer>
            
            
              </StyledForm>
              <StyledButton type="submit">Save Task</StyledButton>
            <StyledButton type="button" onClick={onClose}>Cancel</StyledButton>
          </Form>
          )}
        </Formik>
    </Modal>
  );
};

export default TaskModal;
