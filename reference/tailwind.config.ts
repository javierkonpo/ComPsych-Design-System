import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 configuration.
 *
 * This file is intentionally minimal. We do NOT redefine colors, spacing,
 * typography, radii, or any other design-token value here. The token
 * pipeline is the single source of truth — components consume CSS custom
 * properties directly (e.g. `var(--sys-color-roles-accent-primary-sys-primary)`).
 *
 * Tailwind is used only for layout utilities (flex, grid, gap, structural
 * spacing) where the values are generic and not part of the design system.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
};

export default config;
