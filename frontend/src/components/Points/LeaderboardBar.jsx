import React from 'react';

import { Box, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { formatNum } from 'utils/helpers';
import axios from 'axios';

const LeaderboardBar = ({ svg, colour, width = 100, user, id, points }) => {
  const [pfp, setPfp] = React.useState(null);
  React.useEffect(() => {
    if (id !== '') {
      axios.get('/user_info', {
        params: {
          user_id: id
        }
      })
        .then(res => setPfp(res.data.user_avatar))
        .catch(() => {})
    }
  }, [id])

  return (
    <Box sx={{ width: `${width}px` }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {pfp === null
          ? <AccountCircleIcon sx={{ fontSize: '40px' }}/>
          : <Box component='img' src={pfp} height='40px' width='40px'/>
        }
        <Typography fontWeight='bold' variant='h6'>
          {user}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '30%', backgroundColor: colour, p: 0.5, px: 1.5, borderRadius: 2, display: 'flex' }}>
          <Typography fontWeight='bold' color='primary.contrastText'>
            {formatNum(points, 0)}
          </Typography>
          <Typography fontWeight='bold' fontSize='small' marginTop={0.25} color='primary.contrastText'>
            p
          </Typography>
        </Box>
        <Box component="img" width={1} src={svg}/>
      </Box>
    </Box>
  )
};

export default LeaderboardBar;
