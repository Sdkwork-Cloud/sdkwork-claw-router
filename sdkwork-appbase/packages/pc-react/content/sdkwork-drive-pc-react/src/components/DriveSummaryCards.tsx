import type { SdkworkDriveDigest } from "../drive";

export function SdkworkDriveSummaryCards({ digest }: { digest: SdkworkDriveDigest }) {
  const cards = [
    { id: "entries", label: "Entries", value: digest.totalEntries },
    { id: "locations", label: "Locations", value: digest.totalLocations },
    { id: "healthy", label: "Healthy syncs", value: digest.healthySyncs },
    { id: "shared", label: "Shared spaces", value: digest.sharedSpaces },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article className="rounded-[1.25rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4" key={card.id}>
          <div className="text-sm text-[var(--sdk-color-text-secondary)]">{card.label}</div>
          <div className="mt-2 text-2xl font-semibold text-[var(--sdk-color-text-primary)]">{card.value}</div>
        </article>
      ))}
    </div>
  );
}
