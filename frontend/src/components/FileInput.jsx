import React from 'react';

import { Box, Typography, Button } from '@mui/material';

const FileInput = ({ label = '', error, setError, setFile, fileName, setFileName }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(reader.result);
      setError('');
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button variant="contained" component="label" color={error !== '' ? 'error' : 'primary'} sx={{ alignSelf: 'flex-start' }}>
        {label}
        <input type="file" hidden onChange={handleFileUpload} />
      </Button>
      <Typography sx={{ color: error !== '' ? 'error.main' : 'text.primary' }}>
        {error !== '' ? error : fileName}
      </Typography>
    </Box>
  )
};

export default FileInput;
