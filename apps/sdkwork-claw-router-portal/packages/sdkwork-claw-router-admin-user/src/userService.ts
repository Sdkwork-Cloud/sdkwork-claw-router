import {
  createRequestParams,
  ensureSdkworkApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readApiData,
  readApiRecord,
  readBoolean,
  readRequiredApiItems,
  readRequiredApiItem,
  readRequiredNumber,
  requiredSafePathSegment,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminApiKeyCreateRequest,
  AdminUserCreateRequest,
  AdminUserUpdateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

export const USER_ADMIN_ERROR_KEYS = {
  updateBalanceFallback: 'admin.user.errors.updateBalanceFallback',
} as const;

export interface UserListItem {
  id: number;
  email: string;
  username: string;
  role: string;
  group: string;
  balance: string;
  status: 'active' | 'banned';
  lastActive: string;
  lastUsed: string;
  createdAt: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  used: string;
  status: string;
}

export type UserCreateInput = {
  email: string;
  username?: string;
  balance?: string;
};

export type UserUpdateInput = {
  username?: string;
  group?: string;
  status?: UserListItem['status'];
};

export type ApiKeyCreateInput = {
  userId: number;
  name: string;
};

export type UserAdminTableData = {
  users: UserListItem[];
  apiKeysMap: Record<number, ApiKeyItem[]>;
  apiKeysLoadError: Error | null;
};

type UserAdminTableDataLoaders = {
  fetchUsers?: typeof UserService.fetchUsers;
  fetchApiKeysMap?: typeof UserService.fetchApiKeysMap;
};

export class UserService {
  static async fetchUsers(): Promise<UserListItem[]> {
    const result = await getClawRouterBackendSdkClient().iam.users.list();
    ensureSdkworkApiSuccess(result, 'admin.user.errors.fetchUsersFallback');
    return readRequiredApiItems(result, 'admin.user.errors.fetchUsersFallback')
      .map(normalizeUser);
  }

  static async fetchApiKeysMap(): Promise<Record<number, ApiKeyItem[]>> {
    const result = await getClawRouterBackendSdkClient().iam.apiKeys.list();
    ensureSdkworkApiSuccess(result, 'admin.user.errors.fetchApiKeysFallback');
    return normalizeApiKeysMap(readApiData(result));
  }

  static async addUser(user: UserCreateInput): Promise<UserListItem> {
    const result = await getClawRouterBackendSdkClient().iam.users.create(
      toCreateUserRequest(user),
    );
    ensureSdkworkApiSuccess(result, 'admin.user.errors.addUserFallback');
    return normalizeUser(readRequiredApiItem(result, 'admin.user.errors.addUserMissingData'));
  }

  static async updateUser(id: number, updates: UserUpdateInput): Promise<UserListItem> {
    const result = await getClawRouterBackendSdkClient().iam.users.update(
      toUpdateUserRequest(id, updates),
    );
    ensureSdkworkApiSuccess(result, 'admin.user.errors.updateUserFallback');
    return normalizeUser(readRequiredApiItem(result, 'admin.user.errors.updateUserMissingData'));
  }

  static async createApiKey(input: ApiKeyCreateInput): Promise<{ key: ApiKeyItem; rawKey: string }> {
    const result = await getClawRouterBackendSdkClient().iam.apiKeys.create(
      toCreateApiKeyRequest(input),
      createRequestParams('admin-api-key-create'),
    );
    ensureSdkworkApiSuccess(result, 'admin.user.errors.createApiKeyFallback');
    const data = readApiRecord(result);
    const keyData = data.key;
    if (!isRecord(keyData)) {
      throw new Error('admin.user.errors.createApiKeyMissingData');
    }
    const key = normalizeApiKey(keyData);
    const rawKey = readString(data, 'rawKey');
    if (!rawKey) {
      throw new Error('admin.user.errors.createApiKeyMissingRawKey');
    }
    return {
      key,
      rawKey,
    };
  }

  static async deleteApiKey(userId: number, keyId: string): Promise<void> {
    const result = await getClawRouterBackendSdkClient().iam.apiKeys.delete(
      requiredSafePathSegment(keyId, 'apiKeyId'),
    );
    ensureDeleteResult(result, 'admin.user.errors.deleteApiKeyFallback');
    void userId;
  }

  static loadAdminTableData(
    loaders: UserAdminTableDataLoaders = {},
  ): Promise<UserAdminTableData> {
    const fetchUsers = loaders.fetchUsers ?? UserService.fetchUsers;
    const fetchApiKeysMap = loaders.fetchApiKeysMap ?? UserService.fetchApiKeysMap;

    return fetchUsers().then(async (users) => {
      try {
        const apiKeysMap = await fetchApiKeysMap();
        return {
          users,
          apiKeysMap,
          apiKeysLoadError: null,
        };
      } catch (error) {
        return {
          users,
          apiKeysMap: {},
          apiKeysLoadError: asError(error),
        };
      }
    });
  }
}

function toCreateUserRequest(user: UserCreateInput): AdminUserCreateRequest {
  return pruneUndefined({
    email: requiredText(user.email, 'email'),
    username: optionalText(user.username),
    balance: optionalText(user.balance),
  });
}

function toUpdateUserRequest(id: number, updates: UserUpdateInput): AdminUserUpdateRequest {
  return pruneUndefined({
    id: positiveId(id, 'id'),
    username: optionalText(updates.username),
    group: optionalText(updates.group),
    status: updates.status,
  });
}

function toCreateApiKeyRequest(input: ApiKeyCreateInput): AdminApiKeyCreateRequest {
  return {
    userId: positiveId(input.userId, 'userId'),
    name: requiredText(input.name, 'name'),
  };
}

function requiredText(value: string | undefined, fieldName: string): string {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function positiveId(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return value;
}

function pruneUndefined<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

function ensureDeleteResult(result: unknown, message: string): void {
  ensureSdkworkApiSuccess(result, message);
  if (readBoolean(readApiRecord(result), 'deleted') !== true) {
    throw new Error(message);
  }
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function normalizeUser(value: unknown): UserListItem {
  const item = readRequiredRecord(value, 'User record is required');
  return {
    id: readRequiredNumber(item, 'id', 'User id is required'),
    email: readRequiredString(item, 'email', 'User email is required'),
    username: readRequiredString(item, 'username', 'Username is required'),
    role: readRequiredString(item, 'role', 'User role is required'),
    group: readRequiredString(item, 'group', 'User group is required'),
    balance: readRequiredString(item, 'balance', 'User balance is required'),
    status: readUserStatus(item),
    lastActive: readRequiredString(item, 'lastActive', 'User last active time is required'),
    lastUsed: readRequiredString(item, 'lastUsed', 'User last used time is required'),
    createdAt: readRequiredString(item, 'createdAt', 'User created time is required'),
  };
}

function normalizeApiKey(value: unknown): ApiKeyItem {
  const item = readRequiredRecord(value, 'API key record is required');
  return {
    id: readRequiredString(item, 'id', 'API key id is required'),
    name: readRequiredString(item, 'name', 'API key name is required'),
    key: readRequiredString(item, 'key', 'API key value is required'),
    used: readRequiredString(item, 'used', 'API key usage is required'),
    status: readRequiredString(item, 'status', 'API key status is required'),
  };
}

function normalizeApiKeysMap(data: unknown): Record<number, ApiKeyItem[]> {
  const result: Record<number, ApiKeyItem[]> = {};
  if (!isRecord(data)) {
    throw new Error('API key map is required');
  }
  for (const [key, value] of Object.entries(data)) {
    if (!Array.isArray(value)) {
      throw new Error(`API key list for user ${key} is required`);
    }
    const userId = Number(key);
    if (!Number.isSafeInteger(userId) || userId < 1 || String(userId) !== key) {
      throw new Error('API key map user id must be a positive integer');
    }
    result[userId] = value.map(normalizeApiKey);
  }
  return result;
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readUserStatus(item: ApiRecord): UserListItem['status'] {
  const status = readString(item, 'status');
  if (status === 'active' || status === 'banned') {
    return status;
  }
  throw new Error(status ? `Unsupported user status: ${status}` : 'User status is required');
}
