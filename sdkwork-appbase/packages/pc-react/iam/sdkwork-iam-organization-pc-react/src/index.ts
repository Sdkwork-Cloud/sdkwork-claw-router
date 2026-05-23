import type { SdkworkIamService } from "@sdkwork/iam-service";

export interface SdkworkIamOrganization {
  code?: string;
  id: string;
  name: string;
  organizationId: string;
  parentId?: string;
  path?: string;
  status?: string;
  tenantId?: string;
}

export interface SdkworkIamOrganizationMember {
  displayName?: string;
  email?: string;
  id: string;
  organizationId?: string;
  roleCode?: string;
  status?: string;
  userId: string;
  username?: string;
}

export interface SdkworkIamOrganizationNode extends SdkworkIamOrganization {
  children: SdkworkIamOrganizationNode[];
  depth: number;
}

export interface SdkworkIamOrganizationState {
  members: readonly SdkworkIamOrganizationMember[];
  organizations: readonly SdkworkIamOrganization[];
  selectedOrganization?: SdkworkIamOrganization;
  status: "idle" | "loading" | "ready" | "error";
  tree: readonly SdkworkIamOrganizationNode[];
}

export interface CreateSdkworkIamOrganizationControllerInput {
  selectedOrganizationId?: string;
  service: SdkworkIamService;
}

export interface SdkworkIamOrganizationController {
  addMember(organizationId: string, body: Record<string, unknown>): Promise<SdkworkIamOrganizationMember>;
  buildOrganizationTree(organizations?: readonly SdkworkIamOrganization[]): readonly SdkworkIamOrganizationNode[];
  getState(): SdkworkIamOrganizationState;
  listMembers(organizationId: string, params?: Record<string, unknown>): Promise<readonly SdkworkIamOrganizationMember[]>;
  listOrganizations(params?: Record<string, unknown>): Promise<readonly SdkworkIamOrganization[]>;
  selectOrganization(organizationId: string, params?: Record<string, unknown>): Promise<SdkworkIamOrganization | undefined>;
}

export function createSdkworkIamOrganizationController(
  input: SdkworkIamService | CreateSdkworkIamOrganizationControllerInput,
): SdkworkIamOrganizationController {
  const resolved = resolveInput(input);
  let state: SdkworkIamOrganizationState = {
    members: [],
    organizations: [],
    selectedOrganization: undefined,
    status: "idle",
    tree: [],
  };

  const setState = (patch: Partial<SdkworkIamOrganizationState>) => {
    state = {
      ...state,
      ...patch,
    };
  };

  const controller: SdkworkIamOrganizationController = {
    addMember: async (organizationId, body) => {
      const normalizedOrganizationId = requireId(organizationId, "organizationId");
      const member = toOrganizationMember(
        await resolved.service.iam.organizations.members.create(normalizedOrganizationId, body),
      );
      if (!member) {
        throw new Error("SDKWork IAM organization member response is missing userId");
      }

      const nextMembers = [
        ...state.members.filter((item) => item.id !== member.id),
        member,
      ];
      setState({ members: nextMembers, status: "ready" });
      return member;
    },
    buildOrganizationTree: (organizations = state.organizations) => {
      const tree = buildTree(organizations);
      if (organizations === state.organizations) {
        setState({ tree });
      }
      return tree;
    },
    getState: () => ({
      ...state,
      members: [...state.members],
      organizations: [...state.organizations],
      selectedOrganization: state.selectedOrganization ? { ...state.selectedOrganization } : undefined,
      tree: cloneTree(state.tree),
    }),
    listMembers: async (organizationId, params) => {
      const normalizedOrganizationId = requireId(organizationId, "organizationId");
      setState({ status: "loading" });
      try {
        const members = extractList(await resolved.service.iam.organizations.members.list(normalizedOrganizationId, params))
          .map(toOrganizationMember)
          .filter(Boolean) as SdkworkIamOrganizationMember[];
        setState({ members, status: "ready" });
        return members;
      } catch (error) {
        setState({ status: "error" });
        throw error;
      }
    },
    listOrganizations: async (params) => {
      setState({ status: "loading" });
      try {
        const organizations = extractList(await resolved.service.iam.organizations.list(params))
          .map(toOrganization)
          .filter(Boolean) as SdkworkIamOrganization[];
        const selectedOrganization = state.selectedOrganization
          ? organizations.find((organization) => organization.organizationId === state.selectedOrganization?.organizationId) ?? state.selectedOrganization
          : organizations.find((organization) => organization.organizationId === resolved.selectedOrganizationId);
        const tree = buildTree(organizations);
        setState({ organizations, selectedOrganization, status: "ready", tree });
        return organizations;
      } catch (error) {
        setState({ status: "error" });
        throw error;
      }
    },
    selectOrganization: async (organizationId, params) => {
      const normalizedOrganizationId = requireId(organizationId, "organizationId");
      const organizations = state.organizations.length > 0 ? state.organizations : await controller.listOrganizations(params);
      const selectedOrganization = organizations.find(
        (organization) => organization.organizationId === normalizedOrganizationId || organization.id === normalizedOrganizationId,
      );
      setState({ selectedOrganization });
      return selectedOrganization;
    },
  };

  return controller;
}

