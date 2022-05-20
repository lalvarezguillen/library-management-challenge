import { Button, Grid } from '@mui/material';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkBookIn, checkBookOut, deleteBook, fetchBook, fetchBookActivity, updateBook } from '../../api';
import { BookWritable, Book } from '../../types';
import { BookForm } from '../Common/BookForm';
import ActivityTable from './ActivityTable';
import BookSummary from './BookSummary';
import BookActionsMenu from './BookActionsMenu';
import ConfirmDeletionModal from './ConfirmDeletionModal';

const intialValues = {
  pk: 0,
  isbn: '',
  title: '',
  author: '',
  description: '',
  on_site: true,
};

const BookDetails = () => {
  const { pk } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book>(intialValues);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [activity, setActivity] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1)

  // TODO: clean up this hack
  const bookId = parseInt(pk || '1');

  const getActivityPage = async (page: number) => {
    const params = {
      page: page,
    };
    const resp = await fetchBookActivity(bookId, params);
    setActivity(resp.data.results);
    setTotalItems(resp.data.count);
    setPage(page);
  }

  const getBook = async (bookId: number) => {
    try {
      const bookResp = await fetchBook(bookId);
      setBook(bookResp.data);
    } catch (e) {
      console.error(e);
    }
  }

  const checkBookButtonText = book.on_site
    ? "Check Out"
    : "Check In"

  const checkBook = async () => {
    const resp = book.on_site
      ? await checkBookOut(bookId)
      : await checkBookIn(bookId);

    setBook(resp.data);

    await getActivityPage(1);
  }


  const [modalIsOpen, setModalisOpen] = useState(false);
  const handleDeleteBook = async () => {
    const resp = await deleteBook(bookId);
    setModalisOpen(false);
    setBook(intialValues);
    navigate('/')
  }

  useEffect(() => {
    getActivityPage(1);
    getBook(bookId);
  }, [bookId]);

  const handleOnSubmit = async (
    values: BookWritable,
    { setSubmitting }: FormikHelpers<any>,
  ) => {
    setSubmitting(true);

    try {
      setErrors({})
      const resp = await updateBook(bookId, values);
      setBook(resp.data);
      setIsEditing(false);
    } catch (e) {
      if (e instanceof AxiosError) {
        setErrors(e.response?.data);
      }
    }
    setSubmitting(false);
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {
          isEditing
            ? (
              <BookForm
                onSubmit={handleOnSubmit}
                onCancel={() => setIsEditing(false)}
                values={book}
                buttonText="Save Changes"
                errors={errors}
                disabled={!isEditing}
              />)
            : (
              <Grid container rowSpacing={4}>
                <Grid item xs={6}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => navigate('/')}
                  >
                    Back
                  </Button>
                </Grid>

                <Grid item container justifyContent="end" xs={6}>
                  <BookActionsMenu
                    onCheck={checkBook}
                    onDelete={() => setModalisOpen(true)}
                    onEdit={() => setIsEditing(true)}
                  />
                </Grid>

                <Grid item container xs={12}>
                  <BookSummary
                    {...book}
                  />
                </Grid>

                <Grid item xs={12}>
                  <ActivityTable
                    activity={activity}
                    totalItems={totalItems}
                    page={page}
                    onPageChange={getActivityPage}
                  />
                </Grid>
                <ConfirmDeletionModal
                  isOpen={modalIsOpen}
                  onConfirm={handleDeleteBook}
                  onCancel={() => setModalisOpen(false)}
                />
              </Grid>
            )
        }
      </Grid>
    </Grid>
  );
};

export default BookDetails;
