import React from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import TableHeadCell from 'components/TableHeadCell';

const AssignmentsDisplay = ({ showClass = false, assignments, courseid }) => {
  const navigate = useNavigate();
  return (
    <TableContainer>
      <Table aria-label="assignments table" >
        <TableHead>
          <TableRow>
            <TableHeadCell width={0.2}>Assignment</TableHeadCell>
            <TableHeadCell width={0.5}>Description</TableHeadCell>
            <TableHeadCell align="center">Maximum Grade</TableHeadCell>
            <TableHeadCell align="center">Worth</TableHeadCell>
            <TableHeadCell align='center'>Points</TableHeadCell>
            <TableHeadCell align="center">Due Date</TableHeadCell>
            {(showClass &&
              <TableHeadCell align="center">Class ID</TableHeadCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {assignments.map((assignment, idx) => (
            <TableRow key={idx} onClick={() => navigate(`/course/${courseid}/assignments/${assignment.assignment_id}/`)} sx={{ cursor: 'pointer', transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
              <TableCell>Assignment {assignment.assignment_id}</TableCell>
              <TableCell>{assignment.assignment_description}</TableCell>
              <TableCell align="center">{assignment.assignment_grade}</TableCell>
              <TableCell align="center">{assignment.assignment_percentage}%</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{assignment.assignment_points}</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{dayjs(assignment.assignment_due_date).format('DD/MM/YYYY h:mm A')}</TableCell>
              {(showClass &&
                <TableCell align="center">{assignment.class_id}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default AssignmentsDisplay;
