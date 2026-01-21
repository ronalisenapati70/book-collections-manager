export const COLLECTION_THEME_COLORS = [
  'indigo',
  'emerald',
  'rose',
  'amber',
  'cyan',
  'violet',
  'teal',
] as const;

export type CollectionThemeColor = (typeof COLLECTION_THEME_COLORS)[number];
