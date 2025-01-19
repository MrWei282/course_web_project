import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Box, Button, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TableHeadCell from 'components/TableHeadCell';

import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';
import UploadRecording from 'components/LiveClass/UploadRecording';
import config from 'config.json';
import BackButton from 'components/BackButton';
import ObjectSelect from 'components/ObjectSelect';
import { fetchClasses } from 'utils/helpers.js';
import UserInfo from 'components/UserInfo';

const CourseRecordings = () => {
  dayjs.extend(relativeTime);
  const { courseid } = useParams();
  const { token } = React.useContext(AuthContext);
  const [role, setRole] = React.useState('student');
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [recordings, setRecordings] = React.useState([]);
  const [courseClass, setCourseClass] = React.useState('');
  const [classes, setClasses] = React.useState([]);

  React.useEffect(() => {
    axios.get('/course/get_classes', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => {
        fetchClasses(res.data.class_ids, token, courseid)
          .then(newClasses => setClasses(newClasses))
      });
  }, [])

  React.useEffect(() => {
    if (courseClass !== '') {
      fetchRecordings();
    }
  }, [courseClass]);

  const fetchRecordings = () => {
    axios.get('/recordings', {
      params: {
        token,
        course_id: courseid,
        class_id: courseClass === '' ? null : courseClass.class_id,
      }
    })
      .then(res => {
        setRecordings(res.data.recordings)
        console.log(res.data.recordings)
      })
      .catch(() => {})
  }

  return (
    <CoursePage
      page={'lessons'}
      title={'Lesson Recordings'}
      titleEnd={<BackButton />}
      getRole
      setRole={setRole}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <ObjectSelect objects={classes} labelKey='name' value={courseClass} onChange={e => setCourseClass(e.target.value)} label='Class' error={''} size='small'/>
        {(config[role].lessons.can_create &&
          <>
            <UploadRecording open={uploadOpen} handleClose={() => setUploadOpen(false)} courseId={courseid} fetchRecordings={fetchRecordings}/>
            <Button sx={{ mb: 2, flexShrink: 0 }} onClick={() => setUploadOpen(true)} label="upload lesson link" variant="contained">
              Upload Recording Link
            </Button>
          </>
        )}
      </Box>

      <TableContainer>
        <Table aria-label="recordings table" >
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableHeadCell>Title</TableHeadCell>
              <TableHeadCell>Description</TableHeadCell>
              <TableHeadCell>Uploaded by</TableHeadCell>
              <TableHeadCell>Open Recording</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recordings.map((recording, idx) => (
              <TableRow key={idx} sx={{ transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
                <TableCell>{recording.title}</TableCell>
                <TableCell>{recording.description}</TableCell>
                <TableCell>
                  <UserInfo userId={recording.user_id} />
                </TableCell>
                <TableCell>
                  <Link to={(`/course/${courseid}/lessons/recordings/${courseClass.class_id}/${recording.id}`)}>
                    Open Recording
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CoursePage>
  )
};

export default CourseRecordings;
