import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DriveBrowser } from '@sdkwork/file-platform-pc-react';
import type { FilePlatformService } from '@sdkwork/file-service';
import type { StorageAdminSectionId } from './storageSectionDefinitions';

export type DriveAdminSectionId =
  | 'audit'
  | 'nodes'
  | 'permissions'
  | 'shareLinks'
  | 'spaces';

export interface FilePlatformAdminRouteProps {
  sectionId?: string;
}

export { StorageAdmin } from './storageAdmin';

const DRIVE_SECTION_IDS: readonly DriveAdminSectionId[] = [
  'spaces',
  'nodes',
  'permissions',
  'shareLinks',
  'audit',
] as const;

export function DriveAdmin({ sectionId }: FilePlatformAdminRouteProps) {
  const { t } = useTranslation();
  const activeSectionId = resolveDriveSectionId(sectionId);
  const [lastError, setLastError] = useState<string | null>(null);
  const driveService = useMemo(() => createEmptyDriveService(), []);

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-admin-file-platform="drive-center"
      data-admin-file-platform-section={activeSectionId}
    >
      {lastError ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          {lastError}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#161616]">
        <DriveBrowser
          onError={(error) => setLastError(error.message)}
          service={driveService}
          title={t(`admin.menu.drive.${driveMenuKey(activeSectionId)}`)}
        />
      </div>
    </section>
  );
}

function resolveDriveSectionId(sectionId: string | undefined): DriveAdminSectionId {
  return DRIVE_SECTION_IDS.includes(sectionId as DriveAdminSectionId)
    ? sectionId as DriveAdminSectionId
    : 'spaces';
}

function driveMenuKey(sectionId: DriveAdminSectionId): string {
  return sectionId === 'shareLinks' ? 'shareLinks' : sectionId;
}

function createEmptyDriveService(): FilePlatformService {
  return {
    async abortUpload() { throw new Error('Drive admin does not own upload sessions.'); },
    async bindFile() { throw new Error('Drive admin does not own file bindings.'); },
    async completeUpload() { throw new Error('Drive admin does not own upload sessions.'); },
    async createUploadSession() { throw new Error('Drive admin does not own upload sessions.'); },
    async deleteBinding() { throw new Error('Drive admin does not own file bindings.'); },
    async getFile() { throw new Error('Drive admin file retrieval service is not configured.'); },
    async getStorageUsage() { throw new Error('Drive admin usage service is not configured.'); },
    getSlot() { return undefined; },
    async issueDownloadUrl() { throw new Error('Drive admin download URL service is not configured.'); },
    async issuePreviewUrl() { throw new Error('Drive admin preview URL service is not configured.'); },
    async listBindings() { throw new Error('Drive admin does not own file bindings.'); },
    async listDriveNodes() { return { items: [] }; },
    async listDriveSpaces() { return { items: [] }; },
    async listFiles() { return { items: [] }; },
    async presignUploadPart() { throw new Error('Drive admin does not own upload sessions.'); },
  };
}
