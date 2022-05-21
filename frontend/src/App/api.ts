import axios from "axios";
import { BookWritable } from "./types";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

export const fetchBooks = async (page: number = 1) => {
  const params = { page };
  const { data } = await api.get("/books/", { params });
  return data;
};

export const fetchBook = async (id: number) => {
  const { data } = await api.get(`/books/${id}/`);
  return data;
};

export const fetchBookActivity = async (id: number, page: number) => {
  const params = { page };
  const { data } = await api.get(`/books/${id}/activity/`, { params });
  return data;
};

export const createBook = async (book: BookWritable) => {
  const { data } = await api.post(`/books/`, book);
  return data;
};

export const updateBook = async (pk: number, book: BookWritable) => {
  const { data } = await api.put(`/books/${pk}/`, book);
  return data;
};

export const checkBookIn = async (pk: number) => {
  const { data } = await api.post(`/books/${pk}/check-in/`);
  return data;
};

export const checkBookOut = async (pk: number) => {
  const { data } = await api.post(`/books/${pk}/check-out/`);
  return data;
};

export const deleteBook = (pk: number) => {
  return api.delete(`/books/${pk}/`);
};
