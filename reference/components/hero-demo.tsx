'use client';

import { Bell, Check, ShieldCheck } from 'lucide-react';

/**
 * Four small mock UI fragments rendered entirely with var(--sys-*)
 * tokens. When the active Product changes in the header, every element
 * below visibly reskins — which is the point of the stakeholder demo.
 *
 * These are NOT real design system components; they're the smallest
 * possible credible UI to showcase theming. Real components will live
 * in `/components` in a later phase.
 */
export function HeroDemo() {
  return (
    <div
      className="rounded-2xl p-8 md:p-10"
      style={{
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      {/* Row 1: app-bar-style header */}
      <MockAppBar />

      {/* Row 2: card with CTA + status chips */}
      <div className="grid gap-6 md:grid-cols-5 mt-6">
        <div className="md:col-span-3">
          <MockCard />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <MockBadges />
          <MockButtons />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function MockAppBar() {
  return (
    <div
      className="rounded-lg flex items-center justify-between px-5 py-3"
      style={{
        backgroundColor:
          'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
        color:
          'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="rounded-md flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            backgroundColor:
              'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
            color:
              'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
          }}
          aria-hidden
        >
          <ShieldCheck size={16} strokeWidth={2.25} />
        </div>
        <span className="ref-heading-md">Product home</span>
      </div>
      <button
        type="button"
        className="rounded-md p-2 transition-opacity hover:opacity-80"
        style={{
          backgroundColor: 'transparent',
          color:
            'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
        }}
        aria-label="Notifications"
      >
        <Bell size={18} />
      </button>
    </div>
  );
}

function MockCard() {
  return (
    <article
      className="rounded-lg p-5 h-full flex flex-col gap-3"
      style={{
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container, #f3f4f6)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <div
        className="ref-caption uppercase tracking-wider font-semibold"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          letterSpacing: '0.08em',
        }}
      >
        Member profile
      </div>
      <h3 className="ref-heading-lg" style={{ margin: 0 }}>
        Welcome back, Jamie
      </h3>
      <p
        className="ref-body"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface, #1b1d22)',
          margin: 0,
        }}
      >
        You have two upcoming appointments this week. Your support plan is on
        track.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          className="rounded-md px-4 py-2 ref-body-sm font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor:
              'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
            color:
              'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
          }}
        >
          View plan
        </button>
        <button
          type="button"
          className="rounded-md px-4 py-2 ref-body-sm font-medium transition-colors"
          style={{
            backgroundColor: 'transparent',
            color:
              'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
            border:
              '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
          }}
        >
          Reschedule
        </button>
      </div>
    </article>
  );
}

function MockBadges() {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-2"
      style={{
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <Badge
        tone="success"
        label="Verified"
        icon={<Check size={12} strokeWidth={2.5} />}
      />
      <Badge tone="warning" label="Action needed" />
      <Badge tone="info" label="New" />
    </div>
  );
}

function Badge({
  tone,
  label,
  icon,
}: {
  tone: 'success' | 'warning' | 'info';
  label: string;
  icon?: React.ReactNode;
}) {
  const map = {
    success: {
      bg: 'var(--sys-color-roles-custom-success-sys-success-container, #c4e9d0)',
      fg: 'var(--sys-color-roles-custom-success-sys-on-success-container, #030c09)',
    },
    warning: {
      bg: 'var(--sys-color-roles-custom-warning-sys-warning-container, #fdeed9)',
      fg: 'var(--sys-color-roles-custom-warning-sys-on-warning-container, #3a2304)',
    },
    info: {
      bg: 'var(--sys-color-roles-custom-info-sys-info-container, #daecff)',
      fg: 'var(--sys-color-roles-custom-info-sys-on-info-container, #162755)',
    },
  }[tone];

  return (
    <span
      className="inline-flex items-center gap-1.5 ref-caption font-medium px-2.5 py-1 rounded-full self-start"
      style={{ backgroundColor: map.bg, color: map.fg }}
    >
      {icon}
      {label}
    </span>
  );
}

function MockButtons() {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-2"
      style={{
        backgroundColor:
          'var(--sys-color-roles-surface-surface-container-sys-surface-container-lowest, #ffffff)',
        border:
          '1px solid var(--sys-color-roles-outline-sys-outline-variant, #d7dbe0)',
      }}
    >
      <div
        className="ref-caption uppercase tracking-wider font-semibold mb-1"
        style={{
          color:
            'var(--sys-color-roles-surface-surface-sys-on-surface-variant, #565f6c)',
          letterSpacing: '0.08em',
        }}
      >
        Actions
      </div>
      <button
        type="button"
        className="rounded-md px-3 py-2 ref-body-sm font-medium w-full text-left transition-opacity hover:opacity-90"
        style={{
          backgroundColor:
            'var(--sys-color-roles-accent-primary-sys-primary, #075cba)',
          color:
            'var(--sys-color-roles-accent-primary-sys-on-primary, #ffffff)',
        }}
      >
        Continue
      </button>
      <button
        type="button"
        className="rounded-md px-3 py-2 ref-body-sm font-medium w-full text-left transition-colors"
        style={{
          backgroundColor:
            'var(--sys-color-roles-accent-primary-sys-primary-container, #070f36)',
          color:
            'var(--sys-color-roles-accent-primary-sys-on-primary-container, #ffffff)',
        }}
      >
        Review later
      </button>
    </div>
  );
}
