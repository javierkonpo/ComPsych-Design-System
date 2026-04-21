import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

interface ManifestComponent {
  name?: string;
  slug?: string;
  category?: string;
  spec?: string;
  status?: string;
  figmaUrl?: string;
}

async function readManifestComponents(): Promise<ManifestComponent[]> {
  try {
    const p = path.resolve(process.cwd(), '..', 'manifest.json');
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = JSON.parse(raw) as { components?: ManifestComponent[] };
    return Array.isArray(parsed.components) ? parsed.components : [];
  } catch {
    return [];
  }
}

export default async function ComponentsIndex() {
  const components = await readManifestComponents();
  const ready = components.filter((c) => c.status === 'ready');
  const drafts = components.filter((c) => c.status !== 'ready');

  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Component gallery"
        description="Every stable component is documented by a framework-agnostic spec and implemented as a live reference here. Angular and React Native consumers generate implementations from the same specs."
      />

      {ready.length === 0 ? (
        <section
          className="p-8 rounded text-center"
          style={{
            border:
              '1px dashed var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
            backgroundColor:
              'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
          }}
        >
          <div className="text-base font-medium mb-1">No components yet.</div>
          <div
            className="text-sm"
            style={{
              color:
                'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            }}
          >
            When a spec moves from <code>draft</code> → <code>ready</code> in{' '}
            <code>manifest.json</code>, it will appear in this list.
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <h2 className="ref-heading-lg" style={{ margin: 0 }}>
            Ready
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ready.map((c) => (
              <li key={c.slug ?? c.name}>
                <Link
                  href={`/components/${c.slug}`}
                  className="h-full flex flex-col gap-2 rounded-lg p-5 transition-colors"
                  style={{
                    border:
                      '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
                    backgroundColor:
                      'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
                    color:
                      'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
                    textDecoration: 'none',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="ref-heading-md">{c.name}</div>
                    <ArrowRight
                      size={18}
                      style={{
                        color:
                          'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
                      }}
                    />
                  </div>
                  <div
                    className="ref-body-sm"
                    style={{
                      color:
                        'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
                    }}
                  >
                    {c.category ?? 'component'} &middot; spec {c.status}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {drafts.length > 0 && (
        <section className="flex flex-col gap-3 mt-10">
          <h2 className="ref-heading-lg" style={{ margin: 0 }}>
            In progress
          </h2>
          <ul className="flex flex-col gap-2">
            {drafts.map((c, i) => (
              <li
                key={(c.slug ?? c.name ?? 'component') + i}
                className="p-3 rounded flex items-center justify-between"
                style={{
                  border:
                    '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
                }}
              >
                <span className="font-mono text-sm">{c.name ?? '—'}</span>
                <span className="text-xs opacity-70">{c.status ?? 'draft'}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
