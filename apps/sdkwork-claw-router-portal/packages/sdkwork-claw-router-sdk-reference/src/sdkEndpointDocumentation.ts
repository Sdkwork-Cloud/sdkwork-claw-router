import type {
  ApiParameter,
  ApiReferenceEndpoint,
  OpenApiJsonSchema,
  OpenApiParameter,
} from 'sdkwork-claw-router-api-reference/openapiTypes';
import {
  resolveApiRequestUrl,
  type ResolvedApiRequestUrl,
} from 'sdkwork-claw-router-commons/runtime';
import {
  generateOpenApiSchemaExample,
  getDocumentedRequestMediaType,
  getDocumentedRequestSchema,
  getDocumentedResponseMediaType,
  getDocumentedResponseSchema,
  getOpenApiSchemaName,
  schemaToApiParameters,
  schemaToTypeLabel,
  schemaToTypescriptType,
} from 'sdkwork-claw-router-api-reference/openapiSchemaRuntime';

export interface SdkEndpointData {
  name: string;
  packageName: string;
  baseUrl: string;
}

export interface SdkEndpointDocumentation {
  languageLabel: string;
  methodName: string;
  groupName: string;
  requestType: string;
  responseType: string;
  signature: string;
  codeDefinition: string;
  exampleUsage: string;
  parameters: ApiParameter[];
  returns: ApiParameter[];
}

interface SdkCodeDefinitionInput {
  methodName: string;
  requestType: string;
  responseType: string;
  hasRequestBody: boolean;
  hasSdkParams: boolean;
  paramsRequired: boolean;
  paramsType: string;
  bodyType: string;
  parameters: ApiParameter[];
  operationParameters: ApiParameter[];
  bodyParameters: ApiParameter[];
  signature: string;
  requestContentType?: string;
}

interface SdkExampleUsageInput {
  methodName: string;
  groupName: string;
  requestUrl: ResolvedApiRequestUrl;
  hasRequestBody: boolean;
  hasSdkParams: boolean;
  requestSchema?: OpenApiJsonSchema;
  responseSchema?: OpenApiJsonSchema;
  operationParameters: ApiParameter[];
  requestContentType?: string;
}

export function buildSdkEndpointDocumentation(
  endpoint: ApiReferenceEndpoint,
  sdkData: SdkEndpointData,
  languageId = 'typescript',
): SdkEndpointDocumentation {
  const language = normalizeDocumentationLanguage(languageId);
  const methodName = toSdkMethodName(endpoint, language);
  const groupName = toSdkGroupName(endpoint.openApiOperation?.tags?.[0], language);
  const requestUrl = resolveApiRequestUrl(sdkData.baseUrl, endpoint.path);
  const requestMediaType = getDocumentedRequestMediaType(endpoint.openApiOperation?.requestBody);
  const requestSchema = getDocumentedRequestSchema(endpoint.openApiOperation?.requestBody);
  const responseSchema = getDocumentedResponseSchema(getSuccessResponseContent(endpoint));
  const bodyType = schemaToSdkType(requestSchema, endpoint, fallbackObjectType(language), language);
  const responseType = schemaToSdkType(responseSchema, endpoint, fallbackVoidType(language), language);
  const hasRequestBody = Boolean(requestSchema);
  const operationParameters = operationToSdkParameters(endpoint);
  const bodyParameters = hasRequestBody
    ? schemaToApiParameters(requestSchema, { spec: endpoint.openApiSpec })
    : [];
  const hasSdkParams = operationParameters.length > 0;
  const paramsRequired = operationParameters.some((parameter) => Boolean(parameter.required));
  const paramsType = hasSdkParams
    ? `${toPascalCase(splitIdentifier(endpoint.openApiOperation?.operationId || methodName))}Params`
    : '';
  const requestType = hasRequestBody
    ? bodyType
    : hasSdkParams
      ? paramsType
      : fallbackObjectType(language);
  const signature = buildSignature(language, {
    methodName,
    requestType,
    responseType,
    hasRequestBody,
    hasSdkParams,
    paramsRequired,
    paramsType,
    bodyType,
  });
  const parameters = [...operationParameters, ...bodyParameters];
  const returns = schemaToApiParameters(responseSchema, { spec: endpoint.openApiSpec });
  const codeDefinition = buildCodeDefinition(endpoint, language, {
    methodName,
    requestType,
    responseType,
    hasRequestBody,
    hasSdkParams,
    paramsRequired,
    paramsType,
    bodyType,
    parameters,
    operationParameters,
    bodyParameters,
    signature,
    requestContentType: requestMediaType?.contentType,
  });
  const exampleUsage = buildExampleUsage(endpoint, sdkData, language, {
    methodName,
    groupName,
    requestUrl,
    hasRequestBody,
    hasSdkParams,
    requestSchema,
    responseSchema,
    operationParameters,
    requestContentType: requestMediaType?.contentType,
  });

  return {
    languageLabel: language,
    methodName,
    groupName,
    requestType,
    responseType,
    signature,
    codeDefinition,
    exampleUsage,
    parameters,
    returns,
  };
}

