import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';
import { useLabels } from '../contexts/LabelContext';

interface LabelCreationFormProps {
  onClose: () => void;
}

interface StyledColorPickerProps {
  value: string; // Assuming value is a hex color string
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin: 16px;
`;

const StyledInput = styled.input`
  padding: 10px 15px;
  margin-bottom: 15px;
  border: 2px solid #e2e2e2;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    border-color: #FFC436;
    outline: none;
  }
`;

const StyledColorPickerLabel = styled.label`
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
`;

const StyledColorPickerContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const StyledColorPicker = styled(StyledInput)<StyledColorPickerProps>`
  width: 50px;
  height: 50px;
  padding: 0;
  background: ${(props) => props.value};
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: none;
  }
`;

const StyledButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #FFC436;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e6b12e;
  }
`;

const StyledError = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

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
      onClose();
    },
  });

  return (
    <StyledForm onSubmit={formik.handleSubmit}>
      <StyledInput
        id="name"
        name="name"
        type="text"
        placeholder="Label name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.name}
      />
      {formik.touched.name && formik.errors.name && <StyledError>{formik.errors.name}</StyledError>}

      <StyledColorPickerLabel htmlFor="color">Pick label color</StyledColorPickerLabel>
      <StyledColorPickerContainer>
        <StyledColorPicker
          id="color"
          name="color"
          type="color"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.color}
        />
      </StyledColorPickerContainer>
      {formik.touched.color && formik.errors.color && <StyledError>{formik.errors.color}</StyledError>}

      <StyledButton type="submit">Create Label</StyledButton>
    </StyledForm>
  );
};


export default LabelCreationForm;
