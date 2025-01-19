import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Box, Button, Tab, Tabs } from '@mui/material';

import config from 'config.json';
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';
import QuizDisplay from 'components/Quiz/QuizDisplay';

const CourseQuizzes = () => {
  dayjs.extend(relativeTime);
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [role, setRole] = React.useState('student');
  const [quizzes, setQuizzes] = React.useState([]);
  const { token } = React.useContext(AuthContext);
  const [userClasses, setUserClasses] = React.useState([]);
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    axios.get('/quiz_list', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => setQuizzes(res.data.quizzes))

    axios.get('/course/get_user_classes', {
      params: {
        token,
        course_id: courseid,
      }
    })
      .then(res => {
        setUserClasses(res.data.class_ids)
      })
  }, []);

  return (
    <CoursePage
      page={'quizzes'}
      title={'Quizzes'}
      getRole
      setRole={setRole}
    >
      {(config[role].quizzes.create &&
        <Button sx={{ mb: 2 }} onClick={() => navigate(`/course/${courseid}/quizzes/create-quiz`)} label="create quiz button" variant="contained">
          New Quiz
        </Button>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
        <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
          <Tab label="Course" />
          <Tab label="Class" />
        </Tabs>
      </Box>

      <Box display={value === 0 ? 'block' : 'none'}>
        <QuizDisplay quizzes={quizzes.filter(quiz => quiz.class_id === null)} courseid={courseid} />
      </Box>

      <Box display={value === 1 ? 'block' : 'none'}>
        <QuizDisplay
          showClass
          courseid={courseid}
          quizzes={
            config[role].quizzes.view_all
              ? quizzes.filter(quiz => quiz.class_id !== null)
              : quizzes.filter(quiz => userClasses.includes(quiz.class_id))
          }
        />
      </Box>

    </CoursePage>
  )
};

export default CourseQuizzes;
