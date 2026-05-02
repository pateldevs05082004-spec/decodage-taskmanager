// Decode Age Brand Colors - matching the logo
export const theme = {
  // Primary brand colors (purple/blue gradient from logo)
  colors: {
    primary: '#7C3AED', // Purple from logo
    primaryDark: '#6D28D9',
    primaryLight: '#A78BFA',
    secondary: '#3B82F6', // Blue from logo
    secondaryDark: '#2563EB',
    secondaryLight: '#60A5FA',
    
    // Accent colors
    accent: '#EC4899', // Pink accent
    accentLight: '#F9A8D4',
    
    // Status colors
    success: '#10B981',
    successLight: '#D1FAE5',
    successDark: '#059669',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    warningDark: '#D97706',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    dangerDark: '#DC2626',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    
    // Background colors
    background: {
      primary: '#FAFBFC',
      secondary: '#F3F4F6',
      card: '#FFFFFF',
      hover: '#F9FAFB',
    },
  },
  
  // Gradients matching the logo
  gradients: {
    primary: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
    primaryReverse: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    subtle: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    purple: '0 10px 25px -5px rgba(124, 58, 237, 0.3)',
    blue: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
  },
  
  // Border radius
  radius: {
    sm: '0.375rem',
    base: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  
  // Spacing
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    base: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  
  // Typography
  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export type Theme = typeof theme;
