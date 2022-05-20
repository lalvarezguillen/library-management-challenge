import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBook } from '../../api';
import { Book } from '../../types';
import BookEdit from './BookEdit';
import BookDetails from './BookDetails';

const nullBook = {
  pk: 0,
  isbn: '',
  title: '',
  author: '',
  description: '',
  // TODO: consistent casing
  on_site: true,
};

const PageBookDetails = () => {
  const { pk } = useParams();

  const [book, setBook] = useState<Book>(nullBook);
  const [isEditing, setIsEditing] = useState(false);

  // TODO: clean up this hack
  const bookId = parseInt(pk || '');

  const getBook = async (bookId: number) => {
    try {
      const bookResp = await fetchBook(bookId);
      setBook(bookResp.data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (bookId) getBook(bookId);
  }, [bookId]);

  const handleEditSuccess = (book: Book) => {
    setBook(book);
    setIsEditing(false);
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {
          isEditing
            ? (
              <BookEdit
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditing(false)}
                book={book}
              />)
            : (
              <BookDetails
                book={book}
                handleEdit={() => setIsEditing(true)}
                afterCheckOut={setBook}
                afterDelete={() => setBook(nullBook)}
              />
            )
        }
      </Grid>
    </Grid>
  );
};

export default PageBookDetails;
