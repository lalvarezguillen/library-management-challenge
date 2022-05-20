import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import { Book } from '../../types';

const pageSize = 5;

const columns: GridColDef[] = [
  {
    field: 'pk',
    headerName: 'ID',
    flex: 1,
    renderCell: (params: GridValueGetterParams) => (
      <Link href={`/${params.row.pk}`}>
        {params.row.pk}
      </Link>
    ),
  },
  {
    field: 'isbn',
    headerName: 'ISBN',
    flex: 2,
  },
  { field: 'title', headerName: 'Title', flex: 4 },
  {
    field: 'author',
    headerName: 'Author',
    flex: 4,
  },
  {
    field: 'on_site',
    headerName: 'Available',
    flex: 1
  }
];

interface Params {
  books: Book[];
  totalItems: number;
  onPageChange: (pageNum: number) => void;
}

const BooksTable = (params: Params) => {
  const { books, totalItems, onPageChange } = params;
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={books}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[pageSize]}
        getRowId={el => el.pk}
        paginationMode={'server'}
        rowCount={totalItems}
        // DataGrid indexes the pages zero-based.
        // But the API indexes them 1-based
        onPageChange={(p) => onPageChange(p + 1)}
      />
    </div>
  );
};

export default BooksTable;
