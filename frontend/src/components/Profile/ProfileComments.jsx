import React from 'react';

import { Box, Button, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import ProfileComment from './ProfileComment';
import ProfileCommentEdit from './ProfileCommentEdit';

const ProfileComments = ({ token, userid, owner }) => {
  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState([]);
  const [error, setError] = React.useState('');
  const [sending, setSending] = React.useState(false)
  const [editing, setEditing] = React.useState({
    id: '',
    type: ''
  });

  React.useEffect(() => {
    fetchComments();
  }, [])

  const fetchComments = () => {
    axios.get('/profile_all_comments', {
      params: {
        token,
        viewed_id: userid
      }
    })
      .then(res => {
        setComments(res.data.comments)
      })
      .catch(() => {})
  }

  const handleCreateComment = () => {
    if (comment === '') {
      setError('Please enter a comment');
      return;
    }

    setSending(true);
    axios.post('/profile_comment', {
      user_id: userid,
      content: comment,
      date: new Date(),
      commenter_token: token
    })
      .then(() => {
        setError('')
        setComment('');
        fetchComments();
        setSending(false)
      })
      .catch(() => {
        setSending(false)
      })
  }

  const handleDeleteComment = (commentId, type) => {
    if (type === 'comment') {
      axios.delete('/delete_user_comment', {
        data: {
          token,
          comment_id: commentId
        }
      })
        .then(() => fetchComments())
        .catch(() => fetchComments());
    } else if (type === 'reply') {
      axios.delete('/delete_user_reply', {
        data: {
          token,
          reply_id: commentId
        }
      })
        .then(() => fetchComments())
        .catch(() => fetchComments());
    }
  }

  const handleEditComment = (commentId, type, content) => {
    if (type === 'comment') {
      axios.put('/edit_user_comment', {
        token,
        content,
        comment_id: commentId
      })
        .then(() => {
          fetchComments()
          setEditing({
            id: '',
            type: ''
          })
        })
        .catch(() => {
          fetchComments()
          setEditing({
            id: '',
            type: ''
          })
        });
    } else if (type === 'reply') {
      axios.put('/edit_user_reply', {
        token,
        content,
        reply_id: commentId
      })
        .then(() => {
          fetchComments()
          setEditing({
            id: '',
            type: ''
          })
        })
        .catch(() => {
          fetchComments()
          setEditing({
            id: '',
            type: ''
          })
        });
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          value={comment}
          onChange={e => setComment(e.target.value)}
          label="Add new comment..."
          error={error !== ''}
          helperText={error}
          sx={{ flexGrow: 1 }}
          size="small"
        />
        <Button size="small" label="create new comment button" variant="contained" onClick={handleCreateComment} >
          Comment
        </Button>
        {(sending &&
          <CircularProgress size={25} />
        )}
      </Box>
      {[...comments].reverse().map((currComment, idx) =>
        (editing.id === currComment.id && editing.type === 'comment')
          ? <ProfileCommentEdit
              key={idx}
              comment={currComment}
              handleEditComment={handleEditComment}
              setEditing={setEditing}
            />
          : <ProfileComment
              key={idx}
              comment={currComment}
              isProfileOwner={owner}
              handleDelete={handleDeleteComment}
              fetchComments={fetchComments}
              editing={editing}
              setEditing={setEditing}
              handleEditComment={handleEditComment}
            />
      )}
    </Box>
  );
}

export default ProfileComments;
