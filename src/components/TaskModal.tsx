import React from 'react';
import { Formik, Form, Field } from 'formik';
import { taskSchema } from '../validation/taskSchema';
import { Task } from '../interfaces/Task';

interface TaskModalProps {
  task: Task | null; // Pass null for new task creation
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
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
    </div>
  );
};

export default TaskModal;
