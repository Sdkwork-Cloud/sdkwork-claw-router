import type { FC } from 'react';
import type { StorageAdminSectionId } from './storageSectionDefinitions';
import { resolveStorageSectionId } from './storageSectionDefinitions';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProvidersPage } from './pages/ProvidersPage';
import { BucketsPage } from './pages/BucketsPage';
import { DefaultBucketsPage } from './pages/DefaultBucketsPage';
import { QuotasPage } from './pages/QuotasPage';
import { UsagePage } from './pages/UsagePage';
import { ReconciliationPage } from './pages/ReconciliationPage';
import { GarbageCollectionPage } from './pages/GarbageCollectionPage';

export interface FilePlatformAdminRouteProps {
  sectionId?: string;
}

const pageComponents: Record<StorageAdminSectionId, FC> = {
  providers: ProvidersPage,
  buckets: BucketsPage,
  defaultBuckets: DefaultBucketsPage,
  quotas: QuotasPage,
  usage: UsagePage,
  reconciliation: ReconciliationPage,
  garbageCollection: GarbageCollectionPage,
};

export function StorageAdmin({ sectionId }: FilePlatformAdminRouteProps) {
  const activeSectionId = resolveStorageSectionId(sectionId);
  const PageComponent = pageComponents[activeSectionId];

  return (
    <section
      className="flex min-h-0 flex-1 flex-col"
      data-admin-file-platform="storage-center"
      data-admin-file-platform-section={activeSectionId}
    >
      <ErrorBoundary fallbackTitle="Storage admin section failed to load">
        <PageComponent />
      </ErrorBoundary>
    </section>
  );
}