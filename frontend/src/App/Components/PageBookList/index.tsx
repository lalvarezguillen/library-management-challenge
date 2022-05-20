import { Grid, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../../api';
import BooksTable from './BooksTable';

const BooksList = () => {
  const navigate = useNavigate();
  const navigateToCreation = () => navigate('/new');

  const [page, setPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [booksCount, setBooksCount] = useState(0);

  useEffect(() => {
    const getBooks = async () => {
      const params = { page };
      const resp = await fetchBooks(params);
      setBooks(resp.data.results);
      setBooksCount(resp.data.count);
    }

    getBooks();
  }, [page])

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={10}></Grid>
      <Grid item container justifyContent="end" xs={2}>
        <Button
          color="primary"
          variant="contained"
          onClick={navigateToCreation}
        >
          Add Book
        </Button>
      </Grid>
      <Grid item xs={12}>
        <BooksTable
          books={books}
          totalItems={booksCount}
          onPageChange={(p) => setPage(p)}
        />
      </Grid>
    </Grid>
  );
};

export default BooksList;
