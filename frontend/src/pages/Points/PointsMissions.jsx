import React from 'react';

import PointsPage from 'components/Points/PointsPage';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TableHeadCell from 'components/TableHeadCell';
import ObjectSelect from 'components/ObjectSelect';
import AuthContext from 'AuthContext';
import axios from 'axios';
import config from 'config.json';
import PointsCreateMission from 'components/Points/PointsCreateMission';
import InfoBox from 'components/InfoBox';

const PointsMissions = () => {
  const [missions, setMissions] = React.useState([]);
  const [courses, setCourses] = React.useState([]);
  const [course, setCourse] = React.useState('');
  const { token } = React.useContext(AuthContext);
  const [role, setRole] = React.useState('student');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [points, setPoints] = React.useState(0);

  React.useEffect(() => {
    axios.get('/home', {
      params: {
        token
      }
    })
      .then(res => setCourses(res.data.home_courses))
  }, []);

  React.useEffect(() => {
    if (course !== '') {
      fetchMissions();
      axios.get('/game/student_points', {
        params: {
          token,
          course_id: course.course_id
        }
      })
        .then(res => {
          setPoints(res.data.points_balance)
        })
        .catch(() => {})
    }
  }, [course])

  const fetchMissions = () => {
    if (config[role].points.can_view_mission) {
      axios.get('/game/missions_page', {
        params: {
          token,
          course_id: course.course_id
        }
      })
        .then(res => setMissions(res.data.missions))
        .catch(() => {})
    }
  }

  return (
    <PointsPage
      page='missions'
      title='Missions'
      getRole
      setRole={setRole}
      titleEnd={
        config[role].points.can_buy_item &&
          `Your points: ${points}`
      }
    >
      {(config[role].points.can_create_item &&
        <InfoBox text='Lecturers and teachers are able to create missions for students to complete.' />
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <ObjectSelect objects={courses} labelKey='course_name' value={course} onChange={e => setCourse(e.target.value)} label='Course' size='small'/>
        {(config[role].points.can_create_item && course !== '' &&
          <Box sx={{ flexShrink: 0 }}>
            <PointsCreateMission open={createOpen} handleClose={() => setCreateOpen(false)} courseId={course.course_id}/>
            <Button onClick={() => setCreateOpen(true)} label="create mission button" variant="contained">
              New Mission
            </Button>
          </Box>
        )}
      </Box>

      {config[role].points.can_view_mission && course !== '' &&
        <TableContainer>
          <Table aria-label="missions table" >
            <TableHead>
              <TableRow>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Mission</TableHeadCell>
                <TableHeadCell>Condition</TableHeadCell>
                <TableHeadCell align='center'>Points</TableHeadCell>
                <TableHeadCell align='center'>Status</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {missions
                .map((mission, idx) => (
                <TableRow key={idx} sx={{ transition: 'background-color 0.1s ease-in-out', '&:hover': { backgroundColor: 'primary.light' } }}>
                  <TableCell>{mission.mission_title}</TableCell>
                  <TableCell>{mission.mission_content}</TableCell>
                  <TableCell>{mission.condition} times</TableCell>
                  <TableCell align="center">{mission.points}</TableCell>
                  <TableCell align='center'>{mission.is_achieved ? 'Completed' : 'Not completed'}</TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </PointsPage>
  )
};

export default PointsMissions;
