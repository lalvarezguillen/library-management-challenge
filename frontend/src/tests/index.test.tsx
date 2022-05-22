import React from "react";
import { fireEvent } from "@testing-library/react";

import PageBookList from "../App/Components/PageBookList";
import { renderWithClient, dummyDate, dummyBook } from "./utils";
import PageBookDetails from "../App/Components/PageBookDetails";
import { server } from "../setupTests";
import { rest } from "msw";

describe("PageListBooks", () => {
  it("lists existing books", async () => {
    const view = renderWithClient(<PageBookList></PageBookList>);

    expect(await view.findByText("Book 1")).toBeInTheDocument();
    expect(await view.findByText("Book 2")).toBeInTheDocument();
    expect(await view.findByText("Book 3")).toBeInTheDocument();
  });

  it("allows adding new Books", async () => {
    const view = renderWithClient(<PageBookList></PageBookList>);

    expect(await view.findByText(/Add Book/i)).toBeInTheDocument();
  });
});

describe("PageBookDetails", () => {
  it("displays book details and activity", async () => {
    const view = renderWithClient(<PageBookDetails></PageBookDetails>);

    expect(await view.findByText(dummyBook.title)).toBeInTheDocument();
    expect(await view.findByText(`ISBN ${dummyBook.isbn}`)).toBeInTheDocument();
    expect(await view.findByText(`by ${dummyBook.author}`)).toBeInTheDocument();
    expect(await view.findByText(dummyBook.description)).toBeInTheDocument();

    expect(
      (await view.findAllByText(dummyDate.toLocaleString())).length
    ).toEqual(2);
    expect(await view.findByText("check-in")).toBeInTheDocument();
    expect(await view.findByText("check-out")).toBeInTheDocument();
  });

  it("Allows editing the Book", async () => {
    const view = renderWithClient(<PageBookDetails></PageBookDetails>);

    const actionsBtn = await view.findByText(/Actions/i);
    expect(actionsBtn).toBeInTheDocument();
    fireEvent.click(actionsBtn);
    const editBtn = await view.findByText(/Edit/i);
    expect(editBtn).toBeInTheDocument();
  });

  it("Allows deleting the Book", async () => {
    const view = renderWithClient(<PageBookDetails></PageBookDetails>);

    const actionsBtn = await view.findByText(/Actions/i);
    expect(actionsBtn).toBeInTheDocument();
    fireEvent.click(actionsBtn);
    const deleteBtn = await view.findByText(/Delete/i);
    expect(deleteBtn).toBeInTheDocument();
  });

  test.each([
    [true, /Check Out/i],
    [false, /Check In/i],
  ])(
    "It allows checking books in or out, depending on availability",
    async (isAvailable, btnTxt) => {
      const book = {
        ...dummyBook,
        on_site: isAvailable, // book is available / on-site
      };
      const now = new Date();
      server.use(
        rest.get(
          // TODO: set expected book.id
          `*/books/*/`,
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(book));
          }
        )
      );
      server.use(
        rest.get(`*/books/*/activity/`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              count: 3,
              results: [
                {
                  pk: 2,
                  type: "check-in",
                  created_at: now,
                },
                {
                  pk: 1,
                  type: "check-out",
                  created_at: now,
                },
              ],
            })
          );
        })
      );

      const view = renderWithClient(<PageBookDetails></PageBookDetails>);

      const actionsBtn = await view.findByText(/Actions/i);
      expect(actionsBtn).toBeInTheDocument();
      fireEvent.click(actionsBtn);
      const checkBtn = await view.findByText(btnTxt);
      expect(checkBtn).toBeInTheDocument();
    }
  );
});
