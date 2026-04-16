'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  BRANDS,
  PRODUCTS,
  type Brand,
  type Product,
  PLACEHOLDER_PRODUCTS,
} from './tokens';

const STORAGE_KEY = 'compsych-ds-reference-theme';

interface ThemeState {
  brand: Brand;
  product: Product;
}

interface ThemeContextValue extends ThemeState {
  setBrand: (b: Brand) => void;
  setProduct: (p: Product) => void;
  themeKey: string;
  isPlaceholder: boolean;
}

const DEFAULT_STATE: ThemeState = { brand: 'compsych', product: 'gro' };

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readPersisted(): ThemeState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<ThemeState>;
    const brand = BRANDS.includes(parsed.brand as Brand) ? (parsed.brand as Brand) : DEFAULT_STATE.brand;
    const product = PRODUCTS.includes(parsed.product as Product) ? (parsed.product as Product) : DEFAULT_STATE.product;
    return { brand, product };
  } catch {
    return DEFAULT_STATE;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(DEFAULT_STATE);

  // Rehydrate from localStorage after mount. We don't do this during SSR to
  // avoid hydration mismatch — the server always renders the default, and
  // the client updates it in the effect below.
  useEffect(() => {
    setState(readPersisted());
  }, []);

  const setBrand = useCallback((brand: Brand) => {
    setState((s) => ({ ...s, brand }));
  }, []);
  const setProduct = useCallback((product: Product) => {
    setState((s) => ({ ...s, product }));
  }, []);

  // Reflect state onto <body data-theme="..."> and persist.
  useEffect(() => {
    const themeKey = `${state.brand}-${state.product}`;
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-theme', themeKey);
    }
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // ignore storage failures (e.g. disabled cookies)
      }
    }
  }, [state]);

  const value = useMemo<ThemeContextValue>(() => {
    const themeKey = `${state.brand}-${state.product}`;
    return {
      ...state,
      setBrand,
      setProduct,
      themeKey,
      isPlaceholder: PLACEHOLDER_PRODUCTS.includes(state.product),
    };
  }, [state, setBrand, setProduct]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() must be used inside <ThemeProvider>.');
  }
  return ctx;
}
