'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import styles from './nav.module.css';

type NavItem = {
  href: string;
  label: string;
  muted?: boolean;
  disabled?: boolean;
};

type NavSection = {
  heading: string;
  items: NavItem[];
  /** When true, the section header toggles its item list open/closed. */
  collapsible?: boolean;
};

const NAV_SECTIONS: NavSection[] = [
  {
    heading: 'Overview',
    items: [{ href: '/about', label: 'About' }],
  },
  {
    heading: 'Foundations',
    collapsible: true,
    items: [
      { href: '/foundations/color', label: 'Color' },
      { href: '/foundations/typography', label: 'Typography' },
      { href: '/foundations/spacing', label: 'Spacing' },
      { href: '/foundations/elevation', label: 'Elevation' },
      { href: '/foundations/radius', label: 'Radius' },
      { href: '/foundations/border-width', label: 'Border Width' },
      { href: '/foundations/iconography', label: 'Iconography' },
    ],
  },
  {
    heading: 'Molecules',
    collapsible: true,
    items: [
      { href: '/components/button', label: 'Button' },
      { href: '/components/checkbox', label: 'Checkbox' },
      { href: '#', label: 'Radio Button', disabled: true },
      { href: '#', label: 'Avatar', disabled: true },
      { href: '#', label: 'Input Field', disabled: true },
      { href: '#', label: 'Pagination', disabled: true },
      { href: '#', label: 'Chip', disabled: true },
      { href: '#', label: 'Badge', disabled: true },
      { href: '#', label: 'Progress Tracker', disabled: true },
      { href: '#', label: 'Breadcrumb', disabled: true },
      { href: '#', label: 'Alert', disabled: true },
      { href: '#', label: 'Divider', disabled: true },
      { href: '#', label: 'Tooltip', disabled: true },
      { href: '#', label: 'Switch', disabled: true },
      { href: '#', label: 'Slider', disabled: true },
      { href: '#', label: 'Empty State', disabled: true },
    ],
  },
  {
    heading: 'Organisms',
    collapsible: true,
    items: [
      { href: '#', label: 'Accordion', disabled: true },
      { href: '#', label: 'Header Navigation', disabled: true },
      { href: '#', label: 'Sidebar', disabled: true },
      { href: '/components/card', label: 'Cards' },
      { href: '#', label: 'Text Field', disabled: true },
      { href: '#', label: 'Text Area', disabled: true },
      { href: '#', label: 'Dropdown', disabled: true },
      { href: '#', label: 'Dropdown Menu', disabled: true },
      { href: '#', label: 'Search Field', disabled: true },
      { href: '#', label: 'Tab', disabled: true },
      { href: '#', label: 'Data Visualization', disabled: true },
      { href: '#', label: 'Radio Button Group', disabled: true },
      { href: '#', label: 'Checkbox Group', disabled: true },
      { href: '#', label: 'Selection Card Group', disabled: true },
      { href: '#', label: 'Dialog', disabled: true },
      { href: '#', label: 'Sheet/Flyout', disabled: true },
      { href: '#', label: 'Date & Time Picker', disabled: true },
      { href: '#', label: 'Data Table', disabled: true },
      { href: '#', label: 'File Upload', disabled: true },
      { href: '#', label: 'Toolbar', disabled: true },
    ],
  },
];

function sectionContainsActive(section: NavSection, pathname: string): boolean {
  return section.items.some(
    (item) =>
      !item.disabled &&
      item.href !== '#' &&
      (pathname === item.href || pathname.startsWith(item.href + '/')),
  );
}

