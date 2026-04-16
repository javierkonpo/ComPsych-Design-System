interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header
      className="mb-8 pb-6 flex flex-col gap-2"
      style={{
        borderBottom:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      {eyebrow && (
        <div
          className="text-xs uppercase tracking-wider"
          style={{
            color:
              'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
          }}
        >
          {eyebrow}
        </div>
      )}
      <h1 className="text-3xl font-semibold tracking-tight" style={{ margin: 0 }}>
        {title}
      </h1>
      {description && (
        <p
          className="text-sm max-w-3xl"
          style={{
            color:
              'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
    </header>
  );
}
