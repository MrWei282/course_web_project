import React from 'react';
import axios from 'axios'

import { Box, Button, Link, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const ThreadPost = ({ post, handleDownload }) => {
  dayjs.extend(relativeTime);
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    if ('user_id' in post) {
      axios.get('/user_info', {
        params: {
          user_id: post.user_id
        }
      })
        .then(res => setUser(res.data))
    }
  }, [post])

  return (
    <Box sx={{ display: 'flex', my: 2, gap: 1, width: 1 }}>
      {user.user_avatar === null
        ? <AccountCircleIcon sx={{ color: 'text.primary' }} fontSize='large'/>
        : <Box component='img' src={user.user_avatar} height='35px' width='35px'/>
      }
      <Box width={1}>
        <Box sx={{ mb: 1, border: 1, borderColor: 'primary.light', backgroundColor: 'primary.light', p: 1, borderRadius: 1, borderTopLeftRadius: 0 }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Link to={`/user/${post.user_id}`}>
              {user.user_firstname} {user.user_lastname}
            </Link>
            <Typography fontSize='small' color='text.secondary'>
              {dayjs(post.date).fromNow()}
            </Typography>
          </Box>
          {(post.file_id !== null &&
            <Button
            onClick={() => handleDownload(post.file_id)}
            label='download post file'
            variant='contained'
            size='small'
            >
              Download File
            </Button>
          )}
        </Box>

        <Typography>
          {post.content}
        </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ThreadPost;
