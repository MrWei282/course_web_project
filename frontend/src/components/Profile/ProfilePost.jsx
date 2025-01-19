import React from 'react';

import { Box, Divider, Typography } from '@mui/material';
import Title from 'components/Title';
import ProfileIconButton from './ProfileIconButton';
import EditIcon from '@mui/icons-material/Edit';
import ProfilePostEdit from './ProfilePostEdit';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import AuthContext from 'AuthContext';

const defaultErrors = {
  text: ''
}

const ProfilePost = ({ title, body, postID, date, isOwner, fetchPosts }) => {
  const [editOpen, setEditOpen] = React.useState(false);
  const [errors, setErrors] = React.useState(defaultErrors);
  dayjs.extend(relativeTime);
  const { token } = React.useContext(AuthContext);

  const handleEdit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('text') === '') {
      setErrors({ ...defaultErrors, text: 'Please enter post text' });
      return;
    }

    axios.put('/edit_user_post', {
      token,
      post_id: postID,
      content: data.get('text'),
    })
      .then(() => {
        setErrors(defaultErrors);
        setEditOpen(false)
        fetchPosts();
      })
      .catch(() => {
        setErrors(defaultErrors);
        setEditOpen(false)
      })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Title divider={false}>
            {title}
          </Title>
          <Typography fontSize='small' color='text.secondary'>
            {dayjs(date).fromNow()}
          </Typography>
        </Box>
        {(isOwner &&
          <Box>
            <ProfilePostEdit open={editOpen} handleClose={() => setEditOpen(false)} handleSubmit={handleEdit} errors={errors} />
            <ProfileIconButton onClick={() => setEditOpen(true)} icon={<EditIcon />} p={0.5}/>
          </Box>
        )}
      </Box>
      <Typography>
        {body}
      </Typography>
      <Divider sx={{ my: 2 }}/>
    </Box>
  );
}

export default ProfilePost;
