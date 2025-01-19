import React from 'react';

import { TextField, Box, Button } from '@mui/material';
import Title from 'components/Title';
import CloseIcon from '@mui/icons-material/Close';
import ModalInterface from 'components/ModalInterface';
import AuthContext from 'AuthContext';
import ProfileIconButton from 'components/Profile/ProfileIconButton';
import { convertImageToBase64 } from 'utils/helpers.js';
import ImageInput from 'components/ImageInput';
import axios from 'axios';

const defaultErrors = {
  name: '',
  desc: '',
  cost: '',
  thumbnail: ''
};

const PointsCreateItem = ({ open, handleClose, courseId, fetchItems }) => {
  const [errors, setErrors] = React.useState(defaultErrors);
  const { token } = React.useContext(AuthContext);
  const [thumbnail, setThumbnail] = React.useState('');
  const [thumbnailFile, setThumbnailFile] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('name') === '') {
      setErrors({ ...defaultErrors, firstName: 'Please enter an item name' });
      return;
    } else if (data.get('desc') === '') {
      setErrors({ ...defaultErrors, lastName: 'Please enter an item description' });
      return;
    } else if (data.get('cost') === '' || isNaN(data.get('cost'))) {
      setErrors({ ...defaultErrors, password: 'Please enter integer item cost' });
      return;
    } else if (thumbnailFile === '') {
      setErrors({ ...defaultErrors, thumbnail: 'Please upload image' });
      return;
    }

    axios.post('/game/insert_item_into_shop', {
      token,
      course_id: courseId,
      item_file: thumbnailFile,
      item_name: data.get('name'),
      item_desc: data.get('desc'),
      cost: data.get('cost')
    })
      .then(() => {
        setErrors({ ...defaultErrors });
        handleClose();
        fetchItems();
      })
  }

  const handleThumbnailUpload = (e, format) => {
    if (format === 'text') {
      setThumbnail(e.target.value);
      convertImageToBase64(e.target.value)
        .then(img => {
          setThumbnailFile(img);
          setErrors({ ...errors, thumbnail: '' })
        })
        .catch(err => setErrors({ ...errors, thumbnail: err.message }));
    } else {
      convertImageToBase64(e.target.files[0])
        .then(img => {
          setThumbnailFile(img);
          setThumbnail(e.target.files[0].name);
          setErrors({ ...errors, thumbnail: '' })
        })
        .catch(err => setErrors({ ...errors, thumbnail: err.message }));
    }
  };

  return (
    <ModalInterface
      open={open}
      handleClose={handleClose}
      aria-label="create item modal"
    >
      <Title end={<ProfileIconButton onClick={handleClose} icon={<CloseIcon />}/>}>
        Create Item
      </Title>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Name" name="name" error={errors.name !== ''} helperText={errors.name}/>
        <TextField label="Description" name="desc" error={errors.desc !== ''} helperText={errors.desc}/>
        <TextField label="Cost" name="cost" error={errors.cost !== ''} helperText={errors.cost}/>
        <ImageInput
            label='Thumbnail'
            value={thumbnail}
            onChangeText={(e) => handleThumbnailUpload(e, 'text')}
            onChangeIcon={(e) => handleThumbnailUpload(e, 'file')}
            error={errors.thumbnail !== ''}
            helperText={errors.thumbnail}
          />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box component="img" sx={{ aspectRatio: 1, width: '125px', objectFit: 'cover', textAlign: 'center' }} alt="Thumbnail" src={thumbnailFile} />
        </Box>

        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </ModalInterface>
  )
};

export default PointsCreateItem;
