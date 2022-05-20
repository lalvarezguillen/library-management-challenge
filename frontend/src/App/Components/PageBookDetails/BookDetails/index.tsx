import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkBookIn, checkBookOut, deleteBook, fetchBookActivity } from '../../../api';
import { Book } from '../../../types';
import ActivityTable from './ActivityTable';
import BookSummary from './BookSummary';
import BookActionsMenu from './BookActionsMenu';
import ConfirmDeletionModal from './ConfirmDeletionModal';


interface Props {
  book: Book;
  handleEdit: () => void;
  afterCheckOut: (b: Book) => void;
  afterDelete: () => void;
}

const BookDetails = (props: Props) => {
  const { book, afterCheckOut, afterDelete, handleEdit } = props;
  const navigate = useNavigate();

  const [activity, setActivity] = useState([]);
  const [totalItems, setTotalItems] = useState(book.pk);
  const [page, setPage] = useState(1)

  const getActivityPage = async (bookId: number, page: number) => {
    const params = {
      page: page,
    };
    const resp = await fetchBookActivity(bookId, params);
    setActivity(resp.data.results);
    setTotalItems(resp.data.count);
    setPage(page);
  }

  const checkBook = async () => {
    const resp = book.on_site
      ? await checkBookOut(book.pk)
      : await checkBookIn(book.pk);

    afterCheckOut(resp.data);

    await getActivityPage(book.pk, 1);
  }


  const [modalIsOpen, setModalisOpen] = useState(false);
  const handleDeleteBook = async () => {
    await deleteBook(book.pk);
    setModalisOpen(false);
    afterDelete();
    navigate('/')
  }

  useEffect(() => {
    book.pk && getActivityPage(book.pk, 1);
  }, [book]);

  return (
    <Grid container>
      <Grid item xs={12}>
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
              checkButtonText={book.on_site ? "Check Out" : "Check In"}
              onCheck={checkBook}
              onDelete={() => setModalisOpen(true)}
              onEdit={() => handleEdit()}
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
              onPageChange={(pageNum) => getActivityPage(book.pk, pageNum)}
            />
          </Grid>
          <ConfirmDeletionModal
            isOpen={modalIsOpen}
            onConfirm={handleDeleteBook}
            onCancel={() => setModalisOpen(false)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BookDetails;
