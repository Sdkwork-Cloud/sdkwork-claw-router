import type { ElementType } from 'react';
import { Cloud, CreditCard, Layout, Server, Settings, Sparkles } from 'lucide-react';
import type {
  ApiParameter,
  ApiReferenceEndpoint,
  OpenApiDocument,
  OpenApiJsonSchema,
  OpenApiOperation,
  OpenApiParameter,
  OpenApiPathItem,
  OpenApiResponse,
} from './openapiTypes';
import {
  isOpenApiDocument,
  isOpenApiOperation,
  isOpenApiParameter,
  OPEN_API_OPERATION_METHODS,
} from './openapiTypes.ts';
import {
  generateOpenApiSchemaExample,
  getDocumentedRequestSchema,
  getDocumentedResponseMediaType,
  getOpenApiMediaExample,
  getOpenApiSchemaName,
  schemaToApiParameters,
  schemaToTypeLabel,
} from './openapiSchemaRuntime.ts';
import {
  APP_API_PREFIX,
  BACKEND_API_PREFIX,
  OPEN_API_PREFIX,
} from 'sdkwork-claw-router-commons/runtime';

export const API_SCHEMA_TABS_URL = '/openapi/schema-tabs.json';
export const LEGACY_OPENAPI_URL = '/openapi.json';

export interface ApiSchemaTab {
  id: string;
  name: string;
  order: number;
  schemaUrls: string[];
  defaultSchemaUrl?: string;
  cacheTtlSeconds?: number;
  status?: ApiSchemaTabStatus;
  description?: string;
}

export interface ApiSchemaTabsDocument {
  cacheTtlSeconds?: number;
  tabs: ApiSchemaTab[];
}

export type ApiSchemaTabStatus = 'available' | 'planned';

export interface ApiCategory {
  id: string;
  name: string;
  endpoints: ApiReferenceEndpoint[];
}

export interface ApiCategorySidebarNode {
  id: string;
  name: string;
  fullName: string;
  endpoints: ApiReferenceEndpoint[];
  children: ApiCategorySidebarNode[];
  totalEndpoints: number;
}

export interface ApiSystemData {
  id: string;
  name: string;
  icon: ElementType;
  schemaUrl: string;
  requestBaseUrl: string;
  openApiSpec?: OpenApiDocument;
  categories: ApiCategory[];
  status: ApiSchemaTabStatus;
  description?: string;
}

export type ApiReferenceFetchJson = (url: string) => Promise<unknown>;

export function sortApiSchemaTabs(tabs: ApiSchemaTab[]): ApiSchemaTab[] {
  return [...tabs].sort((left, right) => {
    if (left.order !== right.order) {
      return left.order - right.order;
    }
    return left.id.localeCompare(right.id);
  });
}

export function buildApiCategorySidebarTree(categories: ApiCategory[]): ApiCategorySidebarNode[] {
  const rootNodes: ApiCategorySidebarNode[] = [];
  const nodeMap: Record<string, ApiCategorySidebarNode> = {};

  sortApiCategories(categories).forEach((category) => {
    const segments = splitApiCategoryPath(category.name);
    let parentNode: ApiCategorySidebarNode | undefined;

    segments.forEach((segment, index) => {
      const fullName = segments.slice(0, index + 1).join('/');
      let node = nodeMap[fullName];
      if (!node) {
        node = {
          id: createApiSidebarNodeId(fullName),
          name: segment,
          fullName,
          endpoints: [],
          children: [],
          totalEndpoints: 0,
        };
        nodeMap[fullName] = node;

        if (parentNode) {
          parentNode.children.push(node);
        } else {
          rootNodes.push(node);
        }
      }

      parentNode = node;
    });

    parentNode?.endpoints.push(...category.endpoints);
  });

  return sortApiSidebarNodes(rootNodes).map(finalizeApiSidebarNode);
}

export async function loadApiReferenceSystems(fetchJson: ApiReferenceFetchJson = defaultFetchJson): Promise<ApiSystemData[]> {
  try {
    const manifestPayload = await fetchJson(API_SCHEMA_TABS_URL);
    const manifest = normalizeApiSchemaTabsDocument(manifestPayload);
    return buildApiReferenceSystemsFromTabs(manifest, fetchJson);
  } catch {
    const legacyPayload = await fetchJson(LEGACY_OPENAPI_URL);
    if (!isOpenApiDocument(legacyPayload)) {
      throw new Error('Invalid OpenAPI document');
    }
    return buildApiReferenceSystemsFromTabs({
      tabs: [{
        id: 'gateway',
        name: 'AI聚合API',
        order: 10,
        schemaUrls: [LEGACY_OPENAPI_URL],
        defaultSchemaUrl: LEGACY_OPENAPI_URL,
        status: 'available',
      }],
    }, async () => legacyPayload);
  }
}