function buildCodeDefinition(
  endpoint: ApiReferenceEndpoint,
  language: string,
  input: SdkCodeDefinitionInput,
): string {
  if (language === 'python') {
    return buildPythonCodeDefinition(endpoint, input);
  }
  if (language === 'go') {
    return buildGoCodeDefinition(endpoint, input);
  }
  if (language === 'java') {
    return buildJavaCodeDefinition(endpoint, input);
  }
  if (language === 'ruby') {
    return buildRubyCodeDefinition(endpoint, input);
  }
  if (language === 'php') {
    return buildPhpCodeDefinition(endpoint, input);
  }
  if (language === 'csharp') {
    return buildCsharpCodeDefinition(endpoint, input);
  }
  if (language === 'rust') {
    return buildRustCodeDefinition(endpoint, input);
  }
  if (language === 'flutter' || language === 'dart') {
    return buildFlutterCodeDefinition(endpoint, input);
  }

  const lines = [
    '/**',
    ` * ${endpoint.description || endpoint.name}`,
  ];

  if (input.hasSdkParams) {
    lines.push(` * @param params - ${input.paramsType} path and query parameters.`);
    for (const parameter of input.operationParameters) {
      lines.push(` * @param params.${parameter.name} - ${parameter.desc || parameter.type}`);
    }
  }
  if (input.hasRequestBody) {
    lines.push(` * @param body - ${input.bodyType} ${formatRequestContentType(input.requestContentType)} request body.`);
    for (const parameter of input.bodyParameters) {
      lines.push(` * @param body.${parameter.name} - ${parameter.desc || parameter.type}`);
    }
  }

  lines.push(` * @returns ${input.responseType}`);
  lines.push(' */');
  lines.push(input.signature);
  return lines.join('\n');
}

function buildExampleUsage(
  endpoint: ApiReferenceEndpoint,
  sdkData: SdkEndpointData,
  language: string,
  input: SdkExampleUsageInput,
): string {
  const paramsExample = input.hasSdkParams
    ? buildSdkParamsExample(input.operationParameters)
    : undefined;
  const requestExample = input.hasRequestBody
    ? generateOpenApiSchemaExample(input.requestSchema, { spec: endpoint.openApiSpec }, 'body')
    : undefined;
  const responseExample = generateOpenApiSchemaExample(input.responseSchema, { spec: endpoint.openApiSpec }, 'response');
  if (language === 'python') {
    return buildPythonExampleUsage(sdkData, input, paramsExample, requestExample, responseExample);
  }
  if (language === 'go') {
    return buildGoExampleUsage(sdkData, input, paramsExample, requestExample, responseExample);
  }
  if (language === 'java') {
    return buildJavaExampleUsage(sdkData, input, paramsExample, requestExample, responseExample);
  }
  if (language === 'ruby') {
    return buildRubyExampleUsage(sdkData, input, paramsExample, requestExample, responseExample);
  }
  if (language === 'php') {
    return buildPhpExampleUsage(sdkData, input, paramsExample, requestExample, responseExample);
  }
  if (language === 'csharp') {
    return buildCsharpExampleUsage(sdkData, input, paramsExample, requestExample, responseExample);
  }
  if (language === 'rust') {
    return buildRustExampleUsage(sdkData, input, paramsExample, requestExample, responseExample);
  }
  if (language === 'flutter' || language === 'dart') {
    return buildFlutterExampleUsage(sdkData, input, paramsExample, requestExample, responseExample);
  }

  const methodCall = `client.${input.groupName}.${input.methodName}(${formatTsArguments(input, paramsExample, requestExample, 4)})`;
  const responseComment = formatCommentedJson(responseExample, 4, '// ');

  return `import { ${sdkData.name} } from '${sdkData.packageName}';

const client = new ${sdkData.name}({
  baseUrl: "${input.requestUrl.baseUrl || sdkData.baseUrl}",
  authToken: "YOUR_TOKEN",
});

async function main() {
  try {
    const response = await ${methodCall};
    console.log(response);
    // Example Response:
${responseComment}
  } catch (error) {
    throw error;
  }
}

main();`;
}

function schemaToSdkType(
  schema: OpenApiJsonSchema | undefined,
  endpoint: ApiReferenceEndpoint,
  fallback = 'Record<string, unknown>',
  language = 'typescript',
): string {
  if (!schema) {
    return fallback;
  }
  const schemaName = getOpenApiSchemaName(schema);
  if (schemaName && schemaName !== 'JsonObject') {
    return schemaName;
  }
  const typescriptType = schemaToTypescriptType(schema, { spec: endpoint.openApiSpec });
  if (typescriptType === 'Record<string, unknown>') {
    return fallbackObjectType(language);
  }
  if (language === 'typescript') {
    return typescriptType;
  }
  return translatePrimitiveType(typescriptType, language);
}

