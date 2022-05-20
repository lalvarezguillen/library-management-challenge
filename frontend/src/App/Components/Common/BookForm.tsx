import { Formik, Form, Field, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';

import Grid from '@mui/material/Grid';
import { Button, LinearProgress, Alert, Typography } from '@mui/material';

import { BookWritable } from '../../types';

import { styled } from '@mui/material/styles';

export interface BookErrors {
  isbn?: string[];
  title?: string[];
  description?: string[];
  author?: string[];
  /**
   * Django Rest Framwork provides this error field
   * when the error is not tied to a particular field.
   * It's snake-cased from the backend, hence the
   * inconsistent casing. 
   */
  non_field_errors?: string[];
}

interface Params {
  values: BookWritable;
  buttonText: string;
  onSubmit: ((values: BookWritable, formikHelpers: FormikHelpers<BookWritable>) => void | Promise<any>);
  onCancel: () => void;
  errors?: BookErrors;
  disabled?: Boolean;
}

export const BookForm = (params: Params) => {
  const { values, onSubmit, onCancel, errors, disabled, buttonText } = params;
  return (
    <Formik
      initialValues={values}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Grid container direction="column" spacing={2}>

            {
              !disabled && (
                <Grid item>
                  <Grid container>
                    <Grid item xs={12}>
                      {isSubmitting && <LinearProgress />}
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={onCancel}
                      >
                        Back
                      </Button>
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item container xs={3} direction="row-reverse">
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                      >
                        {buttonText}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )
            }

            <Grid item>
              <StyledField
                component={TextField}
                name="isbn"
                type="text"
                label="ISBN"
                disabled={disabled}
                error={!!errors?.isbn}
                helperText={errors?.isbn}
              />
            </Grid>

            <Grid item>
              <StyledField component={TextField}
                name="title"
                type="text"
                label="Title"
                disabled={disabled}
                error={!!errors?.title}
                helperText={errors?.title}
              />
            </Grid>

            <Grid item>
              <StyledField
                component={TextField}
                name="author"
                type="text"
                label="Author"
                disabled={disabled}
                error={!!errors?.author}
                helperText={errors?.author}
              />
            </Grid>

            <Grid item>
              <StyledField
                component={TextField}
                name="description"
                type="text"
                label="Description"
                disabled={disabled}
                multiline
                rows={8}
                error={!!errors?.description}
                helperText={errors?.description}
              />
            </Grid>

            <Grid item>
              {errors?.non_field_errors && <Typography color="error">{errors.non_field_errors}</Typography>}
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}

const StyledField = styled(Field)`
  && {
    width: 100%;
  }
`;

const Feeback = styled(Alert)`
  && {
    margin-top: 5px;
  }
`