export async function buildApiReferenceSystemsFromTabs(
  manifest: ApiSchemaTabsDocument,
  fetchJson: ApiReferenceFetchJson,
): Promise<ApiSystemData[]> {
  const systems = await Promise.all(sortApiSchemaTabs(manifest.tabs).map(async (tab) => {
    if (tab.status === 'planned' && tab.schemaUrls.length === 0) {
      return {
        id: tab.id,
        name: tab.name,
        icon: iconForTab(tab.id),
        schemaUrl: '',
        requestBaseUrl: '',
        categories: [],
        status: tab.status,
        description: tab.description,
      };
    }

    const schemaDocs = await Promise.all(tab.schemaUrls.map(async (url) => {
      const payload = await fetchJson(url);
      if (!isOpenApiDocument(payload)) {
        throw new Error(`Invalid OpenAPI document: ${url}`);
      }
      return { url, spec: payload };
    }));
    const schemaUrl = tab.defaultSchemaUrl || tab.schemaUrls[0];
    const defaultSchemaDoc = schemaDocs.find((schemaDoc) => schemaDoc.url === schemaUrl) ?? schemaDocs[0];

    return {
      id: tab.id,
      name: tab.name,
      icon: iconForTab(tab.id),
      schemaUrl,
      requestBaseUrl: resolveApiSystemRequestBaseUrl(tab.id, schemaUrl, defaultSchemaDoc?.spec),
      openApiSpec: defaultSchemaDoc?.spec,
      categories: schemaDocs.flatMap((schemaDoc) => openApiDocumentToCategories(schemaDoc.spec)),
      status: tab.status ?? 'available',
      description: tab.description,
    };
  }));

  return systems.filter((system) => system.status === 'planned' || system.categories.length > 0);
}

export function getApiSystemDisplayName(system: Pick<ApiSystemData, 'id' | 'name'>): string {
  if (system.id === 'gateway') {
    return 'AI聚合API';
  }
  return system.name;
}

export function getDefaultApiReferenceEndpoint(system: ApiSystemData): ApiReferenceEndpoint | null {
  const endpoints = system.categories.flatMap((category) => category.endpoints);
  if (endpoints.length === 0) {
    return null;
  }

  if (system.id === 'gateway') {
    const chatCompletionEndpoint = endpoints.find((endpoint) => (
      endpoint.path === '/v1/chat/completions' && endpoint.method.toUpperCase() === 'POST'
    ));
    if (chatCompletionEndpoint) {
      return chatCompletionEndpoint;
    }
  }

  return endpoints[0];
}

export function formatApiOperationDisplayName(value: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized) {
    return normalized;
  }
  return normalized
    .split(' ')
    .map((word) => (
      shouldPreserveApiDisplayWord(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    ))
    .join(' ');
}

function normalizeApiSchemaTabsDocument(value: unknown): ApiSchemaTabsDocument {
  if (!isRecord(value) || !Array.isArray(value.tabs)) {
    throw new Error('Invalid API schema tabs document');
  }

  const tabs = value.tabs.map(normalizeApiSchemaTab).filter((tab) => (
    tab.status === 'planned' || tab.schemaUrls.length > 0
  ));
  if (tabs.length === 0) {
    throw new Error('API schema tabs document has no schema urls');
  }

  return {
    cacheTtlSeconds: numberOrUndefined(value.cacheTtlSeconds),
    tabs,
  };
}

function normalizeApiSchemaTab(value: unknown): ApiSchemaTab {
  if (!isRecord(value)) {
    throw new Error('Invalid API schema tab');
  }
  const id = stringOrThrow(value.id, 'API schema tab id');
  const name = stringOrThrow(value.name, 'API schema tab name');
  const schemaUrls = Array.isArray(value.schemaUrls)
    ? value.schemaUrls.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

  return {
    id,
    name,
    order: typeof value.order === 'number' && Number.isFinite(value.order) ? value.order : 0,
    schemaUrls,
    defaultSchemaUrl: typeof value.defaultSchemaUrl === 'string' ? value.defaultSchemaUrl : undefined,
    cacheTtlSeconds: numberOrUndefined(value.cacheTtlSeconds),
    status: normalizeApiSchemaTabStatus(value.status),
    description: typeof value.description === 'string' ? value.description : undefined,
  };
}

