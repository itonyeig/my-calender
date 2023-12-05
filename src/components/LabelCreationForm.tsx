import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLabels } from '../contexts/LabelContext';

interface LabelCreationFormProps {
  onClose: () => void;
}

// Define the validation schema using Yup
const labelValidationSchema = Yup.object().shape({
  name: Yup.string().required('Label name is required'),
  color: Yup.string().required('Color is required'),
});

const LabelCreationForm: React.FC<LabelCreationFormProps> = ({ onClose }) => {
  const { createLabel } = useLabels();

  const formik = useFormik({
    initialValues: {
      name: '',
      color: '#ffffff',
    },
    validationSchema: labelValidationSchema,
    onSubmit: (values) => {
      createLabel({ name: values.name, color: values.color });
      formik.resetForm();
      onClose();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Label name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name ? (
          <div style={{ color: 'red' }}>{formik.errors.name}</div>
        ) : null}
      </div>
      <div>
        <input
          id="color"
          name="color"
          type="color"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.color}
        />
        {formik.touched.color && formik.errors.color ? (
          <div style={{ color: 'red' }}>{formik.errors.color}</div>
        ) : null}
      </div>
      <div>
        <button type="submit">Create Label</button>
      </div>
    </form>
  );
};

export default LabelCreationForm;
