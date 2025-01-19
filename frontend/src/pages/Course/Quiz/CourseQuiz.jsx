import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Divider, IconButton, Typography } from '@mui/material';

import Title from 'components/Title';
import config from 'config.json';
import BackButton from 'components/BackButton';
import QuizQuestion from 'components/Quiz/QuizQuestion';
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';
import UserInfo from 'components/UserInfo';
import QuizEditPoints from 'components/Quiz/QuizEditPoints';
import EditIcon from '@mui/icons-material/Edit';

const CourseQuiz = () => {
  dayjs.extend(relativeTime);
  const navigate = useNavigate();
  const { courseid, quizid } = useParams();
  const [role, setRole] = React.useState('student');
  const [quiz, setQuiz] = React.useState({});
  const [questions, setQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState({});
  const [defaultErrors, setDefaultErrors] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const [marks, setMarks] = React.useState({});
  const [marked, setMarked] = React.useState(false);
  const [error, setError] = React.useState('');
  const { token } = React.useContext(AuthContext);
  const [open, setOpen] = React.useState(false);

  const fetchQuiz = () => {
    axios.get('/quiz_list', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => setQuiz(res.data.quizzes.filter(quiz => parseInt(quiz.quiz_id) === parseInt(quizid))[0]))
  }

  React.useEffect(() => {
    fetchQuiz();

    axios.get('/quiz_get_questions', {
      params: {
        token,
        course_id: courseid,
        quiz_id: quizid
      }
    })
      .then(res => {
        setQuestions(res.data.questions)
        setAnswers(res.data.questions.reduce((acc, curr) => ({ ...acc, [curr.question_id]: '' }), {}))
        setErrors(res.data.questions.reduce((acc, curr) => ({ ...acc, [curr.question_id]: '' }), {}))
        setDefaultErrors(res.data.questions.reduce((acc, curr) => ({ ...acc, [curr.question_id]: '' }), {}))
      })
      .then(() => axios.get('/quiz_view_submission', {
        params: {
          token,
          quiz_id: quizid
        }
      }))
      .then(res => {
        if (res.data.submission.length > 0) {
          setAnswers(res.data.submission.reduce((acc, curr) => ({ ...acc, [curr.question_id]: curr.submitted_response }), {}));
          setSubmitted(true);
        }
      })
      .catch(() => {});

    axios.get('/quiz_view_released_marks', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => {
        const releasedMarks = res.data.released.filter(quiz => quiz.quiz_id === parseInt(quizid));
        if (releasedMarks.length > 0) {
          setMarks(releasedMarks[0]);
          setMarked(true);
        }
      })
  }, []);

  const handleSubmit = () => {
    for (const question of questions) {
      if (answers[question.question_id] === '') {
        setErrors({ ...defaultErrors, [question.question_id]: question.type === 'multiple_choice' ? 'Please select an answer' : 'Please write an answer' });
        return;
      }
    }

    axios.post('/quiz_submit', {
      token,
      quiz_id: quizid,
      course_id: courseid,
      response: questions.reduce((acc, curr) => ({ ...acc, [`question ${curr.question_id}`]: answers[curr.question_id] }), {})
    })
      .then(() => navigate(-1))
      .catch(err => setError(err.response.data.message))
  }

  return (
    <CoursePage
      title={`Quiz ${quizid}`}
      titleEnd={<BackButton />}
      page={'quizzes'}
      getRole
      setRole={setRole}
    >
      <Typography sx={{ color: 'warning.main', fontWeight: 'bold' }}>
        Due at {dayjs(quiz.deadline).format('DD/MM/YYYY h:mm A')} {dayjs(quiz.deadline).fromNow()}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Typography>
          Created on {dayjs(quiz.create_time).format('DD/MM/YYYY h:mm A')} by
        </Typography>
        <UserInfo userId={quiz.creator_id} icon={false}/>
      </Box>

      <QuizEditPoints open={open} handleClose={() => setOpen(false)} quizId={quizid} fetchQuiz={fetchQuiz} />
      <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        Points: {quiz.quiz_points}
        <IconButton sx={{ p: 0, m: 0 }} onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>
      </Typography>

      {(config[role].quizzes.can_view_submissions &&
        <Button onClick={() => navigate(`/course/${courseid}/quizzes/${quizid}/submissions`)} variant="contained">
          View Submissions
        </Button>
      )}
      <Divider sx={{ my: 2 }} />

      {(marked &&
        <Box>
          <Title divider={false}>
            Marks: {marks.mark} / {marks.max_mark}
          </Title>
          <Typography fontWeight={'bold'}>
            Feedback:
          </Typography>
          <Typography>
            {marks.feedback}
          </Typography>
        <Divider sx={{ my: 2 }} />
        </Box>
      )}

      <Title divider={false}>
        Questions:
      </Title>
      {questions.map((question, idx) =>
        <QuizQuestion key={idx} question={question} editable={!config[role].quizzes.can_answer || submitted} answers={answers} setAnswers={setAnswers} errors={errors} />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 2 }}>
        <Typography color='error.main' fontWeight='bold'>
          {error}
        </Typography>
        <Button disabled={!config[role].quizzes.can_answer || submitted} onClick={handleSubmit} variant="contained" size="large">
          {
            (submitted && 'Submitted') ||
            (config[role].quizzes.can_answer && 'Submit Answers') ||
            (!config[role].quizzes.can_answer && `${role} Cannot Submit`)
          }
        </Button>
      </Box>
    </CoursePage>
  )
};

export default CourseQuiz;
