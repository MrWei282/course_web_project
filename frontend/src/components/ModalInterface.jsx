import React from 'react';

import { Box, Modal, Fade, Backdrop } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 12,
  p: 4,
  borderRadius: 1,
};

const ModalInterface = ({ open, handleClose, children, ...restProps }) => {
  return (
    <Modal
      {...restProps}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 100,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {children}
        </Box>
      </Fade>
    </Modal>
  )
};

export default ModalInterface;
