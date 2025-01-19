import React from 'react';

import { TextField, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Title from 'components/Title';
import CloseIcon from '@mui/icons-material/Close';
import ModalInterface from 'components/ModalInterface';
import AuthContext from 'AuthContext';
import ProfileIconButton from 'components/Profile/ProfileIconButton';
import axios from 'axios';

const defaultErrors = {
  title: '',
  type: '',
  points: '',
  condition: ''
};

const missionTypes = [
  {
    label: 'Complete Assignments',
    value: 'assignment',
  },
  {
    label: 'Complete Quizzes',
    value: 'quiz',
  },
  {
    label: 'Guess The Mark',
    value: 'guess_mark',
  },
  {
    label: 'Spin The Wheel',
    value: 'spin_wheel',
  },
  {
    label: 'Purchase Items',
    value: 'shop',
  }
]

const PointsCreateMission = ({ open, handleClose, courseId }) => {
  const [errors, setErrors] = React.useState(defaultErrors);
  const [type, setType] = React.useState('');
  const { token } = React.useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('title') === '') {
      setErrors({ ...defaultErrors, title: 'Please enter a mission title' });
      return;
    } else if (data.get('type') === '') {
      setErrors({ ...defaultErrors, type: 'Please select a mission type' });
      return;
    } else if (data.get('condition') === '' || isNaN(data.get('condition'))) {
      setErrors({ ...defaultErrors, condition: 'Please enter an integer mission condition' });
      return;
    } else if (data.get('points') === '' || isNaN(data.get('points'))) {
      setErrors({ ...defaultErrors, points: 'Please enter an integer mission points reward' });
      return;
    }

    axios.post('/game/create_mission', {
      token,
      course_id: courseId,
      mission_title: data.get('title'),
      mission_type: type,
      points: parseInt(data.get('points')),
      condition: parseInt(data.get('condition'))
    })
      .then(() => {
        setErrors({ ...defaultErrors });
        handleClose();
      })
  }

  return (
    <ModalInterface
      open={open}
      handleClose={handleClose}
      aria-label="create item modal"
    >
      <Title end={<ProfileIconButton onClick={handleClose} icon={<CloseIcon />}/>}>
        Create Mission
      </Title>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Title" name="title" error={errors.title !== ''} helperText={errors.title}/>

        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={e => setType(e.target.value)}
          >
            {missionTypes.map((type, idx) =>
              <MenuItem key={idx} value={type.value}>{type.label}</MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField label="Condition (Number of times)" name="condition" error={errors.condition !== ''} helperText={errors.condition}/>
        <TextField label="Points" name="points" error={errors.points !== ''} helperText={errors.points}/>

        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </ModalInterface>
  )
};

export default PointsCreateMission;
