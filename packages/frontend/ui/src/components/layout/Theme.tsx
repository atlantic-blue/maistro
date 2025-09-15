import { Theme, ThemeProps } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

export const MaistroTheme: React.FC<ThemeProps> = ({
  children,
  accentColor = 'amber',
  appearance = 'light',
}) => {
  return (
    <Theme
      accentColor={accentColor}
      grayColor="auto"
      scaling="100%"
      radius="small"
      appearance={appearance}
    >
      {children}
    </Theme>
  );
};

export const themeConfig = {
  colors: {
    primary: {
      dark: '#000000', // Pure black as seen in the logo
      DEFAULT: '#000000',
      light: '#333333',
    },
    accent: {
      pink: '#FF6F7D',
      DEFAULT: '#FF6F7D',
    },
    secondary: {
      DEFAULT: '#4A4A4A',
    },
    gray: {
      50: '#F9F9F9',
      100: '#F3F3F3',
      200: '#E6E6E6',
      300: '#D1D1D1',
      400: '#ADADAD',
      500: '#7E7E7E',
      600: '#5C5C5C',
      700: '#444444',
      800: '#2A2A2A',
      900: '#161616',
    },
  },
  fontFamily: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    heading:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
};