function formatRequestContentType(contentType?: string): string {
  if (!contentType) {
    return 'JSON';
  }
  if (contentType.toLowerCase().startsWith('application/json')) {
    return 'JSON';
  }
  return contentType;
}

function operationToSdkParameters(endpoint: ApiReferenceEndpoint): ApiParameter[] {
  const seen = new Set<string>();
  const parameters = [
    ...(endpoint.openApiPathItem?.parameters ?? []),
    ...(endpoint.openApiOperation?.parameters ?? []),
  ];

  return parameters.flatMap((parameter: OpenApiParameter) => {
    const name = parameter.name?.trim();
    const location = parameter.in?.trim();
    if (!name || !location || (location !== 'path' && location !== 'query')) {
      return [];
    }

    const key = `${location}:${name}`;
    if (seen.has(key)) {
      return [];
    }
    seen.add(key);

    return [{
      name,
      type: parameter.schema ? schemaToTypeLabel(parameter.schema, { spec: endpoint.openApiSpec }) : 'string',
      desc: parameter.description || `${location} parameter.`,
      required: parameter.required || location === 'path',
    }];
  });
}

function buildSdkParamsExample(parameters: ApiParameter[]): Record<string, unknown> {
  return Object.fromEntries(
    parameters.map((parameter) => [
      parameter.name,
      sdkParameterExample(parameter),
    ]),
  );
}

function sdkParameterExample(parameter: ApiParameter): unknown {
  const type = parameter.type.toLowerCase();
  if (type.includes('integer') || type.includes('number')) {
    return 0;
  }
  if (type.includes('boolean')) {
    return true;
  }
  if (type.startsWith('array<')) {
    return ['string'];
  }
  if (parameter.name.toLowerCase().includes('order')) {
    return 'asc';
  }
  return parameter.name.toLowerCase().includes('id')
    ? parameter.name
    : 'string';
}

function getSuccessResponseContent(endpoint: ApiReferenceEndpoint) {
  const response = endpoint.openApiOperation?.responses?.['200'] || endpoint.openApiOperation?.responses?.['201'];
  return response?.content;
}

function normalizeDocumentationLanguage(languageId: string): string {
  const language = languageId.toLowerCase();
  if (language === 'node' || language === 'javascript') {
    return 'typescript';
  }
  if (language === 'c#') {
    return 'csharp';
  }
  if (language === 'dart') {
    return 'flutter';
  }
  return language;
}

function buildSignature(
  language: string,
  input: {
    methodName: string;
    requestType: string;
    responseType: string;
    hasRequestBody: boolean;
    hasSdkParams: boolean;
    paramsRequired: boolean;
    paramsType: string;
    bodyType: string;
  },
): string {
  const sdkParams = buildSignatureParameters(language, input);
  if (language === 'python') {
    return `def ${input.methodName}(${sdkParams.join(', ')}) -> ${input.responseType}`;
  }
  if (language === 'go') {
    return `func (c *Client) ${input.methodName}(ctx context.Context${sdkParams.length > 0 ? `, ${sdkParams.join(', ')}` : ''}) (${input.responseType}, error)`;
  }
  if (language === 'java') {
    return `public ${input.responseType} ${input.methodName}(${sdkParams.join(', ')})`;
  }
  if (language === 'ruby') {
    return sdkParams.length > 0 ? `def ${input.methodName}(${sdkParams.join(', ')})` : `def ${input.methodName}`;
  }
  if (language === 'php') {
    const responseType = input.responseType === 'void' ? 'void' : input.responseType;
    return `public function ${input.methodName}(${sdkParams.join(', ')}): ${responseType}`;
  }
  if (language === 'csharp') {
    return `Task<${input.responseType}> ${input.methodName}Async(${sdkParams.join(', ')})`;
  }
  if (language === 'rust') {
    return `pub async fn ${input.methodName}(&self${sdkParams.length > 0 ? `, ${sdkParams.join(', ')}` : ''}) -> Result<${input.responseType}, Error>`;
  }
  if (language === 'flutter' || language === 'dart') {
    return `Future<${input.responseType}> ${input.methodName}(${sdkParams.join(', ')})`;
  }
  return `async ${input.methodName}(${sdkParams.join(', ')}): Promise<${input.responseType}>`;
}

