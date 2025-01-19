import React from 'react';
import axios from 'axios';
import ModalInterface from 'components/ModalInterface';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import AuthContext from 'AuthContext';

const style = ['CIRCLE', 'TRANSPARENT'];
const list_skin_color = ['TANNED', 'YELLOW', 'PALE', 'LIGHT', 'BROWN', 'DARK_BROWN', 'BLACK'];
const list_top_type = ['NO_HAIR', 'EYE_PATCH', 'HAT', 'HIJAB', 'TURBAN', 'WINTER_HAT1', 'WINTER_HAT2', 'WINTER_HAT3',
  'WINTER_HAT4', 'LONG_HAIR_BIG_HAIR', 'LONG_HAIR_BOB',
  'LONG_HAIR_BUN', 'LONG_HAIR_CURLY', 'LONG_HAIR_CURVY',
  'LONG_HAIR_DREADS', 'LONG_HAIR_FRIDA', 'LONG_HAIR_FRO',
  'LONG_HAIR_FRO_BAND', 'LONG_HAIR_NOT_TOO_LONG',
  'LONG_HAIR_SHAVED_SIDES', 'LONG_HAIR_MIA_WALLACE',
  'LONG_HAIR_STRAIGHT', 'LONG_HAIR_STRAIGHT2',
  'LONG_HAIR_STRAIGHT_STRAND', 'SHORT_HAIR_DREADS_01',
  'SHORT_HAIR_DREADS_02', 'SHORT_HAIR_FRIZZLE',
  'SHORT_HAIR_SHAGGY_MULLET', 'SHORT_HAIR_SHORT_CURLY',
  'SHORT_HAIR_SHORT_FLAT', 'SHORT_HAIR_SHORT_ROUND',
  'SHORT_HAIR_SHORT_WAVED', 'SHORT_HAIR_SIDES',
  'SHORT_HAIR_THE_CAESAR', 'SHORT_HAIR_THE_CAESAR_SIDE_PART'
]
const list_hair_color = ['AUBURN', 'BLACK', 'BLONDE', 'BLONDE_GOLDEN', 'BROWN',
  'BROWN_DARK', 'PASTEL_PINK', 'PLATINUM', 'RED', 'SILVER_GRAY']
const list_hat_color = ['BLACK', 'BLUE_01', 'BLUE_02', 'BLUE_03', 'GRAY_01', 'GRAY_02',
  'HEATHER', 'PASTEL_BLUE', 'PASTEL_GREEN', 'PASTEL_ORANGE',
  'PASTEL_RED', 'PASTEL_YELLOW', 'PINK', 'RED', 'WHITE']
const list_facial_hair_type = ['DEFAULT', 'BEARD_MEDIUM', 'BEARD_LIGHT', 'BEARD_MAJESTIC', 'MOUSTACHE_FANCY', 'MOUSTACHE_MAGNUM']
const list_facial_hair_color = ['AUBURN', 'BLACK', 'BLONDE', 'BLONDE_GOLDEN', 'BROWN', 'BROWN_DARK', 'PLATINUM', 'RED']
const list_mouth_type = ['DEFAULT', 'CONCERNED', 'DISBELIEF', 'EATING', 'GRIMACE', 'SAD', 'SCREAM_OPEN', 'SERIOUS', 'SMILE', 'TONGUE', 'TWINKLE', 'VOMIT']
const list_eye_type = ['DEFAULT', 'CLOSE', 'CRY', 'DIZZY', 'EYE_ROLL', 'HAPPY', 'HEARTS', 'SIDE', 'SQUINT', 'SURPRISED', 'WINK', 'WINK_WACKY']
const list_eyebrow_type = ['DEFAULT', 'DEFAULT_NATURAL', 'ANGRY', 'ANGRY_NATURAL', 'FLAT_NATURAL', 'RAISED_EXCITED', 'RAISED_EXCITED_NATURAL', 'SAD_CONCERNED',
  'SAD_CONCERNED_NATURAL', 'UNI_BROW_NATURAL', 'UP_DOWN', 'UP_DOWN_NATURAL', 'FROWN_NATURAL']
