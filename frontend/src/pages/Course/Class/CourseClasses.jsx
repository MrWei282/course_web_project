import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import config from 'config.json';
import TableHeadCell from 'components/TableHeadCell';
import CoursePage from 'components/Course/CoursePage';
import AuthContext from 'AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';
import { fetchClasses } from 'utils/helpers';

const CourseClasses = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [role, setRole] = React.useState('student');
  const [classes, setClasses] = React.useState([]);
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/course/get_classes', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => fetchClasses(res.data.class_ids, token, courseid))
      .then(newClasses => setClasses(newClasses));
  }, [])

  return (
    <CoursePage
      page={'classes'}
      title={'Classes'}
      getRole
      setRole={setRole}
    >
      {(config[role].classes.create &&
        <Button sx={{ mb: 2 }} onClick={() => navigate(`/course/${courseid}/classes/create-class`)} label="create class" variant="contained">
          Create Class
        </Button>
      )}

      <TableContainer>
        <Table aria-label="classes table" >
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Class ID</TableHeadCell>
              <TableHeadCell width={1}>Description</TableHeadCell>
              <TableHeadCell>Time</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((currClass, idx) => (
              <TableRow key={idx} onClick={() => navigate(`/course/${courseid}/classes/${currClass.class_id}/`)} sx={{ cursor: 'pointer', transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
                <TableCell>{currClass.name}</TableCell>
                <TableCell align="center">{currClass.class_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{currClass.description}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{currClass.time !== '' ? dayjs(currClass.time).format('dddd h:mm A') : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CoursePage>
  )
};

export default CourseClasses;
