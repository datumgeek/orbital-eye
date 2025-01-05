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
} from '@mui/material';
import {
  satelliteDataAtom,
} from '../jotai-data-host/data/satellite-data';
import { UseShellState, useDebouncedSearchText, useSearchAction, useShellState } from '@porrtal/r-shell';
import { EntityMenu } from '@porrtal/r-shell-material';

export const SatelliteSearch: React.FC = () => {
  const searchString = useDebouncedSearchText();
  const [satelliteData] = useAtom(satelliteDataAtom);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const shellState = useShellState();
  const searchAction = useSearchAction();
  const refPrevShellState = useRef<UseShellState | undefined>(undefined)
  
  useEffect(() => {
    if (!shellState || !searchAction || !refPrevShellState.current) {
      refPrevShellState.current = shellState;
      return;
    }

    if (shellState.panes['main'].viewStates.length !== refPrevShellState.current.panes['main'].viewStates.length) {
      searchAction.closeSearchDialog();
    }

    refPrevShellState.current = shellState;
  }, [shellState, searchAction]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  const filteredData = satelliteData.filter((record) =>
    Object.values(record).some((value) =>
      value?.toString().toLowerCase().includes(searchString.toLowerCase())
    )
  );

  const retData = filteredData
    .sort((a, b) =>
      !a?.OBJECT_NAME || !b?.OBJECT_NAME
        ? 1
        : a.OBJECT_NAME?.localeCompare(b.OBJECT_NAME)
    )
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box padding={2}>
      <Typography variant="h6" gutterBottom>
        Satellite Data Search ({filteredData.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>OBJECT_NAME</TableCell>
              <TableCell>OBJECT_ID</TableCell>
              <TableCell>NORAD_CAT_ID</TableCell>
              <TableCell>CENTER_NAME</TableCell>
              <TableCell>CREATION_DATE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {retData.length > 0 ? (
              retData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <EntityMenu
                      entityType="satellite"
                      state={{
                        noradCatId: record.NORAD_CAT_ID,
                        objectName: record.OBJECT_NAME ?? '',
                      }}
                    >
                      <Link>{record.OBJECT_NAME || 'N/A'}</Link>
                    </EntityMenu>
                  </TableCell>
                  <TableCell>{record.OBJECT_ID || 'N/A'}</TableCell>
                  <TableCell>{record.NORAD_CAT_ID}</TableCell>
                  <TableCell>{record.CENTER_NAME}</TableCell>
                  <TableCell>
                    {record.CREATION_DATE
                      ? new Date(record.CREATION_DATE).toLocaleString()
                      : 'N/A'}
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
};

export default SatelliteSearch;