const list_accessories_type = ['DEFAULT', 'KURT', 'PRESCRIPTION_01', 'PRESCRIPTION_02', 'ROUND', 'SUNGLASSES', 'WAYFARERS']
const list_clothe_type = ['BLAZER_SHIRT', 'BLAZER_SWEATER', 'COLLAR_SWEATER', 'GRAPHIC_SHIRT', 'HOODIE', 'OVERALL', 'SHIRT_CREW_NECK', 'SHIRT_SCOOP_NECK', 'SHIRT_V_NECK']
const list_clothe_color = ['BLACK', 'BLUE_01', 'BLUE_02', 'BLUE_03', 'GRAY_01', 'GRAY_02', 'HEATHER', 'PASTEL_BLUE', 'PASTEL_GREEN', 'PASTEL_ORANGE', 'PASTEL_RED', 'PASTEL_YELLOW', 'PINK', 'RED', 'WHITE']
const list_clothe_graphic_type = ['BAT', 'CUMBIA', 'DEER', 'DIAMOND', 'HOLA', 'PIZZA', 'RESIST', 'SELENA', 'BEAR', 'SKULL_OUTLINE', 'SKULL']

const types = [
  {
    ref: style,
    name: 'style'
  },
  {
    ref: list_skin_color,
    name: 'skin_color'
  },
  {
    ref: list_top_type,
    name: 'top_type'
  },
  {
    ref: list_hair_color,
    name: 'hair_color'
  },
  {
    ref: list_hat_color,
    name: 'hat_color'
  },
  {
    ref: list_facial_hair_type,
    name: 'facial_hair_type'
  },
  {
    ref: list_facial_hair_color,
    name: 'facial_hair_color'
  },
  {
    ref: list_mouth_type,
    name: 'mouth_type'
  },
  {
    ref: list_eye_type,
    name: 'eye_type'
  },
  {
    ref: list_eyebrow_type,
    name: 'eyebrow_type'
  },
  {
    ref: list_accessories_type,
    name: 'accessories_type'
  },
  {
    ref: list_clothe_type,
    name: 'clothe_type'
  },
  {
    ref: list_clothe_color,
    name: 'clothe_color'
  },
  {
    ref: list_clothe_graphic_type,
    name: 'clothe_graphic_type'
  }
]

const ProfileAvatar = ({ open, handleClose, fetchProfile }) => {
  const [avatar, setAvatar] = React.useState('');
  const { token } = React.useContext(AuthContext);

  // default options
  const [options, setOptions] = React.useState({
    style: 'CIRCLE',
    skin_color: 'TANNED',
    top_type: 'NO_HAIR',
    hair_color: 'AUBURN',
    hat_color: 'BLACK',
    facial_hair_type: 'DEFAULT',
    facial_hair_color: 'AUBURN',
    mouth_type: 'DEFAULT',
    eye_type: 'DEFAULT',
    eyebrow_type: 'DEFAULT',
    accessories_type: 'DEFAULT',
    clothe_type: 'BLAZER_SHIRT',
    clothe_color: 'BLACK',
    clothe_graphic_type: 'BAT'
  });

  const handleChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
    generateAvatar();
  }, [options])

  const generateAvatar = () => {
    axios.post('/profile_generate_avatar', {
      options
    })
      .then(res => {
        setAvatar(`data:image/png;base64,${res.data.avatar}`)
      })
  };

  const saveAvatar = () => {
    axios.post('/profile_set_avatar', {
      token,
      avatar_base64: avatar
    })
      .then(() => {
        fetchProfile();
        handleClose();
      })
      .catch(() => {})
  }

  return (
    <ModalInterface
      open={open}
      handleClose={handleClose}
      aria-label="edit avatar modal"
    >
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {types.map((type, idx) =>
        <FormControl key={idx} size='small'>
          <InputLabel>{type.name}</InputLabel>
          <Select
            name={type.name}
            value={options[type.name]}
            label={type.name}
            onChange={handleChange}
          >
            {type.ref.map((style, idx) =>
              <MenuItem key={idx} value={style}>{style}</MenuItem>
            )}
          </Select>
        </FormControl>
      )}
      </Box>

      <Button variant='contained' onClick={saveAvatar}>
        Save Avatar
      </Button>

      {avatar &&
        <Box component='img' src={avatar} alt="Generated avatar" />
      }
    </ModalInterface>
  )
};

export default ProfileAvatar;
