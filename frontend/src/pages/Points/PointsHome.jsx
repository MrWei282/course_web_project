import React from 'react';

import PointsPage from 'components/Points/PointsPage';
import { Button } from '@mui/material';
import SendPoints from 'components/Points/SendPoints';

const PointsHome = () => {
  const [sendOpen, setSendOpen] = React.useState(false);

  return (
    <PointsPage
      page='home'
      title='Your Points Dashboard'
    >
      <SendPoints open={sendOpen} handleClose={() => setSendOpen(false)}/>
      <Button type="submit" variant="contained" onClick={() => setSendOpen(true)}>Send Points</Button>

    </PointsPage>
  )
};

export default PointsHome;
