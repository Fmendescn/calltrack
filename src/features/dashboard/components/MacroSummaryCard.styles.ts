import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '@/shared/constants/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  topBar: {
    height: 2,
    borderRadius: 1,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.xs,
    fontWeight: '700',
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  badgeText: {
    ...Typography.xs,
    fontWeight: '700',
  },
  valuesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  consumed: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  unit: {
    ...Typography.xs,
    color: Colors.text.muted,
    marginLeft: 3,
    fontWeight: '600',
  },
  goal: {
    ...Typography.xs,
    color: Colors.text.muted,
    marginLeft: Spacing.xs,
  },
  remaining: {
    ...Typography.xs,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
  remainingValue: {
    fontWeight: '600',
    color: Colors.text.secondary,
  },
});
