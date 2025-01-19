import React from 'react'
import { useTheme } from '@emotion/react';
import { Box, Button } from '@mui/material';
import { Wheel } from 'react-custom-roulette'

const GambleWheel = ({ data, prizeNumber, handleSpin, mustSpin, setMustSpin, disabled = false }) => {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        disabled={disabled}
        size='large'
        sx={{
          zIndex: 6,
          height: 90,
          borderRadius: 10,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'large',
          color: 'primary.darker'
        }}
        onClick={() => {
          if (!mustSpin) {
            handleSpin();
          }
        }}
      >
        Spin!
      </Button>
      <Box sx={{ position: 'relative' }}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          outerBorderColor={theme.palette.primary.darker}
          radiusLineColor={theme.palette.primary.darker}
          innerRadius={20}
          innerBorderColor={theme.palette.primary.darker}
          innerBorderWidth={5}
          backgroundColors={[
            theme.palette.primary.main,
            theme.palette.primary.light,
          ]}
          textColors={[
            theme.palette.primary.contrastText,
            theme.palette.text.primary,
          ]}
          onStopSpinning={() => {
            setMustSpin(false);
          }}
        />
      </Box>
    </Box>
  )
}

export default GambleWheel;
