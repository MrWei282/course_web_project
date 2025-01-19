import React from 'react';

import { Box } from '@mui/material';
import ProfileCommentMessage from './ProfileCommentMessage';
import ProfileIconButton from './ProfileIconButton';
import ProfileCommentReply from './ProfileCommentReply';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import AuthContext from 'AuthContext';
import ProfileCommentEdit from './ProfileCommentEdit';

const ProfileComment = ({ comment, isProfileOwner, handleDelete, fetchComments, creatorKey = 'commenter_id', canReply = true, type = 'comment', editing, setEditing, handleEditComment }) => {
  dayjs.extend(relativeTime);
  const { userId } = React.useContext(AuthContext);

  const [user, setUser] = React.useState({
    user_firstname: '',
    user_lastname: ''
  });

  React.useEffect(() => {
    axios.get('/user_info', {
      params: {
        user_id: comment[creatorKey]
      }
    })
      .then(res => setUser(res.data))
      .catch(() => setUser({
        user_firstname: 'Not found',
        user_lastname: ''
      }))
  }, [comment])

  return (
    <ProfileCommentMessage
      userId={comment[creatorKey]}
      name={`${user.user_firstname} ${user.user_lastname}`}
      date={dayjs(comment.date).fromNow()}
      message={comment.content}
      nameEnd={
          <Box>
            {((parseInt(userId) === parseInt(comment[creatorKey])) &&
              <ProfileIconButton onClick={() => setEditing({ id: comment.id, type })} icon={<EditIcon />}/>
            )}

            {((isProfileOwner || parseInt(userId) === parseInt(comment[creatorKey])) &&
              <ProfileIconButton onClick={() => handleDelete(comment.id, type)} icon={<DeleteIcon />}/>
            )}
          </Box>
      }
      messageBottom={
        <Box>
          {(canReply &&
            <ProfileCommentReply commentId={comment.id} fetchComments={fetchComments}/>
          )}
          {'replies' in comment && comment.replies.map((reply, idx) =>
            (editing.id === reply.id && editing.type === 'reply')
              ? <ProfileCommentEdit
                  key={idx}
                  comment={reply}
                  handleEditComment={handleEditComment}
                  type='reply'
                  setEditing={setEditing}
                />
              : <ProfileComment
                  key={idx}
                  comment={reply}
                  isProfileOwner={isProfileOwner}
                  handleDelete={handleDelete}
                  fetchComments={fetchComments}
                  creatorKey='user_id'
                  canReply={false}
                  type='reply'
                  setEditing={setEditing}
                />
          )}
        </Box>
      }
    />
  );
}

export default ProfileComment;
