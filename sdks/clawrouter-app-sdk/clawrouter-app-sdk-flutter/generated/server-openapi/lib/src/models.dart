Map<String, dynamic>? _sdkworkAsMap(dynamic value) {
  if (value is Map<String, dynamic>) {
    return value;
  }
  if (value is Map) {
    return value.map((key, item) => MapEntry(key.toString(), item));
  }
  return null;
}

List<dynamic>? _sdkworkAsList(dynamic value) {
  return value is List ? value : null;
}

class AgentCapabilities {
  final String mcpServerCount;
  final bool memoryEnabled;
  final String skillBindingCount;

  AgentCapabilities({
    required this.mcpServerCount,
    required this.memoryEnabled,
    required this.skillBindingCount
  });

  factory AgentCapabilities.fromJson(Map<String, dynamic> json) {
    return AgentCapabilities(
      mcpServerCount: (() {
        final value = json['mcpServerCount']?.toString();
        if (value == null) {
          throw FormatException('AgentCapabilities.mcpServerCount is required');
        }
        return value;
      })(),
      memoryEnabled: (() {
        final value = json['memoryEnabled'];
        if (value is! bool) {
          throw FormatException('AgentCapabilities.memoryEnabled is required');
        }
        return value;
      })(),
      skillBindingCount: (() {
        final value = json['skillBindingCount']?.toString();
        if (value == null) {
          throw FormatException('AgentCapabilities.skillBindingCount is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'mcpServerCount': mcpServerCount,
      'memoryEnabled': memoryEnabled,
      'skillBindingCount': skillBindingCount,
    };
  }
}

class AgentCreateRequest {
  final String? code;
  final String? description;
  final Map<String, dynamic>? mcpPolicy;
  final Map<String, dynamic>? memoryPolicy;
  final String? model;
  final String name;
  final Map<String, dynamic>? runtimePolicy;
  final Map<String, dynamic>? skillPolicy;
  final String? systemPrompt;
  final Map<String, dynamic>? toolPolicy;

  AgentCreateRequest({
    this.code,
    this.description,
    this.mcpPolicy,
    this.memoryPolicy,
    this.model,
    required this.name,
    this.runtimePolicy,
    this.skillPolicy,
    this.systemPrompt,
    this.toolPolicy
  });

  factory AgentCreateRequest.fromJson(Map<String, dynamic> json) {
    return AgentCreateRequest(
      code: json['code']?.toString(),
      description: json['description']?.toString(),
      mcpPolicy: (() {
        final map = _sdkworkAsMap(json['mcpPolicy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      memoryPolicy: (() {
        final map = _sdkworkAsMap(json['memoryPolicy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      model: json['model']?.toString(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('AgentCreateRequest.name is required');
        }
        return value;
      })(),
      runtimePolicy: (() {
        final map = _sdkworkAsMap(json['runtimePolicy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      skillPolicy: (() {
        final map = _sdkworkAsMap(json['skillPolicy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      systemPrompt: json['systemPrompt']?.toString(),
      toolPolicy: (() {
        final map = _sdkworkAsMap(json['toolPolicy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'description': description,
      'mcpPolicy': mcpPolicy?.map((key, item) => MapEntry(key, item)),
      'memoryPolicy': memoryPolicy?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'name': name,
      'runtimePolicy': runtimePolicy?.map((key, item) => MapEntry(key, item)),
      'skillPolicy': skillPolicy?.map((key, item) => MapEntry(key, item)),
      'systemPrompt': systemPrompt,
      'toolPolicy': toolPolicy?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class AgentDefinitionsCreateResult {
  final String code;
  final AgentItemResponse? data;
  final String? msg;

  AgentDefinitionsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentDefinitionsCreateResult.fromJson(Map<String, dynamic> json) {
    return AgentDefinitionsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentDefinitionsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentItemResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentDefinitionsListResult {
  final String code;
  final AgentListResponse? data;
  final String? msg;

  AgentDefinitionsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentDefinitionsListResult.fromJson(Map<String, dynamic> json) {
    return AgentDefinitionsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentDefinitionsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentDefinitionsRetrieveResult {
  final String code;
  final AgentItem? data;
  final String? msg;

  AgentDefinitionsRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentDefinitionsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AgentDefinitionsRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentDefinitionsRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentItem {
  final MediaResource? avatar;
  final AgentCapabilities capabilities;
  final String code;
  final String createdAt;
  final AgentVersionItem defaultVersion;
  final String description;
  final String id;
  final String name;
  final String ownerUserId;
  final String status;
  final String? templateSource;
  final String updatedAt;
  final String visibility;

  AgentItem({
    this.avatar,
    required this.capabilities,
    required this.code,
    required this.createdAt,
    required this.defaultVersion,
    required this.description,
    required this.id,
    required this.name,
    required this.ownerUserId,
    required this.status,
    this.templateSource,
    required this.updatedAt,
    required this.visibility
  });

  factory AgentItem.fromJson(Map<String, dynamic> json) {
    return AgentItem(
      avatar: (() {
        final map = _sdkworkAsMap(json['avatar']);
        return map == null ? null : MediaResource.fromJson(map);
      })(),
      capabilities: (() {
        final map = _sdkworkAsMap(json['capabilities']);
        if (map == null) {
          throw FormatException('AgentItem.capabilities is required');
        }
        return AgentCapabilities.fromJson(map);
      })(),
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentItem.code is required');
        }
        return value;
      })(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('AgentItem.createdAt is required');
        }
        return value;
      })(),
      defaultVersion: (() {
        final map = _sdkworkAsMap(json['defaultVersion']);
        if (map == null) {
          throw FormatException('AgentItem.defaultVersion is required');
        }
        return AgentVersionItem.fromJson(map);
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('AgentItem.description is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AgentItem.id is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('AgentItem.name is required');
        }
        return value;
      })(),
      ownerUserId: (() {
        final value = json['ownerUserId']?.toString();
        if (value == null) {
          throw FormatException('AgentItem.ownerUserId is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('AgentItem.status is required');
        }
        return value;
      })(),
      templateSource: json['templateSource']?.toString(),
      updatedAt: (() {
        final value = json['updatedAt']?.toString();
        if (value == null) {
          throw FormatException('AgentItem.updatedAt is required');
        }
        return value;
      })(),
      visibility: (() {
        final value = json['visibility']?.toString();
        if (value == null) {
          throw FormatException('AgentItem.visibility is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'avatar': avatar?.toJson(),
      'capabilities': capabilities.toJson(),
      'code': code,
      'createdAt': createdAt,
      'defaultVersion': defaultVersion.toJson(),
      'description': description,
      'id': id,
      'name': name,
      'ownerUserId': ownerUserId,
      'status': status,
      'templateSource': templateSource,
      'updatedAt': updatedAt,
      'visibility': visibility,
    };
  }
}

class AgentItemResponse {
  final AgentItem item;

  AgentItemResponse({
    required this.item
  });

  factory AgentItemResponse.fromJson(Map<String, dynamic> json) {
    return AgentItemResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('AgentItemResponse.item is required');
        }
        return AgentItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class AgentListResponse {
  final List<AgentItem> items;

  AgentListResponse({
    required this.items
  });

  factory AgentListResponse.fromJson(Map<String, dynamic> json) {
    return AgentListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('AgentListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AgentItem.fromJson(map);
      })())
            .whereType<AgentItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class AgentRunCompleteRequest {
  final String? errorMessageMasked;
  final Map<String, dynamic>? metadata;
  final String? outputMessage;
  final String? status;
  final UsageSnapshot? usageJson;

  AgentRunCompleteRequest({
    this.errorMessageMasked,
    this.metadata,
    this.outputMessage,
    this.status,
    this.usageJson
  });

  factory AgentRunCompleteRequest.fromJson(Map<String, dynamic> json) {
    return AgentRunCompleteRequest(
      errorMessageMasked: json['errorMessageMasked']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      outputMessage: json['outputMessage']?.toString(),
      status: json['status']?.toString(),
      usageJson: (() {
        final map = _sdkworkAsMap(json['usageJson']);
        return map == null ? null : UsageSnapshot.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'errorMessageMasked': errorMessageMasked,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'outputMessage': outputMessage,
      'status': status,
      'usageJson': usageJson?.toJson(),
    };
  }
}

class AgentRunCreateRequest {
  final String agentId;
  final String agentVersionId;
  final String? executionMode;
  final String? inputMessage;
  final String? memorySpaceId;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? runtime;
  final String? sourceSurface;
  final String? traceId;

  AgentRunCreateRequest({
    required this.agentId,
    required this.agentVersionId,
    this.executionMode,
    this.inputMessage,
    this.memorySpaceId,
    this.metadata,
    this.model,
    this.runtime,
    this.sourceSurface,
    this.traceId
  });

  factory AgentRunCreateRequest.fromJson(Map<String, dynamic> json) {
    return AgentRunCreateRequest(
      agentId: (() {
        final value = json['agentId']?.toString();
        if (value == null) {
          throw FormatException('AgentRunCreateRequest.agentId is required');
        }
        return value;
      })(),
      agentVersionId: (() {
        final value = json['agentVersionId']?.toString();
        if (value == null) {
          throw FormatException('AgentRunCreateRequest.agentVersionId is required');
        }
        return value;
      })(),
      executionMode: json['executionMode']?.toString(),
      inputMessage: json['inputMessage']?.toString(),
      memorySpaceId: json['memorySpaceId']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      model: json['model']?.toString(),
      runtime: json['runtime']?.toString(),
      sourceSurface: json['sourceSurface']?.toString(),
      traceId: json['traceId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'agentId': agentId,
      'agentVersionId': agentVersionId,
      'executionMode': executionMode,
      'inputMessage': inputMessage,
      'memorySpaceId': memorySpaceId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'runtime': runtime,
      'sourceSurface': sourceSurface,
      'traceId': traceId,
    };
  }
}

class AgentRunItem {
  final String agentId;
  final String agentVersionId;
  final String? cachedTokens;
  final String? completedAt;
  final String createdAt;
  final String? errorMessageMasked;
  final String executionMode;
  final String id;
  final String? inputMessage;
  final String? inputTokens;
  final String? memorySpaceId;
  final String? model;
  final String? outputMessage;
  final String? outputTokens;
  final String requestId;
  final String? runtime;
  final String? sessionId;
  final String sourceSurface;
  final String? startedAt;
  final String status;
  final String totalSteps;
  final String? totalTokens;
  final String? traceId;

  AgentRunItem({
    required this.agentId,
    required this.agentVersionId,
    this.cachedTokens,
    this.completedAt,
    required this.createdAt,
    this.errorMessageMasked,
    required this.executionMode,
    required this.id,
    this.inputMessage,
    this.inputTokens,
    this.memorySpaceId,
    this.model,
    this.outputMessage,
    this.outputTokens,
    required this.requestId,
    this.runtime,
    this.sessionId,
    required this.sourceSurface,
    this.startedAt,
    required this.status,
    required this.totalSteps,
    this.totalTokens,
    this.traceId
  });

  factory AgentRunItem.fromJson(Map<String, dynamic> json) {
    return AgentRunItem(
      agentId: (() {
        final value = json['agentId']?.toString();
        if (value == null) {
          throw FormatException('AgentRunItem.agentId is required');
        }
        return value;
      })(),
      agentVersionId: (() {
        final value = json['agentVersionId']?.toString();
        if (value == null) {
          throw FormatException('AgentRunItem.agentVersionId is required');
        }
        return value;
      })(),
      cachedTokens: json['cachedTokens']?.toString(),
      completedAt: json['completedAt']?.toString(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('AgentRunItem.createdAt is required');
        }
        return value;
      })(),
      errorMessageMasked: json['errorMessageMasked']?.toString(),
      executionMode: (() {
        final value = json['executionMode']?.toString();
        if (value == null) {
          throw FormatException('AgentRunItem.executionMode is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AgentRunItem.id is required');
        }
        return value;
      })(),
      inputMessage: json['inputMessage']?.toString(),
      inputTokens: json['inputTokens']?.toString(),
      memorySpaceId: json['memorySpaceId']?.toString(),
      model: json['model']?.toString(),
      outputMessage: json['outputMessage']?.toString(),
      outputTokens: json['outputTokens']?.toString(),
      requestId: (() {
        final value = json['requestId']?.toString();
        if (value == null) {
          throw FormatException('AgentRunItem.requestId is required');
        }
        return value;
      })(),
      runtime: json['runtime']?.toString(),
      sessionId: json['sessionId']?.toString(),
      sourceSurface: (() {
        final value = json['sourceSurface']?.toString();
        if (value == null) {
          throw FormatException('AgentRunItem.sourceSurface is required');
        }
        return value;
      })(),
      startedAt: json['startedAt']?.toString(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('AgentRunItem.status is required');
        }
        return value;
      })(),
      totalSteps: (() {
        final value = json['totalSteps']?.toString();
        if (value == null) {
          throw FormatException('AgentRunItem.totalSteps is required');
        }
        return value;
      })(),
      totalTokens: json['totalTokens']?.toString(),
      traceId: json['traceId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'agentId': agentId,
      'agentVersionId': agentVersionId,
      'cachedTokens': cachedTokens,
      'completedAt': completedAt,
      'createdAt': createdAt,
      'errorMessageMasked': errorMessageMasked,
      'executionMode': executionMode,
      'id': id,
      'inputMessage': inputMessage,
      'inputTokens': inputTokens,
      'memorySpaceId': memorySpaceId,
      'model': model,
      'outputMessage': outputMessage,
      'outputTokens': outputTokens,
      'requestId': requestId,
      'runtime': runtime,
      'sessionId': sessionId,
      'sourceSurface': sourceSurface,
      'startedAt': startedAt,
      'status': status,
      'totalSteps': totalSteps,
      'totalTokens': totalTokens,
      'traceId': traceId,
    };
  }
}

class AgentRunListResponse {
  final List<AgentRunItem> items;

  AgentRunListResponse({
    required this.items
  });

  factory AgentRunListResponse.fromJson(Map<String, dynamic> json) {
    return AgentRunListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('AgentRunListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AgentRunItem.fromJson(map);
      })())
            .whereType<AgentRunItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class AgentRunResponse {
  final AgentRunItem item;

  AgentRunResponse({
    required this.item
  });

  factory AgentRunResponse.fromJson(Map<String, dynamic> json) {
    return AgentRunResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('AgentRunResponse.item is required');
        }
        return AgentRunItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class AgentRunStepCompleteRequest {
  final String? errorMessageMasked;
  final Map<String, dynamic>? metadata;
  final Map<String, dynamic>? outputJson;
  final String? status;
  final UsageSnapshot? usageJson;

  AgentRunStepCompleteRequest({
    this.errorMessageMasked,
    this.metadata,
    this.outputJson,
    this.status,
    this.usageJson
  });

  factory AgentRunStepCompleteRequest.fromJson(Map<String, dynamic> json) {
    return AgentRunStepCompleteRequest(
      errorMessageMasked: json['errorMessageMasked']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      outputJson: (() {
        final map = _sdkworkAsMap(json['outputJson']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      status: json['status']?.toString(),
      usageJson: (() {
        final map = _sdkworkAsMap(json['usageJson']);
        return map == null ? null : UsageSnapshot.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'errorMessageMasked': errorMessageMasked,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'outputJson': outputJson?.map((key, item) => MapEntry(key, item)),
      'status': status,
      'usageJson': usageJson?.toJson(),
    };
  }
}

class AgentRunStepCreateRequest {
  final Map<String, dynamic>? inputJson;
  final Map<String, dynamic>? metadata;
  final String? model;
  final Map<String, dynamic>? outputJson;
  final String? runtimeInvocationId;
  final String? status;
  final String? stepType;
  final String? title;
  final String? toolName;
  final UsageSnapshot? usageJson;

  AgentRunStepCreateRequest({
    this.inputJson,
    this.metadata,
    this.model,
    this.outputJson,
    this.runtimeInvocationId,
    this.status,
    this.stepType,
    this.title,
    this.toolName,
    this.usageJson
  });

  factory AgentRunStepCreateRequest.fromJson(Map<String, dynamic> json) {
    return AgentRunStepCreateRequest(
      inputJson: (() {
        final map = _sdkworkAsMap(json['inputJson']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      model: json['model']?.toString(),
      outputJson: (() {
        final map = _sdkworkAsMap(json['outputJson']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      runtimeInvocationId: json['runtimeInvocationId']?.toString(),
      status: json['status']?.toString(),
      stepType: json['stepType']?.toString(),
      title: json['title']?.toString(),
      toolName: json['toolName']?.toString(),
      usageJson: (() {
        final map = _sdkworkAsMap(json['usageJson']);
        return map == null ? null : UsageSnapshot.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'inputJson': inputJson?.map((key, item) => MapEntry(key, item)),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'outputJson': outputJson?.map((key, item) => MapEntry(key, item)),
      'runtimeInvocationId': runtimeInvocationId,
      'status': status,
      'stepType': stepType,
      'title': title,
      'toolName': toolName,
      'usageJson': usageJson?.toJson(),
    };
  }
}

class AgentRunStepItem {
  final String? cachedTokens;
  final String? completedAt;
  final String createdAt;
  final String id;
  final String? inputTokens;
  final String? latencyMs;
  final String? model;
  final String? outputTokens;
  final String runId;
  final String? runtimeInvocationId;
  final String? startedAt;
  final String status;
  final String stepIndex;
  final String stepType;
  final String? title;
  final String? toolName;
  final String? totalTokens;

  AgentRunStepItem({
    this.cachedTokens,
    this.completedAt,
    required this.createdAt,
    required this.id,
    this.inputTokens,
    this.latencyMs,
    this.model,
    this.outputTokens,
    required this.runId,
    this.runtimeInvocationId,
    this.startedAt,
    required this.status,
    required this.stepIndex,
    required this.stepType,
    this.title,
    this.toolName,
    this.totalTokens
  });

  factory AgentRunStepItem.fromJson(Map<String, dynamic> json) {
    return AgentRunStepItem(
      cachedTokens: json['cachedTokens']?.toString(),
      completedAt: json['completedAt']?.toString(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('AgentRunStepItem.createdAt is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AgentRunStepItem.id is required');
        }
        return value;
      })(),
      inputTokens: json['inputTokens']?.toString(),
      latencyMs: json['latencyMs']?.toString(),
      model: json['model']?.toString(),
      outputTokens: json['outputTokens']?.toString(),
      runId: (() {
        final value = json['runId']?.toString();
        if (value == null) {
          throw FormatException('AgentRunStepItem.runId is required');
        }
        return value;
      })(),
      runtimeInvocationId: json['runtimeInvocationId']?.toString(),
      startedAt: json['startedAt']?.toString(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('AgentRunStepItem.status is required');
        }
        return value;
      })(),
      stepIndex: (() {
        final value = json['stepIndex']?.toString();
        if (value == null) {
          throw FormatException('AgentRunStepItem.stepIndex is required');
        }
        return value;
      })(),
      stepType: (() {
        final value = json['stepType']?.toString();
        if (value == null) {
          throw FormatException('AgentRunStepItem.stepType is required');
        }
        return value;
      })(),
      title: json['title']?.toString(),
      toolName: json['toolName']?.toString(),
      totalTokens: json['totalTokens']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cachedTokens': cachedTokens,
      'completedAt': completedAt,
      'createdAt': createdAt,
      'id': id,
      'inputTokens': inputTokens,
      'latencyMs': latencyMs,
      'model': model,
      'outputTokens': outputTokens,
      'runId': runId,
      'runtimeInvocationId': runtimeInvocationId,
      'startedAt': startedAt,
      'status': status,
      'stepIndex': stepIndex,
      'stepType': stepType,
      'title': title,
      'toolName': toolName,
      'totalTokens': totalTokens,
    };
  }
}

class AgentRunStepListResponse {
  final List<AgentRunStepItem> items;

  AgentRunStepListResponse({
    required this.items
  });

  factory AgentRunStepListResponse.fromJson(Map<String, dynamic> json) {
    return AgentRunStepListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('AgentRunStepListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AgentRunStepItem.fromJson(map);
      })())
            .whereType<AgentRunStepItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class AgentRunStepResponse {
  final AgentRunStepItem item;

  AgentRunStepResponse({
    required this.item
  });

  factory AgentRunStepResponse.fromJson(Map<String, dynamic> json) {
    return AgentRunStepResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('AgentRunStepResponse.item is required');
        }
        return AgentRunStepItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class AgentRunStepsCreateResult {
  final String code;
  final AgentRunStepResponse? data;
  final String? msg;

  AgentRunStepsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentRunStepsCreateResult.fromJson(Map<String, dynamic> json) {
    return AgentRunStepsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentRunStepsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentRunStepResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentRunStepsListResult {
  final String code;
  final AgentRunStepListResponse? data;
  final String? msg;

  AgentRunStepsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentRunStepsListResult.fromJson(Map<String, dynamic> json) {
    return AgentRunStepsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentRunStepsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentRunStepListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentRunStepsSubmitResult {
  final String code;
  final AgentRunStepResponse? data;
  final String? msg;

  AgentRunStepsSubmitResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentRunStepsSubmitResult.fromJson(Map<String, dynamic> json) {
    return AgentRunStepsSubmitResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentRunStepsSubmitResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentRunStepResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentRunsCreateResult {
  final String code;
  final AgentRunResponse? data;
  final String? msg;

  AgentRunsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentRunsCreateResult.fromJson(Map<String, dynamic> json) {
    return AgentRunsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentRunsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentRunResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentRunsListResult {
  final String code;
  final AgentRunListResponse? data;
  final String? msg;

  AgentRunsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentRunsListResult.fromJson(Map<String, dynamic> json) {
    return AgentRunsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentRunsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentRunListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentRunsRetrieveResult {
  final String code;
  final AgentRunItem? data;
  final String? msg;

  AgentRunsRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentRunsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AgentRunsRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentRunsRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentRunItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentRunsSubmitResult {
  final String code;
  final AgentRunResponse? data;
  final String? msg;

  AgentRunsSubmitResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentRunsSubmitResult.fromJson(Map<String, dynamic> json) {
    return AgentRunsSubmitResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentRunsSubmitResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentRunResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentSessionCreateRequest {
  final String? agentVersionId;
  final String? approvalPolicy;
  final String? chatConversationId;
  final String? cwd;
  final String? defaultModel;
  final String? memorySpaceId;
  final Map<String, dynamic>? metadata;
  final String? permissionMode;
  final String? runtime;
  final String? sandboxPolicy;
  final String? sessionKind;
  final String? sourceSurface;
  final String? title;

  AgentSessionCreateRequest({
    this.agentVersionId,
    this.approvalPolicy,
    this.chatConversationId,
    this.cwd,
    this.defaultModel,
    this.memorySpaceId,
    this.metadata,
    this.permissionMode,
    this.runtime,
    this.sandboxPolicy,
    this.sessionKind,
    this.sourceSurface,
    this.title
  });

  factory AgentSessionCreateRequest.fromJson(Map<String, dynamic> json) {
    return AgentSessionCreateRequest(
      agentVersionId: json['agentVersionId']?.toString(),
      approvalPolicy: json['approvalPolicy']?.toString(),
      chatConversationId: json['chatConversationId']?.toString(),
      cwd: json['cwd']?.toString(),
      defaultModel: json['defaultModel']?.toString(),
      memorySpaceId: json['memorySpaceId']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      permissionMode: json['permissionMode']?.toString(),
      runtime: json['runtime']?.toString(),
      sandboxPolicy: json['sandboxPolicy']?.toString(),
      sessionKind: json['sessionKind']?.toString(),
      sourceSurface: json['sourceSurface']?.toString(),
      title: json['title']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'agentVersionId': agentVersionId,
      'approvalPolicy': approvalPolicy,
      'chatConversationId': chatConversationId,
      'cwd': cwd,
      'defaultModel': defaultModel,
      'memorySpaceId': memorySpaceId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'permissionMode': permissionMode,
      'runtime': runtime,
      'sandboxPolicy': sandboxPolicy,
      'sessionKind': sessionKind,
      'sourceSurface': sourceSurface,
      'title': title,
    };
  }
}

class AgentSessionItem {
  final String agentId;
  final String? agentVersionId;
  final String? approvalPolicy;
  final String? chatConversationId;
  final String createdAt;
  final String? cwd;
  final String? defaultModel;
  final String id;
  final String? lastActiveAt;
  final String? lastRunId;
  final String? lastStepId;
  final String? memorySpaceId;
  final String? permissionMode;
  final String runCount;
  final String? runtime;
  final String? sandboxPolicy;
  final String sessionKind;
  final String sourceSurface;
  final String status;
  final String stepCount;
  final String title;
  final String? toolCallCount;
  final String updatedAt;

  AgentSessionItem({
    required this.agentId,
    this.agentVersionId,
    this.approvalPolicy,
    this.chatConversationId,
    required this.createdAt,
    this.cwd,
    this.defaultModel,
    required this.id,
    this.lastActiveAt,
    this.lastRunId,
    this.lastStepId,
    this.memorySpaceId,
    this.permissionMode,
    required this.runCount,
    this.runtime,
    this.sandboxPolicy,
    required this.sessionKind,
    required this.sourceSurface,
    required this.status,
    required this.stepCount,
    required this.title,
    this.toolCallCount,
    required this.updatedAt
  });

  factory AgentSessionItem.fromJson(Map<String, dynamic> json) {
    return AgentSessionItem(
      agentId: (() {
        final value = json['agentId']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionItem.agentId is required');
        }
        return value;
      })(),
      agentVersionId: json['agentVersionId']?.toString(),
      approvalPolicy: json['approvalPolicy']?.toString(),
      chatConversationId: json['chatConversationId']?.toString(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionItem.createdAt is required');
        }
        return value;
      })(),
      cwd: json['cwd']?.toString(),
      defaultModel: json['defaultModel']?.toString(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionItem.id is required');
        }
        return value;
      })(),
      lastActiveAt: json['lastActiveAt']?.toString(),
      lastRunId: json['lastRunId']?.toString(),
      lastStepId: json['lastStepId']?.toString(),
      memorySpaceId: json['memorySpaceId']?.toString(),
      permissionMode: json['permissionMode']?.toString(),
      runCount: (() {
        final value = json['runCount']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionItem.runCount is required');
        }
        return value;
      })(),
      runtime: json['runtime']?.toString(),
      sandboxPolicy: json['sandboxPolicy']?.toString(),
      sessionKind: (() {
        final value = json['sessionKind']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionItem.sessionKind is required');
        }
        return value;
      })(),
      sourceSurface: (() {
        final value = json['sourceSurface']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionItem.sourceSurface is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionItem.status is required');
        }
        return value;
      })(),
      stepCount: (() {
        final value = json['stepCount']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionItem.stepCount is required');
        }
        return value;
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionItem.title is required');
        }
        return value;
      })(),
      toolCallCount: json['toolCallCount']?.toString(),
      updatedAt: (() {
        final value = json['updatedAt']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionItem.updatedAt is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'agentId': agentId,
      'agentVersionId': agentVersionId,
      'approvalPolicy': approvalPolicy,
      'chatConversationId': chatConversationId,
      'createdAt': createdAt,
      'cwd': cwd,
      'defaultModel': defaultModel,
      'id': id,
      'lastActiveAt': lastActiveAt,
      'lastRunId': lastRunId,
      'lastStepId': lastStepId,
      'memorySpaceId': memorySpaceId,
      'permissionMode': permissionMode,
      'runCount': runCount,
      'runtime': runtime,
      'sandboxPolicy': sandboxPolicy,
      'sessionKind': sessionKind,
      'sourceSurface': sourceSurface,
      'status': status,
      'stepCount': stepCount,
      'title': title,
      'toolCallCount': toolCallCount,
      'updatedAt': updatedAt,
    };
  }
}

class AgentSessionListResponse {
  final List<AgentSessionItem> items;

  AgentSessionListResponse({
    required this.items
  });

  factory AgentSessionListResponse.fromJson(Map<String, dynamic> json) {
    return AgentSessionListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('AgentSessionListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AgentSessionItem.fromJson(map);
      })())
            .whereType<AgentSessionItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class AgentSessionResponse {
  final AgentSessionItem item;

  AgentSessionResponse({
    required this.item
  });

  factory AgentSessionResponse.fromJson(Map<String, dynamic> json) {
    return AgentSessionResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('AgentSessionResponse.item is required');
        }
        return AgentSessionItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class AgentSessionsCreateResult {
  final String code;
  final AgentSessionResponse? data;
  final String? msg;

  AgentSessionsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentSessionsCreateResult.fromJson(Map<String, dynamic> json) {
    return AgentSessionsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentSessionResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentSessionsListResult {
  final String code;
  final AgentSessionListResponse? data;
  final String? msg;

  AgentSessionsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentSessionsListResult.fromJson(Map<String, dynamic> json) {
    return AgentSessionsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentSessionListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentSessionsRetrieveResult {
  final String code;
  final AgentSessionItem? data;
  final String? msg;

  AgentSessionsRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AgentSessionsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AgentSessionsRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AgentSessionsRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AgentSessionItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AgentVersionItem {
  final String createdAt;
  final String id;
  final Map<String, dynamic> mcpPolicy;
  final Map<String, dynamic> memoryPolicy;
  final String? model;
  final String releaseStatus;
  final Map<String, dynamic> runtimePolicy;
  final Map<String, dynamic> skillPolicy;
  final String systemPrompt;
  final Map<String, dynamic> toolPolicy;
  final String updatedAt;
  final String versionNo;

  AgentVersionItem({
    required this.createdAt,
    required this.id,
    required this.mcpPolicy,
    required this.memoryPolicy,
    this.model,
    required this.releaseStatus,
    required this.runtimePolicy,
    required this.skillPolicy,
    required this.systemPrompt,
    required this.toolPolicy,
    required this.updatedAt,
    required this.versionNo
  });

  factory AgentVersionItem.fromJson(Map<String, dynamic> json) {
    return AgentVersionItem(
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('AgentVersionItem.createdAt is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AgentVersionItem.id is required');
        }
        return value;
      })(),
      mcpPolicy: (() {
        final map = _sdkworkAsMap(json['mcpPolicy']);
        if (map == null) {
          throw FormatException('AgentVersionItem.mcpPolicy is required');
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      memoryPolicy: (() {
        final map = _sdkworkAsMap(json['memoryPolicy']);
        if (map == null) {
          throw FormatException('AgentVersionItem.memoryPolicy is required');
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      model: json['model']?.toString(),
      releaseStatus: (() {
        final value = json['releaseStatus']?.toString();
        if (value == null) {
          throw FormatException('AgentVersionItem.releaseStatus is required');
        }
        return value;
      })(),
      runtimePolicy: (() {
        final map = _sdkworkAsMap(json['runtimePolicy']);
        if (map == null) {
          throw FormatException('AgentVersionItem.runtimePolicy is required');
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      skillPolicy: (() {
        final map = _sdkworkAsMap(json['skillPolicy']);
        if (map == null) {
          throw FormatException('AgentVersionItem.skillPolicy is required');
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      systemPrompt: (() {
        final value = json['systemPrompt']?.toString();
        if (value == null) {
          throw FormatException('AgentVersionItem.systemPrompt is required');
        }
        return value;
      })(),
      toolPolicy: (() {
        final map = _sdkworkAsMap(json['toolPolicy']);
        if (map == null) {
          throw FormatException('AgentVersionItem.toolPolicy is required');
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      updatedAt: (() {
        final value = json['updatedAt']?.toString();
        if (value == null) {
          throw FormatException('AgentVersionItem.updatedAt is required');
        }
        return value;
      })(),
      versionNo: (() {
        final value = json['versionNo']?.toString();
        if (value == null) {
          throw FormatException('AgentVersionItem.versionNo is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'createdAt': createdAt,
      'id': id,
      'mcpPolicy': mcpPolicy.map((key, item) => MapEntry(key, item)),
      'memoryPolicy': memoryPolicy.map((key, item) => MapEntry(key, item)),
      'model': model,
      'releaseStatus': releaseStatus,
      'runtimePolicy': runtimePolicy.map((key, item) => MapEntry(key, item)),
      'skillPolicy': skillPolicy.map((key, item) => MapEntry(key, item)),
      'systemPrompt': systemPrompt,
      'toolPolicy': toolPolicy.map((key, item) => MapEntry(key, item)),
      'updatedAt': updatedAt,
      'versionNo': versionNo,
    };
  }
}

class ApiKeysCreateResult {
  final String code;
  final CreateApiKeyResponse? data;
  final String? msg;

  ApiKeysCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ApiKeysCreateResult.fromJson(Map<String, dynamic> json) {
    return ApiKeysCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ApiKeysCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CreateApiKeyResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ApiKeysDeleteResult {
  final String code;
  final DeleteApiKeyResponse? data;
  final String? msg;

  ApiKeysDeleteResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ApiKeysDeleteResult.fromJson(Map<String, dynamic> json) {
    return ApiKeysDeleteResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ApiKeysDeleteResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : DeleteApiKeyResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ApiKeysListResult {
  final String code;
  final AppApiKeyListResponse? data;
  final String? msg;

  ApiKeysListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ApiKeysListResult.fromJson(Map<String, dynamic> json) {
    return ApiKeysListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ApiKeysListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppApiKeyListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ApiKeysUpdateResult {
  final String code;
  final UpdateApiKeyResponse? data;
  final String? msg;

  ApiKeysUpdateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ApiKeysUpdateResult.fromJson(Map<String, dynamic> json) {
    return ApiKeysUpdateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ApiKeysUpdateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : UpdateApiKeyResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AppApiKeyItem {
  final String channelGroup;
  final String? channelGroupName;
  final String? copyableKey;
  final String created;
  final bool defaultForRuntime;
  final String expires;
  final String id;
  final String ipLimit;
  final String maskedKey;
  final List<String> modalities;
  final String name;
  final String quota;
  final String? rate;
  final String status;
  final String usedQuota;

  AppApiKeyItem({
    required this.channelGroup,
    this.channelGroupName,
    this.copyableKey,
    required this.created,
    required this.defaultForRuntime,
    required this.expires,
    required this.id,
    required this.ipLimit,
    required this.maskedKey,
    required this.modalities,
    required this.name,
    required this.quota,
    this.rate,
    required this.status,
    required this.usedQuota
  });

  factory AppApiKeyItem.fromJson(Map<String, dynamic> json) {
    return AppApiKeyItem(
      channelGroup: (() {
        final value = json['channelGroup']?.toString();
        if (value == null) {
          throw FormatException('AppApiKeyItem.channelGroup is required');
        }
        return value;
      })(),
      channelGroupName: json['channelGroupName']?.toString(),
      copyableKey: json['copyableKey']?.toString(),
      created: (() {
        final value = json['created']?.toString();
        if (value == null) {
          throw FormatException('AppApiKeyItem.created is required');
        }
        return value;
      })(),
      defaultForRuntime: (() {
        final value = json['defaultForRuntime'];
        if (value is! bool) {
          throw FormatException('AppApiKeyItem.defaultForRuntime is required');
        }
        return value;
      })(),
      expires: (() {
        final value = json['expires']?.toString();
        if (value == null) {
          throw FormatException('AppApiKeyItem.expires is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AppApiKeyItem.id is required');
        }
        return value;
      })(),
      ipLimit: (() {
        final value = json['ipLimit']?.toString();
        if (value == null) {
          throw FormatException('AppApiKeyItem.ipLimit is required');
        }
        return value;
      })(),
      maskedKey: (() {
        final value = json['maskedKey']?.toString();
        if (value == null) {
          throw FormatException('AppApiKeyItem.maskedKey is required');
        }
        return value;
      })(),
      modalities: (() {
        final list = _sdkworkAsList(json['modalities']);
        if (list == null) {
          throw FormatException('AppApiKeyItem.modalities is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('AppApiKeyItem.name is required');
        }
        return value;
      })(),
      quota: (() {
        final value = json['quota']?.toString();
        if (value == null) {
          throw FormatException('AppApiKeyItem.quota is required');
        }
        return value;
      })(),
      rate: json['rate']?.toString(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('AppApiKeyItem.status is required');
        }
        return value;
      })(),
      usedQuota: (() {
        final value = json['usedQuota']?.toString();
        if (value == null) {
          throw FormatException('AppApiKeyItem.usedQuota is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'channelGroup': channelGroup,
      'channelGroupName': channelGroupName,
      'copyableKey': copyableKey,
      'created': created,
      'defaultForRuntime': defaultForRuntime,
      'expires': expires,
      'id': id,
      'ipLimit': ipLimit,
      'maskedKey': maskedKey,
      'modalities': modalities.map((item) => item).toList(),
      'name': name,
      'quota': quota,
      'rate': rate,
      'status': status,
      'usedQuota': usedQuota,
    };
  }
}

class AppApiKeyListResponse {
  final List<AppChannelGroup> groups;
  final List<AppApiKeyItem> items;

  AppApiKeyListResponse({
    required this.groups,
    required this.items
  });

  factory AppApiKeyListResponse.fromJson(Map<String, dynamic> json) {
    return AppApiKeyListResponse(
      groups: (() {
        final list = _sdkworkAsList(json['groups']);
        if (list == null) {
          throw FormatException('AppApiKeyListResponse.groups is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppChannelGroup.fromJson(map);
      })())
            .whereType<AppChannelGroup>()
            .toList();
      })(),
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('AppApiKeyListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppApiKeyItem.fromJson(map);
      })())
            .whereType<AppApiKeyItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'groups': groups.map((item) => item.toJson()).toList(),
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class AppCatalogItem {
  final String category;
  final String description;
  final String developer;
  final String downloads;
  final List<String> features;
  final String id;
  final MediaResource image;
  final String name;
  final double rating;
  final List<AppReleaseItem> releases;
  final List<MediaResource> screenshots;

  AppCatalogItem({
    required this.category,
    required this.description,
    required this.developer,
    required this.downloads,
    required this.features,
    required this.id,
    required this.image,
    required this.name,
    required this.rating,
    required this.releases,
    required this.screenshots
  });

  factory AppCatalogItem.fromJson(Map<String, dynamic> json) {
    return AppCatalogItem(
      category: (() {
        final value = json['category']?.toString();
        if (value == null) {
          throw FormatException('AppCatalogItem.category is required');
        }
        return value;
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('AppCatalogItem.description is required');
        }
        return value;
      })(),
      developer: (() {
        final value = json['developer']?.toString();
        if (value == null) {
          throw FormatException('AppCatalogItem.developer is required');
        }
        return value;
      })(),
      downloads: (() {
        final value = json['downloads']?.toString();
        if (value == null) {
          throw FormatException('AppCatalogItem.downloads is required');
        }
        return value;
      })(),
      features: (() {
        final list = _sdkworkAsList(json['features']);
        if (list == null) {
          throw FormatException('AppCatalogItem.features is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AppCatalogItem.id is required');
        }
        return value;
      })(),
      image: (() {
        final map = _sdkworkAsMap(json['image']);
        if (map == null) {
          throw FormatException('AppCatalogItem.image is required');
        }
        return MediaResource.fromJson(map);
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('AppCatalogItem.name is required');
        }
        return value;
      })(),
      rating: (() {
        final value = json['rating'];
        if (value is! num) {
          throw FormatException('AppCatalogItem.rating is required');
        }
        return value.toDouble();
      })(),
      releases: (() {
        final list = _sdkworkAsList(json['releases']);
        if (list == null) {
          throw FormatException('AppCatalogItem.releases is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppReleaseItem.fromJson(map);
      })())
            .whereType<AppReleaseItem>()
            .toList();
      })(),
      screenshots: (() {
        final list = _sdkworkAsList(json['screenshots']);
        if (list == null) {
          throw FormatException('AppCatalogItem.screenshots is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MediaResource.fromJson(map);
      })())
            .whereType<MediaResource>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'description': description,
      'developer': developer,
      'downloads': downloads,
      'features': features.map((item) => item).toList(),
      'id': id,
      'image': image.toJson(),
      'name': name,
      'rating': rating,
      'releases': releases.map((item) => item.toJson()).toList(),
      'screenshots': screenshots.map((item) => item.toJson()).toList(),
    };
  }
}

class AppCatalogResponse {
  final bool hasNextPage;
  final List<AppCatalogItem> items;
  final int page;
  final int pageSize;
  final String total;

  AppCatalogResponse({
    required this.hasNextPage,
    required this.items,
    required this.page,
    required this.pageSize,
    required this.total
  });

  factory AppCatalogResponse.fromJson(Map<String, dynamic> json) {
    return AppCatalogResponse(
      hasNextPage: (() {
        final value = json['hasNextPage'];
        if (value is! bool) {
          throw FormatException('AppCatalogResponse.hasNextPage is required');
        }
        return value;
      })(),
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('AppCatalogResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppCatalogItem.fromJson(map);
      })())
            .whereType<AppCatalogItem>()
            .toList();
      })(),
      page: (() {
        final value = json['page'];
        if (value is! int) {
          throw FormatException('AppCatalogResponse.page is required');
        }
        return value;
      })(),
      pageSize: (() {
        final value = json['pageSize'];
        if (value is! int) {
          throw FormatException('AppCatalogResponse.pageSize is required');
        }
        return value;
      })(),
      total: (() {
        final value = json['total']?.toString();
        if (value == null) {
          throw FormatException('AppCatalogResponse.total is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'hasNextPage': hasNextPage,
      'items': items.map((item) => item.toJson()).toList(),
      'page': page,
      'pageSize': pageSize,
      'total': total,
    };
  }
}

class AppCategoriesResponse {
  final List<String> items;

  AppCategoriesResponse({
    required this.items
  });

  factory AppCategoriesResponse.fromJson(Map<String, dynamic> json) {
    return AppCategoriesResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('AppCategoriesResponse.items is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item).toList(),
    };
  }
}

class AppChannelGroup {
  final String code;
  final String id;
  final String name;
  final String rate;

  AppChannelGroup({
    required this.code,
    required this.id,
    required this.name,
    required this.rate
  });

  factory AppChannelGroup.fromJson(Map<String, dynamic> json) {
    return AppChannelGroup(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AppChannelGroup.code is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AppChannelGroup.id is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('AppChannelGroup.name is required');
        }
        return value;
      })(),
      rate: (() {
        final value = json['rate']?.toString();
        if (value == null) {
          throw FormatException('AppChannelGroup.rate is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'id': id,
      'name': name,
      'rate': rate,
    };
  }
}

class AppChannelGroupListResponse {
  final List<AppChannelGroup> items;

  AppChannelGroupListResponse({
    required this.items
  });

  factory AppChannelGroupListResponse.fromJson(Map<String, dynamic> json) {
    return AppChannelGroupListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('AppChannelGroupListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppChannelGroup.fromJson(map);
      })())
            .whereType<AppChannelGroup>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class AppDetailResponse {
  final String category;
  final String description;
  final String developer;
  final String downloads;
  final List<String> features;
  final String id;
  final MediaResource image;
  final String name;
  final double rating;
  final List<AppReleaseItem> releases;
  final List<MediaResource> screenshots;

  AppDetailResponse({
    required this.category,
    required this.description,
    required this.developer,
    required this.downloads,
    required this.features,
    required this.id,
    required this.image,
    required this.name,
    required this.rating,
    required this.releases,
    required this.screenshots
  });

  factory AppDetailResponse.fromJson(Map<String, dynamic> json) {
    return AppDetailResponse(
      category: (() {
        final value = json['category']?.toString();
        if (value == null) {
          throw FormatException('AppDetailResponse.category is required');
        }
        return value;
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('AppDetailResponse.description is required');
        }
        return value;
      })(),
      developer: (() {
        final value = json['developer']?.toString();
        if (value == null) {
          throw FormatException('AppDetailResponse.developer is required');
        }
        return value;
      })(),
      downloads: (() {
        final value = json['downloads']?.toString();
        if (value == null) {
          throw FormatException('AppDetailResponse.downloads is required');
        }
        return value;
      })(),
      features: (() {
        final list = _sdkworkAsList(json['features']);
        if (list == null) {
          throw FormatException('AppDetailResponse.features is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AppDetailResponse.id is required');
        }
        return value;
      })(),
      image: (() {
        final map = _sdkworkAsMap(json['image']);
        if (map == null) {
          throw FormatException('AppDetailResponse.image is required');
        }
        return MediaResource.fromJson(map);
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('AppDetailResponse.name is required');
        }
        return value;
      })(),
      rating: (() {
        final value = json['rating'];
        if (value is! num) {
          throw FormatException('AppDetailResponse.rating is required');
        }
        return value.toDouble();
      })(),
      releases: (() {
        final list = _sdkworkAsList(json['releases']);
        if (list == null) {
          throw FormatException('AppDetailResponse.releases is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppReleaseItem.fromJson(map);
      })())
            .whereType<AppReleaseItem>()
            .toList();
      })(),
      screenshots: (() {
        final list = _sdkworkAsList(json['screenshots']);
        if (list == null) {
          throw FormatException('AppDetailResponse.screenshots is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MediaResource.fromJson(map);
      })())
            .whereType<MediaResource>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'description': description,
      'developer': developer,
      'downloads': downloads,
      'features': features.map((item) => item).toList(),
      'id': id,
      'image': image.toJson(),
      'name': name,
      'rating': rating,
      'releases': releases.map((item) => item.toJson()).toList(),
      'screenshots': screenshots.map((item) => item.toJson()).toList(),
    };
  }
}

class AppInstalledSkillItem {
  final Map<String, dynamic> config;
  final bool enabled;
  final String id;
  final String installedAt;
  final String lastEnabledAt;
  final SkillCatalogItem skill;
  final String skillId;

  AppInstalledSkillItem({
    required this.config,
    required this.enabled,
    required this.id,
    required this.installedAt,
    required this.lastEnabledAt,
    required this.skill,
    required this.skillId
  });

  factory AppInstalledSkillItem.fromJson(Map<String, dynamic> json) {
    return AppInstalledSkillItem(
      config: (() {
        final map = _sdkworkAsMap(json['config']);
        if (map == null) {
          throw FormatException('AppInstalledSkillItem.config is required');
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      enabled: (() {
        final value = json['enabled'];
        if (value is! bool) {
          throw FormatException('AppInstalledSkillItem.enabled is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AppInstalledSkillItem.id is required');
        }
        return value;
      })(),
      installedAt: (() {
        final value = json['installedAt']?.toString();
        if (value == null) {
          throw FormatException('AppInstalledSkillItem.installedAt is required');
        }
        return value;
      })(),
      lastEnabledAt: (() {
        final value = json['lastEnabledAt']?.toString();
        if (value == null) {
          throw FormatException('AppInstalledSkillItem.lastEnabledAt is required');
        }
        return value;
      })(),
      skill: (() {
        final map = _sdkworkAsMap(json['skill']);
        if (map == null) {
          throw FormatException('AppInstalledSkillItem.skill is required');
        }
        return SkillCatalogItem.fromJson(map);
      })(),
      skillId: (() {
        final value = json['skillId']?.toString();
        if (value == null) {
          throw FormatException('AppInstalledSkillItem.skillId is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'config': config.map((key, item) => MapEntry(key, item)),
      'enabled': enabled,
      'id': id,
      'installedAt': installedAt,
      'lastEnabledAt': lastEnabledAt,
      'skill': skill.toJson(),
      'skillId': skillId,
    };
  }
}

class AppInstalledSkillResponse {
  final AppInstalledSkillItem item;

  AppInstalledSkillResponse({
    required this.item
  });

  factory AppInstalledSkillResponse.fromJson(Map<String, dynamic> json) {
    return AppInstalledSkillResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('AppInstalledSkillResponse.item is required');
        }
        return AppInstalledSkillItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class AppInstalledSkillsResponse {
  final List<AppInstalledSkillItem> items;

  AppInstalledSkillsResponse({
    required this.items
  });

  factory AppInstalledSkillsResponse.fromJson(Map<String, dynamic> json) {
    return AppInstalledSkillsResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('AppInstalledSkillsResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppInstalledSkillItem.fromJson(map);
      })())
            .whereType<AppInstalledSkillItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class AppModelCatalogGroupOption {
  final String key;
  final String label;
  final String modelCount;

  AppModelCatalogGroupOption({
    required this.key,
    required this.label,
    required this.modelCount
  });

  factory AppModelCatalogGroupOption.fromJson(Map<String, dynamic> json) {
    return AppModelCatalogGroupOption(
      key: (() {
        final value = json['key']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogGroupOption.key is required');
        }
        return value;
      })(),
      label: (() {
        final value = json['label']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogGroupOption.label is required');
        }
        return value;
      })(),
      modelCount: (() {
        final value = json['modelCount']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogGroupOption.modelCount is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'key': key,
      'label': label,
      'modelCount': modelCount,
    };
  }
}

class AppModelCatalogItem {
  final String apiFormat;
  final List<String> capabilities;
  final String capabilityIntro;
  final String catalogKey;
  final List<String> categories;
  final String contextTokens;
  final String description;
  final String displayName;
  final List<String> groups;
  final List<String> inputModalities;
  final List<String> limitations;
  final String maxOutputTokens;
  final List<String> modalities;
  final String model;
  final List<AppModelCatalogReferencePrice> officialReferencePrices;
  final List<String> outputModalities;
  final AppModelCatalogPriceAvailability priceAvailability;
  final List<String> providerCodes;
  final String releaseStage;
  final String replacementModel;
  final String routingState;
  final String shelfState;
  final List<String> supportedLanguages;
  final bool supportsJsonSchema;
  final bool supportsStreaming;
  final bool supportsTools;
  final String trainingDataCutoff;
  final List<String> useCases;
  final String vendor;
  final String vendorCode;

  AppModelCatalogItem({
    required this.apiFormat,
    required this.capabilities,
    required this.capabilityIntro,
    required this.catalogKey,
    required this.categories,
    required this.contextTokens,
    required this.description,
    required this.displayName,
    required this.groups,
    required this.inputModalities,
    required this.limitations,
    required this.maxOutputTokens,
    required this.modalities,
    required this.model,
    required this.officialReferencePrices,
    required this.outputModalities,
    required this.priceAvailability,
    required this.providerCodes,
    required this.releaseStage,
    required this.replacementModel,
    required this.routingState,
    required this.shelfState,
    required this.supportedLanguages,
    required this.supportsJsonSchema,
    required this.supportsStreaming,
    required this.supportsTools,
    required this.trainingDataCutoff,
    required this.useCases,
    required this.vendor,
    required this.vendorCode
  });

  factory AppModelCatalogItem.fromJson(Map<String, dynamic> json) {
    return AppModelCatalogItem(
      apiFormat: (() {
        final value = json['apiFormat']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.apiFormat is required');
        }
        return value;
      })(),
      capabilities: (() {
        final list = _sdkworkAsList(json['capabilities']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.capabilities is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      capabilityIntro: (() {
        final value = json['capabilityIntro']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.capabilityIntro is required');
        }
        return value;
      })(),
      catalogKey: (() {
        final value = json['catalogKey']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.catalogKey is required');
        }
        return value;
      })(),
      categories: (() {
        final list = _sdkworkAsList(json['categories']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.categories is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      contextTokens: (() {
        final value = json['contextTokens']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.contextTokens is required');
        }
        return value;
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.description is required');
        }
        return value;
      })(),
      displayName: (() {
        final value = json['displayName']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.displayName is required');
        }
        return value;
      })(),
      groups: (() {
        final list = _sdkworkAsList(json['groups']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.groups is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      inputModalities: (() {
        final list = _sdkworkAsList(json['inputModalities']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.inputModalities is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      limitations: (() {
        final list = _sdkworkAsList(json['limitations']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.limitations is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      maxOutputTokens: (() {
        final value = json['maxOutputTokens']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.maxOutputTokens is required');
        }
        return value;
      })(),
      modalities: (() {
        final list = _sdkworkAsList(json['modalities']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.modalities is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      model: (() {
        final value = json['model']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.model is required');
        }
        return value;
      })(),
      officialReferencePrices: (() {
        final list = _sdkworkAsList(json['officialReferencePrices']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.officialReferencePrices is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppModelCatalogReferencePrice.fromJson(map);
      })())
            .whereType<AppModelCatalogReferencePrice>()
            .toList();
      })(),
      outputModalities: (() {
        final list = _sdkworkAsList(json['outputModalities']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.outputModalities is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      priceAvailability: (() {
        final map = _sdkworkAsMap(json['priceAvailability']);
        if (map == null) {
          throw FormatException('AppModelCatalogItem.priceAvailability is required');
        }
        return AppModelCatalogPriceAvailability.fromJson(map);
      })(),
      providerCodes: (() {
        final list = _sdkworkAsList(json['providerCodes']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.providerCodes is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      releaseStage: (() {
        final value = json['releaseStage']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.releaseStage is required');
        }
        return value;
      })(),
      replacementModel: (() {
        final value = json['replacementModel']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.replacementModel is required');
        }
        return value;
      })(),
      routingState: (() {
        final value = json['routingState']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.routingState is required');
        }
        return value;
      })(),
      shelfState: (() {
        final value = json['shelfState']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.shelfState is required');
        }
        return value;
      })(),
      supportedLanguages: (() {
        final list = _sdkworkAsList(json['supportedLanguages']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.supportedLanguages is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      supportsJsonSchema: (() {
        final value = json['supportsJsonSchema'];
        if (value is! bool) {
          throw FormatException('AppModelCatalogItem.supportsJsonSchema is required');
        }
        return value;
      })(),
      supportsStreaming: (() {
        final value = json['supportsStreaming'];
        if (value is! bool) {
          throw FormatException('AppModelCatalogItem.supportsStreaming is required');
        }
        return value;
      })(),
      supportsTools: (() {
        final value = json['supportsTools'];
        if (value is! bool) {
          throw FormatException('AppModelCatalogItem.supportsTools is required');
        }
        return value;
      })(),
      trainingDataCutoff: (() {
        final value = json['trainingDataCutoff']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.trainingDataCutoff is required');
        }
        return value;
      })(),
      useCases: (() {
        final list = _sdkworkAsList(json['useCases']);
        if (list == null) {
          throw FormatException('AppModelCatalogItem.useCases is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      vendor: (() {
        final value = json['vendor']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.vendor is required');
        }
        return value;
      })(),
      vendorCode: (() {
        final value = json['vendorCode']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogItem.vendorCode is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'apiFormat': apiFormat,
      'capabilities': capabilities.map((item) => item).toList(),
      'capabilityIntro': capabilityIntro,
      'catalogKey': catalogKey,
      'categories': categories.map((item) => item).toList(),
      'contextTokens': contextTokens,
      'description': description,
      'displayName': displayName,
      'groups': groups.map((item) => item).toList(),
      'inputModalities': inputModalities.map((item) => item).toList(),
      'limitations': limitations.map((item) => item).toList(),
      'maxOutputTokens': maxOutputTokens,
      'modalities': modalities.map((item) => item).toList(),
      'model': model,
      'officialReferencePrices': officialReferencePrices.map((item) => item.toJson()).toList(),
      'outputModalities': outputModalities.map((item) => item).toList(),
      'priceAvailability': priceAvailability.toJson(),
      'providerCodes': providerCodes.map((item) => item).toList(),
      'releaseStage': releaseStage,
      'replacementModel': replacementModel,
      'routingState': routingState,
      'shelfState': shelfState,
      'supportedLanguages': supportedLanguages.map((item) => item).toList(),
      'supportsJsonSchema': supportsJsonSchema,
      'supportsStreaming': supportsStreaming,
      'supportsTools': supportsTools,
      'trainingDataCutoff': trainingDataCutoff,
      'useCases': useCases.map((item) => item).toList(),
      'vendor': vendor,
      'vendorCode': vendorCode,
    };
  }
}

class AppModelCatalogPriceAvailability {
  final String? reason;
  final String status;

  AppModelCatalogPriceAvailability({
    this.reason,
    required this.status
  });

  factory AppModelCatalogPriceAvailability.fromJson(Map<String, dynamic> json) {
    return AppModelCatalogPriceAvailability(
      reason: json['reason']?.toString(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogPriceAvailability.status is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'reason': reason,
      'status': status,
    };
  }
}

class AppModelCatalogReferencePrice {
  final String billingMeter;
  final String currency;
  final String regionCode;
  final String unitPrice;

  AppModelCatalogReferencePrice({
    required this.billingMeter,
    required this.currency,
    required this.regionCode,
    required this.unitPrice
  });

  factory AppModelCatalogReferencePrice.fromJson(Map<String, dynamic> json) {
    return AppModelCatalogReferencePrice(
      billingMeter: (() {
        final value = json['billingMeter']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogReferencePrice.billingMeter is required');
        }
        return value;
      })(),
      currency: (() {
        final value = json['currency']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogReferencePrice.currency is required');
        }
        return value;
      })(),
      regionCode: (() {
        final value = json['regionCode']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogReferencePrice.regionCode is required');
        }
        return value;
      })(),
      unitPrice: (() {
        final value = json['unitPrice']?.toString();
        if (value == null) {
          throw FormatException('AppModelCatalogReferencePrice.unitPrice is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'billingMeter': billingMeter,
      'currency': currency,
      'regionCode': regionCode,
      'unitPrice': unitPrice,
    };
  }
}

class AppModelCatalogResponse {
  final List<AppModelCatalogGroupOption> groups;
  final List<AppModelCatalogItem> items;

  AppModelCatalogResponse({
    required this.groups,
    required this.items
  });

  factory AppModelCatalogResponse.fromJson(Map<String, dynamic> json) {
    return AppModelCatalogResponse(
      groups: (() {
        final list = _sdkworkAsList(json['groups']);
        if (list == null) {
          throw FormatException('AppModelCatalogResponse.groups is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppModelCatalogGroupOption.fromJson(map);
      })())
            .whereType<AppModelCatalogGroupOption>()
            .toList();
      })(),
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('AppModelCatalogResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppModelCatalogItem.fromJson(map);
      })())
            .whereType<AppModelCatalogItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'groups': groups.map((item) => item.toJson()).toList(),
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class AppReleaseItem {
  final MediaResource artifact;
  final String id;
  final String os;
  final String platformType;
  final String releaseDate;
  final String size;
  final String version;
  final String? whatsNew;

  AppReleaseItem({
    required this.artifact,
    required this.id,
    required this.os,
    required this.platformType,
    required this.releaseDate,
    required this.size,
    required this.version,
    this.whatsNew
  });

  factory AppReleaseItem.fromJson(Map<String, dynamic> json) {
    return AppReleaseItem(
      artifact: (() {
        final map = _sdkworkAsMap(json['artifact']);
        if (map == null) {
          throw FormatException('AppReleaseItem.artifact is required');
        }
        return MediaResource.fromJson(map);
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('AppReleaseItem.id is required');
        }
        return value;
      })(),
      os: (() {
        final value = json['os']?.toString();
        if (value == null) {
          throw FormatException('AppReleaseItem.os is required');
        }
        return value;
      })(),
      platformType: (() {
        final value = json['platformType']?.toString();
        if (value == null) {
          throw FormatException('AppReleaseItem.platformType is required');
        }
        return value;
      })(),
      releaseDate: (() {
        final value = json['releaseDate']?.toString();
        if (value == null) {
          throw FormatException('AppReleaseItem.releaseDate is required');
        }
        return value;
      })(),
      size: (() {
        final value = json['size']?.toString();
        if (value == null) {
          throw FormatException('AppReleaseItem.size is required');
        }
        return value;
      })(),
      version: (() {
        final value = json['version']?.toString();
        if (value == null) {
          throw FormatException('AppReleaseItem.version is required');
        }
        return value;
      })(),
      whatsNew: json['whatsNew']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'artifact': artifact.toJson(),
      'id': id,
      'os': os,
      'platformType': platformType,
      'releaseDate': releaseDate,
      'size': size,
      'version': version,
      'whatsNew': whatsNew,
    };
  }
}

class AppSkillConfigRequest {
  final Map<String, dynamic>? config;

  AppSkillConfigRequest({
    this.config
  });

  factory AppSkillConfigRequest.fromJson(Map<String, dynamic> json) {
    return AppSkillConfigRequest(
      config: (() {
        final map = _sdkworkAsMap(json['config']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'config': config?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class ApplicationsCreateResult {
  final String code;
  final CourseApplicationCreateResponse? data;
  final String? msg;

  ApplicationsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ApplicationsCreateResult.fromJson(Map<String, dynamic> json) {
    return ApplicationsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ApplicationsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CourseApplicationCreateResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ApplicationsVideosCreateResult {
  final String code;
  final CourseApplicationVideoUploadResponse? data;
  final String? msg;

  ApplicationsVideosCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ApplicationsVideosCreateResult.fromJson(Map<String, dynamic> json) {
    return ApplicationsVideosCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ApplicationsVideosCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CourseApplicationVideoUploadResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AppsStoreCategoriesListResult {
  final String code;
  final AppCategoriesResponse? data;
  final String? msg;

  AppsStoreCategoriesListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AppsStoreCategoriesListResult.fromJson(Map<String, dynamic> json) {
    return AppsStoreCategoriesListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AppsStoreCategoriesListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppCategoriesResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AppsStoreListResult {
  final String code;
  final AppCatalogResponse? data;
  final String? msg;

  AppsStoreListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AppsStoreListResult.fromJson(Map<String, dynamic> json) {
    return AppsStoreListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AppsStoreListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppCatalogResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class AppsStoreRetrieveResult {
  final String code;
  final AppDetailResponse? data;
  final String? msg;

  AppsStoreRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory AppsStoreRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AppsStoreRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('AppsStoreRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppDetailResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ArchivesCreateResult {
  final String code;
  final SdkReferenceArchiveResponse? data;
  final String? msg;

  ArchivesCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ArchivesCreateResult.fromJson(Map<String, dynamic> json) {
    return ArchivesCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ArchivesCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SdkReferenceArchiveResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ArtifactsCreateResult {
  final String code;
  final RuntimeArtifactResponse? data;
  final String? msg;

  ArtifactsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ArtifactsCreateResult.fromJson(Map<String, dynamic> json) {
    return ArtifactsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ArtifactsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RuntimeArtifactResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ArtifactsListResult {
  final String code;
  final RuntimeArtifactListResponse? data;
  final String? msg;

  ArtifactsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ArtifactsListResult.fromJson(Map<String, dynamic> json) {
    return ArtifactsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ArtifactsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RuntimeArtifactListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ChannelGroupsListResult {
  final String code;
  final AppChannelGroupListResponse? data;
  final String? msg;

  ChannelGroupsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ChannelGroupsListResult.fromJson(Map<String, dynamic> json) {
    return ChannelGroupsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ChannelGroupsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppChannelGroupListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ChatConversationCreateRequest {
  final String? agentId;
  final String? agentSessionId;
  final String? defaultModel;
  final String? defaultProvider;
  final String? memorySpaceId;
  final Map<String, dynamic>? metadata;
  final String? sourceSurface;
  final String? title;

  ChatConversationCreateRequest({
    this.agentId,
    this.agentSessionId,
    this.defaultModel,
    this.defaultProvider,
    this.memorySpaceId,
    this.metadata,
    this.sourceSurface,
    this.title
  });

  factory ChatConversationCreateRequest.fromJson(Map<String, dynamic> json) {
    return ChatConversationCreateRequest(
      agentId: json['agentId']?.toString(),
      agentSessionId: json['agentSessionId']?.toString(),
      defaultModel: json['defaultModel']?.toString(),
      defaultProvider: json['defaultProvider']?.toString(),
      memorySpaceId: json['memorySpaceId']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      sourceSurface: json['sourceSurface']?.toString(),
      title: json['title']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'agentId': agentId,
      'agentSessionId': agentSessionId,
      'defaultModel': defaultModel,
      'defaultProvider': defaultProvider,
      'memorySpaceId': memorySpaceId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'sourceSurface': sourceSurface,
      'title': title,
    };
  }
}

class ChatConversationItem {
  final String? agentId;
  final String? agentSessionId;
  final String createdAt;
  final String? defaultModel;
  final String? defaultProvider;
  final String id;
  final String? lastMessagePreview;
  final String? memorySpaceId;
  final String messageCount;
  final String sourceSurface;
  final String status;
  final String title;
  final String turnCount;
  final String updatedAt;

  ChatConversationItem({
    this.agentId,
    this.agentSessionId,
    required this.createdAt,
    this.defaultModel,
    this.defaultProvider,
    required this.id,
    this.lastMessagePreview,
    this.memorySpaceId,
    required this.messageCount,
    required this.sourceSurface,
    required this.status,
    required this.title,
    required this.turnCount,
    required this.updatedAt
  });

  factory ChatConversationItem.fromJson(Map<String, dynamic> json) {
    return ChatConversationItem(
      agentId: json['agentId']?.toString(),
      agentSessionId: json['agentSessionId']?.toString(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('ChatConversationItem.createdAt is required');
        }
        return value;
      })(),
      defaultModel: json['defaultModel']?.toString(),
      defaultProvider: json['defaultProvider']?.toString(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('ChatConversationItem.id is required');
        }
        return value;
      })(),
      lastMessagePreview: json['lastMessagePreview']?.toString(),
      memorySpaceId: json['memorySpaceId']?.toString(),
      messageCount: (() {
        final value = json['messageCount']?.toString();
        if (value == null) {
          throw FormatException('ChatConversationItem.messageCount is required');
        }
        return value;
      })(),
      sourceSurface: (() {
        final value = json['sourceSurface']?.toString();
        if (value == null) {
          throw FormatException('ChatConversationItem.sourceSurface is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('ChatConversationItem.status is required');
        }
        return value;
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('ChatConversationItem.title is required');
        }
        return value;
      })(),
      turnCount: (() {
        final value = json['turnCount']?.toString();
        if (value == null) {
          throw FormatException('ChatConversationItem.turnCount is required');
        }
        return value;
      })(),
      updatedAt: (() {
        final value = json['updatedAt']?.toString();
        if (value == null) {
          throw FormatException('ChatConversationItem.updatedAt is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'agentId': agentId,
      'agentSessionId': agentSessionId,
      'createdAt': createdAt,
      'defaultModel': defaultModel,
      'defaultProvider': defaultProvider,
      'id': id,
      'lastMessagePreview': lastMessagePreview,
      'memorySpaceId': memorySpaceId,
      'messageCount': messageCount,
      'sourceSurface': sourceSurface,
      'status': status,
      'title': title,
      'turnCount': turnCount,
      'updatedAt': updatedAt,
    };
  }
}

class ChatConversationListResponse {
  final List<ChatConversationItem> items;

  ChatConversationListResponse({
    required this.items
  });

  factory ChatConversationListResponse.fromJson(Map<String, dynamic> json) {
    return ChatConversationListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('ChatConversationListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ChatConversationItem.fromJson(map);
      })())
            .whereType<ChatConversationItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class ChatConversationResponse {
  final ChatConversationItem item;

  ChatConversationResponse({
    required this.item
  });

  factory ChatConversationResponse.fromJson(Map<String, dynamic> json) {
    return ChatConversationResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('ChatConversationResponse.item is required');
        }
        return ChatConversationItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class ChatMessageItem {
  final String content;
  final String conversationId;
  final String createdAt;
  final String direction;
  final String id;
  final String? model;
  final String? provider;
  final String role;
  final String? runtime;
  final String? runtimeInvocationId;
  final String status;
  final String? turnId;
  final Map<String, dynamic>? usage;
  final String? usageLinkId;

  ChatMessageItem({
    required this.content,
    required this.conversationId,
    required this.createdAt,
    required this.direction,
    required this.id,
    this.model,
    this.provider,
    required this.role,
    this.runtime,
    this.runtimeInvocationId,
    required this.status,
    this.turnId,
    this.usage,
    this.usageLinkId
  });

  factory ChatMessageItem.fromJson(Map<String, dynamic> json) {
    return ChatMessageItem(
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('ChatMessageItem.content is required');
        }
        return value;
      })(),
      conversationId: (() {
        final value = json['conversationId']?.toString();
        if (value == null) {
          throw FormatException('ChatMessageItem.conversationId is required');
        }
        return value;
      })(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('ChatMessageItem.createdAt is required');
        }
        return value;
      })(),
      direction: (() {
        final value = json['direction']?.toString();
        if (value == null) {
          throw FormatException('ChatMessageItem.direction is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('ChatMessageItem.id is required');
        }
        return value;
      })(),
      model: json['model']?.toString(),
      provider: json['provider']?.toString(),
      role: (() {
        final value = json['role']?.toString();
        if (value == null) {
          throw FormatException('ChatMessageItem.role is required');
        }
        return value;
      })(),
      runtime: json['runtime']?.toString(),
      runtimeInvocationId: json['runtimeInvocationId']?.toString(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('ChatMessageItem.status is required');
        }
        return value;
      })(),
      turnId: json['turnId']?.toString(),
      usage: _sdkworkAsMap(json['usage']),
      usageLinkId: json['usageLinkId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'conversationId': conversationId,
      'createdAt': createdAt,
      'direction': direction,
      'id': id,
      'model': model,
      'provider': provider,
      'role': role,
      'runtime': runtime,
      'runtimeInvocationId': runtimeInvocationId,
      'status': status,
      'turnId': turnId,
      'usage': usage,
      'usageLinkId': usageLinkId,
    };
  }
}

class ChatMessageListResponse {
  final List<ChatMessageItem> items;

  ChatMessageListResponse({
    required this.items
  });

  factory ChatMessageListResponse.fromJson(Map<String, dynamic> json) {
    return ChatMessageListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('ChatMessageListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ChatMessageItem.fromJson(map);
      })())
            .whereType<ChatMessageItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class ChatTurnCreateRequest {
  final String? agentId;
  final String? agentSessionId;
  final String message;
  final Map<String, dynamic>? metadata;
  final String? mode;
  final String? model;
  final String? provider;

  ChatTurnCreateRequest({
    this.agentId,
    this.agentSessionId,
    required this.message,
    this.metadata,
    this.mode,
    this.model,
    this.provider
  });

  factory ChatTurnCreateRequest.fromJson(Map<String, dynamic> json) {
    return ChatTurnCreateRequest(
      agentId: json['agentId']?.toString(),
      agentSessionId: json['agentSessionId']?.toString(),
      message: (() {
        final value = json['message']?.toString();
        if (value == null) {
          throw FormatException('ChatTurnCreateRequest.message is required');
        }
        return value;
      })(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      mode: json['mode']?.toString(),
      model: json['model']?.toString(),
      provider: json['provider']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'agentId': agentId,
      'agentSessionId': agentSessionId,
      'message': message,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'mode': mode,
      'model': model,
      'provider': provider,
    };
  }
}

class ChatTurnCreateResponse {
  final List<ChatMessageItem> messages;
  final ChatTurnItem turn;

  ChatTurnCreateResponse({
    required this.messages,
    required this.turn
  });

  factory ChatTurnCreateResponse.fromJson(Map<String, dynamic> json) {
    return ChatTurnCreateResponse(
      messages: (() {
        final list = _sdkworkAsList(json['messages']);
        if (list == null) {
          throw FormatException('ChatTurnCreateResponse.messages is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ChatMessageItem.fromJson(map);
      })())
            .whereType<ChatMessageItem>()
            .toList();
      })(),
      turn: (() {
        final map = _sdkworkAsMap(json['turn']);
        if (map == null) {
          throw FormatException('ChatTurnCreateResponse.turn is required');
        }
        return ChatTurnItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'messages': messages.map((item) => item.toJson()).toList(),
      'turn': turn.toJson(),
    };
  }
}

class ChatTurnItem {
  final String? agentId;
  final String? agentSessionId;
  final String conversationId;
  final String createdAt;
  final String id;
  final String? model;
  final String? provider;
  final String status;
  final String updatedAt;

  ChatTurnItem({
    this.agentId,
    this.agentSessionId,
    required this.conversationId,
    required this.createdAt,
    required this.id,
    this.model,
    this.provider,
    required this.status,
    required this.updatedAt
  });

  factory ChatTurnItem.fromJson(Map<String, dynamic> json) {
    return ChatTurnItem(
      agentId: json['agentId']?.toString(),
      agentSessionId: json['agentSessionId']?.toString(),
      conversationId: (() {
        final value = json['conversationId']?.toString();
        if (value == null) {
          throw FormatException('ChatTurnItem.conversationId is required');
        }
        return value;
      })(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('ChatTurnItem.createdAt is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('ChatTurnItem.id is required');
        }
        return value;
      })(),
      model: json['model']?.toString(),
      provider: json['provider']?.toString(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('ChatTurnItem.status is required');
        }
        return value;
      })(),
      updatedAt: (() {
        final value = json['updatedAt']?.toString();
        if (value == null) {
          throw FormatException('ChatTurnItem.updatedAt is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'agentId': agentId,
      'agentSessionId': agentSessionId,
      'conversationId': conversationId,
      'createdAt': createdAt,
      'id': id,
      'model': model,
      'provider': provider,
      'status': status,
      'updatedAt': updatedAt,
    };
  }
}

class ChatTurnResponseRequest {
  final String message;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? provider;
  final String? runtime;
  final String? runtimeInvocationId;
  final String? status;
  final Map<String, dynamic>? usage;
  final String? usageFactId;

  ChatTurnResponseRequest({
    required this.message,
    this.metadata,
    this.model,
    this.provider,
    this.runtime,
    this.runtimeInvocationId,
    this.status,
    this.usage,
    this.usageFactId
  });

  factory ChatTurnResponseRequest.fromJson(Map<String, dynamic> json) {
    return ChatTurnResponseRequest(
      message: (() {
        final value = json['message']?.toString();
        if (value == null) {
          throw FormatException('ChatTurnResponseRequest.message is required');
        }
        return value;
      })(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      model: json['model']?.toString(),
      provider: json['provider']?.toString(),
      runtime: json['runtime']?.toString(),
      runtimeInvocationId: json['runtimeInvocationId']?.toString(),
      status: json['status']?.toString(),
      usage: _sdkworkAsMap(json['usage']),
      usageFactId: json['usageFactId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'message': message,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'provider': provider,
      'runtime': runtime,
      'runtimeInvocationId': runtimeInvocationId,
      'status': status,
      'usage': usage,
      'usageFactId': usageFactId,
    };
  }
}

class CommentsCreateResult {
  final String code;
  final ForumCommentItem? data;
  final String? msg;

  CommentsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsCreateResult.fromJson(Map<String, dynamic> json) {
    return CommentsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CommentsDeleteResult {
  final String code;
  final NoData? data;
  final String? msg;

  CommentsDeleteResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsDeleteResult.fromJson(Map<String, dynamic> json) {
    return CommentsDeleteResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsDeleteResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : NoData.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CommentsLikesCreateResult {
  final String code;
  final ForumCommentItem? data;
  final String? msg;

  CommentsLikesCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsLikesCreateResult.fromJson(Map<String, dynamic> json) {
    return CommentsLikesCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsLikesCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CommentsLikesCurrentDeleteResult {
  final String code;
  final ForumCommentItem? data;
  final String? msg;

  CommentsLikesCurrentDeleteResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsLikesCurrentDeleteResult.fromJson(Map<String, dynamic> json) {
    return CommentsLikesCurrentDeleteResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsLikesCurrentDeleteResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CommentsListResult {
  final String code;
  final ForumCommentPage? data;
  final String? msg;

  CommentsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsListResult.fromJson(Map<String, dynamic> json) {
    return CommentsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentPage.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CommentsPinsCreateResult {
  final String code;
  final ForumCommentItem? data;
  final String? msg;

  CommentsPinsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsPinsCreateResult.fromJson(Map<String, dynamic> json) {
    return CommentsPinsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsPinsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CommentsPinsCurrentDeleteResult {
  final String code;
  final ForumCommentItem? data;
  final String? msg;

  CommentsPinsCurrentDeleteResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsPinsCurrentDeleteResult.fromJson(Map<String, dynamic> json) {
    return CommentsPinsCurrentDeleteResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsPinsCurrentDeleteResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CommentsRepliesListResult {
  final String code;
  final ForumCommentPage? data;
  final String? msg;

  CommentsRepliesListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsRepliesListResult.fromJson(Map<String, dynamic> json) {
    return CommentsRepliesListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsRepliesListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentPage.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CommentsReplyCreateResult {
  final String code;
  final ForumCommentItem? data;
  final String? msg;

  CommentsReplyCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsReplyCreateResult.fromJson(Map<String, dynamic> json) {
    return CommentsReplyCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsReplyCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CommentsRetrieveResult {
  final String code;
  final ForumCommentDetail? data;
  final String? msg;

  CommentsRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return CommentsRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentDetail.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CommentsStatisticsListResult {
  final String code;
  final ForumCommentStatistics? data;
  final String? msg;

  CommentsStatisticsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CommentsStatisticsListResult.fromJson(Map<String, dynamic> json) {
    return CommentsStatisticsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CommentsStatisticsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentStatistics.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ConversationMessagesListResult {
  final String code;
  final ChatMessageListResponse? data;
  final String? msg;

  ConversationMessagesListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ConversationMessagesListResult.fromJson(Map<String, dynamic> json) {
    return ConversationMessagesListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ConversationMessagesListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ChatMessageListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ConversationsCreateResult {
  final String code;
  final ChatConversationResponse? data;
  final String? msg;

  ConversationsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ConversationsCreateResult.fromJson(Map<String, dynamic> json) {
    return ConversationsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ConversationsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ChatConversationResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ConversationsListResult {
  final String code;
  final ChatConversationListResponse? data;
  final String? msg;

  ConversationsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ConversationsListResult.fromJson(Map<String, dynamic> json) {
    return ConversationsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ConversationsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ChatConversationListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ConversationsRetrieveResult {
  final String code;
  final ChatConversationItem? data;
  final String? msg;

  ConversationsRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ConversationsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return ConversationsRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ConversationsRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ChatConversationItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CourseApplicationCreateRequest {
  final String category;
  final String? contactEmail;
  final String? contactName;
  final String description;
  final String? externalBvid;
  final String? notes;
  final String sourceProvider;
  final String title;
  final MediaResource? video;

  CourseApplicationCreateRequest({
    required this.category,
    this.contactEmail,
    this.contactName,
    required this.description,
    this.externalBvid,
    this.notes,
    required this.sourceProvider,
    required this.title,
    this.video
  });

  factory CourseApplicationCreateRequest.fromJson(Map<String, dynamic> json) {
    return CourseApplicationCreateRequest(
      category: (() {
        final value = json['category']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateRequest.category is required');
        }
        return value;
      })(),
      contactEmail: json['contactEmail']?.toString(),
      contactName: json['contactName']?.toString(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateRequest.description is required');
        }
        return value;
      })(),
      externalBvid: json['externalBvid']?.toString(),
      notes: json['notes']?.toString(),
      sourceProvider: (() {
        final value = json['sourceProvider']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateRequest.sourceProvider is required');
        }
        return value;
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateRequest.title is required');
        }
        return value;
      })(),
      video: (() {
        final map = _sdkworkAsMap(json['video']);
        return map == null ? null : MediaResource.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'contactEmail': contactEmail,
      'contactName': contactName,
      'description': description,
      'externalBvid': externalBvid,
      'notes': notes,
      'sourceProvider': sourceProvider,
      'title': title,
      'video': video?.toJson(),
    };
  }
}

class CourseApplicationCreateResponse {
  final String applicationId;
  final String category;
  final String? contactEmail;
  final String? contactName;
  final String description;
  final String? externalBvid;
  final String id;
  final String sourceProvider;
  final String status;
  final String submittedAt;
  final String title;
  final MediaResource? video;

  CourseApplicationCreateResponse({
    required this.applicationId,
    required this.category,
    this.contactEmail,
    this.contactName,
    required this.description,
    this.externalBvid,
    required this.id,
    required this.sourceProvider,
    required this.status,
    required this.submittedAt,
    required this.title,
    this.video
  });

  factory CourseApplicationCreateResponse.fromJson(Map<String, dynamic> json) {
    return CourseApplicationCreateResponse(
      applicationId: (() {
        final value = json['applicationId']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateResponse.applicationId is required');
        }
        return value;
      })(),
      category: (() {
        final value = json['category']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateResponse.category is required');
        }
        return value;
      })(),
      contactEmail: json['contactEmail']?.toString(),
      contactName: json['contactName']?.toString(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateResponse.description is required');
        }
        return value;
      })(),
      externalBvid: json['externalBvid']?.toString(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateResponse.id is required');
        }
        return value;
      })(),
      sourceProvider: (() {
        final value = json['sourceProvider']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateResponse.sourceProvider is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateResponse.status is required');
        }
        return value;
      })(),
      submittedAt: (() {
        final value = json['submittedAt']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateResponse.submittedAt is required');
        }
        return value;
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationCreateResponse.title is required');
        }
        return value;
      })(),
      video: (() {
        final map = _sdkworkAsMap(json['video']);
        return map == null ? null : MediaResource.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'applicationId': applicationId,
      'category': category,
      'contactEmail': contactEmail,
      'contactName': contactName,
      'description': description,
      'externalBvid': externalBvid,
      'id': id,
      'sourceProvider': sourceProvider,
      'status': status,
      'submittedAt': submittedAt,
      'title': title,
      'video': video?.toJson(),
    };
  }
}

class CourseApplicationVideoUploadRequest {
  final String file;
  final String? fileName;

  CourseApplicationVideoUploadRequest({
    required this.file,
    this.fileName
  });

  factory CourseApplicationVideoUploadRequest.fromJson(Map<String, dynamic> json) {
    return CourseApplicationVideoUploadRequest(
      file: (() {
        final value = json['file']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationVideoUploadRequest.file is required');
        }
        return value;
      })(),
      fileName: json['fileName']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
      'fileName': fileName,
    };
  }
}

class CourseApplicationVideoUploadResponse {
  final String contentType;
  final String fileName;
  final String sha256;
  final String sizeBytes;
  final String uploadedAt;
  final MediaResource video;

  CourseApplicationVideoUploadResponse({
    required this.contentType,
    required this.fileName,
    required this.sha256,
    required this.sizeBytes,
    required this.uploadedAt,
    required this.video
  });

  factory CourseApplicationVideoUploadResponse.fromJson(Map<String, dynamic> json) {
    return CourseApplicationVideoUploadResponse(
      contentType: (() {
        final value = json['contentType']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationVideoUploadResponse.contentType is required');
        }
        return value;
      })(),
      fileName: (() {
        final value = json['fileName']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationVideoUploadResponse.fileName is required');
        }
        return value;
      })(),
      sha256: (() {
        final value = json['sha256']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationVideoUploadResponse.sha256 is required');
        }
        return value;
      })(),
      sizeBytes: (() {
        final value = json['sizeBytes']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationVideoUploadResponse.sizeBytes is required');
        }
        return value;
      })(),
      uploadedAt: (() {
        final value = json['uploadedAt']?.toString();
        if (value == null) {
          throw FormatException('CourseApplicationVideoUploadResponse.uploadedAt is required');
        }
        return value;
      })(),
      video: (() {
        final map = _sdkworkAsMap(json['video']);
        if (map == null) {
          throw FormatException('CourseApplicationVideoUploadResponse.video is required');
        }
        return MediaResource.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'contentType': contentType,
      'fileName': fileName,
      'sha256': sha256,
      'sizeBytes': sizeBytes,
      'uploadedAt': uploadedAt,
      'video': video.toJson(),
    };
  }
}

class CourseCategoryItem {
  final String code;
  final String courseCount;
  final String description;
  final String iconKey;
  final String id;
  final String label;
  final String name;
  final String sortWeight;

  CourseCategoryItem({
    required this.code,
    required this.courseCount,
    required this.description,
    required this.iconKey,
    required this.id,
    required this.label,
    required this.name,
    required this.sortWeight
  });

  factory CourseCategoryItem.fromJson(Map<String, dynamic> json) {
    return CourseCategoryItem(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CourseCategoryItem.code is required');
        }
        return value;
      })(),
      courseCount: (() {
        final value = json['courseCount']?.toString();
        if (value == null) {
          throw FormatException('CourseCategoryItem.courseCount is required');
        }
        return value;
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('CourseCategoryItem.description is required');
        }
        return value;
      })(),
      iconKey: (() {
        final value = json['iconKey']?.toString();
        if (value == null) {
          throw FormatException('CourseCategoryItem.iconKey is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('CourseCategoryItem.id is required');
        }
        return value;
      })(),
      label: (() {
        final value = json['label']?.toString();
        if (value == null) {
          throw FormatException('CourseCategoryItem.label is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('CourseCategoryItem.name is required');
        }
        return value;
      })(),
      sortWeight: (() {
        final value = json['sortWeight']?.toString();
        if (value == null) {
          throw FormatException('CourseCategoryItem.sortWeight is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'courseCount': courseCount,
      'description': description,
      'iconKey': iconKey,
      'id': id,
      'label': label,
      'name': name,
      'sortWeight': sortWeight,
    };
  }
}

class CourseDetail {
  final String category;
  final String categoryLabel;
  final String commentCount;
  final String content;
  final String contentId;
  final String courseCode;
  final String currency;
  final String description;
  final String durationText;
  final CourseEngagement engagement;
  final String externalBvid;
  final String id;
  final CourseInstructor instructor;
  final bool isCollection;
  final String lessonsCount;
  final String level;
  final String levelLabel;
  final String? priceAmount;
  final String publishedAt;
  final double ratingScore;
  final List<CourseItem> relatedCourses;
  final List<CourseSectionItem> sections;
  final CourseOverviewSource source;
  final String studentsCount;
  final List<String> tags;
  final MediaResource thumbnail;
  final String title;

  CourseDetail({
    required this.category,
    required this.categoryLabel,
    required this.commentCount,
    required this.content,
    required this.contentId,
    required this.courseCode,
    required this.currency,
    required this.description,
    required this.durationText,
    required this.engagement,
    required this.externalBvid,
    required this.id,
    required this.instructor,
    required this.isCollection,
    required this.lessonsCount,
    required this.level,
    required this.levelLabel,
    this.priceAmount,
    required this.publishedAt,
    required this.ratingScore,
    required this.relatedCourses,
    required this.sections,
    required this.source,
    required this.studentsCount,
    required this.tags,
    required this.thumbnail,
    required this.title
  });

  factory CourseDetail.fromJson(Map<String, dynamic> json) {
    return CourseDetail(
      category: (() {
        final value = json['category']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.category is required');
        }
        return value;
      })(),
      categoryLabel: (() {
        final value = json['categoryLabel']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.categoryLabel is required');
        }
        return value;
      })(),
      commentCount: (() {
        final value = json['commentCount']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.commentCount is required');
        }
        return value;
      })(),
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.content is required');
        }
        return value;
      })(),
      contentId: (() {
        final value = json['contentId']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.contentId is required');
        }
        return value;
      })(),
      courseCode: (() {
        final value = json['courseCode']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.courseCode is required');
        }
        return value;
      })(),
      currency: (() {
        final value = json['currency']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.currency is required');
        }
        return value;
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.description is required');
        }
        return value;
      })(),
      durationText: (() {
        final value = json['durationText']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.durationText is required');
        }
        return value;
      })(),
      engagement: (() {
        final map = _sdkworkAsMap(json['engagement']);
        if (map == null) {
          throw FormatException('CourseDetail.engagement is required');
        }
        return CourseEngagement.fromJson(map);
      })(),
      externalBvid: (() {
        final value = json['externalBvid']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.externalBvid is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.id is required');
        }
        return value;
      })(),
      instructor: (() {
        final map = _sdkworkAsMap(json['instructor']);
        if (map == null) {
          throw FormatException('CourseDetail.instructor is required');
        }
        return CourseInstructor.fromJson(map);
      })(),
      isCollection: (() {
        final value = json['isCollection'];
        if (value is! bool) {
          throw FormatException('CourseDetail.isCollection is required');
        }
        return value;
      })(),
      lessonsCount: (() {
        final value = json['lessonsCount']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.lessonsCount is required');
        }
        return value;
      })(),
      level: (() {
        final value = json['level']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.level is required');
        }
        return value;
      })(),
      levelLabel: (() {
        final value = json['levelLabel']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.levelLabel is required');
        }
        return value;
      })(),
      priceAmount: json['priceAmount']?.toString(),
      publishedAt: (() {
        final value = json['publishedAt']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.publishedAt is required');
        }
        return value;
      })(),
      ratingScore: (() {
        final value = json['ratingScore'];
        if (value is! num) {
          throw FormatException('CourseDetail.ratingScore is required');
        }
        return value.toDouble();
      })(),
      relatedCourses: (() {
        final list = _sdkworkAsList(json['relatedCourses']);
        if (list == null) {
          throw FormatException('CourseDetail.relatedCourses is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseItem.fromJson(map);
      })())
            .whereType<CourseItem>()
            .toList();
      })(),
      sections: (() {
        final list = _sdkworkAsList(json['sections']);
        if (list == null) {
          throw FormatException('CourseDetail.sections is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseSectionItem.fromJson(map);
      })())
            .whereType<CourseSectionItem>()
            .toList();
      })(),
      source: (() {
        final map = _sdkworkAsMap(json['source']);
        if (map == null) {
          throw FormatException('CourseDetail.source is required');
        }
        return CourseOverviewSource.fromJson(map);
      })(),
      studentsCount: (() {
        final value = json['studentsCount']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.studentsCount is required');
        }
        return value;
      })(),
      tags: (() {
        final list = _sdkworkAsList(json['tags']);
        if (list == null) {
          throw FormatException('CourseDetail.tags is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      thumbnail: (() {
        final map = _sdkworkAsMap(json['thumbnail']);
        if (map == null) {
          throw FormatException('CourseDetail.thumbnail is required');
        }
        return MediaResource.fromJson(map);
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('CourseDetail.title is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'categoryLabel': categoryLabel,
      'commentCount': commentCount,
      'content': content,
      'contentId': contentId,
      'courseCode': courseCode,
      'currency': currency,
      'description': description,
      'durationText': durationText,
      'engagement': engagement.toJson(),
      'externalBvid': externalBvid,
      'id': id,
      'instructor': instructor.toJson(),
      'isCollection': isCollection,
      'lessonsCount': lessonsCount,
      'level': level,
      'levelLabel': levelLabel,
      'priceAmount': priceAmount,
      'publishedAt': publishedAt,
      'ratingScore': ratingScore,
      'relatedCourses': relatedCourses.map((item) => item.toJson()).toList(),
      'sections': sections.map((item) => item.toJson()).toList(),
      'source': source.toJson(),
      'studentsCount': studentsCount,
      'tags': tags.map((item) => item).toList(),
      'thumbnail': thumbnail.toJson(),
      'title': title,
    };
  }
}

class CourseEngagement {
  final String discussions;
  final String likes;
  final String saves;
  final String shares;
  final String studentsCount;
  final String views;

  CourseEngagement({
    required this.discussions,
    required this.likes,
    required this.saves,
    required this.shares,
    required this.studentsCount,
    required this.views
  });

  factory CourseEngagement.fromJson(Map<String, dynamic> json) {
    return CourseEngagement(
      discussions: (() {
        final value = json['discussions']?.toString();
        if (value == null) {
          throw FormatException('CourseEngagement.discussions is required');
        }
        return value;
      })(),
      likes: (() {
        final value = json['likes']?.toString();
        if (value == null) {
          throw FormatException('CourseEngagement.likes is required');
        }
        return value;
      })(),
      saves: (() {
        final value = json['saves']?.toString();
        if (value == null) {
          throw FormatException('CourseEngagement.saves is required');
        }
        return value;
      })(),
      shares: (() {
        final value = json['shares']?.toString();
        if (value == null) {
          throw FormatException('CourseEngagement.shares is required');
        }
        return value;
      })(),
      studentsCount: (() {
        final value = json['studentsCount']?.toString();
        if (value == null) {
          throw FormatException('CourseEngagement.studentsCount is required');
        }
        return value;
      })(),
      views: (() {
        final value = json['views']?.toString();
        if (value == null) {
          throw FormatException('CourseEngagement.views is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'discussions': discussions,
      'likes': likes,
      'saves': saves,
      'shares': shares,
      'studentsCount': studentsCount,
      'views': views,
    };
  }
}

class CourseInstructor {
  final MediaResource avatar;
  final String bio;
  final String name;
  final String title;

  CourseInstructor({
    required this.avatar,
    required this.bio,
    required this.name,
    required this.title
  });

  factory CourseInstructor.fromJson(Map<String, dynamic> json) {
    return CourseInstructor(
      avatar: (() {
        final map = _sdkworkAsMap(json['avatar']);
        if (map == null) {
          throw FormatException('CourseInstructor.avatar is required');
        }
        return MediaResource.fromJson(map);
      })(),
      bio: (() {
        final value = json['bio']?.toString();
        if (value == null) {
          throw FormatException('CourseInstructor.bio is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('CourseInstructor.name is required');
        }
        return value;
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('CourseInstructor.title is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'avatar': avatar.toJson(),
      'bio': bio,
      'name': name,
      'title': title,
    };
  }
}

class CourseItem {
  final String category;
  final String categoryLabel;
  final String commentCount;
  final String content;
  final String contentId;
  final String courseCode;
  final String currency;
  final String description;
  final String durationText;
  final CourseEngagement engagement;
  final String externalBvid;
  final String id;
  final CourseInstructor instructor;
  final bool isCollection;
  final String lessonsCount;
  final String level;
  final String levelLabel;
  final String? priceAmount;
  final String publishedAt;
  final double ratingScore;
  final String studentsCount;
  final List<String> tags;
  final MediaResource thumbnail;
  final String title;

  CourseItem({
    required this.category,
    required this.categoryLabel,
    required this.commentCount,
    required this.content,
    required this.contentId,
    required this.courseCode,
    required this.currency,
    required this.description,
    required this.durationText,
    required this.engagement,
    required this.externalBvid,
    required this.id,
    required this.instructor,
    required this.isCollection,
    required this.lessonsCount,
    required this.level,
    required this.levelLabel,
    this.priceAmount,
    required this.publishedAt,
    required this.ratingScore,
    required this.studentsCount,
    required this.tags,
    required this.thumbnail,
    required this.title
  });

  factory CourseItem.fromJson(Map<String, dynamic> json) {
    return CourseItem(
      category: (() {
        final value = json['category']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.category is required');
        }
        return value;
      })(),
      categoryLabel: (() {
        final value = json['categoryLabel']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.categoryLabel is required');
        }
        return value;
      })(),
      commentCount: (() {
        final value = json['commentCount']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.commentCount is required');
        }
        return value;
      })(),
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.content is required');
        }
        return value;
      })(),
      contentId: (() {
        final value = json['contentId']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.contentId is required');
        }
        return value;
      })(),
      courseCode: (() {
        final value = json['courseCode']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.courseCode is required');
        }
        return value;
      })(),
      currency: (() {
        final value = json['currency']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.currency is required');
        }
        return value;
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.description is required');
        }
        return value;
      })(),
      durationText: (() {
        final value = json['durationText']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.durationText is required');
        }
        return value;
      })(),
      engagement: (() {
        final map = _sdkworkAsMap(json['engagement']);
        if (map == null) {
          throw FormatException('CourseItem.engagement is required');
        }
        return CourseEngagement.fromJson(map);
      })(),
      externalBvid: (() {
        final value = json['externalBvid']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.externalBvid is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.id is required');
        }
        return value;
      })(),
      instructor: (() {
        final map = _sdkworkAsMap(json['instructor']);
        if (map == null) {
          throw FormatException('CourseItem.instructor is required');
        }
        return CourseInstructor.fromJson(map);
      })(),
      isCollection: (() {
        final value = json['isCollection'];
        if (value is! bool) {
          throw FormatException('CourseItem.isCollection is required');
        }
        return value;
      })(),
      lessonsCount: (() {
        final value = json['lessonsCount']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.lessonsCount is required');
        }
        return value;
      })(),
      level: (() {
        final value = json['level']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.level is required');
        }
        return value;
      })(),
      levelLabel: (() {
        final value = json['levelLabel']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.levelLabel is required');
        }
        return value;
      })(),
      priceAmount: json['priceAmount']?.toString(),
      publishedAt: (() {
        final value = json['publishedAt']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.publishedAt is required');
        }
        return value;
      })(),
      ratingScore: (() {
        final value = json['ratingScore'];
        if (value is! num) {
          throw FormatException('CourseItem.ratingScore is required');
        }
        return value.toDouble();
      })(),
      studentsCount: (() {
        final value = json['studentsCount']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.studentsCount is required');
        }
        return value;
      })(),
      tags: (() {
        final list = _sdkworkAsList(json['tags']);
        if (list == null) {
          throw FormatException('CourseItem.tags is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      thumbnail: (() {
        final map = _sdkworkAsMap(json['thumbnail']);
        if (map == null) {
          throw FormatException('CourseItem.thumbnail is required');
        }
        return MediaResource.fromJson(map);
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('CourseItem.title is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'categoryLabel': categoryLabel,
      'commentCount': commentCount,
      'content': content,
      'contentId': contentId,
      'courseCode': courseCode,
      'currency': currency,
      'description': description,
      'durationText': durationText,
      'engagement': engagement.toJson(),
      'externalBvid': externalBvid,
      'id': id,
      'instructor': instructor.toJson(),
      'isCollection': isCollection,
      'lessonsCount': lessonsCount,
      'level': level,
      'levelLabel': levelLabel,
      'priceAmount': priceAmount,
      'publishedAt': publishedAt,
      'ratingScore': ratingScore,
      'studentsCount': studentsCount,
      'tags': tags.map((item) => item).toList(),
      'thumbnail': thumbnail.toJson(),
      'title': title,
    };
  }
}

class CourseLessonItem {
  final String content;
  final String description;
  final String durationSeconds;
  final String durationText;
  final String externalBvid;
  final bool freePreview;
  final String id;
  final String lessonId;
  final String lessonNo;
  final String number;
  final String sortOrder;
  final String sourceProvider;
  final String title;
  final MediaResource video;

  CourseLessonItem({
    required this.content,
    required this.description,
    required this.durationSeconds,
    required this.durationText,
    required this.externalBvid,
    required this.freePreview,
    required this.id,
    required this.lessonId,
    required this.lessonNo,
    required this.number,
    required this.sortOrder,
    required this.sourceProvider,
    required this.title,
    required this.video
  });

  factory CourseLessonItem.fromJson(Map<String, dynamic> json) {
    return CourseLessonItem(
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.content is required');
        }
        return value;
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.description is required');
        }
        return value;
      })(),
      durationSeconds: (() {
        final value = json['durationSeconds']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.durationSeconds is required');
        }
        return value;
      })(),
      durationText: (() {
        final value = json['durationText']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.durationText is required');
        }
        return value;
      })(),
      externalBvid: (() {
        final value = json['externalBvid']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.externalBvid is required');
        }
        return value;
      })(),
      freePreview: (() {
        final value = json['freePreview'];
        if (value is! bool) {
          throw FormatException('CourseLessonItem.freePreview is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.id is required');
        }
        return value;
      })(),
      lessonId: (() {
        final value = json['lessonId']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.lessonId is required');
        }
        return value;
      })(),
      lessonNo: (() {
        final value = json['lessonNo']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.lessonNo is required');
        }
        return value;
      })(),
      number: (() {
        final value = json['number']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.number is required');
        }
        return value;
      })(),
      sortOrder: (() {
        final value = json['sortOrder']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.sortOrder is required');
        }
        return value;
      })(),
      sourceProvider: (() {
        final value = json['sourceProvider']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.sourceProvider is required');
        }
        return value;
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('CourseLessonItem.title is required');
        }
        return value;
      })(),
      video: (() {
        final map = _sdkworkAsMap(json['video']);
        if (map == null) {
          throw FormatException('CourseLessonItem.video is required');
        }
        return MediaResource.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'description': description,
      'durationSeconds': durationSeconds,
      'durationText': durationText,
      'externalBvid': externalBvid,
      'freePreview': freePreview,
      'id': id,
      'lessonId': lessonId,
      'lessonNo': lessonNo,
      'number': number,
      'sortOrder': sortOrder,
      'sourceProvider': sourceProvider,
      'title': title,
      'video': video.toJson(),
    };
  }
}

class CourseListResponse {
  final List<CourseItem> content;
  final List<CourseItem> items;
  final String page;
  final String size;
  final String totalElements;

  CourseListResponse({
    required this.content,
    required this.items,
    required this.page,
    required this.size,
    required this.totalElements
  });

  factory CourseListResponse.fromJson(Map<String, dynamic> json) {
    return CourseListResponse(
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          throw FormatException('CourseListResponse.content is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseItem.fromJson(map);
      })())
            .whereType<CourseItem>()
            .toList();
      })(),
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('CourseListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseItem.fromJson(map);
      })())
            .whereType<CourseItem>()
            .toList();
      })(),
      page: (() {
        final value = json['page']?.toString();
        if (value == null) {
          throw FormatException('CourseListResponse.page is required');
        }
        return value;
      })(),
      size: (() {
        final value = json['size']?.toString();
        if (value == null) {
          throw FormatException('CourseListResponse.size is required');
        }
        return value;
      })(),
      totalElements: (() {
        final value = json['totalElements']?.toString();
        if (value == null) {
          throw FormatException('CourseListResponse.totalElements is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content.map((item) => item.toJson()).toList(),
      'items': items.map((item) => item.toJson()).toList(),
      'page': page,
      'size': size,
      'totalElements': totalElements,
    };
  }
}

class CourseOverview {
  final CourseOverviewSource source;
  final CourseOverviewStats stats;

  CourseOverview({
    required this.source,
    required this.stats
  });

  factory CourseOverview.fromJson(Map<String, dynamic> json) {
    return CourseOverview(
      source: (() {
        final map = _sdkworkAsMap(json['source']);
        if (map == null) {
          throw FormatException('CourseOverview.source is required');
        }
        return CourseOverviewSource.fromJson(map);
      })(),
      stats: (() {
        final map = _sdkworkAsMap(json['stats']);
        if (map == null) {
          throw FormatException('CourseOverview.stats is required');
        }
        return CourseOverviewStats.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'source': source.toJson(),
      'stats': stats.toJson(),
    };
  }
}

class CourseOverviewSource {
  final String observedAt;
  final String sourceDescription;
  final String sourceLabel;
  final List<String> sourceTables;

  CourseOverviewSource({
    required this.observedAt,
    required this.sourceDescription,
    required this.sourceLabel,
    required this.sourceTables
  });

  factory CourseOverviewSource.fromJson(Map<String, dynamic> json) {
    return CourseOverviewSource(
      observedAt: (() {
        final value = json['observedAt']?.toString();
        if (value == null) {
          throw FormatException('CourseOverviewSource.observedAt is required');
        }
        return value;
      })(),
      sourceDescription: (() {
        final value = json['sourceDescription']?.toString();
        if (value == null) {
          throw FormatException('CourseOverviewSource.sourceDescription is required');
        }
        return value;
      })(),
      sourceLabel: (() {
        final value = json['sourceLabel']?.toString();
        if (value == null) {
          throw FormatException('CourseOverviewSource.sourceLabel is required');
        }
        return value;
      })(),
      sourceTables: (() {
        final list = _sdkworkAsList(json['sourceTables']);
        if (list == null) {
          throw FormatException('CourseOverviewSource.sourceTables is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'observedAt': observedAt,
      'sourceDescription': sourceDescription,
      'sourceLabel': sourceLabel,
      'sourceTables': sourceTables.map((item) => item).toList(),
    };
  }
}

class CourseOverviewStats {
  final String totalCategories;
  final String totalCourses;
  final String totalLessons;
  final String totalStudents;

  CourseOverviewStats({
    required this.totalCategories,
    required this.totalCourses,
    required this.totalLessons,
    required this.totalStudents
  });

  factory CourseOverviewStats.fromJson(Map<String, dynamic> json) {
    return CourseOverviewStats(
      totalCategories: (() {
        final value = json['totalCategories']?.toString();
        if (value == null) {
          throw FormatException('CourseOverviewStats.totalCategories is required');
        }
        return value;
      })(),
      totalCourses: (() {
        final value = json['totalCourses']?.toString();
        if (value == null) {
          throw FormatException('CourseOverviewStats.totalCourses is required');
        }
        return value;
      })(),
      totalLessons: (() {
        final value = json['totalLessons']?.toString();
        if (value == null) {
          throw FormatException('CourseOverviewStats.totalLessons is required');
        }
        return value;
      })(),
      totalStudents: (() {
        final value = json['totalStudents']?.toString();
        if (value == null) {
          throw FormatException('CourseOverviewStats.totalStudents is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'totalCategories': totalCategories,
      'totalCourses': totalCourses,
      'totalLessons': totalLessons,
      'totalStudents': totalStudents,
    };
  }
}

class CourseSectionItem {
  final String description;
  final String durationSeconds;
  final String id;
  final String lessonCount;
  final List<CourseLessonItem> lessons;
  final String sectionId;
  final String sectionNo;
  final String sortOrder;
  final String title;

  CourseSectionItem({
    required this.description,
    required this.durationSeconds,
    required this.id,
    required this.lessonCount,
    required this.lessons,
    required this.sectionId,
    required this.sectionNo,
    required this.sortOrder,
    required this.title
  });

  factory CourseSectionItem.fromJson(Map<String, dynamic> json) {
    return CourseSectionItem(
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('CourseSectionItem.description is required');
        }
        return value;
      })(),
      durationSeconds: (() {
        final value = json['durationSeconds']?.toString();
        if (value == null) {
          throw FormatException('CourseSectionItem.durationSeconds is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('CourseSectionItem.id is required');
        }
        return value;
      })(),
      lessonCount: (() {
        final value = json['lessonCount']?.toString();
        if (value == null) {
          throw FormatException('CourseSectionItem.lessonCount is required');
        }
        return value;
      })(),
      lessons: (() {
        final list = _sdkworkAsList(json['lessons']);
        if (list == null) {
          throw FormatException('CourseSectionItem.lessons is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseLessonItem.fromJson(map);
      })())
            .whereType<CourseLessonItem>()
            .toList();
      })(),
      sectionId: (() {
        final value = json['sectionId']?.toString();
        if (value == null) {
          throw FormatException('CourseSectionItem.sectionId is required');
        }
        return value;
      })(),
      sectionNo: (() {
        final value = json['sectionNo']?.toString();
        if (value == null) {
          throw FormatException('CourseSectionItem.sectionNo is required');
        }
        return value;
      })(),
      sortOrder: (() {
        final value = json['sortOrder']?.toString();
        if (value == null) {
          throw FormatException('CourseSectionItem.sortOrder is required');
        }
        return value;
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('CourseSectionItem.title is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'durationSeconds': durationSeconds,
      'id': id,
      'lessonCount': lessonCount,
      'lessons': lessons.map((item) => item.toJson()).toList(),
      'sectionId': sectionId,
      'sectionNo': sectionNo,
      'sortOrder': sortOrder,
      'title': title,
    };
  }
}

class CoursesCategoriesListResult {
  final String code;
  final List<CourseCategoryItem>? data;
  final String? msg;

  CoursesCategoriesListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CoursesCategoriesListResult.fromJson(Map<String, dynamic> json) {
    return CoursesCategoriesListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CoursesCategoriesListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseCategoryItem.fromJson(map);
      })())
            .whereType<CourseCategoryItem>()
            .toList();
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'msg': msg,
    };
  }
}

class CoursesListResult {
  final String code;
  final CourseListResponse? data;
  final String? msg;

  CoursesListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CoursesListResult.fromJson(Map<String, dynamic> json) {
    return CoursesListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CoursesListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CourseListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CoursesOverviewRetrieveResult {
  final String code;
  final CourseOverview? data;
  final String? msg;

  CoursesOverviewRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CoursesOverviewRetrieveResult.fromJson(Map<String, dynamic> json) {
    return CoursesOverviewRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CoursesOverviewRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CourseOverview.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CoursesRetrieveResult {
  final String code;
  final CourseDetail? data;
  final String? msg;

  CoursesRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory CoursesRetrieveResult.fromJson(Map<String, dynamic> json) {
    return CoursesRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('CoursesRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CourseDetail.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class CreateApiKeyRequest {
  final String channelGroup;
  final bool? defaultForRuntime;
  final String? expires;
  final String? ipLimit;
  final bool? isUnlimitedQuota;
  final List<String>? modalities;
  final String name;
  final String? quota;

  CreateApiKeyRequest({
    required this.channelGroup,
    this.defaultForRuntime,
    this.expires,
    this.ipLimit,
    this.isUnlimitedQuota,
    this.modalities,
    required this.name,
    this.quota
  });

  factory CreateApiKeyRequest.fromJson(Map<String, dynamic> json) {
    return CreateApiKeyRequest(
      channelGroup: (() {
        final value = json['channelGroup']?.toString();
        if (value == null) {
          throw FormatException('CreateApiKeyRequest.channelGroup is required');
        }
        return value;
      })(),
      defaultForRuntime: json['defaultForRuntime'] is bool ? json['defaultForRuntime'] : null,
      expires: json['expires']?.toString(),
      ipLimit: json['ipLimit']?.toString(),
      isUnlimitedQuota: json['isUnlimitedQuota'] is bool ? json['isUnlimitedQuota'] : null,
      modalities: (() {
        final list = _sdkworkAsList(json['modalities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('CreateApiKeyRequest.name is required');
        }
        return value;
      })(),
      quota: json['quota']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'channelGroup': channelGroup,
      'defaultForRuntime': defaultForRuntime,
      'expires': expires,
      'ipLimit': ipLimit,
      'isUnlimitedQuota': isUnlimitedQuota,
      'modalities': modalities?.map((item) => item).toList(),
      'name': name,
      'quota': quota,
    };
  }
}

class CreateApiKeyResponse {
  final AppApiKeyItem item;
  final String rawKey;

  CreateApiKeyResponse({
    required this.item,
    required this.rawKey
  });

  factory CreateApiKeyResponse.fromJson(Map<String, dynamic> json) {
    return CreateApiKeyResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('CreateApiKeyResponse.item is required');
        }
        return AppApiKeyItem.fromJson(map);
      })(),
      rawKey: (() {
        final value = json['rawKey']?.toString();
        if (value == null) {
          throw FormatException('CreateApiKeyResponse.rawKey is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
      'rawKey': rawKey,
    };
  }
}

class DashboardAnnouncement {
  final String id;
  final String text;
  final String time;
  final String type;

  DashboardAnnouncement({
    required this.id,
    required this.text,
    required this.time,
    required this.type
  });

  factory DashboardAnnouncement.fromJson(Map<String, dynamic> json) {
    return DashboardAnnouncement(
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('DashboardAnnouncement.id is required');
        }
        return value;
      })(),
      text: (() {
        final value = json['text']?.toString();
        if (value == null) {
          throw FormatException('DashboardAnnouncement.text is required');
        }
        return value;
      })(),
      time: (() {
        final value = json['time']?.toString();
        if (value == null) {
          throw FormatException('DashboardAnnouncement.time is required');
        }
        return value;
      })(),
      type: (() {
        final value = json['type']?.toString();
        if (value == null) {
          throw FormatException('DashboardAnnouncement.type is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'text': text,
      'time': time,
      'type': type,
    };
  }
}

class DashboardChartPoint {
  final double audioWhisper;
  final double imageMidjourneyDallE;
  final double llmText;
  final double musicSuno;
  final String time;
  final double videoRunwaySora;

  DashboardChartPoint({
    required this.audioWhisper,
    required this.imageMidjourneyDallE,
    required this.llmText,
    required this.musicSuno,
    required this.time,
    required this.videoRunwaySora
  });

  factory DashboardChartPoint.fromJson(Map<String, dynamic> json) {
    return DashboardChartPoint(
      audioWhisper: (() {
        final value = json['audio (Whisper)'];
        if (value is! num) {
          throw FormatException('DashboardChartPoint.audio (Whisper) is required');
        }
        return value.toDouble();
      })(),
      imageMidjourneyDallE: (() {
        final value = json['image (Midjourney/DALL-E)'];
        if (value is! num) {
          throw FormatException('DashboardChartPoint.image (Midjourney/DALL-E) is required');
        }
        return value.toDouble();
      })(),
      llmText: (() {
        final value = json['llm (Text)'];
        if (value is! num) {
          throw FormatException('DashboardChartPoint.llm (Text) is required');
        }
        return value.toDouble();
      })(),
      musicSuno: (() {
        final value = json['music (Suno)'];
        if (value is! num) {
          throw FormatException('DashboardChartPoint.music (Suno) is required');
        }
        return value.toDouble();
      })(),
      time: (() {
        final value = json['time']?.toString();
        if (value == null) {
          throw FormatException('DashboardChartPoint.time is required');
        }
        return value;
      })(),
      videoRunwaySora: (() {
        final value = json['video (Runway/Sora)'];
        if (value is! num) {
          throw FormatException('DashboardChartPoint.video (Runway/Sora) is required');
        }
        return value.toDouble();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audio (Whisper)': audioWhisper,
      'image (Midjourney/DALL-E)': imageMidjourneyDallE,
      'llm (Text)': llmText,
      'music (Suno)': musicSuno,
      'time': time,
      'video (Runway/Sora)': videoRunwaySora,
    };
  }
}

class DashboardConfigurationDomain {
  final String domain;
  final String id;
  final String ip;
  final String name;
  final String remark;
  final String status;

  DashboardConfigurationDomain({
    required this.domain,
    required this.id,
    required this.ip,
    required this.name,
    required this.remark,
    required this.status
  });

  factory DashboardConfigurationDomain.fromJson(Map<String, dynamic> json) {
    return DashboardConfigurationDomain(
      domain: (() {
        final value = json['domain']?.toString();
        if (value == null) {
          throw FormatException('DashboardConfigurationDomain.domain is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('DashboardConfigurationDomain.id is required');
        }
        return value;
      })(),
      ip: (() {
        final value = json['ip']?.toString();
        if (value == null) {
          throw FormatException('DashboardConfigurationDomain.ip is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('DashboardConfigurationDomain.name is required');
        }
        return value;
      })(),
      remark: (() {
        final value = json['remark']?.toString();
        if (value == null) {
          throw FormatException('DashboardConfigurationDomain.remark is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('DashboardConfigurationDomain.status is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'domain': domain,
      'id': id,
      'ip': ip,
      'name': name,
      'remark': remark,
      'status': status,
    };
  }
}

class DashboardOverviewResponse {
  final List<DashboardAnnouncement> announcements;
  final List<DashboardChartPoint> chartData;
  final List<DashboardConfigurationDomain>? configurationDomains;
  final List<DashboardSparklinePoint> multimodalSparkline;
  final List<DashboardSparklinePoint> performanceSparkline;
  final List<DashboardSparklinePoint> requestSparkline;
  final DashboardOverviewSummary summary;
  final List<DashboardTopModel> topModels;
  final List<String> warnings;

  DashboardOverviewResponse({
    required this.announcements,
    required this.chartData,
    this.configurationDomains,
    required this.multimodalSparkline,
    required this.performanceSparkline,
    required this.requestSparkline,
    required this.summary,
    required this.topModels,
    required this.warnings
  });

  factory DashboardOverviewResponse.fromJson(Map<String, dynamic> json) {
    return DashboardOverviewResponse(
      announcements: (() {
        final list = _sdkworkAsList(json['announcements']);
        if (list == null) {
          throw FormatException('DashboardOverviewResponse.announcements is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardAnnouncement.fromJson(map);
      })())
            .whereType<DashboardAnnouncement>()
            .toList();
      })(),
      chartData: (() {
        final list = _sdkworkAsList(json['chartData']);
        if (list == null) {
          throw FormatException('DashboardOverviewResponse.chartData is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardChartPoint.fromJson(map);
      })())
            .whereType<DashboardChartPoint>()
            .toList();
      })(),
      configurationDomains: (() {
        final list = _sdkworkAsList(json['configurationDomains']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardConfigurationDomain.fromJson(map);
      })())
            .whereType<DashboardConfigurationDomain>()
            .toList();
      })(),
      multimodalSparkline: (() {
        final list = _sdkworkAsList(json['multimodalSparkline']);
        if (list == null) {
          throw FormatException('DashboardOverviewResponse.multimodalSparkline is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardSparklinePoint.fromJson(map);
      })())
            .whereType<DashboardSparklinePoint>()
            .toList();
      })(),
      performanceSparkline: (() {
        final list = _sdkworkAsList(json['performanceSparkline']);
        if (list == null) {
          throw FormatException('DashboardOverviewResponse.performanceSparkline is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardSparklinePoint.fromJson(map);
      })())
            .whereType<DashboardSparklinePoint>()
            .toList();
      })(),
      requestSparkline: (() {
        final list = _sdkworkAsList(json['requestSparkline']);
        if (list == null) {
          throw FormatException('DashboardOverviewResponse.requestSparkline is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardSparklinePoint.fromJson(map);
      })())
            .whereType<DashboardSparklinePoint>()
            .toList();
      })(),
      summary: (() {
        final map = _sdkworkAsMap(json['summary']);
        if (map == null) {
          throw FormatException('DashboardOverviewResponse.summary is required');
        }
        return DashboardOverviewSummary.fromJson(map);
      })(),
      topModels: (() {
        final list = _sdkworkAsList(json['topModels']);
        if (list == null) {
          throw FormatException('DashboardOverviewResponse.topModels is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardTopModel.fromJson(map);
      })())
            .whereType<DashboardTopModel>()
            .toList();
      })(),
      warnings: (() {
        final list = _sdkworkAsList(json['warnings']);
        if (list == null) {
          throw FormatException('DashboardOverviewResponse.warnings is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'announcements': announcements.map((item) => item.toJson()).toList(),
      'chartData': chartData.map((item) => item.toJson()).toList(),
      'configurationDomains': configurationDomains?.map((item) => item.toJson()).toList(),
      'multimodalSparkline': multimodalSparkline.map((item) => item.toJson()).toList(),
      'performanceSparkline': performanceSparkline.map((item) => item.toJson()).toList(),
      'requestSparkline': requestSparkline.map((item) => item.toJson()).toList(),
      'summary': summary.toJson(),
      'topModels': topModels.map((item) => item.toJson()).toList(),
      'warnings': warnings.map((item) => item).toList(),
    };
  }
}

class DashboardOverviewRetrieveResult {
  final String code;
  final DashboardOverviewResponse? data;
  final String? msg;

  DashboardOverviewRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory DashboardOverviewRetrieveResult.fromJson(Map<String, dynamic> json) {
    return DashboardOverviewRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('DashboardOverviewRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : DashboardOverviewResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class DashboardOverviewSummary {
  final String audioRequests;
  final double availableCredits;
  final String errorCount;
  final String imageRequests;
  final String musicRequests;
  final String requestCount;
  final double rpm;
  final String totalRequestCount;
  final double totalUsedCredits;
  final double tpm;
  final double usedCredits;
  final String videoRequests;

  DashboardOverviewSummary({
    required this.audioRequests,
    required this.availableCredits,
    required this.errorCount,
    required this.imageRequests,
    required this.musicRequests,
    required this.requestCount,
    required this.rpm,
    required this.totalRequestCount,
    required this.totalUsedCredits,
    required this.tpm,
    required this.usedCredits,
    required this.videoRequests
  });

  factory DashboardOverviewSummary.fromJson(Map<String, dynamic> json) {
    return DashboardOverviewSummary(
      audioRequests: (() {
        final value = json['audioRequests']?.toString();
        if (value == null) {
          throw FormatException('DashboardOverviewSummary.audioRequests is required');
        }
        return value;
      })(),
      availableCredits: (() {
        final value = json['availableCredits'];
        if (value is! num) {
          throw FormatException('DashboardOverviewSummary.availableCredits is required');
        }
        return value.toDouble();
      })(),
      errorCount: (() {
        final value = json['errorCount']?.toString();
        if (value == null) {
          throw FormatException('DashboardOverviewSummary.errorCount is required');
        }
        return value;
      })(),
      imageRequests: (() {
        final value = json['imageRequests']?.toString();
        if (value == null) {
          throw FormatException('DashboardOverviewSummary.imageRequests is required');
        }
        return value;
      })(),
      musicRequests: (() {
        final value = json['musicRequests']?.toString();
        if (value == null) {
          throw FormatException('DashboardOverviewSummary.musicRequests is required');
        }
        return value;
      })(),
      requestCount: (() {
        final value = json['requestCount']?.toString();
        if (value == null) {
          throw FormatException('DashboardOverviewSummary.requestCount is required');
        }
        return value;
      })(),
      rpm: (() {
        final value = json['rpm'];
        if (value is! num) {
          throw FormatException('DashboardOverviewSummary.rpm is required');
        }
        return value.toDouble();
      })(),
      totalRequestCount: (() {
        final value = json['totalRequestCount']?.toString();
        if (value == null) {
          throw FormatException('DashboardOverviewSummary.totalRequestCount is required');
        }
        return value;
      })(),
      totalUsedCredits: (() {
        final value = json['totalUsedCredits'];
        if (value is! num) {
          throw FormatException('DashboardOverviewSummary.totalUsedCredits is required');
        }
        return value.toDouble();
      })(),
      tpm: (() {
        final value = json['tpm'];
        if (value is! num) {
          throw FormatException('DashboardOverviewSummary.tpm is required');
        }
        return value.toDouble();
      })(),
      usedCredits: (() {
        final value = json['usedCredits'];
        if (value is! num) {
          throw FormatException('DashboardOverviewSummary.usedCredits is required');
        }
        return value.toDouble();
      })(),
      videoRequests: (() {
        final value = json['videoRequests']?.toString();
        if (value == null) {
          throw FormatException('DashboardOverviewSummary.videoRequests is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audioRequests': audioRequests,
      'availableCredits': availableCredits,
      'errorCount': errorCount,
      'imageRequests': imageRequests,
      'musicRequests': musicRequests,
      'requestCount': requestCount,
      'rpm': rpm,
      'totalRequestCount': totalRequestCount,
      'totalUsedCredits': totalUsedCredits,
      'tpm': tpm,
      'usedCredits': usedCredits,
      'videoRequests': videoRequests,
    };
  }
}

class DashboardSparklinePoint {
  final double value;

  DashboardSparklinePoint({
    required this.value
  });

  factory DashboardSparklinePoint.fromJson(Map<String, dynamic> json) {
    return DashboardSparklinePoint(
      value: (() {
        final value = json['value'];
        if (value is! num) {
          throw FormatException('DashboardSparklinePoint.value is required');
        }
        return value.toDouble();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'value': value,
    };
  }
}

class DashboardTopModel {
  final double cost;
  final bool isUp;
  final String modality;
  final String name;
  final String rank;
  final String requests;
  final String supplier;
  final String trend;

  DashboardTopModel({
    required this.cost,
    required this.isUp,
    required this.modality,
    required this.name,
    required this.rank,
    required this.requests,
    required this.supplier,
    required this.trend
  });

  factory DashboardTopModel.fromJson(Map<String, dynamic> json) {
    return DashboardTopModel(
      cost: (() {
        final value = json['cost'];
        if (value is! num) {
          throw FormatException('DashboardTopModel.cost is required');
        }
        return value.toDouble();
      })(),
      isUp: (() {
        final value = json['isUp'];
        if (value is! bool) {
          throw FormatException('DashboardTopModel.isUp is required');
        }
        return value;
      })(),
      modality: (() {
        final value = json['modality']?.toString();
        if (value == null) {
          throw FormatException('DashboardTopModel.modality is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('DashboardTopModel.name is required');
        }
        return value;
      })(),
      rank: (() {
        final value = json['rank']?.toString();
        if (value == null) {
          throw FormatException('DashboardTopModel.rank is required');
        }
        return value;
      })(),
      requests: (() {
        final value = json['requests']?.toString();
        if (value == null) {
          throw FormatException('DashboardTopModel.requests is required');
        }
        return value;
      })(),
      supplier: (() {
        final value = json['supplier']?.toString();
        if (value == null) {
          throw FormatException('DashboardTopModel.supplier is required');
        }
        return value;
      })(),
      trend: (() {
        final value = json['trend']?.toString();
        if (value == null) {
          throw FormatException('DashboardTopModel.trend is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cost': cost,
      'isUp': isUp,
      'modality': modality,
      'name': name,
      'rank': rank,
      'requests': requests,
      'supplier': supplier,
      'trend': trend,
    };
  }
}

class DeleteApiKeyResponse {
  final bool deleted;
  final String id;

  DeleteApiKeyResponse({
    required this.deleted,
    required this.id
  });

  factory DeleteApiKeyResponse.fromJson(Map<String, dynamic> json) {
    return DeleteApiKeyResponse(
      deleted: (() {
        final value = json['deleted'];
        if (value is! bool) {
          throw FormatException('DeleteApiKeyResponse.deleted is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('DeleteApiKeyResponse.id is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'deleted': deleted,
      'id': id,
    };
  }
}

class DocumentationCreateResult {
  final String code;
  final SdkReferenceDocumentationResponse? data;
  final String? msg;

  DocumentationCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory DocumentationCreateResult.fromJson(Map<String, dynamic> json) {
    return DocumentationCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('DocumentationCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SdkReferenceDocumentationResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class EntriesCreateResult {
  final String code;
  final MemoryEntryResponse? data;
  final String? msg;

  EntriesCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory EntriesCreateResult.fromJson(Map<String, dynamic> json) {
    return EntriesCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('EntriesCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : MemoryEntryResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class EntriesListResult {
  final String code;
  final MemoryEntryListResponse? data;
  final String? msg;

  EntriesListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory EntriesListResult.fromJson(Map<String, dynamic> json) {
    return EntriesListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('EntriesListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : MemoryEntryListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class EntriesRetrieveResult {
  final String code;
  final MemoryEntryItem? data;
  final String? msg;

  EntriesRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory EntriesRetrieveResult.fromJson(Map<String, dynamic> json) {
    return EntriesRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('EntriesRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : MemoryEntryItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class FeedsCategoryRetrieveResult {
  final String code;
  final List<ForumFeedItem>? data;
  final String? msg;

  FeedsCategoryRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsCategoryRetrieveResult.fromJson(Map<String, dynamic> json) {
    return FeedsCategoryRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsCategoryRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'msg': msg,
    };
  }
}

class FeedsCollectionsCreateResult {
  final String code;
  final ForumFeedItem? data;
  final String? msg;

  FeedsCollectionsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsCollectionsCreateResult.fromJson(Map<String, dynamic> json) {
    return FeedsCollectionsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsCollectionsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class FeedsCollectionsCurrentDeleteResult {
  final String code;
  final ForumFeedItem? data;
  final String? msg;

  FeedsCollectionsCurrentDeleteResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsCollectionsCurrentDeleteResult.fromJson(Map<String, dynamic> json) {
    return FeedsCollectionsCurrentDeleteResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsCollectionsCurrentDeleteResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class FeedsCollectionsCurrentRetrieveResult {
  final String code;
  final bool? data;
  final String? msg;

  FeedsCollectionsCurrentRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsCollectionsCurrentRetrieveResult.fromJson(Map<String, dynamic> json) {
    return FeedsCollectionsCurrentRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsCollectionsCurrentRetrieveResult.code is required');
        }
        return value;
      })(),
      data: json['data'] is bool ? json['data'] : null,
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data,
      'msg': msg,
    };
  }
}

class FeedsCreateResult {
  final String code;
  final ForumFeedItem? data;
  final String? msg;

  FeedsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsCreateResult.fromJson(Map<String, dynamic> json) {
    return FeedsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class FeedsDeleteResult {
  final String code;
  final bool? data;
  final String? msg;

  FeedsDeleteResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsDeleteResult.fromJson(Map<String, dynamic> json) {
    return FeedsDeleteResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsDeleteResult.code is required');
        }
        return value;
      })(),
      data: json['data'] is bool ? json['data'] : null,
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data,
      'msg': msg,
    };
  }
}

class FeedsHotListResult {
  final String code;
  final List<ForumFeedItem>? data;
  final String? msg;

  FeedsHotListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsHotListResult.fromJson(Map<String, dynamic> json) {
    return FeedsHotListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsHotListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'msg': msg,
    };
  }
}

class FeedsLikesCreateResult {
  final String code;
  final ForumFeedItem? data;
  final String? msg;

  FeedsLikesCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsLikesCreateResult.fromJson(Map<String, dynamic> json) {
    return FeedsLikesCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsLikesCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class FeedsLikesCurrentDeleteResult {
  final String code;
  final ForumFeedItem? data;
  final String? msg;

  FeedsLikesCurrentDeleteResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsLikesCurrentDeleteResult.fromJson(Map<String, dynamic> json) {
    return FeedsLikesCurrentDeleteResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsLikesCurrentDeleteResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class FeedsListResult {
  final String code;
  final List<ForumFeedItem>? data;
  final String? msg;

  FeedsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsListResult.fromJson(Map<String, dynamic> json) {
    return FeedsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'msg': msg,
    };
  }
}

class FeedsMostLikedListResult {
  final String code;
  final List<ForumFeedItem>? data;
  final String? msg;

  FeedsMostLikedListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsMostLikedListResult.fromJson(Map<String, dynamic> json) {
    return FeedsMostLikedListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsMostLikedListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'msg': msg,
    };
  }
}

class FeedsMostViewedListResult {
  final String code;
  final List<ForumFeedItem>? data;
  final String? msg;

  FeedsMostViewedListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsMostViewedListResult.fromJson(Map<String, dynamic> json) {
    return FeedsMostViewedListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsMostViewedListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'msg': msg,
    };
  }
}

class FeedsOverviewRetrieveResult {
  final String code;
  final ForumOverviewResponse? data;
  final String? msg;

  FeedsOverviewRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsOverviewRetrieveResult.fromJson(Map<String, dynamic> json) {
    return FeedsOverviewRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsOverviewRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumOverviewResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class FeedsRecommendListResult {
  final String code;
  final List<ForumFeedItem>? data;
  final String? msg;

  FeedsRecommendListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsRecommendListResult.fromJson(Map<String, dynamic> json) {
    return FeedsRecommendListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsRecommendListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'msg': msg,
    };
  }
}

class FeedsRetrieveResult {
  final String code;
  final ForumFeedItem? data;
  final String? msg;

  FeedsRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return FeedsRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class FeedsSharesCreateResult {
  final String code;
  final ForumFeedItem? data;
  final String? msg;

  FeedsSharesCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsSharesCreateResult.fromJson(Map<String, dynamic> json) {
    return FeedsSharesCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsSharesCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class FeedsTopListResult {
  final String code;
  final List<ForumFeedItem>? data;
  final String? msg;

  FeedsTopListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory FeedsTopListResult.fromJson(Map<String, dynamic> json) {
    return FeedsTopListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('FeedsTopListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'msg': msg,
    };
  }
}

class FieldError {
  final String? code;
  final String? field;
  final String? message;

  FieldError({
    this.code,
    this.field,
    this.message
  });

  factory FieldError.fromJson(Map<String, dynamic> json) {
    return FieldError(
      code: json['code']?.toString(),
      field: json['field']?.toString(),
      message: json['message']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'field': field,
      'message': message,
    };
  }
}

class ForumAuthor {
  final MediaResource? avatar;
  final String? bio;
  final String id;
  final bool isFollowing;
  final String name;

  ForumAuthor({
    this.avatar,
    this.bio,
    required this.id,
    required this.isFollowing,
    required this.name
  });

  factory ForumAuthor.fromJson(Map<String, dynamic> json) {
    return ForumAuthor(
      avatar: (() {
        final map = _sdkworkAsMap(json['avatar']);
        return map == null ? null : MediaResource.fromJson(map);
      })(),
      bio: json['bio']?.toString(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('ForumAuthor.id is required');
        }
        return value;
      })(),
      isFollowing: (() {
        final value = json['isFollowing'];
        if (value is! bool) {
          throw FormatException('ForumAuthor.isFollowing is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('ForumAuthor.name is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'avatar': avatar?.toJson(),
      'bio': bio,
      'id': id,
      'isFollowing': isFollowing,
      'name': name,
    };
  }
}

class ForumCommentDetail {
  final ForumAuthor author;
  final String commentId;
  final String content;
  final String contentId;
  final String contentType;
  final String createdAt;
  final String deviceInfo;
  final String ipAddress;
  final bool isTop;
  final String likes;
  final String? parentId;
  final List<ForumCommentItem> replies;
  final String replyCount;
  final String status;
  final String updatedAt;
  final String userId;

  ForumCommentDetail({
    required this.author,
    required this.commentId,
    required this.content,
    required this.contentId,
    required this.contentType,
    required this.createdAt,
    required this.deviceInfo,
    required this.ipAddress,
    required this.isTop,
    required this.likes,
    this.parentId,
    required this.replies,
    required this.replyCount,
    required this.status,
    required this.updatedAt,
    required this.userId
  });

  factory ForumCommentDetail.fromJson(Map<String, dynamic> json) {
    return ForumCommentDetail(
      author: (() {
        final map = _sdkworkAsMap(json['author']);
        if (map == null) {
          throw FormatException('ForumCommentDetail.author is required');
        }
        return ForumAuthor.fromJson(map);
      })(),
      commentId: (() {
        final value = json['commentId']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.commentId is required');
        }
        return value;
      })(),
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.content is required');
        }
        return value;
      })(),
      contentId: (() {
        final value = json['contentId']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.contentId is required');
        }
        return value;
      })(),
      contentType: (() {
        final value = json['contentType']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.contentType is required');
        }
        return value;
      })(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.createdAt is required');
        }
        return value;
      })(),
      deviceInfo: (() {
        final value = json['deviceInfo']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.deviceInfo is required');
        }
        return value;
      })(),
      ipAddress: (() {
        final value = json['ipAddress']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.ipAddress is required');
        }
        return value;
      })(),
      isTop: (() {
        final value = json['isTop'];
        if (value is! bool) {
          throw FormatException('ForumCommentDetail.isTop is required');
        }
        return value;
      })(),
      likes: (() {
        final value = json['likes']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.likes is required');
        }
        return value;
      })(),
      parentId: json['parentId']?.toString(),
      replies: (() {
        final list = _sdkworkAsList(json['replies']);
        if (list == null) {
          throw FormatException('ForumCommentDetail.replies is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })())
            .whereType<ForumCommentItem>()
            .toList();
      })(),
      replyCount: (() {
        final value = json['replyCount']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.replyCount is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.status is required');
        }
        return value;
      })(),
      updatedAt: (() {
        final value = json['updatedAt']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.updatedAt is required');
        }
        return value;
      })(),
      userId: (() {
        final value = json['userId']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentDetail.userId is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'author': author.toJson(),
      'commentId': commentId,
      'content': content,
      'contentId': contentId,
      'contentType': contentType,
      'createdAt': createdAt,
      'deviceInfo': deviceInfo,
      'ipAddress': ipAddress,
      'isTop': isTop,
      'likes': likes,
      'parentId': parentId,
      'replies': replies.map((item) => item.toJson()).toList(),
      'replyCount': replyCount,
      'status': status,
      'updatedAt': updatedAt,
      'userId': userId,
    };
  }
}

class ForumCommentItem {
  final ForumAuthor author;
  final String commentId;
  final String content;
  final String contentId;
  final String contentType;
  final String createdAt;
  final bool isTop;
  final String likes;
  final String? parentId;
  final String replyCount;
  final String status;
  final String userId;

  ForumCommentItem({
    required this.author,
    required this.commentId,
    required this.content,
    required this.contentId,
    required this.contentType,
    required this.createdAt,
    required this.isTop,
    required this.likes,
    this.parentId,
    required this.replyCount,
    required this.status,
    required this.userId
  });

  factory ForumCommentItem.fromJson(Map<String, dynamic> json) {
    return ForumCommentItem(
      author: (() {
        final map = _sdkworkAsMap(json['author']);
        if (map == null) {
          throw FormatException('ForumCommentItem.author is required');
        }
        return ForumAuthor.fromJson(map);
      })(),
      commentId: (() {
        final value = json['commentId']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentItem.commentId is required');
        }
        return value;
      })(),
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentItem.content is required');
        }
        return value;
      })(),
      contentId: (() {
        final value = json['contentId']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentItem.contentId is required');
        }
        return value;
      })(),
      contentType: (() {
        final value = json['contentType']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentItem.contentType is required');
        }
        return value;
      })(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentItem.createdAt is required');
        }
        return value;
      })(),
      isTop: (() {
        final value = json['isTop'];
        if (value is! bool) {
          throw FormatException('ForumCommentItem.isTop is required');
        }
        return value;
      })(),
      likes: (() {
        final value = json['likes']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentItem.likes is required');
        }
        return value;
      })(),
      parentId: json['parentId']?.toString(),
      replyCount: (() {
        final value = json['replyCount']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentItem.replyCount is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentItem.status is required');
        }
        return value;
      })(),
      userId: (() {
        final value = json['userId']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentItem.userId is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'author': author.toJson(),
      'commentId': commentId,
      'content': content,
      'contentId': contentId,
      'contentType': contentType,
      'createdAt': createdAt,
      'isTop': isTop,
      'likes': likes,
      'parentId': parentId,
      'replyCount': replyCount,
      'status': status,
      'userId': userId,
    };
  }
}

class ForumCommentPage {
  final List<ForumCommentItem> content;
  final List<ForumCommentItem> items;
  final String page;
  final String size;
  final String totalElements;

  ForumCommentPage({
    required this.content,
    required this.items,
    required this.page,
    required this.size,
    required this.totalElements
  });

  factory ForumCommentPage.fromJson(Map<String, dynamic> json) {
    return ForumCommentPage(
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          throw FormatException('ForumCommentPage.content is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })())
            .whereType<ForumCommentItem>()
            .toList();
      })(),
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('ForumCommentPage.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })())
            .whereType<ForumCommentItem>()
            .toList();
      })(),
      page: (() {
        final value = json['page']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentPage.page is required');
        }
        return value;
      })(),
      size: (() {
        final value = json['size']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentPage.size is required');
        }
        return value;
      })(),
      totalElements: (() {
        final value = json['totalElements']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentPage.totalElements is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content.map((item) => item.toJson()).toList(),
      'items': items.map((item) => item.toJson()).toList(),
      'page': page,
      'size': size,
      'totalElements': totalElements,
    };
  }
}

class ForumCommentStatistics {
  final String totalComments;

  ForumCommentStatistics({
    required this.totalComments
  });

  factory ForumCommentStatistics.fromJson(Map<String, dynamic> json) {
    return ForumCommentStatistics(
      totalComments: (() {
        final value = json['totalComments']?.toString();
        if (value == null) {
          throw FormatException('ForumCommentStatistics.totalComments is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'totalComments': totalComments,
    };
  }
}

class ForumCommunityLink {
  final String id;
  final String label;
  final MediaResource? qrCode;
  final String tone;
  final String url;

  ForumCommunityLink({
    required this.id,
    required this.label,
    this.qrCode,
    required this.tone,
    required this.url
  });

  factory ForumCommunityLink.fromJson(Map<String, dynamic> json) {
    return ForumCommunityLink(
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('ForumCommunityLink.id is required');
        }
        return value;
      })(),
      label: (() {
        final value = json['label']?.toString();
        if (value == null) {
          throw FormatException('ForumCommunityLink.label is required');
        }
        return value;
      })(),
      qrCode: (() {
        final map = _sdkworkAsMap(json['qrCode']);
        return map == null ? null : MediaResource.fromJson(map);
      })(),
      tone: (() {
        final value = json['tone']?.toString();
        if (value == null) {
          throw FormatException('ForumCommunityLink.tone is required');
        }
        return value;
      })(),
      url: (() {
        final value = json['url']?.toString();
        if (value == null) {
          throw FormatException('ForumCommunityLink.url is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'label': label,
      'qrCode': qrCode?.toJson(),
      'tone': tone,
      'url': url,
    };
  }
}

class ForumCreateCommentRequest {
  final String content;
  final String contentId;
  final String contentType;
  final String? deviceInfo;

  ForumCreateCommentRequest({
    required this.content,
    required this.contentId,
    required this.contentType,
    this.deviceInfo
  });

  factory ForumCreateCommentRequest.fromJson(Map<String, dynamic> json) {
    return ForumCreateCommentRequest(
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('ForumCreateCommentRequest.content is required');
        }
        return value;
      })(),
      contentId: (() {
        final value = json['contentId']?.toString();
        if (value == null) {
          throw FormatException('ForumCreateCommentRequest.contentId is required');
        }
        return value;
      })(),
      contentType: (() {
        final value = json['contentType']?.toString();
        if (value == null) {
          throw FormatException('ForumCreateCommentRequest.contentType is required');
        }
        return value;
      })(),
      deviceInfo: json['deviceInfo']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'contentId': contentId,
      'contentType': contentType,
      'deviceInfo': deviceInfo,
    };
  }
}

class ForumCreateFeedRequest {
  final String? categoryId;
  final String content;
  final List<MediaResource>? images;
  final String? source;
  final String? sourceUrl;
  final List<String>? tags;
  final String? title;

  ForumCreateFeedRequest({
    this.categoryId,
    required this.content,
    this.images,
    this.source,
    this.sourceUrl,
    this.tags,
    this.title
  });

  factory ForumCreateFeedRequest.fromJson(Map<String, dynamic> json) {
    return ForumCreateFeedRequest(
      categoryId: json['categoryId']?.toString(),
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('ForumCreateFeedRequest.content is required');
        }
        return value;
      })(),
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MediaResource.fromJson(map);
      })())
            .whereType<MediaResource>()
            .toList();
      })(),
      source: json['source']?.toString(),
      sourceUrl: json['sourceUrl']?.toString(),
      tags: (() {
        final list = _sdkworkAsList(json['tags']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      title: json['title']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'categoryId': categoryId,
      'content': content,
      'images': images?.map((item) => item.toJson()).toList(),
      'source': source,
      'sourceUrl': sourceUrl,
      'tags': tags?.map((item) => item).toList(),
      'title': title,
    };
  }
}

class ForumFeedItem {
  final ForumAuthor author;
  final String categoryId;
  final String commentCount;
  final String content;
  final String contentType;
  final MediaResource cover;
  final String createdAt;
  final String id;
  final bool isCollected;
  final bool isHot;
  final bool isLiked;
  final bool isRecommended;
  final bool isTop;
  final String likeCount;
  final String shareCount;
  final String summary;
  final List<String> tags;
  final String title;
  final String updatedAt;
  final String viewCount;

  ForumFeedItem({
    required this.author,
    required this.categoryId,
    required this.commentCount,
    required this.content,
    required this.contentType,
    required this.cover,
    required this.createdAt,
    required this.id,
    required this.isCollected,
    required this.isHot,
    required this.isLiked,
    required this.isRecommended,
    required this.isTop,
    required this.likeCount,
    required this.shareCount,
    required this.summary,
    required this.tags,
    required this.title,
    required this.updatedAt,
    required this.viewCount
  });

  factory ForumFeedItem.fromJson(Map<String, dynamic> json) {
    return ForumFeedItem(
      author: (() {
        final map = _sdkworkAsMap(json['author']);
        if (map == null) {
          throw FormatException('ForumFeedItem.author is required');
        }
        return ForumAuthor.fromJson(map);
      })(),
      categoryId: (() {
        final value = json['categoryId']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.categoryId is required');
        }
        return value;
      })(),
      commentCount: (() {
        final value = json['commentCount']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.commentCount is required');
        }
        return value;
      })(),
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.content is required');
        }
        return value;
      })(),
      contentType: (() {
        final value = json['contentType']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.contentType is required');
        }
        return value;
      })(),
      cover: (() {
        final map = _sdkworkAsMap(json['cover']);
        if (map == null) {
          throw FormatException('ForumFeedItem.cover is required');
        }
        return MediaResource.fromJson(map);
      })(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.createdAt is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.id is required');
        }
        return value;
      })(),
      isCollected: (() {
        final value = json['isCollected'];
        if (value is! bool) {
          throw FormatException('ForumFeedItem.isCollected is required');
        }
        return value;
      })(),
      isHot: (() {
        final value = json['isHot'];
        if (value is! bool) {
          throw FormatException('ForumFeedItem.isHot is required');
        }
        return value;
      })(),
      isLiked: (() {
        final value = json['isLiked'];
        if (value is! bool) {
          throw FormatException('ForumFeedItem.isLiked is required');
        }
        return value;
      })(),
      isRecommended: (() {
        final value = json['isRecommended'];
        if (value is! bool) {
          throw FormatException('ForumFeedItem.isRecommended is required');
        }
        return value;
      })(),
      isTop: (() {
        final value = json['isTop'];
        if (value is! bool) {
          throw FormatException('ForumFeedItem.isTop is required');
        }
        return value;
      })(),
      likeCount: (() {
        final value = json['likeCount']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.likeCount is required');
        }
        return value;
      })(),
      shareCount: (() {
        final value = json['shareCount']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.shareCount is required');
        }
        return value;
      })(),
      summary: (() {
        final value = json['summary']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.summary is required');
        }
        return value;
      })(),
      tags: (() {
        final list = _sdkworkAsList(json['tags']);
        if (list == null) {
          throw FormatException('ForumFeedItem.tags is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.title is required');
        }
        return value;
      })(),
      updatedAt: (() {
        final value = json['updatedAt']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.updatedAt is required');
        }
        return value;
      })(),
      viewCount: (() {
        final value = json['viewCount']?.toString();
        if (value == null) {
          throw FormatException('ForumFeedItem.viewCount is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'author': author.toJson(),
      'categoryId': categoryId,
      'commentCount': commentCount,
      'content': content,
      'contentType': contentType,
      'cover': cover.toJson(),
      'createdAt': createdAt,
      'id': id,
      'isCollected': isCollected,
      'isHot': isHot,
      'isLiked': isLiked,
      'isRecommended': isRecommended,
      'isTop': isTop,
      'likeCount': likeCount,
      'shareCount': shareCount,
      'summary': summary,
      'tags': tags.map((item) => item).toList(),
      'title': title,
      'updatedAt': updatedAt,
      'viewCount': viewCount,
    };
  }
}

class ForumOverviewResponse {
  final List<ForumCommunityLink> communityLinks;
  final ForumOverviewSource source;
  final ForumOverviewStats stats;

  ForumOverviewResponse({
    required this.communityLinks,
    required this.source,
    required this.stats
  });

  factory ForumOverviewResponse.fromJson(Map<String, dynamic> json) {
    return ForumOverviewResponse(
      communityLinks: (() {
        final list = _sdkworkAsList(json['communityLinks']);
        if (list == null) {
          throw FormatException('ForumOverviewResponse.communityLinks is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumCommunityLink.fromJson(map);
      })())
            .whereType<ForumCommunityLink>()
            .toList();
      })(),
      source: (() {
        final map = _sdkworkAsMap(json['source']);
        if (map == null) {
          throw FormatException('ForumOverviewResponse.source is required');
        }
        return ForumOverviewSource.fromJson(map);
      })(),
      stats: (() {
        final map = _sdkworkAsMap(json['stats']);
        if (map == null) {
          throw FormatException('ForumOverviewResponse.stats is required');
        }
        return ForumOverviewStats.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'communityLinks': communityLinks.map((item) => item.toJson()).toList(),
      'source': source.toJson(),
      'stats': stats.toJson(),
    };
  }
}

class ForumOverviewSource {
  final String observedAt;
  final String sourceDescription;
  final String sourceLabel;
  final List<String> sourceTables;

  ForumOverviewSource({
    required this.observedAt,
    required this.sourceDescription,
    required this.sourceLabel,
    required this.sourceTables
  });

  factory ForumOverviewSource.fromJson(Map<String, dynamic> json) {
    return ForumOverviewSource(
      observedAt: (() {
        final value = json['observedAt']?.toString();
        if (value == null) {
          throw FormatException('ForumOverviewSource.observedAt is required');
        }
        return value;
      })(),
      sourceDescription: (() {
        final value = json['sourceDescription']?.toString();
        if (value == null) {
          throw FormatException('ForumOverviewSource.sourceDescription is required');
        }
        return value;
      })(),
      sourceLabel: (() {
        final value = json['sourceLabel']?.toString();
        if (value == null) {
          throw FormatException('ForumOverviewSource.sourceLabel is required');
        }
        return value;
      })(),
      sourceTables: (() {
        final list = _sdkworkAsList(json['sourceTables']);
        if (list == null) {
          throw FormatException('ForumOverviewSource.sourceTables is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'observedAt': observedAt,
      'sourceDescription': sourceDescription,
      'sourceLabel': sourceLabel,
      'sourceTables': sourceTables.map((item) => item).toList(),
    };
  }
}

class ForumOverviewStats {
  final String memberCount;
  final String onlineMembers;
  final String totalComments;
  final String totalPosts;

  ForumOverviewStats({
    required this.memberCount,
    required this.onlineMembers,
    required this.totalComments,
    required this.totalPosts
  });

  factory ForumOverviewStats.fromJson(Map<String, dynamic> json) {
    return ForumOverviewStats(
      memberCount: (() {
        final value = json['memberCount']?.toString();
        if (value == null) {
          throw FormatException('ForumOverviewStats.memberCount is required');
        }
        return value;
      })(),
      onlineMembers: (() {
        final value = json['onlineMembers']?.toString();
        if (value == null) {
          throw FormatException('ForumOverviewStats.onlineMembers is required');
        }
        return value;
      })(),
      totalComments: (() {
        final value = json['totalComments']?.toString();
        if (value == null) {
          throw FormatException('ForumOverviewStats.totalComments is required');
        }
        return value;
      })(),
      totalPosts: (() {
        final value = json['totalPosts']?.toString();
        if (value == null) {
          throw FormatException('ForumOverviewStats.totalPosts is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'memberCount': memberCount,
      'onlineMembers': onlineMembers,
      'totalComments': totalComments,
      'totalPosts': totalPosts,
    };
  }
}

class ForumReplyCommentRequest {
  final String content;
  final String? deviceInfo;

  ForumReplyCommentRequest({
    required this.content,
    this.deviceInfo
  });

  factory ForumReplyCommentRequest.fromJson(Map<String, dynamic> json) {
    return ForumReplyCommentRequest(
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('ForumReplyCommentRequest.content is required');
        }
        return value;
      })(),
      deviceInfo: json['deviceInfo']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'deviceInfo': deviceInfo,
    };
  }
}

class GatewayTrace {
  final String channel;
  final String duration;
  final String endpoint;
  final String id;
  final String ip;
  final String method;
  final int status;
  final String time;

  GatewayTrace({
    required this.channel,
    required this.duration,
    required this.endpoint,
    required this.id,
    required this.ip,
    required this.method,
    required this.status,
    required this.time
  });

  factory GatewayTrace.fromJson(Map<String, dynamic> json) {
    return GatewayTrace(
      channel: (() {
        final value = json['channel']?.toString();
        if (value == null) {
          throw FormatException('GatewayTrace.channel is required');
        }
        return value;
      })(),
      duration: (() {
        final value = json['duration']?.toString();
        if (value == null) {
          throw FormatException('GatewayTrace.duration is required');
        }
        return value;
      })(),
      endpoint: (() {
        final value = json['endpoint']?.toString();
        if (value == null) {
          throw FormatException('GatewayTrace.endpoint is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('GatewayTrace.id is required');
        }
        return value;
      })(),
      ip: (() {
        final value = json['ip']?.toString();
        if (value == null) {
          throw FormatException('GatewayTrace.ip is required');
        }
        return value;
      })(),
      method: (() {
        final value = json['method']?.toString();
        if (value == null) {
          throw FormatException('GatewayTrace.method is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status'];
        if (value is! int) {
          throw FormatException('GatewayTrace.status is required');
        }
        return value;
      })(),
      time: (() {
        final value = json['time']?.toString();
        if (value == null) {
          throw FormatException('GatewayTrace.time is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'channel': channel,
      'duration': duration,
      'endpoint': endpoint,
      'id': id,
      'ip': ip,
      'method': method,
      'status': status,
      'time': time,
    };
  }
}

class GatewayTracesListResult {
  final String code;
  final GatewayTracesResponse? data;
  final String? msg;

  GatewayTracesListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory GatewayTracesListResult.fromJson(Map<String, dynamic> json) {
    return GatewayTracesListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('GatewayTracesListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : GatewayTracesResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class GatewayTracesResponse {
  final List<GatewayTrace> items;

  GatewayTracesResponse({
    required this.items
  });

  factory GatewayTracesResponse.fromJson(Map<String, dynamic> json) {
    return GatewayTracesResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('GatewayTracesResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GatewayTrace.fromJson(map);
      })())
            .whereType<GatewayTrace>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class GenerationHistoryItem {
  final String? aspectRatio;
  final MediaResource? asset;
  final String? createdAt;
  final String date;
  final int? durationSeconds;
  final String id;
  final List<MediaResource> images;
  final String? modelCatalogKey;
  final String? modelInfo;
  final String? outputText;
  final String prompt;
  final String? status;
  final String type;
  final String? updatedAt;
  final List<MediaResource> videos;

  GenerationHistoryItem({
    this.aspectRatio,
    this.asset,
    this.createdAt,
    required this.date,
    this.durationSeconds,
    required this.id,
    required this.images,
    this.modelCatalogKey,
    this.modelInfo,
    this.outputText,
    required this.prompt,
    this.status,
    required this.type,
    this.updatedAt,
    required this.videos
  });

  factory GenerationHistoryItem.fromJson(Map<String, dynamic> json) {
    return GenerationHistoryItem(
      aspectRatio: json['aspectRatio']?.toString(),
      asset: (() {
        final map = _sdkworkAsMap(json['asset']);
        return map == null ? null : MediaResource.fromJson(map);
      })(),
      createdAt: json['createdAt']?.toString(),
      date: (() {
        final value = json['date']?.toString();
        if (value == null) {
          throw FormatException('GenerationHistoryItem.date is required');
        }
        return value;
      })(),
      durationSeconds: json['durationSeconds'] is int ? json['durationSeconds'] : null,
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('GenerationHistoryItem.id is required');
        }
        return value;
      })(),
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          throw FormatException('GenerationHistoryItem.images is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MediaResource.fromJson(map);
      })())
            .whereType<MediaResource>()
            .toList();
      })(),
      modelCatalogKey: json['modelCatalogKey']?.toString(),
      modelInfo: json['modelInfo']?.toString(),
      outputText: json['outputText']?.toString(),
      prompt: (() {
        final value = json['prompt']?.toString();
        if (value == null) {
          throw FormatException('GenerationHistoryItem.prompt is required');
        }
        return value;
      })(),
      status: json['status']?.toString(),
      type: (() {
        final value = json['type']?.toString();
        if (value == null) {
          throw FormatException('GenerationHistoryItem.type is required');
        }
        return value;
      })(),
      updatedAt: json['updatedAt']?.toString(),
      videos: (() {
        final list = _sdkworkAsList(json['videos']);
        if (list == null) {
          throw FormatException('GenerationHistoryItem.videos is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MediaResource.fromJson(map);
      })())
            .whereType<MediaResource>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aspectRatio': aspectRatio,
      'asset': asset?.toJson(),
      'createdAt': createdAt,
      'date': date,
      'durationSeconds': durationSeconds,
      'id': id,
      'images': images.map((item) => item.toJson()).toList(),
      'modelCatalogKey': modelCatalogKey,
      'modelInfo': modelInfo,
      'outputText': outputText,
      'prompt': prompt,
      'status': status,
      'type': type,
      'updatedAt': updatedAt,
      'videos': videos.map((item) => item.toJson()).toList(),
    };
  }
}

class GenerationHistoryResponse {
  final List<GenerationHistoryItem> items;

  GenerationHistoryResponse({
    required this.items
  });

  factory GenerationHistoryResponse.fromJson(Map<String, dynamic> json) {
    return GenerationHistoryResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('GenerationHistoryResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GenerationHistoryItem.fromJson(map);
      })())
            .whereType<GenerationHistoryItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class GenerationListResult {
  final String code;
  final GenerationHistoryResponse? data;
  final String? msg;

  GenerationListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory GenerationListResult.fromJson(Map<String, dynamic> json) {
    return GenerationListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('GenerationListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : GenerationHistoryResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class InvocationEventStreamsListResult {
  final String code;
  final RuntimeEventListResponse? data;
  final String? msg;

  InvocationEventStreamsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory InvocationEventStreamsListResult.fromJson(Map<String, dynamic> json) {
    return InvocationEventStreamsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('InvocationEventStreamsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RuntimeEventListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class InvocationEventsCreateResult {
  final String code;
  final RuntimeEventResponse? data;
  final String? msg;

  InvocationEventsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory InvocationEventsCreateResult.fromJson(Map<String, dynamic> json) {
    return InvocationEventsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('InvocationEventsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RuntimeEventResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class InvocationEventsListResult {
  final String code;
  final RuntimeEventListResponse? data;
  final String? msg;

  InvocationEventsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory InvocationEventsListResult.fromJson(Map<String, dynamic> json) {
    return InvocationEventsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('InvocationEventsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RuntimeEventListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class InvocationsCreateResult {
  final String code;
  final RuntimeInvocationResponse? data;
  final String? msg;

  InvocationsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory InvocationsCreateResult.fromJson(Map<String, dynamic> json) {
    return InvocationsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('InvocationsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RuntimeInvocationResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class InvocationsListResult {
  final String code;
  final RuntimeInvocationListResponse? data;
  final String? msg;

  InvocationsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory InvocationsListResult.fromJson(Map<String, dynamic> json) {
    return InvocationsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('InvocationsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RuntimeInvocationListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class InvocationsRetrieveResult {
  final String code;
  final RuntimeInvocationItem? data;
  final String? msg;

  InvocationsRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory InvocationsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return InvocationsRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('InvocationsRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RuntimeInvocationItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class InvocationsSubmitResult {
  final String code;
  final RuntimeInvocationResponse? data;
  final String? msg;

  InvocationsSubmitResult({
    required this.code,
    this.data,
    this.msg
  });

  factory InvocationsSubmitResult.fromJson(Map<String, dynamic> json) {
    return InvocationsSubmitResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('InvocationsSubmitResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RuntimeInvocationResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class MediaAccess {
  final String? expiresAt;
  final String visibility;

  MediaAccess({
    this.expiresAt,
    required this.visibility
  });

  factory MediaAccess.fromJson(Map<String, dynamic> json) {
    return MediaAccess(
      expiresAt: json['expiresAt']?.toString(),
      visibility: (() {
        final value = json['visibility']?.toString();
        if (value == null) {
          throw FormatException('MediaAccess.visibility is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'expiresAt': expiresAt,
      'visibility': visibility,
    };
  }
}

class MediaAiProvenance {
  final String? generationTaskId;
  final String? model;
  final String? moderationStatus;
  final String? promptId;
  final String? provenance;
  final String? provider;
  final List<String>? safetyLabels;
  final String? seed;
  final List<String>? sourceMediaIds;

  MediaAiProvenance({
    this.generationTaskId,
    this.model,
    this.moderationStatus,
    this.promptId,
    this.provenance,
    this.provider,
    this.safetyLabels,
    this.seed,
    this.sourceMediaIds
  });

  factory MediaAiProvenance.fromJson(Map<String, dynamic> json) {
    return MediaAiProvenance(
      generationTaskId: json['generationTaskId']?.toString(),
      model: json['model']?.toString(),
      moderationStatus: json['moderationStatus']?.toString(),
      promptId: json['promptId']?.toString(),
      provenance: json['provenance']?.toString(),
      provider: json['provider']?.toString(),
      safetyLabels: (() {
        final list = _sdkworkAsList(json['safetyLabels']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      seed: json['seed']?.toString(),
      sourceMediaIds: (() {
        final list = _sdkworkAsList(json['sourceMediaIds']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'generationTaskId': generationTaskId,
      'model': model,
      'moderationStatus': moderationStatus,
      'promptId': promptId,
      'provenance': provenance,
      'provider': provider,
      'safetyLabels': safetyLabels?.map((item) => item).toList(),
      'seed': seed,
      'sourceMediaIds': sourceMediaIds?.map((item) => item).toList(),
    };
  }
}

class MediaChecksum {
  final String algorithm;
  final String value;

  MediaChecksum({
    required this.algorithm,
    required this.value
  });

  factory MediaChecksum.fromJson(Map<String, dynamic> json) {
    return MediaChecksum(
      algorithm: (() {
        final value = json['algorithm']?.toString();
        if (value == null) {
          throw FormatException('MediaChecksum.algorithm is required');
        }
        return value;
      })(),
      value: (() {
        final value = json['value']?.toString();
        if (value == null) {
          throw FormatException('MediaChecksum.value is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'algorithm': algorithm,
      'value': value,
    };
  }
}

class MediaResource {
  final MediaAccess? access;
  final MediaAiProvenance? ai;
  final String? altText;
  final String? bucketId;
  final MediaChecksum? checksum;
  final double? durationSeconds;
  final String? fileName;
  final int? height;
  final String? id;
  final String kind;
  final Map<String, dynamic>? metadata;
  final String? mimeType;
  final String? objectBlobId;
  final String? objectKey;
  final String? objectVersion;
  final MediaResource? poster;
  final String? publicUrl;
  final String? sizeBytes;
  final String source;
  final List<MediaResource>? thumbnails;
  final String? title;
  final String? uri;
  final String? url;
  final List<MediaResource>? variants;
  final int? width;

  MediaResource({
    this.access,
    this.ai,
    this.altText,
    this.bucketId,
    this.checksum,
    this.durationSeconds,
    this.fileName,
    this.height,
    this.id,
    required this.kind,
    this.metadata,
    this.mimeType,
    this.objectBlobId,
    this.objectKey,
    this.objectVersion,
    this.poster,
    this.publicUrl,
    this.sizeBytes,
    required this.source,
    this.thumbnails,
    this.title,
    this.uri,
    this.url,
    this.variants,
    this.width
  });

  factory MediaResource.fromJson(Map<String, dynamic> json) {
    return MediaResource(
      access: (() {
        final map = _sdkworkAsMap(json['access']);
        return map == null ? null : MediaAccess.fromJson(map);
      })(),
      ai: (() {
        final map = _sdkworkAsMap(json['ai']);
        return map == null ? null : MediaAiProvenance.fromJson(map);
      })(),
      altText: json['altText']?.toString(),
      bucketId: json['bucketId']?.toString(),
      checksum: (() {
        final map = _sdkworkAsMap(json['checksum']);
        return map == null ? null : MediaChecksum.fromJson(map);
      })(),
      durationSeconds: json['durationSeconds'] is num ? json['durationSeconds'].toDouble() : null,
      fileName: json['fileName']?.toString(),
      height: json['height'] is int ? json['height'] : null,
      id: json['id']?.toString(),
      kind: (() {
        final value = json['kind']?.toString();
        if (value == null) {
          throw FormatException('MediaResource.kind is required');
        }
        return value;
      })(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      mimeType: json['mimeType']?.toString(),
      objectBlobId: json['objectBlobId']?.toString(),
      objectKey: json['objectKey']?.toString(),
      objectVersion: json['objectVersion']?.toString(),
      poster: (() {
        final map = _sdkworkAsMap(json['poster']);
        return map == null ? null : MediaResource.fromJson(map);
      })(),
      publicUrl: json['publicUrl']?.toString(),
      sizeBytes: json['sizeBytes']?.toString(),
      source: (() {
        final value = json['source']?.toString();
        if (value == null) {
          throw FormatException('MediaResource.source is required');
        }
        return value;
      })(),
      thumbnails: (() {
        final list = _sdkworkAsList(json['thumbnails']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MediaResource.fromJson(map);
      })())
            .whereType<MediaResource>()
            .toList();
      })(),
      title: json['title']?.toString(),
      uri: json['uri']?.toString(),
      url: json['url']?.toString(),
      variants: (() {
        final list = _sdkworkAsList(json['variants']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MediaResource.fromJson(map);
      })())
            .whereType<MediaResource>()
            .toList();
      })(),
      width: json['width'] is int ? json['width'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'access': access?.toJson(),
      'ai': ai?.toJson(),
      'altText': altText,
      'bucketId': bucketId,
      'checksum': checksum?.toJson(),
      'durationSeconds': durationSeconds,
      'fileName': fileName,
      'height': height,
      'id': id,
      'kind': kind,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'mimeType': mimeType,
      'objectBlobId': objectBlobId,
      'objectKey': objectKey,
      'objectVersion': objectVersion,
      'poster': poster?.toJson(),
      'publicUrl': publicUrl,
      'sizeBytes': sizeBytes,
      'source': source,
      'thumbnails': thumbnails?.map((item) => item.toJson()).toList(),
      'title': title,
      'uri': uri,
      'url': url,
      'variants': variants?.map((item) => item.toJson()).toList(),
      'width': width,
    };
  }
}

class MemoryEntryCreateRequest {
  final String? confidenceScore;
  final String content;
  final Map<String, dynamic>? contentJson;
  final String? importanceScore;
  final String? memoryType;
  final Map<String, dynamic>? metadata;
  final String? sensitivityLevel;
  final String? sourceConversationId;
  final String? sourceInvocationId;
  final String? sourceItemId;
  final String? sourceKind;
  final String? sourceTurnId;
  final String? status;
  final String? subjectKey;
  final String? subjectType;
  final String? trustLevel;

  MemoryEntryCreateRequest({
    this.confidenceScore,
    required this.content,
    this.contentJson,
    this.importanceScore,
    this.memoryType,
    this.metadata,
    this.sensitivityLevel,
    this.sourceConversationId,
    this.sourceInvocationId,
    this.sourceItemId,
    this.sourceKind,
    this.sourceTurnId,
    this.status,
    this.subjectKey,
    this.subjectType,
    this.trustLevel
  });

  factory MemoryEntryCreateRequest.fromJson(Map<String, dynamic> json) {
    return MemoryEntryCreateRequest(
      confidenceScore: json['confidenceScore']?.toString(),
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryCreateRequest.content is required');
        }
        return value;
      })(),
      contentJson: (() {
        final map = _sdkworkAsMap(json['contentJson']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      importanceScore: json['importanceScore']?.toString(),
      memoryType: json['memoryType']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      sensitivityLevel: json['sensitivityLevel']?.toString(),
      sourceConversationId: json['sourceConversationId']?.toString(),
      sourceInvocationId: json['sourceInvocationId']?.toString(),
      sourceItemId: json['sourceItemId']?.toString(),
      sourceKind: json['sourceKind']?.toString(),
      sourceTurnId: json['sourceTurnId']?.toString(),
      status: json['status']?.toString(),
      subjectKey: json['subjectKey']?.toString(),
      subjectType: json['subjectType']?.toString(),
      trustLevel: json['trustLevel']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'confidenceScore': confidenceScore,
      'content': content,
      'contentJson': contentJson?.map((key, item) => MapEntry(key, item)),
      'importanceScore': importanceScore,
      'memoryType': memoryType,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'sensitivityLevel': sensitivityLevel,
      'sourceConversationId': sourceConversationId,
      'sourceInvocationId': sourceInvocationId,
      'sourceItemId': sourceItemId,
      'sourceKind': sourceKind,
      'sourceTurnId': sourceTurnId,
      'status': status,
      'subjectKey': subjectKey,
      'subjectType': subjectType,
      'trustLevel': trustLevel,
    };
  }
}

class MemoryEntryItem {
  final String? confidenceScore;
  final String content;
  final String createdAt;
  final String id;
  final String? importanceScore;
  final String memoryType;
  final String recallCount;
  final String sensitivityLevel;
  final String? sourceConversationId;
  final String? sourceInvocationId;
  final String? sourceItemId;
  final String sourceKind;
  final String? sourceTurnId;
  final String spaceId;
  final String status;
  final String? subjectKey;
  final String? subjectType;
  final String trustLevel;
  final String updatedAt;

  MemoryEntryItem({
    this.confidenceScore,
    required this.content,
    required this.createdAt,
    required this.id,
    this.importanceScore,
    required this.memoryType,
    required this.recallCount,
    required this.sensitivityLevel,
    this.sourceConversationId,
    this.sourceInvocationId,
    this.sourceItemId,
    required this.sourceKind,
    this.sourceTurnId,
    required this.spaceId,
    required this.status,
    this.subjectKey,
    this.subjectType,
    required this.trustLevel,
    required this.updatedAt
  });

  factory MemoryEntryItem.fromJson(Map<String, dynamic> json) {
    return MemoryEntryItem(
      confidenceScore: json['confidenceScore']?.toString(),
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.content is required');
        }
        return value;
      })(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.createdAt is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.id is required');
        }
        return value;
      })(),
      importanceScore: json['importanceScore']?.toString(),
      memoryType: (() {
        final value = json['memoryType']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.memoryType is required');
        }
        return value;
      })(),
      recallCount: (() {
        final value = json['recallCount']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.recallCount is required');
        }
        return value;
      })(),
      sensitivityLevel: (() {
        final value = json['sensitivityLevel']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.sensitivityLevel is required');
        }
        return value;
      })(),
      sourceConversationId: json['sourceConversationId']?.toString(),
      sourceInvocationId: json['sourceInvocationId']?.toString(),
      sourceItemId: json['sourceItemId']?.toString(),
      sourceKind: (() {
        final value = json['sourceKind']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.sourceKind is required');
        }
        return value;
      })(),
      sourceTurnId: json['sourceTurnId']?.toString(),
      spaceId: (() {
        final value = json['spaceId']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.spaceId is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.status is required');
        }
        return value;
      })(),
      subjectKey: json['subjectKey']?.toString(),
      subjectType: json['subjectType']?.toString(),
      trustLevel: (() {
        final value = json['trustLevel']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.trustLevel is required');
        }
        return value;
      })(),
      updatedAt: (() {
        final value = json['updatedAt']?.toString();
        if (value == null) {
          throw FormatException('MemoryEntryItem.updatedAt is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'confidenceScore': confidenceScore,
      'content': content,
      'createdAt': createdAt,
      'id': id,
      'importanceScore': importanceScore,
      'memoryType': memoryType,
      'recallCount': recallCount,
      'sensitivityLevel': sensitivityLevel,
      'sourceConversationId': sourceConversationId,
      'sourceInvocationId': sourceInvocationId,
      'sourceItemId': sourceItemId,
      'sourceKind': sourceKind,
      'sourceTurnId': sourceTurnId,
      'spaceId': spaceId,
      'status': status,
      'subjectKey': subjectKey,
      'subjectType': subjectType,
      'trustLevel': trustLevel,
      'updatedAt': updatedAt,
    };
  }
}

class MemoryEntryListResponse {
  final List<MemoryEntryItem> items;

  MemoryEntryListResponse({
    required this.items
  });

  factory MemoryEntryListResponse.fromJson(Map<String, dynamic> json) {
    return MemoryEntryListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('MemoryEntryListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MemoryEntryItem.fromJson(map);
      })())
            .whereType<MemoryEntryItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class MemoryEntryResponse {
  final MemoryEntryItem item;

  MemoryEntryResponse({
    required this.item
  });

  factory MemoryEntryResponse.fromJson(Map<String, dynamic> json) {
    return MemoryEntryResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('MemoryEntryResponse.item is required');
        }
        return MemoryEntryItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class MemorySpaceCreateRequest {
  final bool? autoExtractEnabled;
  final bool? autoRecallEnabled;
  final String? maxInjectedTokens;
  final bool? memoryEnabled;
  final Map<String, dynamic>? metadata;
  final String? ownerId;
  final String? ownerType;
  final Map<String, dynamic>? retentionPolicy;
  final bool? reviewRequired;
  final Map<String, dynamic>? sensitivityPolicy;
  final String? spaceType;
  final String title;

  MemorySpaceCreateRequest({
    this.autoExtractEnabled,
    this.autoRecallEnabled,
    this.maxInjectedTokens,
    this.memoryEnabled,
    this.metadata,
    this.ownerId,
    this.ownerType,
    this.retentionPolicy,
    this.reviewRequired,
    this.sensitivityPolicy,
    this.spaceType,
    required this.title
  });

  factory MemorySpaceCreateRequest.fromJson(Map<String, dynamic> json) {
    return MemorySpaceCreateRequest(
      autoExtractEnabled: json['autoExtractEnabled'] is bool ? json['autoExtractEnabled'] : null,
      autoRecallEnabled: json['autoRecallEnabled'] is bool ? json['autoRecallEnabled'] : null,
      maxInjectedTokens: json['maxInjectedTokens']?.toString(),
      memoryEnabled: json['memoryEnabled'] is bool ? json['memoryEnabled'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      ownerId: json['ownerId']?.toString(),
      ownerType: json['ownerType']?.toString(),
      retentionPolicy: (() {
        final map = _sdkworkAsMap(json['retentionPolicy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      reviewRequired: json['reviewRequired'] is bool ? json['reviewRequired'] : null,
      sensitivityPolicy: (() {
        final map = _sdkworkAsMap(json['sensitivityPolicy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      spaceType: json['spaceType']?.toString(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('MemorySpaceCreateRequest.title is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'autoExtractEnabled': autoExtractEnabled,
      'autoRecallEnabled': autoRecallEnabled,
      'maxInjectedTokens': maxInjectedTokens,
      'memoryEnabled': memoryEnabled,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'ownerId': ownerId,
      'ownerType': ownerType,
      'retentionPolicy': retentionPolicy?.map((key, item) => MapEntry(key, item)),
      'reviewRequired': reviewRequired,
      'sensitivityPolicy': sensitivityPolicy?.map((key, item) => MapEntry(key, item)),
      'spaceType': spaceType,
      'title': title,
    };
  }
}

class MemorySpaceItem {
  final bool autoExtractEnabled;
  final bool autoRecallEnabled;
  final String createdAt;
  final String entryCount;
  final String id;
  final String? maxInjectedTokens;
  final bool memoryEnabled;
  final String? ownerId;
  final String? ownerType;
  final bool reviewRequired;
  final String spaceType;
  final String status;
  final String title;
  final String updatedAt;

  MemorySpaceItem({
    required this.autoExtractEnabled,
    required this.autoRecallEnabled,
    required this.createdAt,
    required this.entryCount,
    required this.id,
    this.maxInjectedTokens,
    required this.memoryEnabled,
    this.ownerId,
    this.ownerType,
    required this.reviewRequired,
    required this.spaceType,
    required this.status,
    required this.title,
    required this.updatedAt
  });

  factory MemorySpaceItem.fromJson(Map<String, dynamic> json) {
    return MemorySpaceItem(
      autoExtractEnabled: (() {
        final value = json['autoExtractEnabled'];
        if (value is! bool) {
          throw FormatException('MemorySpaceItem.autoExtractEnabled is required');
        }
        return value;
      })(),
      autoRecallEnabled: (() {
        final value = json['autoRecallEnabled'];
        if (value is! bool) {
          throw FormatException('MemorySpaceItem.autoRecallEnabled is required');
        }
        return value;
      })(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('MemorySpaceItem.createdAt is required');
        }
        return value;
      })(),
      entryCount: (() {
        final value = json['entryCount']?.toString();
        if (value == null) {
          throw FormatException('MemorySpaceItem.entryCount is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('MemorySpaceItem.id is required');
        }
        return value;
      })(),
      maxInjectedTokens: json['maxInjectedTokens']?.toString(),
      memoryEnabled: (() {
        final value = json['memoryEnabled'];
        if (value is! bool) {
          throw FormatException('MemorySpaceItem.memoryEnabled is required');
        }
        return value;
      })(),
      ownerId: json['ownerId']?.toString(),
      ownerType: json['ownerType']?.toString(),
      reviewRequired: (() {
        final value = json['reviewRequired'];
        if (value is! bool) {
          throw FormatException('MemorySpaceItem.reviewRequired is required');
        }
        return value;
      })(),
      spaceType: (() {
        final value = json['spaceType']?.toString();
        if (value == null) {
          throw FormatException('MemorySpaceItem.spaceType is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('MemorySpaceItem.status is required');
        }
        return value;
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('MemorySpaceItem.title is required');
        }
        return value;
      })(),
      updatedAt: (() {
        final value = json['updatedAt']?.toString();
        if (value == null) {
          throw FormatException('MemorySpaceItem.updatedAt is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'autoExtractEnabled': autoExtractEnabled,
      'autoRecallEnabled': autoRecallEnabled,
      'createdAt': createdAt,
      'entryCount': entryCount,
      'id': id,
      'maxInjectedTokens': maxInjectedTokens,
      'memoryEnabled': memoryEnabled,
      'ownerId': ownerId,
      'ownerType': ownerType,
      'reviewRequired': reviewRequired,
      'spaceType': spaceType,
      'status': status,
      'title': title,
      'updatedAt': updatedAt,
    };
  }
}

class MemorySpaceListResponse {
  final List<MemorySpaceItem> items;

  MemorySpaceListResponse({
    required this.items
  });

  factory MemorySpaceListResponse.fromJson(Map<String, dynamic> json) {
    return MemorySpaceListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('MemorySpaceListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MemorySpaceItem.fromJson(map);
      })())
            .whereType<MemorySpaceItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class MemorySpaceResponse {
  final MemorySpaceItem item;

  MemorySpaceResponse({
    required this.item
  });

  factory MemorySpaceResponse.fromJson(Map<String, dynamic> json) {
    return MemorySpaceResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('MemorySpaceResponse.item is required');
        }
        return MemorySpaceItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class ModelRankingHistoryEntry {
  final String catalogKey;
  final String color;
  final String model;
  final String rank;
  final String volume;

  ModelRankingHistoryEntry({
    required this.catalogKey,
    required this.color,
    required this.model,
    required this.rank,
    required this.volume
  });

  factory ModelRankingHistoryEntry.fromJson(Map<String, dynamic> json) {
    return ModelRankingHistoryEntry(
      catalogKey: (() {
        final value = json['catalogKey']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingHistoryEntry.catalogKey is required');
        }
        return value;
      })(),
      color: (() {
        final value = json['color']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingHistoryEntry.color is required');
        }
        return value;
      })(),
      model: (() {
        final value = json['model']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingHistoryEntry.model is required');
        }
        return value;
      })(),
      rank: (() {
        final value = json['rank']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingHistoryEntry.rank is required');
        }
        return value;
      })(),
      volume: (() {
        final value = json['volume']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingHistoryEntry.volume is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'catalogKey': catalogKey,
      'color': color,
      'model': model,
      'rank': rank,
      'volume': volume,
    };
  }
}

class ModelRankingHistoryPoint {
  final String date;
  final List<ModelRankingHistoryEntry> entries;
  final String index;

  ModelRankingHistoryPoint({
    required this.date,
    required this.entries,
    required this.index
  });

  factory ModelRankingHistoryPoint.fromJson(Map<String, dynamic> json) {
    return ModelRankingHistoryPoint(
      date: (() {
        final value = json['date']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingHistoryPoint.date is required');
        }
        return value;
      })(),
      entries: (() {
        final list = _sdkworkAsList(json['entries']);
        if (list == null) {
          throw FormatException('ModelRankingHistoryPoint.entries is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ModelRankingHistoryEntry.fromJson(map);
      })())
            .whereType<ModelRankingHistoryEntry>()
            .toList();
      })(),
      index: (() {
        final value = json['index']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingHistoryPoint.index is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'date': date,
      'entries': entries.map((item) => item.toJson()).toList(),
      'index': index,
    };
  }
}

class ModelRankingItem {
  final String baseVolume;
  final String color;
  final String? contextSize;
  final double cost;
  final String costIndicator;
  final String currency;
  final String id;
  final bool isNew;
  final String latency;
  final String? license;
  final String modality;
  final String name;
  final String prevRank;
  final String? pricing;
  final String rank;
  final String requests;
  final List<String> strengths;
  final String tokens;
  final double? trendScore;
  final String vendor;
  final String vendorCode;
  final double? winRate;

  ModelRankingItem({
    required this.baseVolume,
    required this.color,
    this.contextSize,
    required this.cost,
    required this.costIndicator,
    required this.currency,
    required this.id,
    required this.isNew,
    required this.latency,
    this.license,
    required this.modality,
    required this.name,
    required this.prevRank,
    this.pricing,
    required this.rank,
    required this.requests,
    required this.strengths,
    required this.tokens,
    this.trendScore,
    required this.vendor,
    required this.vendorCode,
    this.winRate
  });

  factory ModelRankingItem.fromJson(Map<String, dynamic> json) {
    return ModelRankingItem(
      baseVolume: (() {
        final value = json['baseVolume']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.baseVolume is required');
        }
        return value;
      })(),
      color: (() {
        final value = json['color']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.color is required');
        }
        return value;
      })(),
      contextSize: json['contextSize']?.toString(),
      cost: (() {
        final value = json['cost'];
        if (value is! num) {
          throw FormatException('ModelRankingItem.cost is required');
        }
        return value.toDouble();
      })(),
      costIndicator: (() {
        final value = json['costIndicator']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.costIndicator is required');
        }
        return value;
      })(),
      currency: (() {
        final value = json['currency']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.currency is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.id is required');
        }
        return value;
      })(),
      isNew: (() {
        final value = json['isNew'];
        if (value is! bool) {
          throw FormatException('ModelRankingItem.isNew is required');
        }
        return value;
      })(),
      latency: (() {
        final value = json['latency']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.latency is required');
        }
        return value;
      })(),
      license: json['license']?.toString(),
      modality: (() {
        final value = json['modality']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.modality is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.name is required');
        }
        return value;
      })(),
      prevRank: (() {
        final value = json['prevRank']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.prevRank is required');
        }
        return value;
      })(),
      pricing: json['pricing']?.toString(),
      rank: (() {
        final value = json['rank']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.rank is required');
        }
        return value;
      })(),
      requests: (() {
        final value = json['requests']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.requests is required');
        }
        return value;
      })(),
      strengths: (() {
        final list = _sdkworkAsList(json['strengths']);
        if (list == null) {
          throw FormatException('ModelRankingItem.strengths is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      tokens: (() {
        final value = json['tokens']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.tokens is required');
        }
        return value;
      })(),
      trendScore: json['trendScore'] is num ? json['trendScore'].toDouble() : null,
      vendor: (() {
        final value = json['vendor']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.vendor is required');
        }
        return value;
      })(),
      vendorCode: (() {
        final value = json['vendorCode']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingItem.vendorCode is required');
        }
        return value;
      })(),
      winRate: json['winRate'] is num ? json['winRate'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'baseVolume': baseVolume,
      'color': color,
      'contextSize': contextSize,
      'cost': cost,
      'costIndicator': costIndicator,
      'currency': currency,
      'id': id,
      'isNew': isNew,
      'latency': latency,
      'license': license,
      'modality': modality,
      'name': name,
      'prevRank': prevRank,
      'pricing': pricing,
      'rank': rank,
      'requests': requests,
      'strengths': strengths.map((item) => item).toList(),
      'tokens': tokens,
      'trendScore': trendScore,
      'vendor': vendor,
      'vendorCode': vendorCode,
      'winRate': winRate,
    };
  }
}

class ModelRankingsListResult {
  final String code;
  final ModelRankingsSnapshot? data;
  final String? msg;

  ModelRankingsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ModelRankingsListResult.fromJson(Map<String, dynamic> json) {
    return ModelRankingsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ModelRankingsSnapshot.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ModelRankingsSnapshot {
  final List<ModelRankingHistoryPoint> history;
  final List<ModelRankingItem> items;
  final ModelRankingsSource source;

  ModelRankingsSnapshot({
    required this.history,
    required this.items,
    required this.source
  });

  factory ModelRankingsSnapshot.fromJson(Map<String, dynamic> json) {
    return ModelRankingsSnapshot(
      history: (() {
        final list = _sdkworkAsList(json['history']);
        if (list == null) {
          throw FormatException('ModelRankingsSnapshot.history is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ModelRankingHistoryPoint.fromJson(map);
      })())
            .whereType<ModelRankingHistoryPoint>()
            .toList();
      })(),
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('ModelRankingsSnapshot.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ModelRankingItem.fromJson(map);
      })())
            .whereType<ModelRankingItem>()
            .toList();
      })(),
      source: (() {
        final map = _sdkworkAsMap(json['source']);
        if (map == null) {
          throw FormatException('ModelRankingsSnapshot.source is required');
        }
        return ModelRankingsSource.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'history': history.map((item) => item.toJson()).toList(),
      'items': items.map((item) => item.toJson()).toList(),
      'source': source.toJson(),
    };
  }
}

class ModelRankingsSource {
  final String cacheMaxAgeSeconds;
  final String generatedAt;
  final String nextRefreshAt;
  final String observedAt;
  final String rankScope;
  final String refreshIntervalSeconds;
  final String snapshotDate;
  final String snapshotPeriod;
  final String sourceDescription;
  final String sourceLabel;
  final List<String> sourceTables;
  final String windowEnd;
  final String windowStart;

  ModelRankingsSource({
    required this.cacheMaxAgeSeconds,
    required this.generatedAt,
    required this.nextRefreshAt,
    required this.observedAt,
    required this.rankScope,
    required this.refreshIntervalSeconds,
    required this.snapshotDate,
    required this.snapshotPeriod,
    required this.sourceDescription,
    required this.sourceLabel,
    required this.sourceTables,
    required this.windowEnd,
    required this.windowStart
  });

  factory ModelRankingsSource.fromJson(Map<String, dynamic> json) {
    return ModelRankingsSource(
      cacheMaxAgeSeconds: (() {
        final value = json['cacheMaxAgeSeconds']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.cacheMaxAgeSeconds is required');
        }
        return value;
      })(),
      generatedAt: (() {
        final value = json['generatedAt']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.generatedAt is required');
        }
        return value;
      })(),
      nextRefreshAt: (() {
        final value = json['nextRefreshAt']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.nextRefreshAt is required');
        }
        return value;
      })(),
      observedAt: (() {
        final value = json['observedAt']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.observedAt is required');
        }
        return value;
      })(),
      rankScope: (() {
        final value = json['rankScope']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.rankScope is required');
        }
        return value;
      })(),
      refreshIntervalSeconds: (() {
        final value = json['refreshIntervalSeconds']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.refreshIntervalSeconds is required');
        }
        return value;
      })(),
      snapshotDate: (() {
        final value = json['snapshotDate']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.snapshotDate is required');
        }
        return value;
      })(),
      snapshotPeriod: (() {
        final value = json['snapshotPeriod']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.snapshotPeriod is required');
        }
        return value;
      })(),
      sourceDescription: (() {
        final value = json['sourceDescription']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.sourceDescription is required');
        }
        return value;
      })(),
      sourceLabel: (() {
        final value = json['sourceLabel']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.sourceLabel is required');
        }
        return value;
      })(),
      sourceTables: (() {
        final list = _sdkworkAsList(json['sourceTables']);
        if (list == null) {
          throw FormatException('ModelRankingsSource.sourceTables is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      windowEnd: (() {
        final value = json['windowEnd']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.windowEnd is required');
        }
        return value;
      })(),
      windowStart: (() {
        final value = json['windowStart']?.toString();
        if (value == null) {
          throw FormatException('ModelRankingsSource.windowStart is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cacheMaxAgeSeconds': cacheMaxAgeSeconds,
      'generatedAt': generatedAt,
      'nextRefreshAt': nextRefreshAt,
      'observedAt': observedAt,
      'rankScope': rankScope,
      'refreshIntervalSeconds': refreshIntervalSeconds,
      'snapshotDate': snapshotDate,
      'snapshotPeriod': snapshotPeriod,
      'sourceDescription': sourceDescription,
      'sourceLabel': sourceLabel,
      'sourceTables': sourceTables.map((item) => item).toList(),
      'windowEnd': windowEnd,
      'windowStart': windowStart,
    };
  }
}

class ModelVendorsListResult {
  final String code;
  final RankingVendorOptionsResponse? data;
  final String? msg;

  ModelVendorsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ModelVendorsListResult.fromJson(Map<String, dynamic> json) {
    return ModelVendorsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ModelVendorsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RankingVendorOptionsResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class ModelsListResult {
  final String code;
  final AppModelCatalogResponse? data;
  final String? msg;

  ModelsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory ModelsListResult.fromJson(Map<String, dynamic> json) {
    return ModelsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('ModelsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppModelCatalogResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class NoData {


  NoData();

  factory NoData.fromJson(Map<String, dynamic> json) {
    return NoData();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class NotificationItem {
  final String? actionUrl;
  final String appId;
  final bool archived;
  final String content;
  final String desc;
  final String id;
  final bool popupSeen;
  final bool read;
  final bool showAsPopup;
  final String time;
  final String title;
  final String type;

  NotificationItem({
    this.actionUrl,
    required this.appId,
    required this.archived,
    required this.content,
    required this.desc,
    required this.id,
    required this.popupSeen,
    required this.read,
    required this.showAsPopup,
    required this.time,
    required this.title,
    required this.type
  });

  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    return NotificationItem(
      actionUrl: json['actionUrl']?.toString(),
      appId: (() {
        final value = json['appId']?.toString();
        if (value == null) {
          throw FormatException('NotificationItem.appId is required');
        }
        return value;
      })(),
      archived: (() {
        final value = json['archived'];
        if (value is! bool) {
          throw FormatException('NotificationItem.archived is required');
        }
        return value;
      })(),
      content: (() {
        final value = json['content']?.toString();
        if (value == null) {
          throw FormatException('NotificationItem.content is required');
        }
        return value;
      })(),
      desc: (() {
        final value = json['desc']?.toString();
        if (value == null) {
          throw FormatException('NotificationItem.desc is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('NotificationItem.id is required');
        }
        return value;
      })(),
      popupSeen: (() {
        final value = json['popupSeen'];
        if (value is! bool) {
          throw FormatException('NotificationItem.popupSeen is required');
        }
        return value;
      })(),
      read: (() {
        final value = json['read'];
        if (value is! bool) {
          throw FormatException('NotificationItem.read is required');
        }
        return value;
      })(),
      showAsPopup: (() {
        final value = json['showAsPopup'];
        if (value is! bool) {
          throw FormatException('NotificationItem.showAsPopup is required');
        }
        return value;
      })(),
      time: (() {
        final value = json['time']?.toString();
        if (value == null) {
          throw FormatException('NotificationItem.time is required');
        }
        return value;
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('NotificationItem.title is required');
        }
        return value;
      })(),
      type: (() {
        final value = json['type']?.toString();
        if (value == null) {
          throw FormatException('NotificationItem.type is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'actionUrl': actionUrl,
      'appId': appId,
      'archived': archived,
      'content': content,
      'desc': desc,
      'id': id,
      'popupSeen': popupSeen,
      'read': read,
      'showAsPopup': showAsPopup,
      'time': time,
      'title': title,
      'type': type,
    };
  }
}

class NotificationMutationResponse {
  final String state;
  final bool updated;

  NotificationMutationResponse({
    required this.state,
    required this.updated
  });

  factory NotificationMutationResponse.fromJson(Map<String, dynamic> json) {
    return NotificationMutationResponse(
      state: (() {
        final value = json['state']?.toString();
        if (value == null) {
          throw FormatException('NotificationMutationResponse.state is required');
        }
        return value;
      })(),
      updated: (() {
        final value = json['updated'];
        if (value is! bool) {
          throw FormatException('NotificationMutationResponse.updated is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'state': state,
      'updated': updated,
    };
  }
}

class NotificationsAcknowledgeCreateResult {
  final String code;
  final NotificationMutationResponse? data;
  final String? msg;

  NotificationsAcknowledgeCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory NotificationsAcknowledgeCreateResult.fromJson(Map<String, dynamic> json) {
    return NotificationsAcknowledgeCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('NotificationsAcknowledgeCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : NotificationMutationResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class NotificationsListResult {
  final String code;
  final NotificationsResponse? data;
  final String? msg;

  NotificationsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory NotificationsListResult.fromJson(Map<String, dynamic> json) {
    return NotificationsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('NotificationsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : NotificationsResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class NotificationsPopupSeenCreateResult {
  final String code;
  final NotificationMutationResponse? data;
  final String? msg;

  NotificationsPopupSeenCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory NotificationsPopupSeenCreateResult.fromJson(Map<String, dynamic> json) {
    return NotificationsPopupSeenCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('NotificationsPopupSeenCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : NotificationMutationResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class NotificationsResponse {
  final List<NotificationItem> items;

  NotificationsResponse({
    required this.items
  });

  factory NotificationsResponse.fromJson(Map<String, dynamic> json) {
    return NotificationsResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('NotificationsResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : NotificationItem.fromJson(map);
      })())
            .whereType<NotificationItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class ProblemDetail {
  final String? code;
  final String? detail;
  final List<FieldError>? errors;
  final String? instance;
  final String? requestId;
  final int status;
  final String title;
  final String? traceId;
  final String type;

  ProblemDetail({
    this.code,
    this.detail,
    this.errors,
    this.instance,
    this.requestId,
    required this.status,
    required this.title,
    this.traceId,
    required this.type
  });

  factory ProblemDetail.fromJson(Map<String, dynamic> json) {
    return ProblemDetail(
      code: json['code']?.toString(),
      detail: json['detail']?.toString(),
      errors: (() {
        final list = _sdkworkAsList(json['errors']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : FieldError.fromJson(map);
      })())
            .whereType<FieldError>()
            .toList();
      })(),
      instance: json['instance']?.toString(),
      requestId: json['requestId']?.toString(),
      status: (() {
        final value = json['status'];
        if (value is! int) {
          throw FormatException('ProblemDetail.status is required');
        }
        return value;
      })(),
      title: (() {
        final value = json['title']?.toString();
        if (value == null) {
          throw FormatException('ProblemDetail.title is required');
        }
        return value;
      })(),
      traceId: json['traceId']?.toString(),
      type: (() {
        final value = json['type']?.toString();
        if (value == null) {
          throw FormatException('ProblemDetail.type is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'detail': detail,
      'errors': errors?.map((item) => item.toJson()).toList(),
      'instance': instance,
      'requestId': requestId,
      'status': status,
      'title': title,
      'traceId': traceId,
      'type': type,
    };
  }
}

class RankingVendorOption {
  final String code;
  final String label;
  final String modelCount;

  RankingVendorOption({
    required this.code,
    required this.label,
    required this.modelCount
  });

  factory RankingVendorOption.fromJson(Map<String, dynamic> json) {
    return RankingVendorOption(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('RankingVendorOption.code is required');
        }
        return value;
      })(),
      label: (() {
        final value = json['label']?.toString();
        if (value == null) {
          throw FormatException('RankingVendorOption.label is required');
        }
        return value;
      })(),
      modelCount: (() {
        final value = json['modelCount']?.toString();
        if (value == null) {
          throw FormatException('RankingVendorOption.modelCount is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'label': label,
      'modelCount': modelCount,
    };
  }
}

class RankingVendorOptionsResponse {
  final List<RankingVendorOption> items;

  RankingVendorOptionsResponse({
    required this.items
  });

  factory RankingVendorOptionsResponse.fromJson(Map<String, dynamic> json) {
    return RankingVendorOptionsResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('RankingVendorOptionsResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RankingVendorOption.fromJson(map);
      })())
            .whereType<RankingVendorOption>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class RoutingApiKeyItem {
  final String? copyableKey;
  final String createdAt;
  final String displayKey;
  final String id;
  final String name;
  final String status;
  final String totalUsage;

  RoutingApiKeyItem({
    this.copyableKey,
    required this.createdAt,
    required this.displayKey,
    required this.id,
    required this.name,
    required this.status,
    required this.totalUsage
  });

  factory RoutingApiKeyItem.fromJson(Map<String, dynamic> json) {
    return RoutingApiKeyItem(
      copyableKey: json['copyableKey']?.toString(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('RoutingApiKeyItem.createdAt is required');
        }
        return value;
      })(),
      displayKey: (() {
        final value = json['displayKey']?.toString();
        if (value == null) {
          throw FormatException('RoutingApiKeyItem.displayKey is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('RoutingApiKeyItem.id is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('RoutingApiKeyItem.name is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('RoutingApiKeyItem.status is required');
        }
        return value;
      })(),
      totalUsage: (() {
        final value = json['totalUsage']?.toString();
        if (value == null) {
          throw FormatException('RoutingApiKeyItem.totalUsage is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'copyableKey': copyableKey,
      'createdAt': createdAt,
      'displayKey': displayKey,
      'id': id,
      'name': name,
      'status': status,
      'totalUsage': totalUsage,
    };
  }
}

class RoutingApiKeysListResult {
  final String code;
  final RoutingApiKeysResponse? data;
  final String? msg;

  RoutingApiKeysListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory RoutingApiKeysListResult.fromJson(Map<String, dynamic> json) {
    return RoutingApiKeysListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('RoutingApiKeysListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingApiKeysResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class RoutingApiKeysResponse {
  final List<RoutingApiKeyItem> items;

  RoutingApiKeysResponse({
    required this.items
  });

  factory RoutingApiKeysResponse.fromJson(Map<String, dynamic> json) {
    return RoutingApiKeysResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('RoutingApiKeysResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RoutingApiKeyItem.fromJson(map);
      })())
            .whereType<RoutingApiKeyItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class RoutingChannelItem {
  final String accessType;
  final String apiKey;
  final String balance;
  final String baseUrl;
  final List<String> capabilities;
  final RoutingCircuitBreakerPolicy? circuitBreakerPolicy;
  final String errors;
  final String id;
  final bool isMultimodal;
  final String latency;
  final List<String> models;
  final String name;
  final String protocol;
  final String provider;
  final String providerCode;
  final RoutingRetryPolicy? retryPolicy;
  final String rpm;
  final String status;
  final String? timeoutMs;
  final String vendor;
  final String weight;

  RoutingChannelItem({
    required this.accessType,
    required this.apiKey,
    required this.balance,
    required this.baseUrl,
    required this.capabilities,
    this.circuitBreakerPolicy,
    required this.errors,
    required this.id,
    required this.isMultimodal,
    required this.latency,
    required this.models,
    required this.name,
    required this.protocol,
    required this.provider,
    required this.providerCode,
    this.retryPolicy,
    required this.rpm,
    required this.status,
    this.timeoutMs,
    required this.vendor,
    required this.weight
  });

  factory RoutingChannelItem.fromJson(Map<String, dynamic> json) {
    return RoutingChannelItem(
      accessType: (() {
        final value = json['accessType']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.accessType is required');
        }
        return value;
      })(),
      apiKey: (() {
        final value = json['apiKey']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.apiKey is required');
        }
        return value;
      })(),
      balance: (() {
        final value = json['balance']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.balance is required');
        }
        return value;
      })(),
      baseUrl: (() {
        final value = json['baseUrl']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.baseUrl is required');
        }
        return value;
      })(),
      capabilities: (() {
        final list = _sdkworkAsList(json['capabilities']);
        if (list == null) {
          throw FormatException('RoutingChannelItem.capabilities is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      circuitBreakerPolicy: (() {
        final map = _sdkworkAsMap(json['circuitBreakerPolicy']);
        return map == null ? null : RoutingCircuitBreakerPolicy.fromJson(map);
      })(),
      errors: (() {
        final value = json['errors']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.errors is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.id is required');
        }
        return value;
      })(),
      isMultimodal: (() {
        final value = json['isMultimodal'];
        if (value is! bool) {
          throw FormatException('RoutingChannelItem.isMultimodal is required');
        }
        return value;
      })(),
      latency: (() {
        final value = json['latency']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.latency is required');
        }
        return value;
      })(),
      models: (() {
        final list = _sdkworkAsList(json['models']);
        if (list == null) {
          throw FormatException('RoutingChannelItem.models is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.name is required');
        }
        return value;
      })(),
      protocol: (() {
        final value = json['protocol']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.protocol is required');
        }
        return value;
      })(),
      provider: (() {
        final value = json['provider']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.provider is required');
        }
        return value;
      })(),
      providerCode: (() {
        final value = json['providerCode']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.providerCode is required');
        }
        return value;
      })(),
      retryPolicy: (() {
        final map = _sdkworkAsMap(json['retryPolicy']);
        return map == null ? null : RoutingRetryPolicy.fromJson(map);
      })(),
      rpm: (() {
        final value = json['rpm']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.rpm is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.status is required');
        }
        return value;
      })(),
      timeoutMs: json['timeoutMs']?.toString(),
      vendor: (() {
        final value = json['vendor']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.vendor is required');
        }
        return value;
      })(),
      weight: (() {
        final value = json['weight']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelItem.weight is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'accessType': accessType,
      'apiKey': apiKey,
      'balance': balance,
      'baseUrl': baseUrl,
      'capabilities': capabilities.map((item) => item).toList(),
      'circuitBreakerPolicy': circuitBreakerPolicy?.toJson(),
      'errors': errors,
      'id': id,
      'isMultimodal': isMultimodal,
      'latency': latency,
      'models': models.map((item) => item).toList(),
      'name': name,
      'protocol': protocol,
      'provider': provider,
      'providerCode': providerCode,
      'retryPolicy': retryPolicy?.toJson(),
      'rpm': rpm,
      'status': status,
      'timeoutMs': timeoutMs,
      'vendor': vendor,
      'weight': weight,
    };
  }
}

class RoutingChannelsListResult {
  final String code;
  final RoutingChannelsResponse? data;
  final String? msg;

  RoutingChannelsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory RoutingChannelsListResult.fromJson(Map<String, dynamic> json) {
    return RoutingChannelsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('RoutingChannelsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingChannelsResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class RoutingChannelsResponse {
  final List<RoutingChannelItem> items;

  RoutingChannelsResponse({
    required this.items
  });

  factory RoutingChannelsResponse.fromJson(Map<String, dynamic> json) {
    return RoutingChannelsResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('RoutingChannelsResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RoutingChannelItem.fromJson(map);
      })())
            .whereType<RoutingChannelItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class RoutingCircuitBreakerPolicy {
  final String failureThreshold;

  RoutingCircuitBreakerPolicy({
    required this.failureThreshold
  });

  factory RoutingCircuitBreakerPolicy.fromJson(Map<String, dynamic> json) {
    return RoutingCircuitBreakerPolicy(
      failureThreshold: (() {
        final value = json['failureThreshold']?.toString();
        if (value == null) {
          throw FormatException('RoutingCircuitBreakerPolicy.failureThreshold is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'failureThreshold': failureThreshold,
    };
  }
}

class RoutingModelStats {
  final String lat;
  final String m;
  final String req;
  final String sr;
  final String tok;

  RoutingModelStats({
    required this.lat,
    required this.m,
    required this.req,
    required this.sr,
    required this.tok
  });

  factory RoutingModelStats.fromJson(Map<String, dynamic> json) {
    return RoutingModelStats(
      lat: (() {
        final value = json['lat']?.toString();
        if (value == null) {
          throw FormatException('RoutingModelStats.lat is required');
        }
        return value;
      })(),
      m: (() {
        final value = json['m']?.toString();
        if (value == null) {
          throw FormatException('RoutingModelStats.m is required');
        }
        return value;
      })(),
      req: (() {
        final value = json['req']?.toString();
        if (value == null) {
          throw FormatException('RoutingModelStats.req is required');
        }
        return value;
      })(),
      sr: (() {
        final value = json['sr']?.toString();
        if (value == null) {
          throw FormatException('RoutingModelStats.sr is required');
        }
        return value;
      })(),
      tok: (() {
        final value = json['tok']?.toString();
        if (value == null) {
          throw FormatException('RoutingModelStats.tok is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'lat': lat,
      'm': m,
      'req': req,
      'sr': sr,
      'tok': tok,
    };
  }
}

class RoutingRequestTraceItem {
  final String channel;
  final String duration;
  final String endedAt;
  final String errorMessageMasked;
  final String errorType;
  final String httpMethod;
  final String id;
  final String model;
  final String providerErrorCode;
  final String requestBytes;
  final String requestId;
  final String requestPath;
  final String requestPayloadHash;
  final String responseBytes;
  final String responsePayloadHash;
  final String startedAt;
  final String status;
  final bool streaming;
  final String time;
  final String tokens;
  final String traceId;

  RoutingRequestTraceItem({
    required this.channel,
    required this.duration,
    required this.endedAt,
    required this.errorMessageMasked,
    required this.errorType,
    required this.httpMethod,
    required this.id,
    required this.model,
    required this.providerErrorCode,
    required this.requestBytes,
    required this.requestId,
    required this.requestPath,
    required this.requestPayloadHash,
    required this.responseBytes,
    required this.responsePayloadHash,
    required this.startedAt,
    required this.status,
    required this.streaming,
    required this.time,
    required this.tokens,
    required this.traceId
  });

  factory RoutingRequestTraceItem.fromJson(Map<String, dynamic> json) {
    return RoutingRequestTraceItem(
      channel: (() {
        final value = json['channel']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.channel is required');
        }
        return value;
      })(),
      duration: (() {
        final value = json['duration']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.duration is required');
        }
        return value;
      })(),
      endedAt: (() {
        final value = json['endedAt']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.endedAt is required');
        }
        return value;
      })(),
      errorMessageMasked: (() {
        final value = json['errorMessageMasked']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.errorMessageMasked is required');
        }
        return value;
      })(),
      errorType: (() {
        final value = json['errorType']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.errorType is required');
        }
        return value;
      })(),
      httpMethod: (() {
        final value = json['httpMethod']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.httpMethod is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.id is required');
        }
        return value;
      })(),
      model: (() {
        final value = json['model']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.model is required');
        }
        return value;
      })(),
      providerErrorCode: (() {
        final value = json['providerErrorCode']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.providerErrorCode is required');
        }
        return value;
      })(),
      requestBytes: (() {
        final value = json['requestBytes']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.requestBytes is required');
        }
        return value;
      })(),
      requestId: (() {
        final value = json['requestId']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.requestId is required');
        }
        return value;
      })(),
      requestPath: (() {
        final value = json['requestPath']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.requestPath is required');
        }
        return value;
      })(),
      requestPayloadHash: (() {
        final value = json['requestPayloadHash']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.requestPayloadHash is required');
        }
        return value;
      })(),
      responseBytes: (() {
        final value = json['responseBytes']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.responseBytes is required');
        }
        return value;
      })(),
      responsePayloadHash: (() {
        final value = json['responsePayloadHash']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.responsePayloadHash is required');
        }
        return value;
      })(),
      startedAt: (() {
        final value = json['startedAt']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.startedAt is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.status is required');
        }
        return value;
      })(),
      streaming: (() {
        final value = json['streaming'];
        if (value is! bool) {
          throw FormatException('RoutingRequestTraceItem.streaming is required');
        }
        return value;
      })(),
      time: (() {
        final value = json['time']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.time is required');
        }
        return value;
      })(),
      tokens: (() {
        final value = json['tokens']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.tokens is required');
        }
        return value;
      })(),
      traceId: (() {
        final value = json['traceId']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTraceItem.traceId is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'channel': channel,
      'duration': duration,
      'endedAt': endedAt,
      'errorMessageMasked': errorMessageMasked,
      'errorType': errorType,
      'httpMethod': httpMethod,
      'id': id,
      'model': model,
      'providerErrorCode': providerErrorCode,
      'requestBytes': requestBytes,
      'requestId': requestId,
      'requestPath': requestPath,
      'requestPayloadHash': requestPayloadHash,
      'responseBytes': responseBytes,
      'responsePayloadHash': responsePayloadHash,
      'startedAt': startedAt,
      'status': status,
      'streaming': streaming,
      'time': time,
      'tokens': tokens,
      'traceId': traceId,
    };
  }
}

class RoutingRequestTracesListResult {
  final String code;
  final RoutingRequestTracesResponse? data;
  final String? msg;

  RoutingRequestTracesListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory RoutingRequestTracesListResult.fromJson(Map<String, dynamic> json) {
    return RoutingRequestTracesListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('RoutingRequestTracesListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingRequestTracesResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class RoutingRequestTracesResponse {
  final List<RoutingRequestTraceItem> items;

  RoutingRequestTracesResponse({
    required this.items
  });

  factory RoutingRequestTracesResponse.fromJson(Map<String, dynamic> json) {
    return RoutingRequestTracesResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('RoutingRequestTracesResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RoutingRequestTraceItem.fromJson(map);
      })())
            .whereType<RoutingRequestTraceItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class RoutingRetryPolicy {
  final String backoffMs;
  final String maxAttempts;
  final List<String> retryableStatusCodes;

  RoutingRetryPolicy({
    required this.backoffMs,
    required this.maxAttempts,
    required this.retryableStatusCodes
  });

  factory RoutingRetryPolicy.fromJson(Map<String, dynamic> json) {
    return RoutingRetryPolicy(
      backoffMs: (() {
        final value = json['backoffMs']?.toString();
        if (value == null) {
          throw FormatException('RoutingRetryPolicy.backoffMs is required');
        }
        return value;
      })(),
      maxAttempts: (() {
        final value = json['maxAttempts']?.toString();
        if (value == null) {
          throw FormatException('RoutingRetryPolicy.maxAttempts is required');
        }
        return value;
      })(),
      retryableStatusCodes: (() {
        final list = _sdkworkAsList(json['retryableStatusCodes']);
        if (list == null) {
          throw FormatException('RoutingRetryPolicy.retryableStatusCodes is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'backoffMs': backoffMs,
      'maxAttempts': maxAttempts,
      'retryableStatusCodes': retryableStatusCodes.map((item) => item).toList(),
    };
  }
}

class RoutingUsageData {
  final String latency;
  final String requests;
  final String time;

  RoutingUsageData({
    required this.latency,
    required this.requests,
    required this.time
  });

  factory RoutingUsageData.fromJson(Map<String, dynamic> json) {
    return RoutingUsageData(
      latency: (() {
        final value = json['latency']?.toString();
        if (value == null) {
          throw FormatException('RoutingUsageData.latency is required');
        }
        return value;
      })(),
      requests: (() {
        final value = json['requests']?.toString();
        if (value == null) {
          throw FormatException('RoutingUsageData.requests is required');
        }
        return value;
      })(),
      time: (() {
        final value = json['time']?.toString();
        if (value == null) {
          throw FormatException('RoutingUsageData.time is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'latency': latency,
      'requests': requests,
      'time': time,
    };
  }
}

class RoutingUsageListResult {
  final String code;
  final RoutingUsageSnapshot? data;
  final String? msg;

  RoutingUsageListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory RoutingUsageListResult.fromJson(Map<String, dynamic> json) {
    return RoutingUsageListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('RoutingUsageListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingUsageSnapshot.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class RoutingUsageSnapshot {
  final List<RoutingUsageData> chartData;
  final List<RoutingModelStats> modelStats;

  RoutingUsageSnapshot({
    required this.chartData,
    required this.modelStats
  });

  factory RoutingUsageSnapshot.fromJson(Map<String, dynamic> json) {
    return RoutingUsageSnapshot(
      chartData: (() {
        final list = _sdkworkAsList(json['chartData']);
        if (list == null) {
          throw FormatException('RoutingUsageSnapshot.chartData is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RoutingUsageData.fromJson(map);
      })())
            .whereType<RoutingUsageData>()
            .toList();
      })(),
      modelStats: (() {
        final list = _sdkworkAsList(json['modelStats']);
        if (list == null) {
          throw FormatException('RoutingUsageSnapshot.modelStats is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RoutingModelStats.fromJson(map);
      })())
            .whereType<RoutingModelStats>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'chartData': chartData.map((item) => item.toJson()).toList(),
      'modelStats': modelStats.map((item) => item.toJson()).toList(),
    };
  }
}

class RuntimeArtifactCreateRequest {
  final String artifactType;
  final Map<String, dynamic>? contentJson;
  final String? contentText;
  final Map<String, dynamic>? metadata;
  final String? mimeType;
  final String? name;
  final MediaResource? resource;
  final String? sha256;
  final String? sizeBytes;
  final String? storageKey;

  RuntimeArtifactCreateRequest({
    required this.artifactType,
    this.contentJson,
    this.contentText,
    this.metadata,
    this.mimeType,
    this.name,
    this.resource,
    this.sha256,
    this.sizeBytes,
    this.storageKey
  });

  factory RuntimeArtifactCreateRequest.fromJson(Map<String, dynamic> json) {
    return RuntimeArtifactCreateRequest(
      artifactType: (() {
        final value = json['artifactType']?.toString();
        if (value == null) {
          throw FormatException('RuntimeArtifactCreateRequest.artifactType is required');
        }
        return value;
      })(),
      contentJson: (() {
        final map = _sdkworkAsMap(json['contentJson']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      contentText: json['contentText']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      mimeType: json['mimeType']?.toString(),
      name: json['name']?.toString(),
      resource: (() {
        final map = _sdkworkAsMap(json['resource']);
        return map == null ? null : MediaResource.fromJson(map);
      })(),
      sha256: json['sha256']?.toString(),
      sizeBytes: json['sizeBytes']?.toString(),
      storageKey: json['storageKey']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'artifactType': artifactType,
      'contentJson': contentJson?.map((key, item) => MapEntry(key, item)),
      'contentText': contentText,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'mimeType': mimeType,
      'name': name,
      'resource': resource?.toJson(),
      'sha256': sha256,
      'sizeBytes': sizeBytes,
      'storageKey': storageKey,
    };
  }
}

class RuntimeArtifactItem {
  final String artifactType;
  final String? contentText;
  final String createdAt;
  final String id;
  final String invocationId;
  final String? mimeType;
  final String? name;
  final MediaResource? resource;
  final String? sha256;
  final String? sizeBytes;
  final String? storageKey;

  RuntimeArtifactItem({
    required this.artifactType,
    this.contentText,
    required this.createdAt,
    required this.id,
    required this.invocationId,
    this.mimeType,
    this.name,
    this.resource,
    this.sha256,
    this.sizeBytes,
    this.storageKey
  });

  factory RuntimeArtifactItem.fromJson(Map<String, dynamic> json) {
    return RuntimeArtifactItem(
      artifactType: (() {
        final value = json['artifactType']?.toString();
        if (value == null) {
          throw FormatException('RuntimeArtifactItem.artifactType is required');
        }
        return value;
      })(),
      contentText: json['contentText']?.toString(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('RuntimeArtifactItem.createdAt is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('RuntimeArtifactItem.id is required');
        }
        return value;
      })(),
      invocationId: (() {
        final value = json['invocationId']?.toString();
        if (value == null) {
          throw FormatException('RuntimeArtifactItem.invocationId is required');
        }
        return value;
      })(),
      mimeType: json['mimeType']?.toString(),
      name: json['name']?.toString(),
      resource: (() {
        final map = _sdkworkAsMap(json['resource']);
        return map == null ? null : MediaResource.fromJson(map);
      })(),
      sha256: json['sha256']?.toString(),
      sizeBytes: json['sizeBytes']?.toString(),
      storageKey: json['storageKey']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'artifactType': artifactType,
      'contentText': contentText,
      'createdAt': createdAt,
      'id': id,
      'invocationId': invocationId,
      'mimeType': mimeType,
      'name': name,
      'resource': resource?.toJson(),
      'sha256': sha256,
      'sizeBytes': sizeBytes,
      'storageKey': storageKey,
    };
  }
}

class RuntimeArtifactListResponse {
  final List<RuntimeArtifactItem> items;

  RuntimeArtifactListResponse({
    required this.items
  });

  factory RuntimeArtifactListResponse.fromJson(Map<String, dynamic> json) {
    return RuntimeArtifactListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('RuntimeArtifactListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RuntimeArtifactItem.fromJson(map);
      })())
            .whereType<RuntimeArtifactItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class RuntimeArtifactResponse {
  final RuntimeArtifactItem item;

  RuntimeArtifactResponse({
    required this.item
  });

  factory RuntimeArtifactResponse.fromJson(Map<String, dynamic> json) {
    return RuntimeArtifactResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('RuntimeArtifactResponse.item is required');
        }
        return RuntimeArtifactItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class RuntimeEventCreateRequest {
  final String? eventSource;
  final String eventType;
  final Map<String, dynamic>? metadata;
  final Map<String, dynamic>? payloadJson;
  final String? textDelta;

  RuntimeEventCreateRequest({
    this.eventSource,
    required this.eventType,
    this.metadata,
    this.payloadJson,
    this.textDelta
  });

  factory RuntimeEventCreateRequest.fromJson(Map<String, dynamic> json) {
    return RuntimeEventCreateRequest(
      eventSource: json['eventSource']?.toString(),
      eventType: (() {
        final value = json['eventType']?.toString();
        if (value == null) {
          throw FormatException('RuntimeEventCreateRequest.eventType is required');
        }
        return value;
      })(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      payloadJson: (() {
        final map = _sdkworkAsMap(json['payloadJson']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      textDelta: json['textDelta']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'eventSource': eventSource,
      'eventType': eventType,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'payloadJson': payloadJson?.map((key, item) => MapEntry(key, item)),
      'textDelta': textDelta,
    };
  }
}

class RuntimeEventItem {
  final String createdAt;
  final String eventNo;
  final String eventSource;
  final String eventType;
  final String id;
  final String invocationId;
  final Map<String, dynamic> payloadJson;
  final String? textDelta;

  RuntimeEventItem({
    required this.createdAt,
    required this.eventNo,
    required this.eventSource,
    required this.eventType,
    required this.id,
    required this.invocationId,
    required this.payloadJson,
    this.textDelta
  });

  factory RuntimeEventItem.fromJson(Map<String, dynamic> json) {
    return RuntimeEventItem(
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('RuntimeEventItem.createdAt is required');
        }
        return value;
      })(),
      eventNo: (() {
        final value = json['eventNo']?.toString();
        if (value == null) {
          throw FormatException('RuntimeEventItem.eventNo is required');
        }
        return value;
      })(),
      eventSource: (() {
        final value = json['eventSource']?.toString();
        if (value == null) {
          throw FormatException('RuntimeEventItem.eventSource is required');
        }
        return value;
      })(),
      eventType: (() {
        final value = json['eventType']?.toString();
        if (value == null) {
          throw FormatException('RuntimeEventItem.eventType is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('RuntimeEventItem.id is required');
        }
        return value;
      })(),
      invocationId: (() {
        final value = json['invocationId']?.toString();
        if (value == null) {
          throw FormatException('RuntimeEventItem.invocationId is required');
        }
        return value;
      })(),
      payloadJson: (() {
        final map = _sdkworkAsMap(json['payloadJson']);
        if (map == null) {
          throw FormatException('RuntimeEventItem.payloadJson is required');
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      textDelta: json['textDelta']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'createdAt': createdAt,
      'eventNo': eventNo,
      'eventSource': eventSource,
      'eventType': eventType,
      'id': id,
      'invocationId': invocationId,
      'payloadJson': payloadJson.map((key, item) => MapEntry(key, item)),
      'textDelta': textDelta,
    };
  }
}

class RuntimeEventListResponse {
  final List<RuntimeEventItem> items;

  RuntimeEventListResponse({
    required this.items
  });

  factory RuntimeEventListResponse.fromJson(Map<String, dynamic> json) {
    return RuntimeEventListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('RuntimeEventListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RuntimeEventItem.fromJson(map);
      })())
            .whereType<RuntimeEventItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class RuntimeEventResponse {
  final RuntimeEventItem item;

  RuntimeEventResponse({
    required this.item
  });

  factory RuntimeEventResponse.fromJson(Map<String, dynamic> json) {
    return RuntimeEventResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('RuntimeEventResponse.item is required');
        }
        return RuntimeEventItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class RuntimeInvocationCompleteRequest {
  final String? errorCode;
  final String? errorMessageMasked;
  final String? errorType;
  final String? exitCode;
  final String? finishReason;
  final String? latencyMs;
  final Map<String, dynamic>? metadata;
  final String? providerConversationId;
  final String? providerResponseId;
  final String? providerSessionId;
  final String? providerStepId;
  final Map<String, dynamic>? responseJson;
  final String? status;
  final String? ttftMs;
  final UsageSnapshot? usageJson;

  RuntimeInvocationCompleteRequest({
    this.errorCode,
    this.errorMessageMasked,
    this.errorType,
    this.exitCode,
    this.finishReason,
    this.latencyMs,
    this.metadata,
    this.providerConversationId,
    this.providerResponseId,
    this.providerSessionId,
    this.providerStepId,
    this.responseJson,
    this.status,
    this.ttftMs,
    this.usageJson
  });

  factory RuntimeInvocationCompleteRequest.fromJson(Map<String, dynamic> json) {
    return RuntimeInvocationCompleteRequest(
      errorCode: json['errorCode']?.toString(),
      errorMessageMasked: json['errorMessageMasked']?.toString(),
      errorType: json['errorType']?.toString(),
      exitCode: json['exitCode']?.toString(),
      finishReason: json['finishReason']?.toString(),
      latencyMs: json['latencyMs']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      providerConversationId: json['providerConversationId']?.toString(),
      providerResponseId: json['providerResponseId']?.toString(),
      providerSessionId: json['providerSessionId']?.toString(),
      providerStepId: json['providerStepId']?.toString(),
      responseJson: (() {
        final map = _sdkworkAsMap(json['responseJson']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      status: json['status']?.toString(),
      ttftMs: json['ttftMs']?.toString(),
      usageJson: (() {
        final map = _sdkworkAsMap(json['usageJson']);
        return map == null ? null : UsageSnapshot.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'errorCode': errorCode,
      'errorMessageMasked': errorMessageMasked,
      'errorType': errorType,
      'exitCode': exitCode,
      'finishReason': finishReason,
      'latencyMs': latencyMs,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'providerConversationId': providerConversationId,
      'providerResponseId': providerResponseId,
      'providerSessionId': providerSessionId,
      'providerStepId': providerStepId,
      'responseJson': responseJson?.map((key, item) => MapEntry(key, item)),
      'status': status,
      'ttftMs': ttftMs,
      'usageJson': usageJson?.toJson(),
    };
  }
}

class RuntimeInvocationCreateRequest {
  final String? agentRunId;
  final String? agentRunStepId;
  final String? agentSessionId;
  final String? approvalPolicy;
  final String? chatItemId;
  final String? chatTurnId;
  final String? conversationId;
  final String? cwd;
  final String? endpoint;
  final String? invocationType;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? permissionMode;
  final String? provider;
  final Map<String, dynamic>? requestJson;
  final String runtime;
  final String? sandboxPolicy;
  final String? status;
  final bool? streaming;
  final String? toolCallId;
  final String? toolName;
  final String? traceId;

  RuntimeInvocationCreateRequest({
    this.agentRunId,
    this.agentRunStepId,
    this.agentSessionId,
    this.approvalPolicy,
    this.chatItemId,
    this.chatTurnId,
    this.conversationId,
    this.cwd,
    this.endpoint,
    this.invocationType,
    this.metadata,
    this.model,
    this.permissionMode,
    this.provider,
    this.requestJson,
    required this.runtime,
    this.sandboxPolicy,
    this.status,
    this.streaming,
    this.toolCallId,
    this.toolName,
    this.traceId
  });

  factory RuntimeInvocationCreateRequest.fromJson(Map<String, dynamic> json) {
    return RuntimeInvocationCreateRequest(
      agentRunId: json['agentRunId']?.toString(),
      agentRunStepId: json['agentRunStepId']?.toString(),
      agentSessionId: json['agentSessionId']?.toString(),
      approvalPolicy: json['approvalPolicy']?.toString(),
      chatItemId: json['chatItemId']?.toString(),
      chatTurnId: json['chatTurnId']?.toString(),
      conversationId: json['conversationId']?.toString(),
      cwd: json['cwd']?.toString(),
      endpoint: json['endpoint']?.toString(),
      invocationType: json['invocationType']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      model: json['model']?.toString(),
      permissionMode: json['permissionMode']?.toString(),
      provider: json['provider']?.toString(),
      requestJson: (() {
        final map = _sdkworkAsMap(json['requestJson']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      runtime: (() {
        final value = json['runtime']?.toString();
        if (value == null) {
          throw FormatException('RuntimeInvocationCreateRequest.runtime is required');
        }
        return value;
      })(),
      sandboxPolicy: json['sandboxPolicy']?.toString(),
      status: json['status']?.toString(),
      streaming: json['streaming'] is bool ? json['streaming'] : null,
      toolCallId: json['toolCallId']?.toString(),
      toolName: json['toolName']?.toString(),
      traceId: json['traceId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'agentRunId': agentRunId,
      'agentRunStepId': agentRunStepId,
      'agentSessionId': agentSessionId,
      'approvalPolicy': approvalPolicy,
      'chatItemId': chatItemId,
      'chatTurnId': chatTurnId,
      'conversationId': conversationId,
      'cwd': cwd,
      'endpoint': endpoint,
      'invocationType': invocationType,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'permissionMode': permissionMode,
      'provider': provider,
      'requestJson': requestJson?.map((key, item) => MapEntry(key, item)),
      'runtime': runtime,
      'sandboxPolicy': sandboxPolicy,
      'status': status,
      'streaming': streaming,
      'toolCallId': toolCallId,
      'toolName': toolName,
      'traceId': traceId,
    };
  }
}

class RuntimeInvocationItem {
  final String? agentRunId;
  final String? agentRunStepId;
  final String? agentSessionId;
  final String? approvalPolicy;
  final String attemptNo;
  final String? chatItemId;
  final String? chatTurnId;
  final String? completedAt;
  final String? conversationId;
  final String createdAt;
  final String? cwd;
  final String? endpoint;
  final String? errorCode;
  final String? errorMessageMasked;
  final String? errorType;
  final String? exitCode;
  final String? finishReason;
  final String id;
  final String invocationNo;
  final String invocationType;
  final String? latencyMs;
  final String? model;
  final String? permissionMode;
  final String? provider;
  final String? providerConversationId;
  final String? providerResponseId;
  final String? providerSessionId;
  final String? providerStepId;
  final String? requestId;
  final String runtime;
  final String? sandboxPolicy;
  final String? startedAt;
  final String status;
  final bool streaming;
  final String? toolCallId;
  final String? toolName;
  final String? traceId;
  final String? ttftMs;

  RuntimeInvocationItem({
    this.agentRunId,
    this.agentRunStepId,
    this.agentSessionId,
    this.approvalPolicy,
    required this.attemptNo,
    this.chatItemId,
    this.chatTurnId,
    this.completedAt,
    this.conversationId,
    required this.createdAt,
    this.cwd,
    this.endpoint,
    this.errorCode,
    this.errorMessageMasked,
    this.errorType,
    this.exitCode,
    this.finishReason,
    required this.id,
    required this.invocationNo,
    required this.invocationType,
    this.latencyMs,
    this.model,
    this.permissionMode,
    this.provider,
    this.providerConversationId,
    this.providerResponseId,
    this.providerSessionId,
    this.providerStepId,
    this.requestId,
    required this.runtime,
    this.sandboxPolicy,
    this.startedAt,
    required this.status,
    required this.streaming,
    this.toolCallId,
    this.toolName,
    this.traceId,
    this.ttftMs
  });

  factory RuntimeInvocationItem.fromJson(Map<String, dynamic> json) {
    return RuntimeInvocationItem(
      agentRunId: json['agentRunId']?.toString(),
      agentRunStepId: json['agentRunStepId']?.toString(),
      agentSessionId: json['agentSessionId']?.toString(),
      approvalPolicy: json['approvalPolicy']?.toString(),
      attemptNo: (() {
        final value = json['attemptNo']?.toString();
        if (value == null) {
          throw FormatException('RuntimeInvocationItem.attemptNo is required');
        }
        return value;
      })(),
      chatItemId: json['chatItemId']?.toString(),
      chatTurnId: json['chatTurnId']?.toString(),
      completedAt: json['completedAt']?.toString(),
      conversationId: json['conversationId']?.toString(),
      createdAt: (() {
        final value = json['createdAt']?.toString();
        if (value == null) {
          throw FormatException('RuntimeInvocationItem.createdAt is required');
        }
        return value;
      })(),
      cwd: json['cwd']?.toString(),
      endpoint: json['endpoint']?.toString(),
      errorCode: json['errorCode']?.toString(),
      errorMessageMasked: json['errorMessageMasked']?.toString(),
      errorType: json['errorType']?.toString(),
      exitCode: json['exitCode']?.toString(),
      finishReason: json['finishReason']?.toString(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('RuntimeInvocationItem.id is required');
        }
        return value;
      })(),
      invocationNo: (() {
        final value = json['invocationNo']?.toString();
        if (value == null) {
          throw FormatException('RuntimeInvocationItem.invocationNo is required');
        }
        return value;
      })(),
      invocationType: (() {
        final value = json['invocationType']?.toString();
        if (value == null) {
          throw FormatException('RuntimeInvocationItem.invocationType is required');
        }
        return value;
      })(),
      latencyMs: json['latencyMs']?.toString(),
      model: json['model']?.toString(),
      permissionMode: json['permissionMode']?.toString(),
      provider: json['provider']?.toString(),
      providerConversationId: json['providerConversationId']?.toString(),
      providerResponseId: json['providerResponseId']?.toString(),
      providerSessionId: json['providerSessionId']?.toString(),
      providerStepId: json['providerStepId']?.toString(),
      requestId: json['requestId']?.toString(),
      runtime: (() {
        final value = json['runtime']?.toString();
        if (value == null) {
          throw FormatException('RuntimeInvocationItem.runtime is required');
        }
        return value;
      })(),
      sandboxPolicy: json['sandboxPolicy']?.toString(),
      startedAt: json['startedAt']?.toString(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('RuntimeInvocationItem.status is required');
        }
        return value;
      })(),
      streaming: (() {
        final value = json['streaming'];
        if (value is! bool) {
          throw FormatException('RuntimeInvocationItem.streaming is required');
        }
        return value;
      })(),
      toolCallId: json['toolCallId']?.toString(),
      toolName: json['toolName']?.toString(),
      traceId: json['traceId']?.toString(),
      ttftMs: json['ttftMs']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'agentRunId': agentRunId,
      'agentRunStepId': agentRunStepId,
      'agentSessionId': agentSessionId,
      'approvalPolicy': approvalPolicy,
      'attemptNo': attemptNo,
      'chatItemId': chatItemId,
      'chatTurnId': chatTurnId,
      'completedAt': completedAt,
      'conversationId': conversationId,
      'createdAt': createdAt,
      'cwd': cwd,
      'endpoint': endpoint,
      'errorCode': errorCode,
      'errorMessageMasked': errorMessageMasked,
      'errorType': errorType,
      'exitCode': exitCode,
      'finishReason': finishReason,
      'id': id,
      'invocationNo': invocationNo,
      'invocationType': invocationType,
      'latencyMs': latencyMs,
      'model': model,
      'permissionMode': permissionMode,
      'provider': provider,
      'providerConversationId': providerConversationId,
      'providerResponseId': providerResponseId,
      'providerSessionId': providerSessionId,
      'providerStepId': providerStepId,
      'requestId': requestId,
      'runtime': runtime,
      'sandboxPolicy': sandboxPolicy,
      'startedAt': startedAt,
      'status': status,
      'streaming': streaming,
      'toolCallId': toolCallId,
      'toolName': toolName,
      'traceId': traceId,
      'ttftMs': ttftMs,
    };
  }
}

class RuntimeInvocationListResponse {
  final List<RuntimeInvocationItem> items;

  RuntimeInvocationListResponse({
    required this.items
  });

  factory RuntimeInvocationListResponse.fromJson(Map<String, dynamic> json) {
    return RuntimeInvocationListResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('RuntimeInvocationListResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RuntimeInvocationItem.fromJson(map);
      })())
            .whereType<RuntimeInvocationItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class RuntimeInvocationResponse {
  final RuntimeInvocationItem item;

  RuntimeInvocationResponse({
    required this.item
  });

  factory RuntimeInvocationResponse.fromJson(Map<String, dynamic> json) {
    return RuntimeInvocationResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('RuntimeInvocationResponse.item is required');
        }
        return RuntimeInvocationItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class SdkReferenceArchiveGenerateRequest {
  final Map<String, dynamic> config;
  final String language;
  final Map<String, dynamic> spec;

  SdkReferenceArchiveGenerateRequest({
    required this.config,
    required this.language,
    required this.spec
  });

  factory SdkReferenceArchiveGenerateRequest.fromJson(Map<String, dynamic> json) {
    return SdkReferenceArchiveGenerateRequest(
      config: (() {
        final map = _sdkworkAsMap(json['config']);
        if (map == null) {
          throw FormatException('SdkReferenceArchiveGenerateRequest.config is required');
        }
        return map;
      })(),
      language: (() {
        final value = json['language']?.toString();
        if (value == null) {
          throw FormatException('SdkReferenceArchiveGenerateRequest.language is required');
        }
        return value;
      })(),
      spec: (() {
        final map = _sdkworkAsMap(json['spec']);
        if (map == null) {
          throw FormatException('SdkReferenceArchiveGenerateRequest.spec is required');
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'config': config,
      'language': language,
      'spec': spec.map((key, item) => MapEntry(key, item)),
    };
  }
}

class SdkReferenceArchiveResponse {
  final String contentBase64;
  final String contentType;
  final String fileName;
  final String language;

  SdkReferenceArchiveResponse({
    required this.contentBase64,
    required this.contentType,
    required this.fileName,
    required this.language
  });

  factory SdkReferenceArchiveResponse.fromJson(Map<String, dynamic> json) {
    return SdkReferenceArchiveResponse(
      contentBase64: (() {
        final value = json['contentBase64']?.toString();
        if (value == null) {
          throw FormatException('SdkReferenceArchiveResponse.contentBase64 is required');
        }
        return value;
      })(),
      contentType: (() {
        final value = json['contentType']?.toString();
        if (value == null) {
          throw FormatException('SdkReferenceArchiveResponse.contentType is required');
        }
        return value;
      })(),
      fileName: (() {
        final value = json['fileName']?.toString();
        if (value == null) {
          throw FormatException('SdkReferenceArchiveResponse.fileName is required');
        }
        return value;
      })(),
      language: (() {
        final value = json['language']?.toString();
        if (value == null) {
          throw FormatException('SdkReferenceArchiveResponse.language is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'contentBase64': contentBase64,
      'contentType': contentType,
      'fileName': fileName,
      'language': language,
    };
  }
}

class SdkReferenceDocumentationGenerateRequest {
  final Map<String, dynamic> config;
  final String language;
  final Map<String, dynamic> spec;

  SdkReferenceDocumentationGenerateRequest({
    required this.config,
    required this.language,
    required this.spec
  });

  factory SdkReferenceDocumentationGenerateRequest.fromJson(Map<String, dynamic> json) {
    return SdkReferenceDocumentationGenerateRequest(
      config: (() {
        final map = _sdkworkAsMap(json['config']);
        if (map == null) {
          throw FormatException('SdkReferenceDocumentationGenerateRequest.config is required');
        }
        return map;
      })(),
      language: (() {
        final value = json['language']?.toString();
        if (value == null) {
          throw FormatException('SdkReferenceDocumentationGenerateRequest.language is required');
        }
        return value;
      })(),
      spec: (() {
        final map = _sdkworkAsMap(json['spec']);
        if (map == null) {
          throw FormatException('SdkReferenceDocumentationGenerateRequest.spec is required');
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'config': config,
      'language': language,
      'spec': spec.map((key, item) => MapEntry(key, item)),
    };
  }
}

class SdkReferenceDocumentationResponse {
  final bool generated;
  final String language;
  final String? methodDefinition;
  final String readme;
  final String? usageExample;

  SdkReferenceDocumentationResponse({
    required this.generated,
    required this.language,
    this.methodDefinition,
    required this.readme,
    this.usageExample
  });

  factory SdkReferenceDocumentationResponse.fromJson(Map<String, dynamic> json) {
    return SdkReferenceDocumentationResponse(
      generated: (() {
        final value = json['generated'];
        if (value is! bool) {
          throw FormatException('SdkReferenceDocumentationResponse.generated is required');
        }
        return value;
      })(),
      language: (() {
        final value = json['language']?.toString();
        if (value == null) {
          throw FormatException('SdkReferenceDocumentationResponse.language is required');
        }
        return value;
      })(),
      methodDefinition: json['methodDefinition']?.toString(),
      readme: (() {
        final value = json['readme']?.toString();
        if (value == null) {
          throw FormatException('SdkReferenceDocumentationResponse.readme is required');
        }
        return value;
      })(),
      usageExample: json['usageExample']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'generated': generated,
      'language': language,
      'methodDefinition': methodDefinition,
      'readme': readme,
      'usageExample': usageExample,
    };
  }
}

class SettingsDataResponse {
  final String language;
  final SettingsNotifications notifications;
  final String timezone;
  final String webhookUrl;

  SettingsDataResponse({
    required this.language,
    required this.notifications,
    required this.timezone,
    required this.webhookUrl
  });

  factory SettingsDataResponse.fromJson(Map<String, dynamic> json) {
    return SettingsDataResponse(
      language: (() {
        final value = json['language']?.toString();
        if (value == null) {
          throw FormatException('SettingsDataResponse.language is required');
        }
        return value;
      })(),
      notifications: (() {
        final map = _sdkworkAsMap(json['notifications']);
        if (map == null) {
          throw FormatException('SettingsDataResponse.notifications is required');
        }
        return SettingsNotifications.fromJson(map);
      })(),
      timezone: (() {
        final value = json['timezone']?.toString();
        if (value == null) {
          throw FormatException('SettingsDataResponse.timezone is required');
        }
        return value;
      })(),
      webhookUrl: (() {
        final value = json['webhookUrl']?.toString();
        if (value == null) {
          throw FormatException('SettingsDataResponse.webhookUrl is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'language': language,
      'notifications': notifications.toJson(),
      'timezone': timezone,
      'webhookUrl': webhookUrl,
    };
  }
}

class SettingsNotifications {
  final bool apiMonitor;
  final bool billReminder;
  final bool quotaWarning;

  SettingsNotifications({
    required this.apiMonitor,
    required this.billReminder,
    required this.quotaWarning
  });

  factory SettingsNotifications.fromJson(Map<String, dynamic> json) {
    return SettingsNotifications(
      apiMonitor: (() {
        final value = json['apiMonitor'];
        if (value is! bool) {
          throw FormatException('SettingsNotifications.apiMonitor is required');
        }
        return value;
      })(),
      billReminder: (() {
        final value = json['billReminder'];
        if (value is! bool) {
          throw FormatException('SettingsNotifications.billReminder is required');
        }
        return value;
      })(),
      quotaWarning: (() {
        final value = json['quotaWarning'];
        if (value is! bool) {
          throw FormatException('SettingsNotifications.quotaWarning is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'apiMonitor': apiMonitor,
      'billReminder': billReminder,
      'quotaWarning': quotaWarning,
    };
  }
}

class SiteRuntimeRetrieveResult {
  final String code;
  final SiteRuntimeSettingsResponse? data;
  final String? msg;

  SiteRuntimeRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory SiteRuntimeRetrieveResult.fromJson(Map<String, dynamic> json) {
    return SiteRuntimeRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SiteRuntimeSettingsResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class SiteRuntimeSettingsResponse {
  final String accentColor;
  final String brandColor;
  final String customCss;
  final String description;
  final String docsUrl;
  final MediaResource favicon;
  final String footerCopyright;
  final MediaResource icon;
  final String icpRecordNumber;
  final String icpRecordUrl;
  final MediaResource logo;
  final String policeRecordNumber;
  final String policeRecordUrl;
  final String privacyUrl;
  final String seoDescription;
  final String seoTitle;
  final String shortName;
  final String siteName;
  final String supportUrl;
  final String termsUrl;

  SiteRuntimeSettingsResponse({
    required this.accentColor,
    required this.brandColor,
    required this.customCss,
    required this.description,
    required this.docsUrl,
    required this.favicon,
    required this.footerCopyright,
    required this.icon,
    required this.icpRecordNumber,
    required this.icpRecordUrl,
    required this.logo,
    required this.policeRecordNumber,
    required this.policeRecordUrl,
    required this.privacyUrl,
    required this.seoDescription,
    required this.seoTitle,
    required this.shortName,
    required this.siteName,
    required this.supportUrl,
    required this.termsUrl
  });

  factory SiteRuntimeSettingsResponse.fromJson(Map<String, dynamic> json) {
    return SiteRuntimeSettingsResponse(
      accentColor: (() {
        final value = json['accentColor']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.accentColor is required');
        }
        return value;
      })(),
      brandColor: (() {
        final value = json['brandColor']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.brandColor is required');
        }
        return value;
      })(),
      customCss: (() {
        final value = json['customCss']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.customCss is required');
        }
        return value;
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.description is required');
        }
        return value;
      })(),
      docsUrl: (() {
        final value = json['docsUrl']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.docsUrl is required');
        }
        return value;
      })(),
      favicon: (() {
        final map = _sdkworkAsMap(json['favicon']);
        if (map == null) {
          throw FormatException('SiteRuntimeSettingsResponse.favicon is required');
        }
        return MediaResource.fromJson(map);
      })(),
      footerCopyright: (() {
        final value = json['footerCopyright']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.footerCopyright is required');
        }
        return value;
      })(),
      icon: (() {
        final map = _sdkworkAsMap(json['icon']);
        if (map == null) {
          throw FormatException('SiteRuntimeSettingsResponse.icon is required');
        }
        return MediaResource.fromJson(map);
      })(),
      icpRecordNumber: (() {
        final value = json['icpRecordNumber']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.icpRecordNumber is required');
        }
        return value;
      })(),
      icpRecordUrl: (() {
        final value = json['icpRecordUrl']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.icpRecordUrl is required');
        }
        return value;
      })(),
      logo: (() {
        final map = _sdkworkAsMap(json['logo']);
        if (map == null) {
          throw FormatException('SiteRuntimeSettingsResponse.logo is required');
        }
        return MediaResource.fromJson(map);
      })(),
      policeRecordNumber: (() {
        final value = json['policeRecordNumber']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.policeRecordNumber is required');
        }
        return value;
      })(),
      policeRecordUrl: (() {
        final value = json['policeRecordUrl']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.policeRecordUrl is required');
        }
        return value;
      })(),
      privacyUrl: (() {
        final value = json['privacyUrl']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.privacyUrl is required');
        }
        return value;
      })(),
      seoDescription: (() {
        final value = json['seoDescription']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.seoDescription is required');
        }
        return value;
      })(),
      seoTitle: (() {
        final value = json['seoTitle']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.seoTitle is required');
        }
        return value;
      })(),
      shortName: (() {
        final value = json['shortName']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.shortName is required');
        }
        return value;
      })(),
      siteName: (() {
        final value = json['siteName']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.siteName is required');
        }
        return value;
      })(),
      supportUrl: (() {
        final value = json['supportUrl']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.supportUrl is required');
        }
        return value;
      })(),
      termsUrl: (() {
        final value = json['termsUrl']?.toString();
        if (value == null) {
          throw FormatException('SiteRuntimeSettingsResponse.termsUrl is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'accentColor': accentColor,
      'brandColor': brandColor,
      'customCss': customCss,
      'description': description,
      'docsUrl': docsUrl,
      'favicon': favicon.toJson(),
      'footerCopyright': footerCopyright,
      'icon': icon.toJson(),
      'icpRecordNumber': icpRecordNumber,
      'icpRecordUrl': icpRecordUrl,
      'logo': logo.toJson(),
      'policeRecordNumber': policeRecordNumber,
      'policeRecordUrl': policeRecordUrl,
      'privacyUrl': privacyUrl,
      'seoDescription': seoDescription,
      'seoTitle': seoTitle,
      'shortName': shortName,
      'siteName': siteName,
      'supportUrl': supportUrl,
      'termsUrl': termsUrl,
    };
  }
}

class SkillCatalogItem {
  final String category;
  final String clawhubImage;
  final String description;
  final String developer;
  final String downloads;
  final List<String> features;
  final List<String> frameworks;
  final String id;
  final MediaResource image;
  final String lastUpdated;
  final String license;
  final String name;
  final List<SkillPackageItem>? packages;
  final double rating;
  final List<MediaResource> screenshots;
  final String size;
  final String version;

  SkillCatalogItem({
    required this.category,
    required this.clawhubImage,
    required this.description,
    required this.developer,
    required this.downloads,
    required this.features,
    required this.frameworks,
    required this.id,
    required this.image,
    required this.lastUpdated,
    required this.license,
    required this.name,
    this.packages,
    required this.rating,
    required this.screenshots,
    required this.size,
    required this.version
  });

  factory SkillCatalogItem.fromJson(Map<String, dynamic> json) {
    return SkillCatalogItem(
      category: (() {
        final value = json['category']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.category is required');
        }
        return value;
      })(),
      clawhubImage: (() {
        final value = json['clawhubImage']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.clawhubImage is required');
        }
        return value;
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.description is required');
        }
        return value;
      })(),
      developer: (() {
        final value = json['developer']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.developer is required');
        }
        return value;
      })(),
      downloads: (() {
        final value = json['downloads']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.downloads is required');
        }
        return value;
      })(),
      features: (() {
        final list = _sdkworkAsList(json['features']);
        if (list == null) {
          throw FormatException('SkillCatalogItem.features is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      frameworks: (() {
        final list = _sdkworkAsList(json['frameworks']);
        if (list == null) {
          throw FormatException('SkillCatalogItem.frameworks is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.id is required');
        }
        return value;
      })(),
      image: (() {
        final map = _sdkworkAsMap(json['image']);
        if (map == null) {
          throw FormatException('SkillCatalogItem.image is required');
        }
        return MediaResource.fromJson(map);
      })(),
      lastUpdated: (() {
        final value = json['lastUpdated']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.lastUpdated is required');
        }
        return value;
      })(),
      license: (() {
        final value = json['license']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.license is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.name is required');
        }
        return value;
      })(),
      packages: (() {
        final list = _sdkworkAsList(json['packages']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : SkillPackageItem.fromJson(map);
      })())
            .whereType<SkillPackageItem>()
            .toList();
      })(),
      rating: (() {
        final value = json['rating'];
        if (value is! num) {
          throw FormatException('SkillCatalogItem.rating is required');
        }
        return value.toDouble();
      })(),
      screenshots: (() {
        final list = _sdkworkAsList(json['screenshots']);
        if (list == null) {
          throw FormatException('SkillCatalogItem.screenshots is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MediaResource.fromJson(map);
      })())
            .whereType<MediaResource>()
            .toList();
      })(),
      size: (() {
        final value = json['size']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.size is required');
        }
        return value;
      })(),
      version: (() {
        final value = json['version']?.toString();
        if (value == null) {
          throw FormatException('SkillCatalogItem.version is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'clawhubImage': clawhubImage,
      'description': description,
      'developer': developer,
      'downloads': downloads,
      'features': features.map((item) => item).toList(),
      'frameworks': frameworks.map((item) => item).toList(),
      'id': id,
      'image': image.toJson(),
      'lastUpdated': lastUpdated,
      'license': license,
      'name': name,
      'packages': packages?.map((item) => item.toJson()).toList(),
      'rating': rating,
      'screenshots': screenshots.map((item) => item.toJson()).toList(),
      'size': size,
      'version': version,
    };
  }
}

class SkillCategoriesResponse {
  final List<String> items;

  SkillCategoriesResponse({
    required this.items
  });

  factory SkillCategoriesResponse.fromJson(Map<String, dynamic> json) {
    return SkillCategoriesResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('SkillCategoriesResponse.items is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item).toList(),
    };
  }
}

class SkillDetailResponse {
  final String category;
  final String clawhubImage;
  final String description;
  final String developer;
  final String downloads;
  final List<String> features;
  final List<String> frameworks;
  final String id;
  final MediaResource image;
  final String lastUpdated;
  final String license;
  final String name;
  final List<SkillPackageItem>? packages;
  final double rating;
  final List<MediaResource> screenshots;
  final String size;
  final String version;

  SkillDetailResponse({
    required this.category,
    required this.clawhubImage,
    required this.description,
    required this.developer,
    required this.downloads,
    required this.features,
    required this.frameworks,
    required this.id,
    required this.image,
    required this.lastUpdated,
    required this.license,
    required this.name,
    this.packages,
    required this.rating,
    required this.screenshots,
    required this.size,
    required this.version
  });

  factory SkillDetailResponse.fromJson(Map<String, dynamic> json) {
    return SkillDetailResponse(
      category: (() {
        final value = json['category']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.category is required');
        }
        return value;
      })(),
      clawhubImage: (() {
        final value = json['clawhubImage']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.clawhubImage is required');
        }
        return value;
      })(),
      description: (() {
        final value = json['description']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.description is required');
        }
        return value;
      })(),
      developer: (() {
        final value = json['developer']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.developer is required');
        }
        return value;
      })(),
      downloads: (() {
        final value = json['downloads']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.downloads is required');
        }
        return value;
      })(),
      features: (() {
        final list = _sdkworkAsList(json['features']);
        if (list == null) {
          throw FormatException('SkillDetailResponse.features is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      frameworks: (() {
        final list = _sdkworkAsList(json['frameworks']);
        if (list == null) {
          throw FormatException('SkillDetailResponse.frameworks is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.id is required');
        }
        return value;
      })(),
      image: (() {
        final map = _sdkworkAsMap(json['image']);
        if (map == null) {
          throw FormatException('SkillDetailResponse.image is required');
        }
        return MediaResource.fromJson(map);
      })(),
      lastUpdated: (() {
        final value = json['lastUpdated']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.lastUpdated is required');
        }
        return value;
      })(),
      license: (() {
        final value = json['license']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.license is required');
        }
        return value;
      })(),
      name: (() {
        final value = json['name']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.name is required');
        }
        return value;
      })(),
      packages: (() {
        final list = _sdkworkAsList(json['packages']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : SkillPackageItem.fromJson(map);
      })())
            .whereType<SkillPackageItem>()
            .toList();
      })(),
      rating: (() {
        final value = json['rating'];
        if (value is! num) {
          throw FormatException('SkillDetailResponse.rating is required');
        }
        return value.toDouble();
      })(),
      screenshots: (() {
        final list = _sdkworkAsList(json['screenshots']);
        if (list == null) {
          throw FormatException('SkillDetailResponse.screenshots is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : MediaResource.fromJson(map);
      })())
            .whereType<MediaResource>()
            .toList();
      })(),
      size: (() {
        final value = json['size']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.size is required');
        }
        return value;
      })(),
      version: (() {
        final value = json['version']?.toString();
        if (value == null) {
          throw FormatException('SkillDetailResponse.version is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'clawhubImage': clawhubImage,
      'description': description,
      'developer': developer,
      'downloads': downloads,
      'features': features.map((item) => item).toList(),
      'frameworks': frameworks.map((item) => item).toList(),
      'id': id,
      'image': image.toJson(),
      'lastUpdated': lastUpdated,
      'license': license,
      'name': name,
      'packages': packages?.map((item) => item.toJson()).toList(),
      'rating': rating,
      'screenshots': screenshots.map((item) => item.toJson()).toList(),
      'size': size,
      'version': version,
    };
  }
}

class SkillPackageItem {
  final String artifactRef;
  final String artifactSizeBytes;
  final List<String> frameworks;
  final String id;
  final String licenseName;
  final String publishedAt;
  final String version;

  SkillPackageItem({
    required this.artifactRef,
    required this.artifactSizeBytes,
    required this.frameworks,
    required this.id,
    required this.licenseName,
    required this.publishedAt,
    required this.version
  });

  factory SkillPackageItem.fromJson(Map<String, dynamic> json) {
    return SkillPackageItem(
      artifactRef: (() {
        final value = json['artifactRef']?.toString();
        if (value == null) {
          throw FormatException('SkillPackageItem.artifactRef is required');
        }
        return value;
      })(),
      artifactSizeBytes: (() {
        final value = json['artifactSizeBytes']?.toString();
        if (value == null) {
          throw FormatException('SkillPackageItem.artifactSizeBytes is required');
        }
        return value;
      })(),
      frameworks: (() {
        final list = _sdkworkAsList(json['frameworks']);
        if (list == null) {
          throw FormatException('SkillPackageItem.frameworks is required');
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('SkillPackageItem.id is required');
        }
        return value;
      })(),
      licenseName: (() {
        final value = json['licenseName']?.toString();
        if (value == null) {
          throw FormatException('SkillPackageItem.licenseName is required');
        }
        return value;
      })(),
      publishedAt: (() {
        final value = json['publishedAt']?.toString();
        if (value == null) {
          throw FormatException('SkillPackageItem.publishedAt is required');
        }
        return value;
      })(),
      version: (() {
        final value = json['version']?.toString();
        if (value == null) {
          throw FormatException('SkillPackageItem.version is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'artifactRef': artifactRef,
      'artifactSizeBytes': artifactSizeBytes,
      'frameworks': frameworks.map((item) => item).toList(),
      'id': id,
      'licenseName': licenseName,
      'publishedAt': publishedAt,
      'version': version,
    };
  }
}

class SkillsCatalogResponse {
  final List<SkillCatalogItem> items;

  SkillsCatalogResponse({
    required this.items
  });

  factory SkillsCatalogResponse.fromJson(Map<String, dynamic> json) {
    return SkillsCatalogResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          throw FormatException('SkillsCatalogResponse.items is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : SkillCatalogItem.fromJson(map);
      })())
            .whereType<SkillCatalogItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class SkillsCategoriesListResult {
  final String code;
  final SkillCategoriesResponse? data;
  final String? msg;

  SkillsCategoriesListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory SkillsCategoriesListResult.fromJson(Map<String, dynamic> json) {
    return SkillsCategoriesListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('SkillsCategoriesListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SkillCategoriesResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class SkillsConfigUpdateResult {
  final String code;
  final AppInstalledSkillResponse? data;
  final String? msg;

  SkillsConfigUpdateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory SkillsConfigUpdateResult.fromJson(Map<String, dynamic> json) {
    return SkillsConfigUpdateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('SkillsConfigUpdateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppInstalledSkillResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class SkillsDisableResult {
  final String code;
  final AppInstalledSkillResponse? data;
  final String? msg;

  SkillsDisableResult({
    required this.code,
    this.data,
    this.msg
  });

  factory SkillsDisableResult.fromJson(Map<String, dynamic> json) {
    return SkillsDisableResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('SkillsDisableResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppInstalledSkillResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class SkillsEnableResult {
  final String code;
  final AppInstalledSkillResponse? data;
  final String? msg;

  SkillsEnableResult({
    required this.code,
    this.data,
    this.msg
  });

  factory SkillsEnableResult.fromJson(Map<String, dynamic> json) {
    return SkillsEnableResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('SkillsEnableResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppInstalledSkillResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class SkillsListResult {
  final String code;
  final SkillsCatalogResponse? data;
  final String? msg;

  SkillsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory SkillsListResult.fromJson(Map<String, dynamic> json) {
    return SkillsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('SkillsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SkillsCatalogResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class SkillsRetrieveResult {
  final String code;
  final SkillDetailResponse? data;
  final String? msg;

  SkillsRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory SkillsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return SkillsRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('SkillsRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SkillDetailResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class SpacesCreateResult {
  final String code;
  final MemorySpaceResponse? data;
  final String? msg;

  SpacesCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory SpacesCreateResult.fromJson(Map<String, dynamic> json) {
    return SpacesCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('SpacesCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : MemorySpaceResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class SpacesListResult {
  final String code;
  final MemorySpaceListResponse? data;
  final String? msg;

  SpacesListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory SpacesListResult.fromJson(Map<String, dynamic> json) {
    return SpacesListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('SpacesListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : MemorySpaceListResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class SpacesRetrieveResult {
  final String code;
  final MemorySpaceItem? data;
  final String? msg;

  SpacesRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory SpacesRetrieveResult.fromJson(Map<String, dynamic> json) {
    return SpacesRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('SpacesRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : MemorySpaceItem.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class TurnResponsesCreateResult {
  final String code;
  final ChatTurnCreateResponse? data;
  final String? msg;

  TurnResponsesCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory TurnResponsesCreateResult.fromJson(Map<String, dynamic> json) {
    return TurnResponsesCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('TurnResponsesCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ChatTurnCreateResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class TurnsCreateResult {
  final String code;
  final ChatTurnCreateResponse? data;
  final String? msg;

  TurnsCreateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory TurnsCreateResult.fromJson(Map<String, dynamic> json) {
    return TurnsCreateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('TurnsCreateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ChatTurnCreateResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class UpdateApiKeyRequest {
  final String? channelGroup;
  final bool? defaultForRuntime;
  final String? expires;
  final String? ipLimit;
  final bool? isUnlimitedQuota;
  final List<String>? modalities;
  final String? name;
  final String? quota;

  UpdateApiKeyRequest({
    this.channelGroup,
    this.defaultForRuntime,
    this.expires,
    this.ipLimit,
    this.isUnlimitedQuota,
    this.modalities,
    this.name,
    this.quota
  });

  factory UpdateApiKeyRequest.fromJson(Map<String, dynamic> json) {
    return UpdateApiKeyRequest(
      channelGroup: json['channelGroup']?.toString(),
      defaultForRuntime: json['defaultForRuntime'] is bool ? json['defaultForRuntime'] : null,
      expires: json['expires']?.toString(),
      ipLimit: json['ipLimit']?.toString(),
      isUnlimitedQuota: json['isUnlimitedQuota'] is bool ? json['isUnlimitedQuota'] : null,
      modalities: (() {
        final list = _sdkworkAsList(json['modalities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      name: json['name']?.toString(),
      quota: json['quota']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'channelGroup': channelGroup,
      'defaultForRuntime': defaultForRuntime,
      'expires': expires,
      'ipLimit': ipLimit,
      'isUnlimitedQuota': isUnlimitedQuota,
      'modalities': modalities?.map((item) => item).toList(),
      'name': name,
      'quota': quota,
    };
  }
}

class UpdateApiKeyResponse {
  final AppApiKeyItem item;

  UpdateApiKeyResponse({
    required this.item
  });

  factory UpdateApiKeyResponse.fromJson(Map<String, dynamic> json) {
    return UpdateApiKeyResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        if (map == null) {
          throw FormatException('UpdateApiKeyResponse.item is required');
        }
        return AppApiKeyItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item.toJson(),
    };
  }
}

class UpdateSettingsRequest {
  final String language;
  final SettingsNotifications notifications;
  final String timezone;
  final String webhookUrl;

  UpdateSettingsRequest({
    required this.language,
    required this.notifications,
    required this.timezone,
    required this.webhookUrl
  });

  factory UpdateSettingsRequest.fromJson(Map<String, dynamic> json) {
    return UpdateSettingsRequest(
      language: (() {
        final value = json['language']?.toString();
        if (value == null) {
          throw FormatException('UpdateSettingsRequest.language is required');
        }
        return value;
      })(),
      notifications: (() {
        final map = _sdkworkAsMap(json['notifications']);
        if (map == null) {
          throw FormatException('UpdateSettingsRequest.notifications is required');
        }
        return SettingsNotifications.fromJson(map);
      })(),
      timezone: (() {
        final value = json['timezone']?.toString();
        if (value == null) {
          throw FormatException('UpdateSettingsRequest.timezone is required');
        }
        return value;
      })(),
      webhookUrl: (() {
        final value = json['webhookUrl']?.toString();
        if (value == null) {
          throw FormatException('UpdateSettingsRequest.webhookUrl is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'language': language,
      'notifications': notifications.toJson(),
      'timezone': timezone,
      'webhookUrl': webhookUrl,
    };
  }
}

class UpdateSettingsResponse {
  final bool success;

  UpdateSettingsResponse({
    required this.success
  });

  factory UpdateSettingsResponse.fromJson(Map<String, dynamic> json) {
    return UpdateSettingsResponse(
      success: (() {
        final value = json['success'];
        if (value is! bool) {
          throw FormatException('UpdateSettingsResponse.success is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'success': success,
    };
  }
}

class UsageLogItem {
  final String baseInputPrice;
  final String baseOutputPrice;
  final String cacheReadPrice;
  final String cacheReadTokens;
  final String cost;
  final String errorCode;
  final String errorMessage;
  final String errorType;
  final String group;
  final String httpStatus;
  final String id;
  final String inputTokens;
  final String ip;
  final bool isStream;
  final String model;
  final String multiplier;
  final String outputTokens;
  final String path;
  final String providerNativeModel;
  final String reasoningEffort;
  final String regionCode;
  final String requestId;
  final String requestedModelCatalogKey;
  final String status;
  final String time;
  final String tokenName;
  final String totalTime;
  final String ttft;
  final String type;
  final String userAgent;

  UsageLogItem({
    required this.baseInputPrice,
    required this.baseOutputPrice,
    required this.cacheReadPrice,
    required this.cacheReadTokens,
    required this.cost,
    required this.errorCode,
    required this.errorMessage,
    required this.errorType,
    required this.group,
    required this.httpStatus,
    required this.id,
    required this.inputTokens,
    required this.ip,
    required this.isStream,
    required this.model,
    required this.multiplier,
    required this.outputTokens,
    required this.path,
    required this.providerNativeModel,
    required this.reasoningEffort,
    required this.regionCode,
    required this.requestId,
    required this.requestedModelCatalogKey,
    required this.status,
    required this.time,
    required this.tokenName,
    required this.totalTime,
    required this.ttft,
    required this.type,
    required this.userAgent
  });

  factory UsageLogItem.fromJson(Map<String, dynamic> json) {
    return UsageLogItem(
      baseInputPrice: (() {
        final value = json['baseInputPrice']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.baseInputPrice is required');
        }
        return value;
      })(),
      baseOutputPrice: (() {
        final value = json['baseOutputPrice']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.baseOutputPrice is required');
        }
        return value;
      })(),
      cacheReadPrice: (() {
        final value = json['cacheReadPrice']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.cacheReadPrice is required');
        }
        return value;
      })(),
      cacheReadTokens: (() {
        final value = json['cacheReadTokens']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.cacheReadTokens is required');
        }
        return value;
      })(),
      cost: (() {
        final value = json['cost']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.cost is required');
        }
        return value;
      })(),
      errorCode: (() {
        final value = json['errorCode']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.errorCode is required');
        }
        return value;
      })(),
      errorMessage: (() {
        final value = json['errorMessage']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.errorMessage is required');
        }
        return value;
      })(),
      errorType: (() {
        final value = json['errorType']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.errorType is required');
        }
        return value;
      })(),
      group: (() {
        final value = json['group']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.group is required');
        }
        return value;
      })(),
      httpStatus: (() {
        final value = json['httpStatus']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.httpStatus is required');
        }
        return value;
      })(),
      id: (() {
        final value = json['id']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.id is required');
        }
        return value;
      })(),
      inputTokens: (() {
        final value = json['inputTokens']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.inputTokens is required');
        }
        return value;
      })(),
      ip: (() {
        final value = json['ip']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.ip is required');
        }
        return value;
      })(),
      isStream: (() {
        final value = json['isStream'];
        if (value is! bool) {
          throw FormatException('UsageLogItem.isStream is required');
        }
        return value;
      })(),
      model: (() {
        final value = json['model']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.model is required');
        }
        return value;
      })(),
      multiplier: (() {
        final value = json['multiplier']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.multiplier is required');
        }
        return value;
      })(),
      outputTokens: (() {
        final value = json['outputTokens']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.outputTokens is required');
        }
        return value;
      })(),
      path: (() {
        final value = json['path']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.path is required');
        }
        return value;
      })(),
      providerNativeModel: (() {
        final value = json['providerNativeModel']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.providerNativeModel is required');
        }
        return value;
      })(),
      reasoningEffort: (() {
        final value = json['reasoningEffort']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.reasoningEffort is required');
        }
        return value;
      })(),
      regionCode: (() {
        final value = json['regionCode']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.regionCode is required');
        }
        return value;
      })(),
      requestId: (() {
        final value = json['requestId']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.requestId is required');
        }
        return value;
      })(),
      requestedModelCatalogKey: (() {
        final value = json['requestedModelCatalogKey']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.requestedModelCatalogKey is required');
        }
        return value;
      })(),
      status: (() {
        final value = json['status']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.status is required');
        }
        return value;
      })(),
      time: (() {
        final value = json['time']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.time is required');
        }
        return value;
      })(),
      tokenName: (() {
        final value = json['tokenName']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.tokenName is required');
        }
        return value;
      })(),
      totalTime: (() {
        final value = json['totalTime']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.totalTime is required');
        }
        return value;
      })(),
      ttft: (() {
        final value = json['ttft']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.ttft is required');
        }
        return value;
      })(),
      type: (() {
        final value = json['type']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.type is required');
        }
        return value;
      })(),
      userAgent: (() {
        final value = json['userAgent']?.toString();
        if (value == null) {
          throw FormatException('UsageLogItem.userAgent is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'baseInputPrice': baseInputPrice,
      'baseOutputPrice': baseOutputPrice,
      'cacheReadPrice': cacheReadPrice,
      'cacheReadTokens': cacheReadTokens,
      'cost': cost,
      'errorCode': errorCode,
      'errorMessage': errorMessage,
      'errorType': errorType,
      'group': group,
      'httpStatus': httpStatus,
      'id': id,
      'inputTokens': inputTokens,
      'ip': ip,
      'isStream': isStream,
      'model': model,
      'multiplier': multiplier,
      'outputTokens': outputTokens,
      'path': path,
      'providerNativeModel': providerNativeModel,
      'reasoningEffort': reasoningEffort,
      'regionCode': regionCode,
      'requestId': requestId,
      'requestedModelCatalogKey': requestedModelCatalogKey,
      'status': status,
      'time': time,
      'tokenName': tokenName,
      'totalTime': totalTime,
      'ttft': ttft,
      'type': type,
      'userAgent': userAgent,
    };
  }
}

class UsageLogsListResult {
  final String code;
  final UsageLogsResponse? data;
  final String? msg;

  UsageLogsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory UsageLogsListResult.fromJson(Map<String, dynamic> json) {
    return UsageLogsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('UsageLogsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : UsageLogsResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class UsageLogsResponse {
  final List<UsageLogItem> logs;
  final String page;
  final String pageSize;
  final String total;

  UsageLogsResponse({
    required this.logs,
    required this.page,
    required this.pageSize,
    required this.total
  });

  factory UsageLogsResponse.fromJson(Map<String, dynamic> json) {
    return UsageLogsResponse(
      logs: (() {
        final list = _sdkworkAsList(json['logs']);
        if (list == null) {
          throw FormatException('UsageLogsResponse.logs is required');
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : UsageLogItem.fromJson(map);
      })())
            .whereType<UsageLogItem>()
            .toList();
      })(),
      page: (() {
        final value = json['page']?.toString();
        if (value == null) {
          throw FormatException('UsageLogsResponse.page is required');
        }
        return value;
      })(),
      pageSize: (() {
        final value = json['pageSize']?.toString();
        if (value == null) {
          throw FormatException('UsageLogsResponse.pageSize is required');
        }
        return value;
      })(),
      total: (() {
        final value = json['total']?.toString();
        if (value == null) {
          throw FormatException('UsageLogsResponse.total is required');
        }
        return value;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'logs': logs.map((item) => item.toJson()).toList(),
      'page': page,
      'pageSize': pageSize,
      'total': total,
    };
  }
}

class UsageSnapshot {
  final String? cachedTokens;
  final String? inputTokens;
  final String? outputTokens;
  final String? totalTokens;

  UsageSnapshot({
    this.cachedTokens,
    this.inputTokens,
    this.outputTokens,
    this.totalTokens
  });

  factory UsageSnapshot.fromJson(Map<String, dynamic> json) {
    return UsageSnapshot(
      cachedTokens: json['cachedTokens']?.toString(),
      inputTokens: json['inputTokens']?.toString(),
      outputTokens: json['outputTokens']?.toString(),
      totalTokens: json['totalTokens']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cachedTokens': cachedTokens,
      'inputTokens': inputTokens,
      'outputTokens': outputTokens,
      'totalTokens': totalTokens,
    };
  }
}

class UsersCurrentCommentsListResult {
  final String code;
  final ForumCommentPage? data;
  final String? msg;

  UsersCurrentCommentsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory UsersCurrentCommentsListResult.fromJson(Map<String, dynamic> json) {
    return UsersCurrentCommentsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('UsersCurrentCommentsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentPage.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class UsersCurrentSkillsListResult {
  final String code;
  final AppInstalledSkillsResponse? data;
  final String? msg;

  UsersCurrentSkillsListResult({
    required this.code,
    this.data,
    this.msg
  });

  factory UsersCurrentSkillsListResult.fromJson(Map<String, dynamic> json) {
    return UsersCurrentSkillsListResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('UsersCurrentSkillsListResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppInstalledSkillsResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class UsersSettingsRetrieveResult {
  final String code;
  final SettingsDataResponse? data;
  final String? msg;

  UsersSettingsRetrieveResult({
    required this.code,
    this.data,
    this.msg
  });

  factory UsersSettingsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return UsersSettingsRetrieveResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('UsersSettingsRetrieveResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SettingsDataResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}

class UsersSettingsUpdateResult {
  final String code;
  final UpdateSettingsResponse? data;
  final String? msg;

  UsersSettingsUpdateResult({
    required this.code,
    this.data,
    this.msg
  });

  factory UsersSettingsUpdateResult.fromJson(Map<String, dynamic> json) {
    return UsersSettingsUpdateResult(
      code: (() {
        final value = json['code']?.toString();
        if (value == null) {
          throw FormatException('UsersSettingsUpdateResult.code is required');
        }
        return value;
      })(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : UpdateSettingsResponse.fromJson(map);
      })(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'msg': msg,
    };
  }
}
