import React from 'react';

import { Container } from '@mui/material';

import CourseListItem from 'components/Home/CourseListItem';
import PageMain from 'components/PageMain';

const UserCourses = ({ courses }) => {
  return (
    <PageMain title='Your Courses' xs={4}>
      <Container disableGutters sx={{ display: 'flex', justifyContent: 'center', my: 2, gap: 2, flexDirection: 'column' }}>
        {courses
          .sort((a, b) => a.course_name.localeCompare(b.course_name))
          .map((course, idx) => <CourseListItem {...course} key={idx} />)
        }
      </Container>
    </PageMain>
  )
};

export default UserCourses;
