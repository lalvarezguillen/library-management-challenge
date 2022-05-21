import { Grid } from "@mui/material";
import { FormikHelpers } from "formik";
import { BookWritable } from "../../types";
import { BookForm } from "../Common/BookForm";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useCreateBook } from "../../services";

const intialValues = {
  isbn: "",
  title: "",
  author: "",
  description: "",
};

const BookCreate = () => {
  const navigate = useNavigate();
  const mutation = useCreateBook();

  const handleOnSubmit = async (
    book: BookWritable,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    setSubmitting(true);
    mutation.mutate(book);
    setSubmitting(false);
  };

  if (mutation.isSuccess) {
    const bookUrl = `/${mutation.data.pk}`;
    navigate(bookUrl);
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <BookForm
          onSubmit={handleOnSubmit}
          onCancel={() => navigate("/")}
          values={intialValues}
          buttonText="Save Book"
          errors={
            mutation.error instanceof AxiosError
              ? mutation.error?.response?.data
              : {}
          }
        />
      </Grid>
    </Grid>
  );
};

export default BookCreate;
