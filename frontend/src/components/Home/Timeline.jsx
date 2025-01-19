import React from 'react';

import { Container } from '@mui/material';

import PageMain from 'components/PageMain';
import CourseAssignmentTodo from './CourseAssignmentTodo';
import CourseQuizTodo from './CourseQuizTodo';

const Timeline = ({ courses, todos }) => {
  return (
    <PageMain title='Timeline' xs={4}>
      <Container disableGutters sx={{ display: 'flex', justifyContent: 'center', my: 2, gap: 2, flexDirection: 'column' }}>
      {(courses.every(course => course.course_id in todos) &&
          courses
            .map((course) =>
              todos[course.course_id].assignments
                .filter(todo => (new Date(todo.assignment_due_date)) - (new Date()) > 0)
                .map((todo, idx) =>
                  <CourseAssignmentTodo course={course} key={idx} assignment={todo} />
                )
            )
      )}

      {(courses.every(course => course.course_id in todos) &&
          courses
            .map((course) =>
              todos[course.course_id].quizzes
                .filter(todo => (new Date(todo.deadline)) - (new Date()) > 0)
                .map((todo, idx) =>
                  <CourseQuizTodo course={course} key={idx} quiz={todo} />
                )
            )
      )}
      </Container>
    </PageMain>
  )
};

export default Timeline;
