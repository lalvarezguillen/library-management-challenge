import { AxiosError } from "axios";
import { FormikHelpers } from "formik";
import { useFetchBook, useUpdateBook } from "../../../services";
import { BookWritable } from "../../../types";
import { BookForm } from "../../Common/BookForm";

interface Props {
  bookId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const BookEdit = (props: Props) => {
  const { bookId, onCancel, onSuccess } = props;

  const { data: book } = useFetchBook(bookId);
  const mutation = useUpdateBook(bookId);

  const handleOnSubmit = async (
    updatedBook: BookWritable,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    setSubmitting(true);
    mutation.mutate(updatedBook);
    setSubmitting(false);
  };

  if (mutation.isSuccess) {
    onSuccess();
  }

  return (
    <BookForm
      onSubmit={handleOnSubmit}
      onCancel={onCancel}
      values={book}
      buttonText="Save Changes"
      errors={
        mutation.error instanceof AxiosError
          ? mutation.error?.response?.data
          : {}
      }
    />
  );
};

export default BookEdit;
