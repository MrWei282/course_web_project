import React from 'react';
import { useParams } from 'react-router-dom';

import Page from 'components/Page';
import PageMain from 'components/PageMain';
import axios from 'axios';
import Title from 'components/Title';
import { Box, Button, Container, Grid, Tooltip, Typography } from '@mui/material';
import BackButton from 'components/BackButton';
import ProfileEdit from 'components/Profile/ProfileEdit';
import AuthContext from 'AuthContext';
import ProfileComments from 'components/Profile/ProfileComments';
import ProfilePostDisplay from 'components/Profile/ProfilePostDisplay';
import ProfileAvatar from 'components/Profile/ProfileAvatar';
import ProfileBadges from 'components/Profile/ProfileBadges';
import { ErrorOutline } from '@mui/icons-material';

const UserProfile = () => {
  const { userid } = useParams();
  const { token, userId } = React.useContext(AuthContext);
  const owner = parseInt(userId) === parseInt(userid);
  const [user, setUser] = React.useState({});
  const [userError, setUserError] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [avatarOpen, setAvatarOpen] = React.useState(false);

  React.useEffect(() => {
    fetchProfile();
  }, [userid])

  const fetchProfile = () => {
    axios.get('/user_info', {
      params: {
        user_id: userid
      }
    })
      .then(res => {
        setUser(res.data)
        setUserError(false)
      })
      .catch(() => setUserError(true))
  }

  return (
    userError
      ? <Page title={'Profile Page'} subtitle={`User ID ${userid}`}>
          <PageMain xs={12} title='User Not Found'>
          </PageMain>
        </Page>
      : <Page title={'Profile Page'} subtitle={`User ID ${user.user_id}`}>
          <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Container sx={{ backgroundColor: 'white', borderRadius: 1, p: 2 }}>
              <Title titleEnd={<BackButton />}>
                {`${user.user_firstname} ${user.user_lastname}`}
              </Title>

              <Box sx={{ display: 'flex' }}>
                {user.user_avatar !== null &&
                  <Box component='img' src={user.user_avatar} alt='user avatar'/>
                }
              <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title divider={false}>
                  User Details:
                </Title>
                {(owner &&
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <ProfileEdit open={editOpen} handleClose={() => setEditOpen(false)} />
                    <Button label="edit profile button" variant="contained" onClick={() => setEditOpen(true)} >
                      Edit Profile
                    </Button>
                    <ProfileAvatar open={avatarOpen} handleClose={() => setAvatarOpen(false)} fetchProfile={fetchProfile}/>
                    <Button label="edit avatar button" variant="contained" onClick={() => setAvatarOpen(true)} >
                      Edit Avatar
                    </Button>
                  </Box>
                )}
              </Box>
              <Typography>
                Email: {user.user_email}
              </Typography>
              <Typography>
                Role: {user.user_role}
              </Typography>

              </Box>
              </Box>
            </Container>

            <ProfilePostDisplay userId={userid} owner={owner} />

            <Container sx={{ height: 1, backgroundColor: 'white', borderRadius: 1, p: 2 }}>
              <Title>
                Comments
              </Title>
              <ProfileComments token={token} userid={userid} owner={owner}/>
            </Container>
          </Grid>

          <PageMain title="Badges" xs={4} titleEnd={
            <Tooltip title="Complete missions to earn badges!" placement="top">
              <ErrorOutline fontSize='large'/>
            </Tooltip>
          }>
            <ProfileBadges badges={user.user_badges ? user.user_badges : []}/>
          </PageMain>
        </Page>
  )
};

export default UserProfile;
