/**
 * Category-aware variant configuration.
 * 'sizes'  → clothing-style size picker (S, M, L, XL, XXL…)
 * 'colors' → color picker (Black, White, Red…)
 * 'none'   → no variants needed (tech, watches, skincare…)
 */

export const CATEGORY_VARIANT_TYPE = {
  "Women's Fashion & Accessories": 'sizes',
  "Men's Fashion & Accessories": 'sizes',
  'Beauty, Health & Personal Care': 'none',
  'Office & Stationery': 'none',
  'Groceries & Pet Supplies': 'none',
  'Hardware & DIY Tools': 'none',
  'Health & Medical Care': 'none',
  'Books, Music & Media': 'none',
  // Everything else (Tech, Home, Toys, Sports, Auto, etc.) → 'colors'
};

/** Returns 'sizes' | 'colors' | 'none' for a given category string */
export const getVariantType = (category) =>
  CATEGORY_VARIANT_TYPE[category] ?? 'colors';

export const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export const COLOR_OPTIONS = [
  'Black', 'White', 'Red', 'Blue', 'Green',
  'Yellow', 'Pink', 'Purple', 'Orange', 'Brown',
  'Gray', 'Navy', 'Beige', 'Cream', 'Multicolor',
];

/** Colour dot map for the colour swatches */
export const COLOR_HEX = {
  Black:      '#1a1a1a',
  White:      '#ffffff',
  Red:        '#ef4444',
  Blue:       '#3b82f6',
  Green:      '#22c55e',
  Yellow:     '#eab308',
  Pink:       '#ec4899',
  Purple:     '#a855f7',
  Orange:     '#f97316',
  Brown:      '#92400e',
  Gray:       '#6b7280',
  Navy:       '#1e3a5f',
  Beige:      '#d4b483',
  Cream:      '#fef9c3',
  Multicolor: 'linear-gradient(135deg,#ef4444,#3b82f6,#22c55e,#eab308)',
};

/** Human-readable label for the variant type */
export const variantLabel = (type) =>
  type === 'sizes' ? 'Available Sizes' : type === 'colors' ? 'Available Colours' : null;
