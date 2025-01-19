import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, ButtonGroup, Container, TextField, InputAdornment, Select, MenuItem, FormControl, Divider, Typography } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Edit, Sort, CalendarViewMonth } from '@mui/icons-material';

import CourseCard from 'components/Home/CourseCard';
import CourseListItem from 'components/Home/CourseListItem';
import config from 'config.json';

const CourseDisplay = ({ courses, role, courseDisplayNum = 5, courseDisplayPadding = 0.5 }) => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [order, setOrder] = React.useState('course_name');
  const [view, setView] = React.useState('card');
  const [allCourseNum, setAllCourseNum] = React.useState(0);

  const handleChangeAllCourseNum = (diff) => {
    if (!(allCourseNum + diff < 0 || allCourseNum + courseDisplayNum * diff > courses.length)) {
      setAllCourseNum(allCourseNum + courseDisplayNum * diff);
    }
  }

  return (
    <Box>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField label="Search courses" size="small" sx={{ flexGrow: 1 }} onChange={(e) => setSearch(e.target.value)} />
      <FormControl size="small">
        <Select value={order} onChange={(e) => setOrder(e.target.value)} startAdornment={
          <InputAdornment position="start">
            <Sort />
          </InputAdornment>
        }>
          <MenuItem value={'course_name'}>Course Name</MenuItem>
          <MenuItem value={'course_term'}>Course Term</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small">
        <Select value={view} onChange={(e) => setView(e.target.value)} startAdornment={
          <InputAdornment position="start">
            <CalendarViewMonth />
          </InputAdornment>
        }>
          <MenuItem value={'card'}>Card</MenuItem>
          <MenuItem value={'list'}>List</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" sx={{ fontWeight: 'bold' }} onClick={() => navigate(`/${config[role].dashboard.link}`)}>
        {config[role].dashboard.button}
        <Edit sx={{ ml: 1 }} fontSize='small' />
      </Button>
    </Box>

  <Container sx={{ display: 'flex', justifyContent: 'center', my: 2, gap: 2, flexDirection: `${view === 'card' ? 'row' : 'column'}` }}>
    {courses.length > 0
      ? courses
        .sort((a, b) => a[order].localeCompare(b[order]))
        .filter(course => course.course_name.includes(search) || course.course_term.includes(search))
        .slice(allCourseNum, allCourseNum + courseDisplayNum)
        .map((course, idx) => (
          (view === 'card' && <CourseCard {...course} key={idx} sx={{ flex: 1, maxWidth: 'calc(100% / ' + `${courseDisplayNum + courseDisplayPadding}` + ')' }}/>) ||
          (view === 'list' && <CourseListItem {...course} key={idx} />)
        ))
      : <Typography variant="h6" sx={{ my: 3 }}>
          No Courses
        </Typography>
    }
  </Container>

  <Divider>
    <ButtonGroup disableElevation size="small" >
      <Button onClick={() => handleChangeAllCourseNum(-1)} >
        <KeyboardArrowLeft />
      </Button>
      <Button onClick={() => handleChangeAllCourseNum(1)} >
        <KeyboardArrowRight />
      </Button>
    </ButtonGroup>
  </Divider>
  </Box>

  );
}

export default CourseDisplay;
