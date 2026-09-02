import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '@/shared/constants/theme';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  infoText: {
    ...Typography.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },

  fieldCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  label: {
    flex: 1,
    ...Typography.sm,
    fontWeight: '700',
    color: Colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  unit: {
    ...Typography.sm,
    color: Colors.text.muted,
    fontWeight: '400',
    textTransform: 'none',
    letterSpacing: 0,
  },
  input: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 11,
    ...Typography.lg,
    fontWeight: '700',
    color: Colors.text.primary,
  },

  actions: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.25)',
  },
  savedText: {
    ...Typography.sm,
    color: Colors.success,
    fontWeight: '700',
  },
});
