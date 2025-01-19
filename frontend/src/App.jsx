import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import './axios'
import theme from './theme'
import { AuthProvider } from './AuthContext'

import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Logout from './pages/Auth/Logout'

import Dashboard from './pages/Home/Dashboard'
import JoinCourse from './pages/Home/JoinCourse'
import CreateCourse from './pages/Home/CreateCourse'

import Courses from 'pages/Home/Courses';

import UserProfile from 'pages/UserProfile';

import CourseHome from './pages/Course/CourseHome';

import CourseResources from './pages/Course/Resource/CourseResources';
import CreateResource from './pages/Course/Resource/CreateResource';

import CourseParticipants from './pages/Course/Participants/CourseParticipants';
import CourseEnrollments from './pages/Course/Participants/CourseEnrollments';

import CourseAssignments from './pages/Course/Assignment/CourseAssignments';
import CourseAssignment from './pages/Course/Assignment/CourseAssignment';
import CreateAssignment from './pages/Course/Assignment/CreateAssignment';
import CourseAssignmentSubmissions from './pages/Course/Assignment/CourseAssignmentSubmissions';
import CourseAssignmentSubmission from './pages/Course/Assignment/CourseAssignmentSubmission';

import CourseQuizzes from './pages/Course/Quiz/CourseQuizzes';
import CreateQuiz from './pages/Course/Quiz/CreateQuiz';
import CourseQuiz from './pages/Course/Quiz/CourseQuiz';
import CourseQuizSubmissions from './pages/Course/Quiz/CourseQuizSubmissions';
import CourseQuizSubmission from './pages/Course/Quiz/CourseQuizSubmission';

import CourseClasses from './pages/Course/Class/CourseClasses';
import CreateClass from './pages/Course/Class/CreateClass';
import CourseClass from './pages/Course/Class/CourseClass';

import CourseForum from './pages/Course/Forum/CourseForum'
import CreateForum from './pages/Course/Forum/CreateForum'
import ForumPost from './pages/Course/Forum/ForumPost'
import ViewForum from './pages/Course/Forum/ViewForum'
import ViewPost from './pages/Course/Forum/ViewPost'
import PointsHome from 'pages/Points/PointsHome'
import PointsRanking from 'pages/Points/PointsRanking'
import PointsMinigames from 'pages/Points/PointsMinigames'
import PointsSpinTheWheel from 'pages/Points/PointsSpinTheWheel'
import PointsGuessTheMark from 'pages/Points/PointsGuessTheMark'
import PointsMissions from 'pages/Points/PointsMissions'
import PointsShop from 'pages/Points/PointsShop'

import CourseLiveClasses from 'pages/LiveClass/CourseLiveClasses'
import CourseLiveClass from 'pages/LiveClass/CourseLiveClass'
import CourseRecordings from 'pages/LiveClass/CourseRecordings'
import CourseRecording from 'pages/LiveClass/CourseRecording'

