import { COLORS, STICKY_NOTE_COLORS } from "../utils/constants";

export const theme = {
  colors: {
    ...COLORS,
    stickyNotes: STICKY_NOTE_COLORS,
  },
  fonts: {
    primary: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    heading: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    monospace: '"Courier New", monospace',
  },
  fontSizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  spacing: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.15)",
    stickyNote: "0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.2)",
    stickyNoteHover:
      "0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.25)",
  },
  breakpoints: {
    xs: "0px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    "2xl": "1400px",
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  transitions: {
    fast: "0.15s ease-in-out",
    normal: "0.3s ease-in-out",
    slow: "0.5s ease-in-out",
  },
};

// Utility functions for theme access
export const getColor = (colorPath) => {
  return colorPath.split(".").reduce((obj, key) => obj[key], theme.colors);
};

export const getSpacing = (size) => {
  return theme.spacing[size] || size;
};

export const getFontSize = (size) => {
  return theme.fontSizes[size] || size;
};

export const getBreakpoint = (bp) => {
  return theme.breakpoints[bp];
};

// Media query helpers
export const mediaQueries = {
  up: (breakpoint) => `@media (min-width: ${theme.breakpoints[breakpoint]})`,
  down: (breakpoint) => {
    const bpValues = Object.values(theme.breakpoints);
    const currentIndex = Object.keys(theme.breakpoints).indexOf(breakpoint);
    const nextBreakpoint = bpValues[currentIndex + 1];
    return nextBreakpoint
      ? `@media (max-width: calc(${nextBreakpoint} - 1px))`
      : "";
  },
  between: (min, max) =>
    `@media (min-width: ${theme.breakpoints[min]}) and (max-width: calc(${theme.breakpoints[max]} - 1px))`,
};

export default theme;
