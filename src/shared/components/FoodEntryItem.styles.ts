import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '@/shared/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  accent: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: Colors.primary,
  },
  info: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  name: {
    ...Typography.base,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    ...Typography.xs,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  calorieChip: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  calorieChipText: {
    color: '#F59E0B',
  },
  deleteButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 14,
    color: Colors.text.muted,
    fontWeight: '700',
  },
});
