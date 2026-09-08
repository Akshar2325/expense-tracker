import { useWindowDimensions } from "react-native";

export interface Responsive {
  /** True on phones (width < 600). */
  isPhone: boolean;
  /** True on tablets / iPad portrait (600–1024). */
  isTablet: boolean;
  /** True on large tablets / iPad landscape / desktop (>= 1024). */
  isLarge: boolean;
  /** Content max width for tablet+ layouts. */
  contentWidth: number;
  /** Number of columns for grids. */
  columns: number;
  /** Horizontal padding for the screen. */
  padding: number;
  /** Whether the tab bar should be a sidebar (large screens). */
  useSidebar: boolean;
}

const PHONE_MAX = 600;
const TABLET_MAX = 1024;

export function useResponsive(): Responsive {
  const { width } = useWindowDimensions();

  const isPhone = width < PHONE_MAX;
  const isTablet = width >= PHONE_MAX && width < TABLET_MAX;
  const isLarge = width >= TABLET_MAX;

  return {
    isPhone,
    isTablet,
    isLarge,
    contentWidth: Math.min(width - (isPhone ? 32 : 64), 1200),
    columns: isPhone ? 1 : isTablet ? 2 : 3,
    padding: isPhone ? 16 : 32,
    useSidebar: isLarge,
  };
}
