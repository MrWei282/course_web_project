import React from 'react';

import { FormControl, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';

const ObjectSelect = ({ objects, labelKey, value, onChange, label, error = '', size = 'large' }) => {
  return (
  <FormControl fullWidth error={error !== ''} size={size}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      label={label}
      onChange={onChange}
    >
      {objects.map((object, idx) =>
        <MenuItem key={idx} value={object}>{object[labelKey]}</MenuItem>
      )}
    </Select>
    <FormHelperText>{error}</FormHelperText>
  </FormControl>
  )
};

export default ObjectSelect;
