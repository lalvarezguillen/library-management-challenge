import { Box, styled, Typography } from "@mui/material";
import { Book } from "../../../types";

const BookSummary = (params: Book) => {
  const { isbn, title, author, description } = params;
  return (
    <StyleContainer>
      <Typography variant="h2">{title}</Typography>
      <p>by {author}</p>
      <p>ISBN {isbn}</p>
      <p>{description}</p>
    </StyleContainer>
  );
};

export default BookSummary;

const StyleContainer = styled(Box)`
&& {
  max-width: 100%;
  word-break: break-word
}
`;