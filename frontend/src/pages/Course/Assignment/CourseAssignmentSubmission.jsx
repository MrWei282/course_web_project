import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { triggerBase64Download } from 'common-base64-downloader-react';

import { Box, TextField, Button } from '@mui/material';

import BackButton from 'components/BackButton';
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';

const defaultErrors = {
  feedback: '',
  grade: '',
};

const CourseAssignmentSubmission = () => {
  const navigate = useNavigate();
  const { courseid, assignmentid, submissionid } = useParams();
  const [errors, setErrors] = React.useState(defaultErrors);
  const { token } = React.useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('feedback') === '') {
      setErrors({ ...defaultErrors, feedback: 'Please enter feedback' });
      return;
    } else if (data.get('grade') === '' || isNaN(data.get('grade'))) {
      setErrors({ ...defaultErrors, grade: 'Please enter integer grade' });
      return;
    }

    axios.put('/course/mark_submission', {
      token,
      course_id: courseid,
      submission_id: submissionid,
      grade: data.get('grade'),
      feedback: data.get('feedback'),
    })
      .then(() => navigate(-1))
  };

  const handleDownload = () => {
    axios.get('/course/download_submission', {
      params: {
        token,
        course_id: courseid,
        submission_id: submissionid
      }
    })
      .then(res => triggerBase64Download(res.data.submission.file, res.data.submission.name))
  }

  return (
    <CoursePage
      page='assignments'
      title={`Submission ${submissionid} for Assignment ${assignmentid}`}
      titleEnd={<BackButton />}
    >
      <Button onClick={handleDownload} sx={{ mb: 2 }} variant="contained" >
        Download Submission
      </Button>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField name="feedback" label="Submission Feedback" variant="outlined" size="small" error={errors.feedback !== ''} helperText={errors.feedback} multiline rows={5}/>
        <TextField name="grade" label="Submission Grade" variant="outlined" size="small" error={errors.grade !== ''} helperText={errors.grade}/>

        <Button type="submit" sx={{ alignSelf: 'flex-start' }} label="mark submission button" variant="contained" >
          Mark Submission
        </Button>
      </Box>
    </CoursePage>
  )
};

export default CourseAssignmentSubmission;
