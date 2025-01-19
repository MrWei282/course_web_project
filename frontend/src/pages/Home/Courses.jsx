import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Page from 'components/Page';
import CourseDisplay from 'components/Home/CourseDisplay';
import PageMain from 'components/PageMain';
import AuthContext from 'AuthContext';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = React.useState([]);
  const [role, setRole] = React.useState('');
  const { token, userId } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/user_info', {
      params: {
        user_id: userId
      }
    })
      .then(res => setRole(res.data.user_role))
      .catch(() => navigate('/logout'))

    axios.get('/home', {
      params: {
        token
      }
    })
      .then(res => setCourses(res.data.home_courses))
      .catch(() => navigate('/logout'))
  }, []);

  return (
    <Page title={'Courses'} page="courses" loading={role === ''}>
      <PageMain title='All Courses' xs={12}>
        <CourseDisplay courses={courses} role={role}/>
      </PageMain>
    </Page>
  )
};

export default Courses;
