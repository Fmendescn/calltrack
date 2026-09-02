import { StyleSheet } from 'react-native';
import { Colors, Radius, Typography } from '@/shared/constants/theme';

export const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.md,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  disabled: {
    opacity: 0.35,
  },
  text: {
    ...Typography.base,
    color: Colors.text.inverse,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textSecondary: {
    color: Colors.text.secondary,
  },
});
