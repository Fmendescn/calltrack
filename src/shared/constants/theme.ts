import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#C6F135',
  primaryDark: '#9BBE28',
  primaryLight: 'rgba(198, 241, 53, 0.12)',

  background: '#0A0A0C',
  surface: '#111114',
  surfaceAlt: '#18181C',

  text: {
    primary: '#EEECEA',
    secondary: '#86858E',
    muted: '#42414A',
    inverse: '#0A0A0C',
  },

  border: '#222228',
  success: '#4ADE80',
  danger: '#FF5252',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
};

export const Shadow = {
  sm: StyleSheet.create({
    box: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
  }).box,
  md: StyleSheet.create({
    box: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 6,
    },
  }).box,
};

export const Typography = {
  xs:    { fontSize: 11, lineHeight: 16 },
  sm:    { fontSize: 13, lineHeight: 18 },
  base:  { fontSize: 15, lineHeight: 22 },
  lg:    { fontSize: 17, lineHeight: 24 },
  xl:    { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 26, lineHeight: 34 },
  '3xl': { fontSize: 40, lineHeight: 48 },
};
