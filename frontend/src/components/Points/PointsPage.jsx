import React from 'react';
import Page from 'components/Page';
import PageMain from 'components/PageMain';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PointsNav from './PointsNav';
import AuthContext from 'AuthContext';

const PointsPage = ({ page, title, getRole = false, setRole, titleStart, titleEnd, children, points }) => {
  const navigate = useNavigate();
  const { token, userId } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.get('/home', {
      params: {
        token
      }
    })
      .catch(() => navigate('/logout'))

    if (getRole) {
      axios.get('/user_info', {
        params: {
          user_id: userId
        }
      })
        .then(res => setRole(res.data.user_role))
        .catch(() => navigate('/logout'))
    }
  }, []);

  return (
    <Page title='Points' page="points">
      <PointsNav page={page} />
      <PageMain title={title} titleStart={titleStart} titleEnd={titleEnd}>
        {children}
      </PageMain>
    </Page>
  )
};

export default PointsPage;
