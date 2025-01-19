import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { Autocomplete, Box, Button, Divider, IconButton, TextField } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import Title from 'components/Title';
import BackButton from 'components/BackButton';
import DatePicker from 'components/DatePIcker';
import ImageInput from 'components/ImageInput';
import CreateQuizQuestion from 'components/Quiz/CreateQuizQuestion';
import config from 'config.json';
import { convertImageToBase64, fetchClasses } from 'utils/helpers.js';
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';
import ObjectSelect from 'components/ObjectSelect';

const questionTypes = {
  'Multiple Choice': 'multiple_choice',
  'Short Answer': 'short_answer',
};

const defaultAnswerErrors = config.quizzes.mc_answers.reduce((acc, curr) => ({ ...acc, [curr]: '' }), {});

const defaultErrors = {
  name: '',
  type: '',
  answers: defaultAnswerErrors,
  answer: '',
  marks: '',
  image: ''
};

const defaultQuizErrors = {
  name: '',
  due: '',
  points: ''
};

const emptyQuestion = {
  name: '',
  type: '',
  answers: defaultAnswerErrors,
  correct: '',
  marks: '',
  image: '',
  imageFile: null,
  error: defaultErrors
};

const noneClass = {
  name: 'None',
  class_id: null
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [questions, setQuestions] = React.useState([emptyQuestion])
  const [errors, setErrors] = React.useState(defaultQuizErrors)
  const [date, setDate] = React.useState('');
  const [points, setPoints] = React.useState('');
  const [name, setName] = React.useState('');
  const { token } = React.useContext(AuthContext);
  const [courseClass, setCourseClass] = React.useState('');
  const [classes, setClasses] = React.useState([]);

  React.useEffect(() => {
    axios.get('/course/get_classes', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => {
        fetchClasses(res.data.class_ids, token, courseid)
          .then(newClasses => setClasses([noneClass, ...newClasses]))
      });
  }, [])

  const handleSubmit = () => {
    if (name === '') {
      setErrors({ ...defaultQuizErrors, name: 'Please enter a name' });
      return;
    } else if (date === '' || new Date() > date) {
      setErrors({ ...defaultQuizErrors, due: 'Please enter date in the future' });
      return;
    } else if (points === '' || isNaN(points)) {
      setErrors({ ...defaultQuizErrors, points: 'Please enter integer quiz points amount' });
      return;
    }

    for (const idx in questions) {
      if (questions[idx].name === '') {
        setErrors(defaultQuizErrors);
        setQuestion(idx, 'error', { ...defaultErrors, name: 'Please enter a question' });
        return;
      } else if (questions[idx].type === '') {
        setErrors(defaultQuizErrors);
        setQuestion(idx, 'error', { ...defaultErrors, type: 'Please select a question type' });
        return;
      } else if (questions[idx].type === 'Multiple Choice') {
        if (questions[idx].correct === '') {
          setErrors(defaultQuizErrors);
          setQuestion(idx, 'error', { ...defaultErrors, answer: 'Please select an answer' });
          return;
        }
        for (const answer of config.quizzes.mc_answers) {
          if (questions[idx].answers[answer] === '') {
            setErrors(defaultQuizErrors);
            setQuestion(idx, 'error', { ...defaultErrors, answers: { ...defaultAnswerErrors, [answer]: 'Please enter an answer' } });
            return;
          }
        }
      } else if (questions[idx].type === 'Short Answer' && (questions[idx].marks === '' || isNaN(questions[idx].marks))) {
        setErrors(defaultQuizErrors);
        setQuestion(idx, 'error', { ...defaultErrors, marks: 'Please enter an integer amount of marks' });
        return;
      }
    }

    axios.post('/quiz_create', {
      token,
      title: name,
      course_id: courseid,
      deadline: (new Date(date)).toISOString(),
      class_id: courseClass === '' ? null : courseClass.class_id,
      quiz_points: points,
      questions: questions.reduce((dict, question, idx) => {
        dict[`question ${idx + 1}`] = {
          type: questionTypes[question.type],
          question: question.name,
          file_base64: question.imageFile,
          ...(question.type === 'Multiple Choice'
            ? {
                choice_A: question.answers.A,
                choice_B: question.answers.B,
                choice_C: question.answers.C,
                choice_D: question.answers.D,
                correct_choice: question.correct
              }
            : {
                max_mark: question.marks
              })
        };
        return dict;
      }, {})
    })
      .then(() => {
        const newQuestions = [...questions];
        questions.forEach((_, idx) => {
          newQuestions[idx].error = { ...defaultErrors };
        });
        setQuestions(newQuestions);
        setErrors(defaultQuizErrors);
        navigate(-1);
      })
  }

  const setQuestion = (question, key, value) => {
    const newQuestions = [...questions];
    newQuestions[question] = { ...newQuestions[question], [key]: value };
    setQuestions(newQuestions);
  }

  const handleThumbnailUpload = (idx, e, format) => {
    const newQuestions = [...questions];
    if (format === 'text') {
      newQuestions[idx] = { ...newQuestions[idx], image: e.target.value };
      convertImageToBase64(e.target.value)
        .then(img => {
          newQuestions[idx] = { ...newQuestions[idx], error: { ...defaultErrors }, imageFile: img };
          setQuestions(newQuestions);
        })
        .catch(() => {
          newQuestions[idx] = { ...newQuestions[idx], error: { ...newQuestions[idx].error, image: 'Invalid image' }, imageFile: null };
          setQuestions(newQuestions);
        });
    } else {
      convertImageToBase64(e.target.files[0])
        .then(img => {
          newQuestions[idx] = { ...newQuestions[idx], error: { ...defaultErrors }, imageFile: img, image: e.target.files[0].name };
          setQuestions(newQuestions);
        })
    }
  };

  return (
    <CoursePage
      page={'quizzes'}
      title={'Create New Quiz'}
      titleEnd={<BackButton />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField fullWidth value={name} onChange={e => setName(e.target.value)} label="Quiz Name" size="small" error={errors.name !== ''} helperText={errors.name}/>
        <DatePicker label="Quiz Deadline" onChange={setDate} error={errors.due !== ''} helperText={errors.due} disablePast={true}/>
        <TextField fullWidth value={points} onChange={e => setPoints(e.target.value)} label="Quiz Points" size="small" error={errors.points !== ''} helperText={errors.points}/>

        <ObjectSelect objects={classes} labelKey='name' value={courseClass} onChange={e => setCourseClass(e.target.value)} label='Class' error={''} size='small'/>
      </Box>

      {questions.map((question, idx) =>
        <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <Divider sx={{ mt: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Title divider={false}>
              Question {idx + 1}
            </Title>

            <IconButton onClick={() => setQuestions([...questions, emptyQuestion])}>
              <AddCircleIcon/>
            </IconButton>
            <IconButton onClick={() => {
              if (questions.length > 1) {
                setQuestions(questions.filter((_, idx2) => idx !== idx2));
              }
            }}>
              <RemoveCircleIcon />
            </IconButton>
          </Box>

          <TextField
            value={question.name}
            onChange={(e) => setQuestion(idx, 'name', e.target.value)}
            label="Question name"
            size="small"
            error={question.error.name !== ''}
            helperText={question.error.name}
            />
          <Autocomplete
            onChange={(_, newValue) => setQuestion(idx, 'type', newValue)}
            options={config.quizzes.question_types}
            renderInput={(params) =>
              <TextField {...params}
                label="Answer Type"
                size="small"
                error={question.error.type !== ''}
                helperText={question.error.type}
              />
            }
          />

          <ImageInput
            label='Question Image (Leave blank for no image)'
            value={question.image}
            onChangeText={(e) => handleThumbnailUpload(idx, e, 'text')}
            onChangeIcon={(e) => handleThumbnailUpload(idx, e, 'file')}
            error={question.error.image !== ''}
            helperText={question.error.image}
          />

          <CreateQuizQuestion question={question} setQuestion={setQuestion} questionNumber={idx}/>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleSubmit} variant="contained" size="large">Create Quiz</Button>
      </Box>
    </CoursePage>
  )
};

export default CreateQuiz;
