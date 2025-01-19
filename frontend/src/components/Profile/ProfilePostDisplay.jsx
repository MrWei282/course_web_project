import React from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import Title from 'components/Title';
import { Box, Button, Container } from '@mui/material';
import ProfilePost from 'components/Profile/ProfilePost';
import ProfilePostCreate from 'components/Profile/ProfilePostCreate';
import AuthContext from 'AuthContext';

const ProfilePostDisplay = ({ userId, owner }) => {
  const { userid } = useParams();
  const { token } = React.useContext(AuthContext);
  const [postOpen, setPostOpen] = React.useState(false);
  const [posts, setPosts] = React.useState([]);

  const fetchPosts = () => {
    axios.get('/profile_owner_all_posts', {
      params: {
        token,
        viewed_id: userId
      }
    })
      .then(res => {
        setPosts(res.data.posts)
      })
      .catch(() => {})
  }

  React.useEffect(() => {
    fetchPosts();
  }, [userid])

  return (
    <Container sx={{ height: 1, backgroundColor: 'white', borderRadius: 1, p: 2 }}>
      <Title>
        Posts
      </Title>
      {[...posts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((post, idx) =>
          <ProfilePost key={idx} title={post.title} body={post.content} postID={post.id} date={post.date} isOwner={owner} fetchPosts={fetchPosts}/>
        )}
      {(owner &&
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <ProfilePostCreate open={postOpen} handleClose={() => setPostOpen(false)} fetchPosts={fetchPosts}/>
          <Button label="create new post button" variant="contained" onClick={() => setPostOpen(true)}>
            New Post
          </Button>
        </Box>
      )}
    </Container>
  )
};

export default ProfilePostDisplay;
