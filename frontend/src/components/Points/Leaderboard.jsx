import React from 'react';

import first from 'images/Leaderboard/1st.svg';
import second from 'images/Leaderboard/2nd.svg';
import third from 'images/Leaderboard/3rd.svg';
import LeaderboardBar from './LeaderboardBar';
import { Box, Typography } from '@mui/material';
import UserInfo from 'components/UserInfo';

const filler = {
  user_firstname: 'None',
  user_lastname: '',
  user_points: 0
}

const Leaderboard = ({ ranking }) => {
  const getFullName = (student) => {
    return `${student.user_firstname} ${student.user_lastname}`
  }
  const getStudentName = (idx) => {
    return ranking.length > idx ? getFullName(ranking[idx]) : getFullName(filler);
  }

  const getStudentPoints = (idx) => {
    return ranking.length > idx ? ranking[idx].user_points : filler.user_points;
  }

  const getStudentId = (idx) => {
    return ranking.length > idx ? ranking[idx].user_id : '';
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <LeaderboardBar svg={second} colour='#808084' user={getStudentName(1)} id={getStudentId(1)} points={getStudentPoints(1)} />
        <LeaderboardBar svg={first} colour='#C39628' user={getStudentName(0)} id={getStudentId(0)} points={getStudentPoints(0)} />
        <LeaderboardBar svg={third} colour='#876B4A' user={getStudentName(2)} id={getStudentId(2)} points={getStudentPoints(2)} />
      </Box>
      {ranking
        .slice(3)
        .map((student, idx) =>
          <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
            <Typography>{idx + 3}.</Typography>
            <UserInfo userId={student.student_id} />
            <Typography>{student.user_points} points</Typography>
          </Box>
        )
      }
    </Box>
  )
};

export default Leaderboard;
