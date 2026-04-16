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

export function ThemeSwitcher() {
  const { brand, product, setBrand, setProduct, isPlaceholder } = useTheme();

  const selectStyle: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: 'var(--sys-dimensions-border-radius-sys-radius-sm, 6px)',
    border: '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
    backgroundColor: 'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
    color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
    fontSize: 13,
    minWidth: 120,
  };

  return (
    <div className="flex items-center gap-3" aria-label="Active theme">
      <label className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-70">
        Brand
        <select
          aria-label="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value as Brand)}
          style={selectStyle}
        >
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {BRAND_LABELS[b]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-70">
        Product
        <select
          aria-label="Product"
          value={product}
          onChange={(e) => setProduct(e.target.value as Product)}
          style={selectStyle}
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
    </div>
  );
}
