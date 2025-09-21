import { colors } from './colors';

export const cssStyles = {
  header: {
    container: {
      background: colors.white,
      borderBottom: `1px solid ${colors.gray[200]}`,
      padding: '0.5rem 0',
      position: 'sticky' as const,
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
    },
    content: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 1.5rem',
      minHeight: 56
    },
    title: {
      fontWeight: 700,
      fontSize: '1.12rem',
      color: colors.corporate.primary
    },
    version: {
      fontSize: '0.85rem',
      color: colors.gray[500],
      fontWeight: 400
    },
    userInfo: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      fontSize: '0.97rem',
      color: colors.gray[700],
      fontWeight: 500
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.25rem',
      borderRadius: '9999px',
      transition: 'background 0.2s',
      color: colors.gray[400],
      marginLeft: '0.5rem',
      outline: 'none'
    }
  },
  button: {
    primary: {
      backgroundColor: colors.corporate.primary,
      color: colors.white,
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      outline: 'none',
      fontSize: '0.875rem'
    },
    secondary: {
      backgroundColor: colors.white,
      color: colors.corporate.primary,
      border: `1px solid ${colors.corporate.primary}`,
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      outline: 'none',
      fontSize: '0.875rem'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.gray[700],
      border: `1px solid ${colors.gray[300]}`,
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      outline: 'none',
      fontSize: '0.875rem'
    }
  }
};