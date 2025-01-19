import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material';

import BackButton from 'components/BackButton';
import config from 'config.json';
import Title from 'components/Title';
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';

const questionTypes = {
  multiple_choice: 'Multiple Choice',
  short_answer: 'Short Answer'
};

const CourseQuizSubmission = () => {
  const navigate = useNavigate();
  const { courseid, quizid, userid } = useParams();
  const [questions, setQuestions] = React.useState([]);
  const [submission, setSubmission] = React.useState(['empty']);
  const [marks, setMarks] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [defaultErrors, setDefaultErrors] = React.useState({});
  const [feedback, setFeedback] = React.useState('');
  const [feedbackError, setFeedbackError] = React.useState('');
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/quiz_get_questions', {
      params: {
        token,
        course_id: courseid,
        quiz_id: quizid
      }
    })
      .then(res => {
        setMarks(res.data.questions.reduce((acc, curr) => ({ ...acc, [curr.question_id]: '' }), {}))
        setErrors(res.data.questions.reduce((acc, curr) => ({ ...acc, [curr.question_id]: '' }), {}))
        setDefaultErrors(res.data.questions.reduce((acc, curr) => ({ ...acc, [curr.question_id]: '' }), {}))
        setQuestions(res.data.questions)
      });

    axios.get('/quiz_view_submissions_to_mark', {
      params: {
        token,
        quiz_id: quizid,
      }
    })
      .then(res => setSubmission(res.data.submissions.filter(submission => submission.user_id === parseInt(userid))[0].response));
  }, []);

  const handleSubmit = () => {
    if (feedback === '') {
      setErrors({ ...defaultErrors });
      setFeedbackError('Please enter feedback');
      return;
    }
    for (const question of questions) {
      if (question.type === 'short_answer' && (marks[question.question_id] === '' || isNaN(marks[question.question_id]) || parseInt(marks[question.question_id]) > parseInt(question.max_mark))) {
        setErrors({ ...defaultErrors, [question.question_id]: 'Integer mark required' });
        setFeedbackError('');
        return;
      }
    }

    axios.post('/quiz_mark', {
      token,
      quiz_id: quizid,
      student_id: userid,
      marking: questions
        .filter(question => question.type === 'short_answer')
        .reduce((acc, curr) => ({ ...acc, [`question ${curr.question_id}`]: parseInt(marks[curr.question_id]) }), {}),
      course_id: courseid,
      feedback
    })
      .then(() => navigate(-1))
  }

  return (
    <CoursePage
      page={'quizzes'}
      title={`User ${userid} submission for Quiz ${quizid}`}
      titleEnd={<BackButton />}
    >
      <Title divider={false}>
        Questions:
      </Title>
      {questions.map((question, idx) =>
        <Box key={idx}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography fontWeight='bold'>
                Q{question.question_id}: {question.question}
              </Typography>
              {question.file_base64 && (
                <Box component="img" src={question.file_base64} maxHeight={150}/>
              )}
            </Box>
            <Box>
              <Typography align='right'>
                Worth {question.max_mark} mark{question.max_mark === 1 ? '' : 's'}
              </Typography>
              <Typography fontSize='small' align='right'>
                {questionTypes[question.type]}
              </Typography>
            </Box>
          </Box>

          {(submission.filter((sub) => sub.question_id === question.question_id).length > 0 &&
            ((question.type === 'multiple_choice' &&
              <FormControl component="fieldset">
                <FormGroup>
                  {config.quizzes.mc_answers.map((answer, idx) =>
                    <FormControlLabel key={idx} label={question[`choice_${answer}`]} control={
                      <Checkbox disabled checked={submission.filter((sub) => sub.question_id === question.question_id)[0].submitted_response === answer} />
                    }/>
                  )}
                </FormGroup>
              </FormControl>) ||
            (question.type === 'short_answer' &&
              <Box>
                <Typography fontWeight='bold'>
                  Student Response:
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  {submission.filter((sub) => sub.question_id === question.question_id)[0].submitted_response}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'end', gap: 2 }}>
                  <TextField sx={{ width: 75, mt: 1, whiteSpace: 'nowrap' }} value={marks[question.question_id]} onChange={e => setMarks({ ...marks, [question.question_id]: e.target.value })} label="Mark" size="small" error={errors[question.question_id] !== ''} helperText={errors[question.question_id]}/>
                  <Typography>
                    / {question.max_mark} marks
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}
      <Divider sx={{ my: 2 }} />
      <TextField value={feedback} onChange={e => setFeedback(e.target.value)} label="Submission Feedback" size="small" error={feedbackError !== ''} helperText={feedbackError}/>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={handleSubmit} variant="contained" size="large">
          Submit Marks
        </Button>
      </Box>
    </CoursePage>
  )
};

export default CourseQuizSubmission;
