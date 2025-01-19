import React from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Box
} from '@mui/material'
import AuthContext from 'AuthContext';

import CreateIcon from '@mui/icons-material/Create'
import UserInfo from 'components/UserInfo';
import CoursePage from 'components/Course/CoursePage';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const ViewForum = () => {
  dayjs.extend(relativeTime);
  const navigate = useNavigate()
  const { courseid, category } = useParams()
  const { token } = React.useContext(AuthContext);
  const [threads, setThreads] = React.useState([])

  const fetchThreads = async (threadIds) => {
    const newThreads = [];
    for (const threadID of threadIds) {
      const newThread = await axios.get('/course/forum_get_post', {
        params: {
          token,
          course_id: courseid,
          thread_id: threadID
        }
      })
      console.log(newThread.data)
      newThreads.push(newThread.data)
    }
    return newThreads;
  }

  React.useEffect(() => {
    axios
      .get('/course/category/forums', {
        params: {
          token,
          course_id: courseid,
          category,
        },
      })
      .then((res) => {
        fetchThreads(res.data.forums)
          .then(newThreads => {
            console.log(newThreads)
            setThreads(newThreads)
          });
      })
  }, [])

  return (
    <CoursePage
      page='forums'
      title={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to={`/course/${courseid}/forums/`}>
            Forums
          </Link>
          <KeyboardArrowRightIcon />
          {category}
        </Box>
      }
      titleEnd={
        <Button
          sx={{ ml: 2, mb: 2 }}
          variant='contained'
          onClick={() => navigate(`/course/${courseid}/forums/${category}/forum-post`)}
        >
          Add Post
          <CreateIcon sx={{ ml: 1 }} fontSize='small' />
        </Button>
      }
    >
      <TableContainer>
        <Table aria-label='posts table'>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 1 }}>
                Title
              </TableCell>
              <TableCell align='center' sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                Posted By
              </TableCell>
              <TableCell align='center' sx={{ color: 'white', fontWeight: 'bold' }}>
                Posted
              </TableCell>
              <TableCell align='center' sx={{ color: 'white', fontWeight: 'bold' }}>
                Replies
              </TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
              {threads.map((thread, idx) => (
                <TableRow key={idx} sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.1s ease-in-out',
                  '&:hover': { backgroundColor: 'primary.light' },
                }}
                >
                  <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={() => navigate(`/course/${courseid}/forums/${category}/view-forum/${thread.thread.id}/post`)}>
                    <Link>
                      {thread.thread.title}
                    </Link>
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{ whiteSpace: 'nowrap', alignItems: 'center' }}
                  >
                    <UserInfo userId={thread.thread.user_id} />
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{ alignItems: 'center', whiteSpace: 'nowrap' }}
                  >
                    {' '}
                    {dayjs(thread.thread.date).fromNow()}
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{ alignItems: 'center' }}
                  >
                    {' '}
                    {thread.replies.length}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CoursePage>
  )
}

export default ViewForum
