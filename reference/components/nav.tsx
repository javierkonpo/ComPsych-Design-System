'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_SECTIONS: Array<{
  heading: string;
  items: Array<{ href: string; label: string; muted?: boolean }>;
}> = [
  {
    heading: 'Overview',
    items: [
      { href: '/about', label: 'About' },
      { href: '/', label: 'Home' },
    ],
  },
  {
    heading: 'Foundations',
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
    heading: 'Components',
    items: [{ href: '/components', label: 'Gallery', muted: true }],
  },
];

export function Nav() {
  const pathname = usePathname();

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
          href="/"
          className="ref-heading-md tracking-tight block"
          style={{ textDecoration: 'none' }}
        >
          ComPsych DS
          <span
            className="block ref-caption uppercase tracking-wider font-medium mt-1"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
              letterSpacing: '0.08em',
            }}
          >
            Reference
          </span>
        </Link>

        {NAV_SECTIONS.map((section) => (
          <div key={section.heading}>
            <div
              className="ref-caption uppercase tracking-wider mb-2.5 font-semibold"
              style={{
                color:
                  'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                letterSpacing: '0.08em',
              }}
            >
              {section.heading}
            </div>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href ||
                      pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block px-2.5 py-1.5 rounded text-sm transition-colors"
                      style={{
                        backgroundColor: active
                          ? 'var(--sys-color-roles-accent-primary-sys-primary-container, #eceeef)'
                          : 'transparent',
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
                      {item.muted && (
                        <span
                          className="ml-2 ref-caption"
                          style={{
                            color:
                              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                          }}
                        >
                          coming soon
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
