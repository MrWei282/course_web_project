import React from 'react';

import PointsPage from 'components/Points/PointsPage';
import Leaderboard from 'components/Points/Leaderboard';
import axios from 'axios';
import AuthContext from 'AuthContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const PointsRanking = () => {
  const [courses, setCourses] = React.useState([]);
  const [course, setCourse] = React.useState('');
  const [ranking, setRanking] = React.useState([]);
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/home', {
      params: {
        token
      }
    })
      .then(res => setCourses(res.data.home_courses))
  }, [])

  React.useEffect(() => {
    if (course !== '') {
      axios.get('/game/rank_students', {
        params: {
          token,
          course_id: course.course_id
        }
      })
        .then(res => {
          setRanking(res.data.rankings)
        })
    }
  }, [course])

  return (
    <PointsPage
      page='ranking'
      title='Ranking'
    >
      <FormControl fullWidth sx={{ mb: 2 }} size='small'>
        <InputLabel>Course</InputLabel>
        <Select
          value={course}
          label="Course"
          onChange={e => setCourse(e.target.value)}
        >
          {courses.map(course =>
            <MenuItem key={course.course_id} value={course}>{course.course_name}</MenuItem>
          )}
        </Select>
      </FormControl>

      <Leaderboard ranking={ranking} />
    </PointsPage>
  )
};

export default PointsRanking;
