import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useFetchBooks } from "../../services";
import { useState } from "react";
import { Link } from "react-router-dom";

const pageSize = 5;

const columns: GridColDef[] = [
  {
    field: "pk",
    headerName: "ID",
    flex: 1,
    renderCell: (params: GridValueGetterParams) => (
      <Link to={`/${params.row.pk}`}>{params.row.pk}</Link>
    ),
  },
  {
    field: "isbn",
    headerName: "ISBN",
    flex: 2,
  },
  { field: "title", headerName: "Title", flex: 4 },
  {
    field: "author",
    headerName: "Author",
    flex: 4,
  },
  {
    field: "on_site",
    headerName: "Available",
    flex: 1,
  },
];

const BooksTable = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useFetchBooks(page);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>There was a problem fetching the books list</div>;
  }

  const books = data.results || [];
  const booksCount = data.count || 0;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={books}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[pageSize]}
        getRowId={(el) => el.pk}
        paginationMode={"server"}
        rowCount={booksCount}
        // DataGrid indexes the pages zero-based.
        // But the API indexes them 1-based
        onPageChange={(p) => setPage(p + 1)}
      />
    </div>
  );
};

export default BooksTable;