function ComPsychLogo() {
  return (
    <svg
      width="130"
      height="27"
      viewBox="0 0 156 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ComPsych"
    >
      <path d="M15.9845 19.7432C21.2931 19.7432 25.9667 22.5141 28.6349 26.6855H3.33313C6.00122 22.514 10.675 19.7433 15.9835 19.7432H15.9845ZM15.9855 11.3711C23.6364 11.3713 29.8595 17.5959 29.8595 25.2461C29.8595 25.4586 29.8534 25.6701 29.8439 25.8809C26.9139 21.3189 21.7948 18.2901 15.9835 18.29C10.1719 18.29 5.0551 21.3175 2.12512 25.8779C2.11562 25.6688 2.11047 25.4578 2.11047 25.2461C2.11047 17.5949 8.3352 11.3711 15.9855 11.3711ZM15.9845 3C24.7986 3 31.9698 10.1712 31.9698 18.9854C31.9698 20.747 31.6822 22.443 31.1534 24.0293C30.5322 16.2044 23.9657 10.0283 15.9845 10.0283C8.00352 10.0286 1.43863 16.2055 0.816528 24.0293C0.28778 22.443 0.000163225 20.747 0.00012207 18.9854C0.00012207 10.1713 7.17058 3.00026 15.9845 3Z" fill="currentColor"/>
      <path d="M132.462 14.4316C131.635 14.4818 131.209 14.8043 130.784 15.7979L125.851 27.6299C124.699 30.363 123.191 31.6071 121.562 31.7363C119.066 31.9341 118.568 30.6328 118.832 30.0293C119.083 29.458 119.878 29.4868 120.665 29.8281C122.762 30.7674 124.417 29.1534 125.174 27.5078L125.601 26.4639L121.117 15.8008C120.666 14.8072 120.24 14.483 119.439 14.4346V14.0859H124.749V14.4346C123.572 14.4848 123.045 14.956 123.396 15.7764L126.677 23.8555L130.032 15.8027C130.383 14.9577 129.906 14.4849 128.805 14.4365V14.083H132.462V14.4316ZM55.0811 9.55762C58.1407 9.55762 60.4743 10.9523 61.1514 13.2178L61.1904 13.3477C61.3814 14.008 60.9478 14.686 60.2666 14.7988C59.6631 14.8989 59.0838 14.5147 58.9473 13.9229V13.917C58.4183 11.6764 56.8136 10.2327 54.7812 10.2324C51.5448 10.2324 49.3125 13.2455 49.3125 17.626C49.3126 22.0063 51.972 25.0684 55.7598 25.0684C58.4187 25.0683 60.3683 23.6258 61.1455 21.3848L61.5527 21.459C60.7005 24.8442 58.1657 26.9365 54.7803 26.9365L54.7783 26.9346V26.9326L54.7803 26.9336L54.7793 26.9326H54.7783C50.1881 26.9315 46.9035 23.3238 46.9033 18.6445C46.9033 13.366 50.0638 9.55769 55.0811 9.55762ZM68.498 13.7129C72.0069 13.7131 74.2217 16.3041 74.2217 20.0664C74.2217 24.1279 71.8075 26.9189 68.2734 26.9189C64.7395 26.9189 62.5499 24.3273 62.5498 20.5898C62.5498 16.5283 64.9889 13.7129 68.498 13.7129ZM137.426 13.7334C139.98 13.7334 141.583 15.3734 141.833 16.7402C141.833 16.7402 142.113 17.7618 141.239 18.0293C140.701 18.1938 140.026 17.925 139.855 17.1885C139.572 15.9729 138.803 14.4298 137.101 14.4297C134.997 14.4297 133.569 16.568 133.568 19.3994C133.568 22.7793 135.297 25.1162 138.078 25.1162C139.556 25.1161 140.984 24.3452 141.884 22.7549L142.185 22.8301C141.533 25.3157 139.731 26.9053 137.176 26.9053V26.9072C133.719 26.907 131.439 24.0983 131.439 20.4688C131.44 16.8392 133.719 13.7334 137.426 13.7334ZM114.786 13.7197C116.865 13.7199 118.837 14.6245 119.295 16.1807C119.4 16.5384 119.402 17.2235 118.937 17.457C118.469 17.6917 117.898 17.4346 117.685 16.9766C117.017 15.5458 116.322 14.417 114.495 14.417C112.993 14.4172 112.131 15.2628 112.131 16.4814C112.131 18.0011 113.677 18.5279 115.357 19.1006C117.332 19.7733 119.491 20.5103 119.545 22.9941C119.595 25.3051 117.459 26.8954 114.777 26.8955L114.775 26.8936V26.8926L114.374 26.8857C112.388 26.8122 110.688 26.1691 109.972 24.7812C109.749 24.3498 109.854 23.7535 110.293 23.5449C110.824 23.2919 111.36 23.7306 111.647 24.2441C112.319 25.4451 113.709 26.1962 114.948 26.1963C116.527 26.1963 117.815 25.3007 117.815 23.9346C117.791 22.1519 116.113 21.5795 114.359 20.9814C112.445 20.3286 110.441 19.6452 110.401 17.3232C110.377 15.1843 112.131 13.7197 114.786 13.7197ZM146.189 16.502C147.508 14.7578 148.828 13.7119 150.57 13.7119C152.76 13.712 154.029 15.1075 154.029 17.5244V24.7246C154.029 25.8209 154.776 26.0453 155.672 26.2197V26.5693H150.321V26.2197C151.217 26.0453 151.964 25.8209 151.964 24.7246V17.6484C151.964 16.1036 151.092 15.1572 149.674 15.1572C148.454 15.1573 147.434 15.7048 146.189 17.125V24.7246C146.189 25.8208 146.936 26.0453 147.832 26.2197V26.5693H142.457V26.2197C143.378 26.0453 144.124 25.8208 144.124 24.7246V11.6436C144.124 10.7964 143.726 10.3975 142.83 10.3477H142.232V9.99902L145.842 8.97754H146.189V16.502ZM103.161 9.93262L103.163 9.93555C107.045 9.93561 109.701 11.4029 109.701 14.584C109.701 17.7651 107.047 19.2079 103.163 19.208H101.532V18.8213C105.841 18.8213 107.252 16.8945 107.245 14.584C107.238 12.2735 105.742 10.6309 102.888 10.6309H100.634L100.632 24.3271C100.632 25.8182 101.359 26.0928 102.86 26.1914V26.54H90.5488V26.1914C91.4508 26.0181 92.2021 25.7931 92.2021 24.6992V17.6406C92.202 16.0989 91.3251 15.1554 89.8975 15.1553C88.6194 15.1553 87.5917 15.7271 86.3154 17.2188V24.7012C86.3156 25.7958 87.0669 26.0191 87.9688 26.1924V26.541H82.584V26.1924C83.4858 26.0191 84.2371 25.7946 84.2373 24.7012V17.6426C84.2373 16.1006 83.3592 15.1573 81.9336 15.1572C80.7561 15.1572 79.7785 15.6545 78.6025 16.9219V24.7021C78.6025 25.7971 79.3539 26.021 80.2559 26.1943V26.543H74.8447V26.1943C75.7711 26.0199 76.5225 25.7958 76.5225 24.7021V16.376C76.5225 15.531 76.1222 15.1324 75.2207 15.0576H74.6191V14.709L78.251 13.6885H78.6025V16.2734C79.8796 14.6574 81.1575 13.7129 82.835 13.7129C84.7647 13.713 85.9915 14.7813 86.2656 16.6699C87.6423 14.8303 88.9961 13.7129 90.7998 13.7129C93.0029 13.713 94.2802 15.1059 94.2803 17.5166V24.7002L94.2793 24.6982C94.2793 25.4271 94.6124 25.7698 95.1025 25.9688C95.5895 26.1659 96.2383 26.1953 96.7588 26.1182C97.8115 25.9612 98.3496 25.5604 98.3496 24.3252V12.1201C98.3496 10.6785 97.6225 10.3793 96.0947 10.2793V9.93164H103.159L103.161 9.93262ZM68.0996 14.4102C66.0589 14.4102 64.7647 16.553 64.7646 19.5928C64.7646 22.3834 65.8345 26.2204 68.6963 26.2207C70.762 26.2207 72.0312 24.0531 72.0312 20.9883C72.0312 18.2475 70.9366 14.4104 68.0996 14.4102Z" fill="currentColor"/>
    </svg>
  );
}

