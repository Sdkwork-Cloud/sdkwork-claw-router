export type ReferenceSidebarCollapsedGroups = Record<string, true>;

function normalizeReferenceSidebarGroupPart(value: string, fallback: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || fallback;
}

export function createReferenceSidebarGroupKey(systemId: string, categoryId: string): string {
  const normalizedSystemId = systemId.trim() || 'system';
  const normalizedCategoryId = categoryId.trim() || 'category';
  return `${normalizedSystemId}::${normalizedCategoryId}`;
}

export function createReferenceSidebarGroupElementId(prefix: string, systemId: string, categoryId: string): string {
  const normalizedPrefix = normalizeReferenceSidebarGroupPart(prefix, 'reference-sidebar-group');
  const normalizedSystemId = normalizeReferenceSidebarGroupPart(systemId, 'system');
  const normalizedCategoryId = normalizeReferenceSidebarGroupPart(categoryId, 'category');
  return `${normalizedPrefix}-${normalizedSystemId}-${normalizedCategoryId}`;
}

export function isReferenceSidebarGroupCollapsed(
  collapsedGroups: ReferenceSidebarCollapsedGroups,
  systemId: string,
  categoryId: string,
): boolean {
  return collapsedGroups[createReferenceSidebarGroupKey(systemId, categoryId)] === true;
}

export function toggleReferenceSidebarGroup(
  collapsedGroups: ReferenceSidebarCollapsedGroups,
  systemId: string,
  categoryId: string,
): ReferenceSidebarCollapsedGroups {
  const groupKey = createReferenceSidebarGroupKey(systemId, categoryId);
  if (collapsedGroups[groupKey]) {
    const nextCollapsedGroups = { ...collapsedGroups };
    delete nextCollapsedGroups[groupKey];
    return nextCollapsedGroups;
  }

  return {
    ...collapsedGroups,
    [groupKey]: true,
  };
}
