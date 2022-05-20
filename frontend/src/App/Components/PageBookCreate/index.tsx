import { Grid } from '@mui/material';
import { FormikHelpers } from 'formik';
import { BookWritable } from '../../types';
import { BookForm } from '../Common/BookForm';
import { createBook } from '../../api';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from "react-router-dom";

const intialValues = {
  isbn: '',
  title: '',
  author: '',
  description: '',
};


const BookCreate = () => {

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleOnSubmit = async (
    values: BookWritable,
    { setSubmitting }: FormikHelpers<any>,
  ) => {
    setSubmitting(true);

    try {
      const resp = await createBook(values);
      const bookUrl = `/${resp.data.pk}`;
      navigate(bookUrl);
    } catch (e) {
      if (e instanceof AxiosError) {
        setErrors(e.response?.data);
      }
    }
    setSubmitting(false);
  }

  const handleOnCancel = () => navigate('/')

  return (
    <Grid container>
      <Grid item xs={12}>
        <BookForm
          onSubmit={handleOnSubmit}
          onCancel={handleOnCancel}
          values={intialValues}
          buttonText="Save Book"
          errors={errors}
        />
      </Grid>
    </Grid>
  );
};

export default BookCreate;
