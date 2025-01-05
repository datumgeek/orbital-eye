import styles from './conjunction-list.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Link,
  TextField,
} from '@mui/material';
import { satelliteDataAtom } from '../jotai-data-host/data/satellite-data';
import {
  UseShellState,
  useDebouncedSearchText,
  useSearchAction,
  useShellState,
} from '@porrtal/r-shell';
import { EntityMenu } from '@porrtal/r-shell-material';
import { conjunctionForecastAtom } from '../jotai-data-host/data/public-conjunction-data';

export function ConjunctionList() {
  const [searchString, setSearchString] = useState('');
  const [conjunctionData] = useAtom(conjunctionForecastAtom);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  const filteredData = conjunctionData.filter((record) =>
    JSON.stringify(record).toLowerCase().includes(searchString.toLowerCase())
  );

  const retData = filteredData
    .sort((a, b) =>
      !a?.satellite1.name || !b?.satellite1.name
        ? 1
        : a.satellite1.name?.localeCompare(b.satellite1.name)
    )
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box padding={2}>
      <Typography variant="h6" gutterBottom>
        Satellite Data Search ({filteredData.length})
      </Typography>
      <Box marginBottom={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </Box>{' '}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>OBJECT_NAME</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {retData.length > 0 ? (
              retData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <EntityMenu
                      entityType="conjunction"
                      state={{
                        cdmId: record.cdmId,
                        objectName: `${record.satellite1.name}<-->${record.satellite2.name}`,
                      }}
                    >
                      <Link>
                        {`${record.satellite1.name}<-->${record.satellite2.name}` ||
                          'N/A'}
                      </Link>
                    </EntityMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No matching records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />{' '}
    </Box>
  );
}

export default ConjunctionList;
