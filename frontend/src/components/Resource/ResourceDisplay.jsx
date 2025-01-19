import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TableHeadCell from 'components/TableHeadCell';

const ResourceDisplay = ({ showClass = false, handleDownload, resources }) => {
  return (
    <TableContainer>
      <Table aria-label="resources table" >
        <TableHead>
          <TableRow>
            <TableHeadCell align='center' width={0.2}>Resource ID</TableHeadCell>
            <TableHeadCell width={0.5}>Description</TableHeadCell>
            <TableHeadCell align='center'>Categories</TableHeadCell>
            {(showClass &&
              <TableHeadCell align="center">Class ID</TableHeadCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {resources
            .map((resource, idx) => (
            <TableRow key={idx} onClick={() => handleDownload(resource)} sx={{ cursor: 'pointer', transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
              <TableCell align="center">{resource.resource_id}</TableCell>
              <TableCell>{resource.resource_description}</TableCell>
              <TableCell align="center">{resource.resource_category}</TableCell>
              {(showClass &&
                <TableCell align="center">{resource.class_id}</TableCell>
              )}
            </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default ResourceDisplay;
