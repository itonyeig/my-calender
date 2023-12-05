import * as Yup from 'yup';

export const taskSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  labelIds: Yup.array().of(Yup.string()),
  date: Yup.date().required('Date is required'),
});
