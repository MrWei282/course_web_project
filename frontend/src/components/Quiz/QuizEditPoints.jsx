import React from 'react';

import { Box, Button, TextField } from '@mui/material';
import Title from 'components/Title';
import CloseIcon from '@mui/icons-material/Close';
import ModalInterface from 'components/ModalInterface';
import ProfileIconButton from 'components/Profile/ProfileIconButton';
import axios from 'axios';
import AuthContext from 'AuthContext';

const QuizEditPoints = ({ open, handleClose, quizId, fetchQuiz }) => {
  const [points, setPoints] = React.useState('');
  const [error, setError] = React.useState('');
  const { token } = React.useContext(AuthContext);

  const handleSubmit = () => {
    if (points === '' || isNaN(points)) {
      setError('Please enter integer assignment points amount');
      return;
    }

    axios.put('/quiz/edit_points', {
      token,
      quiz_id: quizId,
      quiz_points: points
    })
      .then(() => {
        handleClose()
        fetchQuiz();
      })
      .catch(err => console.log(err))
  }

  return (
    <ModalInterface
      open={open}
      handleClose={handleClose}
      aria-label="edit quiz points modal"
    >
      <Title end={<ProfileIconButton onClick={handleClose} icon={<CloseIcon />}/>}>
        Edit Post
      </Title>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField value={points} onChange={e => setPoints(e.target.value)} label="Quiz Points" error={error !== ''} helperText={error} />
        <Button type="submit" variant="contained" onClick={handleSubmit}>Submit</Button>
      </Box>
    </ModalInterface>
  )
};

export default QuizEditPoints;
