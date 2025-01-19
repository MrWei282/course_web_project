import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardMedia, Typography } from '@mui/material';

import defaultImage from 'images/CourseDefault.png';

const CourseCard = ({ sx, course_name = 'course', course_thumbnail = defaultImage, course_term = '1970', course_id = 1 }) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ cursor: 'pointer', borderBottom: 5, borderBottomColor: 'primary.main', ...sx }} onClick={() => navigate(`/course/${course_id}/home`)} >
      <CardMedia
        alt='course thumbnail'
        sx={{ height: '200px' }}
        image={course_thumbnail === '' ? defaultImage : course_thumbnail}
        title="course"
      />
      <CardContent sx={{ p: 1 }}>
        <Typography>
          {course_name}
        </Typography>
        <Typography>
          {course_term}
        </Typography>
        <Typography>
          ID: {course_id}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CourseCard;
