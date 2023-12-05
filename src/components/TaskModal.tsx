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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
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
            onSave(values as Task); // Ensure values are cast to Task type
            actions.setSubmitting(false);
            onClose();
          }}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <Field name="title" type="text" placeholder="Title" />
              {errors.title && touched.title ? <div>{errors.title}</div> : null}

              <Field name="description" as="textarea" placeholder="Description" />

              {/* Label Selection */}
              <div>
                {labels.map((label: Label) => (
                  <label key={label.id}>
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
                  </label>
                ))}
              </div>
              
              <button type="submit">Save Task</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </Form>
          )}
        </Formik>
    </Modal>
  );
};

export default TaskModal;
