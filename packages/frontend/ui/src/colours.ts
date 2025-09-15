/**
 * Maistro Design System Colors
 */

export const colors = {
  // Primary Colors
  primary: {
    black: '#111111', // Used in the "m" logo and primary text
    white: '#FFFFFF', // Background and contrast
  },

  // Accent Colors
  accent: {
    pink: '#EC4899', // Seen with the heart emoji
    orange: '#F97316', // Seen with the fire emoji
  },

  // UI/Secondary Colors
  ui: {
    lightGray: '#F8F9FA', // Background elements
    mediumGray: '#E0E0E0', // Borders and dividers
    darkGray: '#757575', // Secondary text
    notification: '#FF3040', // Notification dot
  },

  // Status Colors
  status: {
    success: '#10B981', // Green for success states
    warning: '#FBBF24', // Yellow for warning states
    error: '#EF4444', // Red for error states
    info: '#3B82F6', // Blue for information
  },

  // Transparent variants (for overlays, etc.)
  transparent: {
    black10: 'rgba(17, 17, 17, 0.1)',
    black20: 'rgba(17, 17, 17, 0.2)',
    black50: 'rgba(17, 17, 17, 0.5)',
    black80: 'rgba(17, 17, 17, 0.8)',
  },
};

// Tailwind CSS color configuration
export const maistroColours = {
  primary: {
    DEFAULT: colors.primary.black,
    white: colors.primary.white,
  },
  accent: {
    pink: {
      DEFAULT: colors.accent.pink,
      light: '#F9A8D4', // Lighter variant
      dark: '#BE185D', // Darker variant
    },
    orange: {
      DEFAULT: colors.accent.orange,
      light: '#FDBA74', // Lighter variant
      dark: '#C2410C', // Darker variant
    },
  },
  gray: {
    50: colors.ui.lightGray,
    100: '#F1F5F9',
    200: colors.ui.mediumGray,
    300: '#CBD5E1',
    400: '#94A3B8',
    500: colors.ui.darkGray,
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  status: {
    success: colors.status.success,
    warning: colors.status.warning,
    error: colors.status.error,
    info: colors.status.info,
  },
};

export default colors;
