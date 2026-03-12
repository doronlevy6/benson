import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f2a37',
      dark: '#111827',
      light: '#2f3f52',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c48a3b',
      dark: '#9c6c2b',
      light: '#ddb375',
      contrastText: '#1f2a37',
    },
    background: {
      default: '#eef1f3',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2a37',
      secondary: '#4f5d6b',
    },
  },
  typography: {
    fontFamily: '"Heebo", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Oswald", "Heebo", sans-serif',
      fontWeight: 600,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    h2: {
      fontFamily: '"Oswald", "Heebo", sans-serif',
      fontWeight: 500,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    h3: {
      fontFamily: '"Oswald", "Heebo", sans-serif',
      fontWeight: 500,
      letterSpacing: 0.3,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: 0.2,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          margin: 0,
          minHeight: '100vh',
          background:
            'radial-gradient(circle at 15% -10%, rgba(196, 138, 59, 0.18), transparent 40%), radial-gradient(circle at 85% 10%, rgba(31, 42, 55, 0.12), transparent 36%), #eef1f3',
        },
        '#root': {
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(31, 42, 55, 0.1)',
          boxShadow: '0 8px 20px rgba(17, 24, 39, 0.08)',
        },
      },
    },
  },
})

export default theme
