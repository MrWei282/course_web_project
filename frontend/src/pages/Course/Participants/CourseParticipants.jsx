import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import config from 'config.json';
import AuthContext from 'AuthContext';
import TableHeadCell from 'components/TableHeadCell';
import CoursePage from 'components/Course/CoursePage';
import UserInfo from 'components/UserInfo';

const CourseParticipants = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [participants, setParticipants] = React.useState([]);
  const [role, setRole] = React.useState('student');
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/course/participants', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => setParticipants(res.data.participant_info))

    setParticipants([]);
  }, []);

  return (
    <CoursePage
      page='participants'
      title='Participants'
      getRole
      setRole={setRole}
    >
      {(config[role].participants.add &&
        <Button sx={{ mb: 2 }} onClick={() => navigate(`/course/${courseid}/enrollments`)} label="enrollment requests" variant="contained">
          Enrollment Requests
        </Button>
      )}
      <TableContainer>
        <Table aria-label="classes table" >
          <TableHead>
            <TableRow>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell align='center'>Student ID</TableHeadCell>
              <TableHeadCell align='center'>Email</TableHeadCell>
              <TableHeadCell align='center'>Role</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant, idx) => (
              <TableRow key={idx} onClick={() => console.log('download')} sx={{ cursor: 'pointer', transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
                <TableCell>
                  <UserInfo userId={participant.user_id} />
                </TableCell>
                <TableCell align="center">{participant.user_id}</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{participant.user_email}</TableCell>
                <TableCell align="center">{participant.user_role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CoursePage>
  )
};

export default CourseParticipants;
