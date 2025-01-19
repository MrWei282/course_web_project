import React from 'react';

import { IconButton, TextField, InputAdornment, Tooltip } from '@mui/material';

import PhotoCamera from '@mui/icons-material/PhotoCamera';
import HelpOutline from '@mui/icons-material/HelpOutline';

const ImageInput = ({ label, value, onChangeText, onChangeIcon, error, helperText, size = 'small' }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChangeText}
      error={error}
      helperText={helperText}
      size={size}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Tooltip placement="top" title="Enter a link to an image, or upload your own image">
              <HelpOutline sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </InputAdornment>
        ),
        endAdornment: (
          <IconButton aria-label="upload picture" component="label">
            <input hidden accept="image/*" type="file" onChange={onChangeIcon}/>
            <PhotoCamera />
          </IconButton>
        )
      }
    }/>
  );
}

export default ImageInput;
