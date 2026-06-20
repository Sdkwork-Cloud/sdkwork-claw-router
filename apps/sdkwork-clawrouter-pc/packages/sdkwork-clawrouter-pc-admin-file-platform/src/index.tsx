import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DriveBrowser } from '@sdkwork/file-platform-pc-react';
import { createFilePlatformServiceFromSdkClient } from '@sdkwork/file-sdk-adapter';
import type { FilePlatformService } from '@sdkwork/file-service';
import type {
  DriveNode,
  DriveSpace,
  SdkworkDriveAppClient,
} from '@sdkwork/drive-app-sdk';
import {
  getSdkworkDriveAppSdkClient,
} from 'sdkwork-clawrouter-pc-commons/sdk-clients';
import { resolveSessionTenantId } from 'sdkwork-clawrouter-pc-commons/session-jwt-claims';

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
  const driveService = useMemo(() => createDriveAdminService(), []);

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

function createDriveAdminService(): FilePlatformService {
  const client = getSdkworkDriveAppSdkClient();
  return createFilePlatformServiceFromSdkClient({
    app: createDriveFilePlatformAppClient(client),
    drive: client,
  });
}

function createDriveFilePlatformAppClient(client: SdkworkDriveAppClient) {
  return {
    async driveNodesList(input: {
      cursor?: string;
      limit?: number;
      parentNodeId?: string;
      requestId: string;
      spaceId: string;
    }) {
      const result = await client.drive.nodes.list(input.spaceId, {
        pageSize: input.limit === undefined ? undefined : String(input.limit),
        pageToken: input.cursor,
        parentNodeId: input.parentNodeId,
        tenantId: resolveDriveTenantId(),
      });
      return {
        items: result.items.map(mapDriveNode),
        nextCursor: result.nextPageToken,
        requestId: input.requestId,
      };
    },
    async driveSpacesList(input: { requestId: string }) {
      const result = await client.drive.spaces.list({
        tenantId: resolveDriveTenantId(),
      });
      return {
        items: result.items.map(mapDriveSpace),
        requestId: input.requestId,
      };
    },
    async fileBindingsCreate() {
      throw unsupportedDriveAdminCapability('fileBindings.create');
    },
    async fileBindingsDelete() {
      throw unsupportedDriveAdminCapability('fileBindings.delete');
    },
    async fileBindingsList() {
      throw unsupportedDriveAdminCapability('fileBindings.list');
    },
    async filesDownloadUrlCreate() {
      throw unsupportedDriveAdminCapability('files.downloadUrl.create');
    },
    async filesList() {
      throw unsupportedDriveAdminCapability('files.list');
    },
    async filesPreviewUrlCreate() {
      throw unsupportedDriveAdminCapability('files.previewUrl.create');
    },
    async filesRetrieve() {
      throw unsupportedDriveAdminCapability('files.retrieve');
    },
    async storageUsageRetrieve() {
      throw unsupportedDriveAdminCapability('storage.usage.retrieve');
    },
  };
}

function resolveDriveTenantId(): string {
  return resolveSessionTenantId();
}

function mapDriveSpace(space: DriveSpace) {
  return {
    name: space.displayName,
    spaceId: space.id,
    status: mapDriveSpaceStatus(space.lifecycleStatus),
    type: mapDriveSpaceType(space.spaceType),
  };
}

function mapDriveNode(node: DriveNode) {
  return {
    depth: 0,
    fileId: node.nodeType === 'file' ? node.id : undefined,
    name: node.nodeName,
    nodeId: node.id,
    nodeType: mapDriveNodeType(node.nodeType),
    parentNodeId: node.parentNodeId,
    pathSegment: node.nodeName,
    spaceId: node.spaceId,
    trashed: node.lifecycleStatus === 'trashed',
  };
}

function mapDriveSpaceStatus(status: string) {
  return status === 'archived' || status === 'disabled' ? status : 'active';
}

function mapDriveSpaceType(type: DriveSpace['spaceType']) {
  switch (type) {
    case 'personal':
      return 'user_drive';
    case 'team':
      return 'team_drive';
    case 'knowledge_base':
    case 'ai_generated':
      return 'system_library';
    case 'app':
    case 'app_upload':
      return 'app_drive';
  }
}

function mapDriveNodeType(type: DriveNode['nodeType']) {
  return type === 'virtual_reference' ? 'shortcut' : type;
}

function unsupportedDriveAdminCapability(operationId: string): Error {
  return new Error(`Drive admin service does not expose ${operationId}.`);
}
