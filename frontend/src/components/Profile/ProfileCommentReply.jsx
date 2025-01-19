import React from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import AuthContext from 'AuthContext';
import ProfilePicture from './ProfilePicture';

const ProfileCommentReply = ({ commentId, fetchComments, pfp = null }) => {
  const [replyOpen, setReplyOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const [reply, setReply] = React.useState('');
  const { token, userId } = React.useContext(AuthContext);

  const handleReply = () => {
    if (reply === '') {
      setError('Please enter a reply.');
      return;
    }
    axios.post('/profile_reply', {
      token,
      content: reply,
      date: new Date(),
      comment_id: commentId
    })
      .then(() => {
        setReply('');
        setReplyOpen(false);
        setError('');
        fetchComments();
      })
  }

  return (
    <Box>
      <Typography fontSize='small' color='text.secondary' sx={{ cursor: 'pointer' }} onClick={() => setReplyOpen(!replyOpen)}>
        Reply
      </Typography>
      {(replyOpen &&
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <ProfilePicture userId={userId} />
          <TextField fullWidth label="Write a reply..." size='small' name="reply" value={reply} onChange={e => setReply(e.target.value)} error={error !== ''} helperText={error} />
          <Button variant="contained" onClick={handleReply}>Reply</Button>
        </Box>
      )}
    </Box>
  );
}

export default ProfileCommentReply;