const App = () => {
  document.title = 'GitGud'

  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [userId, setUserId] = React.useState(localStorage.getItem('user_id'));

  function setAuth (token, user_id) {
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', user_id);
    setToken(token);
    setUserId(user_id);
  }

  return (
    <AuthProvider value={{ token, userId }}>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="*" element={ <Navigate to='/dashboard' /> } />
        <Route path="/login" element={ <Login setAuth={setAuth} /> } />
        <Route path="/signup" element={ <Signup setAuth={setAuth} />} />
        <Route path="/logout" element={ <Logout setToken={setToken} setUserId={setUserId}/>} />

        <Route path="/dashboard" element={ <ProtectedRoute element={<Dashboard />} /> } />
        <Route path="/join-course" element={ <ProtectedRoute element={<JoinCourse />} /> } />
        <Route path="/create-course" element={ <ProtectedRoute element={<CreateCourse />}/> } />
        <Route path="/courses" element={ <ProtectedRoute element={<Courses />}/> } />

        <Route path="/user/:userid" element={ <ProtectedRoute element={<UserProfile />}/> } />

        <Route path="/course/:courseid/home" element={ <ProtectedRoute element={<CourseHome />}/> } />

        <Route path="/course/:courseid/participants" element={<ProtectedRoute element={ <CourseParticipants /> }/>} />
        <Route path="/course/:courseid/enrollments" element={<ProtectedRoute element={<CourseEnrollments />} /> } />

        <Route path="/course/:courseid/assignments" element={ <ProtectedRoute element={<CourseAssignments />}/>} />
        <Route path="/course/:courseid/assignments/:assignmentid" element={<ProtectedRoute element={<CourseAssignment />}/> } />
        <Route path="/course/:courseid/assignments/:assignmentid/submissions" element={ <ProtectedRoute element={<CourseAssignmentSubmissions />} />} />
        <Route path="/course/:courseid/assignments/:assignmentid/submissions/:submissionid" element={ <ProtectedRoute element={<CourseAssignmentSubmission />} />} />
        <Route path="/course/:courseid/assignments/create-assignment" element={ <ProtectedRoute element={<CreateAssignment />} />} />

        <Route path="/course/:courseid/resources" element={<ProtectedRoute element={<CourseResources />} />} />
        <Route path="/course/:courseid/resources/create-resource" element={<ProtectedRoute element={<CreateResource />} />} />

        <Route path="/course/:courseid/quizzes/" element={ <ProtectedRoute element={<CourseQuizzes />} /> } />
        <Route path="/course/:courseid/quizzes/create-quiz" element={ <ProtectedRoute element={<CreateQuiz />} /> } />
        <Route path="/course/:courseid/quizzes/:quizid" element={ <ProtectedRoute element={<CourseQuiz />} /> } />
        <Route path="/course/:courseid/quizzes/:quizid/submissions" element={ <ProtectedRoute element={<CourseQuizSubmissions />} /> } />
        <Route path="/course/:courseid/quizzes/:quizid/submissions/:userid" element={ <ProtectedRoute element={<CourseQuizSubmission />} /> } />

        <Route path="/course/:courseid/classes" element={ <ProtectedRoute element={ <CourseClasses /> }/> } />
        <Route path="/course/:courseid/classes/create-class" element={ <ProtectedRoute element={<CreateClass />} /> } />
        <Route path="/course/:courseid/classes/:classid/" element={<ProtectedRoute element={<CourseClass />} />} />

        <Route path='/course/:courseid/forums' element={<ProtectedRoute element={<CourseForum />} />}/>
        <Route path='/course/:courseid/forums/create-forum' element={<ProtectedRoute element={<CreateForum />} />}/>
        <Route path='/course/:courseid/forums/:category/forum-post' element={<ProtectedRoute element={<ForumPost />} />}/>
        <Route path='/course/:courseid/forums/:category/view-forum' element={<ProtectedRoute element={<ViewForum />} />} />
        <Route path='/course/:courseid/forums/:category/view-forum/:threadid/post' element={<ProtectedRoute element={<ViewPost />} />}/>

        <Route path='/points/home' element={<ProtectedRoute element={<PointsHome />} />}/>
        <Route path='/points/ranking' element={<ProtectedRoute element={<PointsRanking />} />}/>
        <Route path='/points/shop' element={<ProtectedRoute element={<PointsShop />} />}/>
        <Route path='/points/missions' element={<ProtectedRoute element={<PointsMissions />} />}/>
        <Route path='/points/minigames' element={<ProtectedRoute element={<PointsMinigames />} />}/>
        <Route path='/points/minigames/spin' element={<ProtectedRoute element={<PointsSpinTheWheel />} />}/>
        <Route path='/points/minigames/guess' element={<ProtectedRoute element={<PointsGuessTheMark />} />}/>

        <Route path='/course/:courseid/lessons' element={<ProtectedRoute element={<CourseLiveClasses />} />} />
        <Route path='/course/:courseid/lessons/recordings' element={<ProtectedRoute element={<CourseRecordings />} />} />
        <Route path='/course/:courseid/lessons/recordings/:classid/:recordingid' element={<ProtectedRoute element={<CourseRecording />} />} />
        <Route path='/course/:courseid/lessons/:classid' element={<ProtectedRoute element={<CourseLiveClass />} />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App
