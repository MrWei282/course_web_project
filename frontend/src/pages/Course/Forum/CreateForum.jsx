import React from 'react'
import axios from 'axios'
// import dayjs from 'dayjs;'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Box,
  TextField,
  Button,
} from '@mui/material'

import BackButton from '../../../components/BackButton'
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage'

const CreateForum = () => {
  const navigate = useNavigate()
  const { courseid } = useParams()
  const { token } = React.useContext(AuthContext);

  const [forumTitle, setforumTitle] = React.useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/course/add_category', {
        token,
        course_id: courseid,
        category: forumTitle,
      })
      .then(() => {
        navigate(-1)
      })
  }

  return (
    <CoursePage page='forum' title={'Create New Forum'} titleEnd={<BackButton />}>
      <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        Title
        <TextField
          name='name'
          label='Enter Forum Title...'
          variant='outlined'
          size='small'
          onChange={(e) => setforumTitle(e.target.value)}
        />
        <Button type='submit' sx={{ alignSelf: 'flex-start' }} label='create new forum button' variant='contained'>
          Create Forum
        </Button>
      </Box>
    </CoursePage>
  )
}

export default CreateForum
