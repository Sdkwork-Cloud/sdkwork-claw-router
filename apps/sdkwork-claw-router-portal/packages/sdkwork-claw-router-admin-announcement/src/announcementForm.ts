import type { AnnouncementCreateInput, AnnouncementUpdateInput } from './announcementService';

type AnnouncementFormValues = {
  title: string;
  target: string;
  status: string;
  content: string;
};

const DEFAULT_TARGET: AnnouncementCreateInput['target'] = 'all';
const DEFAULT_STATUS: AnnouncementCreateInput['status'] = 'published';

export function createAnnouncementInputFromForm(values: AnnouncementFormValues): AnnouncementCreateInput {
  return {
    title: values.title.trim(),
    target: readAnnouncementTarget(values.target),
    status: readAnnouncementStatus(values.status),
    content: values.content.trim(),
  };
}

export function createAnnouncementUpdateInputFromForm(values: AnnouncementFormValues): AnnouncementUpdateInput {
  return {
    title: values.title.trim(),
    target: readAnnouncementTarget(values.target),
    status: readAnnouncementStatus(values.status),
    content: values.content.trim(),
  };
}

export function createAnnouncementPublishInput(): AnnouncementUpdateInput {
  return { status: 'published' };
}

function readAnnouncementTarget(value: string): AnnouncementCreateInput['target'] {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'all' || normalized === 'vip' || normalized === 'free' || normalized === 'beta') {
    return normalized;
  }
  return DEFAULT_TARGET;
}

function readAnnouncementStatus(value: string): AnnouncementCreateInput['status'] {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'published' || normalized === 'draft') {
    return normalized;
  }
  return DEFAULT_STATUS;
}
