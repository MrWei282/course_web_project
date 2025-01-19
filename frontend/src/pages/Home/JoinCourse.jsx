import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Accordion, AccordionDetails, AccordionSummary, Box, Container, TextField, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import BackButton from 'components/BackButton';
import Page from 'components/Page';
import PageMain from 'components/PageMain';
import UserCourses from 'components/Home/UserCourses';
import AuthContext from 'AuthContext';

const JoinCourse = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [expanded, setExpanded] = React.useState(false);
  const [courses, setCourses] = React.useState([]);
  const [enrolledCourses, setEnrolledCourses] = React.useState([]);
  const [error, setError] = React.useState('');
  const { token } = React.useContext(AuthContext);

  const handleEnrol = (course) => {
    axios.post('/enrol_request_course', {
      token,
      course_id: course.course_id
    })
      .then(() => navigate('/dashboard'))
      .catch(() => {})
  };

  React.useEffect(() => {
    axios.get('/home', {
      params: {
        token
      }
    })
      .then(res => setEnrolledCourses(res.data.home_courses));
  }, []);

  React.useEffect(() => {
    if (search === '') {
      return;
    }
    if (isNaN(search)) {
      setError('Please enter integer ID');
      return;
    }
    axios.get('/search_course', {
      params: {
        token,
        course_id: search
      }
    })
      .then(res => {
        setError('');
        setCourses([res.data])
      })
      .catch(err => setError(err.response.data.message))
  }, [search]);

  return (
    <Page title={'Dashboard'} page="dashboard">
      <PageMain xs={8} title='Join Course' titleEnd={<BackButton />}>
        <TextField fullWidth label="Search courses by ID" variant="outlined" size="small" onChange={(e) => setSearch(e.target.value)} error={error !== ''} helperText={error} />

        <Container disableGutters sx={{ display: 'flex', justifyContent: 'center', my: 2, gap: 2, flexDirection: 'column' }}>
          {courses
            .sort((a, b) => a.course_name.localeCompare(b.course_name))
            .filter(course => course.course_name.includes(search) || course.course_term.includes(search) || true)
            .map((course, idx) => (
            <Accordion key={idx} sx={{ borderBottom: 5, borderBottomColor: 'primary.main' }} expanded={expanded === course.course_id} onChange={() => expanded !== course.course_id ? setExpanded(course.course_id) : setExpanded(false)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                <Box >
                  <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                    {course.course_name}
                  </Typography>
                  <Typography>
                    {course.course_term}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Course ID: {course.course_id}
                </Typography>
                <Button disabled={enrolledCourses.map(enrolledCourse => enrolledCourse.course_id).includes(course.course_id)} label="enrol button" variant="contained" onClick={() => handleEnrol(course)} >
                  {enrolledCourses.map(enrolledCourse => enrolledCourse.course_id).includes(course.course_id) ? 'Already Enrolled' : 'Enrol'}
                </Button>
              </AccordionDetails>
            </Accordion>
            ))}
        </Container>
      </PageMain>

      <UserCourses courses={enrolledCourses}/>
    </Page>
  )
};

export default JoinCourse;
