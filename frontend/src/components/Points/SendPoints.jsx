import React from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';
import Title from 'components/Title';
import CloseIcon from '@mui/icons-material/Close';
import ModalInterface from 'components/ModalInterface';
import ProfileIconButton from 'components/Profile/ProfileIconButton';
import axios from 'axios';
import AuthContext from 'AuthContext';
import ObjectSelect from 'components/ObjectSelect';

const SendPoints = ({ open, handleClose }) => {
  const [id, setId] = React.useState('');
  const [points, setPoints] = React.useState('');

  const [idError, setIdError] = React.useState('');
  const [pointsError, setPointsError] = React.useState('');
  const [courseError, setCourseError] = React.useState('');

  const [lookup, setLookup] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const [sendingUserPoints, setSendingUserPoints] = React.useState(null);

  const [courses, setCourses] = React.useState([]);
  const [course, setCourse] = React.useState('');
  const [sendError, setSendError] = React.useState('');
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/home', {
      params: {
        token
      }
    })
      .then(res => setCourses(res.data.home_courses))
  }, [])

  React.useEffect(() => {
    if (course !== '') {
      axios.get('/game/student_points', {
        params: {
          token,
          course_id: course.course_id
        }
      })
        .then(res => {
          setSendingUserPoints(res.data.points_balance)
        })
    }
  }, [course])

  React.useEffect(() => {
    if (id !== '' && !isNaN(id)) {
      setLookup(true)
      axios.get('/user_info', {
        params: {
          user_id: id
        }
      })
        .then(res => {
          setUser(res.data)
          setIdError('')
          setLookup(false)
        })
        .catch(() => {
          setUser(null)
          setLookup(false)
        })
    }
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id === '' || user === null) {
      setIdError('Please enter a valid user')
      setSendError('');
      return;
    } else if (course === '') {
      setIdError('')
      setSendError('');
      setCourseError('Please select a course')
      return;
    } else if (points === '' || isNaN(points)) {
      setIdError('')
      setCourseError('')
      setSendError('');
      setPointsError('Please enter an integer amount of points')
      return;
    }

    axios.put('/game/share_points', {
      token,
      reciever_id: id,
      course_id: course.course_id,
      points
    })
      .then(() => {
        setPointsError('')
        setCourseError('')
        setIdError('');
        setSendError('');
        handleClose();
      })
      .catch(err => {
        setSendError(err.response.data.message);
      })
  }

  return (
    <ModalInterface
      open={open}
      handleClose={handleClose}
      aria-label="send points modal"
    >
      <Title end={<ProfileIconButton onClick={handleClose} icon={<CloseIcon />}/>}>
        Send Points
      </Title>
      {sendingUserPoints !== null &&
        <Typography>
          Current Points: {sendingUserPoints}
        </Typography>
      }
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField value={id} onChange={e => setId(e.target.value)} label="ID to send" name="id" error={idError !== ''} helperText={
          user !== null
            ? `Found user: ${user.user_firstname} ${user.user_lastname}`
            : idError
        } />

        <ObjectSelect objects={courses} labelKey='course_name' value={course} onChange={e => setCourse(e.target.value)} label='Course' error={courseError}/>

        <TextField value={points} onChange={e => setPoints(e.target.value)} label="Points" name="points" error={pointsError !== ''} helperText={pointsError} />
        <Button onClick={handleSubmit} variant="contained" disabled={lookup}>
          {lookup
            ? 'Searching for user'
            : 'Send'
          }
        </Button>
        <Typography color='error.main'>
          {sendError}
        </Typography>
      </Box>
    </ModalInterface>
  )
};

export default SendPoints;
