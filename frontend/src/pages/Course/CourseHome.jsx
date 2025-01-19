import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';

const CourseHome = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const storedCourses = JSON.parse(localStorage.getItem('courses') || '{}');
  const [course, setCourse] = React.useState(courseid in storedCourses ? storedCourses[courseid] : {});
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/search_course', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => setCourse(res.data))
      .catch(() => navigate('/dashboard'))
  }, []);

  return (
    <CoursePage
      page='home'
      title={`Welcome to ${course.course_name}`}
      titleStart={
        <Box component="img" sx={{ aspectRatio: 1, width: '125px' }} alt="course image" src={course.course_thumbnail}/>
      }
    >
      <Typography aria-label="course id" >
        ID: {course.course_id}
      </Typography>
      <Typography aria-label="course term" >
        Term: {course.course_term}
      </Typography>
    </CoursePage>
  )
};

export default CourseHome;
