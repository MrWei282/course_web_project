import React from 'react';
import axios from 'axios';

import { useParams } from 'react-router-dom';

import { Link, Typography } from '@mui/material';

import Title from 'components/Title';
import BackButton from 'components/BackButton';
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';

const CourseRecording = () => {
  const { courseid, classid, recordingid } = useParams();
  const [recording, setRecording] = React.useState(null);
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/recordings', {
      params: {
        token,
        course_id: courseid,
        class_id: classid,
      }
    })
      .then(res => {
        setRecording(res.data.recordings.filter(recording => parseInt(recording.id) === parseInt(recordingid))[0])
      })
      .catch(() => {})
  }, []);

  return (
    recording === null
      ? <Typography>
        Loading...
        </Typography>
      : <CoursePage
          page={'lessons'}
          title={`Lesson Recording ${recording.id}`}
          titleEnd={<BackButton />}
        >
          <Title divider={false}>
            {recording.title}
          </Title>
          <Typography>
            {recording.description}
          </Typography>

          <Title divider={false}>
            Link
          </Title>
          <Link to={recording.link} rel="noopener noreferrer" target="_blank">
            {recording.link}
          </Link>

          <Title>
            Chat Log
          </Title>
          <Typography sx={{ whiteSpace: 'pre-line' }}>
            {recording.chat_log}
          </Typography>
        </CoursePage>
  )
};

export default CourseRecording;
