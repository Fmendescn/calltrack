import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '@/shared/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  // Hero card
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroAccent: {
    height: 3,
    backgroundColor: Colors.primary,
  },
  heroInner: {
    padding: Spacing.lg,
  },
  heroDate: {
    ...Typography.xs,
    color: Colors.text.muted,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroLeft: {
    flex: 1,
  },
  heroLabel: {
    ...Typography.xs,
    color: Colors.text.muted,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  heroValue: {
    ...Typography['3xl'],
    color: Colors.text.primary,
    fontWeight: '800',
    letterSpacing: -1,
  },
  heroUnit: {
    ...Typography.lg,
    color: Colors.text.secondary,
    fontWeight: '400',
    letterSpacing: 0,
  },
  heroSubline: {
    ...Typography.sm,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  heroRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    paddingBottom: 4,
  },
  heroPct: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -1,
  },
  heroPctSign: {
    ...Typography.lg,
    color: Colors.primary,
    fontWeight: '700',
    paddingBottom: 3,
  },
  heroTrack: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: Spacing.md,
  },
  heroFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  heroGoalLine: {
    ...Typography.xs,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },

  // Section
  sectionTitle: {
    ...Typography.xs,
    fontWeight: '700',
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionCount: {
    color: Colors.text.secondary,
    fontWeight: '400',
  },

  // Macro grid
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  macroGridItem: {
    width: '48.5%',
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 28,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
    letterSpacing: 8,
  },
  emptyText: {
    ...Typography.base,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  emptyHint: {
    ...Typography.sm,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
});
