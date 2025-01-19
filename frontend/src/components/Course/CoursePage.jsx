import React from 'react';
import Page from 'components/Page';
import CourseNav from './CourseNav';
import { useParams, useNavigate } from 'react-router-dom';
import PageMain from 'components/PageMain';
import axios from 'axios';
import AuthContext from 'AuthContext';

const CoursePage = ({ page, title, getRole = false, setRole, titleStart, titleEnd, children }) => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { token, userId } = React.useContext(AuthContext);

  // get cached course
  const storedCourses = JSON.parse(localStorage.getItem('courses') || '{}');
  const [course, setCourse] = React.useState(courseid in storedCourses ? storedCourses[courseid] : {});

  React.useEffect(() => {
    axios.get('/search_course', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => setCourse(res.data))
      .catch(() => navigate('/dashboard'));

    if (getRole) {
      axios.get('/user_info', {
        params: {
          user_id: userId
        }
      })
        .then(res => setRole(res.data.user_role))
        .catch(() => navigate('/logout'))
    }
  }, []);

  return (
    <Page title={course.course_name} page="courses">
      <CourseNav id={courseid} page={page} />
      <PageMain title={title} titleStart={titleStart} titleEnd={titleEnd}>
        {children}
      </PageMain>
    </Page>
  )
};

export default CoursePage;