export function buildSdkworkIamOrganizationTree(
  organizations: readonly SdkworkIamOrganization[],
): readonly SdkworkIamOrganizationNode[] {
  return buildTree(organizations);
}

function resolveInput(
  input: SdkworkIamService | CreateSdkworkIamOrganizationControllerInput,
): CreateSdkworkIamOrganizationControllerInput {
  if ("service" in input) {
    return input;
  }

  return { service: input };
}

function buildTree(organizations: readonly SdkworkIamOrganization[]): SdkworkIamOrganizationNode[] {
  const nodes = new Map<string, SdkworkIamOrganizationNode>();
  const roots: SdkworkIamOrganizationNode[] = [];

  for (const organization of organizations) {
    nodes.set(organization.organizationId, {
      ...organization,
      children: [],
      depth: 0,
    });
  }

  for (const node of nodes.values()) {
    const parentId = node.parentId;
    const parent = parentId ? nodes.get(parentId) : undefined;
    if (parent && parent.organizationId !== node.organizationId) {
      node.depth = parent.depth + 1;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  normalizeDepth(roots, 0);
  return roots;
}

function normalizeDepth(nodes: SdkworkIamOrganizationNode[], depth: number) {
  for (const node of nodes) {
    node.depth = depth;
    normalizeDepth(node.children, depth + 1);
  }
}

function cloneTree(nodes: readonly SdkworkIamOrganizationNode[]): SdkworkIamOrganizationNode[] {
  return nodes.map((node) => ({
    ...node,
    children: cloneTree(node.children),
  }));
}

function extractList(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  for (const key of ["records", "items", "list", "rows", "content", "data"]) {
    const nested = record[key];
    if (Array.isArray(nested)) {
      return nested;
    }
  }

  return [];
}

function toOrganization(value: unknown): SdkworkIamOrganization | undefined {
  const record = toRecord(value);
  const organizationId = optionalString(record.organizationId) || optionalString(record.organization_id) || optionalString(record.id);
  if (!organizationId) {
    return undefined;
  }

  return {
    code: optionalString(record.code),
    id: optionalString(record.id) || organizationId,
    name: optionalString(record.name) || optionalString(record.organizationName) || organizationId,
    organizationId,
    parentId: optionalString(record.parentId) || optionalString(record.parent_id) || optionalString(record.parentOrganizationId),
    path: optionalString(record.path),
    status: optionalString(record.status),
    tenantId: optionalString(record.tenantId) || optionalString(record.tenant_id),
  };
}

function toOrganizationMember(value: unknown): SdkworkIamOrganizationMember | undefined {
  const record = toRecord(value);
  const userId = optionalString(record.userId) || optionalString(record.user_id) || optionalString(record.id);
  if (!userId) {
    return undefined;
  }

  return {
    displayName: optionalString(record.displayName) || optionalString(record.name) || optionalString(record.nickname),
    email: optionalString(record.email),
    id: optionalString(record.id) || userId,
    organizationId: optionalString(record.organizationId) || optionalString(record.organization_id),
    roleCode: optionalString(record.roleCode) || optionalString(record.role_code),
    status: optionalString(record.status),
    userId,
    username: optionalString(record.username),
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function optionalString(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : value === undefined || value === null ? "" : String(value).trim();
  return normalized || undefined;
}

function requireId(value: unknown, name: string): string {
  const normalized = optionalString(value);
  if (!normalized) {
    throw new Error(`SDKWork IAM organization controller requires ${name}`);
  }

  return normalized;
}
