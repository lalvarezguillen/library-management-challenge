import axios from 'axios';
import { BookWritable } from './types';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});


export interface PaginationParams {
    // TODO: get rid of this in favor of a single `pageNumber` param
    page: number;
}

export const fetchBooks = (params: PaginationParams) =>
    api.get('/books/', { params });

export const fetchBook = (id: number) =>
    api.get(`/books/${id}/`);

export const fetchBookActivity = (id: number, params: PaginationParams) =>
    api.get(`/books/${id}/activity/`, { params });

export const createBook = (data: BookWritable) =>
    api.post(`/books/`, data);

export const updateBook = (pk: number, data: BookWritable) =>
    api.put(`/books/${pk}/`, data);

export const checkBookIn = (pk: number) =>
    api.post(`/books/${pk}/check-in/`);

export const checkBookOut = (pk: number) =>
    api.post(`/books/${pk}/check-out/`);

export const deleteBook = (pk: number) =>
    api.delete(`/books/${pk}/`);