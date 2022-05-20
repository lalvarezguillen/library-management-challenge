import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { BookActivity } from '../../types';

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
  activity: BookActivity[];
  totalItems: number;
  page: number;
  onPageChange: (pageNum: number) => void;
}


const ActivityTable = (params: Params) => {
  const { activity, totalItems, onPageChange } = params;
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={activity}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[pageSize]}
        getRowId={(el) => el.pk}
        paginationMode={'server'}
        rowCount={totalItems}
        // Pages are zero-indexed by this DataGrid, but
        // they're 1-indexed by the API
        onPageChange={(n) => onPageChange(n + 1)}
      />
    </div>
  );
};

export default ActivityTable;
