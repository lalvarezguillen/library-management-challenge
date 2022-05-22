import { render } from "@testing-library/react";
import { rest } from "msw";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

export const dummyDate = new Date();
export const dummyBook = {
  pk: 1,
  title: "Book 1",
  isbn: "book-1",
  author: "Luis",
  description: "Book 1 by Luis",
};

export const handlers = [
  rest.get(`*/books/*/activity/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        count: 3,
        results: [
          {
            pk: 2,
            type: "check-in",
            created_at: dummyDate,
          },
          {
            pk: 1,
            type: "check-out",
            created_at: dummyDate,
          },
        ],
      })
    );
  }),
  rest.get(
    // TODO: set expected book.id
    `*/books/*/`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(dummyBook));
    }
  ),
  rest.get("*/books/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        count: 6,
        results: [
          {
            pk: 1,
            title: "Book 1",
            isbn: "book-1",
            author: "Luis",
            description: "Book 1 by Luis",
          },
          {
            pk: 2,
            title: "Book 2",
            isbn: "book-2",
            author: "Luis",
            description: "Book 2 by Luis",
          },
          {
            pk: 3,
            title: "Book 3",
            isbn: "book-3",
            author: "Luis",
            description: "Book 3 by Luis",
          },
        ],
      })
    );
  }),
];

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const { rerender, ...result } = render(
    <BrowserRouter>
      <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    </BrowserRouter>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <BrowserRouter>
          <QueryClientProvider client={testQueryClient}>
            {rerenderUi}
          </QueryClientProvider>
        </BrowserRouter>
      ),
  };
}
