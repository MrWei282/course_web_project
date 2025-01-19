import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Container, Grid } from '@mui/material';

import config from 'config.json';

const CourseNav = ({ id, page }) => {
  const navigate = useNavigate();
  return (
    <Grid item xs={2}>
      <Container disableGutters sx={{ flex: 1, height: '100%', backgroundColor: 'white', borderRadius: 1, p: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {config.pages.course.map((currPage, idx) => (
          <Button
            key={idx}
            onClick={() => navigate(`/course/${id}/${currPage.link}`)}
            aria-label={currPage.name}
            sx={{
              fontSize: '1em',
              color: `${currPage.name.toLowerCase() === page ? 'primary.darker' : 'text.primary'}`,
              fontWeight: `${currPage.name.toLowerCase() === page ? 'bold' : 'regular'}`,
              backgroundColor: `${currPage.name.toLowerCase() === page ? 'primary.light' : 'white'}`,
              width: 1,
              pl: 2,
              borderLeft: `${currPage.name.toLowerCase() === page ? '4px solid' : '0px solid'}`,
              borderLeftColor: 'primary.darker',
              justifyContent: 'flex-start',
              '&:hover': { backgroundColor: 'primary.light', },
            }}>
            {currPage.name}
          </Button>
        ))}
      </Container>
    </Grid>
  )
};

export default CourseNav;
