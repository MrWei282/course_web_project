import React from 'react';

import { TableCell } from '@mui/material';

const TableHeadCell = ({ children, width, align = 'left', whiteSpace = 'nowrap' }) => {
  return (
    <TableCell align={align} sx={{ color: 'white', fontWeight: 'bold', whiteSpace, width }}>
      {children}
    </TableCell>
  );
}

export default TableHeadCell;
