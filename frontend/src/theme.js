import { createTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const palette = {
  primary: {
    light: '#EAE9F8',
    main: '#AEAAE4',
    dark: '#A3A3E5',
    darker: '#645CCB',
    contrastText: '#fff'
  },
  text: {
    primary: '#4E4E4E',
    secondary: '#767676'
  },
  background: {
    default: '#EAE9F8'
  },
  error: {
    main: '#BA433B'
  }
};

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      }
    },
    MuiButtonGroup: {
      defaultProps: {
        disableRipple: true,
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1em'
        }
      }
    },
    MuiLink: {
      defaultProps: {
        component: RouterLink,
      },
      styleOverrides: {
        root: {
          color: palette.primary.darker
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          letterSpacing: 'normal',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: palette.primary.main,
        },
      },
    },
  },
  palette,
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 'bold'
    },
  },
});

export default theme;
