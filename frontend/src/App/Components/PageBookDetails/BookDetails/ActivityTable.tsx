import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useFetchActivity } from '../../../services';

const pageSize = 5;

const columns: GridColDef[] = [
  {
    field: 'created_at',
    headerName: 'Timestamp',
    flex: 1,
  },
  {
    field: 'type',
    headerName: 'Activity',
    flex: 1,
  },
];


interface Params {
  bookId: number;
}


const ActivityTable = (params: Params) => {
  const { bookId } = params;
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useFetchActivity(bookId, page);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Failed to fetch book activity list</div>
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data.results}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[pageSize]}
        getRowId={(el) => el.pk}
        paginationMode={'server'}
        rowCount={data.count}
        // Pages are zero-indexed by this DataGrid, but
        // they're 1-indexed by the API
        onPageChange={(n) => setPage(n + 1)}
      />
    </div>
  );
};

export default ActivityTable;
