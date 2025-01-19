import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useNavigate, useParams } from 'react-router-dom';
import { triggerBase64Download } from 'common-base64-downloader-react';

import { Box, Button, Divider, IconButton, Typography } from '@mui/material';

import Title from 'components/Title';
import config from 'config.json';
import BackButton from 'components/BackButton';
import AuthContext from 'AuthContext';
import AssignmentSubmission from 'components/Assignment/AssignmentSubmission';
import CoursePage from 'components/Course/CoursePage';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentEditPoints from 'components/Assignment/AssignmentEditPoints';

const CourseAssignment = () => {
  dayjs.extend(relativeTime);
  const navigate = useNavigate();
  const { courseid, assignmentid } = useParams();
  const [role, setRole] = React.useState('student');
  const [assignment, setAssignment] = React.useState({});
  const [submission, setSubmission] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const { token } = React.useContext(AuthContext);

  const fetchAssignment = () => {
    axios.get('/assignment_info', {
      params: {
        assignment_id: assignmentid
      }
    })
      .then(res => setAssignment(res.data))
  }

  React.useEffect(() => {
    fetchAssignment()
  }, []);

  const handleDownload = () => {
    axios.get('/course/download_assignment', {
      params: {
        token,
        course_id: courseid,
        assignment_id: assignmentid
      }
    })
      .then(res => triggerBase64Download(res.data.assignment.file, res.data.assignment.name))
  }

  const getSubmission = () => {
    axios.get('/course/get_student_submissions', {
      params: {
        token,
        course_id: courseid,
        assignment_id: assignmentid
      }
    })
      .then(res => {
        setSubmission(res.data.student_submission_info)
        console.log(res.data)
      });
  }

  React.useEffect(() => {
    // check for feedback
    if (config[role].submissions.submitter) {
      getSubmission();
    }
  }, [role]);

  const handleSubmit = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      axios.post('/course/create_submission', {
        token,
        course_id: courseid,
        assignment_id: assignmentid,
        submission_name: file.name,
        file_string: reader.result,
        submit_time: (new Date()).toISOString(),
        max_grade: assignment.assignment_grade
      })
        .then(() => getSubmission())
    };
    reader.readAsDataURL(file);
  }

  return (
    <CoursePage
      page='assignments'
      title={`Assignment ${assignmentid}`}
      titleEnd={<BackButton />}
      getRole
      setRole={setRole}
    >
      <Typography sx={{ color: 'warning.main', fontWeight: 'bold' }}>
        Due at {dayjs(assignment.assignment_due_date).format('DD/MM/YYYY h:mm A')} {dayjs(assignment.assignment_due_date).fromNow()}
      </Typography>
      <Button onClick={handleDownload} label="download assignment button" variant="contained">
        Download Assignment Specification
      </Button>
      <Divider sx={{ my: 2 }} />
      <Title divider={false}>
        Details
      </Title>
      <Typography>
        {assignment.assignment_description}
      </Typography>
      <Typography>
        Assignment grade: {assignment.assignment_grade}
      </Typography>
      {(assignment.class_id !== null &&
        <Typography>
          Class ID: {assignment.class_id}
        </Typography>
      )}
      <Typography>
        Course percentage: {assignment.assignment_percentage}
      </Typography>
      <AssignmentEditPoints open={open} handleClose={() => setOpen(false)} assignmentId={assignmentid} fetchAssignment={fetchAssignment}/>
      <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        Points: {assignment.assignment_points}
        <IconButton sx={{ p: 0, m: 0 }} onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>
      </Typography>
      {(config[role].submissions.submitter && submission !== null && submission.length > 0 &&
        <Box>
          <Divider sx={{ my: 2 }} />
          <Title divider={false}>
            Your Latest Submission
          </Title>
          <AssignmentSubmission submission={submission.sort((a, b) => (new Date(b.submission_time)) - (new Date(a.submission_time)))[0]} token={token} courseId={courseid}/>
        </Box>
      )}
      <Divider sx={{ my: 2 }} />
      {config[role].submissions.function === 'view'
        ? <Button onClick={() => navigate(`/course/${courseid}/assignments/${assignmentid}/submissions`)} label="submissions button" variant="contained">
            {config[role].submissions.button}
          </Button>
        : <Button variant="contained" component="label">
            {config[role].submissions.button}
            <input type="file" hidden onChange={handleSubmit} />
          </Button>
      }
    </CoursePage>
  )
};

export default CourseAssignment;
