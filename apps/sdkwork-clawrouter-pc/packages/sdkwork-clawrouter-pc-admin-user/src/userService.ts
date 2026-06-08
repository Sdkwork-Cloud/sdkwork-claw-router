import {
  createIdempotencyParams,
  ensureSdkworkApiSuccess,
  getClawRouterBackendSdkClient,
  getSdkworkAppbaseBackendSdkClient,
  isRecord,
  readApiData,
  readApiRecord,
  readRequiredApiItems,
  readRequiredApiItem,
  readRequiredPositiveInt64String,
  requiredSafePathSegment,
  requiredPositiveInt64String,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import type {
  AdminApiKeyCreateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

export interface UserListItem {
  id: string;
  email: string;
  username: string;
  displayName: string;
  mobile: string;
  gender: string;
  country: string;
  province: string;
  city: string;
  district: string;
  address: string;
  role: string;
  group: string;
  balance: string;
  status: string;
  lastActive: string;
  lastUsed: string;
  createdAt: string;
  updatedAt: string;
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
  userId: string;
  name: string;
};

export type UserAdminTableData = {
  users: UserListItem[];
  apiKeysMap: Record<string, ApiKeyItem[]>;
  apiKeysLoadError: Error | null;
};

type UserAdminTableDataLoaders = {
  fetchUsers?: typeof UserService.fetchUsers;
  fetchApiKeysMap?: typeof UserService.fetchApiKeysMap;
};

type AppbaseOperationCommand = Record<string, unknown>;

export class UserService {
  static async fetchUsers(): Promise<UserListItem[]> {
    const result = await getSdkworkAppbaseBackendSdkClient().iam.users.list();
    ensureSdkworkApiSuccess(result, 'admin.user.errors.fetchUsersFallback');
    return readRequiredApiItems(result, 'admin.user.errors.fetchUsersFallback')
      .map(normalizeUser);
  }

  static async fetchApiKeysMap(): Promise<Record<string, ApiKeyItem[]>> {
    const result = await getSdkworkAppbaseBackendSdkClient().iam.apiKeys.list();
    ensureSdkworkApiSuccess(result, 'admin.user.errors.fetchApiKeysFallback');
    return normalizeApiKeysMap(readApiData(result));
  }

  static async addUser(user: UserCreateInput): Promise<UserListItem> {
    const result = await getSdkworkAppbaseBackendSdkClient().iam.users.create(
      toCreateUserRequest(user),
    );
    ensureSdkworkApiSuccess(result, 'admin.user.errors.addUserFallback');
    return normalizeUser(readRequiredApiItem(result, 'admin.user.errors.addUserMissingData'));
  }

  static async updateUser(id: string, updates: UserUpdateInput): Promise<UserListItem> {
    const userId = requiredPositiveInt64String(id, 'id');
    const result = await getSdkworkAppbaseBackendSdkClient().iam.users.update(
      userId,
      toUpdateUserRequest(updates),
    );
    ensureSdkworkApiSuccess(result, 'admin.user.errors.updateUserFallback');
    return normalizeUser(readRequiredApiItem(result, 'admin.user.errors.updateUserMissingData'));
  }

  static async createApiKey(input: ApiKeyCreateInput): Promise<{ key: ApiKeyItem; rawKey: string }> {
    const result = await getClawRouterBackendSdkClient().iam.apiKeys.create(
      toCreateApiKeyRequest(input),
      createIdempotencyParams('admin-api-key-create'),
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

  static async deleteApiKey(userId: string, keyId: string): Promise<void> {
    const result = await getClawRouterBackendSdkClient().iam.apiKeys.delete(
      requiredSafePathSegment(keyId, 'apiKeyId'),
    );
    ensureSdkworkApiSuccess(result, 'admin.user.errors.deleteApiKeyFallback');
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

function toCreateUserRequest(user: UserCreateInput): AppbaseOperationCommand {
  return pruneUndefined({
    email: requiredText(user.email, 'email'),
    username: optionalText(user.username),
    balance: optionalText(user.balance),
  });
}

function toUpdateUserRequest(updates: UserUpdateInput): AppbaseOperationCommand {
  return pruneUndefined({
    username: optionalText(updates.username),
    group: optionalText(updates.group),
    status: updates.status,
  });
}

function toCreateApiKeyRequest(input: ApiKeyCreateInput): AdminApiKeyCreateRequest {
  return {
    userId: requiredPositiveInt64String(input.userId, 'userId'),
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

function pruneUndefined<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function normalizeUser(value: unknown): UserListItem {
  const item = readRequiredRecord(value, 'User record is required');
  return {
    id: readRequiredPositiveInt64String(item, 'id', 'User id is required'),
    email: readString(item, 'email'),
    username: readFirstString(item, ['username', 'userName', 'account']),
    displayName: readFirstString(item, ['displayName', 'name', 'nickname', 'title']),
    mobile: readFirstString(item, ['mobile', 'phone', 'phoneNumber']),
    gender: readFirstString(item, ['gender', 'sex']),
    country: readFirstString(item, ['country', 'countryCode', 'countryName', 'nation']),
    province: readFirstString(item, ['province', 'state', 'region']),
    city: readFirstString(item, ['city', 'locality']),
    district: readFirstString(item, ['district', 'county', 'area']),
    address: readFirstString(item, ['address', 'streetAddress', 'addressLine']),
    role: readString(item, 'role'),
    group: readString(item, 'group'),
    balance: readString(item, 'balance'),
    status: readString(item, 'status', 'active'),
    lastActive: readString(item, 'lastActive'),
    lastUsed: readString(item, 'lastUsed'),
    createdAt: readString(item, 'createdAt'),
    updatedAt: readString(item, 'updatedAt'),
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

function normalizeApiKeysMap(data: unknown): Record<string, ApiKeyItem[]> {
  const result: Record<string, ApiKeyItem[]> = {};
  if (!isRecord(data)) {
    throw new Error('API key map is required');
  }
  for (const [key, value] of Object.entries(data)) {
    if (!Array.isArray(value)) {
      throw new Error(`API key list for user ${key} is required`);
    }
    const userId = requiredPositiveInt64String(key, 'API key map user id');
    if (userId !== key) {
      throw new Error('API key map user id must be a positive int64 string');
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

function readFirstString(record: ApiRecord, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = readString(record, key).trim();
    if (value) {
      return value;
    }
  }
  return fallback;
}
