import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Page from 'components/Page';
import CourseDisplay from 'components/Home/CourseDisplay';
import PageMain from 'components/PageMain';
import AuthContext from 'AuthContext';
import Timeline from 'components/Home/Timeline';

const Dashboard = () => {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = React.useState([]);
  const [role, setRole] = React.useState('');
  const [todos, setTodos] = React.useState({});
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
      .then(res => {
        // cache course info
        const newCourses = {};
        res.data.home_courses.forEach(course => {
          delete course.course_thumbnail;
          newCourses[course.course_id] = course;
        });
        localStorage.setItem('courses', JSON.stringify(newCourses));
        setAllCourses(res.data.home_courses)
      })
      .catch(() => navigate('/logout'))
  }, []);

  React.useEffect(() => {
    const fetchTodos = async () => {
      const newTodos = {};
      // fetch assignments & quizzes
      // todo for class
      for (const course of allCourses) {
        newTodos[course.course_id] = {
          assignments: [],
          quizzes: []
        };
        const params = {
          params: {
            token,
            course_id: course.course_id,
            class_id: null
          }
        };

        const assignments = await axios.get('/course/get_assignments', params)
        newTodos[course.course_id].assignments = assignments.data.all_assignment_info

        const quizzes = await axios.get('/quiz_list', params)
        newTodos[course.course_id].quizzes = quizzes.data.quizzes
      }
      return newTodos;
    }

    fetchTodos()
      .then(newTodos => setTodos(newTodos));
  }, [allCourses]);

  return (
    <Page title={'Dashboard'} page="dashboard" loading={role === ''}>
      <PageMain title='Courses' xs={8}>
        <CourseDisplay courses={allCourses} courseDisplayNum={3} role={role}/>
      </PageMain>
      <Timeline courses={allCourses} todos={todos}/>

    </Page>
  )
};

export default Dashboard;
