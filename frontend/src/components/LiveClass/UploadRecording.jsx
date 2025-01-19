import React from 'react';

import { TextField, Box, Button, Tooltip, InputAdornment } from '@mui/material';
import Title from 'components/Title';
import CloseIcon from '@mui/icons-material/Close';
import ModalInterface from 'components/ModalInterface';
import ProfileIconButton from 'components/Profile/ProfileIconButton';
import axios from 'axios';
import AuthContext from 'AuthContext';
import ObjectSelect from 'components/ObjectSelect';
import { fetchClasses } from 'utils/helpers.js';
import { ErrorOutline } from '@mui/icons-material';

const defaultErrors = {
  course: '',
  title: '',
  description: '',
  link: '',
  chat: '',
};

const UploadRecording = ({ open, handleClose, courseId, fetchRecordings }) => {
  const [errors, setErrors] = React.useState(defaultErrors);
  const { token } = React.useContext(AuthContext);
  const [courseClass, setCourseClass] = React.useState('');
  const [classes, setClasses] = React.useState([]);

  React.useEffect(() => {
    axios.get('/course/get_classes', {
      params: {
        token,
        course_id: courseId
      }
    })
      .then(res => {
        fetchClasses(res.data.class_ids, token, courseId)
          .then(newClasses => setClasses(newClasses))
      });
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (courseClass === '') {
      setErrors({ ...defaultErrors, course: 'Please select a course' });
      return;
    } else if (data.get('title') === '') {
      setErrors({ ...defaultErrors, title: 'Please enter a title' });
      return;
    } else if (data.get('description') === '') {
      setErrors({ ...defaultErrors, description: 'Please enter a description' });
      return;
    } else if (data.get('link') === '') {
      setErrors({ ...defaultErrors, link: 'Please enter link to video (YouTube, etc.)' });
      return;
    }

    axios.post('/publish_recording', {
      token,
      course_id: courseId,
      class_id: courseClass === '' ? null : courseClass.class_id,
      title: data.get('title'),
      description: data.get('description'),
      link: data.get('link'),
      chat_log: data.get('chat')
    })
      .then(() => {
        setErrors({ ...defaultErrors });
        handleClose();
        fetchRecordings();
      })
  }

  return (
    <ModalInterface
      open={open}
      handleClose={handleClose}
      aria-label="upload lesson modal"
    >
      <Title end={<ProfileIconButton onClick={handleClose} icon={<CloseIcon />}/>}>
        Upload Link
      </Title>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ObjectSelect objects={classes} labelKey='name' value={courseClass} onChange={e => setCourseClass(e.target.value)} label='Class' error={errors.course}/>
        <TextField label="Title" name="title" error={errors.title !== ''} helperText={errors.title} />
        <TextField label="Description" name="description" error={errors.description !== ''} helperText={errors.description}/>
        <TextField
          label="Recording Link"
          name="link"
          error={errors.link !== ''}
          helperText={errors.link}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <Tooltip title="Link to a video (YouTube, etc...)" placement="top">
                  <ErrorOutline/>
                </Tooltip>
              </InputAdornment>,
          }}
        />
        <TextField
          label="Recording Chat Log"
          name="chat"
          error={errors.chat !== ''}
          helperText={errors.chat} multiline rows={2}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <Tooltip title="Copy + paste text from chat log file or other location" placement="top">
                  <ErrorOutline/>
                </Tooltip>
              </InputAdornment>,
          }}
        />
        <Button type="submit" variant="contained">Upload</Button>
      </Box>
    </ModalInterface>
  )
};

export default UploadRecording;
