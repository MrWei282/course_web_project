import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, TextField, Button, FormControl, InputLabel, Select, FormHelperText, MenuItem } from '@mui/material';

import BackButton from 'components/BackButton';
import defaultImage from 'images/CourseDefault.png';
import CoursePage from 'components/Course/CoursePage';
import { convertImageToBase64, getDateTime } from 'utils/helpers.js';
import AuthContext from 'AuthContext';
import ImageInput from 'components/ImageInput';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';

const defaultErrors = {
  name: '',
  day: '',
  time: '',
  description: '',
  thumbnail: '',
};

const days = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' },
];

const CreateClass = () => {
  const navigate = useNavigate();
  const { token } = React.useContext(AuthContext);
  const [thumbnail, setThumbnail] = React.useState('');
  const [thumbnailFile, setThumbnailFile] = React.useState('');
  const [time, setTime] = React.useState('');
  const [day, setDay] = React.useState('');
  const [errors, setErrors] = React.useState(defaultErrors);
  const { courseid } = useParams();

  // set default img
  React.useEffect(() => {
    convertImageToBase64(defaultImage)
      .then(img => setThumbnailFile(img));
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('name') === '') {
      setErrors({ ...defaultErrors, name: 'Please enter a class name' });
      return;
    } else if (data.get('description') === '') {
      setErrors({ ...defaultErrors, description: 'Please enter a class description' });
      return;
    } else if (day === '') {
      setErrors({ ...defaultErrors, day: 'Please enter a day' });
      return;
    } else if (time === '') {
      setErrors({ ...defaultErrors, time: 'Please enter a time' });
      return;
    }

    axios.post('/course/create_class', {
      token,
      name: data.get('name'),
      course_id: courseid,
      time: getDateTime(day, time),
      description: data.get('description'),
      thumbnail: thumbnailFile
    })
      .then(() => navigate(-1))
  }

  const handleThumbnailUpload = (e, format) => {
    if (format === 'text') {
      setThumbnail(e.target.value);
      convertImageToBase64(e.target.value)
        .then(img => {
          setThumbnailFile(img);
          setErrors({ ...errors, thumbnail: '' })
        })
        .catch(err => setErrors({ ...errors, thumbnail: err.message }));
    } else {
      convertImageToBase64(e.target.files[0])
        .then(img => {
          setThumbnailFile(img);
          setThumbnail(e.target.files[0].name);
          setErrors({ ...errors, thumbnail: '' })
        })
        .catch(err => setErrors({ ...errors, thumbnail: err.message }));
    }
  };

  return (
    <CoursePage
      page={'classes'}
      title={'Create new class'}
      titleEnd={<BackButton />}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box component="img" sx={{ aspectRatio: 1, width: '125px', objectFit: 'cover' }} alt="course image" src={thumbnailFile} />
        <ImageInput
          label='Thumbnail'
          value={thumbnail}
          onChangeText={(e) => handleThumbnailUpload(e, 'text')}
          onChangeIcon={(e) => handleThumbnailUpload(e, 'file')}
          error={errors.thumbnail !== ''}
          helperText={errors.thumbnail}
        />
        <TextField label="Class name" name='name' variant="outlined" size="small" error={errors.name !== ''} helperText={errors.name}/>
        <TextField label="Class description" name='description' variant="outlined" size="small" error={errors.description !== ''} helperText={errors.description} multiline rows={5}/>

        <FormControl error={errors.day !== ''} size='small'>
          <InputLabel>
            Day
          </InputLabel>
          <Select
            value={day}
            onChange={e => setDay(e.target.value)}
            label="Day"
          >
            {days.map((currDay) => (
              <MenuItem key={currDay.value} value={currDay.value}>
                {currDay.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.day}</FormHelperText>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker label="Time" value={time} onChange={e => setTime(e)} slotProps={{
            textField: {
              error: errors.time !== '',
              helperText: errors.time,
              size: 'small'
            },
          }}/>
        </LocalizationProvider>

        <Button type="submit" sx={{ alignSelf: 'flex-start' }} label="create class button" variant="contained" >
          Create Class
        </Button>
      </Box>
    </CoursePage>
  )
};

export default CreateClass;
