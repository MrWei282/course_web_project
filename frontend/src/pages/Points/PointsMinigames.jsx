import React from 'react';

import PointsPage from 'components/Points/PointsPage';
import Title from 'components/Title';
import { Link, Typography } from '@mui/material';

const PointsMinigames = () => {
  return (
    <PointsPage
      page='minigames'
      title='Minigames'
    >
      <Title divider={false}>
        <Link to='/points/minigames/spin'>
          Spin the Wheel
        </Link>
      </Title>
      <Typography sx={{ mb: 2 }}>
        Spin the Wheel to try your luck and receive a random prize!
      </Typography>

      <Title divider={false}>
        <Link to='/points/minigames/guess'>
          Guess the Mark
        </Link>
      </Title>
      <Typography sx={{ mb: 2 }}>
        Guess your quiz or assignment mark for points!
      </Typography>
    </PointsPage>
  )
};

export default PointsMinigames;
