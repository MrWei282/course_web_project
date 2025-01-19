import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';
import config from 'config.json';
import { Link, Typography } from '@mui/material';

const CourseLiveClass = () => {
  dayjs.extend(relativeTime);
  const [role, setRole] = React.useState('student');
  const { courseid, classid } = useParams();
  const [courseClass, setCourseClass] = React.useState({});
  const { token } = React.useContext(AuthContext);

  const [link, setLink] = React.useState('');

  React.useEffect(() => {
    axios.get('/course/get_class_info', {
      params: {
        token,
        course_id: courseid,
        class_id: classid
      }
    })
      .then(res => setCourseClass(res.data))
  }, []);

  const fetchLink = (type) => {
    axios.get(`/course/get_live_class_${type}_link`, {
      params: {
        token,
        course_id: courseid,
        class_id: classid
      }
    })
      .then(res => setLink(res.data[`${type}_link`]))
      .catch(() => {})
  }

  React.useEffect(() => {
    // check lesson started
    axios.get('/course/live_class_in_progress', {
      params: {
        token,
        course_id: courseid,
        class_id: classid
      }
    })
      .then(res => {
        if (config[role].lessons.can_create) {
          // start meeting if not started
          if (!res.data.meeting_active) {
            axios.post('/course/start_live_class', {
              token,
              course_id: courseid,
              class_id: classid
            })
              .then(() => fetchLink('start'))
          } else {
            fetchLink('start')
          }
        } else {
          fetchLink('join')
        }
      })
  }, [role])

  return (
    <CoursePage
      page={'lessons'}
      title={'Lessons'}
      getRole
      setRole={setRole}
    >
      <Typography>
        Class {courseClass.name}
      </Typography>
      <Typography>
        To record meeting, open the meeting in the Zoom app and press the &quot;Record&quot; button at the bottom. Recordings will be saved locally.
      </Typography>
      <Link to={link} target="_blank">
        Open meeting in new tab
      </Link>
    </CoursePage>
  )
};

export default CourseLiveClass;
