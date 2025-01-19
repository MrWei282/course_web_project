import React from 'react';

import { Box, Container, Grid, Link, Typography } from '@mui/material';

import Navbar from './Navbar/Navbar';

const Page = ({ title = '', subtitle = '', children, titleLink = '', navbar = true, page = '', loading = false }) => {
  return (
    loading
      ? <Box>
          Loading
        </Box>
      : <Box>
          {(navbar && <Navbar page={page} />)}
          <Box sx={{ mx: 3, mt: 4, mb: 2 }}>
            <Container>
              {titleLink === ''
                ? <Typography variant='h5' fontWeight='bold'>
                    {title}
                  </Typography>
                : <Link variant='h5' fontWeight='bold' to={titleLink}>
                    {title}
                  </Link>
              }
              <Typography variant='h6' sx={{ mb: subtitle === '' ? 0 : 2 }}>
                {subtitle}
              </Typography>
            </Container>

            <Container disableGutters>
              <Grid container spacing={2}>
                {children}
              </Grid>
            </Container>
          </Box>
        </Box>
  )
};

export default Page;
