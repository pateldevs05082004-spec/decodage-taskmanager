import { useState } from 'react';
import { theme } from '../styles/theme';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin(data.token, data.user);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated background with gradient */}
      <div style={styles.backgroundGradient}></div>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.card}>
        {/* Logo Section */}
        <div style={styles.logoSection}>
          <img 
            src="/logo.png" 
            alt="Decode Age" 
            style={styles.logo}
          />
          <h1 style={styles.title}>Task Manager</h1>
          <p style={styles.subtitle}>Manage your team's tasks efficiently</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={styles.labelIcon}>
                <path d="M2.5 3A1.5 1.5 0 001 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0015 5.293V4.5A1.5 1.5 0 0013.5 3h-11z"/>
                <path d="M15 6.954L8.978 9.86a2.25 2.25 0 01-1.956 0L1 6.954V11.5A1.5 1.5 0 002.5 13h11a1.5 1.5 0 001.5-1.5V6.954z"/>
              </svg>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={styles.labelIcon}>
                <path d="M8 1a2 2 0 012 2v4H6V3a2 2 0 012-2zm3 6V3a3 3 0 00-6 0v4a2 2 0 00-2 2v5a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2z"/>
              </svg>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={styles.error}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0 }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner}></span>
                Signing in...
              </span>
            ) : (
              <span style={styles.buttonContent}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sign In
              </span>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={styles.footerIcon}>
            <path fillRule="evenodd" d="M8 1a3.5 3.5 0 00-3.5 3.5V7A1.5 1.5 0 003 8.5v5A1.5 1.5 0 004.5 15h7a1.5 1.5 0 001.5-1.5v-5A1.5 1.5 0 0011.5 7V4.5A3.5 3.5 0 008 1zm2 6V4.5a2 2 0 10-4 0V7h4z" clipRule="evenodd" />
          </svg>
          <span style={styles.footerText}>Secured with JWT Authentication</span>
        </div>
      </div>

      <div style={styles.brandFooter}>
        <p style={styles.brandText}>© 2024 Decode Age. All rights reserved.</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.gradients.primary,
    opacity: 0.05,
    zIndex: 0,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 25% 25%, ${theme.colors.primary}15 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, ${theme.colors.secondary}15 0%, transparent 50%)
    `,
    zIndex: 0,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: '48px',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows['2xl'],
    width: '100%',
    maxWidth: '480px',
    position: 'relative',
    zIndex: 1,
    border: `1px solid ${theme.colors.gray[100]}`,
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logo: {
    width: '120px',
    height: 'auto',
    marginBottom: '20px',
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
  },
  title: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.gray[900],
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.gray[600],
    fontWeight: theme.fontWeights.normal,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.gray[700],
  },
  labelIcon: {
    color: theme.colors.gray[400],
  },
  input: {
    padding: '14px 16px',
    border: `2px solid ${theme.colors.gray[200]}`,
    borderRadius: theme.radius.md,
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.sans,
    backgroundColor: theme.colors.white,
    color: theme.colors.gray[900],
    transition: theme.transitions.base,
  },
  button: {
    padding: '16px 24px',
    background: theme.gradients.primary,
    color: theme.colors.white,
    border: 'none',
    borderRadius: theme.radius.md,
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontWeights.semibold,
    cursor: 'pointer',
    boxShadow: theme.shadows.purple,
    transition: theme.transitions.base,
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: theme.colors.white,
    borderRadius: theme.radius.full,
    animation: 'spin 0.6s linear infinite',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    backgroundColor: theme.colors.dangerLight,
    color: theme.colors.dangerDark,
    borderRadius: theme.radius.md,
    fontSize: theme.fontSizes.sm,
    border: `1px solid ${theme.colors.danger}`,
    fontWeight: theme.fontWeights.medium,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '32px 0 24px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: theme.colors.gray[200],
  },
  dividerText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  demoSection: {
    marginBottom: '24px',
  },
  demoCard: {
    padding: '20px',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.gray[200]}`,
  },
  demoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  demoIcon: {
    color: theme.colors.primary,
  },
  demoLabel: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.gray[700],
  },
  demoCredentials: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  demoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  demoKey: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[600],
    minWidth: '80px',
  },
  demoValue: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[800],
    fontFamily: theme.fonts.mono,
    backgroundColor: theme.colors.white,
    padding: '6px 12px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.gray[200]}`,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    paddingTop: '24px',
    borderTop: `1px solid ${theme.colors.gray[200]}`,
  },
  footerIcon: {
    color: theme.colors.gray[400],
  },
  footerText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray[500],
  },
  brandFooter: {
    marginTop: '32px',
    textAlign: 'center',
    zIndex: 1,
  },
  brandText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray[500],
  },
};

// Add keyframe animation and hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  input:hover {
    border-color: ${theme.colors.gray[300]} !important;
  }
  
  input:focus {
    border-color: ${theme.colors.primary} !important;
    box-shadow: 0 0 0 4px ${theme.colors.primary}15 !important;
    outline: none;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.xl} !important;
  }
  
  button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);
