import { useQuery, QueryClient, useMutation } from "react-query";
import {
  checkBookIn,
  checkBookOut,
  createBook,
  deleteBook,
  fetchBook,
  fetchBookActivity,
  fetchBooks,
  updateBook,
} from "./api";
import { BookWritable } from "./types";

const staleTime = 5 * 60 * 1000;
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime,
      keepPreviousData: true,
    },
  },
});

export const useFetchBooks = (page: number = 1) => {
  return useQuery(["books", page], () => fetchBooks(page));
};

export const useFetchBook = (id: number) => {
  return useQuery(["book", id], () => fetchBook(id));
};

export const useFetchActivity = (id: number, page: number = 1) => {
  return useQuery(["book-activity", id, page], () =>
    fetchBookActivity(id, page)
  );
};

export const useCreateBook = (onSuccess: (data: { pk: string }) => void) => {
  return useMutation((book: BookWritable) => createBook(book), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["books"]);
      onSuccess(data);
    },
  });
};

export const useUpdateBook = (bookId: number, onSuccess: () => void) => {
  return useMutation((book: BookWritable) => updateBook(bookId, book), {
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      queryClient.invalidateQueries(["book", bookId]);
      onSuccess();
    },
  });
};

export const useCheckBookIn = (bookId: number) => {
  return useMutation(() => checkBookIn(bookId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      queryClient.invalidateQueries(["book", bookId]);
      queryClient.invalidateQueries(["book-activity", bookId]);
    },
  });
};

export const useCheckOutBook = (bookId: number) => {
  return useMutation(() => checkBookOut(bookId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      queryClient.invalidateQueries(["book", bookId]);
      queryClient.invalidateQueries(["book-activity", bookId]);
    },
  });
};

export const useDeleteBook = (bookId: number) => {
  return useMutation(() => deleteBook(bookId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      queryClient.invalidateQueries(["book", bookId]);
    },
  });
};
