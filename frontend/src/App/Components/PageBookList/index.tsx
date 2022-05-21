import { Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BooksTable from './BooksTable';

const BooksList = () => {
  const navigate = useNavigate();

  return (
    <Grid container rowSpacing={4}>
      <Grid item xs={10}></Grid>
      <Grid item container justifyContent="end" xs={2}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => navigate('/new')}
        >
          Add Book
        </Button>
      </Grid>
      <Grid item xs={12}>
        <BooksTable />
      </Grid>
    </Grid>
  );
};

export default BooksList;
