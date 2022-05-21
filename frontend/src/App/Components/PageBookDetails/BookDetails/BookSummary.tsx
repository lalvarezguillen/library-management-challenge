import { Typography } from "@mui/material";
import { Book } from "../../../types";

const BookSummary = (params: Book) => {
  const { isbn, title, author, description } = params;
  return (
    <div style={{ maxWidth: '100%', wordBreak: 'break-word' }}>
      <Typography variant="h2">{title}</Typography>
      <p>by {author}</p>
      <p>ISBN {isbn}</p>
      <p>{description}</p>
    </div>
  );
};

export default BookSummary;
