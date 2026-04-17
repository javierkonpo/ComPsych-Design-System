'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_SECTIONS: Array<{
  heading: string;
  items: Array<{ href: string; label: string }>;
}> = [
  {
    heading: 'Overview',
    items: [{ href: '/', label: 'Home' }],
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
    items: [{ href: '/components', label: 'Gallery (coming soon)' }],
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
      <div className="p-5 flex flex-col gap-6">
        <Link href="/" className="font-semibold text-sm tracking-tight">
          ComPsych DS · Reference
        </Link>

        {NAV_SECTIONS.map((section) => (
          <div key={section.heading}>
            <div className="text-[11px] uppercase tracking-wider mb-2 opacity-60">
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
                      className="block px-2 py-1 rounded text-sm"
                      style={{
                        backgroundColor: active
                          ? 'var(--sys-color-roles-accent-primary-sys-primary-container, #eceeef)'
                          : 'transparent',
                        color: active
                          ? 'var(--sys-color-roles-accent-primary-sys-on-primary-container, inherit)'
                          : 'inherit',
                      }}
                    >
                      {item.label}
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
