import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Tab, Tabs } from '@mui/material';

import config from 'config.json';
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';
import AssignmentsDisplay from 'components/Assignment/AssignmentsDisplay';

const CourseAssignments = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [role, setRole] = React.useState('student');
  const [assignments, setAssignments] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [userClasses, setUserClasses] = React.useState([]);
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/course/get_assignments', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => setAssignments(res.data.all_assignment_info))
      .catch(() => navigate('/dashboard'));

    axios.get('/course/get_user_classes', {
      params: {
        token,
        course_id: courseid,
      }
    })
      .then(res => setUserClasses(res.data.class_ids))
  }, []);

  return (
    <CoursePage
      page='assignments'
      title='Assignments'
      getRole
      setRole={setRole}
    >
      {(config[role].assignments.create &&
        <Button sx={{ mb: 2 }} onClick={() => navigate(`/course/${courseid}/assignments/create-assignment`)} label="course assignments" variant="contained">
          New Assignment
        </Button>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
        <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
          <Tab label="Course" />
          <Tab label="Class" />
        </Tabs>
      </Box>

      <Box display={value === 0 ? 'block' : 'none'}>
        <AssignmentsDisplay assignments={assignments.filter(assignment => assignment.class_id === null)} courseid={courseid}/>
      </Box>

      <Box display={value === 1 ? 'block' : 'none'}>
        <AssignmentsDisplay
          showClass
          courseid={courseid}
          assignments={
            config[role].assignments.view_all
              ? assignments.filter(assignment => assignment.class_id !== null)
              : assignments.filter(assignment => userClasses.includes(assignment.class_id))
          }
        />
      </Box>
    </CoursePage>
  )
};

export default CourseAssignments;
