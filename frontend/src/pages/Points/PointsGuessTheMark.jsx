import React from 'react';

import PointsPage from 'components/Points/PointsPage';
import { Box, Button, FormControl, FormHelperText, IconButton, InputLabel, Link, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import config from 'config.json';
import GambleOutcome from 'components/Points/GambleOutcome';
import AuthContext from 'AuthContext';
import axios from 'axios';
import ObjectSelect from 'components/ObjectSelect';
import { Close } from '@mui/icons-material';
import InfoBox from 'components/InfoBox';

const defaultError = {
  course: '',
  assessment: '',
  option: '',
  guess: '',
  submission: ''
}

const assessments = [
  'Assignment',
  'Quiz'
]

const assessmentNameKey = {
  Assignment: 'assignment_id',
  Quiz: 'title'
}

const PointsGuessTheMark = () => {
  const [role, setRole] = React.useState('student');
  const [points, setPoints] = React.useState(0);

  const [guess, setGuess] = React.useState('');
  const [error, setError] = React.useState(defaultError);

  const [outcome, setOutcome] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const [courses, setCourses] = React.useState([]);
  const [course, setCourse] = React.useState('');

  const [assessment, setAssessment] = React.useState('');
  const [submission, setSubmission] = React.useState('');
  const [submissions, setSubmissions] = React.useState([]);

  const [options, setOptions] = React.useState([]);
  const [option, setOption] = React.useState('');

  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifText, setNotifText] = React.useState('');

  const [cost, setCost] = React.useState('');
  const [costError, setCostError] = React.useState('');

  const [guessCost, setGuessCost] = React.useState('');

  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/home', {
      params: {
        token
      }
    })
      .then(res => setCourses(res.data.home_courses))
  }, [])

  const fetchPoints = () => {
    axios.get('/game/student_points', {
      params: {
        token,
        course_id: course.course_id
      }
    })
      .then(res => {
        setPoints(res.data.points_balance)
      })
      .catch(() => {})
  }

  React.useEffect(() => {
    if (course !== '') {
      fetchCost();
      if (config[role].points.can_buy_item) {
        fetchPoints();
      }
    }

    if (course !== '' && assessment !== '') {
      if (assessment === 'Quiz') {
        axios.get('/quiz_list', {
          params: {
            token,
            course_id: course.course_id
          }
        })
          .then(res => setOptions(res.data.quizzes))
      } else if (assessment === 'Assignment') {
        axios.get('/course/get_assignments', {
          params: {
            token,
            course_id: course.course_id
          }
        })
          .then(res => setOptions(res.data.all_assignment_info))
      }
    }
  }, [course, assessment])

  React.useEffect(() => {
    if (option !== '' && assessment === 'Assignment' && course !== '') {
      fetchSubmissions();
    }
  }, [option])

  const handleGuess = () => {
    if (course === '') {
      setError({ ...defaultError, course: 'Please select a course' })
      return;
    } else if (assessment === '') {
      setError({ ...defaultError, assessment: 'Please choose an assessment type' });
      return
    } else if (option === '') {
      setError({ ...defaultError, option: 'Please choose an option' });
      return
    } else if (assessment === 'Assignment' && submission === '') {
      setError({ ...defaultError, submission: 'Please choose a submission' });
      return
    } else if (guess === '' || isNaN(guess)) {
      setError({ ...defaultError, guess: 'Please guess an integer mark guess' });
      return
    }

    let data = {
      route: '',
      body: ''
    }

    if (assessment === 'Assignment') {
      data = {
        route: '/game/guess_assignment_mark',
        body: {
          token,
          course_id: course.course_id,
          submission_id: submission.submission_id,
          guess: parseInt(guess)
        }
      }
    } else if (assessment === 'Quiz') {
      data = {
        route: '/game/guess_quiz_mark',
        body: {
          token,
          course_id: course.course_id,
          quiz_id: option.quiz_id,
          guess: parseInt(guess)
        }
      }
    }

    axios.put(data.route, data.body)
      .then(res => {
        console.log(res.data.correct_guess)
        setOutcome(res.data.correct_guess);
        setOpen(true);
        setError({ ...defaultError });
        fetchPoints();
      })
      .catch(err => {
        setNotifOpen(true)
        if ('response' in err) {
          setNotifText(err.response.data.message)
        } else {
          setNotifText('Error occured')
        }
      })
  }

  const handleChangeCost = () => {
    if (cost === '' || isNaN(cost)) {
      setCostError('Please enter an integer cost')
      return;
    }
    axios.put('/game/change_guess_cost', {
      token,
      course_id: course.course_id,
      cost
    })
      .then(() => fetchCost())
  }

  const fetchSubmissions = () => {
    axios.get('/course/get_student_submissions', {
      params: {
        token,
        course_id: course.course_id,
        assignment_id: option.assignment_id
      }
    })
      .then(res => {
        setSubmissions(res.data.student_submission_info)
        console.log(res.data.student_submission_info)
      });
  }

  const fetchCost = () => {
    axios.get('/game/get_guess_cost', {
      params: {
        token,
        course_id: course.course_id
      }
    })
      .then(res => {
        console.log(res.data.guess_cost)
        setGuessCost(res.data.guess_cost)
      })
  }

  return (
    <PointsPage
      page='minigames'
      getRole
      setRole={setRole}
      title={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to={'/points/minigames/'}>
            Minigames
          </Link>
          <KeyboardArrowRightIcon />
          Guess the Mark
        </Box>
      }
      titleEnd={
        config[role].points.can_buy_item &&
          `Your points: ${points}`
      }
    >
      <Snackbar
        open={notifOpen}
        autoHideDuration={6000}
        onClose={() => setNotifOpen(false)}
        message={notifText}
        action={
          <Box>
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setNotifOpen(false)}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        }
      />

      <Typography sx={{ mb: 2 }}>
        Guess your quiz or assignment mark for points!
      </Typography>

      <InfoBox text={
        config[role].points.can_guess_mark
          ? 'After assignment/quiz marks are released, you can guess your mark for a certain amount of points. If you have viewed your mark, you will not be able to guess anymore.'
          : 'After marked asssignments and quizzes are released to students, they can guess their mark for a certain amount of points. If they have viewed their mark, they will not be able to guess. To change the guess cost, select a course first.'
      }/>

      <GambleOutcome open={open} handleClose={() => setOpen(false)} outcome={outcome} />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 4, gap: 2 }}>
        <ObjectSelect objects={courses} labelKey='course_name' value={course} onChange={e => setCourse(e.target.value)} label='Course' error={error.course}/>

        {guessCost !== '' &&
          <Typography>
            Guess cost: {guessCost}
          </Typography>
        }

        <FormControl fullWidth error={error.assessment !== ''}>
          <InputLabel>Assessment</InputLabel>
          <Select
            value={assessment}
            label='Assessment'
            onChange={e => {
              setAssessment(e.target.value)
              setOption('')
            }}
          >
            {assessments.map((currAssessment, idx) =>
              <MenuItem key={idx} value={currAssessment}>{currAssessment}</MenuItem>
            )}
          </Select>
          <FormHelperText>{error.assessment}</FormHelperText>
        </FormControl>

        <ObjectSelect objects={options} labelKey={assessmentNameKey[assessment]} value={option} onChange={e => setOption(e.target.value)} label={assessment + ' ID'} error={error.option}/>

        {assessment === 'Assignment' &&
          <FormControl fullWidth error={error.submission !== ''}>
            <InputLabel>Submission</InputLabel>
            <Select
              value={submission}
              label='Submission'
              onChange={e => setSubmission(e.target.value)}
            >
              {submissions.map((currSubmission, idx) =>
                <MenuItem key={idx} value={currSubmission}>Submission ID {currSubmission.submission_id}</MenuItem>
              )}
            </Select>
            <FormHelperText>{error.submission}</FormHelperText>
          </FormControl>
        }

        <TextField
          label="Guess Mark for Points"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          error={error.guess !== ''}
          helperText={error.guess}
          disabled={!config[role].points.can_guess_mark}
        />

        <Button
          onClick={handleGuess}
          label="guess mark button"
          variant="contained"
          disabled={!config[role].points.can_guess_mark}
        >
          {(config[role].points.can_guess_mark
            ? 'Guess'
            : `${role} can't guess mark`
          )}
        </Button>

        {course !== '' && config[role].points.can_create_item &&
          <Box sx={{ display: 'flex' }}>
            <TextField label="Change Cost" error={costError !== ''} helperText={costError} value={cost} onChange={e => setCost(e.target.value)} size='small'/>
            <Button variant="contained" onClick={handleChangeCost}>Submit</Button>
          </Box>
        }
      </Box>

    </PointsPage>
  )
};

export default PointsGuessTheMark;
