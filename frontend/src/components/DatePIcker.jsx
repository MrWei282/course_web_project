import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const DatePicker = ({ label, onChange, error, helperText, size = 'small', disablePast = false }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker onChange={onChange} format="DD/MM/YYYY h:mm A" label={label} disablePast={disablePast} slotProps={{
        textField: {
          error,
          helperText,
          size
        },
      }}/>
    </LocalizationProvider>
  );
}

export default DatePicker;
