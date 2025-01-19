import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Box, Typography } from '@mui/material';

const CourseAssignmentTodo = ({ course, assignment }) => {
  dayjs.extend(relativeTime);
  const navigate = useNavigate();

  return (
    <Box sx={{ cursor: 'pointer', borderBottom: 5, boxShadow: 2, py: 1, px: 2, borderBottomColor: 'primary.main', }} onClick={() => navigate(`/course/${course.course_id}/home`)}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        Assignment {assignment.assignment_id}
        </Typography>
        <Typography sx={{ color: 'warning.main', fontWeight: 'bold' }}>
          Due {dayjs(assignment.assignment_due_date).fromNow()}
        </Typography>
      </Box>

      <Typography>
        {course.course_name}
      </Typography>
    </Box>
  );
}

export default CourseAssignmentTodo;
