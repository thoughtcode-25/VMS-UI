import { createTheme, alpha } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1A4B8C',
      light: '#2E6BC4',
      dark: '#0F2D56',
    },
    secondary: {
      main: '#00897B',
      light: '#26A69A',
      dark: '#00695C',
    },
    warning: {
      main: '#F57C00',
      light: '#FFB74D',
    },
    info: {
      main: '#0288D1',
      light: '#4FC3F7',
    },
    error: {
      main: '#C62828',
      light: '#EF5350',
    },
    success: {
      main: '#2E7D32',
      light: '#66BB6A',
    },
    background: {
      default: '#F0F4FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2333',
      secondary: '#5A6A85',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body2: { lineHeight: 1.6 },
    caption: { lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(26,75,140,0.06), 0px 1px 2px rgba(26,75,140,0.04)',
    '0px 2px 6px rgba(26,75,140,0.08), 0px 1px 3px rgba(26,75,140,0.05)',
    '0px 4px 12px rgba(26,75,140,0.10), 0px 2px 4px rgba(26,75,140,0.06)',
    '0px 6px 16px rgba(26,75,140,0.12)',
    '0px 8px 24px rgba(26,75,140,0.14)',
    '0px 10px 28px rgba(26,75,140,0.16)',
    '0px 12px 32px rgba(26,75,140,0.18)',
    '0px 14px 36px rgba(26,75,140,0.20)',
    '0px 16px 40px rgba(26,75,140,0.22)',
    '0px 18px 44px rgba(26,75,140,0.24)',
    '0px 20px 48px rgba(26,75,140,0.26)',
    '0px 22px 52px rgba(26,75,140,0.28)',
    '0px 24px 56px rgba(26,75,140,0.30)',
    '0px 26px 60px rgba(26,75,140,0.32)',
    '0px 28px 64px rgba(26,75,140,0.34)',
    '0px 30px 68px rgba(26,75,140,0.36)',
    '0px 32px 72px rgba(26,75,140,0.38)',
    '0px 34px 76px rgba(26,75,140,0.40)',
    '0px 36px 80px rgba(26,75,140,0.42)',
    '0px 38px 84px rgba(26,75,140,0.44)',
    '0px 40px 88px rgba(26,75,140,0.46)',
    '0px 42px 92px rgba(26,75,140,0.48)',
    '0px 44px 96px rgba(26,75,140,0.50)',
    '0px 46px 100px rgba(26,75,140,0.52)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: { backgroundColor: '#F0F4FA' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          letterSpacing: 0.2,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(26,75,140,0.25)',
          '&:hover': { boxShadow: '0 4px 12px rgba(26,75,140,0.35)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0px 2px 8px rgba(26,75,140,0.07)',
          border: '1px solid rgba(26,75,140,0.06)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0px 6px 20px rgba(26,75,140,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(26,75,140,0.07)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
          borderRadius: 6,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#5A6A85',
            backgroundColor: '#F0F4FA',
            borderBottom: '2px solid rgba(26,75,140,0.08)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha('#1A4B8C', 0.03),
          },
          '&:last-child td': { borderBottom: 0 },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(26,75,140,0.06)',
          padding: '12px 16px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 44,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '8px !important',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(26,75,140,0.15)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(26,75,140,0.3)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(26,75,140,0.08)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 0 rgba(26,75,140,0.08)',
        },
      },
    },
  },
});
