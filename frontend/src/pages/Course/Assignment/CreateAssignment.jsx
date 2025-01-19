import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import { Box, TextField, Button } from '@mui/material';

import BackButton from 'components/BackButton';
import DatePicker from 'components/DatePIcker';
import FileInput from 'components/FileInput';
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';
import { fetchClasses } from 'utils/helpers';
import ObjectSelect from 'components/ObjectSelect';

const defaultErrors = {
  name: '',
  description: '',
  grade: '',
  percentage: '',
  due: '',
  file: '',
  points: ''
};

const CreateAssignment = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [errors, setErrors] = React.useState(defaultErrors);
  const [file, setFile] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [date, setDate] = React.useState('');
  const [courseClass, setCourseClass] = React.useState('');
  const { token } = React.useContext(AuthContext);

  const [classes, setClasses] = React.useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('name') === '') {
      setErrors({ ...defaultErrors, name: 'Please enter a name' });
      return;
    } else if (data.get('description') === '') {
      setErrors({ ...defaultErrors, description: 'Please enter a description' });
      return;
    } else if (data.get('grade') === '' || isNaN(data.get('grade'))) {
      setErrors({ ...defaultErrors, grade: 'Please enter integer maximum grade' });
      return;
    } else if (data.get('percentage') === '' || isNaN(data.get('percentage'))) {
      setErrors({ ...defaultErrors, percentage: 'Please enter integer course mark percentage' });
      return;
    } else if (date === '' || new Date() > date) {
      setErrors({ ...defaultErrors, due: 'Please enter date in the future' });
      return;
    } else if (data.get('points') === '' || isNaN(data.get('points'))) {
      setErrors({ ...defaultErrors, points: 'Please enter integer assignment points amount' });
      return;
    } else if (file === '') {
      setErrors({ ...defaultErrors, file: 'Please upload a file' });
      return;
    }
    axios.post('/course/create_assignment', {
      token,
      course_id: courseid,
      assignment_name: data.get('name'),
      assignment_description: data.get('description'),
      assignment_grade: data.get('grade'),
      assignment_percentage: data.get('percentage'),
      file_string: file,
      due_date: (new Date(date)).toISOString(),
      class_id: courseClass === '' ? null : courseClass.class_id,
      assignment_points: data.get('points')
    })
      .then(() => navigate(-1))
  };

  React.useEffect(() => {
    axios.get('/course/get_classes', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => {
        fetchClasses(res.data.class_ids, token, courseid)
          .then(newClasses => {
            newClasses.unshift({
              name: 'None',
              class_id: null
            })
            setClasses(newClasses)
          })
      });
  }, [])

  return (
    <CoursePage
      title={'Create new assignment'}
      titleEnd={<BackButton />}
      page={'assignments'}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField name="name" label="Assignment Name" size="small" error={errors.name !== ''} helperText={errors.name}/>
        <TextField name="description" label="Assignment Description" size="small" error={errors.description !== ''} helperText={errors.description} multiline rows={5}/>
        <TextField name="grade" label="Assignment Grade" size="small" error={errors.grade !== ''} helperText={errors.grade}/>
        <TextField name="percentage" label="Assignment Percentage" size="small" error={errors.percentage !== ''} helperText={errors.percentage}/>

        <DatePicker label='Assignment Due Date' onChange={(d) => setDate(d)} error={errors.due !== ''} helperText={errors.due} disablePast={true}/>

        <TextField name="points" label="Assignment Points" size="small" error={errors.points !== ''} helperText={errors.points}/>

        <ObjectSelect objects={classes} labelKey='name' value={courseClass} onChange={e => setCourseClass(e.target.value)} label='Class' error={''} size='small'/>

        <FileInput label='Upload Assignment File' error={errors.file} setError={(msg) => setErrors({ ...errors, file: msg })} setFile={setFile} fileName={fileName} setFileName={setFileName} />

        <Button type="submit" sx={{ alignSelf: 'flex-start' }} label="create course button" variant="contained" >
          Create Assignment
        </Button>
      </Box>
    </CoursePage>
  )
};

export default CreateAssignment;
