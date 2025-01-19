import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import { Box, TextField, Button, CircularProgress } from '@mui/material';

import BackButton from 'components/BackButton';
import FileInput from 'components/FileInput';
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';
import { fetchClasses } from 'utils/helpers';
import ObjectSelect from 'components/ObjectSelect';

const defaultErrors = {
  name: '',
  description: '',
  categories: '',
  resource: '',
};

const noneClass = {
  name: 'None',
  class_id: null
};

const CreateResource = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [file, setFile] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [errors, setErrors] = React.useState(defaultErrors);
  const [courseClass, setCourseClass] = React.useState('');
  const [classes, setClasses] = React.useState([]);
  const [sending, setSending] = React.useState(false)
  const { token } = React.useContext(AuthContext);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('name') === '') {
      setErrors({ ...defaultErrors, name: 'Please enter a name' });
      return;
    } else if (data.get('description') === '') {
      setErrors({ ...defaultErrors, description: 'Please enter a description' });
      return;
    } else if (data.get('categories') === '') {
      setErrors({ ...defaultErrors, categories: 'Please enter resource categories' });
      return;
    } else if (file === '') {
      setErrors({ ...defaultErrors, resource: 'Please upload a file' });
      return;
    }
    setSending(true);
    axios.post('/course/upload_resources', {
      token,
      course_id: courseid,
      resource_name: data.get('name'),
      resource_description: data.get('description'),
      resource_category: data.get('categories'),
      file_string: file,
      class_id: courseClass === '' ? null : courseClass.class_id
    })
      .then(() => {
        navigate(-1)
        setSending(false)
      })
      .catch(() => {
        setSending(false)
        navigate(-1)
      })
  }

  return (
    <CoursePage
      page={'resources'}
      title={'Create New Resource'}
      titleEnd={<BackButton />}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField name="name" label="Resource file name" error={errors.name !== ''} helperText={errors.name} size="small"/>
        <TextField name="description" label="Resource description" size="small" error={errors.description !== ''} helperText={errors.description} multiline rows={5}/>
        <TextField name="categories" label="Resource categories (space separated)" error={errors.categories !== ''} helperText={errors.categories} size="small"/>

        <ObjectSelect objects={classes} labelKey='name' value={courseClass} onChange={e => setCourseClass(e.target.value)} label='Class' error={''} size='small'/>

        <FileInput label='Upload Resource File' error={errors.resource} setError={(msg) => setErrors({ ...errors, resource: msg })} setFile={setFile} fileName={fileName} setFileName={setFileName} />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button type="submit" sx={{ alignSelf: 'flex-start' }} label="create course button" variant="contained">
            Create Resource
          </Button>
          {(sending &&
            <CircularProgress size={25} />
          )}
        </Box>
      </Box>
    </CoursePage>
  )
};

export default CreateResource;
