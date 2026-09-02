import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography, Shadow } from '@/shared/constants/theme';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  sectionTitle: {
    ...Typography.xs,
    fontWeight: '700',
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  fieldContainer: {
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.sm,
    color: Colors.text.secondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    ...Typography.base,
    color: Colors.text.primary,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },

  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  macroField: {
    width: '47%',
  },
  macroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  macroDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  actions: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },

  // ── Mode toggle ─────────────────────────────────────────────────
  modeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: Spacing.md,
  },
  modeToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  modeToggleText: {
    ...Typography.sm,
    color: Colors.text.muted,
    fontWeight: '600',
  },
  modeToggleActive: {
    color: Colors.primary,
  },
  modeToggleSeparator: {
    ...Typography.sm,
    color: Colors.text.muted,
    marginHorizontal: 2,
  },

  // ── Search ───────────────────────────────────────────────────────
  searchWrapper: {
    position: 'relative',
    zIndex: 10,
    marginBottom: Spacing.sm,
  },
  searchInputActive: {
    borderColor: Colors.primary,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 220,
    zIndex: 20,
    overflow: 'hidden',
    ...Shadow.md,
  },
  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    ...Typography.base,
    color: Colors.text.primary,
  },
  dropdownEmptyText: {
    ...Typography.sm,
    color: Colors.text.muted,
    padding: Spacing.md,
    textAlign: 'center',
  },

  // ── Selected food banner ─────────────────────────────────────────
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(198,241,53,0.08)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(198,241,53,0.25)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  selectedBannerText: {
    ...Typography.sm,
    color: Colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  selectedBannerClear: {
    ...Typography.base,
    color: Colors.text.muted,
    padding: Spacing.xs,
  },

  // ── Macro preview chips ──────────────────────────────────────────
  macroPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  macroPreviewChip: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  macroPreviewText: {
    ...Typography.xs,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  macroPreviewCalText: {
    color: '#F59E0B',
  },
});
