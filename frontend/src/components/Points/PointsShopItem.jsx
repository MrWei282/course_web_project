import React from 'react';

import { Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

const PointsShopItem = ({ item, action }) => {
  return (
    <Card sx={{ borderBottom: 5, borderBottomColor: 'primary.main' }}>
      <CardMedia
        alt='item thumbnail'
        sx={{ height: '100px', width: '180px' }}
        image={item.item_file}
        title="item thumbnail"
      />
      <CardContent>
        <Typography variant='h7' color="text.secondary">
          Item
        </Typography>
        <Typography variant="h5" fontWeight='bold'>
          {item.item_name}
        </Typography>
        <Typography>
          {item.item_desc}
        </Typography>
      </CardContent>
      <CardActions>
        {action}
      </CardActions>
    </Card>
  )
};

export default PointsShopItem;