export function Nav() {
  const pathname = usePathname();

  // Section-open state. Non-collapsible sections are always open. Collapsible
  // sections start open if they contain the current route so the active link
  // is visible on first load.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const out: Record<string, boolean> = {};
    for (const section of NAV_SECTIONS) {
      out[section.heading] = section.collapsible
        ? sectionContainsActive(section, pathname)
        : true;
    }
    return out;
  });

  // On client-side navigation, auto-expand the section that owns the new
  // route so users don't end up with a collapsed nav hiding their location.
  // User-toggled collapsed state for OTHER sections is preserved.
  useEffect(() => {
    setOpenSections((prev) => {
      let next = prev;
      for (const section of NAV_SECTIONS) {
        if (!section.collapsible) continue;
        if (sectionContainsActive(section, pathname) && !prev[section.heading]) {
          if (next === prev) next = { ...prev };
          next[section.heading] = true;
        }
      }
      return next;
    });
  }, [pathname]);

  function toggleSection(heading: string) {
    setOpenSections((prev) => ({ ...prev, [heading]: !prev[heading] }));
  }

  return (
    <aside
      className="shrink-0 w-[260px] border-r overflow-y-auto sticky top-0 h-screen"
      style={{
        borderColor:
          'var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-low, #f9fafb)',
      }}
    >
      <div className="p-6 flex flex-col gap-7">
        <Link
          href="/about"
          className="block"
          style={{
            textDecoration: 'none',
            color: 'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
          }}
        >
          <ComPsychLogo />
        </Link>

        {NAV_SECTIONS.map((section) => {
          const open = openSections[section.heading];
          return (
            <div key={section.heading}>
              <SectionHeading
                section={section}
                open={open}
                onToggle={() => toggleSection(section.heading)}
              />
              {open && (
                <ul className="flex flex-col gap-0.5">
                  {section.items.map((item) => {
                    const active =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname === item.href ||
                          pathname.startsWith(item.href + '/');

                    if (item.disabled) {
                      return (
                        <li key={item.label}>
                          <span
                            aria-disabled="true"
                            className="block px-2.5 py-1.5 rounded text-sm select-none cursor-not-allowed"
                            style={{
                              color:
                                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                              opacity: 0.55,
                            }}
                          >
                            {item.label}
                          </span>
                        </li>
                      );
                    }

                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={`block px-2.5 py-1.5 rounded text-sm ${styles.navLink}${active ? ` ${styles.navLinkActive}` : ''}`}
                          style={{
                            color: active
                              ? 'var(--sys-color-roles-accent-primary-sys-on-primary-container, inherit)'
                              : item.muted
                                ? 'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)'
                                : 'inherit',
                            fontWeight: active ? 500 : 400,
                            textDecoration: 'none',
                          }}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function SectionHeading({
  section,
  open,
  onToggle,
}: {
  section: NavSection;
  open: boolean;
  onToggle: () => void;
}) {
  const headingStyle: React.CSSProperties = {
    color:
      'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
    letterSpacing: '0.08em',
  };

  if (!section.collapsible) {
    return (
      <div
        className="ref-caption uppercase tracking-wider mb-2.5 font-semibold"
        style={headingStyle}
      >
        {section.heading}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="w-full flex items-center justify-between mb-2.5 ref-caption uppercase tracking-wider font-semibold cursor-pointer"
      /* Keep font-related properties unset so the `ref-caption` class drives
         size / family / weight — matches the non-collapsible heading above. */
      style={{
        ...headingStyle,
        background: 'transparent',
        border: 'none',
        padding: 0,
      }}
    >
      <span>{section.heading}</span>
      <ChevronDown
        size={14}
        aria-hidden
        style={{
          transition: 'transform 150ms ease-out',
          transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
          flexShrink: 0,
        }}
      />
    </button>
  );
}
