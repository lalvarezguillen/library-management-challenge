import { AxiosError } from "axios";
import { FormikHelpers } from "formik";
import { useState } from "react";
import { updateBook } from "../../../api";
import { Book, BookWritable } from "../../../types";
import { BookForm } from "../../Common/BookForm";


interface Props {
  book: Book;
  onSuccess: (b: Book) => void;
  onCancel: () => void;
}

const BookEdit = (props: Props) => {
  const { book, onSuccess, onCancel } = props;

  const [errors, setErrors] = useState({});

  const handleOnSubmit = async (
    values: BookWritable,
    { setSubmitting }: FormikHelpers<any>,
  ) => {
    setSubmitting(true);

    try {
      setErrors({})
      const resp = await updateBook(book.pk, values);
      onSuccess(resp.data);
    } catch (e) {
      if (e instanceof AxiosError) {
        setErrors(e.response?.data);
      }
    }
    setSubmitting(false);
  }

  return (
    <BookForm
      onSubmit={handleOnSubmit}
      onCancel={onCancel}
      values={book}
      buttonText="Save Changes"
      errors={errors}
    />)
}

export default BookEdit