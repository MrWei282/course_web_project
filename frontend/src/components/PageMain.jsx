import React from 'react';

import { Container, Grid } from '@mui/material';

import Title from './Title';

const PageMain = ({ title, titleStart, titleEnd, xs = 10, children }) => {
  return (
    <Grid item xs={xs}>
      <Container sx={{ height: 1, backgroundColor: 'white', borderRadius: 1, p: 2 }}>
        <Title start={titleStart} end={titleEnd}>
          {title}
        </Title>

        {children}
      </Container>
    </Grid>
  )
};

export default PageMain;