function openApiDocumentToCategories(spec: OpenApiDocument): ApiCategory[] {
  const categoriesMap: Record<string, ApiCategory> = {};

  Object.entries(spec.paths).forEach(([path, pathItem]: [string, OpenApiPathItem]) => {
    Object.entries(pathItem).forEach(([method, operation]) => {
      if (!isOperationMethod(method) || !isOpenApiOperation(operation)) return;

      const tag = operation.tags?.[0] || 'Default';
      if (!categoriesMap[tag]) {
        categoriesMap[tag] = {
          id: tag.toLowerCase().replace(/\s+/g, '-'),
          name: tag,
          endpoints: [],
        };
      }

      const successResponse = getSuccessResponse(operation);
      const successResponseStatus = getSuccessResponseStatus(operation);
      const selectedResponseMedia = getDocumentedResponseMediaType(successResponse?.content);
      const responseMediaType = selectedResponseMedia?.mediaType;
      const requestSchema = getDocumentedRequestSchema(operation.requestBody);
      const schema = responseMediaType?.schema;
      const responseExample = getOpenApiMediaExample(responseMediaType)
        ?? generateOpenApiSchemaExample(schema, { spec });
      categoriesMap[tag].endpoints.push({
        id: operation.operationId || `${method}-${path.replace(/\//g, '-')}`,
        name: formatApiOperationDisplayName(operation.summary || path),
        method: method.toUpperCase(),
        path,
        description: operation.description || '',
        body: operationToParameters(operation, pathItem, spec),
        requestObject: getOpenApiSchemaName(requestSchema),
        responseProperties: schemaToApiParameters(schema, { spec }),
        responseObject: getOpenApiSchemaName(schema),
        responseType: schema ? schemaToTypeLabel(schema, { spec }) : undefined,
        responseStatus: successResponseStatus,
        responseContentType: selectedResponseMedia?.contentType,
        curl: '',
        response: schema ? JSON.stringify(responseExample, null, 2) : '',
        openApiOperation: operation,
        openApiPathItem: pathItem,
        openApiSpec: spec,
      });
    });
  });

  return sortApiCategories(Object.values(categoriesMap));
}

function shouldPreserveApiDisplayWord(word: string): boolean {
  return /^[A-Z0-9_\-/{}:]+$/.test(word)
    || word.includes('.')
    || word.includes('_')
    || word.includes('-')
    || word.includes('/')
    || word.includes('{')
    || word.includes('}');
}

function sortApiCategories(categories: ApiCategory[]): ApiCategory[] {
  return [...categories].sort((left, right) => {
    const leftKey = categorySortKey(left.name);
    const rightKey = categorySortKey(right.name);
    for (let index = 0; index < Math.max(leftKey.length, rightKey.length); index += 1) {
      const leftValue = leftKey[index] ?? '';
      const rightValue = rightKey[index] ?? '';
      if (leftValue !== rightValue) {
        return leftValue.localeCompare(rightValue);
      }
    }
    return left.name.localeCompare(right.name);
  });
}

function sortApiSidebarNodes(nodes: ApiCategorySidebarNode[]): ApiCategorySidebarNode[] {
  return [...nodes].sort((left, right) => {
    const leftKey = categorySortKey(left.fullName);
    const rightKey = categorySortKey(right.fullName);
    for (let index = 0; index < Math.max(leftKey.length, rightKey.length); index += 1) {
      const leftValue = leftKey[index] ?? '';
      const rightValue = rightKey[index] ?? '';
      if (leftValue !== rightValue) {
        return leftValue.localeCompare(rightValue);
      }
    }
    return left.fullName.localeCompare(right.fullName);
  });
}

function finalizeApiSidebarNode(node: ApiCategorySidebarNode): ApiCategorySidebarNode {
  const children = sortApiSidebarNodes(node.children).map(finalizeApiSidebarNode);
  return {
    ...node,
    children,
    totalEndpoints: node.endpoints.length + children.reduce((sum, child) => sum + child.totalEndpoints, 0),
  };
}

function splitApiCategoryPath(categoryName: string): string[] {
  const segments = categoryName.split('/').map((segment) => segment.trim()).filter(Boolean);
  return segments.length > 0 ? segments : ['Default'];
}

function createApiSidebarNodeId(fullName: string): string {
  return fullName.toLowerCase().replace(/\s+/g, '-');
}

