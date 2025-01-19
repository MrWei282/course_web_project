import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs';
import { triggerBase64Download } from 'common-base64-downloader-react';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Box,
  Button,
  TextField,
} from '@mui/material'
import AuthContext from 'AuthContext';

import BackButton from '../../../components/BackButton'
import CoursePage from 'components/Course/CoursePage';
import FileInput from 'components/FileInput';
import ThreadPost from 'components/Forum/ThreadPost';
import Title from 'components/Title';

const ViewPost = () => {
  dayjs.extend(relativeTime);
  const [reply, setReply] = React.useState('')
  const [thread, setThread] = React.useState({
    thread: {},
    replies: []
  })
  const { courseid, threadid } = useParams()
  const { token } = React.useContext(AuthContext);

  const [fileName, setFileName] = React.useState('')
  const [file, setFile] = React.useState('')

  const [replyError, setReplyError] = React.useState('')

  const getThread = () => {
    axios.get('/course/forum_get_post', {
      params: {
        token,
        course_id: courseid,
        thread_id: threadid
      }
    })
      .then(res => {
        console.log(res.data)
        setThread(res.data)
      })
  }

  React.useEffect(() => {
    getThread();
  }, [])

  const handleDownload = (fileId) => {
    axios.get('/file', {
      params: {
        token,
        course_id: courseid,
        file_id: fileId
      }
    })
      .then(res => triggerBase64Download(res.data.file, res.data.file_name))
  }

  const handleReply = () => {
    if (reply === '') {
      setReplyError('Please enter a reply')
      return
    }

    axios.post('/course/forum_reply', {
      token,
      course_id: courseid,
      thread_id: threadid,
      content: reply,
      date: new Date(),
      file: file === '' ? null : file,
      file_name: fileName === '' ? null : fileName
    })
      .then(() => {
        getThread();
        setReply('');
        setFile('');
        setFileName('');
        setReplyError('')
      })
  }

  return (
    <CoursePage
      page='forums'
      title={thread.thread.title}
      titleEnd={<BackButton />}
    >
      <ThreadPost post={thread.thread} handleDownload={handleDownload} />

      <Title>Replies</Title>
      {thread.replies.map((reply, idx) => (
        <ThreadPost post={reply} key={idx} handleDownload={handleDownload} />
      ))}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label='Reply...'
          variant='outlined'
          size='small'
          value={reply}
          onChange={e => setReply(e.target.value)}
          placeholder='Type your reply here...'
          error={replyError !== ''}
          helperText={replyError}
        >
          Reply
        </TextField>
        <FileInput label='Upload File' error={''} setError={() => {}} setFile={setFile} fileName={fileName} setFileName={setFileName}/>

        <Button
          sx={{ alignSelf: 'flex-start' }}
          label='reply button'
          variant='contained'
          onClick={handleReply}
        >
          Reply
        </Button>
      </Box>
    </CoursePage>
  )
}

export default ViewPost
