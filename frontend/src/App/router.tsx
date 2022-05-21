import { Routes, Route } from "react-router-dom";
import BookCreate from "./Components/PageBookCreate";
import BookDetails from "./Components/PageBookDetails";
import BooksList from "./Components/PageBookList";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<BooksList />} />
      <Route path="/new" element={<BookCreate />} />
      <Route path="/:pk" element={<BookDetails />} />
    </Routes>
  );
};

export default Router;
