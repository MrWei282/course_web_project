import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import TableHeadCell from 'components/TableHeadCell';
import UserInfo from 'components/UserInfo';

const QuizDisplay = ({ showClass = false, quizzes, courseid }) => {
  dayjs.extend(relativeTime);
  const navigate = useNavigate();
  return (
    <TableContainer>
      <Table aria-label="quizzes table" >
        <TableHead>
          <TableRow>
            <TableHeadCell width={1}>Quiz Name</TableHeadCell>
            <TableHeadCell align='center'>Creator</TableHeadCell>
            <TableHeadCell align='center'>Created</TableHeadCell>
            <TableHeadCell align='center'>Points</TableHeadCell>
            <TableHeadCell align='center'>Deadline</TableHeadCell>
            <TableHeadCell align='center'>Time Remaining</TableHeadCell>
            {(showClass &&
              <TableHeadCell align="center">Class ID</TableHeadCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {quizzes.map((quiz, idx) => (
            <TableRow key={idx} onClick={() => navigate(`/course/${courseid}/quizzes/${quiz.quiz_id}/`)} sx={{ cursor: 'pointer', transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
              <TableCell>
                <Link>
                  Quiz {quiz.quiz_id}
                </Link>
              </TableCell>
              <TableCell align="center"><UserInfo userId={quiz.creator_id} /></TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{dayjs(quiz.create_time).format('DD/MM/YYYY h:mm A')}</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{quiz.quiz_points}</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{dayjs(quiz.deadline).format('DD/MM/YYYY h:mm A')}</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{dayjs(quiz.deadline).fromNow()}</TableCell>
              {(showClass &&
                <TableCell align="center">{quiz.class_id}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default QuizDisplay;