function buildSignatureParameters(
  language: string,
  input: {
    hasRequestBody: boolean;
    hasSdkParams: boolean;
    paramsRequired: boolean;
    paramsType: string;
    bodyType: string;
  },
): string[] {
  const parameters: string[] = [];
  if (input.hasSdkParams) {
    if (language === 'python') {
      parameters.push(input.paramsRequired ? `params: ${input.paramsType}` : `params: ${input.paramsType} | None = None`);
    } else if (language === 'go') {
      parameters.push(`params ${input.paramsType}`);
    } else if (language === 'java') {
      parameters.push(`${input.paramsType} params`);
    } else if (language === 'ruby') {
      parameters.push(input.paramsRequired ? 'params' : 'params = {}');
    } else if (language === 'php') {
      parameters.push(input.paramsRequired ? 'array $requestParams' : 'array $requestParams = []');
    } else if (language === 'csharp') {
      parameters.push(input.paramsRequired ? `${input.paramsType} requestParams` : `${input.paramsType}? requestParams = null`);
    } else if (language === 'rust') {
      parameters.push(input.paramsRequired ? `params: ${input.paramsType}` : `params: Option<${input.paramsType}>`);
    } else if (language === 'flutter' || language === 'dart') {
      parameters.push(input.paramsRequired ? `${input.paramsType} params` : `${input.paramsType}? params`);
    } else {
      parameters.push(input.paramsRequired ? `params: ${input.paramsType}` : `params?: ${input.paramsType}`);
    }
  }
  if (input.hasRequestBody) {
    if (language === 'python') {
      parameters.push(`body: ${input.bodyType}`);
    } else if (language === 'go') {
      parameters.push(`body ${input.bodyType}`);
    } else if (language === 'java') {
      parameters.push(`${input.bodyType} body`);
    } else if (language === 'ruby') {
      parameters.push('body');
    } else if (language === 'php') {
      parameters.push('array $body');
    } else if (language === 'csharp') {
      parameters.push(`${input.bodyType} body`);
    } else if (language === 'rust') {
      parameters.push(`body: ${input.bodyType}`);
    } else if (language === 'flutter' || language === 'dart') {
      parameters.push(`${input.bodyType} body`);
    } else {
      parameters.push(`body: ${input.bodyType}`);
    }
  }
  return parameters;
}

function toSdkMethodName(endpoint: ApiReferenceEndpoint, language: string): string {
  const baseName = endpoint.openApiOperation?.operationId || `${endpoint.method.toLowerCase()}${endpoint.path
    .replace(/[^a-zA-Z0-9]+(.)/g, upperPathSegment)
    .replace(/[^a-zA-Z0-9]/g, '')}`;
  const words = splitIdentifier(baseName);
  if (language === 'python' || language === 'ruby' || language === 'rust') {
    return toSnakeCase(words);
  }
  if (language === 'go' || language === 'csharp') {
    return toPascalCase(words);
  }
  return toLowerCamel(words);
}

function toSdkGroupName(tag: string | undefined, language: string): string {
  const firstSegment = (tag || 'default').split('/')[0] || 'default';
  const words = splitIdentifier(firstSegment);
  if (words.length === 0) {
    return language === 'go' || language === 'csharp' ? 'Default' : 'default';
  }
  if (language === 'python' || language === 'ruby' || language === 'rust') {
    return toSnakeCase(words);
  }
  if (language === 'go' || language === 'csharp') {
    return toPascalCase(words);
  }
  return toLowerCamel(words);
}

function upperPathSegment(_match: string, chr: string): string {
  return chr.toUpperCase();
}

