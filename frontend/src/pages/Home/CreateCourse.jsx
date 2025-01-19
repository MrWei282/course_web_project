import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Box, TextField, Button, IconButton, Autocomplete } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import defaultImage from 'images/CourseDefault.png';
import BackButton from 'components/BackButton';
import Page from 'components/Page';
import PageMain from 'components/PageMain';

import config from 'config.json';
import { convertImageToBase64 } from 'utils/helpers.js';
import UserCourses from 'components/Home/UserCourses';
import ImageInput from 'components/ImageInput';
import AuthContext from 'AuthContext';

const emptyCourse = {
  label: 'None',
  term: 'None',
  id: -1
};

const defaultErrors = {
  thumbnail: '',
  name: '',
  desc: '',
  term: ''
};

const CreateCourse = () => {
  const navigate = useNavigate();
  const { token } = React.useContext(AuthContext);
  const [thumbnail, setThumbnail] = React.useState('');
  const [thumbnailFile, setThumbnailFile] = React.useState('');
  const [errors, setErrors] = React.useState(defaultErrors);
  const [prereq, setPrereq] = React.useState([emptyCourse]);
  const [courses, setCourses] = React.useState([]);

  React.useEffect(() => {
    convertImageToBase64(defaultImage)
      .then(img => setThumbnailFile(img));

    axios.get('/home', {
      params: {
        token
      }
    })
      .then(res => setCourses(res.data.home_courses));
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('name') === '') {
      setErrors({ ...defaultErrors, name: 'Please enter a course name' });
      return;
    } else if (data.get('description') === '') {
      setErrors({ ...defaultErrors, desc: 'Please enter a course description' });
      return;
    } else if (data.get('term') === '') {
      setErrors({ ...defaultErrors, term: 'Please enter a course term' });
      return;
    }

    axios.post('/create_course', {
      token,
      name: data.get('name'),
      term: data.get('term'),
      requirement: prereq.filter(req => req.label !== 'None').map(req => req.label).join(', '),
      description: data.get('description'),
      thumbnail: thumbnailFile
    })
      .then(() => navigate('/dashboard'))
  };

  const handleThumbnailUpload = (e, format) => {
    if (format === 'text') {
      setThumbnail(e.target.value);
      convertImageToBase64(e.target.value)
        .then(img => {
          setThumbnailFile(img);
          setErrors({ ...errors, thumbnail: '' })
        })
        .catch(err => setErrors({ ...errors, thumbnail: err.message + ' Default image will be used.' }));
    } else {
      convertImageToBase64(e.target.files[0])
        .then(img => {
          setThumbnailFile(img);
          setThumbnail(e.target.files[0].name);
          setErrors({ ...errors, thumbnail: '' })
        })
        .catch(err => setErrors({ ...errors, thumbnail: err.message + ' Default image will be used.' }));
    }
  };

  return (
    <Page title={'Dashboard'} page="dashboard">
      <PageMain xs={8} title='Create New Course' titleEnd={<BackButton />}>
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

          <TextField label="Enter course name" name="name" size="small" error={errors.name !== ''} helperText={errors.name} />
          <TextField label="Enter course description" name="description" size="small" error={errors.desc !== ''} helperText={errors.desc} multiline rows={5}/>

          <Autocomplete
            name="terms"
            options={config.terms}
            renderInput={(params) => <TextField {...params} name="term" label="Term" error={errors.term !== ''} helperText={errors.term} />
          }/>

          {prereq.map((_, i) =>
            <Box key={i} sx={{ display: 'flex' }}>
              <Autocomplete
                name={`prerequisite${i}`}
                fullWidth
                value={prereq[i]}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(_, newValue) => {
                  const newPrereq = [...prereq];
                  newPrereq[i] = newValue;
                  setPrereq(newPrereq);
                }}
                options={courses.map(course => ({
                  label: course.course_name,
                  term: course.course_term,
                  id: course.course_id
                }))}
                renderInput={(params) => <TextField {...params} label={`Prerequisite ${i + 1}`} />}
              />
              <IconButton onClick={() => setPrereq([...prereq, emptyCourse])}>
                <AddCircleIcon />
              </IconButton>
              <IconButton onClick={() => {
                if (prereq.length > 1) {
                  const newPrereq = [...prereq];
                  newPrereq.splice(i, 1);
                  setPrereq(newPrereq);
                }
              }}>
                <RemoveCircleIcon />
              </IconButton>
            </Box>)}

          <Button type="submit" sx={{ alignSelf: 'flex-start' }} label="create course button" variant="contained">
            Create Course
          </Button>
        </Box>
      </PageMain>

      <UserCourses courses={courses}/>
    </Page>
  )
};

export default CreateCourse;
