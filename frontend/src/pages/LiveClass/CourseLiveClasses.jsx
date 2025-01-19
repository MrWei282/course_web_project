import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TableHeadCell from 'components/TableHeadCell';

import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';
import { fetchClasses } from 'utils/helpers';
import config from 'config.json';
import { useParams, useNavigate } from 'react-router-dom';
import InfoBox from 'components/InfoBox';

const CourseLiveClasses = () => {
  const navigate = useNavigate();
  dayjs.extend(relativeTime);
  const { courseid } = useParams();
  const { token } = React.useContext(AuthContext);
  const [classes, setClasses] = React.useState([]);
  const [role, setRole] = React.useState('student');

  React.useEffect(() => {
    axios.get('/course/get_classes', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => fetchClasses(res.data.class_ids, token, courseid))
      .then(newClasses => fetchMeetings(newClasses));
  }, [])

  const fetchMeetings = (newClasses) => {
    const fetchMeetingStatus = async () => {
      for (const courseClass of newClasses) {
        const res = await axios.get('/course/live_class_in_progress', {
          params: {
            token,
            course_id: courseid,
            class_id: courseClass.class_id
          }
        })
        courseClass.meeting_active = res.data.meeting_active
      }
      return newClasses
    }

    fetchMeetingStatus()
      .then(newClasses => setClasses(newClasses))
  }

  return (
    <CoursePage
      page={'lessons'}
      title={'Lessons'}
      getRole
      setRole={setRole}
    >
      {(config[role].lessons.can_create &&
        <InfoBox text={
          <>
            To record a meeting, open the meeting in your Zoom application and press the &quot;record&quot; button. Recording will be saved locally. To share recording, upload video to YouTube and upload link in the&nbsp;
            <Link to={(`/course/${courseid}/lessons/recordings`)} sx={{ color: 'primary.contrastText', textDecoration: 'underline' }}>
              Recordings page
            </Link>
            .
          </>
        } />
      )}
      <Button sx={{ mb: 2 }} onClick={() => navigate(`/course/${courseid}/lessons/recordings`)} variant="contained">
        View Recordings
      </Button>

      <TableContainer>
        <Table aria-label="classes table" >
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell align="center">Class ID</TableHeadCell>
              <TableHeadCell>Time</TableHeadCell>
              <TableHeadCell>Lesson</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((currClass, idx) => (
              <TableRow key={idx} sx={{ transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
                <TableCell>
                  <Link to={`/course/${courseid}/classes/${currClass.class_id}/`}>
                    {currClass.name}
                  </Link>
                </TableCell>
                <TableCell align="center">{currClass.class_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{currClass.time !== '' ? dayjs(currClass.time).format('dddd h:mm A') : ''}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {currClass.meeting_active
                    ? <Link to={`/course/${courseid}/lessons/${currClass.class_id}/`}>
                        Join Class
                      </Link>
                    : config[role].lessons.can_create
                      ? <Link to={`/course/${courseid}/lessons/${currClass.class_id}/`}>
                          Start Class
                        </Link>
                      : 'Not in session'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CoursePage>
  )
};

export default CourseLiveClasses;
