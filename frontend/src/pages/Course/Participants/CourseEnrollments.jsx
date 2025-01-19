import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import BackButton from 'components/BackButton';
import AuthContext from 'AuthContext';
import TableHeadCell from 'components/TableHeadCell';
import CoursePage from 'components/Course/CoursePage';
import UserInfo from 'components/UserInfo';

const CourseEnrollments = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [enrollments, setEnrollments] = React.useState([]);
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    getEnrollments();
  }, []);

  const getEnrollments = () => {
    axios.get('/course/enrol_requests', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => setEnrollments(res.data.pending_enrol_info))
      .catch(() => navigate('/dashboard'));
  }

  const handleAccept = (id) => {
    axios.put('/course/approve_enrolment', {
      token,
      course_id: courseid,
      enrollee_id: id,
    })
      .then(getEnrollments);
  };

  return (
    <CoursePage
    page='participants'
    title='Enrollment Requests'
    titleEnd={<BackButton />}
    >
      <TableContainer>
        <Table aria-label="classes table" >
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell align='center'>Student ID</TableHeadCell>
              <TableHeadCell align='center'>Email</TableHeadCell>
              <TableHeadCell align='center'>Role</TableHeadCell>
              <TableHeadCell align='center'>Enrol</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map((enrollment, idx) => (
              <TableRow key={idx} sx={{ transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
                <TableCell>
                  <UserInfo userId={enrollment.user_id} />
                </TableCell>
                <TableCell align="center">{enrollment.user_id}</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{enrollment.user_email}</TableCell>
                <TableCell align="center">{enrollment.user_role}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleAccept(enrollment.user_id)} variant='contained' size='small'>Accept</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CoursePage>
  )
};

export default CourseEnrollments;
