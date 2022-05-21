import {
  useQuery,
  QueryClient,
  useMutation,
} from "react-query";
import { checkBookIn, checkBookOut, createBook, deleteBook, fetchBook, fetchBookActivity, fetchBooks, updateBook } from './api';
import { BookWritable } from './types';


export const queryClient = new QueryClient();

const staleTime = 5 * 60 * 1000
const defaultConfig = {
  staleTime, keepPreviousData: true
}

export const useFetchBooks = (page: number = 1) => {
  return useQuery(
    ["books", page],
    () => fetchBooks(page),
    defaultConfig,
  );
}

export const useFetchBook = (id: number) => {
  return useQuery(
    ['book', id],
    () => fetchBook(id),
    defaultConfig
  )
}

export const useFetchActivity = (id: number, page: number = 1) => {
  return useQuery(
    ["book-activity", id, page],
    () => fetchBookActivity(id, page),
    defaultConfig,
  );
}

export const useCreateBook = () => {
  return useMutation(
    (book: BookWritable) => createBook(book),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['books']);
      }
    },
  )
}

export const useUpdateBook = (bookId: number) => {
  return useMutation(
    (book: BookWritable) => updateBook(bookId, book),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['books']);
        queryClient.invalidateQueries(['book', bookId]);
      }
    }
  )
}

export const useCheckBookIn = (bookId: number) => {
  return useMutation(
    () => checkBookIn(bookId),
    {
      onSuccess: (updatedBook) => {
        queryClient.invalidateQueries(['books']);
        queryClient.invalidateQueries(['book', bookId]);
        queryClient.invalidateQueries(["book-activity", bookId]);
      }
    }
  )
}

export const useCheckOutBook = (bookId: number) => {
  return useMutation(
    () => checkBookOut(bookId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['books']);
        queryClient.invalidateQueries(['book', bookId]);
        queryClient.invalidateQueries(["book-activity", bookId]);
      }
    }
  )
}

export const useDeleteBook = (bookId: number) => {
  return useMutation(
    () => deleteBook(bookId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['books']);
        queryClient.invalidateQueries(['book', bookId]);
      }
    }
  )
}