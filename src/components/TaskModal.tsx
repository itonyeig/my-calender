import React from 'react';
import { Formik, Form, Field } from 'formik';
import { taskSchema } from '../validation/taskSchema';
import { Task } from '../interfaces/Task';
import styled from '@emotion/styled';

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
  z-index: 1000; // High z-index to ensure it's on top of other elements
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <Formik
          initialValues={task || { id: '', title: '', description: '', labels: [], date: '' }}
          validationSchema={taskSchema}
          onSubmit={(values, actions) => {
            onSave(values);
            actions.setSubmitting(false);
            onClose();
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field name="title" type="text" placeholder="Title" />
              {errors.title && touched.title ? <div>{errors.title}</div> : null}

              <Field name="description" as="textarea" placeholder="Description" />
              
              {/* Label and date fields go here */}
              
              <button type="submit">Save Task</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TaskModal;
