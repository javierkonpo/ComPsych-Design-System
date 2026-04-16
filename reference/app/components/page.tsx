import fs from 'node:fs';
import path from 'node:path';
import { PageHeader } from '@/components/page-header';

interface ManifestComponent {
  name?: string;
  spec?: string;
  status?: string;
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

export default async function ComponentsPlaceholder() {
  const components = await readManifestComponents();
  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Component gallery"
        description="Populated in a later phase. Each component lands here once its spec is stable. Implementations in Angular and React Native are generated from the same specs in the consumer projects."
      />

      {components.length === 0 ? (
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
            When a spec moves from <code>draft</code> → <code>stable</code> in{' '}
            <code>manifest.json</code>, it will appear in this list.
          </div>
        </section>
      ) : (
        <section>
          <h2 className="text-base font-semibold mb-3">Planned components</h2>
          <ul className="flex flex-col gap-2">
            {components.map((c, i) => (
              <li
                key={(c.name ?? 'component') + i}
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
