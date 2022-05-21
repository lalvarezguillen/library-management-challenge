import { Grid } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import BookEdit from "./BookEdit";
import BookDetails from "./BookDetails";

const PageBookDetails = () => {
  const { pk } = useParams();
  // TODO: clean up this hack
  const bookId = parseInt(pk || "");

  const [isEditing, setIsEditing] = useState(false);

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        {isEditing ? (
          <BookEdit
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditing(false)}
            bookId={bookId}
          />
        ) : (
          <BookDetails bookId={bookId} handleEdit={() => setIsEditing(true)} />
        )}
      </Grid>
    </Grid>
  );
};

export default PageBookDetails;
