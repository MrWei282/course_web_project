import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Box, Typography } from '@mui/material';

const CourseQuizTodo = ({ course, quiz }) => {
  dayjs.extend(relativeTime);
  const navigate = useNavigate();

  return (
    <Box sx={{ cursor: 'pointer', borderBottom: 5, boxShadow: 2, py: 1, px: 2, borderBottomColor: 'primary.main', }} onClick={() => navigate(`/course/${course.course_id}/home`)}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        Quiz {quiz.quiz_id}: {quiz.title}
        </Typography>
        <Typography sx={{ color: 'warning.main', fontWeight: 'bold' }}>
          Due {dayjs(quiz.deadline).fromNow()}
        </Typography>
      </Box>

      <Typography>
        {course.course_name}
      </Typography>
    </Box>
  );
}

export default CourseQuizTodo;
