import {
  createRequestToken,
  ensurePlusApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredApiItem,
  requiredSafePathSegment,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminAnnouncementCreateRequest,
  AdminAnnouncementUpdateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

export interface Announcement {
  id: string;
  title: string;
  target: string;
  status: 'published' | 'draft';
  date: string;
  content: string;
}

export type AnnouncementCreateInput = {
  title: string;
  target: AdminAnnouncementCreateRequest['target'];
  status: AdminAnnouncementCreateRequest['status'];
  content: string;
};

export type AnnouncementUpdateInput = {
  title?: string;
  target?: AdminAnnouncementUpdateRequest['target'];
  status?: AdminAnnouncementUpdateRequest['status'];
  content?: string;
};

export class AnnouncementService {
  static async fetchAnnouncements(): Promise<Announcement[]> {
    const result = await announcementBackendClient().content.announcements.list();
    ensurePlusApiSuccess(result, 'Failed to fetch announcements');
    return readRequiredApiItems(result, 'Failed to fetch announcements')
      .map(normalizeAnnouncement);
  }

  static async updateAnnouncement(id: string, updates: AnnouncementUpdateInput): Promise<Announcement> {
    const result = await announcementBackendClient().content.announcements.update(
      requiredSafePathSegment(id, 'announcementId'),
      toUpdateAnnouncementRequest(updates),
      requestParams('admin-announcement-update'),
    );
    ensurePlusApiSuccess(result, 'Failed to update announcement');
    return normalizeAnnouncement(readRequiredApiItem(result, 'Updated announcement response is missing data'));
  }

  static async addAnnouncement(ann: AnnouncementCreateInput): Promise<Announcement> {
    const result = await announcementBackendClient().content.announcements.create(
      toCreateAnnouncementRequest(ann),
      requestParams('admin-announcement-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to add announcement');
    return normalizeAnnouncement(readRequiredApiItem(result, 'Created announcement response is missing data'));
  }

  static async deleteAnnouncement(id: string): Promise<boolean> {
    const result = await announcementBackendClient().content.announcements.delete(
      requiredSafePathSegment(id, 'announcementId'),
    );
    ensurePlusApiSuccess(result, 'Failed to delete announcement');
    return true;
  }
}

function announcementBackendClient() {
  return getClawRouterBackendSdkClient();
}

function toCreateAnnouncementRequest(ann: AnnouncementCreateInput): AdminAnnouncementCreateRequest {
  return {
    title: requiredText(ann.title, 'title'),
    target: announcementTarget(ann.target),
    status: announcementStatus(ann.status),
    content: requiredText(ann.content, 'content'),
  };
}

function toUpdateAnnouncementRequest(updates: AnnouncementUpdateInput): AdminAnnouncementUpdateRequest {
  const request: AdminAnnouncementUpdateRequest = {};
  if (updates.title !== undefined) {
    request.title = requiredText(updates.title, 'title');
  }
  if (updates.target !== undefined) {
    request.target = announcementTarget(updates.target);
  }
  if (updates.status !== undefined) {
    request.status = announcementStatus(updates.status);
  }
  if (updates.content !== undefined) {
    request.content = requiredText(updates.content, 'content');
  }
  if (Object.keys(request).length === 0) {
    throw new Error('announcement update must include at least one editable field');
  }
  return request;
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function announcementTarget(value: string): AdminAnnouncementCreateRequest['target'] {
  const normalized = requiredText(value, 'target').toLowerCase();
  if (normalized === 'all' || normalized === 'vip' || normalized === 'free' || normalized === 'beta') {
    return normalized;
  }
  throw new Error('target must be one of all, vip, free, beta');
}

function announcementStatus(value: string): AdminAnnouncementCreateRequest['status'] {
  const normalized = requiredText(value, 'status').toLowerCase();
  if (normalized === 'published' || normalized === 'draft') {
    return normalized;
  }
  throw new Error('status must be one of published, draft');
}

function requestParams(scope: string): { xRequestId: string } {
  return { xRequestId: createRequestToken(scope) };
}

function normalizeAnnouncement(value: unknown): Announcement {
  const item = readRequiredRecord(value, 'Announcement record is required');
  return {
    id: readRequiredString(item, 'id', 'Announcement id is required'),
    title: readRequiredString(item, 'title', 'Announcement title is required'),
    target: readRequiredString(item, 'target', 'Announcement target is required'),
    status: readAnnouncementStatus(item),
    date: readRequiredString(item, 'date', 'Announcement date is required'),
    content: readRequiredString(item, 'content', 'Announcement content is required'),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readAnnouncementStatus(item: ApiRecord): Announcement['status'] {
  const status = readString(item, 'status');
  if (status === 'published' || status === 'draft') {
    return status;
  }
  throw new Error(status ? `Unsupported announcement status: ${status}` : 'Announcement status is required');
}
