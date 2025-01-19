import React from 'react';

import { InputAdornment, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({ onClick, ...restProps }) => {
  return (
    <TextField
      {...restProps}
      InputProps={{
        endAdornment:
          <InputAdornment position="end">
            <IconButton
            onClick={onClick}
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
      }}
    />
  );
}

export default MessageInput;
