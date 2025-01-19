import React from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material'
import AuthContext from 'AuthContext';

import FileInput from 'components/FileInput'
import BackButton from '../../../components/BackButton'
import CoursePage from 'components/Course/CoursePage';

const ForumPost = () => {
  const navigate = useNavigate()
  const { courseid, category } = useParams()
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [fileName, setFileName] = React.useState('')
  const [file, setFile] = React.useState('')
  const [sending, setSending] = React.useState(false)
  const { token } = React.useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    axios
      .post('/course/forum_post', {
        token,
        course_id: courseid,
        title,
        content,
        date: new Date(),
        file,
        file_name: fileName,
        category
      })
      .then(() => {
        navigate(-1)
        setSending(false)
      })
      .catch(() => {
        setSending(false)
        navigate(-1)
      })
  }

  return (
    <CoursePage
      page={'forums'}
      title={'Create Forum Post'}
      titleEnd={<BackButton />}
    >
      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
      <Typography sx= {{ fontWeight: 'bold' }}>Subject</Typography>
      <TextField
        name='name'
        label='Enter Post Subject...'
        variant='outlined'
        size='small'
        onChange={(e) => setTitle(e.target.value)}
      />
      <Typography sx= {{ fontWeight: 'bold' }}>Body</Typography>
      <TextField
        name='description'
        label='Enter post body...'
        variant='outlined'
        size='small'
        multiline
        rows={5}
        onChange={(e) => setContent(e.target.value)}
      />
      <Typography sx= {{ fontWeight: 'bold' }}>File Name</Typography>
      <TextField
        name='grade'
        label='Enter file name...'
        variant='outlined'
        size='small'
        onChange={(e) => setFileName(e.target.value)}
      />
      <Typography sx= {{ fontWeight: 'bold' }}>Upload Files</Typography>
      <FileInput label='Upload File' error={''} setError={() => {}} setFile={setFile} fileName={fileName} setFileName={setFileName}/>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          type='submit'
          sx={{ alignSelf: 'flex-start' }}
          label='create forum post button'
          variant='contained'
          >
          Create Post
        </Button>
        {(sending &&
          <CircularProgress size={25} />
        )}
        </Box>
      </Box>
    </CoursePage>
  )
}

export default ForumPost
