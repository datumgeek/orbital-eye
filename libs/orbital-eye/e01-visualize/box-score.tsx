import styles from './box-score.module.scss';
import React, { ReactNode, useMemo } from 'react';
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  TablePagination,
  Box,
} from '@mui/material';

// Define the TypeScript interface for the data structure
interface Data {
  country: string;
  unassigned: number;
  inOrbit: {
    payload: number;
    rocketBody: number;
    debris: number;
    total: number;
  };
  decayed: {
    payload: number;
    rocketBody: number;
    debris: number;
    total: number;
  };
  countryTotal: number;
}

// Helper function to generate mock data
const generateMockData = (numRows: number): Data[] => {
  const countries = [
    'United States (US)',
    'China (PRC)',
    'Russia (CIS)',
    'France (FR)',
    'Japan (JPN)',
    'India (IND)',
    'European Space Agency (ESA)',
    'Iran (IRAN)',
  ];

  return Array.from({ length: numRows }, (_, i) => {
    const randomCountry = countries[i % countries.length];
    const inOrbitPayload = Math.floor(Math.random() * 1000) + 500;
    const inOrbitRocketBody = Math.floor(Math.random() * 500) + 100;
    const inOrbitDebris = Math.floor(Math.random() * 2000) + 1000;
    const decayedPayload = Math.floor(Math.random() * 500) + 200;
    const decayedRocketBody = Math.floor(Math.random() * 300) + 100;
    const decayedDebris = Math.floor(Math.random() * 3000) + 1500;

    const inOrbitTotal = inOrbitPayload + inOrbitRocketBody + inOrbitDebris;
    const decayedTotal = decayedPayload + decayedRocketBody + decayedDebris;
    const countryTotal = inOrbitTotal + decayedTotal;

    return {
      country: randomCountry,
      unassigned: Math.floor(Math.random() * 50),
      inOrbit: {
        payload: inOrbitPayload,
        rocketBody: inOrbitRocketBody,
        debris: inOrbitDebris,
        total: inOrbitTotal,
      },
      decayed: {
        payload: decayedPayload,
        rocketBody: decayedRocketBody,
        debris: decayedDebris,
        total: decayedTotal,
      },
      countryTotal: countryTotal,
    };
  });
};

const MuiTable: React.FC = () => {
  // Generate mock data
  const data = useMemo(() => generateMockData(10), []);

  // Column Definitions
  const columns = useMemo<ColumnDef<Data>[]>(
    () => [
      { accessorKey: 'country', header: 'Country' },
      { accessorKey: 'unassigned', header: 'Unassigned' },
      {
        header: 'In Orbit',
        columns: [
          { accessorKey: 'inOrbit.payload', header: 'Payload' },
          { accessorKey: 'inOrbit.rocketBody', header: 'Rocket Body' },
          { accessorKey: 'inOrbit.debris', header: 'Debris' },
          { accessorKey: 'inOrbit.total', header: 'Total' },
        ],
      },
      {
        header: 'Decayed',
        columns: [
          { accessorKey: 'decayed.payload', header: 'Payload' },
          { accessorKey: 'decayed.rocketBody', header: 'Rocket Body' },
          { accessorKey: 'decayed.debris', header: 'Debris' },
          { accessorKey: 'decayed.total', header: 'Total' },
        ],
      },
      { accessorKey: 'countryTotal', header: 'Country Total' },
    ],
    []
  );

  // Table State
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Initialize Table
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, overflow: 'hidden' }}
    >
      <Typography
        variant="h6"
        sx={{ padding: 2, backgroundColor: '#e5e5e5', color: 'black' }}
      >
        Satellite Data (Mock)
      </Typography>
      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
        <TablePagination
          component="div"
          count={data.length} // Total rows
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, newPage) => table.setPageIndex(newPage)}
          rowsPerPage={table.getState().pagination.pageSize}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count}`
          }
        />
      </Box>
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup, headerGroupIndex) => (
            <React.Fragment key={headerGroup.id}>
              {/* Group Header Row */}
              {headerGroupIndex === 0 && (
                <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                  {headerGroup.headers.map((header, groupIndex) => (
                    <TableCell
                      key={header.id}
                      colSpan={header.colSpan}
                      sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        borderBottom: '1px solid #bdbdbd',
                        backgroundColor:
                          header.subHeaders.length <= 1 ? '#f5f5f5' : !(groupIndex % 2)
                            ? '#e5e5e5'
                            : '#efefef',
                        fontSize: '1rem',
                      }}
                    >
                      {
                        (header.isPlaceholder
                          ? null
                          : header.column.columnDef.header) as string
                      }
                    </TableCell>
                  ))}
                </TableRow>
              )}

              {/* Column Header Row */}
              {headerGroupIndex !== 0 && (
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  {headerGroup.headers.map((header, groupIndex) => (
                    <TableCell
                      key={header.id}
                      colSpan={header.colSpan}
                      sx={{
                        fontWeight: 'bold',
                        borderBottom: '2px solid #bdbdbd',
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <TableSortLabel
                          active={header.column.getIsSorted() !== false}
                          direction={
                            header.column.getIsSorted() === 'asc'
                              ? 'asc'
                              : 'desc'
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.column.columnDef.header as string}
                        </TableSortLabel>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{
                backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                '&:hover': { backgroundColor: '#e3f2fd' },
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {cell.renderValue() as unknown as ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export function BoxScore() {
  return (
    <div className={styles['container']}>
      <MuiTable />
    </div>
  );
}

export default BoxScore;
