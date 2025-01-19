import React from 'react';

import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MessageInput from 'components/MessageInput';
import ProfilePicture from './ProfilePicture';

const ProfileCommentEdit = ({ comment, handleEditComment, type = 'comment', setEditing }) => {
  dayjs.extend(relativeTime);
  const [newMessage, setNewMessage] = React.useState(comment.content)
  return (
    <Box sx={{ display: 'flex', my: 2, gap: 1, width: 1 }}>
      <ProfilePicture userId={comment.commenter_id} size='large' />
      <Box width={1}>
        <MessageInput fullWidth value={newMessage} onChange={e => setNewMessage(e.target.value)} onClick={() => handleEditComment(comment.id, type, newMessage)} sx={{ mb: 1 }} />
        <Typography fontSize='small' color='text.secondary' sx={{ cursor: 'pointer' }} onClick={() => setEditing({
          id: '',
          type: ''
        })}>
          Cancel
        </Typography>
      </Box>
    </Box>
  );
}

export default ProfileCommentEdit;
