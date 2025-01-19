import React from 'react';

import PointsPage from 'components/Points/PointsPage';
import { Box, Button, IconButton, Snackbar, Tab, Tabs } from '@mui/material';
import axios from 'axios';
import ObjectSelect from 'components/ObjectSelect';
import AuthContext from 'AuthContext';
import PointsShopItem from 'components/Points/PointsShopItem';
import config from 'config.json';
import PointsCreateItem from 'components/Points/PointsCreateItem';
import { Close } from '@mui/icons-material';

const PointsShop = () => {
  const [courses, setCourses] = React.useState([]);
  const [course, setCourse] = React.useState('');
  const { token } = React.useContext(AuthContext);
  const [items, setItems] = React.useState([]);
  const [wishlist, setWishlist] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [role, setRole] = React.useState('student');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [points, setPoints] = React.useState(0);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifText, setNotifText] = React.useState(false);
  const [inventory, setInventory] = React.useState([]);

  React.useEffect(() => {
    axios.get('/home', {
      params: {
        token
      }
    })
      .then(res => setCourses(res.data.home_courses))
  }, [])

  React.useEffect(() => {
    if (course !== '') {
      refreshShop();

      if (config[role].points.can_buy_item) {
        axios.get('/game/student_points', {
          params: {
            token,
            course_id: course.course_id
          }
        })
          .then(res => {
            setPoints(res.data.points_balance)
          })
          .catch(() => {})
      }
    }
  }, [course])

  const fetchInventory = () => {
    axios.get('/game/student_redeemed_items', {
      params: {
        token,
        course_id: course.course_id
      }
    })
      .then(res => setInventory(res.data.item_ids))
  }

  const fetchWishlist = () => {
    axios.get('/game/student_wishlisted_items', {
      params: {
        token,
        course_id: course.course_id
      }
    })
      .then(res => setWishlist(res.data.items))
  }

  const fetchItems = () => {
    axios.get('/game/get_shop', {
      params: {
        token,
        course_id: course.course_id
      }
    })
      .then(res => setItems(res.data.items))
  }

  const refreshShop = () => {
    fetchWishlist();
    fetchItems();
    fetchInventory();
  }

  const handlePurchase = (id) => {
    console.log(id)
    axios.post('/game/redeem_item_from_shop', {
      token,
      course_id: course.course_id,
      item_id: id
    })
      .then(() =>
        axios.put('/game/redeem_item_from_shop', {
          token,
          course_id: course.course_id,
          item_id: id
        })
      )
      .then(() => {
        setNotifOpen(true);
        setNotifText('Successfully bought item')
        refreshShop();
      })
      .catch(err => {
        setNotifOpen(true)
        console.log(err.response.data.message)
        setNotifText(err.response.data.message)
      })
  }

  const handleAddWishlist = (id) => {
    axios.post('/game/wishlist_item', {
      token,
      course_id: course.course_id,
      item_id: id
    })
      .then(() => {
        setNotifOpen(true);
        setNotifText('Successfully wishlisted item')
        refreshShop();
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <PointsPage
      page='shop'
      title='Shop'
      getRole
      setRole={setRole}
      titleEnd={
        config[role].points.can_buy_item &&
          `Your points: ${points}`
      }
    >
      <Snackbar
        open={notifOpen}
        autoHideDuration={6000}
        onClose={() => setNotifOpen(false)}
        message={notifText}
        action={
          <Box>
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setNotifOpen(false)}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        }
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <ObjectSelect objects={courses} labelKey='course_name' value={course} onChange={e => setCourse(e.target.value)} label='Course' error={''} size='small'/>
        {(config[role].points.can_create_item && course !== '' &&
          <Box sx={{ flexShrink: 0 }}>
            <PointsCreateItem open={createOpen} handleClose={() => setCreateOpen(false)} courseId={course.course_id} fetchItems={fetchItems}/>
            <Button onClick={() => setCreateOpen(true)} label="create item button" variant="contained">
              New Item
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
        <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
          <Tab label="Shop" />
          <Tab label="Wishlist" />
        </Tabs>
      </Box>

      <Box display={value === 0 ? 'block' : 'none'}>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          {items
            .filter(item => !wishlist.some(wishlistItem => wishlistItem.item_id === item.item_id))
            .filter(item => !inventory.includes(item.item_id))
            .map((item, idx) =>
              <PointsShopItem item={item} key={idx} action={
                config[role].points.can_buy_item &&
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Button size="small" onClick={() => handleAddWishlist(item.item_id)}>Add to wishlist</Button>
                    <Button size="small" onClick={() => handlePurchase(item.item_id)}>Purchase for {item.cost} points</Button>
                  </Box>
              }/>
            )}
        </Box>
      </Box>

      <Box display={value === 1 ? 'block' : 'none'}>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          {wishlist
            .filter(item => !inventory.includes(item.item_id))
            .map((item, idx) =>
              <PointsShopItem item={item} key={idx} action={
                <Button size="small" onClick={() => handlePurchase(item.item_id)}>Purchase for {item.cost} points</Button>
              }/>
            )}
        </Box>
      </Box>
    </PointsPage>
  )
};

export default PointsShop;
