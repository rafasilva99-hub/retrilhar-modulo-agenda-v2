import { type ReactNode } from "react";

type InfoCalloutProps = {
  readonly children: ReactNode;
};

export function InfoCallout({ children }: InfoCalloutProps) {
  return (
    <div className="bg-info-callout text-info-callout-foreground border-info-callout-border flex items-center gap-2.5 rounded-lg border px-3 py-2">
      <svg
        className="text-info-callout-icon size-6 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.15" />
        <circle cx="12" cy="12" r="8" fill="currentColor" />
        <path
          d="M12 16v-4M12 8h.01"
          stroke="var(--info-callout-icon-foreground)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-callout">{children}</p>
    </div>
  );
}
