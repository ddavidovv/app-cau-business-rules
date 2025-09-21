import React from 'react';
import { Settings, User, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cssStyles } from '../../config/styles';
import { colors } from '../../config/colors';

const headerStyles = cssStyles.header;

const Header: React.FC = () => {
  const { userEmail, userRole } = useAuth();

  // Header corporativo CTT
  const handleClose = () => {
    try {
      window.close();
      setTimeout(() => {
        if (!window.closed) {
          window.location.href = 'about:blank';
          window.close();
        }
      }, 100);
    } catch (e) {
      window.location.href = 'about:blank';
    }
  };

  return (
    <header style={headerStyles.container}>
      <div style={headerStyles.content}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings
            size={32}
            style={{ color: colors.corporate.primary }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={headerStyles.title}>
              CAU Business Rules Admin
            </span>
            <span style={headerStyles.version}>
              v1.0.0
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {userEmail && (
            <div style={headerStyles.userInfo}>
              <User size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              <span>{userEmail}</span>
              {userRole && (
                <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: colors.gray[100],
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}>
                  {userRole}
                </span>
              )}
            </div>
          )}
          <button
            onClick={handleClose}
            style={headerStyles.closeButton}
            title="Cerrar ventana"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.corporate.light;
              e.currentTarget.style.color = colors.corporate.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.gray[400];
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;