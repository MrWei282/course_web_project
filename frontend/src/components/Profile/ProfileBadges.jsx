import React from 'react';
import { Box, Tooltip } from '@mui/material';
import badge1 from 'images/Badges/badge1.png';
import badge2 from 'images/Badges/badge2.png';
import badge3 from 'images/Badges/badge3.png';
import badge4 from 'images/Badges/badge4.png';
import badge5 from 'images/Badges/badge5.png';

const badgeInfo = {
  assignment_badge: {
    label: 'Assignment badge',
    img: badge1
  },
  quiz_badge: {
    label: 'Quiz badge',
    img: badge2
  },
  mark_badge: {
    label: 'Mark badge',
    img: badge3
  },
  wheel_badge: {
    label: 'Wheel badge',
    img: badge4
  },
  item_badge: {
    label: 'Item badge',
    img: badge5
  },
}

const ProfileBadges = ({ badges }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
      {badges.map((badge, idx) =>
        <Tooltip key={idx} title={badgeInfo[badge].label} placement="top">
          <Box
            component='img'
            src={badgeInfo[badge].img}
            alt='badge icon'
            sx={{ height: '50px' }}
          />
        </Tooltip>
      )}
    </Box>
  )
};

export default ProfileBadges;
