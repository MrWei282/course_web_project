import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import BackButton from 'components/BackButton';
import AuthContext from 'AuthContext';
import TableHeadCell from 'components/TableHeadCell';
import CoursePage from 'components/Course/CoursePage';
import UserInfo from 'components/UserInfo';

const CourseQuizSubmissions = () => {
  const navigate = useNavigate();
  const { courseid, quizid } = useParams();
  const [submissions, setSubmissions] = React.useState([]);
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    refreshSubmissions();
  }, []);

  const refreshSubmissions = () => {
    axios.get('/quiz_view_submissions_to_mark', {
      params: {
        token,
        quiz_id: quizid,
      }
    })
      .then(res => setSubmissions(res.data.submissions));
  }

  const handleRelease = (e) => {
    e.preventDefault();
    axios.put('/quiz_release', {
      token,
      quiz_id: quizid,
      course_id: courseid
    })
      .then(() => refreshSubmissions())
  }

  return (
    <CoursePage
      page={'quizzes'}
      title={`Submissions for Quiz ${quizid}`}
      titleEnd={<BackButton />}
    >
      {(submissions.length > 0 && submissions.some(submission => !submission.is_released) &&
      <Button variant='contained' onClick={handleRelease} sx={{ mb: 2 }}>
        Release Marks
      </Button>
      )}
      <TableContainer>
        <Table aria-label="classes table" >
          <TableHead>
            <TableRow>
              <TableHeadCell>Submission</TableHeadCell>
              <TableHeadCell align='center'>Submitted By</TableHeadCell>
              <TableHeadCell align='center'>Submission Time</TableHeadCell>
              <TableHeadCell align='center'>Grade</TableHeadCell>
              <TableHeadCell align='center'>Marked</TableHeadCell>
              <TableHeadCell align='center'>Released</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission, idx) => (
              <TableRow key={idx} onClick={() => navigate(`/course/${courseid}/quizzes/${quizid}/submissions/${submission.user_id}`)} sx={{ cursor: 'pointer', transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
                <TableCell>
                  <UserInfo userId={submission.user_id} />
                </TableCell>
                <TableCell align="center">User ID {submission.user_id}</TableCell>
                <TableCell align="center">{dayjs(submission.submit_time).format('DD/MM/YYYY h:mm A')}</TableCell>
                <TableCell align="center">{`${submission.total_mark !== null ? submission.total_mark + ' /' : '(Unmarked)'}`} {submission.max_total_mark !== null ? submission.max_total_mark : ''}</TableCell>
                <TableCell align="center">{submission.is_marked ? 'True' : 'False'}</TableCell>
                <TableCell align="center">{submission.is_released ? 'True' : 'False'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CoursePage>
  )
};

export default CourseQuizSubmissions;
