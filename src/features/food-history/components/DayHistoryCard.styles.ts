import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '@/shared/constants/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    padding: Spacing.lg,
  },
  date: {
    ...Typography.xs,
    color: Colors.text.muted,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  caloriesValue: {
    ...Typography['2xl'],
    color: Colors.text.primary,
    fontWeight: '800',
  },
  percentage: {
    ...Typography.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  percentageExceeded: {
    color: Colors.danger,
  },
  statusLine: {
    ...Typography.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  statusLineExceeded: {
    color: Colors.danger,
    fontWeight: '600',
  },
  macroRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  macroChip: {
    ...Typography.xs,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  emptyText: {
    ...Typography.sm,
    color: Colors.text.muted,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  entriesList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});
