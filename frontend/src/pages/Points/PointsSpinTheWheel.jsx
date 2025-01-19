import React from 'react';

import PointsPage from 'components/Points/PointsPage';
import GambleWheel from 'components/Points/GambleWheel';
import { Box, Button, IconButton, Link, Snackbar, TextField, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import config from 'config.json';
import AuthContext from 'AuthContext';
import axios from 'axios';
import ObjectSelect from 'components/ObjectSelect';
import { Close } from '@mui/icons-material';
import InfoBox from 'components/InfoBox';

const empty = [
  { option: '' },
  { option: '' },
  { option: '' },
  { option: '' },
]

const PointsSpinTheWheel = () => {
  const [role, setRole] = React.useState('student');
  const [prizeNumber, setPrizeNumber] = React.useState(null);
  const [points, setPoints] = React.useState(0);
  const [courses, setCourses] = React.useState([]);
  const [course, setCourse] = React.useState('');
  const [wheel, setWheel] = React.useState(null);
  const [inventory, setInventory] = React.useState([]);
  const [mustSpin, setMustSpin] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifText, setNotifText] = React.useState('');
  const [cost, setCost] = React.useState('');
  const [costError, setCostError] = React.useState('');

  const { token } = React.useContext(AuthContext);

  const fetchInventory = () => {
    axios.get('/game/student_redeemed_items', {
      params: {
        token,
        course_id: course.course_id
      }
    })
      .then(res => setInventory(res.data.item_ids))
  }

  const fetchPoints = () => {
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
      if (config[role].points.can_buy_item) {
        fetchPoints();
        fetchInventory();
      }
      fetchWheel();
    }
  }, [course])

  const fetchWheel = () => {
    axios.get('/game/get_wheel', {
      params: {
        token,
        course_id: course.course_id
      }
    })
      .then(res => {
        setWheel(res.data)
      })
      .catch(() => {})
  }

  const handleSpin = () => {
    axios.post('/game/spin_wheel', {
      token,
      course_id: course.course_id
    })
      .then(res => {
        fetchPoints();
        console.log(res)
        const wheelItems = wheel.items.filter(item => !inventory.includes(item.item_id))
        for (const itemIdx in wheelItems) {
          if (wheelItems[itemIdx].item_id === res.data.item_id) {
            setPrizeNumber(itemIdx);
            break;
          }
        }
      })
      .catch(err => {
        setNotifOpen(true)
        setNotifText(err.response.data.message)
      })
  }

  React.useEffect(() => {
    if (prizeNumber !== null) {
      console.log(prizeNumber)
      setMustSpin(true);
    }
  }, [prizeNumber])

  const handleChangeCost = () => {
    if (cost === '' || isNaN(cost)) {
      setCostError('Please enter an integer cost')
      return;
    }
    axios.put('/game/change_spin_cost', {
      token,
      course_id: course.course_id,
      cost
    })
      .then(() => fetchWheel())
  }

  return (
    <PointsPage
      page='minigames'
      getRole
      setRole={setRole}
      title={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to={'/points/minigames/'}>
            Minigames
          </Link>
          <KeyboardArrowRightIcon />
          Spin the Wheel
        </Box>
      }
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

      <Typography sx={{ mb: 2 }}>
        Spin the Wheel to try your luck and receive a random prize!
      </Typography>

      {(config[role].points.can_create_item &&
        <InfoBox text='Items created by lecturers and teachers are able to be won on the spin wheel.'/>
      )}

      <ObjectSelect objects={courses} labelKey='course_name' value={course} onChange={e => setCourse(e.target.value)} label='Course' error={''} size='small'/>

      {wheel !== null &&
        <Typography sx={{ mb: 2 }}>
          Cost: {wheel.cost} points
        </Typography>
      }

      {wheel !== null && config[role].points.can_create_item &&
        <Box sx={{ display: 'flex' }}>
          <TextField label="Change Cost" error={costError !== ''} helperText={costError} value={cost} onChange={e => setCost(e.target.value)} size='small'/>
          <Button variant="contained" onClick={handleChangeCost}>Submit</Button>
        </Box>
      }

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <GambleWheel data={
          wheel === null || wheel.items.length === 0
            ? empty
            : (wheel.items)
                .filter(item => !inventory.includes(item.item_id))
                .map(item => ({
                  option: item.item_name
                }))
        } prizeNumber={prizeNumber} handleSpin={handleSpin} mustSpin={mustSpin} setMustSpin={setMustSpin} disabled={config[role].points.can_create_item || wheel === null} />
      </Box>
    </PointsPage>
  )
};

export default PointsSpinTheWheel;
