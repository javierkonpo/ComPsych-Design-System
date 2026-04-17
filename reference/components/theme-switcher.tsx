'use client';

import {
  BRANDS,
  BRAND_LABELS,
  PRODUCTS,
  PRODUCT_LABELS,
  PLACEHOLDER_PRODUCTS,
  type Brand,
  type Product,
} from '@/lib/tokens';
import { useTheme } from '@/lib/theme-context';

const selectStyle: React.CSSProperties = {
  height: 34,
  padding: '0 10px',
  borderRadius:
    'var(--sys-dimensions-border-radius-sys-radius-sm, 6px)',
  border:
    '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
  backgroundColor:
    'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
  color:
    'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
  fontSize: 13,
  fontWeight: 500,
};

const labelStyle: React.CSSProperties = {
  color:
    'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
};

/**
 * Product `<select>`. Primary theme control — visible by default in the
 * header, the hero of the stakeholder demo.
 */
export function ProductSelect() {
  const { product, setProduct, isPlaceholder } = useTheme();
  return (
    <label className="flex items-center gap-2 text-xs" style={labelStyle}>
      <span>Product</span>
      <select
        aria-label="Product"
        value={product}
        onChange={(e) => setProduct(e.target.value as Product)}
        style={{ ...selectStyle, minWidth: 190, maxWidth: 220 }}
        title={
          isPlaceholder
            ? 'GN is a placeholder theme — values are blank until upstream Figma data arrives.'
            : undefined
        }
      >
        {PRODUCTS.map((p) => {
          const isPh = PLACEHOLDER_PRODUCTS.includes(p);
          return (
            <option key={p} value={p}>
              {PRODUCT_LABELS[p]}
              {isPh ? ' — placeholder' : ''}
            </option>
          );
        })}
      </select>
    </label>
  );
}

/**
 * Brand `<select>`. Advanced — only surfaced when the user toggles the
 * "White-label preview" affordance. Controls the Tier-4 brand that
 * underlies the currently active Product theme.
 */
export function BrandSelect() {
  const { brand, setBrand } = useTheme();
  return (
    <label className="flex items-center gap-2 text-xs" style={labelStyle}>
      <span>White-label brand</span>
      <select
        aria-label="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value as Brand)}
        style={{ ...selectStyle, minWidth: 160, maxWidth: 200 }}
      >
        {BRANDS.map((b) => (
          <option key={b} value={b}>
            {BRAND_LABELS[b]}
          </option>
        ))}
      </select>
    </label>
  );
}
