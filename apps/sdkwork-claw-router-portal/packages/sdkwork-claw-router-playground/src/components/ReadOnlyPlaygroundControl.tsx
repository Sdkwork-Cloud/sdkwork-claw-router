import type { ReactNode } from 'react';

export const PLAYGROUND_READ_ONLY_REASON =
  'Playground generation and asset action contracts are not available in the generated app SDK yet.';

export function ReadOnlyPlaygroundButton({
  children,
  className = '',
  title = PLAYGROUND_READ_ONLY_REASON,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title={title}
      onClick={undefined}
      className={`cursor-not-allowed select-none opacity-55 ${className}`}
    >
      {children}
    </button>
  );
}
