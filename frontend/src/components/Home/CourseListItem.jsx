import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

const CourseListItem = ({ sx, children, course_name = 'course', course_term = '1970', course_id = 1 }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: 5, boxShadow: 2, py: 1, px: 2, borderBottomColor: 'primary.main', ...sx }} onClick={() => navigate(`/course/${course_id}/home`)}>
      <Box>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        {course_name}
        </Typography>
        <Typography>
        {course_term}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}

export default CourseListItem;
