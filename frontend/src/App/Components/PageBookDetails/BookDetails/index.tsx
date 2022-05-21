import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCheckBookIn,
  useCheckOutBook,
  useDeleteBook,
  useFetchBook,
} from "../../../services";
import ActivityTable from "./ActivityTable";
import BookSummary from "./BookSummary";
import BookActionsMenu from "./BookActionsMenu";
import ConfirmDeletionModal from "./ConfirmDeletionModal";

interface Props {
  bookId: number;
  handleEdit: () => void;
}

const BookDetails = (props: Props) => {
  const { bookId, handleEdit } = props;
  const { data: book } = useFetchBook(bookId);

  const navigate = useNavigate();

  const checkInBook = useCheckBookIn(bookId);
  const checkOutBook = useCheckOutBook(bookId);
  const deleteBook = useDeleteBook(bookId);

  const [modalIsOpen, setModalisOpen] = useState(false);
  const handleDeleteBook = async () => {
    deleteBook.mutate();
    setModalisOpen(false);
    navigate("/");
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container rowSpacing={4}>
          <Grid item xs={6}>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
          </Grid>

          <Grid item container justifyContent="end" xs={6}>
            <BookActionsMenu
              checkButtonText={book?.on_site ? "Check Out" : "Check In"}
              onCheck={book?.on_site ? checkOutBook.mutate : checkInBook.mutate}
              onDelete={() => setModalisOpen(true)}
              onEdit={() => handleEdit()}
            />
          </Grid>

          <Grid item container xs={12}>
            <BookSummary {...book} />
          </Grid>

          <Grid item xs={12}>
            <ActivityTable bookId={bookId} />
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