function splitIdentifier(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function toLowerCamel(words: string[]): string {
  if (words.length === 0) {
    return 'default';
  }
  const [first, ...rest] = words;
  return [first, ...rest.map(capitalize)].join('');
}

function toPascalCase(words: string[]): string {
  return words.length > 0 ? words.map(capitalize).join('') : 'Default';
}

function toSnakeCase(words: string[]): string {
  return words.length > 0 ? words.join('_') : 'default';
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function fallbackObjectType(language: string): string {
  if (language === 'python') return 'dict[str, object]';
  if (language === 'go') return 'map[string]any';
  if (language === 'java') return 'Map<String, Object>';
  if (language === 'ruby') return 'Hash';
  if (language === 'php') return 'array';
  if (language === 'csharp') return 'Dictionary<string, object?>';
  if (language === 'rust') return 'serde_json::Value';
  if (language === 'flutter' || language === 'dart') return 'Map<String, dynamic>';
  return 'Record<string, unknown>';
}

function fallbackVoidType(language: string): string {
  if (language === 'python') return 'None';
  if (language === 'go') return 'struct{}';
  if (language === 'java') return 'Void';
  if (language === 'ruby') return 'nil';
  if (language === 'php') return 'void';
  if (language === 'csharp') return 'Void';
  if (language === 'rust') return '()';
  if (language === 'flutter' || language === 'dart') return 'void';
  return 'void';
}

function translatePrimitiveType(type: string, language: string): string {
  if (type === 'string') {
    if (language === 'go') return 'string';
    if (language === 'java' || language === 'csharp') return 'String';
    if (language === 'rust') return 'String';
    return language === 'typescript' ? 'string' : 'str';
  }
  if (type === 'number') {
    if (language === 'python') return 'float';
    if (language === 'go' || language === 'java' || language === 'csharp') return 'double';
    if (language === 'rust') return 'f64';
    if (language === 'flutter' || language === 'dart') return 'num';
    return type;
  }
  if (type === 'boolean') {
    if (language === 'python') return 'bool';
    if (language === 'java') return 'Boolean';
    if (language === 'csharp') return 'bool';
    if (language === 'rust') return 'bool';
    return language === 'typescript' ? 'boolean' : 'bool';
  }
  return type;
}

function buildPythonCodeDefinition(
  endpoint: ApiReferenceEndpoint,
  input: SdkCodeDefinitionInput,
): string {
  const lines = [
    `${input.signature}:`,
    '    """',
    `    ${endpoint.description || endpoint.name}`,
  ];
  if (input.hasSdkParams || input.hasRequestBody) {
    lines.push('', '    Args:');
  }
  if (input.hasSdkParams) {
    lines.push(`        params: ${input.paramsType} path and query parameters.`);
    for (const parameter of input.operationParameters) {
      lines.push(`        params.${parameter.name}: ${parameter.desc || parameter.type}`);
    }
  }
  if (input.hasRequestBody) {
    lines.push(`        body: ${input.bodyType} ${formatRequestContentType(input.requestContentType)} request body.`);
    for (const parameter of input.bodyParameters) {
      lines.push(`        body.${parameter.name}: ${parameter.desc || parameter.type}`);
    }
  }
  lines.push('', '    Returns:', `        ${input.responseType}`, '    """');
  return lines.join('\n');
}

function buildGoCodeDefinition(
  endpoint: ApiReferenceEndpoint,
  input: SdkCodeDefinitionInput,
): string {
  const lines = [`// ${input.methodName} ${endpoint.description || endpoint.name}.`];
  if (input.hasSdkParams) {
    lines.push(`// params is a ${input.paramsType} value containing path and query parameters.`);
    for (const parameter of input.operationParameters) {
      lines.push(`// params.${parameter.name}: ${parameter.desc || parameter.type}`);
    }
  }
  if (input.hasRequestBody) {
    lines.push(`// body is a ${input.bodyType} ${formatRequestContentType(input.requestContentType)} request body.`);
    for (const parameter of input.bodyParameters) {
      lines.push(`// body.${parameter.name}: ${parameter.desc || parameter.type}`);
    }
  }
  lines.push(`// It returns ${input.responseType}.`, input.signature);
  return lines.join('\n');
}

function buildJavaCodeDefinition(
  endpoint: ApiReferenceEndpoint,
  input: SdkCodeDefinitionInput,
): string {
  const lines = ['/**', ` * ${endpoint.description || endpoint.name}`];
  if (input.hasSdkParams) {
    lines.push(` * @param params ${input.paramsType} path and query parameters.`);
    for (const parameter of input.operationParameters) {
      lines.push(` * @param params.${parameter.name} ${parameter.desc || parameter.type}`);
    }
  }
  if (input.hasRequestBody) {
    lines.push(` * @param body ${input.bodyType} ${formatRequestContentType(input.requestContentType)} request body.`);
    for (const parameter of input.bodyParameters) {
      lines.push(` * @param body.${parameter.name} ${parameter.desc || parameter.type}`);
    }
  }
  lines.push(` * @return ${input.responseType}`, ' */', `${input.signature};`);
  return lines.join('\n');
}

function buildRubyCodeDefinition(
  endpoint: ApiReferenceEndpoint,
  input: SdkCodeDefinitionInput,
): string {
  const lines = [`# ${endpoint.description || endpoint.name}`];
  if (input.hasSdkParams) {
    lines.push(`# @param params [${input.paramsType}] path and query parameters.`);
    for (const parameter of input.operationParameters) {
      lines.push(`# @param params.${parameter.name} [${parameter.type}] ${parameter.desc || parameter.type}`);
    }
  }
  if (input.hasRequestBody) {
    lines.push(`# @param body [${input.bodyType}] ${formatRequestContentType(input.requestContentType)} request body.`);
    for (const parameter of input.bodyParameters) {
      lines.push(`# @param body.${parameter.name} [${parameter.type}] ${parameter.desc || parameter.type}`);
    }
  }
  lines.push(`# @return [${input.responseType}]`, input.signature);
  return lines.join('\n');
}

function buildPhpCodeDefinition(
  endpoint: ApiReferenceEndpoint,
  input: SdkCodeDefinitionInput,
): string {
  const lines = ['/**', ` * ${endpoint.description || endpoint.name}`];
  if (input.hasSdkParams) {
    lines.push(` * @param array $requestParams ${input.paramsType} path and query parameters.`);
    for (const parameter of input.operationParameters) {
      lines.push(` * @param mixed $requestParams['${parameter.name}'] ${parameter.desc || parameter.type}`);
    }
  }
  if (input.hasRequestBody) {
    lines.push(` * @param array $body ${input.bodyType} ${formatRequestContentType(input.requestContentType)} request body.`);
    for (const parameter of input.bodyParameters) {
      lines.push(` * @param mixed $body['${parameter.name}'] ${parameter.desc || parameter.type}`);
    }
  }
  lines.push(` * @return ${input.responseType}`, ' */', `${input.signature};`);
  return lines.join('\n');
}

function buildCsharpCodeDefinition(
  endpoint: ApiReferenceEndpoint,
  input: SdkCodeDefinitionInput,
): string {
  const lines = [
    '/// <summary>',
    `/// ${endpoint.description || endpoint.name}`,
    '/// </summary>',
  ];
  if (input.hasSdkParams) {
    lines.push(`/// <param name="requestParams">${input.paramsType} path and query parameters.</param>`);
    for (const parameter of input.operationParameters) {
      lines.push(`/// <param name="requestParams.${parameter.name}">${parameter.desc || parameter.type}</param>`);
    }
  }
  if (input.hasRequestBody) {
    lines.push(`/// <param name="body">${input.bodyType} ${formatRequestContentType(input.requestContentType)} request body.</param>`);
    for (const parameter of input.bodyParameters) {
      lines.push(`/// <param name="body.${parameter.name}">${parameter.desc || parameter.type}</param>`);
    }
  }
  lines.push(`/// <returns>${input.responseType}</returns>`, input.signature);
  return lines.join('\n');
}

function buildRustCodeDefinition(
  endpoint: ApiReferenceEndpoint,
  input: SdkCodeDefinitionInput,
): string {
  const lines = [`/// ${endpoint.description || endpoint.name}`];
  if (input.hasSdkParams) {
    lines.push(`/// params: ${input.paramsType} path and query parameters.`);
    for (const parameter of input.operationParameters) {
      lines.push(`/// params.${parameter.name}: ${parameter.desc || parameter.type}`);
    }
  }
  if (input.hasRequestBody) {
    lines.push(`/// body: ${input.bodyType} ${formatRequestContentType(input.requestContentType)} request body.`);
    for (const parameter of input.bodyParameters) {
      lines.push(`/// body.${parameter.name}: ${parameter.desc || parameter.type}`);
    }
  }
  lines.push(`/// Returns ${input.responseType}.`, input.signature);
  return lines.join('\n');
}

function buildFlutterCodeDefinition(
  endpoint: ApiReferenceEndpoint,
  input: SdkCodeDefinitionInput,
): string {
  const lines = [`/// ${endpoint.description || endpoint.name}`];
  if (input.hasSdkParams) {
    lines.push(`/// [params] is a ${input.paramsType} value containing path and query parameters.`);
    for (const parameter of input.operationParameters) {
      lines.push(`/// params.${parameter.name}: ${parameter.desc || parameter.type}`);
    }
  }
  if (input.hasRequestBody) {
    lines.push(`/// [body] is a ${input.bodyType} ${formatRequestContentType(input.requestContentType)} request body.`);
    for (const parameter of input.bodyParameters) {
      lines.push(`/// body.${parameter.name}: ${parameter.desc || parameter.type}`);
    }
  }
  lines.push(`/// Returns ${input.responseType}.`, `${input.signature};`);
  return lines.join('\n');
}

function buildPythonExampleUsage(
  sdkData: SdkEndpointData,
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  responseExample: unknown,
): string {
  const packageName = toPythonPackageName(sdkData.packageName);
  const methodCall = `client.${input.groupName}.${input.methodName}(${formatPythonArguments(input, paramsExample, requestExample, 4)})`;
  const responseComment = formatCommentedJson(responseExample, 4, '# ');
  return `from ${packageName} import ${sdkData.name}

client = ${sdkData.name}(
    base_url="${input.requestUrl.baseUrl || sdkData.baseUrl}",
    auth_token="YOUR_TOKEN",
)

response = ${methodCall}
print(response)
# Example Response:
${responseComment}`;
}

function buildGoExampleUsage(
  sdkData: SdkEndpointData,
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  responseExample: unknown,
): string {
  const paramsValue = formatJsonValue(paramsExample, 2);
  const requestValue = formatJsonValue(requestExample, 2);
  const responseComment = formatCommentedJson(responseExample, 2, '// ');
  const methodCall = `client.${input.groupName}.${input.methodName}(context.Background()${formatNamedCallArguments(input, 'params', 'body', ', ', ', ')})`;
  const paramsBlock = input.hasSdkParams ? `params := ${paramsValue}\n  ` : '';
  const bodyBlock = input.hasRequestBody ? `body := ${requestValue}\n` : '';
  return `package main

import (
  "context"
  "fmt"
)

func main() {
  client := ${sdkData.name}.New("${input.requestUrl.baseUrl || sdkData.baseUrl}", "YOUR_TOKEN")
  ${paramsBlock}${bodyBlock}response, err := ${methodCall}
  if err != nil {
    panic(err)
  }
  fmt.Println(response)
  // Example Response:
${responseComment}
}`;
}

function buildJavaExampleUsage(
  sdkData: SdkEndpointData,
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  responseExample: unknown,
): string {
  const methodCall = `client.${input.groupName}().${input.methodName}(${formatNamedCallArguments(input, 'params', 'body', ', ')})`;
  const paramsBlock = input.hasSdkParams ? `Object params = ${formatJsonValue(paramsExample, 4)};\n    ` : '';
  const bodyBlock = input.hasRequestBody ? `Object body = ${formatJsonValue(requestExample, 4)};\n    ` : '';
  const responseComment = formatCommentedJson(responseExample, 4, '// ');
  return `import ${sdkData.packageName}.${sdkData.name};

public class Main {
  public static void main(String[] args) {
    ${sdkData.name} client = ${sdkData.name}.builder()
        .baseUrl("${input.requestUrl.baseUrl || sdkData.baseUrl}")
        .authToken("YOUR_TOKEN")
        .build();
    ${paramsBlock}${bodyBlock}Object response = ${methodCall};
    System.out.println(response);
    // Example Response:
${responseComment}
  }
}`;
}

function buildRubyExampleUsage(
  sdkData: SdkEndpointData,
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  responseExample: unknown,
): string {
  const args = formatRubyArguments(input, paramsExample, requestExample, 2);
  const methodCall = args
    ? `client.${input.groupName}.${input.methodName}(${args})`
    : `client.${input.groupName}.${input.methodName}`;
  const responseComment = formatCommentedJson(responseExample, 0, '# ');
  return `require '${sdkData.packageName.replace(/-/g, '_')}'

client = ${sdkData.name}.new(
  base_url: '${input.requestUrl.baseUrl || sdkData.baseUrl}',
  auth_token: 'YOUR_TOKEN'
)

response = ${methodCall}
puts response
# Example Response:
${responseComment}`;
}

function buildPhpExampleUsage(
  sdkData: SdkEndpointData,
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  responseExample: unknown,
): string {
  const methodCall = `$client->${input.groupName}()->${input.methodName}(${formatPhpArguments(input, paramsExample, requestExample, 2)})`;
  const responseComment = formatCommentedJson(responseExample, 0, '// ');
  return `<?php
require_once 'vendor/autoload.php';

$client = new ${sdkData.name}([
  'base_url' => '${input.requestUrl.baseUrl || sdkData.baseUrl}',
  'auth_token' => 'YOUR_TOKEN',
]);

$response = ${methodCall};
print_r($response);
// Example Response:
${responseComment}`;
}

function buildCsharpExampleUsage(
  sdkData: SdkEndpointData,
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  responseExample: unknown,
): string {
  const methodCall = `client.${input.groupName}.${input.methodName}Async(${formatNamedCallArguments(input, 'requestParams', 'body', ', ')})`;
  const paramsBlock = input.hasSdkParams ? `var requestParams = ${formatJsonValue(paramsExample, 2)};\n` : '';
  const bodyBlock = input.hasRequestBody ? `var body = ${formatJsonValue(requestExample, 2)};\n` : '';
  const responseComment = formatCommentedJson(responseExample, 0, '// ');
  return `using ${sdkData.packageName};

var client = new ${sdkData.name}("${input.requestUrl.baseUrl || sdkData.baseUrl}", "YOUR_TOKEN");
${paramsBlock}${bodyBlock}var response = await ${methodCall};
Console.WriteLine(response);
// Example Response:
${responseComment}`;
}

function buildRustExampleUsage(
  sdkData: SdkEndpointData,
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  responseExample: unknown,
): string {
  const methodCall = `client.${input.groupName}().${input.methodName}(${formatNamedCallArguments(input, 'params', 'body', ', ')}).await?`;
  const paramsBlock = input.hasSdkParams ? `let params = serde_json::json!(${formatJsonValue(paramsExample, 2)});\n  ` : '';
  const bodyBlock = input.hasRequestBody ? `let body = serde_json::json!(${formatJsonValue(requestExample, 2)});\n` : '';
  const responseComment = formatCommentedJson(responseExample, 0, '// ');
  return `use ${sdkData.packageName.replace(/-/g, '_')}::${sdkData.name};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let client = ${sdkData.name}::new("${input.requestUrl.baseUrl || sdkData.baseUrl}", "YOUR_TOKEN");
  ${paramsBlock}${bodyBlock}let response = ${methodCall};
  println!("{:?}", response);
  // Example Response:
${responseComment}
  Ok(())
}`;
}

function buildFlutterExampleUsage(
  sdkData: SdkEndpointData,
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  responseExample: unknown,
): string {
  const methodCall = `client.${input.groupName}.${input.methodName}(${formatFlutterArguments(input, paramsExample, requestExample, 2)})`;
  const responseComment = formatCommentedJson(responseExample, 0, '// ');
  return `import 'package:${sdkData.packageName}/${sdkData.packageName}.dart';

void main() async {
  final client = ${sdkData.name}(
    baseUrl: '${input.requestUrl.baseUrl || sdkData.baseUrl}',
    authToken: 'YOUR_TOKEN',
  );

  final response = await ${methodCall};
  print(response);
  // Example Response:
${responseComment}
}`;
}

function formatTsValue(value: unknown, indent = 2): string {
  const json = JSON.stringify(value ?? {}, null, 2);
  const unquotedPropertyJson = json.replace(/^(\s*)"([^"]+)":/gm, '$1$2:');
  if (indent <= 2) {
    return unquotedPropertyJson;
  }
  return unquotedPropertyJson
    .split('\n')
    .map((line, index) => (index === 0 ? line : `${' '.repeat(indent - 2)}${line}`))
    .join('\n');
}

function formatTsArguments(
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  indent = 2,
): string {
  return [
    input.hasSdkParams ? formatTsValue(paramsExample, indent) : undefined,
    input.hasRequestBody ? formatTsValue(requestExample, indent) : undefined,
  ].filter((value): value is string => Boolean(value)).join(', ');
}

function formatPythonArguments(
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  indent = 2,
): string {
  return [
    input.hasSdkParams ? formatPythonValue(paramsExample, indent) : undefined,
    input.hasRequestBody ? formatPythonValue(requestExample, indent) : undefined,
  ].filter((value): value is string => Boolean(value)).join(', ');
}

function formatRubyArguments(
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  indent = 2,
): string {
  return [
    input.hasSdkParams ? formatRubyValue(paramsExample, indent) : undefined,
    input.hasRequestBody ? formatRubyValue(requestExample, indent) : undefined,
  ].filter((value): value is string => Boolean(value)).join(', ');
}

function formatPhpArguments(
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  indent = 2,
): string {
  return [
    input.hasSdkParams ? formatPhpValue(paramsExample, indent) : undefined,
    input.hasRequestBody ? formatPhpValue(requestExample, indent) : undefined,
  ].filter((value): value is string => Boolean(value)).join(', ');
}

function formatFlutterArguments(
  input: SdkExampleUsageInput,
  paramsExample: unknown,
  requestExample: unknown,
  indent = 2,
): string {
  return [
    input.hasSdkParams ? formatJsonValue(paramsExample, indent) : undefined,
    input.hasRequestBody ? formatJsonValue(requestExample, indent) : undefined,
  ].filter((value): value is string => Boolean(value)).join(', ');
}

function formatNamedCallArguments(
  input: SdkExampleUsageInput,
  paramsName: string,
  bodyName: string,
  separator: string,
  prefix = '',
): string {
  const args = [
    input.hasSdkParams ? paramsName : undefined,
    input.hasRequestBody ? bodyName : undefined,
  ].filter((value): value is string => Boolean(value));
  return args.length > 0 ? `${prefix}${args.join(separator)}` : '';
}

function formatPythonValue(value: unknown, indent = 2): string {
  return formatJsonValue(value, indent)
    .replace(/\btrue\b/g, 'True')
    .replace(/\bfalse\b/g, 'False')
    .replace(/\bnull\b/g, 'None');
}

function formatRubyValue(value: unknown, indent = 2): string {
  return formatJsonValue(value, indent)
    .replace(/\btrue\b/g, 'true')
    .replace(/\bfalse\b/g, 'false')
    .replace(/\bnull\b/g, 'nil');
}

function formatPhpValue(value: unknown, indent = 2): string {
  return formatJsonValue(value, indent);
}

function formatJsonValue(value: unknown, indent = 2): string {
  return JSON.stringify(value ?? {}, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `${' '.repeat(indent)}${line}`))
    .join('\n');
}

function formatCommentedJson(value: unknown, indent = 4, prefix = '// '): string {
  return JSON.stringify(value ?? null, null, 2)
    .split('\n')
    .map((line) => `${' '.repeat(indent)}${prefix}${line}`)
    .join('\n');
}

function toPythonPackageName(packageName: string): string {
  return packageName
    .replace(/^@/, '')
    .replace(/\//g, '_')
    .replace(/-/g, '_');
}