function categorySortKey(categoryName: string): string[] {
  const [parent = categoryName, vendor = ''] = categoryName.split('/');
  const modalityOrder = [
    'Responses',
    'Conversations',
    'Chat',
    'Completions',
    'Embeddings',
    'Models',
    'Images',
    'Videos',
    'Audio',
    'Files',
    'Vector Stores',
    'Assistants',
    'Batches',
    'Fine Tuning',
    'Evals',
    'Containers',
    'Skills',
    'Administration',
    'Moderations',
    'Uploads',
    'Realtime',
  ];
  const parentIndex = modalityOrder.indexOf(parent);
  return [
    parentIndex >= 0 ? String(parentIndex).padStart(3, '0') : `999-${parent}`,
    vendor ? '1' : '0',
    vendor,
    categoryName,
  ];
}

function operationToParameters(operation: OpenApiOperation, pathItem: OpenApiPathItem, spec: OpenApiDocument): ApiParameter[] {
  const requestSchema = getDocumentedRequestSchema(operation.requestBody);
  const pathParams = normalizeOpenApiOperationParameters(pathItem, operation, spec).map((parameter) => ({
    name: parameter.name ?? '',
    type: parameter.schema ? schemaToTypeLabel(parameter.schema, { spec }) : 'string',
    desc: parameter.description || '',
    required: parameter.required,
  }));
  return [
    ...pathParams,
    ...schemaToApiParameters(requestSchema, { spec }),
  ];
}

function normalizeOpenApiOperationParameters(
  pathItem: OpenApiPathItem,
  operation: OpenApiOperation,
  spec: OpenApiDocument,
): OpenApiParameter[] {
  return [
    ...(pathItem.parameters ?? []),
    ...(operation.parameters ?? []),
  ]
    .filter(isOpenApiParameter)
    .map((parameter) => resolveOpenApiParameterReference(parameter, spec))
    .filter(isOpenApiParameter);
}

function resolveOpenApiParameterReference(parameter: OpenApiParameter, spec: OpenApiDocument): OpenApiParameter {
  if (typeof parameter.$ref !== 'string') {
    return parameter;
  }

  const referenced = resolveLocalOpenApiParameterRef(parameter.$ref, spec);
  if (!referenced) {
    return parameter;
  }

  return {
    ...referenced,
    description: parameter.description ?? referenced.description,
  };
}

function resolveLocalOpenApiParameterRef(ref: string, spec: OpenApiDocument): OpenApiParameter | undefined {
  const prefix = '#/components/parameters/';
  if (!ref.startsWith(prefix)) {
    return undefined;
  }
  let parameterName: string;
  try {
    parameterName = decodeURIComponent(ref.slice(prefix.length));
  } catch {
    return undefined;
  }
  return spec.components?.parameters?.[parameterName];
}

function getSuccessResponse(operation: OpenApiOperation): OpenApiResponse | undefined {
  return operation.responses?.['200'] || operation.responses?.['201'];
}

function getSuccessResponseStatus(operation: OpenApiOperation): string | undefined {
  if (operation.responses?.['200']) return '200';
  if (operation.responses?.['201']) return '201';
  return undefined;
}

function isOperationMethod(method: string): boolean {
  return OPEN_API_OPERATION_METHODS.includes(method as typeof OPEN_API_OPERATION_METHODS[number]);
}

async function defaultFetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

function iconForTab(id: string): ElementType {
  if (id === 'payment-aggregate') return CreditCard;
  if (id === 'cloud-services') return Cloud;
  if (id === 'backend') return Settings;
  if (id === 'app') return Layout;
  if (id === 'gateway') return Sparkles;
  return Server;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringOrThrow(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${label} is required`);
  }
  return value;
}

function numberOrUndefined(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function normalizeApiSchemaTabStatus(value: unknown): ApiSchemaTabStatus | undefined {
  if (value === 'planned') return 'planned';
  if (value === 'available') return 'available';
  return undefined;
}

function resolveApiSystemRequestBaseUrl(
  systemId: string,
  schemaUrl: string,
  spec?: OpenApiDocument,
): string {
  const contractPrefix = typeof spec?.["x-api-prefix"] === 'string'
    ? spec["x-api-prefix"].trim()
    : '';
  if (contractPrefix) {
    return contractPrefix;
  }
  if (systemId === 'backend') {
    return BACKEND_API_PREFIX;
  }
  if (systemId === 'app') {
    return APP_API_PREFIX;
  }
  if (systemId === 'gateway') {
    return OPEN_API_PREFIX;
  }
  if (schemaUrl.endsWith('/openapi.json')) {
    return schemaUrl.slice(0, -'/openapi.json'.length) || '';
  }
  return '';
}
