import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import BackButton from 'components/BackButton';
import AuthContext from 'AuthContext';
import TableHeadCell from 'components/TableHeadCell';
import CoursePage from 'components/Course/CoursePage';

const CourseAssignmentSubmissions = () => {
  const navigate = useNavigate();
  const { courseid, assignmentid } = useParams();
  const [assignment, setAssignment] = React.useState({});
  const [submissions, setSubmissions] = React.useState([]);
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/assignment_info', {
      params: {
        assignment_id: assignmentid
      }
    })
      .then(res => setAssignment(res.data))

    refreshSubmissions();
  }, []);

  const refreshSubmissions = () => {
    axios.get('/course/get_submissions', {
      params: {
        token,
        course_id: courseid,
        assignment_id: assignmentid
      }
    })
      .then(res => {
        setSubmissions(res.data.all_submissions_info)
        console.log(res.data)
      });
  }

  const handleRelease = (e) => {
    e.preventDefault();
    axios.put('/course/release_assignment_marks', {
      token,
      assignment_id: assignmentid
    })
      .then(() => refreshSubmissions())
  }

  return (
    <CoursePage
      page='assignments'
      title={`Assignment ${assignmentid} Submissions`}
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
              <TableHeadCell>Submitted By</TableHeadCell>
              <TableHeadCell>Submission Time</TableHeadCell>
              <TableHeadCell align='center'>Grade</TableHeadCell>
              <TableHeadCell align='center'>Marker Notes</TableHeadCell>
              <TableHeadCell align='center'>Open Submission</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission, idx) => (
              <TableRow key={idx} sx={{ cursor: 'pointer', transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
                <TableCell>User ID {submission.submission_uploader}</TableCell>
                <TableCell>{dayjs(assignment.assignment_due_date).diff(dayjs(submission.submission_time), 'hours')} hours before due</TableCell>
                <TableCell align="center">{`${submission.assignment_grade !== null ? submission.assignment_grade : '(Unmarked)'}`} / {submission.assignment_max_grade}</TableCell>
                <TableCell align="center">{submission.submission_note ? submission.submission_note : 'None'}</TableCell>
                <TableCell align="center">
                  <Button size="small" label="view submission button" onClick={() => navigate(`/course/${courseid}/assignments/${assignmentid}/submissions/${submission.submission_id}/`)} >
                    View Submission
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CoursePage>
  )
};

export default CourseAssignmentSubmissions;
