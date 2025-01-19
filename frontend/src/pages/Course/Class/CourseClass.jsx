import React from 'react';
import { useParams } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';
import AuthContext from 'AuthContext';
import BackButton from 'components/BackButton';
import CoursePage from 'components/Course/CoursePage';
import axios from 'axios';
import Title from 'components/Title';
import dayjs from 'dayjs';
import config from 'config.json';

const CourseClass = () => {
  const [role, setRole] = React.useState('student');
  const { courseid, classid } = useParams();
  const [courseClass, setCourseClass] = React.useState({});
  const [joined, setJoined] = React.useState(true);
  const { token } = React.useContext(AuthContext);

  const checkJoined = () => {
    axios.get('/course/check_in_class', {
      params: {
        token,
        class_id: classid
      }
    })
      .then(res => setJoined(res.data.in_class))
  }

  React.useEffect(() => {
    axios.get('/course/get_class_info', {
      params: {
        token,
        course_id: courseid,
        class_id: classid
      }
    })
      .then(res => setCourseClass(res.data))
    checkJoined();
  }, []);

  const handleJoinClass = () => {
    axios.post('/course/insert_class', {
      token,
      course_id: courseid,
      class_id: classid
    })
      .then(() => checkJoined());
  }

  return (
    <CoursePage
      page={'classes'}
      title={courseClass.name}
      titleEnd={<BackButton />}
      getRole
      setRole={setRole}
      titleStart={
        <Box component="img" sx={{ aspectRatio: 1, width: '125px' }} alt="course image" src={courseClass.thumbnail}/>
      }
    >
      <Title divider={false}>
        Class ID
      </Title>
      <Typography>
        {classid}
      </Typography>

      <Title divider={false}>
        Description
      </Title>
      <Typography>
        {courseClass.description}
      </Typography>

      <Title divider={false}>
        Time
      </Title>
      <Typography>
        {courseClass.time !== '' ? dayjs(courseClass.time).format('dddd h:mm A') : ''}
      </Typography>

      {(config[role].classes.join &&
        <Button sx={{ my: 2 }} onClick={handleJoinClass} label="join class" variant="contained" disabled={joined}>
          {joined ? 'Already member of class' : 'Join Class'}
        </Button>
      )}
    </CoursePage>
  )
};

export default CourseClass;
