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

class AnthropicContentBlock {
  final String? id;
  final Map<String, dynamic>? input;
  final String? name;
  final String? text;
  final String? type;

  AnthropicContentBlock({
    this.id,
    this.input,
    this.name,
    this.text,
    this.type
  });

  factory AnthropicContentBlock.fromJson(Map<String, dynamic> json) {
    return AnthropicContentBlock(
      id: json['id']?.toString(),
      input: (() {
        final map = _sdkworkAsMap(json['input']);
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
      name: json['name']?.toString(),
      text: json['text']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'input': input?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'text': text,
      'type': type,
    };
  }
}

class AnthropicContentBlockParam {
  final dynamic content;
  final String? id;
  final Map<String, dynamic>? input;
  final String? name;
  final AnthropicContentSource? source;
  final String? text;
  final String? toolUseId;
  final String? type;

  AnthropicContentBlockParam({
    this.content,
    this.id,
    this.input,
    this.name,
    this.source,
    this.text,
    this.toolUseId,
    this.type
  });

  factory AnthropicContentBlockParam.fromJson(Map<String, dynamic> json) {
    return AnthropicContentBlockParam(
      content: json['content']?.toString(),
      id: json['id']?.toString(),
      input: (() {
        final map = _sdkworkAsMap(json['input']);
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
      name: json['name']?.toString(),
      source: (() {
        final map = _sdkworkAsMap(json['source']);
        return map == null ? null : AnthropicContentSource.fromJson(map);
      })(),
      text: json['text']?.toString(),
      toolUseId: json['tool_use_id']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'id': id,
      'input': input?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'source': source?.toJson(),
      'text': text,
      'tool_use_id': toolUseId,
      'type': type,
    };
  }
}

class AnthropicContentSource {
  final String? data;
  final String? fileId;
  final String? mediaType;
  final String? type;
  final String? url;

  AnthropicContentSource({
    this.data,
    this.fileId,
    this.mediaType,
    this.type,
    this.url
  });

  factory AnthropicContentSource.fromJson(Map<String, dynamic> json) {
    return AnthropicContentSource(
      data: json['data']?.toString(),
      fileId: json['file_id']?.toString(),
      mediaType: json['media_type']?.toString(),
      type: json['type']?.toString(),
      url: json['url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data,
      'file_id': fileId,
      'media_type': mediaType,
      'type': type,
      'url': url,
    };
  }
}

class AnthropicCountMessageTokensRequest {
  final int? maxTokens;
  final List<AnthropicMessageParam>? messages;
  final Map<String, dynamic>? metadata;
  final String? model;
  final List<String>? stopSequences;
  final bool? stream;
  final dynamic system;
  final double? temperature;
  final AnthropicThinkingConfig? thinking;
  final AnthropicToolChoice? toolChoice;
  final List<AnthropicTool>? tools;
  final int? topK;
  final double? topP;

  AnthropicCountMessageTokensRequest({
    this.maxTokens,
    this.messages,
    this.metadata,
    this.model,
    this.stopSequences,
    this.stream,
    this.system,
    this.temperature,
    this.thinking,
    this.toolChoice,
    this.tools,
    this.topK,
    this.topP
  });

  factory AnthropicCountMessageTokensRequest.fromJson(Map<String, dynamic> json) {
    return AnthropicCountMessageTokensRequest(
      maxTokens: json['max_tokens'] is int ? json['max_tokens'] : null,
      messages: (() {
        final list = _sdkworkAsList(json['messages']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AnthropicMessageParam.fromJson(map);
      })())
            .whereType<AnthropicMessageParam>()
            .toList();
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
      stopSequences: (() {
        final list = _sdkworkAsList(json['stop_sequences']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      stream: json['stream'] is bool ? json['stream'] : null,
      system: json['system']?.toString(),
      temperature: json['temperature'] is num ? json['temperature'].toDouble() : null,
      thinking: (() {
        final map = _sdkworkAsMap(json['thinking']);
        return map == null ? null : AnthropicThinkingConfig.fromJson(map);
      })(),
      toolChoice: (() {
        final map = _sdkworkAsMap(json['tool_choice']);
        return map == null ? null : AnthropicToolChoice.fromJson(map);
      })(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AnthropicTool.fromJson(map);
      })())
            .whereType<AnthropicTool>()
            .toList();
      })(),
      topK: json['top_k'] is int ? json['top_k'] : null,
      topP: json['top_p'] is num ? json['top_p'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'max_tokens': maxTokens,
      'messages': messages?.map((item) => item.toJson()).toList(),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'stop_sequences': stopSequences?.map((item) => item).toList(),
      'stream': stream,
      'system': system,
      'temperature': temperature,
      'thinking': thinking?.toJson(),
      'tool_choice': toolChoice?.toJson(),
      'tools': tools?.map((item) => item.toJson()).toList(),
      'top_k': topK,
      'top_p': topP,
    };
  }
}

class AnthropicCountMessageTokensResponse {
  final int? inputTokens;

  AnthropicCountMessageTokensResponse({
    this.inputTokens
  });

  factory AnthropicCountMessageTokensResponse.fromJson(Map<String, dynamic> json) {
    return AnthropicCountMessageTokensResponse(
      inputTokens: json['input_tokens'] is int ? json['input_tokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'input_tokens': inputTokens,
    };
  }
}

class AnthropicDeleteResponse {
  final bool? deleted;
  final String? id;
  final String? type;

  AnthropicDeleteResponse({
    this.deleted,
    this.id,
    this.type
  });

  factory AnthropicDeleteResponse.fromJson(Map<String, dynamic> json) {
    return AnthropicDeleteResponse(
      deleted: json['deleted'] is bool ? json['deleted'] : null,
      id: json['id']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'deleted': deleted,
      'id': id,
      'type': type,
    };
  }
}

class AnthropicFile {
  final String? createdAt;
  final bool? downloadable;
  final String? filename;
  final String? id;
  final String? mimeType;
  final int? sizeBytes;
  final String? type;

  AnthropicFile({
    this.createdAt,
    this.downloadable,
    this.filename,
    this.id,
    this.mimeType,
    this.sizeBytes,
    this.type
  });

  factory AnthropicFile.fromJson(Map<String, dynamic> json) {
    return AnthropicFile(
      createdAt: json['created_at']?.toString(),
      downloadable: json['downloadable'] is bool ? json['downloadable'] : null,
      filename: json['filename']?.toString(),
      id: json['id']?.toString(),
      mimeType: json['mime_type']?.toString(),
      sizeBytes: json['size_bytes'] is int ? json['size_bytes'] : null,
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'downloadable': downloadable,
      'filename': filename,
      'id': id,
      'mime_type': mimeType,
      'size_bytes': sizeBytes,
      'type': type,
    };
  }
}

class AnthropicFileListResponse {
  final List<AnthropicFile>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;

  AnthropicFileListResponse({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId
  });

  factory AnthropicFileListResponse.fromJson(Map<String, dynamic> json) {
    return AnthropicFileListResponse(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AnthropicFile.fromJson(map);
      })())
            .whereType<AnthropicFile>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
    };
  }
}

class AnthropicFileUploadMultipartRequest {
  final String? file;

  AnthropicFileUploadMultipartRequest({
    this.file
  });

  factory AnthropicFileUploadMultipartRequest.fromJson(Map<String, dynamic> json) {
    return AnthropicFileUploadMultipartRequest(
      file: json['file']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
    };
  }
}

class AnthropicMessage {
  final List<AnthropicContentBlock>? content;
  final String? id;
  final String? model;
  final String? role;
  final String? stopReason;
  final String? stopSequence;
  final String? type;
  final AnthropicUsage? usage;

  AnthropicMessage({
    this.content,
    this.id,
    this.model,
    this.role,
    this.stopReason,
    this.stopSequence,
    this.type,
    this.usage
  });

  factory AnthropicMessage.fromJson(Map<String, dynamic> json) {
    return AnthropicMessage(
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AnthropicContentBlock.fromJson(map);
      })())
            .whereType<AnthropicContentBlock>()
            .toList();
      })(),
      id: json['id']?.toString(),
      model: json['model']?.toString(),
      role: json['role']?.toString(),
      stopReason: json['stop_reason']?.toString(),
      stopSequence: json['stop_sequence']?.toString(),
      type: json['type']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : AnthropicUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content?.map((item) => item.toJson()).toList(),
      'id': id,
      'model': model,
      'role': role,
      'stop_reason': stopReason,
      'stop_sequence': stopSequence,
      'type': type,
      'usage': usage?.toJson(),
    };
  }
}

class AnthropicMessageBatch {
  final String? cancelInitiatedAt;
  final String? createdAt;
  final String? endedAt;
  final String? expiresAt;
  final String? id;
  final String? processingStatus;
  final AnthropicMessageBatchRequestCounts? requestCounts;
  final String? resultsUrl;
  final String? type;

  AnthropicMessageBatch({
    this.cancelInitiatedAt,
    this.createdAt,
    this.endedAt,
    this.expiresAt,
    this.id,
    this.processingStatus,
    this.requestCounts,
    this.resultsUrl,
    this.type
  });

  factory AnthropicMessageBatch.fromJson(Map<String, dynamic> json) {
    return AnthropicMessageBatch(
      cancelInitiatedAt: json['cancel_initiated_at']?.toString(),
      createdAt: json['created_at']?.toString(),
      endedAt: json['ended_at']?.toString(),
      expiresAt: json['expires_at']?.toString(),
      id: json['id']?.toString(),
      processingStatus: json['processing_status']?.toString(),
      requestCounts: (() {
        final map = _sdkworkAsMap(json['request_counts']);
        return map == null ? null : AnthropicMessageBatchRequestCounts.fromJson(map);
      })(),
      resultsUrl: json['results_url']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cancel_initiated_at': cancelInitiatedAt,
      'created_at': createdAt,
      'ended_at': endedAt,
      'expires_at': expiresAt,
      'id': id,
      'processing_status': processingStatus,
      'request_counts': requestCounts?.toJson(),
      'results_url': resultsUrl,
      'type': type,
    };
  }
}

class AnthropicMessageBatchCreateRequest {
  final List<AnthropicMessageBatchRequest>? requests;

  AnthropicMessageBatchCreateRequest({
    this.requests
  });

  factory AnthropicMessageBatchCreateRequest.fromJson(Map<String, dynamic> json) {
    return AnthropicMessageBatchCreateRequest(
      requests: (() {
        final list = _sdkworkAsList(json['requests']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AnthropicMessageBatchRequest.fromJson(map);
      })())
            .whereType<AnthropicMessageBatchRequest>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'requests': requests?.map((item) => item.toJson()).toList(),
    };
  }
}

class AnthropicMessageBatchListResponse {
  final List<AnthropicMessageBatch>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;

  AnthropicMessageBatchListResponse({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId
  });

  factory AnthropicMessageBatchListResponse.fromJson(Map<String, dynamic> json) {
    return AnthropicMessageBatchListResponse(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AnthropicMessageBatch.fromJson(map);
      })())
            .whereType<AnthropicMessageBatch>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
    };
  }
}

class AnthropicMessageBatchRequest {
  final String? customId;
  final AnthropicMessageCreateRequest? params;

  AnthropicMessageBatchRequest({
    this.customId,
    this.params
  });

  factory AnthropicMessageBatchRequest.fromJson(Map<String, dynamic> json) {
    return AnthropicMessageBatchRequest(
      customId: json['custom_id']?.toString(),
      params: (() {
        final map = _sdkworkAsMap(json['params']);
        return map == null ? null : AnthropicMessageCreateRequest.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'custom_id': customId,
      'params': params?.toJson(),
    };
  }
}

class AnthropicMessageBatchRequestCounts {
  final int? canceled;
  final int? errored;
  final int? expired;
  final int? processing;
  final int? succeeded;

  AnthropicMessageBatchRequestCounts({
    this.canceled,
    this.errored,
    this.expired,
    this.processing,
    this.succeeded
  });

  factory AnthropicMessageBatchRequestCounts.fromJson(Map<String, dynamic> json) {
    return AnthropicMessageBatchRequestCounts(
      canceled: json['canceled'] is int ? json['canceled'] : null,
      errored: json['errored'] is int ? json['errored'] : null,
      expired: json['expired'] is int ? json['expired'] : null,
      processing: json['processing'] is int ? json['processing'] : null,
      succeeded: json['succeeded'] is int ? json['succeeded'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'canceled': canceled,
      'errored': errored,
      'expired': expired,
      'processing': processing,
      'succeeded': succeeded,
    };
  }
}

class AnthropicMessageCreateRequest {
  final int? maxTokens;
  final List<AnthropicMessageParam>? messages;
  final Map<String, dynamic>? metadata;
  final String? model;
  final List<String>? stopSequences;
  final bool? stream;
  final dynamic system;
  final double? temperature;
  final AnthropicThinkingConfig? thinking;
  final AnthropicToolChoice? toolChoice;
  final List<AnthropicTool>? tools;
  final int? topK;
  final double? topP;

  AnthropicMessageCreateRequest({
    this.maxTokens,
    this.messages,
    this.metadata,
    this.model,
    this.stopSequences,
    this.stream,
    this.system,
    this.temperature,
    this.thinking,
    this.toolChoice,
    this.tools,
    this.topK,
    this.topP
  });

  factory AnthropicMessageCreateRequest.fromJson(Map<String, dynamic> json) {
    return AnthropicMessageCreateRequest(
      maxTokens: json['max_tokens'] is int ? json['max_tokens'] : null,
      messages: (() {
        final list = _sdkworkAsList(json['messages']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AnthropicMessageParam.fromJson(map);
      })())
            .whereType<AnthropicMessageParam>()
            .toList();
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
      stopSequences: (() {
        final list = _sdkworkAsList(json['stop_sequences']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      stream: json['stream'] is bool ? json['stream'] : null,
      system: json['system']?.toString(),
      temperature: json['temperature'] is num ? json['temperature'].toDouble() : null,
      thinking: (() {
        final map = _sdkworkAsMap(json['thinking']);
        return map == null ? null : AnthropicThinkingConfig.fromJson(map);
      })(),
      toolChoice: (() {
        final map = _sdkworkAsMap(json['tool_choice']);
        return map == null ? null : AnthropicToolChoice.fromJson(map);
      })(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AnthropicTool.fromJson(map);
      })())
            .whereType<AnthropicTool>()
            .toList();
      })(),
      topK: json['top_k'] is int ? json['top_k'] : null,
      topP: json['top_p'] is num ? json['top_p'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'max_tokens': maxTokens,
      'messages': messages?.map((item) => item.toJson()).toList(),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'stop_sequences': stopSequences?.map((item) => item).toList(),
      'stream': stream,
      'system': system,
      'temperature': temperature,
      'thinking': thinking?.toJson(),
      'tool_choice': toolChoice?.toJson(),
      'tools': tools?.map((item) => item.toJson()).toList(),
      'top_k': topK,
      'top_p': topP,
    };
  }
}

class AnthropicMessageParam {
  final dynamic content;
  final String? role;

  AnthropicMessageParam({
    this.content,
    this.role
  });

  factory AnthropicMessageParam.fromJson(Map<String, dynamic> json) {
    return AnthropicMessageParam(
      content: json['content']?.toString(),
      role: json['role']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'role': role,
    };
  }
}

class AnthropicThinkingConfig {
  final int? budgetTokens;
  final String? type;

  AnthropicThinkingConfig({
    this.budgetTokens,
    this.type
  });

  factory AnthropicThinkingConfig.fromJson(Map<String, dynamic> json) {
    return AnthropicThinkingConfig(
      budgetTokens: json['budget_tokens'] is int ? json['budget_tokens'] : null,
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'budget_tokens': budgetTokens,
      'type': type,
    };
  }
}

class AnthropicTool {
  final String? description;
  final ProviderJsonSchema? inputSchema;
  final String? name;

  AnthropicTool({
    this.description,
    this.inputSchema,
    this.name
  });

  factory AnthropicTool.fromJson(Map<String, dynamic> json) {
    return AnthropicTool(
      description: json['description']?.toString(),
      inputSchema: (() {
        final map = _sdkworkAsMap(json['input_schema']);
        return map == null ? null : ProviderJsonSchema.fromJson(map);
      })(),
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'input_schema': inputSchema?.toJson(),
      'name': name,
    };
  }
}

class AnthropicToolChoice {
  final String? name;
  final String? type;

  AnthropicToolChoice({
    this.name,
    this.type
  });

  factory AnthropicToolChoice.fromJson(Map<String, dynamic> json) {
    return AnthropicToolChoice(
      name: json['name']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'name': name,
      'type': type,
    };
  }
}

class AnthropicUsage {
  final int? cacheCreationInputTokens;
  final int? cacheReadInputTokens;
  final int? inputTokens;
  final int? outputTokens;

  AnthropicUsage({
    this.cacheCreationInputTokens,
    this.cacheReadInputTokens,
    this.inputTokens,
    this.outputTokens
  });

  factory AnthropicUsage.fromJson(Map<String, dynamic> json) {
    return AnthropicUsage(
      cacheCreationInputTokens: json['cache_creation_input_tokens'] is int ? json['cache_creation_input_tokens'] : null,
      cacheReadInputTokens: json['cache_read_input_tokens'] is int ? json['cache_read_input_tokens'] : null,
      inputTokens: json['input_tokens'] is int ? json['input_tokens'] : null,
      outputTokens: json['output_tokens'] is int ? json['output_tokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cache_creation_input_tokens': cacheCreationInputTokens,
      'cache_read_input_tokens': cacheReadInputTokens,
      'input_tokens': inputTokens,
      'output_tokens': outputTokens,
    };
  }
}

class CreateCompletionChoice {
  final String? finishReason;
  final int? index;
  final CreateCompletionLogprobs? logprobs;
  final String? text;

  CreateCompletionChoice({
    this.finishReason,
    this.index,
    this.logprobs,
    this.text
  });

  factory CreateCompletionChoice.fromJson(Map<String, dynamic> json) {
    return CreateCompletionChoice(
      finishReason: json['finish_reason']?.toString(),
      index: json['index'] is int ? json['index'] : null,
      logprobs: (() {
        final map = _sdkworkAsMap(json['logprobs']);
        return map == null ? null : CreateCompletionLogprobs.fromJson(map);
      })(),
      text: json['text']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'finish_reason': finishReason,
      'index': index,
      'logprobs': logprobs?.toJson(),
      'text': text,
    };
  }
}

class CreateCompletionLogprobs {
  final List<int>? textOffset;
  final List<double>? tokenLogprobs;
  final List<String>? tokens;
  final List<Map<String, dynamic>>? topLogprobs;

  CreateCompletionLogprobs({
    this.textOffset,
    this.tokenLogprobs,
    this.tokens,
    this.topLogprobs
  });

  factory CreateCompletionLogprobs.fromJson(Map<String, dynamic> json) {
    return CreateCompletionLogprobs(
      textOffset: (() {
        final list = _sdkworkAsList(json['text_offset']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item is int ? item : null)
            .whereType<int>()
            .toList();
      })(),
      tokenLogprobs: (() {
        final list = _sdkworkAsList(json['token_logprobs']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item is num ? item.toDouble() : null)
            .whereType<double>()
            .toList();
      })(),
      tokens: (() {
        final list = _sdkworkAsList(json['tokens']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      topLogprobs: (() {
        final list = _sdkworkAsList(json['top_logprobs']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        if (map == null) {
          return null;
        }
        final result = <String, dynamic>{};
        map.forEach((key, nestedItem) {
          final deserialized = nestedItem;
          result[key] = deserialized;
        });
        return result;
      })())
            .whereType<Map<String, dynamic>>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'text_offset': textOffset?.map((item) => item).toList(),
      'token_logprobs': tokenLogprobs?.map((item) => item).toList(),
      'tokens': tokens?.map((item) => item).toList(),
      'top_logprobs': topLogprobs?.map((item) => item.map((key, nestedItem) => MapEntry(key, nestedItem))).toList(),
    };
  }
}

class DeleteResult {
  final bool? deleted;
  final String? id;
  final String? object;

  DeleteResult({
    this.deleted,
    this.id,
    this.object
  });

  factory DeleteResult.fromJson(Map<String, dynamic> json) {
    return DeleteResult(
      deleted: json['deleted'] is bool ? json['deleted'] : null,
      id: json['id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'deleted': deleted,
      'id': id,
      'object': object,
    };
  }
}

class GetOrganizationAudioSpeechesUsageItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  GetOrganizationAudioSpeechesUsageItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory GetOrganizationAudioSpeechesUsageItem.fromJson(Map<String, dynamic> json) {
    return GetOrganizationAudioSpeechesUsageItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class GetOrganizationAudioTranscriptionsUsageItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  GetOrganizationAudioTranscriptionsUsageItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory GetOrganizationAudioTranscriptionsUsageItem.fromJson(Map<String, dynamic> json) {
    return GetOrganizationAudioTranscriptionsUsageItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class GetOrganizationCodeInterpreterSessionsUsageItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  GetOrganizationCodeInterpreterSessionsUsageItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory GetOrganizationCodeInterpreterSessionsUsageItem.fromJson(Map<String, dynamic> json) {
    return GetOrganizationCodeInterpreterSessionsUsageItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class GetOrganizationCompletionsUsageItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  GetOrganizationCompletionsUsageItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory GetOrganizationCompletionsUsageItem.fromJson(Map<String, dynamic> json) {
    return GetOrganizationCompletionsUsageItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class GetOrganizationCostsItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  GetOrganizationCostsItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory GetOrganizationCostsItem.fromJson(Map<String, dynamic> json) {
    return GetOrganizationCostsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class GetOrganizationEmbeddingsUsageItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  GetOrganizationEmbeddingsUsageItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory GetOrganizationEmbeddingsUsageItem.fromJson(Map<String, dynamic> json) {
    return GetOrganizationEmbeddingsUsageItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class GetOrganizationImagesUsageItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  GetOrganizationImagesUsageItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory GetOrganizationImagesUsageItem.fromJson(Map<String, dynamic> json) {
    return GetOrganizationImagesUsageItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class GetOrganizationModerationsUsageItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  GetOrganizationModerationsUsageItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory GetOrganizationModerationsUsageItem.fromJson(Map<String, dynamic> json) {
    return GetOrganizationModerationsUsageItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class GetOrganizationVectorStoresUsageItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  GetOrganizationVectorStoresUsageItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory GetOrganizationVectorStoresUsageItem.fromJson(Map<String, dynamic> json) {
    return GetOrganizationVectorStoresUsageItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class GoogleBatchEmbedContentsRequest {
  final List<GoogleEmbedContentRequest>? requests;

  GoogleBatchEmbedContentsRequest({
    this.requests
  });

  factory GoogleBatchEmbedContentsRequest.fromJson(Map<String, dynamic> json) {
    return GoogleBatchEmbedContentsRequest(
      requests: (() {
        final list = _sdkworkAsList(json['requests']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleEmbedContentRequest.fromJson(map);
      })())
            .whereType<GoogleEmbedContentRequest>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'requests': requests?.map((item) => item.toJson()).toList(),
    };
  }
}

class GoogleBatchEmbedContentsResponse {
  final List<GoogleContentEmbedding>? embeddings;

  GoogleBatchEmbedContentsResponse({
    this.embeddings
  });

  factory GoogleBatchEmbedContentsResponse.fromJson(Map<String, dynamic> json) {
    return GoogleBatchEmbedContentsResponse(
      embeddings: (() {
        final list = _sdkworkAsList(json['embeddings']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleContentEmbedding.fromJson(map);
      })())
            .whereType<GoogleContentEmbedding>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'embeddings': embeddings?.map((item) => item.toJson()).toList(),
    };
  }
}

class GoogleBlob {
  final String? data;
  final String? mimeType;

  GoogleBlob({
    this.data,
    this.mimeType
  });

  factory GoogleBlob.fromJson(Map<String, dynamic> json) {
    return GoogleBlob(
      data: json['data']?.toString(),
      mimeType: json['mimeType']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data,
      'mimeType': mimeType,
    };
  }
}

class GoogleCachedContent {
  final List<GoogleContent>? contents;
  final String? createTime;
  final String? displayName;
  final String? expireTime;
  final String? model;
  final String? name;
  final GoogleContent? systemInstruction;
  final GoogleToolConfig? toolConfig;
  final List<GoogleTool>? tools;
  final String? updateTime;
  final GoogleCachedContentUsageMetadata? usageMetadata;

  GoogleCachedContent({
    this.contents,
    this.createTime,
    this.displayName,
    this.expireTime,
    this.model,
    this.name,
    this.systemInstruction,
    this.toolConfig,
    this.tools,
    this.updateTime,
    this.usageMetadata
  });

  factory GoogleCachedContent.fromJson(Map<String, dynamic> json) {
    return GoogleCachedContent(
      contents: (() {
        final list = _sdkworkAsList(json['contents']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleContent.fromJson(map);
      })())
            .whereType<GoogleContent>()
            .toList();
      })(),
      createTime: json['createTime']?.toString(),
      displayName: json['displayName']?.toString(),
      expireTime: json['expireTime']?.toString(),
      model: json['model']?.toString(),
      name: json['name']?.toString(),
      systemInstruction: (() {
        final map = _sdkworkAsMap(json['systemInstruction']);
        return map == null ? null : GoogleContent.fromJson(map);
      })(),
      toolConfig: (() {
        final map = _sdkworkAsMap(json['toolConfig']);
        return map == null ? null : GoogleToolConfig.fromJson(map);
      })(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleTool.fromJson(map);
      })())
            .whereType<GoogleTool>()
            .toList();
      })(),
      updateTime: json['updateTime']?.toString(),
      usageMetadata: (() {
        final map = _sdkworkAsMap(json['usageMetadata']);
        return map == null ? null : GoogleCachedContentUsageMetadata.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'contents': contents?.map((item) => item.toJson()).toList(),
      'createTime': createTime,
      'displayName': displayName,
      'expireTime': expireTime,
      'model': model,
      'name': name,
      'systemInstruction': systemInstruction?.toJson(),
      'toolConfig': toolConfig?.toJson(),
      'tools': tools?.map((item) => item.toJson()).toList(),
      'updateTime': updateTime,
      'usageMetadata': usageMetadata?.toJson(),
    };
  }
}

class GoogleCachedContentCreateRequest {
  final List<GoogleContent>? contents;
  final String? displayName;
  final String? expireTime;
  final String? model;
  final GoogleContent? systemInstruction;
  final GoogleToolConfig? toolConfig;
  final List<GoogleTool>? tools;
  final String? ttl;

  GoogleCachedContentCreateRequest({
    this.contents,
    this.displayName,
    this.expireTime,
    this.model,
    this.systemInstruction,
    this.toolConfig,
    this.tools,
    this.ttl
  });

  factory GoogleCachedContentCreateRequest.fromJson(Map<String, dynamic> json) {
    return GoogleCachedContentCreateRequest(
      contents: (() {
        final list = _sdkworkAsList(json['contents']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleContent.fromJson(map);
      })())
            .whereType<GoogleContent>()
            .toList();
      })(),
      displayName: json['displayName']?.toString(),
      expireTime: json['expireTime']?.toString(),
      model: json['model']?.toString(),
      systemInstruction: (() {
        final map = _sdkworkAsMap(json['systemInstruction']);
        return map == null ? null : GoogleContent.fromJson(map);
      })(),
      toolConfig: (() {
        final map = _sdkworkAsMap(json['toolConfig']);
        return map == null ? null : GoogleToolConfig.fromJson(map);
      })(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleTool.fromJson(map);
      })())
            .whereType<GoogleTool>()
            .toList();
      })(),
      ttl: json['ttl']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'contents': contents?.map((item) => item.toJson()).toList(),
      'displayName': displayName,
      'expireTime': expireTime,
      'model': model,
      'systemInstruction': systemInstruction?.toJson(),
      'toolConfig': toolConfig?.toJson(),
      'tools': tools?.map((item) => item.toJson()).toList(),
      'ttl': ttl,
    };
  }
}

class GoogleCachedContentListResponse {
  final List<GoogleCachedContent>? cachedContents;
  final String? nextPageToken;

  GoogleCachedContentListResponse({
    this.cachedContents,
    this.nextPageToken
  });

  factory GoogleCachedContentListResponse.fromJson(Map<String, dynamic> json) {
    return GoogleCachedContentListResponse(
      cachedContents: (() {
        final list = _sdkworkAsList(json['cachedContents']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleCachedContent.fromJson(map);
      })())
            .whereType<GoogleCachedContent>()
            .toList();
      })(),
      nextPageToken: json['nextPageToken']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cachedContents': cachedContents?.map((item) => item.toJson()).toList(),
      'nextPageToken': nextPageToken,
    };
  }
}

class GoogleCachedContentUsageMetadata {
  final int? totalTokenCount;

  GoogleCachedContentUsageMetadata({
    this.totalTokenCount
  });

  factory GoogleCachedContentUsageMetadata.fromJson(Map<String, dynamic> json) {
    return GoogleCachedContentUsageMetadata(
      totalTokenCount: json['totalTokenCount'] is int ? json['totalTokenCount'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'totalTokenCount': totalTokenCount,
    };
  }
}

class GoogleCandidate {
  final GoogleCitationMetadata? citationMetadata;
  final GoogleContent? content;
  final String? finishReason;
  final int? index;
  final List<GoogleSafetyRating>? safetyRatings;
  final int? tokenCount;

  GoogleCandidate({
    this.citationMetadata,
    this.content,
    this.finishReason,
    this.index,
    this.safetyRatings,
    this.tokenCount
  });

  factory GoogleCandidate.fromJson(Map<String, dynamic> json) {
    return GoogleCandidate(
      citationMetadata: (() {
        final map = _sdkworkAsMap(json['citationMetadata']);
        return map == null ? null : GoogleCitationMetadata.fromJson(map);
      })(),
      content: (() {
        final map = _sdkworkAsMap(json['content']);
        return map == null ? null : GoogleContent.fromJson(map);
      })(),
      finishReason: json['finishReason']?.toString(),
      index: json['index'] is int ? json['index'] : null,
      safetyRatings: (() {
        final list = _sdkworkAsList(json['safetyRatings']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleSafetyRating.fromJson(map);
      })())
            .whereType<GoogleSafetyRating>()
            .toList();
      })(),
      tokenCount: json['tokenCount'] is int ? json['tokenCount'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'citationMetadata': citationMetadata?.toJson(),
      'content': content?.toJson(),
      'finishReason': finishReason,
      'index': index,
      'safetyRatings': safetyRatings?.map((item) => item.toJson()).toList(),
      'tokenCount': tokenCount,
    };
  }
}

class GoogleCitationMetadata {
  final List<GoogleCitationSource>? citationSources;

  GoogleCitationMetadata({
    this.citationSources
  });

  factory GoogleCitationMetadata.fromJson(Map<String, dynamic> json) {
    return GoogleCitationMetadata(
      citationSources: (() {
        final list = _sdkworkAsList(json['citationSources']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleCitationSource.fromJson(map);
      })())
            .whereType<GoogleCitationSource>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'citationSources': citationSources?.map((item) => item.toJson()).toList(),
    };
  }
}

class GoogleCitationSource {
  final int? endIndex;
  final String? license;
  final int? startIndex;
  final String? uri;

  GoogleCitationSource({
    this.endIndex,
    this.license,
    this.startIndex,
    this.uri
  });

  factory GoogleCitationSource.fromJson(Map<String, dynamic> json) {
    return GoogleCitationSource(
      endIndex: json['endIndex'] is int ? json['endIndex'] : null,
      license: json['license']?.toString(),
      startIndex: json['startIndex'] is int ? json['startIndex'] : null,
      uri: json['uri']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'endIndex': endIndex,
      'license': license,
      'startIndex': startIndex,
      'uri': uri,
    };
  }
}

class GoogleCodeExecutionResult {
  final String? outcome;
  final String? output;

  GoogleCodeExecutionResult({
    this.outcome,
    this.output
  });

  factory GoogleCodeExecutionResult.fromJson(Map<String, dynamic> json) {
    return GoogleCodeExecutionResult(
      outcome: json['outcome']?.toString(),
      output: json['output']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'outcome': outcome,
      'output': output,
    };
  }
}

class GoogleCodeExecutionTool {
  final bool? enabled;

  GoogleCodeExecutionTool({
    this.enabled
  });

  factory GoogleCodeExecutionTool.fromJson(Map<String, dynamic> json) {
    return GoogleCodeExecutionTool(
      enabled: json['enabled'] is bool ? json['enabled'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'enabled': enabled,
    };
  }
}

class GoogleContent {
  final List<GooglePart>? parts;
  final String? role;

  GoogleContent({
    this.parts,
    this.role
  });

  factory GoogleContent.fromJson(Map<String, dynamic> json) {
    return GoogleContent(
      parts: (() {
        final list = _sdkworkAsList(json['parts']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GooglePart.fromJson(map);
      })())
            .whereType<GooglePart>()
            .toList();
      })(),
      role: json['role']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'parts': parts?.map((item) => item.toJson()).toList(),
      'role': role,
    };
  }
}

class GoogleContentEmbedding {
  final List<double>? values;

  GoogleContentEmbedding({
    this.values
  });

  factory GoogleContentEmbedding.fromJson(Map<String, dynamic> json) {
    return GoogleContentEmbedding(
      values: (() {
        final list = _sdkworkAsList(json['values']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item is num ? item.toDouble() : null)
            .whereType<double>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'values': values?.map((item) => item).toList(),
    };
  }
}

class GoogleCountTokensRequest {
  final List<GoogleContent>? contents;
  final GoogleGenerateContentRequest? generateContentRequest;

  GoogleCountTokensRequest({
    this.contents,
    this.generateContentRequest
  });

  factory GoogleCountTokensRequest.fromJson(Map<String, dynamic> json) {
    return GoogleCountTokensRequest(
      contents: (() {
        final list = _sdkworkAsList(json['contents']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleContent.fromJson(map);
      })())
            .whereType<GoogleContent>()
            .toList();
      })(),
      generateContentRequest: (() {
        final map = _sdkworkAsMap(json['generateContentRequest']);
        return map == null ? null : GoogleGenerateContentRequest.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'contents': contents?.map((item) => item.toJson()).toList(),
      'generateContentRequest': generateContentRequest?.toJson(),
    };
  }
}

class GoogleCountTokensResponse {
  final int? cachedContentTokenCount;
  final int? totalTokens;

  GoogleCountTokensResponse({
    this.cachedContentTokenCount,
    this.totalTokens
  });

  factory GoogleCountTokensResponse.fromJson(Map<String, dynamic> json) {
    return GoogleCountTokensResponse(
      cachedContentTokenCount: json['cachedContentTokenCount'] is int ? json['cachedContentTokenCount'] : null,
      totalTokens: json['totalTokens'] is int ? json['totalTokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cachedContentTokenCount': cachedContentTokenCount,
      'totalTokens': totalTokens,
    };
  }
}

class GoogleDynamicRetrievalConfig {
  final double? dynamicThreshold;
  final String? mode;

  GoogleDynamicRetrievalConfig({
    this.dynamicThreshold,
    this.mode
  });

  factory GoogleDynamicRetrievalConfig.fromJson(Map<String, dynamic> json) {
    return GoogleDynamicRetrievalConfig(
      dynamicThreshold: json['dynamicThreshold'] is num ? json['dynamicThreshold'].toDouble() : null,
      mode: json['mode']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'dynamicThreshold': dynamicThreshold,
      'mode': mode,
    };
  }
}

class GoogleEmbedContentRequest {
  final GoogleContent? content;
  final int? outputDimensionality;
  final String? taskType;
  final String? title;

  GoogleEmbedContentRequest({
    this.content,
    this.outputDimensionality,
    this.taskType,
    this.title
  });

  factory GoogleEmbedContentRequest.fromJson(Map<String, dynamic> json) {
    return GoogleEmbedContentRequest(
      content: (() {
        final map = _sdkworkAsMap(json['content']);
        return map == null ? null : GoogleContent.fromJson(map);
      })(),
      outputDimensionality: json['outputDimensionality'] is int ? json['outputDimensionality'] : null,
      taskType: json['taskType']?.toString(),
      title: json['title']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content?.toJson(),
      'outputDimensionality': outputDimensionality,
      'taskType': taskType,
      'title': title,
    };
  }
}

class GoogleEmbedContentResponse {
  final GoogleContentEmbedding? embedding;

  GoogleEmbedContentResponse({
    this.embedding
  });

  factory GoogleEmbedContentResponse.fromJson(Map<String, dynamic> json) {
    return GoogleEmbedContentResponse(
      embedding: (() {
        final map = _sdkworkAsMap(json['embedding']);
        return map == null ? null : GoogleContentEmbedding.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'embedding': embedding?.toJson(),
    };
  }
}

class GoogleEmptyResponse {
  final String? object;

  GoogleEmptyResponse({
    this.object
  });

  factory GoogleEmptyResponse.fromJson(Map<String, dynamic> json) {
    return GoogleEmptyResponse(
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'object': object,
    };
  }
}

class GoogleExecutableCode {
  final String? code;
  final String? language;

  GoogleExecutableCode({
    this.code,
    this.language
  });

  factory GoogleExecutableCode.fromJson(Map<String, dynamic> json) {
    return GoogleExecutableCode(
      code: json['code']?.toString(),
      language: json['language']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'language': language,
    };
  }
}

class GoogleFile {
  final String? createTime;
  final String? displayName;
  final ProviderTaskError? error;
  final String? expirationTime;
  final String? mimeType;
  final String? name;
  final String? sha256Hash;
  final String? sizeBytes;
  final String? state;
  final String? updateTime;
  final String? uri;

  GoogleFile({
    this.createTime,
    this.displayName,
    this.error,
    this.expirationTime,
    this.mimeType,
    this.name,
    this.sha256Hash,
    this.sizeBytes,
    this.state,
    this.updateTime,
    this.uri
  });

  factory GoogleFile.fromJson(Map<String, dynamic> json) {
    return GoogleFile(
      createTime: json['createTime']?.toString(),
      displayName: json['displayName']?.toString(),
      error: (() {
        final map = _sdkworkAsMap(json['error']);
        return map == null ? null : ProviderTaskError.fromJson(map);
      })(),
      expirationTime: json['expirationTime']?.toString(),
      mimeType: json['mimeType']?.toString(),
      name: json['name']?.toString(),
      sha256Hash: json['sha256Hash']?.toString(),
      sizeBytes: json['sizeBytes']?.toString(),
      state: json['state']?.toString(),
      updateTime: json['updateTime']?.toString(),
      uri: json['uri']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'createTime': createTime,
      'displayName': displayName,
      'error': error?.toJson(),
      'expirationTime': expirationTime,
      'mimeType': mimeType,
      'name': name,
      'sha256Hash': sha256Hash,
      'sizeBytes': sizeBytes,
      'state': state,
      'updateTime': updateTime,
      'uri': uri,
    };
  }
}

class GoogleFileData {
  final String? fileUri;
  final String? mimeType;

  GoogleFileData({
    this.fileUri,
    this.mimeType
  });

  factory GoogleFileData.fromJson(Map<String, dynamic> json) {
    return GoogleFileData(
      fileUri: json['fileUri']?.toString(),
      mimeType: json['mimeType']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'fileUri': fileUri,
      'mimeType': mimeType,
    };
  }
}

class GoogleFileListResponse {
  final List<GoogleFile>? files;
  final String? nextPageToken;

  GoogleFileListResponse({
    this.files,
    this.nextPageToken
  });

  factory GoogleFileListResponse.fromJson(Map<String, dynamic> json) {
    return GoogleFileListResponse(
      files: (() {
        final list = _sdkworkAsList(json['files']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleFile.fromJson(map);
      })())
            .whereType<GoogleFile>()
            .toList();
      })(),
      nextPageToken: json['nextPageToken']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'files': files?.map((item) => item.toJson()).toList(),
      'nextPageToken': nextPageToken,
    };
  }
}

class GoogleFileUploadMultipartRequest {
  final String? file;
  final String? metadata;

  GoogleFileUploadMultipartRequest({
    this.file,
    this.metadata
  });

  factory GoogleFileUploadMultipartRequest.fromJson(Map<String, dynamic> json) {
    return GoogleFileUploadMultipartRequest(
      file: json['file']?.toString(),
      metadata: json['metadata']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
      'metadata': metadata,
    };
  }
}

class GoogleFunctionCall {
  final Map<String, dynamic>? args;
  final String? name;

  GoogleFunctionCall({
    this.args,
    this.name
  });

  factory GoogleFunctionCall.fromJson(Map<String, dynamic> json) {
    return GoogleFunctionCall(
      args: (() {
        final map = _sdkworkAsMap(json['args']);
        if (map == null) {
          return null;
        }
        final result = <String, dynamic>{};
        map.forEach((key, item) {
          final deserialized = item;
          result[key] = deserialized;
        });
        return result;
      })(),
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'args': args?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class GoogleFunctionCallingConfig {
  final List<String>? allowedFunctionNames;
  final String? mode;

  GoogleFunctionCallingConfig({
    this.allowedFunctionNames,
    this.mode
  });

  factory GoogleFunctionCallingConfig.fromJson(Map<String, dynamic> json) {
    return GoogleFunctionCallingConfig(
      allowedFunctionNames: (() {
        final list = _sdkworkAsList(json['allowedFunctionNames']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      mode: json['mode']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'allowedFunctionNames': allowedFunctionNames?.map((item) => item).toList(),
      'mode': mode,
    };
  }
}

class GoogleFunctionDeclaration {
  final String? description;
  final String? name;
  final GoogleSchema? parameters;
  final GoogleSchema? response;

  GoogleFunctionDeclaration({
    this.description,
    this.name,
    this.parameters,
    this.response
  });

  factory GoogleFunctionDeclaration.fromJson(Map<String, dynamic> json) {
    return GoogleFunctionDeclaration(
      description: json['description']?.toString(),
      name: json['name']?.toString(),
      parameters: (() {
        final map = _sdkworkAsMap(json['parameters']);
        return map == null ? null : GoogleSchema.fromJson(map);
      })(),
      response: (() {
        final map = _sdkworkAsMap(json['response']);
        return map == null ? null : GoogleSchema.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'name': name,
      'parameters': parameters?.toJson(),
      'response': response?.toJson(),
    };
  }
}

class GoogleFunctionResponse {
  final String? name;
  final Map<String, dynamic>? response;

  GoogleFunctionResponse({
    this.name,
    this.response
  });

  factory GoogleFunctionResponse.fromJson(Map<String, dynamic> json) {
    return GoogleFunctionResponse(
      name: json['name']?.toString(),
      response: (() {
        final map = _sdkworkAsMap(json['response']);
        if (map == null) {
          return null;
        }
        final result = <String, dynamic>{};
        map.forEach((key, item) {
          final deserialized = item;
          result[key] = deserialized;
        });
        return result;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'name': name,
      'response': response?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class GoogleGenerateContentRequest {
  final String? cachedContent;
  final List<GoogleContent>? contents;
  final GoogleGenerationConfig? generationConfig;
  final List<GoogleSafetySetting>? safetySettings;
  final GoogleContent? systemInstruction;
  final GoogleToolConfig? toolConfig;
  final List<GoogleTool>? tools;

  GoogleGenerateContentRequest({
    this.cachedContent,
    this.contents,
    this.generationConfig,
    this.safetySettings,
    this.systemInstruction,
    this.toolConfig,
    this.tools
  });

  factory GoogleGenerateContentRequest.fromJson(Map<String, dynamic> json) {
    return GoogleGenerateContentRequest(
      cachedContent: json['cachedContent']?.toString(),
      contents: (() {
        final list = _sdkworkAsList(json['contents']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleContent.fromJson(map);
      })())
            .whereType<GoogleContent>()
            .toList();
      })(),
      generationConfig: (() {
        final map = _sdkworkAsMap(json['generationConfig']);
        return map == null ? null : GoogleGenerationConfig.fromJson(map);
      })(),
      safetySettings: (() {
        final list = _sdkworkAsList(json['safetySettings']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleSafetySetting.fromJson(map);
      })())
            .whereType<GoogleSafetySetting>()
            .toList();
      })(),
      systemInstruction: (() {
        final map = _sdkworkAsMap(json['systemInstruction']);
        return map == null ? null : GoogleContent.fromJson(map);
      })(),
      toolConfig: (() {
        final map = _sdkworkAsMap(json['toolConfig']);
        return map == null ? null : GoogleToolConfig.fromJson(map);
      })(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleTool.fromJson(map);
      })())
            .whereType<GoogleTool>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cachedContent': cachedContent,
      'contents': contents?.map((item) => item.toJson()).toList(),
      'generationConfig': generationConfig?.toJson(),
      'safetySettings': safetySettings?.map((item) => item.toJson()).toList(),
      'systemInstruction': systemInstruction?.toJson(),
      'toolConfig': toolConfig?.toJson(),
      'tools': tools?.map((item) => item.toJson()).toList(),
    };
  }
}

class GoogleGenerateContentResponse {
  final List<GoogleCandidate>? candidates;
  final String? modelVersion;
  final GooglePromptFeedback? promptFeedback;
  final String? responseId;
  final GoogleUsageMetadata? usageMetadata;

  GoogleGenerateContentResponse({
    this.candidates,
    this.modelVersion,
    this.promptFeedback,
    this.responseId,
    this.usageMetadata
  });

  factory GoogleGenerateContentResponse.fromJson(Map<String, dynamic> json) {
    return GoogleGenerateContentResponse(
      candidates: (() {
        final list = _sdkworkAsList(json['candidates']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleCandidate.fromJson(map);
      })())
            .whereType<GoogleCandidate>()
            .toList();
      })(),
      modelVersion: json['modelVersion']?.toString(),
      promptFeedback: (() {
        final map = _sdkworkAsMap(json['promptFeedback']);
        return map == null ? null : GooglePromptFeedback.fromJson(map);
      })(),
      responseId: json['responseId']?.toString(),
      usageMetadata: (() {
        final map = _sdkworkAsMap(json['usageMetadata']);
        return map == null ? null : GoogleUsageMetadata.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'candidates': candidates?.map((item) => item.toJson()).toList(),
      'modelVersion': modelVersion,
      'promptFeedback': promptFeedback?.toJson(),
      'responseId': responseId,
      'usageMetadata': usageMetadata?.toJson(),
    };
  }
}

class GoogleGenerationConfig {
  final int? candidateCount;
  final int? maxOutputTokens;
  final String? responseMimeType;
  final GoogleSchema? responseSchema;
  final List<String>? stopSequences;
  final double? temperature;
  final GoogleThinkingConfig? thinkingConfig;
  final int? topK;
  final double? topP;

  GoogleGenerationConfig({
    this.candidateCount,
    this.maxOutputTokens,
    this.responseMimeType,
    this.responseSchema,
    this.stopSequences,
    this.temperature,
    this.thinkingConfig,
    this.topK,
    this.topP
  });

  factory GoogleGenerationConfig.fromJson(Map<String, dynamic> json) {
    return GoogleGenerationConfig(
      candidateCount: json['candidateCount'] is int ? json['candidateCount'] : null,
      maxOutputTokens: json['maxOutputTokens'] is int ? json['maxOutputTokens'] : null,
      responseMimeType: json['responseMimeType']?.toString(),
      responseSchema: (() {
        final map = _sdkworkAsMap(json['responseSchema']);
        return map == null ? null : GoogleSchema.fromJson(map);
      })(),
      stopSequences: (() {
        final list = _sdkworkAsList(json['stopSequences']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      temperature: json['temperature'] is num ? json['temperature'].toDouble() : null,
      thinkingConfig: (() {
        final map = _sdkworkAsMap(json['thinkingConfig']);
        return map == null ? null : GoogleThinkingConfig.fromJson(map);
      })(),
      topK: json['topK'] is int ? json['topK'] : null,
      topP: json['topP'] is num ? json['topP'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'candidateCount': candidateCount,
      'maxOutputTokens': maxOutputTokens,
      'responseMimeType': responseMimeType,
      'responseSchema': responseSchema?.toJson(),
      'stopSequences': stopSequences?.map((item) => item).toList(),
      'temperature': temperature,
      'thinkingConfig': thinkingConfig?.toJson(),
      'topK': topK,
      'topP': topP,
    };
  }
}

class GooglePart {
  final GoogleCodeExecutionResult? codeExecutionResult;
  final GoogleExecutableCode? executableCode;
  final GoogleFileData? fileData;
  final GoogleFunctionCall? functionCall;
  final GoogleFunctionResponse? functionResponse;
  final GoogleBlob? inlineData;
  final String? text;

  GooglePart({
    this.codeExecutionResult,
    this.executableCode,
    this.fileData,
    this.functionCall,
    this.functionResponse,
    this.inlineData,
    this.text
  });

  factory GooglePart.fromJson(Map<String, dynamic> json) {
    return GooglePart(
      codeExecutionResult: (() {
        final map = _sdkworkAsMap(json['codeExecutionResult']);
        return map == null ? null : GoogleCodeExecutionResult.fromJson(map);
      })(),
      executableCode: (() {
        final map = _sdkworkAsMap(json['executableCode']);
        return map == null ? null : GoogleExecutableCode.fromJson(map);
      })(),
      fileData: (() {
        final map = _sdkworkAsMap(json['fileData']);
        return map == null ? null : GoogleFileData.fromJson(map);
      })(),
      functionCall: (() {
        final map = _sdkworkAsMap(json['functionCall']);
        return map == null ? null : GoogleFunctionCall.fromJson(map);
      })(),
      functionResponse: (() {
        final map = _sdkworkAsMap(json['functionResponse']);
        return map == null ? null : GoogleFunctionResponse.fromJson(map);
      })(),
      inlineData: (() {
        final map = _sdkworkAsMap(json['inlineData']);
        return map == null ? null : GoogleBlob.fromJson(map);
      })(),
      text: json['text']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'codeExecutionResult': codeExecutionResult?.toJson(),
      'executableCode': executableCode?.toJson(),
      'fileData': fileData?.toJson(),
      'functionCall': functionCall?.toJson(),
      'functionResponse': functionResponse?.toJson(),
      'inlineData': inlineData?.toJson(),
      'text': text,
    };
  }
}

class GooglePromptFeedback {
  final String? blockReason;
  final List<GoogleSafetyRating>? safetyRatings;

  GooglePromptFeedback({
    this.blockReason,
    this.safetyRatings
  });

  factory GooglePromptFeedback.fromJson(Map<String, dynamic> json) {
    return GooglePromptFeedback(
      blockReason: json['blockReason']?.toString(),
      safetyRatings: (() {
        final list = _sdkworkAsList(json['safetyRatings']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleSafetyRating.fromJson(map);
      })())
            .whereType<GoogleSafetyRating>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'blockReason': blockReason,
      'safetyRatings': safetyRatings?.map((item) => item.toJson()).toList(),
    };
  }
}

class GoogleSafetyRating {
  final bool? blocked;
  final String? category;
  final String? probability;

  GoogleSafetyRating({
    this.blocked,
    this.category,
    this.probability
  });

  factory GoogleSafetyRating.fromJson(Map<String, dynamic> json) {
    return GoogleSafetyRating(
      blocked: json['blocked'] is bool ? json['blocked'] : null,
      category: json['category']?.toString(),
      probability: json['probability']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'blocked': blocked,
      'category': category,
      'probability': probability,
    };
  }
}

class GoogleSafetySetting {
  final String? category;
  final String? threshold;

  GoogleSafetySetting({
    this.category,
    this.threshold
  });

  factory GoogleSafetySetting.fromJson(Map<String, dynamic> json) {
    return GoogleSafetySetting(
      category: json['category']?.toString(),
      threshold: json['threshold']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'threshold': threshold,
    };
  }
}

class GoogleSchema {
  final String? description;
  final List<String>? enum_;
  final String? format;
  final dynamic items;
  final bool? nullable;
  final Map<String, dynamic>? properties;
  final List<String>? required_;
  final String? type;

  GoogleSchema({
    this.description,
    this.enum_,
    this.format,
    this.items,
    this.nullable,
    this.properties,
    this.required_,
    this.type
  });

  factory GoogleSchema.fromJson(Map<String, dynamic> json) {
    return GoogleSchema(
      description: json['description']?.toString(),
      enum_: (() {
        final list = _sdkworkAsList(json['enum']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      format: json['format']?.toString(),
      items: json['items'],
      nullable: json['nullable'] is bool ? json['nullable'] : null,
      properties: (() {
        final map = _sdkworkAsMap(json['properties']);
        if (map == null) {
          return null;
        }
        final result = <String, dynamic>{};
        map.forEach((key, item) {
          final deserialized = item;
          result[key] = deserialized;
        });
        return result;
      })(),
      required_: (() {
        final list = _sdkworkAsList(json['required']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'enum': enum_?.map((item) => item).toList(),
      'format': format,
      'items': items,
      'nullable': nullable,
      'properties': properties?.map((key, item) => MapEntry(key, item)),
      'required': required_?.map((item) => item).toList(),
      'type': type,
    };
  }
}

class GoogleSearchTool {
  final GoogleDynamicRetrievalConfig? dynamicRetrievalConfig;

  GoogleSearchTool({
    this.dynamicRetrievalConfig
  });

  factory GoogleSearchTool.fromJson(Map<String, dynamic> json) {
    return GoogleSearchTool(
      dynamicRetrievalConfig: (() {
        final map = _sdkworkAsMap(json['dynamicRetrievalConfig']);
        return map == null ? null : GoogleDynamicRetrievalConfig.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'dynamicRetrievalConfig': dynamicRetrievalConfig?.toJson(),
    };
  }
}

class GoogleThinkingConfig {
  final bool? includeThoughts;
  final int? thinkingBudget;

  GoogleThinkingConfig({
    this.includeThoughts,
    this.thinkingBudget
  });

  factory GoogleThinkingConfig.fromJson(Map<String, dynamic> json) {
    return GoogleThinkingConfig(
      includeThoughts: json['includeThoughts'] is bool ? json['includeThoughts'] : null,
      thinkingBudget: json['thinkingBudget'] is int ? json['thinkingBudget'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'includeThoughts': includeThoughts,
      'thinkingBudget': thinkingBudget,
    };
  }
}

class GoogleTool {
  final GoogleCodeExecutionTool? codeExecution;
  final List<GoogleFunctionDeclaration>? functionDeclarations;
  final GoogleSearchTool? googleSearch;
  final GoogleUrlContextTool? urlContext;

  GoogleTool({
    this.codeExecution,
    this.functionDeclarations,
    this.googleSearch,
    this.urlContext
  });

  factory GoogleTool.fromJson(Map<String, dynamic> json) {
    return GoogleTool(
      codeExecution: (() {
        final map = _sdkworkAsMap(json['codeExecution']);
        return map == null ? null : GoogleCodeExecutionTool.fromJson(map);
      })(),
      functionDeclarations: (() {
        final list = _sdkworkAsList(json['functionDeclarations']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GoogleFunctionDeclaration.fromJson(map);
      })())
            .whereType<GoogleFunctionDeclaration>()
            .toList();
      })(),
      googleSearch: (() {
        final map = _sdkworkAsMap(json['googleSearch']);
        return map == null ? null : GoogleSearchTool.fromJson(map);
      })(),
      urlContext: (() {
        final map = _sdkworkAsMap(json['urlContext']);
        return map == null ? null : GoogleUrlContextTool.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'codeExecution': codeExecution?.toJson(),
      'functionDeclarations': functionDeclarations?.map((item) => item.toJson()).toList(),
      'googleSearch': googleSearch?.toJson(),
      'urlContext': urlContext?.toJson(),
    };
  }
}

class GoogleToolConfig {
  final GoogleFunctionCallingConfig? functionCallingConfig;

  GoogleToolConfig({
    this.functionCallingConfig
  });

  factory GoogleToolConfig.fromJson(Map<String, dynamic> json) {
    return GoogleToolConfig(
      functionCallingConfig: (() {
        final map = _sdkworkAsMap(json['functionCallingConfig']);
        return map == null ? null : GoogleFunctionCallingConfig.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'functionCallingConfig': functionCallingConfig?.toJson(),
    };
  }
}

class GoogleUrlContextTool {
  final List<String>? allowedDomains;

  GoogleUrlContextTool({
    this.allowedDomains
  });

  factory GoogleUrlContextTool.fromJson(Map<String, dynamic> json) {
    return GoogleUrlContextTool(
      allowedDomains: (() {
        final list = _sdkworkAsList(json['allowedDomains']);
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
      'allowedDomains': allowedDomains?.map((item) => item).toList(),
    };
  }
}

class GoogleUsageMetadata {
  final int? cachedContentTokenCount;
  final int? candidatesTokenCount;
  final int? promptTokenCount;
  final int? thoughtsTokenCount;
  final int? totalTokenCount;

  GoogleUsageMetadata({
    this.cachedContentTokenCount,
    this.candidatesTokenCount,
    this.promptTokenCount,
    this.thoughtsTokenCount,
    this.totalTokenCount
  });

  factory GoogleUsageMetadata.fromJson(Map<String, dynamic> json) {
    return GoogleUsageMetadata(
      cachedContentTokenCount: json['cachedContentTokenCount'] is int ? json['cachedContentTokenCount'] : null,
      candidatesTokenCount: json['candidatesTokenCount'] is int ? json['candidatesTokenCount'] : null,
      promptTokenCount: json['promptTokenCount'] is int ? json['promptTokenCount'] : null,
      thoughtsTokenCount: json['thoughtsTokenCount'] is int ? json['thoughtsTokenCount'] : null,
      totalTokenCount: json['totalTokenCount'] is int ? json['totalTokenCount'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cachedContentTokenCount': cachedContentTokenCount,
      'candidatesTokenCount': candidatesTokenCount,
      'promptTokenCount': promptTokenCount,
      'thoughtsTokenCount': thoughtsTokenCount,
      'totalTokenCount': totalTokenCount,
    };
  }
}

class KlingVideoGenerationRequest {
  final String? aspectRatio;
  final String? callbackUrl;
  final double? cfgScale;
  final int? duration;
  final String? image;
  final String? imageTail;
  final String? mode;
  final String? model;
  final String? negativePrompt;
  final String? prompt;

  KlingVideoGenerationRequest({
    this.aspectRatio,
    this.callbackUrl,
    this.cfgScale,
    this.duration,
    this.image,
    this.imageTail,
    this.mode,
    this.model,
    this.negativePrompt,
    this.prompt
  });

  factory KlingVideoGenerationRequest.fromJson(Map<String, dynamic> json) {
    return KlingVideoGenerationRequest(
      aspectRatio: json['aspect_ratio']?.toString(),
      callbackUrl: json['callback_url']?.toString(),
      cfgScale: json['cfg_scale'] is num ? json['cfg_scale'].toDouble() : null,
      duration: json['duration'] is int ? json['duration'] : null,
      image: json['image']?.toString(),
      imageTail: json['image_tail']?.toString(),
      mode: json['mode']?.toString(),
      model: json['model']?.toString(),
      negativePrompt: json['negative_prompt']?.toString(),
      prompt: json['prompt']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aspect_ratio': aspectRatio,
      'callback_url': callbackUrl,
      'cfg_scale': cfgScale,
      'duration': duration,
      'image': image,
      'image_tail': imageTail,
      'mode': mode,
      'model': model,
      'negative_prompt': negativePrompt,
      'prompt': prompt,
    };
  }
}

class KlingVideoGenerationTask {
  final String? createdAt;
  final ProviderTaskError? error;
  final String? id;
  final String? model;
  final String? prompt;
  final String? state;
  final String? status;
  final String? taskId;
  final String? updatedAt;
  final List<ProviderGeneratedMedia>? videos;

  KlingVideoGenerationTask({
    this.createdAt,
    this.error,
    this.id,
    this.model,
    this.prompt,
    this.state,
    this.status,
    this.taskId,
    this.updatedAt,
    this.videos
  });

  factory KlingVideoGenerationTask.fromJson(Map<String, dynamic> json) {
    return KlingVideoGenerationTask(
      createdAt: json['created_at']?.toString(),
      error: (() {
        final map = _sdkworkAsMap(json['error']);
        return map == null ? null : ProviderTaskError.fromJson(map);
      })(),
      id: json['id']?.toString(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      state: json['state']?.toString(),
      status: json['status']?.toString(),
      taskId: json['task_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      videos: (() {
        final list = _sdkworkAsList(json['videos']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ProviderGeneratedMedia.fromJson(map);
      })())
            .whereType<ProviderGeneratedMedia>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'error': error?.toJson(),
      'id': id,
      'model': model,
      'prompt': prompt,
      'state': state,
      'status': status,
      'task_id': taskId,
      'updated_at': updatedAt,
      'videos': videos?.map((item) => item.toJson()).toList(),
    };
  }
}

class ListAssistantsItem {
  final dynamic content;
  final int? created;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<dynamic>? output;
  final String? role;
  final String? status;
  final OpenAiTokenUsage? usage;

  ListAssistantsItem({
    this.content,
    this.created,
    this.createdAt,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.output,
    this.role,
    this.status,
    this.usage
  });

  factory ListAssistantsItem.fromJson(Map<String, dynamic> json) {
    return ListAssistantsItem(
      content: json['content']?.toString(),
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      output: (() {
        final list = _sdkworkAsList(json['output']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      role: json['role']?.toString(),
      status: json['status']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'created': created,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'output': output?.map((item) => item).toList(),
      'role': role,
      'status': status,
      'usage': usage?.toJson(),
    };
  }
}

class ListBatchesItem {
  final int? created;
  final int? createdAt;
  final String? endpoint;
  final String? errorFileId;
  final String? id;
  final String? inputFileId;
  final Map<String, dynamic>? metadata;
  final String? object;
  final String? outputFileId;
  final String? status;

  ListBatchesItem({
    this.created,
    this.createdAt,
    this.endpoint,
    this.errorFileId,
    this.id,
    this.inputFileId,
    this.metadata,
    this.object,
    this.outputFileId,
    this.status
  });

  factory ListBatchesItem.fromJson(Map<String, dynamic> json) {
    return ListBatchesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      endpoint: json['endpoint']?.toString(),
      errorFileId: json['error_file_id']?.toString(),
      id: json['id']?.toString(),
      inputFileId: json['input_file_id']?.toString(),
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
      object: json['object']?.toString(),
      outputFileId: json['output_file_id']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'endpoint': endpoint,
      'error_file_id': errorFileId,
      'id': id,
      'input_file_id': inputFileId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'output_file_id': outputFileId,
      'status': status,
    };
  }
}

class ListChatCompletionMessagesItem {
  final dynamic content;
  final int? created;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<dynamic>? output;
  final String? role;
  final String? status;
  final OpenAiTokenUsage? usage;

  ListChatCompletionMessagesItem({
    this.content,
    this.created,
    this.createdAt,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.output,
    this.role,
    this.status,
    this.usage
  });

  factory ListChatCompletionMessagesItem.fromJson(Map<String, dynamic> json) {
    return ListChatCompletionMessagesItem(
      content: json['content']?.toString(),
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      output: (() {
        final list = _sdkworkAsList(json['output']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      role: json['role']?.toString(),
      status: json['status']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'created': created,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'output': output?.map((item) => item).toList(),
      'role': role,
      'status': status,
      'usage': usage?.toJson(),
    };
  }
}

class ListChatCompletionsItem {
  final dynamic content;
  final int? created;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<dynamic>? output;
  final String? role;
  final String? status;
  final OpenAiTokenUsage? usage;

  ListChatCompletionsItem({
    this.content,
    this.created,
    this.createdAt,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.output,
    this.role,
    this.status,
    this.usage
  });

  factory ListChatCompletionsItem.fromJson(Map<String, dynamic> json) {
    return ListChatCompletionsItem(
      content: json['content']?.toString(),
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      output: (() {
        final list = _sdkworkAsList(json['output']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      role: json['role']?.toString(),
      status: json['status']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'created': created,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'output': output?.map((item) => item).toList(),
      'role': role,
      'status': status,
      'usage': usage?.toJson(),
    };
  }
}

class ListContainerFilesItem {
  final int? bytes;
  final int? created;
  final int? createdAt;
  final String? filename;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;

  ListContainerFilesItem({
    this.bytes,
    this.created,
    this.createdAt,
    this.filename,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.status
  });

  factory ListContainerFilesItem.fromJson(Map<String, dynamic> json) {
    return ListContainerFilesItem(
      bytes: json['bytes'] is int ? json['bytes'] : null,
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      filename: json['filename']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bytes': bytes,
      'created': created,
      'created_at': createdAt,
      'filename': filename,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
    };
  }
}

class ListContainersItem {
  final int? bytes;
  final int? created;
  final int? createdAt;
  final String? filename;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;

  ListContainersItem({
    this.bytes,
    this.created,
    this.createdAt,
    this.filename,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.status
  });

  factory ListContainersItem.fromJson(Map<String, dynamic> json) {
    return ListContainersItem(
      bytes: json['bytes'] is int ? json['bytes'] : null,
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      filename: json['filename']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bytes': bytes,
      'created': created,
      'created_at': createdAt,
      'filename': filename,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
    };
  }
}

class ListEvalRunOutputItemsItem {
  final int? created;
  final int? createdAt;
  final dynamic dataSource;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final dynamic resultCounts;
  final String? status;

  ListEvalRunOutputItemsItem({
    this.created,
    this.createdAt,
    this.dataSource,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.resultCounts,
    this.status
  });

  factory ListEvalRunOutputItemsItem.fromJson(Map<String, dynamic> json) {
    return ListEvalRunOutputItemsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      dataSource: json['data_source']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      resultCounts: json['result_counts']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'data_source': dataSource,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'result_counts': resultCounts,
      'status': status,
    };
  }
}

class ListEvalRunsItem {
  final int? created;
  final int? createdAt;
  final dynamic dataSource;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final dynamic resultCounts;
  final String? status;

  ListEvalRunsItem({
    this.created,
    this.createdAt,
    this.dataSource,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.resultCounts,
    this.status
  });

  factory ListEvalRunsItem.fromJson(Map<String, dynamic> json) {
    return ListEvalRunsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      dataSource: json['data_source']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      resultCounts: json['result_counts']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'data_source': dataSource,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'result_counts': resultCounts,
      'status': status,
    };
  }
}

class ListEvalsItem {
  final int? created;
  final int? createdAt;
  final dynamic dataSource;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final dynamic resultCounts;
  final String? status;

  ListEvalsItem({
    this.created,
    this.createdAt,
    this.dataSource,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.resultCounts,
    this.status
  });

  factory ListEvalsItem.fromJson(Map<String, dynamic> json) {
    return ListEvalsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      dataSource: json['data_source']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      resultCounts: json['result_counts']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'data_source': dataSource,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'result_counts': resultCounts,
      'status': status,
    };
  }
}

class ListFilesItem {
  final int? bytes;
  final int? created;
  final int? createdAt;
  final String? filename;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? object;
  final String? purpose;
  final String? status;

  ListFilesItem({
    this.bytes,
    this.created,
    this.createdAt,
    this.filename,
    this.id,
    this.metadata,
    this.object,
    this.purpose,
    this.status
  });

  factory ListFilesItem.fromJson(Map<String, dynamic> json) {
    return ListFilesItem(
      bytes: json['bytes'] is int ? json['bytes'] : null,
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      filename: json['filename']?.toString(),
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      purpose: json['purpose']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bytes': bytes,
      'created': created,
      'created_at': createdAt,
      'filename': filename,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'purpose': purpose,
      'status': status,
    };
  }
}

class ListFineTuningCheckpointPermissionsItem {
  final int? created;
  final int? createdAt;
  final String? fineTunedModel;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<String>? resultFiles;
  final String? status;
  final String? trainingFile;

  ListFineTuningCheckpointPermissionsItem({
    this.created,
    this.createdAt,
    this.fineTunedModel,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.resultFiles,
    this.status,
    this.trainingFile
  });

  factory ListFineTuningCheckpointPermissionsItem.fromJson(Map<String, dynamic> json) {
    return ListFineTuningCheckpointPermissionsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      fineTunedModel: json['fine_tuned_model']?.toString(),
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      resultFiles: (() {
        final list = _sdkworkAsList(json['result_files']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      status: json['status']?.toString(),
      trainingFile: json['training_file']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'fine_tuned_model': fineTunedModel,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'result_files': resultFiles?.map((item) => item).toList(),
      'status': status,
      'training_file': trainingFile,
    };
  }
}

class ListFineTuningJobCheckpointsItem {
  final int? created;
  final int? createdAt;
  final String? fineTunedModel;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<String>? resultFiles;
  final String? status;
  final String? trainingFile;

  ListFineTuningJobCheckpointsItem({
    this.created,
    this.createdAt,
    this.fineTunedModel,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.resultFiles,
    this.status,
    this.trainingFile
  });

  factory ListFineTuningJobCheckpointsItem.fromJson(Map<String, dynamic> json) {
    return ListFineTuningJobCheckpointsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      fineTunedModel: json['fine_tuned_model']?.toString(),
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      resultFiles: (() {
        final list = _sdkworkAsList(json['result_files']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      status: json['status']?.toString(),
      trainingFile: json['training_file']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'fine_tuned_model': fineTunedModel,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'result_files': resultFiles?.map((item) => item).toList(),
      'status': status,
      'training_file': trainingFile,
    };
  }
}

class ListFineTuningJobEventsItem {
  final int? created;
  final int? createdAt;
  final String? fineTunedModel;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<String>? resultFiles;
  final String? status;
  final String? trainingFile;

  ListFineTuningJobEventsItem({
    this.created,
    this.createdAt,
    this.fineTunedModel,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.resultFiles,
    this.status,
    this.trainingFile
  });

  factory ListFineTuningJobEventsItem.fromJson(Map<String, dynamic> json) {
    return ListFineTuningJobEventsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      fineTunedModel: json['fine_tuned_model']?.toString(),
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      resultFiles: (() {
        final list = _sdkworkAsList(json['result_files']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      status: json['status']?.toString(),
      trainingFile: json['training_file']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'fine_tuned_model': fineTunedModel,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'result_files': resultFiles?.map((item) => item).toList(),
      'status': status,
      'training_file': trainingFile,
    };
  }
}

class ListFineTuningJobsItem {
  final int? created;
  final int? createdAt;
  final String? fineTunedModel;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<String>? resultFiles;
  final String? status;
  final String? trainingFile;

  ListFineTuningJobsItem({
    this.created,
    this.createdAt,
    this.fineTunedModel,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.resultFiles,
    this.status,
    this.trainingFile
  });

  factory ListFineTuningJobsItem.fromJson(Map<String, dynamic> json) {
    return ListFineTuningJobsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      fineTunedModel: json['fine_tuned_model']?.toString(),
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      resultFiles: (() {
        final list = _sdkworkAsList(json['result_files']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      status: json['status']?.toString(),
      trainingFile: json['training_file']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'fine_tuned_model': fineTunedModel,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'result_files': resultFiles?.map((item) => item).toList(),
      'status': status,
      'training_file': trainingFile,
    };
  }
}

class ListMessagesItem {
  final dynamic content;
  final int? created;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<dynamic>? output;
  final String? role;
  final String? status;
  final OpenAiTokenUsage? usage;

  ListMessagesItem({
    this.content,
    this.created,
    this.createdAt,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.output,
    this.role,
    this.status,
    this.usage
  });

  factory ListMessagesItem.fromJson(Map<String, dynamic> json) {
    return ListMessagesItem(
      content: json['content']?.toString(),
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      output: (() {
        final list = _sdkworkAsList(json['output']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      role: json['role']?.toString(),
      status: json['status']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'created': created,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'output': output?.map((item) => item).toList(),
      'role': role,
      'status': status,
      'usage': usage?.toJson(),
    };
  }
}

class ListOrganizationAdminApiKeysItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationAdminApiKeysItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationAdminApiKeysItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationAdminApiKeysItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListOrganizationAuditLogsItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationAuditLogsItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationAuditLogsItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationAuditLogsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListOrganizationCertificatesItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationCertificatesItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationCertificatesItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationCertificatesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListOrganizationGroupRolesItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationGroupRolesItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationGroupRolesItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationGroupRolesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListOrganizationGroupUsersItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationGroupUsersItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationGroupUsersItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationGroupUsersItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListOrganizationGroupsItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationGroupsItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationGroupsItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationGroupsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListOrganizationInvitesItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationInvitesItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationInvitesItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationInvitesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListOrganizationProjectsItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationProjectsItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationProjectsItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationProjectsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListOrganizationRolesItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationRolesItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationRolesItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationRolesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListOrganizationUserRolesItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationUserRolesItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationUserRolesItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationUserRolesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListOrganizationUsersItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListOrganizationUsersItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListOrganizationUsersItem.fromJson(Map<String, dynamic> json) {
    return ListOrganizationUsersItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListProjectApiKeysItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListProjectApiKeysItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListProjectApiKeysItem.fromJson(Map<String, dynamic> json) {
    return ListProjectApiKeysItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListProjectCertificatesItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListProjectCertificatesItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListProjectCertificatesItem.fromJson(Map<String, dynamic> json) {
    return ListProjectCertificatesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListProjectGroupRolesItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListProjectGroupRolesItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListProjectGroupRolesItem.fromJson(Map<String, dynamic> json) {
    return ListProjectGroupRolesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListProjectGroupsItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListProjectGroupsItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListProjectGroupsItem.fromJson(Map<String, dynamic> json) {
    return ListProjectGroupsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListProjectRateLimitsItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListProjectRateLimitsItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListProjectRateLimitsItem.fromJson(Map<String, dynamic> json) {
    return ListProjectRateLimitsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListProjectRolesItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListProjectRolesItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListProjectRolesItem.fromJson(Map<String, dynamic> json) {
    return ListProjectRolesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListProjectServiceAccountsItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListProjectServiceAccountsItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListProjectServiceAccountsItem.fromJson(Map<String, dynamic> json) {
    return ListProjectServiceAccountsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListProjectUserRolesItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListProjectUserRolesItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListProjectUserRolesItem.fromJson(Map<String, dynamic> json) {
    return ListProjectUserRolesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListProjectUsersItem {
  final int? created;
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? projectId;
  final String? role;
  final String? status;

  ListProjectUsersItem({
    this.created,
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.projectId,
    this.role,
    this.status
  });

  factory ListProjectUsersItem.fromJson(Map<String, dynamic> json) {
    return ListProjectUsersItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'project_id': projectId,
      'role': role,
      'status': status,
    };
  }
}

class ListResponseInputItemsItem {
  final dynamic content;
  final int? created;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<dynamic>? output;
  final String? role;
  final String? status;
  final OpenAiTokenUsage? usage;

  ListResponseInputItemsItem({
    this.content,
    this.created,
    this.createdAt,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.output,
    this.role,
    this.status,
    this.usage
  });

  factory ListResponseInputItemsItem.fromJson(Map<String, dynamic> json) {
    return ListResponseInputItemsItem(
      content: json['content']?.toString(),
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      output: (() {
        final list = _sdkworkAsList(json['output']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      role: json['role']?.toString(),
      status: json['status']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'created': created,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'output': output?.map((item) => item).toList(),
      'role': role,
      'status': status,
      'usage': usage?.toJson(),
    };
  }
}

class ListRunStepsItem {
  final dynamic content;
  final int? created;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<dynamic>? output;
  final String? role;
  final String? status;
  final OpenAiTokenUsage? usage;

  ListRunStepsItem({
    this.content,
    this.created,
    this.createdAt,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.output,
    this.role,
    this.status,
    this.usage
  });

  factory ListRunStepsItem.fromJson(Map<String, dynamic> json) {
    return ListRunStepsItem(
      content: json['content']?.toString(),
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      output: (() {
        final list = _sdkworkAsList(json['output']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      role: json['role']?.toString(),
      status: json['status']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'created': created,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'output': output?.map((item) => item).toList(),
      'role': role,
      'status': status,
      'usage': usage?.toJson(),
    };
  }
}

class ListRunsItem {
  final dynamic content;
  final int? created;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final List<dynamic>? output;
  final String? role;
  final String? status;
  final OpenAiTokenUsage? usage;

  ListRunsItem({
    this.content,
    this.created,
    this.createdAt,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.output,
    this.role,
    this.status,
    this.usage
  });

  factory ListRunsItem.fromJson(Map<String, dynamic> json) {
    return ListRunsItem(
      content: json['content']?.toString(),
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      output: (() {
        final list = _sdkworkAsList(json['output']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      role: json['role']?.toString(),
      status: json['status']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'created': created,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'output': output?.map((item) => item).toList(),
      'role': role,
      'status': status,
      'usage': usage?.toJson(),
    };
  }
}

class ListSkillVersionsItem {
  final int? created;
  final int? createdAt;
  final String? description;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;
  final String? version;

  ListSkillVersionsItem({
    this.created,
    this.createdAt,
    this.description,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.status,
    this.version
  });

  factory ListSkillVersionsItem.fromJson(Map<String, dynamic> json) {
    return ListSkillVersionsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      description: json['description']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'description': description,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
      'version': version,
    };
  }
}

class ListSkillsItem {
  final int? created;
  final int? createdAt;
  final String? description;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;
  final String? version;

  ListSkillsItem({
    this.created,
    this.createdAt,
    this.description,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.status,
    this.version
  });

  factory ListSkillsItem.fromJson(Map<String, dynamic> json) {
    return ListSkillsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      description: json['description']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'description': description,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
      'version': version,
    };
  }
}

class ListVectorStoreFileBatchFilesItem {
  final int? created;
  final int? createdAt;
  final String? fileId;
  final List<String>? fileIds;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;
  final int? usageBytes;

  ListVectorStoreFileBatchFilesItem({
    this.created,
    this.createdAt,
    this.fileId,
    this.fileIds,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.status,
    this.usageBytes
  });

  factory ListVectorStoreFileBatchFilesItem.fromJson(Map<String, dynamic> json) {
    return ListVectorStoreFileBatchFilesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      fileId: json['file_id']?.toString(),
      fileIds: (() {
        final list = _sdkworkAsList(json['file_ids']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      usageBytes: json['usage_bytes'] is int ? json['usage_bytes'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'file_id': fileId,
      'file_ids': fileIds?.map((item) => item).toList(),
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
      'usage_bytes': usageBytes,
    };
  }
}

class ListVectorStoreFilesItem {
  final int? created;
  final int? createdAt;
  final String? fileId;
  final List<String>? fileIds;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;
  final int? usageBytes;

  ListVectorStoreFilesItem({
    this.created,
    this.createdAt,
    this.fileId,
    this.fileIds,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.status,
    this.usageBytes
  });

  factory ListVectorStoreFilesItem.fromJson(Map<String, dynamic> json) {
    return ListVectorStoreFilesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      fileId: json['file_id']?.toString(),
      fileIds: (() {
        final list = _sdkworkAsList(json['file_ids']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      usageBytes: json['usage_bytes'] is int ? json['usage_bytes'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'file_id': fileId,
      'file_ids': fileIds?.map((item) => item).toList(),
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
      'usage_bytes': usageBytes,
    };
  }
}

class ListVectorStoresItem {
  final int? created;
  final int? createdAt;
  final String? fileId;
  final List<String>? fileIds;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;
  final int? usageBytes;

  ListVectorStoresItem({
    this.created,
    this.createdAt,
    this.fileId,
    this.fileIds,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.status,
    this.usageBytes
  });

  factory ListVectorStoresItem.fromJson(Map<String, dynamic> json) {
    return ListVectorStoresItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      fileId: json['file_id']?.toString(),
      fileIds: (() {
        final list = _sdkworkAsList(json['file_ids']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      usageBytes: json['usage_bytes'] is int ? json['usage_bytes'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'file_id': fileId,
      'file_ids': fileIds?.map((item) => item).toList(),
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
      'usage_bytes': usageBytes,
    };
  }
}

class ListVideosItem {
  final int? created;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final String? status;
  final String? url;
  final dynamic video;

  ListVideosItem({
    this.created,
    this.createdAt,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.status,
    this.url,
    this.video
  });

  factory ListVideosItem.fromJson(Map<String, dynamic> json) {
    return ListVideosItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      url: json['url']?.toString(),
      video: json['video']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'status': status,
      'url': url,
      'video': video,
    };
  }
}

class ListVoiceConsentsItem {
  final int? created;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? object;
  final String? status;
  final String? text;
  final String? url;
  final String? voice;

  ListVoiceConsentsItem({
    this.created,
    this.createdAt,
    this.id,
    this.metadata,
    this.object,
    this.status,
    this.text,
    this.url,
    this.voice
  });

  factory ListVoiceConsentsItem.fromJson(Map<String, dynamic> json) {
    return ListVoiceConsentsItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      text: json['text']?.toString(),
      url: json['url']?.toString(),
      voice: json['voice']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'status': status,
      'text': text,
      'url': url,
      'voice': voice,
    };
  }
}

class ListVoicesItem {
  final int? created;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? object;
  final String? status;
  final String? text;
  final String? url;
  final String? voice;

  ListVoicesItem({
    this.created,
    this.createdAt,
    this.id,
    this.metadata,
    this.object,
    this.status,
    this.text,
    this.url,
    this.voice
  });

  factory ListVoicesItem.fromJson(Map<String, dynamic> json) {
    return ListVoicesItem(
      created: json['created'] is int ? json['created'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      text: json['text']?.toString(),
      url: json['url']?.toString(),
      voice: json['voice']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'status': status,
      'text': text,
      'url': url,
      'voice': voice,
    };
  }
}

class MidjourneyImageGenerationRequest {
  final String? aspectRatio;
  final String? callbackUrl;
  final String? model;
  final String? prompt;
  final int? seed;
  final String? style;

  MidjourneyImageGenerationRequest({
    this.aspectRatio,
    this.callbackUrl,
    this.model,
    this.prompt,
    this.seed,
    this.style
  });

  factory MidjourneyImageGenerationRequest.fromJson(Map<String, dynamic> json) {
    return MidjourneyImageGenerationRequest(
      aspectRatio: json['aspect_ratio']?.toString(),
      callbackUrl: json['callback_url']?.toString(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      seed: json['seed'] is int ? json['seed'] : null,
      style: json['style']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aspect_ratio': aspectRatio,
      'callback_url': callbackUrl,
      'model': model,
      'prompt': prompt,
      'seed': seed,
      'style': style,
    };
  }
}

class MidjourneyImageGenerationTask {
  final String? createdAt;
  final ProviderTaskError? error;
  final String? id;
  final List<ProviderGeneratedMedia>? images;
  final String? model;
  final String? prompt;
  final String? state;
  final String? status;
  final String? taskId;
  final String? updatedAt;

  MidjourneyImageGenerationTask({
    this.createdAt,
    this.error,
    this.id,
    this.images,
    this.model,
    this.prompt,
    this.state,
    this.status,
    this.taskId,
    this.updatedAt
  });

  factory MidjourneyImageGenerationTask.fromJson(Map<String, dynamic> json) {
    return MidjourneyImageGenerationTask(
      createdAt: json['created_at']?.toString(),
      error: (() {
        final map = _sdkworkAsMap(json['error']);
        return map == null ? null : ProviderTaskError.fromJson(map);
      })(),
      id: json['id']?.toString(),
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ProviderGeneratedMedia.fromJson(map);
      })())
            .whereType<ProviderGeneratedMedia>()
            .toList();
      })(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      state: json['state']?.toString(),
      status: json['status']?.toString(),
      taskId: json['task_id']?.toString(),
      updatedAt: json['updated_at']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'error': error?.toJson(),
      'id': id,
      'images': images?.map((item) => item.toJson()).toList(),
      'model': model,
      'prompt': prompt,
      'state': state,
      'status': status,
      'task_id': taskId,
      'updated_at': updatedAt,
    };
  }
}

class NanoBananaImageGenerationRequest {
  final String? aspectRatio;
  final String? callbackUrl;
  final List<String>? images;
  final String? model;
  final String? prompt;
  final int? seed;
  final String? size;

  NanoBananaImageGenerationRequest({
    this.aspectRatio,
    this.callbackUrl,
    this.images,
    this.model,
    this.prompt,
    this.seed,
    this.size
  });

  factory NanoBananaImageGenerationRequest.fromJson(Map<String, dynamic> json) {
    return NanoBananaImageGenerationRequest(
      aspectRatio: json['aspect_ratio']?.toString(),
      callbackUrl: json['callback_url']?.toString(),
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      seed: json['seed'] is int ? json['seed'] : null,
      size: json['size']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aspect_ratio': aspectRatio,
      'callback_url': callbackUrl,
      'images': images?.map((item) => item).toList(),
      'model': model,
      'prompt': prompt,
      'seed': seed,
      'size': size,
    };
  }
}

class NanoBananaImageGenerationTask {
  final String? createdAt;
  final ProviderTaskError? error;
  final String? id;
  final List<ProviderGeneratedMedia>? images;
  final String? model;
  final String? prompt;
  final String? state;
  final String? status;
  final String? taskId;
  final String? updatedAt;

  NanoBananaImageGenerationTask({
    this.createdAt,
    this.error,
    this.id,
    this.images,
    this.model,
    this.prompt,
    this.state,
    this.status,
    this.taskId,
    this.updatedAt
  });

  factory NanoBananaImageGenerationTask.fromJson(Map<String, dynamic> json) {
    return NanoBananaImageGenerationTask(
      createdAt: json['created_at']?.toString(),
      error: (() {
        final map = _sdkworkAsMap(json['error']);
        return map == null ? null : ProviderTaskError.fromJson(map);
      })(),
      id: json['id']?.toString(),
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ProviderGeneratedMedia.fromJson(map);
      })())
            .whereType<ProviderGeneratedMedia>()
            .toList();
      })(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      state: json['state']?.toString(),
      status: json['status']?.toString(),
      taskId: json['task_id']?.toString(),
      updatedAt: json['updated_at']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'error': error?.toJson(),
      'id': id,
      'images': images?.map((item) => item.toJson()).toList(),
      'model': model,
      'prompt': prompt,
      'state': state,
      'status': status,
      'task_id': taskId,
      'updated_at': updatedAt,
    };
  }
}

class OpenAiAnnotation {
  final int? endIndex;
  final String? fileId;
  final String? filename;
  final int? index;
  final int? startIndex;
  final String? title;
  final String? type;
  final String? url;

  OpenAiAnnotation({
    this.endIndex,
    this.fileId,
    this.filename,
    this.index,
    this.startIndex,
    this.title,
    this.type,
    this.url
  });

  factory OpenAiAnnotation.fromJson(Map<String, dynamic> json) {
    return OpenAiAnnotation(
      endIndex: json['end_index'] is int ? json['end_index'] : null,
      fileId: json['file_id']?.toString(),
      filename: json['filename']?.toString(),
      index: json['index'] is int ? json['index'] : null,
      startIndex: json['start_index'] is int ? json['start_index'] : null,
      title: json['title']?.toString(),
      type: json['type']?.toString(),
      url: json['url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'end_index': endIndex,
      'file_id': fileId,
      'filename': filename,
      'index': index,
      'start_index': startIndex,
      'title': title,
      'type': type,
      'url': url,
    };
  }
}

class OpenAiAssistant {
  final int? createdAt;
  final String? description;
  final String? id;
  final String? instructions;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? name;
  final String? object;
  final dynamic responseFormat;
  final double? temperature;
  final dynamic toolResources;
  final List<dynamic>? tools;
  final double? topP;

  OpenAiAssistant({
    this.createdAt,
    this.description,
    this.id,
    this.instructions,
    this.metadata,
    this.model,
    this.name,
    this.object,
    this.responseFormat,
    this.temperature,
    this.toolResources,
    this.tools,
    this.topP
  });

  factory OpenAiAssistant.fromJson(Map<String, dynamic> json) {
    return OpenAiAssistant(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      description: json['description']?.toString(),
      id: json['id']?.toString(),
      instructions: json['instructions']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      responseFormat: json['response_format']?.toString(),
      temperature: json['temperature'] is num ? json['temperature'].toDouble() : null,
      toolResources: json['tool_resources']?.toString(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      topP: json['top_p'] is num ? json['top_p'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'description': description,
      'id': id,
      'instructions': instructions,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'name': name,
      'object': object,
      'response_format': responseFormat,
      'temperature': temperature,
      'tool_resources': toolResources,
      'tools': tools?.map((item) => item).toList(),
      'top_p': topP,
    };
  }
}

class OpenAiAssistantCreateRequest {
  final String? description;
  final String? instructions;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? name;
  final dynamic responseFormat;
  final double? temperature;
  final dynamic toolResources;
  final List<dynamic>? tools;
  final double? topP;

  OpenAiAssistantCreateRequest({
    this.description,
    this.instructions,
    this.metadata,
    this.model,
    this.name,
    this.responseFormat,
    this.temperature,
    this.toolResources,
    this.tools,
    this.topP
  });

  factory OpenAiAssistantCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiAssistantCreateRequest(
      description: json['description']?.toString(),
      instructions: json['instructions']?.toString(),
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
      name: json['name']?.toString(),
      responseFormat: json['response_format']?.toString(),
      temperature: json['temperature'] is num ? json['temperature'].toDouble() : null,
      toolResources: json['tool_resources']?.toString(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      topP: json['top_p'] is num ? json['top_p'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'instructions': instructions,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'name': name,
      'response_format': responseFormat,
      'temperature': temperature,
      'tool_resources': toolResources,
      'tools': tools?.map((item) => item).toList(),
      'top_p': topP,
    };
  }
}

class OpenAiAssistantList {
  final List<OpenAiAssistant>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiAssistantList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiAssistantList.fromJson(Map<String, dynamic> json) {
    return OpenAiAssistantList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiAssistant.fromJson(map);
      })())
            .whereType<OpenAiAssistant>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiAssistantUpdateRequest {
  final String? description;
  final String? instructions;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? name;
  final dynamic responseFormat;
  final double? temperature;
  final dynamic toolResources;
  final List<dynamic>? tools;
  final double? topP;

  OpenAiAssistantUpdateRequest({
    this.description,
    this.instructions,
    this.metadata,
    this.model,
    this.name,
    this.responseFormat,
    this.temperature,
    this.toolResources,
    this.tools,
    this.topP
  });

  factory OpenAiAssistantUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiAssistantUpdateRequest(
      description: json['description']?.toString(),
      instructions: json['instructions']?.toString(),
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
      name: json['name']?.toString(),
      responseFormat: json['response_format']?.toString(),
      temperature: json['temperature'] is num ? json['temperature'].toDouble() : null,
      toolResources: json['tool_resources']?.toString(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      topP: json['top_p'] is num ? json['top_p'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'instructions': instructions,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'name': name,
      'response_format': responseFormat,
      'temperature': temperature,
      'tool_resources': toolResources,
      'tools': tools?.map((item) => item).toList(),
      'top_p': topP,
    };
  }
}

class OpenAiAudioTranscription {
  final double? duration;
  final String? language;
  final List<dynamic>? segments;
  final String? text;
  final List<dynamic>? words;

  OpenAiAudioTranscription({
    this.duration,
    this.language,
    this.segments,
    this.text,
    this.words
  });

  factory OpenAiAudioTranscription.fromJson(Map<String, dynamic> json) {
    return OpenAiAudioTranscription(
      duration: json['duration'] is num ? json['duration'].toDouble() : null,
      language: json['language']?.toString(),
      segments: (() {
        final list = _sdkworkAsList(json['segments']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      text: json['text']?.toString(),
      words: (() {
        final list = _sdkworkAsList(json['words']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'duration': duration,
      'language': language,
      'segments': segments?.map((item) => item).toList(),
      'text': text,
      'words': words?.map((item) => item).toList(),
    };
  }
}

class OpenAiAudioTranscriptionMultipartRequest {
  final String? file;
  final String? language;
  final String? model;
  final String? prompt;
  final String? responseFormat;

  OpenAiAudioTranscriptionMultipartRequest({
    this.file,
    this.language,
    this.model,
    this.prompt,
    this.responseFormat
  });

  factory OpenAiAudioTranscriptionMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiAudioTranscriptionMultipartRequest(
      file: json['file']?.toString(),
      language: json['language']?.toString(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      responseFormat: json['response_format']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
      'language': language,
      'model': model,
      'prompt': prompt,
      'response_format': responseFormat,
    };
  }
}

class OpenAiAudioTranscriptionRequest {
  final OpenAiFileReferenceInput? file;
  final String? language;
  final String? model;
  final String? prompt;
  final String? responseFormat;

  OpenAiAudioTranscriptionRequest({
    this.file,
    this.language,
    this.model,
    this.prompt,
    this.responseFormat
  });

  factory OpenAiAudioTranscriptionRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiAudioTranscriptionRequest(
      file: (() {
        final map = _sdkworkAsMap(json['file']);
        return map == null ? null : OpenAiFileReferenceInput.fromJson(map);
      })(),
      language: json['language']?.toString(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      responseFormat: json['response_format']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file?.toJson(),
      'language': language,
      'model': model,
      'prompt': prompt,
      'response_format': responseFormat,
    };
  }
}

class OpenAiAudioTranslation {
  final double? duration;
  final List<dynamic>? segments;
  final String? text;

  OpenAiAudioTranslation({
    this.duration,
    this.segments,
    this.text
  });

  factory OpenAiAudioTranslation.fromJson(Map<String, dynamic> json) {
    return OpenAiAudioTranslation(
      duration: json['duration'] is num ? json['duration'].toDouble() : null,
      segments: (() {
        final list = _sdkworkAsList(json['segments']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      text: json['text']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'duration': duration,
      'segments': segments?.map((item) => item).toList(),
      'text': text,
    };
  }
}

class OpenAiAudioTranslationMultipartRequest {
  final String? file;
  final String? model;
  final String? prompt;
  final String? responseFormat;

  OpenAiAudioTranslationMultipartRequest({
    this.file,
    this.model,
    this.prompt,
    this.responseFormat
  });

  factory OpenAiAudioTranslationMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiAudioTranslationMultipartRequest(
      file: json['file']?.toString(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      responseFormat: json['response_format']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
      'model': model,
      'prompt': prompt,
      'response_format': responseFormat,
    };
  }
}

class OpenAiAudioTranslationRequest {
  final OpenAiFileReferenceInput? file;
  final String? model;
  final String? prompt;
  final String? responseFormat;

  OpenAiAudioTranslationRequest({
    this.file,
    this.model,
    this.prompt,
    this.responseFormat
  });

  factory OpenAiAudioTranslationRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiAudioTranslationRequest(
      file: (() {
        final map = _sdkworkAsMap(json['file']);
        return map == null ? null : OpenAiFileReferenceInput.fromJson(map);
      })(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      responseFormat: json['response_format']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file?.toJson(),
      'model': model,
      'prompt': prompt,
      'response_format': responseFormat,
    };
  }
}

class OpenAiBatch {
  final int? cancelledAt;
  final int? cancellingAt;
  final int? completedAt;
  final String? completionWindow;
  final int? createdAt;
  final String? endpoint;
  final String? errorFileId;
  final dynamic errors;
  final int? expiredAt;
  final int? expiresAt;
  final int? failedAt;
  final int? finalizingAt;
  final String? id;
  final int? inProgressAt;
  final String? inputFileId;
  final Map<String, dynamic>? metadata;
  final String? object;
  final String? outputFileId;
  final OpenAiBatchRequestCounts? requestCounts;
  final String? status;

  OpenAiBatch({
    this.cancelledAt,
    this.cancellingAt,
    this.completedAt,
    this.completionWindow,
    this.createdAt,
    this.endpoint,
    this.errorFileId,
    this.errors,
    this.expiredAt,
    this.expiresAt,
    this.failedAt,
    this.finalizingAt,
    this.id,
    this.inProgressAt,
    this.inputFileId,
    this.metadata,
    this.object,
    this.outputFileId,
    this.requestCounts,
    this.status
  });

  factory OpenAiBatch.fromJson(Map<String, dynamic> json) {
    return OpenAiBatch(
      cancelledAt: json['cancelled_at'] is int ? json['cancelled_at'] : null,
      cancellingAt: json['cancelling_at'] is int ? json['cancelling_at'] : null,
      completedAt: json['completed_at'] is int ? json['completed_at'] : null,
      completionWindow: json['completion_window']?.toString(),
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      endpoint: json['endpoint']?.toString(),
      errorFileId: json['error_file_id']?.toString(),
      errors: json['errors']?.toString(),
      expiredAt: json['expired_at'] is int ? json['expired_at'] : null,
      expiresAt: json['expires_at'] is int ? json['expires_at'] : null,
      failedAt: json['failed_at'] is int ? json['failed_at'] : null,
      finalizingAt: json['finalizing_at'] is int ? json['finalizing_at'] : null,
      id: json['id']?.toString(),
      inProgressAt: json['in_progress_at'] is int ? json['in_progress_at'] : null,
      inputFileId: json['input_file_id']?.toString(),
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
      object: json['object']?.toString(),
      outputFileId: json['output_file_id']?.toString(),
      requestCounts: (() {
        final map = _sdkworkAsMap(json['request_counts']);
        return map == null ? null : OpenAiBatchRequestCounts.fromJson(map);
      })(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cancelled_at': cancelledAt,
      'cancelling_at': cancellingAt,
      'completed_at': completedAt,
      'completion_window': completionWindow,
      'created_at': createdAt,
      'endpoint': endpoint,
      'error_file_id': errorFileId,
      'errors': errors,
      'expired_at': expiredAt,
      'expires_at': expiresAt,
      'failed_at': failedAt,
      'finalizing_at': finalizingAt,
      'id': id,
      'in_progress_at': inProgressAt,
      'input_file_id': inputFileId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'output_file_id': outputFileId,
      'request_counts': requestCounts?.toJson(),
      'status': status,
    };
  }
}

class OpenAiBatchCreateRequest {
  final String? completionWindow;
  final String? endpoint;
  final String? inputFileId;
  final Map<String, dynamic>? metadata;

  OpenAiBatchCreateRequest({
    this.completionWindow,
    this.endpoint,
    this.inputFileId,
    this.metadata
  });

  factory OpenAiBatchCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiBatchCreateRequest(
      completionWindow: json['completion_window']?.toString(),
      endpoint: json['endpoint']?.toString(),
      inputFileId: json['input_file_id']?.toString(),
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
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'completion_window': completionWindow,
      'endpoint': endpoint,
      'input_file_id': inputFileId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class OpenAiBatchList {
  final List<OpenAiBatch>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiBatchList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiBatchList.fromJson(Map<String, dynamic> json) {
    return OpenAiBatchList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiBatch.fromJson(map);
      })())
            .whereType<OpenAiBatch>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiBatchRequestCounts {
  final int? completed;
  final int? failed;
  final int? total;

  OpenAiBatchRequestCounts({
    this.completed,
    this.failed,
    this.total
  });

  factory OpenAiBatchRequestCounts.fromJson(Map<String, dynamic> json) {
    return OpenAiBatchRequestCounts(
      completed: json['completed'] is int ? json['completed'] : null,
      failed: json['failed'] is int ? json['failed'] : null,
      total: json['total'] is int ? json['total'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'completed': completed,
      'failed': failed,
      'total': total,
    };
  }
}

class OpenAiCertificate {
  final bool? active;
  final String? content;
  final int? createdAt;
  final int? expiresAt;
  final String? id;
  final String? name;
  final String? object;

  OpenAiCertificate({
    this.active,
    this.content,
    this.createdAt,
    this.expiresAt,
    this.id,
    this.name,
    this.object
  });

  factory OpenAiCertificate.fromJson(Map<String, dynamic> json) {
    return OpenAiCertificate(
      active: json['active'] is bool ? json['active'] : null,
      content: json['content']?.toString(),
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      expiresAt: json['expires_at'] is int ? json['expires_at'] : null,
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'active': active,
      'content': content,
      'created_at': createdAt,
      'expires_at': expiresAt,
      'id': id,
      'name': name,
      'object': object,
    };
  }
}

class OpenAiCertificateActivationRequest {
  final List<String>? certificateIds;

  OpenAiCertificateActivationRequest({
    this.certificateIds
  });

  factory OpenAiCertificateActivationRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiCertificateActivationRequest(
      certificateIds: (() {
        final list = _sdkworkAsList(json['certificate_ids']);
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
      'certificate_ids': certificateIds?.map((item) => item).toList(),
    };
  }
}

class OpenAiCertificateList {
  final List<OpenAiCertificate>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiCertificateList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiCertificateList.fromJson(Map<String, dynamic> json) {
    return OpenAiCertificateList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiCertificate.fromJson(map);
      })())
            .whereType<OpenAiCertificate>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiCertificateUploadMultipartRequest {
  final String? certificate;
  final String? file;
  final String? metadata;
  final String? name;

  OpenAiCertificateUploadMultipartRequest({
    this.certificate,
    this.file,
    this.metadata,
    this.name
  });

  factory OpenAiCertificateUploadMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiCertificateUploadMultipartRequest(
      certificate: json['certificate']?.toString(),
      file: json['file']?.toString(),
      metadata: json['metadata']?.toString(),
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'certificate': certificate,
      'file': file,
      'metadata': metadata,
      'name': name,
    };
  }
}

class OpenAiChatAudioConfig {
  final String? format;
  final String? voice;

  OpenAiChatAudioConfig({
    this.format,
    this.voice
  });

  factory OpenAiChatAudioConfig.fromJson(Map<String, dynamic> json) {
    return OpenAiChatAudioConfig(
      format: json['format']?.toString(),
      voice: json['voice']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'format': format,
      'voice': voice,
    };
  }
}

class OpenAiChatCompletion {
  final List<OpenAiChatCompletionChoice>? choices;
  final int? created;
  final String? id;
  final String? model;
  final String? object;
  final String? requestId;
  final String? serviceTier;
  final String? systemFingerprint;
  final OpenAiTokenUsage? usage;

  OpenAiChatCompletion({
    this.choices,
    this.created,
    this.id,
    this.model,
    this.object,
    this.requestId,
    this.serviceTier,
    this.systemFingerprint,
    this.usage
  });

  factory OpenAiChatCompletion.fromJson(Map<String, dynamic> json) {
    return OpenAiChatCompletion(
      choices: (() {
        final list = _sdkworkAsList(json['choices']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiChatCompletionChoice.fromJson(map);
      })())
            .whereType<OpenAiChatCompletionChoice>()
            .toList();
      })(),
      created: json['created'] is int ? json['created'] : null,
      id: json['id']?.toString(),
      model: json['model']?.toString(),
      object: json['object']?.toString(),
      requestId: json['request_id']?.toString(),
      serviceTier: json['service_tier']?.toString(),
      systemFingerprint: json['system_fingerprint']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'choices': choices?.map((item) => item.toJson()).toList(),
      'created': created,
      'id': id,
      'model': model,
      'object': object,
      'request_id': requestId,
      'service_tier': serviceTier,
      'system_fingerprint': systemFingerprint,
      'usage': usage?.toJson(),
    };
  }
}

class OpenAiChatCompletionChoice {
  final String? finishReason;
  final int? index;
  final OpenAiChoiceLogprobs? logprobs;
  final OpenAiChatMessage? message;

  OpenAiChatCompletionChoice({
    this.finishReason,
    this.index,
    this.logprobs,
    this.message
  });

  factory OpenAiChatCompletionChoice.fromJson(Map<String, dynamic> json) {
    return OpenAiChatCompletionChoice(
      finishReason: json['finish_reason']?.toString(),
      index: json['index'] is int ? json['index'] : null,
      logprobs: (() {
        final map = _sdkworkAsMap(json['logprobs']);
        return map == null ? null : OpenAiChoiceLogprobs.fromJson(map);
      })(),
      message: (() {
        final map = _sdkworkAsMap(json['message']);
        return map == null ? null : OpenAiChatMessage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'finish_reason': finishReason,
      'index': index,
      'logprobs': logprobs?.toJson(),
      'message': message?.toJson(),
    };
  }
}

class OpenAiChatCompletionList {
  final List<OpenAiChatCompletion>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiChatCompletionList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiChatCompletionList.fromJson(Map<String, dynamic> json) {
    return OpenAiChatCompletionList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiChatCompletion.fromJson(map);
      })())
            .whereType<OpenAiChatCompletion>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiChatCompletionMessageList {
  final List<OpenAiChatMessage>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiChatCompletionMessageList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiChatCompletionMessageList.fromJson(Map<String, dynamic> json) {
    return OpenAiChatCompletionMessageList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiChatMessage.fromJson(map);
      })())
            .whereType<OpenAiChatMessage>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiChatCompletionRequest {
  final OpenAiChatAudioConfig? audio;
  final double? frequencyPenalty;
  final OpenAiFunctionCallChoice? functionCall;
  final List<OpenAiFunctionDefinition>? functions;
  final Map<String, double>? logitBias;
  final bool? logprobs;
  final int? maxCompletionTokens;
  final int? maxTokens;
  final List<OpenAiChatMessage>? messages;
  final Map<String, dynamic>? metadata;
  final List<String>? modalities;
  final String? model;
  final int? n;
  final bool? parallelToolCalls;
  final OpenAiPredictionConfig? prediction;
  final double? presencePenalty;
  final String? reasoningEffort;
  final OpenAiResponseFormat? responseFormat;
  final int? seed;
  final String? serviceTier;
  final dynamic stop;
  final bool? store;
  final bool? stream;
  final OpenAiStreamOptions? streamOptions;
  final double? temperature;
  final OpenAiToolChoice? toolChoice;
  final List<OpenAiTool>? tools;
  final int? topLogprobs;
  final double? topP;
  final String? user;

  OpenAiChatCompletionRequest({
    this.audio,
    this.frequencyPenalty,
    this.functionCall,
    this.functions,
    this.logitBias,
    this.logprobs,
    this.maxCompletionTokens,
    this.maxTokens,
    this.messages,
    this.metadata,
    this.modalities,
    this.model,
    this.n,
    this.parallelToolCalls,
    this.prediction,
    this.presencePenalty,
    this.reasoningEffort,
    this.responseFormat,
    this.seed,
    this.serviceTier,
    this.stop,
    this.store,
    this.stream,
    this.streamOptions,
    this.temperature,
    this.toolChoice,
    this.tools,
    this.topLogprobs,
    this.topP,
    this.user
  });

  factory OpenAiChatCompletionRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiChatCompletionRequest(
      audio: (() {
        final map = _sdkworkAsMap(json['audio']);
        return map == null ? null : OpenAiChatAudioConfig.fromJson(map);
      })(),
      frequencyPenalty: json['frequency_penalty'] is num ? json['frequency_penalty'].toDouble() : null,
      functionCall: (() {
        final map = _sdkworkAsMap(json['function_call']);
        return map == null ? null : OpenAiFunctionCallChoice.fromJson(map);
      })(),
      functions: (() {
        final list = _sdkworkAsList(json['functions']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiFunctionDefinition.fromJson(map);
      })())
            .whereType<OpenAiFunctionDefinition>()
            .toList();
      })(),
      logitBias: (() {
        final map = _sdkworkAsMap(json['logit_bias']);
        if (map == null) {
          return null;
        }
        final result = <String, double>{};
        map.forEach((key, item) {
          final deserialized = item is num ? item.toDouble() : null;
          if (deserialized is double) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      logprobs: json['logprobs'] is bool ? json['logprobs'] : null,
      maxCompletionTokens: json['max_completion_tokens'] is int ? json['max_completion_tokens'] : null,
      maxTokens: json['max_tokens'] is int ? json['max_tokens'] : null,
      messages: (() {
        final list = _sdkworkAsList(json['messages']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiChatMessage.fromJson(map);
      })())
            .whereType<OpenAiChatMessage>()
            .toList();
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
      model: json['model']?.toString(),
      n: json['n'] is int ? json['n'] : null,
      parallelToolCalls: json['parallel_tool_calls'] is bool ? json['parallel_tool_calls'] : null,
      prediction: (() {
        final map = _sdkworkAsMap(json['prediction']);
        return map == null ? null : OpenAiPredictionConfig.fromJson(map);
      })(),
      presencePenalty: json['presence_penalty'] is num ? json['presence_penalty'].toDouble() : null,
      reasoningEffort: json['reasoning_effort']?.toString(),
      responseFormat: (() {
        final map = _sdkworkAsMap(json['response_format']);
        return map == null ? null : OpenAiResponseFormat.fromJson(map);
      })(),
      seed: json['seed'] is int ? json['seed'] : null,
      serviceTier: json['service_tier']?.toString(),
      stop: json['stop']?.toString(),
      store: json['store'] is bool ? json['store'] : null,
      stream: json['stream'] is bool ? json['stream'] : null,
      streamOptions: (() {
        final map = _sdkworkAsMap(json['stream_options']);
        return map == null ? null : OpenAiStreamOptions.fromJson(map);
      })(),
      temperature: json['temperature'] is num ? json['temperature'].toDouble() : null,
      toolChoice: (() {
        final map = _sdkworkAsMap(json['tool_choice']);
        return map == null ? null : OpenAiToolChoice.fromJson(map);
      })(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiTool.fromJson(map);
      })())
            .whereType<OpenAiTool>()
            .toList();
      })(),
      topLogprobs: json['top_logprobs'] is int ? json['top_logprobs'] : null,
      topP: json['top_p'] is num ? json['top_p'].toDouble() : null,
      user: json['user']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audio': audio?.toJson(),
      'frequency_penalty': frequencyPenalty,
      'function_call': functionCall?.toJson(),
      'functions': functions?.map((item) => item.toJson()).toList(),
      'logit_bias': logitBias?.map((key, item) => MapEntry(key, item)),
      'logprobs': logprobs,
      'max_completion_tokens': maxCompletionTokens,
      'max_tokens': maxTokens,
      'messages': messages?.map((item) => item.toJson()).toList(),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'modalities': modalities?.map((item) => item).toList(),
      'model': model,
      'n': n,
      'parallel_tool_calls': parallelToolCalls,
      'prediction': prediction?.toJson(),
      'presence_penalty': presencePenalty,
      'reasoning_effort': reasoningEffort,
      'response_format': responseFormat?.toJson(),
      'seed': seed,
      'service_tier': serviceTier,
      'stop': stop,
      'store': store,
      'stream': stream,
      'stream_options': streamOptions?.toJson(),
      'temperature': temperature,
      'tool_choice': toolChoice?.toJson(),
      'tools': tools?.map((item) => item.toJson()).toList(),
      'top_logprobs': topLogprobs,
      'top_p': topP,
      'user': user,
    };
  }
}

class OpenAiChatCompletionUpdateRequest {
  final Map<String, dynamic>? metadata;

  OpenAiChatCompletionUpdateRequest({
    this.metadata
  });

  factory OpenAiChatCompletionUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiChatCompletionUpdateRequest(
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
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class OpenAiChatContentPart {
  final OpenAiChatFile? file;
  final OpenAiChatImageUrl? imageUrl;
  final OpenAiChatInputAudio? inputAudio;
  final String? text;
  final String? type;

  OpenAiChatContentPart({
    this.file,
    this.imageUrl,
    this.inputAudio,
    this.text,
    this.type
  });

  factory OpenAiChatContentPart.fromJson(Map<String, dynamic> json) {
    return OpenAiChatContentPart(
      file: (() {
        final map = _sdkworkAsMap(json['file']);
        return map == null ? null : OpenAiChatFile.fromJson(map);
      })(),
      imageUrl: (() {
        final map = _sdkworkAsMap(json['image_url']);
        return map == null ? null : OpenAiChatImageUrl.fromJson(map);
      })(),
      inputAudio: (() {
        final map = _sdkworkAsMap(json['input_audio']);
        return map == null ? null : OpenAiChatInputAudio.fromJson(map);
      })(),
      text: json['text']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file?.toJson(),
      'image_url': imageUrl?.toJson(),
      'input_audio': inputAudio?.toJson(),
      'text': text,
      'type': type,
    };
  }
}

class OpenAiChatFile {
  final String? fileData;
  final String? fileId;
  final String? filename;

  OpenAiChatFile({
    this.fileData,
    this.fileId,
    this.filename
  });

  factory OpenAiChatFile.fromJson(Map<String, dynamic> json) {
    return OpenAiChatFile(
      fileData: json['file_data']?.toString(),
      fileId: json['file_id']?.toString(),
      filename: json['filename']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file_data': fileData,
      'file_id': fileId,
      'filename': filename,
    };
  }
}

class OpenAiChatImageUrl {
  final String? detail;
  final String? url;

  OpenAiChatImageUrl({
    this.detail,
    this.url
  });

  factory OpenAiChatImageUrl.fromJson(Map<String, dynamic> json) {
    return OpenAiChatImageUrl(
      detail: json['detail']?.toString(),
      url: json['url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'detail': detail,
      'url': url,
    };
  }
}

class OpenAiChatInputAudio {
  final String? data;
  final String? format;

  OpenAiChatInputAudio({
    this.data,
    this.format
  });

  factory OpenAiChatInputAudio.fromJson(Map<String, dynamic> json) {
    return OpenAiChatInputAudio(
      data: json['data']?.toString(),
      format: json['format']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data,
      'format': format,
    };
  }
}

class OpenAiChatMessage {
  final dynamic content;
  final OpenAiFunctionCall? functionCall;
  final String? name;
  final String? refusal;
  final String? role;
  final String? toolCallId;
  final List<OpenAiToolCall>? toolCalls;

  OpenAiChatMessage({
    this.content,
    this.functionCall,
    this.name,
    this.refusal,
    this.role,
    this.toolCallId,
    this.toolCalls
  });

  factory OpenAiChatMessage.fromJson(Map<String, dynamic> json) {
    return OpenAiChatMessage(
      content: json['content']?.toString(),
      functionCall: (() {
        final map = _sdkworkAsMap(json['function_call']);
        return map == null ? null : OpenAiFunctionCall.fromJson(map);
      })(),
      name: json['name']?.toString(),
      refusal: json['refusal']?.toString(),
      role: json['role']?.toString(),
      toolCallId: json['tool_call_id']?.toString(),
      toolCalls: (() {
        final list = _sdkworkAsList(json['tool_calls']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiToolCall.fromJson(map);
      })())
            .whereType<OpenAiToolCall>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'function_call': functionCall?.toJson(),
      'name': name,
      'refusal': refusal,
      'role': role,
      'tool_call_id': toolCallId,
      'tool_calls': toolCalls?.map((item) => item.toJson()).toList(),
    };
  }
}

class OpenAiChoiceLogprobs {
  final List<OpenAiTokenLogprob>? content;
  final List<OpenAiTokenLogprob>? refusal;

  OpenAiChoiceLogprobs({
    this.content,
    this.refusal
  });

  factory OpenAiChoiceLogprobs.fromJson(Map<String, dynamic> json) {
    return OpenAiChoiceLogprobs(
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiTokenLogprob.fromJson(map);
      })())
            .whereType<OpenAiTokenLogprob>()
            .toList();
      })(),
      refusal: (() {
        final list = _sdkworkAsList(json['refusal']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiTokenLogprob.fromJson(map);
      })())
            .whereType<OpenAiTokenLogprob>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content?.map((item) => item.toJson()).toList(),
      'refusal': refusal?.map((item) => item.toJson()).toList(),
    };
  }
}

class OpenAiCompletion {
  final List<CreateCompletionChoice>? choices;
  final int? created;
  final String? id;
  final String? model;
  final String? object;
  final String? systemFingerprint;
  final OpenAiTokenUsage? usage;

  OpenAiCompletion({
    this.choices,
    this.created,
    this.id,
    this.model,
    this.object,
    this.systemFingerprint,
    this.usage
  });

  factory OpenAiCompletion.fromJson(Map<String, dynamic> json) {
    return OpenAiCompletion(
      choices: (() {
        final list = _sdkworkAsList(json['choices']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CreateCompletionChoice.fromJson(map);
      })())
            .whereType<CreateCompletionChoice>()
            .toList();
      })(),
      created: json['created'] is int ? json['created'] : null,
      id: json['id']?.toString(),
      model: json['model']?.toString(),
      object: json['object']?.toString(),
      systemFingerprint: json['system_fingerprint']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'choices': choices?.map((item) => item.toJson()).toList(),
      'created': created,
      'id': id,
      'model': model,
      'object': object,
      'system_fingerprint': systemFingerprint,
      'usage': usage?.toJson(),
    };
  }
}

class OpenAiCompletionCreateRequest {
  final int? bestOf;
  final bool? echo;
  final double? frequencyPenalty;
  final Map<String, double>? logitBias;
  final int? logprobs;
  final int? maxTokens;
  final String? model;
  final int? n;
  final double? presencePenalty;
  final dynamic prompt;
  final int? seed;
  final dynamic stop;
  final bool? stream;
  final String? suffix;
  final double? temperature;
  final double? topP;
  final String? user;

  OpenAiCompletionCreateRequest({
    this.bestOf,
    this.echo,
    this.frequencyPenalty,
    this.logitBias,
    this.logprobs,
    this.maxTokens,
    this.model,
    this.n,
    this.presencePenalty,
    this.prompt,
    this.seed,
    this.stop,
    this.stream,
    this.suffix,
    this.temperature,
    this.topP,
    this.user
  });

  factory OpenAiCompletionCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiCompletionCreateRequest(
      bestOf: json['best_of'] is int ? json['best_of'] : null,
      echo: json['echo'] is bool ? json['echo'] : null,
      frequencyPenalty: json['frequency_penalty'] is num ? json['frequency_penalty'].toDouble() : null,
      logitBias: (() {
        final map = _sdkworkAsMap(json['logit_bias']);
        if (map == null) {
          return null;
        }
        final result = <String, double>{};
        map.forEach((key, item) {
          final deserialized = item is num ? item.toDouble() : null;
          if (deserialized is double) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      logprobs: json['logprobs'] is int ? json['logprobs'] : null,
      maxTokens: json['max_tokens'] is int ? json['max_tokens'] : null,
      model: json['model']?.toString(),
      n: json['n'] is int ? json['n'] : null,
      presencePenalty: json['presence_penalty'] is num ? json['presence_penalty'].toDouble() : null,
      prompt: json['prompt']?.toString(),
      seed: json['seed'] is int ? json['seed'] : null,
      stop: json['stop']?.toString(),
      stream: json['stream'] is bool ? json['stream'] : null,
      suffix: json['suffix']?.toString(),
      temperature: json['temperature'] is num ? json['temperature'].toDouble() : null,
      topP: json['top_p'] is num ? json['top_p'].toDouble() : null,
      user: json['user']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'best_of': bestOf,
      'echo': echo,
      'frequency_penalty': frequencyPenalty,
      'logit_bias': logitBias?.map((key, item) => MapEntry(key, item)),
      'logprobs': logprobs,
      'max_tokens': maxTokens,
      'model': model,
      'n': n,
      'presence_penalty': presencePenalty,
      'prompt': prompt,
      'seed': seed,
      'stop': stop,
      'stream': stream,
      'suffix': suffix,
      'temperature': temperature,
      'top_p': topP,
      'user': user,
    };
  }
}

class OpenAiCompletionTokensDetails {
  final int? acceptedPredictionTokens;
  final int? audioTokens;
  final int? reasoningTokens;
  final int? rejectedPredictionTokens;

  OpenAiCompletionTokensDetails({
    this.acceptedPredictionTokens,
    this.audioTokens,
    this.reasoningTokens,
    this.rejectedPredictionTokens
  });

  factory OpenAiCompletionTokensDetails.fromJson(Map<String, dynamic> json) {
    return OpenAiCompletionTokensDetails(
      acceptedPredictionTokens: json['accepted_prediction_tokens'] is int ? json['accepted_prediction_tokens'] : null,
      audioTokens: json['audio_tokens'] is int ? json['audio_tokens'] : null,
      reasoningTokens: json['reasoning_tokens'] is int ? json['reasoning_tokens'] : null,
      rejectedPredictionTokens: json['rejected_prediction_tokens'] is int ? json['rejected_prediction_tokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'accepted_prediction_tokens': acceptedPredictionTokens,
      'audio_tokens': audioTokens,
      'reasoning_tokens': reasoningTokens,
      'rejected_prediction_tokens': rejectedPredictionTokens,
    };
  }
}

class OpenAiContainer {
  final int? createdAt;
  final int? expiresAt;
  final String? id;
  final int? lastActiveAt;
  final String? memoryLimit;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;

  OpenAiContainer({
    this.createdAt,
    this.expiresAt,
    this.id,
    this.lastActiveAt,
    this.memoryLimit,
    this.metadata,
    this.name,
    this.object,
    this.status
  });

  factory OpenAiContainer.fromJson(Map<String, dynamic> json) {
    return OpenAiContainer(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      expiresAt: json['expires_at'] is int ? json['expires_at'] : null,
      id: json['id']?.toString(),
      lastActiveAt: json['last_active_at'] is int ? json['last_active_at'] : null,
      memoryLimit: json['memory_limit']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'expires_at': expiresAt,
      'id': id,
      'last_active_at': lastActiveAt,
      'memory_limit': memoryLimit,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
    };
  }
}

class OpenAiContainerCreateRequest {
  final List<String>? fileIds;
  final String? memoryLimit;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiContainerCreateRequest({
    this.fileIds,
    this.memoryLimit,
    this.metadata,
    this.name
  });

  factory OpenAiContainerCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiContainerCreateRequest(
      fileIds: (() {
        final list = _sdkworkAsList(json['file_ids']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      memoryLimit: json['memory_limit']?.toString(),
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file_ids': fileIds?.map((item) => item).toList(),
      'memory_limit': memoryLimit,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiContainerFile {
  final int? bytes;
  final String? containerId;
  final int? createdAt;
  final String? filename;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? object;
  final String? path;
  final String? purpose;

  OpenAiContainerFile({
    this.bytes,
    this.containerId,
    this.createdAt,
    this.filename,
    this.id,
    this.metadata,
    this.object,
    this.path,
    this.purpose
  });

  factory OpenAiContainerFile.fromJson(Map<String, dynamic> json) {
    return OpenAiContainerFile(
      bytes: json['bytes'] is int ? json['bytes'] : null,
      containerId: json['container_id']?.toString(),
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      filename: json['filename']?.toString(),
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      path: json['path']?.toString(),
      purpose: json['purpose']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bytes': bytes,
      'container_id': containerId,
      'created_at': createdAt,
      'filename': filename,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'path': path,
      'purpose': purpose,
    };
  }
}

class OpenAiContainerFileCreateMultipartRequest {
  final String? file;
  final String? metadata;
  final String? purpose;

  OpenAiContainerFileCreateMultipartRequest({
    this.file,
    this.metadata,
    this.purpose
  });

  factory OpenAiContainerFileCreateMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiContainerFileCreateMultipartRequest(
      file: json['file']?.toString(),
      metadata: json['metadata']?.toString(),
      purpose: json['purpose']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
      'metadata': metadata,
      'purpose': purpose,
    };
  }
}

class OpenAiContainerFileList {
  final List<OpenAiContainerFile>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiContainerFileList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiContainerFileList.fromJson(Map<String, dynamic> json) {
    return OpenAiContainerFileList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiContainerFile.fromJson(map);
      })())
            .whereType<OpenAiContainerFile>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiContainerList {
  final List<OpenAiContainer>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiContainerList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiContainerList.fromJson(Map<String, dynamic> json) {
    return OpenAiContainerList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiContainer.fromJson(map);
      })())
            .whereType<OpenAiContainer>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiConversation {
  final int? createdAt;
  final String? id;
  final Map<String, String>? metadata;
  final String? object;

  OpenAiConversation({
    this.createdAt,
    this.id,
    this.metadata,
    this.object
  });

  factory OpenAiConversation.fromJson(Map<String, dynamic> json) {
    return OpenAiConversation(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
    };
  }
}

class OpenAiConversationContentPart {
  final String? fileId;
  final String? imageUrl;
  final String? text;
  final String? type;

  OpenAiConversationContentPart({
    this.fileId,
    this.imageUrl,
    this.text,
    this.type
  });

  factory OpenAiConversationContentPart.fromJson(Map<String, dynamic> json) {
    return OpenAiConversationContentPart(
      fileId: json['file_id']?.toString(),
      imageUrl: json['image_url']?.toString(),
      text: json['text']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file_id': fileId,
      'image_url': imageUrl,
      'text': text,
      'type': type,
    };
  }
}

class OpenAiConversationCreateRequest {
  final List<OpenAiConversationItemCreateRequest>? items;
  final Map<String, String>? metadata;

  OpenAiConversationCreateRequest({
    this.items,
    this.metadata
  });

  factory OpenAiConversationCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiConversationCreateRequest(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiConversationItemCreateRequest.fromJson(map);
      })())
            .whereType<OpenAiConversationItemCreateRequest>()
            .toList();
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
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item.toJson()).toList(),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class OpenAiConversationItem {
  final List<OpenAiConversationContentPart>? content;
  final int? createdAt;
  final String? id;
  final Map<String, String>? metadata;
  final String? object;
  final String? role;
  final String? status;
  final String? type;

  OpenAiConversationItem({
    this.content,
    this.createdAt,
    this.id,
    this.metadata,
    this.object,
    this.role,
    this.status,
    this.type
  });

  factory OpenAiConversationItem.fromJson(Map<String, dynamic> json) {
    return OpenAiConversationItem(
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiConversationContentPart.fromJson(map);
      })())
            .whereType<OpenAiConversationContentPart>()
            .toList();
      })(),
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content?.map((item) => item.toJson()).toList(),
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'role': role,
      'status': status,
      'type': type,
    };
  }
}

class OpenAiConversationItemCreateRequest {
  final List<OpenAiConversationContentPart>? content;
  final Map<String, String>? metadata;
  final String? role;
  final String? type;

  OpenAiConversationItemCreateRequest({
    this.content,
    this.metadata,
    this.role,
    this.type
  });

  factory OpenAiConversationItemCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiConversationItemCreateRequest(
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiConversationContentPart.fromJson(map);
      })())
            .whereType<OpenAiConversationContentPart>()
            .toList();
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
      role: json['role']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content?.map((item) => item.toJson()).toList(),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'role': role,
      'type': type,
    };
  }
}

class OpenAiConversationItemList {
  final List<OpenAiConversationItem>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiConversationItemList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiConversationItemList.fromJson(Map<String, dynamic> json) {
    return OpenAiConversationItemList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiConversationItem.fromJson(map);
      })())
            .whereType<OpenAiConversationItem>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiConversationList {
  final List<OpenAiConversation>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiConversationList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiConversationList.fromJson(Map<String, dynamic> json) {
    return OpenAiConversationList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiConversation.fromJson(map);
      })())
            .whereType<OpenAiConversation>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiConversationReference {
  final String? id;

  OpenAiConversationReference({
    this.id
  });

  factory OpenAiConversationReference.fromJson(Map<String, dynamic> json) {
    return OpenAiConversationReference(
      id: json['id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
    };
  }
}

class OpenAiConversationUpdateRequest {
  final Map<String, String>? metadata;

  OpenAiConversationUpdateRequest({
    this.metadata
  });

  factory OpenAiConversationUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiConversationUpdateRequest(
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
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class OpenAiEmbedding {
  final dynamic embedding;
  final int? index;
  final String? object;

  OpenAiEmbedding({
    this.embedding,
    this.index,
    this.object
  });

  factory OpenAiEmbedding.fromJson(Map<String, dynamic> json) {
    return OpenAiEmbedding(
      embedding: (() {
        final list = _sdkworkAsList(json['embedding']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item is num ? item.toDouble() : null)
            .whereType<double>()
            .toList();
      })(),
      index: json['index'] is int ? json['index'] : null,
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'embedding': embedding?.map((item) => item).toList(),
      'index': index,
      'object': object,
    };
  }
}

class OpenAiEmbeddingList {
  final List<OpenAiEmbedding>? data;
  final String? model;
  final String? object;
  final OpenAiEmbeddingUsage? usage;

  OpenAiEmbeddingList({
    this.data,
    this.model,
    this.object,
    this.usage
  });

  factory OpenAiEmbeddingList.fromJson(Map<String, dynamic> json) {
    return OpenAiEmbeddingList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiEmbedding.fromJson(map);
      })())
            .whereType<OpenAiEmbedding>()
            .toList();
      })(),
      model: json['model']?.toString(),
      object: json['object']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiEmbeddingUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'model': model,
      'object': object,
      'usage': usage?.toJson(),
    };
  }
}

class OpenAiEmbeddingUsage {
  final int? promptTokens;
  final int? totalTokens;

  OpenAiEmbeddingUsage({
    this.promptTokens,
    this.totalTokens
  });

  factory OpenAiEmbeddingUsage.fromJson(Map<String, dynamic> json) {
    return OpenAiEmbeddingUsage(
      promptTokens: json['prompt_tokens'] is int ? json['prompt_tokens'] : null,
      totalTokens: json['total_tokens'] is int ? json['total_tokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'prompt_tokens': promptTokens,
      'total_tokens': totalTokens,
    };
  }
}

class OpenAiEmbeddingsRequest {
  final int? dimensions;
  final String? encodingFormat;
  final dynamic input;
  final String? model;
  final String? user;

  OpenAiEmbeddingsRequest({
    this.dimensions,
    this.encodingFormat,
    this.input,
    this.model,
    this.user
  });

  factory OpenAiEmbeddingsRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiEmbeddingsRequest(
      dimensions: json['dimensions'] is int ? json['dimensions'] : null,
      encodingFormat: json['encoding_format']?.toString(),
      input: json['input']?.toString(),
      model: json['model']?.toString(),
      user: json['user']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'dimensions': dimensions,
      'encoding_format': encodingFormat,
      'input': input,
      'model': model,
      'user': user,
    };
  }
}

class OpenAiError {
  final String? code;
  final String? message;
  final String? param;
  final String? path;
  final String? type;

  OpenAiError({
    this.code,
    this.message,
    this.param,
    this.path,
    this.type
  });

  factory OpenAiError.fromJson(Map<String, dynamic> json) {
    return OpenAiError(
      code: json['code']?.toString(),
      message: json['message']?.toString(),
      param: json['param']?.toString(),
      path: json['path']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'message': message,
      'param': param,
      'path': path,
      'type': type,
    };
  }
}

class OpenAiErrorEnvelope {
  final OpenAiError? error;

  OpenAiErrorEnvelope({
    this.error
  });

  factory OpenAiErrorEnvelope.fromJson(Map<String, dynamic> json) {
    return OpenAiErrorEnvelope(
      error: (() {
        final map = _sdkworkAsMap(json['error']);
        return map == null ? null : OpenAiError.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'error': error?.toJson(),
    };
  }
}

class OpenAiEval {
  final int? createdAt;
  final dynamic dataSourceConfig;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final List<dynamic>? testingCriteria;

  OpenAiEval({
    this.createdAt,
    this.dataSourceConfig,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.testingCriteria
  });

  factory OpenAiEval.fromJson(Map<String, dynamic> json) {
    return OpenAiEval(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      dataSourceConfig: json['data_source_config']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      testingCriteria: (() {
        final list = _sdkworkAsList(json['testing_criteria']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'data_source_config': dataSourceConfig,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'testing_criteria': testingCriteria?.map((item) => item).toList(),
    };
  }
}

class OpenAiEvalCreateRequest {
  final dynamic dataSource;
  final dynamic dataSourceConfig;
  final Map<String, dynamic>? metadata;
  final String? name;
  final List<dynamic>? testingCriteria;

  OpenAiEvalCreateRequest({
    this.dataSource,
    this.dataSourceConfig,
    this.metadata,
    this.name,
    this.testingCriteria
  });

  factory OpenAiEvalCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiEvalCreateRequest(
      dataSource: json['data_source']?.toString(),
      dataSourceConfig: json['data_source_config']?.toString(),
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
      name: json['name']?.toString(),
      testingCriteria: (() {
        final list = _sdkworkAsList(json['testing_criteria']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data_source': dataSource,
      'data_source_config': dataSourceConfig,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'testing_criteria': testingCriteria?.map((item) => item).toList(),
    };
  }
}

class OpenAiEvalList {
  final List<OpenAiEval>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiEvalList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiEvalList.fromJson(Map<String, dynamic> json) {
    return OpenAiEvalList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiEval.fromJson(map);
      })())
            .whereType<OpenAiEval>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiEvalRun {
  final int? createdAt;
  final dynamic dataSource;
  final String? evalId;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? reportUrl;
  final OpenAiEvalRunResultCounts? resultCounts;
  final String? status;

  OpenAiEvalRun({
    this.createdAt,
    this.dataSource,
    this.evalId,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.reportUrl,
    this.resultCounts,
    this.status
  });

  factory OpenAiEvalRun.fromJson(Map<String, dynamic> json) {
    return OpenAiEvalRun(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      dataSource: json['data_source']?.toString(),
      evalId: json['eval_id']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      reportUrl: json['report_url']?.toString(),
      resultCounts: (() {
        final map = _sdkworkAsMap(json['result_counts']);
        return map == null ? null : OpenAiEvalRunResultCounts.fromJson(map);
      })(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'data_source': dataSource,
      'eval_id': evalId,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'report_url': reportUrl,
      'result_counts': resultCounts?.toJson(),
      'status': status,
    };
  }
}

class OpenAiEvalRunCreateRequest {
  final dynamic dataSource;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiEvalRunCreateRequest({
    this.dataSource,
    this.metadata,
    this.name
  });

  factory OpenAiEvalRunCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiEvalRunCreateRequest(
      dataSource: json['data_source']?.toString(),
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data_source': dataSource,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiEvalRunList {
  final List<OpenAiEvalRun>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiEvalRunList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiEvalRunList.fromJson(Map<String, dynamic> json) {
    return OpenAiEvalRunList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiEvalRun.fromJson(map);
      })())
            .whereType<OpenAiEvalRun>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiEvalRunOutputItem {
  final int? createdAt;
  final String? evalId;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? object;
  final List<dynamic>? results;
  final String? runId;
  final dynamic sample;
  final String? status;

  OpenAiEvalRunOutputItem({
    this.createdAt,
    this.evalId,
    this.id,
    this.metadata,
    this.object,
    this.results,
    this.runId,
    this.sample,
    this.status
  });

  factory OpenAiEvalRunOutputItem.fromJson(Map<String, dynamic> json) {
    return OpenAiEvalRunOutputItem(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      evalId: json['eval_id']?.toString(),
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      results: (() {
        final list = _sdkworkAsList(json['results']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      runId: json['run_id']?.toString(),
      sample: json['sample']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'eval_id': evalId,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'results': results?.map((item) => item).toList(),
      'run_id': runId,
      'sample': sample,
      'status': status,
    };
  }
}

class OpenAiEvalRunOutputItemList {
  final List<OpenAiEvalRunOutputItem>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiEvalRunOutputItemList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiEvalRunOutputItemList.fromJson(Map<String, dynamic> json) {
    return OpenAiEvalRunOutputItemList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiEvalRunOutputItem.fromJson(map);
      })())
            .whereType<OpenAiEvalRunOutputItem>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiEvalRunResultCounts {
  final int? errored;
  final int? failed;
  final int? passed;
  final int? total;

  OpenAiEvalRunResultCounts({
    this.errored,
    this.failed,
    this.passed,
    this.total
  });

  factory OpenAiEvalRunResultCounts.fromJson(Map<String, dynamic> json) {
    return OpenAiEvalRunResultCounts(
      errored: json['errored'] is int ? json['errored'] : null,
      failed: json['failed'] is int ? json['failed'] : null,
      passed: json['passed'] is int ? json['passed'] : null,
      total: json['total'] is int ? json['total'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'errored': errored,
      'failed': failed,
      'passed': passed,
      'total': total,
    };
  }
}

class OpenAiEvalUpdateRequest {
  final dynamic dataSource;
  final dynamic dataSourceConfig;
  final Map<String, dynamic>? metadata;
  final String? name;
  final List<dynamic>? testingCriteria;

  OpenAiEvalUpdateRequest({
    this.dataSource,
    this.dataSourceConfig,
    this.metadata,
    this.name,
    this.testingCriteria
  });

  factory OpenAiEvalUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiEvalUpdateRequest(
      dataSource: json['data_source']?.toString(),
      dataSourceConfig: json['data_source_config']?.toString(),
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
      name: json['name']?.toString(),
      testingCriteria: (() {
        final list = _sdkworkAsList(json['testing_criteria']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data_source': dataSource,
      'data_source_config': dataSourceConfig,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'testing_criteria': testingCriteria?.map((item) => item).toList(),
    };
  }
}

class OpenAiFile {
  final int? bytes;
  final int? createdAt;
  final String? filename;
  final String? id;
  final String? object;
  final String? purpose;
  final String? status;
  final dynamic statusDetails;

  OpenAiFile({
    this.bytes,
    this.createdAt,
    this.filename,
    this.id,
    this.object,
    this.purpose,
    this.status,
    this.statusDetails
  });

  factory OpenAiFile.fromJson(Map<String, dynamic> json) {
    return OpenAiFile(
      bytes: json['bytes'] is int ? json['bytes'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      filename: json['filename']?.toString(),
      id: json['id']?.toString(),
      object: json['object']?.toString(),
      purpose: json['purpose']?.toString(),
      status: json['status']?.toString(),
      statusDetails: json['status_details']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bytes': bytes,
      'created_at': createdAt,
      'filename': filename,
      'id': id,
      'object': object,
      'purpose': purpose,
      'status': status,
      'status_details': statusDetails,
    };
  }
}

class OpenAiFileList {
  final List<OpenAiFile>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiFileList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiFileList.fromJson(Map<String, dynamic> json) {
    return OpenAiFileList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiFile.fromJson(map);
      })())
            .whereType<OpenAiFile>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiFileReferenceInput {


  OpenAiFileReferenceInput();

  factory OpenAiFileReferenceInput.fromJson(Map<String, dynamic> json) {
    return OpenAiFileReferenceInput();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class OpenAiFileReferenceObject {
  final String? fileData;
  final String? fileId;
  final String? filename;
  final String? mimeType;
  final String? url;

  OpenAiFileReferenceObject({
    this.fileData,
    this.fileId,
    this.filename,
    this.mimeType,
    this.url
  });

  factory OpenAiFileReferenceObject.fromJson(Map<String, dynamic> json) {
    return OpenAiFileReferenceObject(
      fileData: json['file_data']?.toString(),
      fileId: json['file_id']?.toString(),
      filename: json['filename']?.toString(),
      mimeType: json['mime_type']?.toString(),
      url: json['url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file_data': fileData,
      'file_id': fileId,
      'filename': filename,
      'mime_type': mimeType,
      'url': url,
    };
  }
}

class OpenAiFileUploadRequest {
  final String? file;
  final String? purpose;

  OpenAiFileUploadRequest({
    this.file,
    this.purpose
  });

  factory OpenAiFileUploadRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiFileUploadRequest(
      file: json['file']?.toString(),
      purpose: json['purpose']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
      'purpose': purpose,
    };
  }
}

class OpenAiFineTuningCheckpointPermission {
  final int? createdAt;
  final String? id;
  final String? object;
  final String? projectId;

  OpenAiFineTuningCheckpointPermission({
    this.createdAt,
    this.id,
    this.object,
    this.projectId
  });

  factory OpenAiFineTuningCheckpointPermission.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningCheckpointPermission(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'id': id,
      'object': object,
      'project_id': projectId,
    };
  }
}

class OpenAiFineTuningCheckpointPermissionCreateRequest {
  final String? projectId;

  OpenAiFineTuningCheckpointPermissionCreateRequest({
    this.projectId
  });

  factory OpenAiFineTuningCheckpointPermissionCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningCheckpointPermissionCreateRequest(
      projectId: json['project_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'project_id': projectId,
    };
  }
}

class OpenAiFineTuningCheckpointPermissionList {
  final List<OpenAiFineTuningCheckpointPermission>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiFineTuningCheckpointPermissionList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiFineTuningCheckpointPermissionList.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningCheckpointPermissionList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiFineTuningCheckpointPermission.fromJson(map);
      })())
            .whereType<OpenAiFineTuningCheckpointPermission>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiFineTuningGraderRunRequest {
  final dynamic grader;
  final dynamic input;
  final String? modelSample;
  final String? referenceAnswer;

  OpenAiFineTuningGraderRunRequest({
    this.grader,
    this.input,
    this.modelSample,
    this.referenceAnswer
  });

  factory OpenAiFineTuningGraderRunRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningGraderRunRequest(
      grader: json['grader']?.toString(),
      input: json['input']?.toString(),
      modelSample: json['model_sample']?.toString(),
      referenceAnswer: json['reference_answer']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'grader': grader,
      'input': input,
      'model_sample': modelSample,
      'reference_answer': referenceAnswer,
    };
  }
}

class OpenAiFineTuningGraderRunResult {
  final dynamic details;
  final String? feedback;
  final bool? passed;
  final double? score;

  OpenAiFineTuningGraderRunResult({
    this.details,
    this.feedback,
    this.passed,
    this.score
  });

  factory OpenAiFineTuningGraderRunResult.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningGraderRunResult(
      details: json['details']?.toString(),
      feedback: json['feedback']?.toString(),
      passed: json['passed'] is bool ? json['passed'] : null,
      score: json['score'] is num ? json['score'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'details': details,
      'feedback': feedback,
      'passed': passed,
      'score': score,
    };
  }
}

class OpenAiFineTuningGraderValidateRequest {
  final dynamic grader;

  OpenAiFineTuningGraderValidateRequest({
    this.grader
  });

  factory OpenAiFineTuningGraderValidateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningGraderValidateRequest(
      grader: json['grader']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'grader': grader,
    };
  }
}

class OpenAiFineTuningGraderValidationResult {
  final List<dynamic>? errors;
  final bool? valid;
  final List<dynamic>? warnings;

  OpenAiFineTuningGraderValidationResult({
    this.errors,
    this.valid,
    this.warnings
  });

  factory OpenAiFineTuningGraderValidationResult.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningGraderValidationResult(
      errors: (() {
        final list = _sdkworkAsList(json['errors']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      valid: json['valid'] is bool ? json['valid'] : null,
      warnings: (() {
        final list = _sdkworkAsList(json['warnings']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'errors': errors?.map((item) => item).toList(),
      'valid': valid,
      'warnings': warnings?.map((item) => item).toList(),
    };
  }
}

class OpenAiFineTuningJob {
  final int? createdAt;
  final dynamic error;
  final String? fineTunedModel;
  final int? finishedAt;
  final dynamic hyperparameters;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final String? organizationId;
  final List<String>? resultFiles;
  final String? status;
  final int? trainedTokens;
  final String? trainingFile;
  final String? validationFile;

  OpenAiFineTuningJob({
    this.createdAt,
    this.error,
    this.fineTunedModel,
    this.finishedAt,
    this.hyperparameters,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.organizationId,
    this.resultFiles,
    this.status,
    this.trainedTokens,
    this.trainingFile,
    this.validationFile
  });

  factory OpenAiFineTuningJob.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningJob(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      error: json['error']?.toString(),
      fineTunedModel: json['fine_tuned_model']?.toString(),
      finishedAt: json['finished_at'] is int ? json['finished_at'] : null,
      hyperparameters: json['hyperparameters']?.toString(),
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      organizationId: json['organization_id']?.toString(),
      resultFiles: (() {
        final list = _sdkworkAsList(json['result_files']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      status: json['status']?.toString(),
      trainedTokens: json['trained_tokens'] is int ? json['trained_tokens'] : null,
      trainingFile: json['training_file']?.toString(),
      validationFile: json['validation_file']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'error': error,
      'fine_tuned_model': fineTunedModel,
      'finished_at': finishedAt,
      'hyperparameters': hyperparameters,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'organization_id': organizationId,
      'result_files': resultFiles?.map((item) => item).toList(),
      'status': status,
      'trained_tokens': trainedTokens,
      'training_file': trainingFile,
      'validation_file': validationFile,
    };
  }
}

class OpenAiFineTuningJobCheckpoint {
  final int? createdAt;
  final String? fineTunedModelCheckpoint;
  final String? fineTuningJobId;
  final String? id;
  final dynamic metrics;
  final String? object;
  final int? stepNumber;

  OpenAiFineTuningJobCheckpoint({
    this.createdAt,
    this.fineTunedModelCheckpoint,
    this.fineTuningJobId,
    this.id,
    this.metrics,
    this.object,
    this.stepNumber
  });

  factory OpenAiFineTuningJobCheckpoint.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningJobCheckpoint(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      fineTunedModelCheckpoint: json['fine_tuned_model_checkpoint']?.toString(),
      fineTuningJobId: json['fine_tuning_job_id']?.toString(),
      id: json['id']?.toString(),
      metrics: json['metrics']?.toString(),
      object: json['object']?.toString(),
      stepNumber: json['step_number'] is int ? json['step_number'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'fine_tuned_model_checkpoint': fineTunedModelCheckpoint,
      'fine_tuning_job_id': fineTuningJobId,
      'id': id,
      'metrics': metrics,
      'object': object,
      'step_number': stepNumber,
    };
  }
}

class OpenAiFineTuningJobCheckpointList {
  final List<OpenAiFineTuningJobCheckpoint>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiFineTuningJobCheckpointList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiFineTuningJobCheckpointList.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningJobCheckpointList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiFineTuningJobCheckpoint.fromJson(map);
      })())
            .whereType<OpenAiFineTuningJobCheckpoint>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiFineTuningJobCreateRequest {
  final dynamic hyperparameters;
  final List<dynamic>? integrations;
  final Map<String, dynamic>? metadata;
  final String? model;
  final int? seed;
  final String? suffix;
  final String? trainingFile;
  final String? validationFile;

  OpenAiFineTuningJobCreateRequest({
    this.hyperparameters,
    this.integrations,
    this.metadata,
    this.model,
    this.seed,
    this.suffix,
    this.trainingFile,
    this.validationFile
  });

  factory OpenAiFineTuningJobCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningJobCreateRequest(
      hyperparameters: json['hyperparameters']?.toString(),
      integrations: (() {
        final list = _sdkworkAsList(json['integrations']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
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
      seed: json['seed'] is int ? json['seed'] : null,
      suffix: json['suffix']?.toString(),
      trainingFile: json['training_file']?.toString(),
      validationFile: json['validation_file']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'hyperparameters': hyperparameters,
      'integrations': integrations?.map((item) => item).toList(),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'seed': seed,
      'suffix': suffix,
      'training_file': trainingFile,
      'validation_file': validationFile,
    };
  }
}

class OpenAiFineTuningJobEvent {
  final int? createdAt;
  final dynamic data;
  final String? id;
  final String? level;
  final String? message;
  final String? object;
  final String? type;

  OpenAiFineTuningJobEvent({
    this.createdAt,
    this.data,
    this.id,
    this.level,
    this.message,
    this.object,
    this.type
  });

  factory OpenAiFineTuningJobEvent.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningJobEvent(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      data: json['data']?.toString(),
      id: json['id']?.toString(),
      level: json['level']?.toString(),
      message: json['message']?.toString(),
      object: json['object']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'data': data,
      'id': id,
      'level': level,
      'message': message,
      'object': object,
      'type': type,
    };
  }
}

class OpenAiFineTuningJobEventList {
  final List<OpenAiFineTuningJobEvent>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiFineTuningJobEventList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiFineTuningJobEventList.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningJobEventList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiFineTuningJobEvent.fromJson(map);
      })())
            .whereType<OpenAiFineTuningJobEvent>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiFineTuningJobList {
  final List<OpenAiFineTuningJob>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiFineTuningJobList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiFineTuningJobList.fromJson(Map<String, dynamic> json) {
    return OpenAiFineTuningJobList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiFineTuningJob.fromJson(map);
      })())
            .whereType<OpenAiFineTuningJob>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiFunctionCall {
  final String? arguments;
  final String? name;

  OpenAiFunctionCall({
    this.arguments,
    this.name
  });

  factory OpenAiFunctionCall.fromJson(Map<String, dynamic> json) {
    return OpenAiFunctionCall(
      arguments: json['arguments']?.toString(),
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'arguments': arguments,
      'name': name,
    };
  }
}

class OpenAiFunctionCallChoice {


  OpenAiFunctionCallChoice();

  factory OpenAiFunctionCallChoice.fromJson(Map<String, dynamic> json) {
    return OpenAiFunctionCallChoice();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class OpenAiFunctionDefinition {
  final String? description;
  final String? name;
  final OpenAiJsonSchema? parameters;
  final bool? strict;

  OpenAiFunctionDefinition({
    this.description,
    this.name,
    this.parameters,
    this.strict
  });

  factory OpenAiFunctionDefinition.fromJson(Map<String, dynamic> json) {
    return OpenAiFunctionDefinition(
      description: json['description']?.toString(),
      name: json['name']?.toString(),
      parameters: (() {
        final map = _sdkworkAsMap(json['parameters']);
        return map == null ? null : OpenAiJsonSchema.fromJson(map);
      })(),
      strict: json['strict'] is bool ? json['strict'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'name': name,
      'parameters': parameters?.toJson(),
      'strict': strict,
    };
  }
}

class OpenAiImage {
  final String? b64Json;
  final String? mimeType;
  final String? revisedPrompt;
  final String? url;

  OpenAiImage({
    this.b64Json,
    this.mimeType,
    this.revisedPrompt,
    this.url
  });

  factory OpenAiImage.fromJson(Map<String, dynamic> json) {
    return OpenAiImage(
      b64Json: json['b64_json']?.toString(),
      mimeType: json['mime_type']?.toString(),
      revisedPrompt: json['revised_prompt']?.toString(),
      url: json['url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'b64_json': b64Json,
      'mime_type': mimeType,
      'revised_prompt': revisedPrompt,
      'url': url,
    };
  }
}

class OpenAiImageEditMultipartRequest {
  final String? image;
  final String? mask;
  final String? model;
  final String? prompt;

  OpenAiImageEditMultipartRequest({
    this.image,
    this.mask,
    this.model,
    this.prompt
  });

  factory OpenAiImageEditMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiImageEditMultipartRequest(
      image: json['image']?.toString(),
      mask: json['mask']?.toString(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'image': image,
      'mask': mask,
      'model': model,
      'prompt': prompt,
    };
  }
}

class OpenAiImageEditRequest {
  final OpenAiImageReferenceInputList? image;
  final OpenAiImageReferenceInput? mask;
  final String? model;
  final String? prompt;

  OpenAiImageEditRequest({
    this.image,
    this.mask,
    this.model,
    this.prompt
  });

  factory OpenAiImageEditRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiImageEditRequest(
      image: (() {
        final map = _sdkworkAsMap(json['image']);
        return map == null ? null : OpenAiImageReferenceInputList.fromJson(map);
      })(),
      mask: (() {
        final map = _sdkworkAsMap(json['mask']);
        return map == null ? null : OpenAiImageReferenceInput.fromJson(map);
      })(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'image': image?.toJson(),
      'mask': mask?.toJson(),
      'model': model,
      'prompt': prompt,
    };
  }
}

class OpenAiImageGenerationRequest {
  final String? model;
  final String? prompt;
  final String? quality;
  final String? responseFormat;
  final String? size;

  OpenAiImageGenerationRequest({
    this.model,
    this.prompt,
    this.quality,
    this.responseFormat,
    this.size
  });

  factory OpenAiImageGenerationRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiImageGenerationRequest(
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      quality: json['quality']?.toString(),
      responseFormat: json['response_format']?.toString(),
      size: json['size']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'model': model,
      'prompt': prompt,
      'quality': quality,
      'response_format': responseFormat,
      'size': size,
    };
  }
}

class OpenAiImageList {
  final int? created;
  final List<OpenAiImage>? data;
  final OpenAiTokenUsage? usage;

  OpenAiImageList({
    this.created,
    this.data,
    this.usage
  });

  factory OpenAiImageList.fromJson(Map<String, dynamic> json) {
    return OpenAiImageList(
      created: json['created'] is int ? json['created'] : null,
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiImage.fromJson(map);
      })())
            .whereType<OpenAiImage>()
            .toList();
      })(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'data': data?.map((item) => item.toJson()).toList(),
      'usage': usage?.toJson(),
    };
  }
}

class OpenAiImageReferenceInput {


  OpenAiImageReferenceInput();

  factory OpenAiImageReferenceInput.fromJson(Map<String, dynamic> json) {
    return OpenAiImageReferenceInput();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class OpenAiImageReferenceInputList {


  OpenAiImageReferenceInputList();

  factory OpenAiImageReferenceInputList.fromJson(Map<String, dynamic> json) {
    return OpenAiImageReferenceInputList();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class OpenAiImageReferenceObject {
  final String? b64Json;
  final String? detail;
  final String? fileId;
  final String? mimeType;
  final String? url;

  OpenAiImageReferenceObject({
    this.b64Json,
    this.detail,
    this.fileId,
    this.mimeType,
    this.url
  });

  factory OpenAiImageReferenceObject.fromJson(Map<String, dynamic> json) {
    return OpenAiImageReferenceObject(
      b64Json: json['b64_json']?.toString(),
      detail: json['detail']?.toString(),
      fileId: json['file_id']?.toString(),
      mimeType: json['mime_type']?.toString(),
      url: json['url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'b64_json': b64Json,
      'detail': detail,
      'file_id': fileId,
      'mime_type': mimeType,
      'url': url,
    };
  }
}

class OpenAiImageVariationMultipartRequest {
  final String? image;
  final String? model;
  final String? size;

  OpenAiImageVariationMultipartRequest({
    this.image,
    this.model,
    this.size
  });

  factory OpenAiImageVariationMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiImageVariationMultipartRequest(
      image: json['image']?.toString(),
      model: json['model']?.toString(),
      size: json['size']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'image': image,
      'model': model,
      'size': size,
    };
  }
}

class OpenAiImageVariationRequest {
  final OpenAiImageReferenceInput? image;
  final String? model;
  final String? size;

  OpenAiImageVariationRequest({
    this.image,
    this.model,
    this.size
  });

  factory OpenAiImageVariationRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiImageVariationRequest(
      image: (() {
        final map = _sdkworkAsMap(json['image']);
        return map == null ? null : OpenAiImageReferenceInput.fromJson(map);
      })(),
      model: json['model']?.toString(),
      size: json['size']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'image': image?.toJson(),
      'model': model,
      'size': size,
    };
  }
}

class OpenAiIncompleteDetails {
  final String? reason;

  OpenAiIncompleteDetails({
    this.reason
  });

  factory OpenAiIncompleteDetails.fromJson(Map<String, dynamic> json) {
    return OpenAiIncompleteDetails(
      reason: json['reason']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'reason': reason,
    };
  }
}

class OpenAiJsonSchema {
  final bool? additionalProperties;
  final String? description;
  final List<dynamic>? enum_;
  final dynamic items;
  final Map<String, dynamic>? properties;
  final List<String>? required_;
  final String? type;

  OpenAiJsonSchema({
    this.additionalProperties,
    this.description,
    this.enum_,
    this.items,
    this.properties,
    this.required_,
    this.type
  });

  factory OpenAiJsonSchema.fromJson(Map<String, dynamic> json) {
    return OpenAiJsonSchema(
      additionalProperties: json['additionalProperties'] is bool ? json['additionalProperties'] : null,
      description: json['description']?.toString(),
      enum_: (() {
        final list = _sdkworkAsList(json['enum']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      items: json['items'],
      properties: (() {
        final map = _sdkworkAsMap(json['properties']);
        if (map == null) {
          return null;
        }
        final result = <String, dynamic>{};
        map.forEach((key, item) {
          final deserialized = item;
          result[key] = deserialized;
        });
        return result;
      })(),
      required_: (() {
        final list = _sdkworkAsList(json['required']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'additionalProperties': additionalProperties,
      'description': description,
      'enum': enum_?.map((item) => item).toList(),
      'items': items,
      'properties': properties?.map((key, item) => MapEntry(key, item)),
      'required': required_?.map((item) => item).toList(),
      'type': type,
    };
  }
}

class OpenAiJsonSchemaFormat {
  final String? description;
  final String? name;
  final OpenAiJsonSchema? schema;
  final bool? strict;

  OpenAiJsonSchemaFormat({
    this.description,
    this.name,
    this.schema,
    this.strict
  });

  factory OpenAiJsonSchemaFormat.fromJson(Map<String, dynamic> json) {
    return OpenAiJsonSchemaFormat(
      description: json['description']?.toString(),
      name: json['name']?.toString(),
      schema: (() {
        final map = _sdkworkAsMap(json['schema']);
        return map == null ? null : OpenAiJsonSchema.fromJson(map);
      })(),
      strict: json['strict'] is bool ? json['strict'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'name': name,
      'schema': schema?.toJson(),
      'strict': strict,
    };
  }
}

class OpenAiModel {
  final int? created;
  final String? id;
  final String? object;
  final String? ownedBy;

  OpenAiModel({
    this.created,
    this.id,
    this.object,
    this.ownedBy
  });

  factory OpenAiModel.fromJson(Map<String, dynamic> json) {
    return OpenAiModel(
      created: json['created'] is int ? json['created'] : null,
      id: json['id']?.toString(),
      object: json['object']?.toString(),
      ownedBy: json['owned_by']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'id': id,
      'object': object,
      'owned_by': ownedBy,
    };
  }
}

class OpenAiModelList {
  final List<OpenAiModel>? data;
  final String? object;

  OpenAiModelList({
    this.data,
    this.object
  });

  factory OpenAiModelList.fromJson(Map<String, dynamic> json) {
    return OpenAiModelList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiModel.fromJson(map);
      })())
            .whereType<OpenAiModel>()
            .toList();
      })(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'object': object,
    };
  }
}

class OpenAiModeration {
  final String? id;
  final String? model;
  final List<OpenAiModerationResult>? results;

  OpenAiModeration({
    this.id,
    this.model,
    this.results
  });

  factory OpenAiModeration.fromJson(Map<String, dynamic> json) {
    return OpenAiModeration(
      id: json['id']?.toString(),
      model: json['model']?.toString(),
      results: (() {
        final list = _sdkworkAsList(json['results']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiModerationResult.fromJson(map);
      })())
            .whereType<OpenAiModerationResult>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'model': model,
      'results': results?.map((item) => item.toJson()).toList(),
    };
  }
}

class OpenAiModerationCreateRequest {
  final dynamic input;
  final String? model;

  OpenAiModerationCreateRequest({
    this.input,
    this.model
  });

  factory OpenAiModerationCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiModerationCreateRequest(
      input: json['input']?.toString(),
      model: json['model']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'input': input,
      'model': model,
    };
  }
}

class OpenAiModerationResult {
  final Map<String, dynamic>? categories;
  final Map<String, double>? categoryScores;
  final bool? flagged;

  OpenAiModerationResult({
    this.categories,
    this.categoryScores,
    this.flagged
  });

  factory OpenAiModerationResult.fromJson(Map<String, dynamic> json) {
    return OpenAiModerationResult(
      categories: (() {
        final map = _sdkworkAsMap(json['categories']);
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
      categoryScores: (() {
        final map = _sdkworkAsMap(json['category_scores']);
        if (map == null) {
          return null;
        }
        final result = <String, double>{};
        map.forEach((key, item) {
          final deserialized = item is num ? item.toDouble() : null;
          if (deserialized is double) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      flagged: json['flagged'] is bool ? json['flagged'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'categories': categories?.map((key, item) => MapEntry(key, item)),
      'category_scores': categoryScores?.map((key, item) => MapEntry(key, item)),
      'flagged': flagged,
    };
  }
}

class OpenAiNamedFunctionChoice {
  final String? name;

  OpenAiNamedFunctionChoice({
    this.name
  });

  factory OpenAiNamedFunctionChoice.fromJson(Map<String, dynamic> json) {
    return OpenAiNamedFunctionChoice(
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'name': name,
    };
  }
}

class OpenAiNamedToolChoice {
  final OpenAiNamedToolChoiceFunction? function_;
  final String? type;

  OpenAiNamedToolChoice({
    this.function_,
    this.type
  });

  factory OpenAiNamedToolChoice.fromJson(Map<String, dynamic> json) {
    return OpenAiNamedToolChoice(
      function_: (() {
        final map = _sdkworkAsMap(json['function']);
        return map == null ? null : OpenAiNamedToolChoiceFunction.fromJson(map);
      })(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'function': function_?.toJson(),
      'type': type,
    };
  }
}

class OpenAiNamedToolChoiceFunction {
  final String? name;

  OpenAiNamedToolChoiceFunction({
    this.name
  });

  factory OpenAiNamedToolChoiceFunction.fromJson(Map<String, dynamic> json) {
    return OpenAiNamedToolChoiceFunction(
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'name': name,
    };
  }
}

class OpenAiOrganizationAdminApiKey {
  final int? createdAt;
  final String? id;
  final int? lastUsedAt;
  final String? name;
  final String? object;
  final dynamic owner;
  final String? redactedValue;
  final String? value;

  OpenAiOrganizationAdminApiKey({
    this.createdAt,
    this.id,
    this.lastUsedAt,
    this.name,
    this.object,
    this.owner,
    this.redactedValue,
    this.value
  });

  factory OpenAiOrganizationAdminApiKey.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationAdminApiKey(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
      lastUsedAt: json['last_used_at'] is int ? json['last_used_at'] : null,
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      owner: json['owner']?.toString(),
      redactedValue: json['redacted_value']?.toString(),
      value: json['value']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'id': id,
      'last_used_at': lastUsedAt,
      'name': name,
      'object': object,
      'owner': owner,
      'redacted_value': redactedValue,
      'value': value,
    };
  }
}

class OpenAiOrganizationAdminApiKeyCreateRequest {
  final String? name;

  OpenAiOrganizationAdminApiKeyCreateRequest({
    this.name
  });

  factory OpenAiOrganizationAdminApiKeyCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationAdminApiKeyCreateRequest(
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'name': name,
    };
  }
}

class OpenAiOrganizationAdminApiKeyList {
  final List<OpenAiOrganizationAdminApiKey>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiOrganizationAdminApiKeyList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiOrganizationAdminApiKeyList.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationAdminApiKeyList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiOrganizationAdminApiKey.fromJson(map);
      })())
            .whereType<OpenAiOrganizationAdminApiKey>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiOrganizationAuditLog {
  final dynamic actor;
  final String? apiKeyId;
  final int? effectiveAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? object;
  final dynamic project;
  final dynamic request;
  final String? type;

  OpenAiOrganizationAuditLog({
    this.actor,
    this.apiKeyId,
    this.effectiveAt,
    this.id,
    this.metadata,
    this.object,
    this.project,
    this.request,
    this.type
  });

  factory OpenAiOrganizationAuditLog.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationAuditLog(
      actor: json['actor']?.toString(),
      apiKeyId: json['api_key_id']?.toString(),
      effectiveAt: json['effective_at'] is int ? json['effective_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      project: json['project']?.toString(),
      request: json['request']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'actor': actor,
      'api_key_id': apiKeyId,
      'effective_at': effectiveAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'project': project,
      'request': request,
      'type': type,
    };
  }
}

class OpenAiOrganizationAuditLogList {
  final List<OpenAiOrganizationAuditLog>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiOrganizationAuditLogList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiOrganizationAuditLogList.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationAuditLogList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiOrganizationAuditLog.fromJson(map);
      })())
            .whereType<OpenAiOrganizationAuditLog>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiOrganizationCostBucket {
  final double? amount;
  final String? currency;
  final int? endTime;
  final String? object;
  final List<dynamic>? results;
  final int? startTime;

  OpenAiOrganizationCostBucket({
    this.amount,
    this.currency,
    this.endTime,
    this.object,
    this.results,
    this.startTime
  });

  factory OpenAiOrganizationCostBucket.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationCostBucket(
      amount: json['amount'] is num ? json['amount'].toDouble() : null,
      currency: json['currency']?.toString(),
      endTime: json['end_time'] is int ? json['end_time'] : null,
      object: json['object']?.toString(),
      results: (() {
        final list = _sdkworkAsList(json['results']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      startTime: json['start_time'] is int ? json['start_time'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'currency': currency,
      'end_time': endTime,
      'object': object,
      'results': results?.map((item) => item).toList(),
      'start_time': startTime,
    };
  }
}

class OpenAiOrganizationCostList {
  final List<OpenAiOrganizationCostBucket>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiOrganizationCostList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiOrganizationCostList.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationCostList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiOrganizationCostBucket.fromJson(map);
      })())
            .whereType<OpenAiOrganizationCostBucket>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiOrganizationGroup {
  final int? createdAt;
  final String? description;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;

  OpenAiOrganizationGroup({
    this.createdAt,
    this.description,
    this.id,
    this.metadata,
    this.name,
    this.object
  });

  factory OpenAiOrganizationGroup.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationGroup(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      description: json['description']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'description': description,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
    };
  }
}

class OpenAiOrganizationGroupCreateRequest {
  final String? description;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiOrganizationGroupCreateRequest({
    this.description,
    this.metadata,
    this.name
  });

  factory OpenAiOrganizationGroupCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationGroupCreateRequest(
      description: json['description']?.toString(),
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiOrganizationGroupList {
  final List<OpenAiOrganizationGroup>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiOrganizationGroupList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiOrganizationGroupList.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationGroupList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiOrganizationGroup.fromJson(map);
      })())
            .whereType<OpenAiOrganizationGroup>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiOrganizationGroupUpdateRequest {
  final String? description;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiOrganizationGroupUpdateRequest({
    this.description,
    this.metadata,
    this.name
  });

  factory OpenAiOrganizationGroupUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationGroupUpdateRequest(
      description: json['description']?.toString(),
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiOrganizationGroupUserCreateRequest {
  final String? userId;

  OpenAiOrganizationGroupUserCreateRequest({
    this.userId
  });

  factory OpenAiOrganizationGroupUserCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationGroupUserCreateRequest(
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'user_id': userId,
    };
  }
}

class OpenAiOrganizationInvite {
  final int? createdAt;
  final String? email;
  final int? expiresAt;
  final String? id;
  final String? object;
  final List<dynamic>? projects;
  final String? role;
  final String? status;

  OpenAiOrganizationInvite({
    this.createdAt,
    this.email,
    this.expiresAt,
    this.id,
    this.object,
    this.projects,
    this.role,
    this.status
  });

  factory OpenAiOrganizationInvite.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationInvite(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      expiresAt: json['expires_at'] is int ? json['expires_at'] : null,
      id: json['id']?.toString(),
      object: json['object']?.toString(),
      projects: (() {
        final list = _sdkworkAsList(json['projects']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'email': email,
      'expires_at': expiresAt,
      'id': id,
      'object': object,
      'projects': projects?.map((item) => item).toList(),
      'role': role,
      'status': status,
    };
  }
}

class OpenAiOrganizationInviteCreateRequest {
  final String? email;
  final List<dynamic>? projects;
  final String? role;

  OpenAiOrganizationInviteCreateRequest({
    this.email,
    this.projects,
    this.role
  });

  factory OpenAiOrganizationInviteCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationInviteCreateRequest(
      email: json['email']?.toString(),
      projects: (() {
        final list = _sdkworkAsList(json['projects']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      role: json['role']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'email': email,
      'projects': projects?.map((item) => item).toList(),
      'role': role,
    };
  }
}

class OpenAiOrganizationInviteList {
  final List<OpenAiOrganizationInvite>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiOrganizationInviteList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiOrganizationInviteList.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationInviteList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiOrganizationInvite.fromJson(map);
      })())
            .whereType<OpenAiOrganizationInvite>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiOrganizationUsageBucket {
  final int? endTime;
  final int? inputTokens;
  final int? numRequests;
  final String? object;
  final int? outputTokens;
  final List<dynamic>? results;
  final int? startTime;

  OpenAiOrganizationUsageBucket({
    this.endTime,
    this.inputTokens,
    this.numRequests,
    this.object,
    this.outputTokens,
    this.results,
    this.startTime
  });

  factory OpenAiOrganizationUsageBucket.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationUsageBucket(
      endTime: json['end_time'] is int ? json['end_time'] : null,
      inputTokens: json['input_tokens'] is int ? json['input_tokens'] : null,
      numRequests: json['num_requests'] is int ? json['num_requests'] : null,
      object: json['object']?.toString(),
      outputTokens: json['output_tokens'] is int ? json['output_tokens'] : null,
      results: (() {
        final list = _sdkworkAsList(json['results']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      startTime: json['start_time'] is int ? json['start_time'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'end_time': endTime,
      'input_tokens': inputTokens,
      'num_requests': numRequests,
      'object': object,
      'output_tokens': outputTokens,
      'results': results?.map((item) => item).toList(),
      'start_time': startTime,
    };
  }
}

class OpenAiOrganizationUsageList {
  final List<OpenAiOrganizationUsageBucket>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiOrganizationUsageList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiOrganizationUsageList.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationUsageList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiOrganizationUsageBucket.fromJson(map);
      })())
            .whereType<OpenAiOrganizationUsageBucket>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiOrganizationUser {
  final int? createdAt;
  final String? email;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? role;
  final String? status;

  OpenAiOrganizationUser({
    this.createdAt,
    this.email,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.role,
    this.status
  });

  factory OpenAiOrganizationUser.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationUser(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'email': email,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'role': role,
      'status': status,
    };
  }
}

class OpenAiOrganizationUserList {
  final List<OpenAiOrganizationUser>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiOrganizationUserList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiOrganizationUserList.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationUserList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiOrganizationUser.fromJson(map);
      })())
            .whereType<OpenAiOrganizationUser>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiOrganizationUserUpdateRequest {
  final Map<String, dynamic>? metadata;
  final String? role;

  OpenAiOrganizationUserUpdateRequest({
    this.metadata,
    this.role
  });

  factory OpenAiOrganizationUserUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiOrganizationUserUpdateRequest(
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
      role: json['role']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'role': role,
    };
  }
}

class OpenAiPredictionConfig {
  final dynamic content;
  final String? type;

  OpenAiPredictionConfig({
    this.content,
    this.type
  });

  factory OpenAiPredictionConfig.fromJson(Map<String, dynamic> json) {
    return OpenAiPredictionConfig(
      content: json['content']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'type': type,
    };
  }
}

class OpenAiProject {
  final int? archivedAt;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;

  OpenAiProject({
    this.archivedAt,
    this.createdAt,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.status
  });

  factory OpenAiProject.fromJson(Map<String, dynamic> json) {
    return OpenAiProject(
      archivedAt: json['archived_at'] is int ? json['archived_at'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'archived_at': archivedAt,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
    };
  }
}

class OpenAiProjectApiKey {
  final int? createdAt;
  final String? id;
  final int? lastUsedAt;
  final String? name;
  final String? object;
  final dynamic owner;
  final String? redactedValue;

  OpenAiProjectApiKey({
    this.createdAt,
    this.id,
    this.lastUsedAt,
    this.name,
    this.object,
    this.owner,
    this.redactedValue
  });

  factory OpenAiProjectApiKey.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectApiKey(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
      lastUsedAt: json['last_used_at'] is int ? json['last_used_at'] : null,
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      owner: json['owner']?.toString(),
      redactedValue: json['redacted_value']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'id': id,
      'last_used_at': lastUsedAt,
      'name': name,
      'object': object,
      'owner': owner,
      'redacted_value': redactedValue,
    };
  }
}

class OpenAiProjectApiKeyList {
  final List<OpenAiProjectApiKey>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiProjectApiKeyList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiProjectApiKeyList.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectApiKeyList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiProjectApiKey.fromJson(map);
      })())
            .whereType<OpenAiProjectApiKey>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiProjectCreateRequest {
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiProjectCreateRequest({
    this.metadata,
    this.name
  });

  factory OpenAiProjectCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectCreateRequest(
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiProjectGroupCreateRequest {
  final String? groupId;

  OpenAiProjectGroupCreateRequest({
    this.groupId
  });

  factory OpenAiProjectGroupCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectGroupCreateRequest(
      groupId: json['group_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'group_id': groupId,
    };
  }
}

class OpenAiProjectList {
  final List<OpenAiProject>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiProjectList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiProjectList.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiProject.fromJson(map);
      })())
            .whereType<OpenAiProject>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiProjectRateLimit {
  final int? batch1DayMaxInputTokens;
  final String? id;
  final int? maxImagesPer1Minute;
  final int? maxRequestsPer1Minute;
  final int? maxTokensPer1Minute;
  final String? model;
  final String? object;

  OpenAiProjectRateLimit({
    this.batch1DayMaxInputTokens,
    this.id,
    this.maxImagesPer1Minute,
    this.maxRequestsPer1Minute,
    this.maxTokensPer1Minute,
    this.model,
    this.object
  });

  factory OpenAiProjectRateLimit.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectRateLimit(
      batch1DayMaxInputTokens: json['batch_1_day_max_input_tokens'] is int ? json['batch_1_day_max_input_tokens'] : null,
      id: json['id']?.toString(),
      maxImagesPer1Minute: json['max_images_per_1_minute'] is int ? json['max_images_per_1_minute'] : null,
      maxRequestsPer1Minute: json['max_requests_per_1_minute'] is int ? json['max_requests_per_1_minute'] : null,
      maxTokensPer1Minute: json['max_tokens_per_1_minute'] is int ? json['max_tokens_per_1_minute'] : null,
      model: json['model']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'batch_1_day_max_input_tokens': batch1DayMaxInputTokens,
      'id': id,
      'max_images_per_1_minute': maxImagesPer1Minute,
      'max_requests_per_1_minute': maxRequestsPer1Minute,
      'max_tokens_per_1_minute': maxTokensPer1Minute,
      'model': model,
      'object': object,
    };
  }
}

class OpenAiProjectRateLimitList {
  final List<OpenAiProjectRateLimit>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiProjectRateLimitList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiProjectRateLimitList.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectRateLimitList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiProjectRateLimit.fromJson(map);
      })())
            .whereType<OpenAiProjectRateLimit>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiProjectRateLimitUpdateRequest {
  final int? batch1DayMaxInputTokens;
  final int? maxImagesPer1Minute;
  final int? maxRequestsPer1Minute;
  final int? maxTokensPer1Minute;

  OpenAiProjectRateLimitUpdateRequest({
    this.batch1DayMaxInputTokens,
    this.maxImagesPer1Minute,
    this.maxRequestsPer1Minute,
    this.maxTokensPer1Minute
  });

  factory OpenAiProjectRateLimitUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectRateLimitUpdateRequest(
      batch1DayMaxInputTokens: json['batch_1_day_max_input_tokens'] is int ? json['batch_1_day_max_input_tokens'] : null,
      maxImagesPer1Minute: json['max_images_per_1_minute'] is int ? json['max_images_per_1_minute'] : null,
      maxRequestsPer1Minute: json['max_requests_per_1_minute'] is int ? json['max_requests_per_1_minute'] : null,
      maxTokensPer1Minute: json['max_tokens_per_1_minute'] is int ? json['max_tokens_per_1_minute'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'batch_1_day_max_input_tokens': batch1DayMaxInputTokens,
      'max_images_per_1_minute': maxImagesPer1Minute,
      'max_requests_per_1_minute': maxRequestsPer1Minute,
      'max_tokens_per_1_minute': maxTokensPer1Minute,
    };
  }
}

class OpenAiProjectServiceAccount {
  final OpenAiProjectApiKey? apiKey;
  final int? createdAt;
  final String? id;
  final String? name;
  final String? object;
  final String? role;

  OpenAiProjectServiceAccount({
    this.apiKey,
    this.createdAt,
    this.id,
    this.name,
    this.object,
    this.role
  });

  factory OpenAiProjectServiceAccount.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectServiceAccount(
      apiKey: (() {
        final map = _sdkworkAsMap(json['api_key']);
        return map == null ? null : OpenAiProjectApiKey.fromJson(map);
      })(),
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      role: json['role']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'api_key': apiKey?.toJson(),
      'created_at': createdAt,
      'id': id,
      'name': name,
      'object': object,
      'role': role,
    };
  }
}

class OpenAiProjectServiceAccountCreateRequest {
  final String? name;
  final String? role;

  OpenAiProjectServiceAccountCreateRequest({
    this.name,
    this.role
  });

  factory OpenAiProjectServiceAccountCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectServiceAccountCreateRequest(
      name: json['name']?.toString(),
      role: json['role']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'name': name,
      'role': role,
    };
  }
}

class OpenAiProjectServiceAccountList {
  final List<OpenAiProjectServiceAccount>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiProjectServiceAccountList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiProjectServiceAccountList.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectServiceAccountList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiProjectServiceAccount.fromJson(map);
      })())
            .whereType<OpenAiProjectServiceAccount>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiProjectUpdateRequest {
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiProjectUpdateRequest({
    this.metadata,
    this.name
  });

  factory OpenAiProjectUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectUpdateRequest(
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiProjectUser {
  final int? createdAt;
  final String? email;
  final String? id;
  final String? name;
  final String? object;
  final String? role;

  OpenAiProjectUser({
    this.createdAt,
    this.email,
    this.id,
    this.name,
    this.object,
    this.role
  });

  factory OpenAiProjectUser.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectUser(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      email: json['email']?.toString(),
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      role: json['role']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'email': email,
      'id': id,
      'name': name,
      'object': object,
      'role': role,
    };
  }
}

class OpenAiProjectUserCreateRequest {
  final String? role;
  final String? userId;

  OpenAiProjectUserCreateRequest({
    this.role,
    this.userId
  });

  factory OpenAiProjectUserCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectUserCreateRequest(
      role: json['role']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'role': role,
      'user_id': userId,
    };
  }
}

class OpenAiProjectUserList {
  final List<OpenAiProjectUser>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiProjectUserList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiProjectUserList.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectUserList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiProjectUser.fromJson(map);
      })())
            .whereType<OpenAiProjectUser>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiProjectUserUpdateRequest {
  final String? role;

  OpenAiProjectUserUpdateRequest({
    this.role
  });

  factory OpenAiProjectUserUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiProjectUserUpdateRequest(
      role: json['role']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'role': role,
    };
  }
}

class OpenAiPromptReference {
  final String? id;
  final Map<String, dynamic>? variables;
  final String? version;

  OpenAiPromptReference({
    this.id,
    this.variables,
    this.version
  });

  factory OpenAiPromptReference.fromJson(Map<String, dynamic> json) {
    return OpenAiPromptReference(
      id: json['id']?.toString(),
      variables: (() {
        final map = _sdkworkAsMap(json['variables']);
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
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'variables': variables?.map((key, item) => MapEntry(key, item)),
      'version': version,
    };
  }
}

class OpenAiPromptTokensDetails {
  final int? audioTokens;
  final int? cachedTokens;

  OpenAiPromptTokensDetails({
    this.audioTokens,
    this.cachedTokens
  });

  factory OpenAiPromptTokensDetails.fromJson(Map<String, dynamic> json) {
    return OpenAiPromptTokensDetails(
      audioTokens: json['audio_tokens'] is int ? json['audio_tokens'] : null,
      cachedTokens: json['cached_tokens'] is int ? json['cached_tokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audio_tokens': audioTokens,
      'cached_tokens': cachedTokens,
    };
  }
}

class OpenAiRealtimeCall {
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? object;
  final String? sdp;
  final dynamic session;
  final String? status;

  OpenAiRealtimeCall({
    this.createdAt,
    this.id,
    this.metadata,
    this.object,
    this.sdp,
    this.session,
    this.status
  });

  factory OpenAiRealtimeCall.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeCall(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      sdp: json['sdp']?.toString(),
      session: json['session']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'sdp': sdp,
      'session': session,
      'status': status,
    };
  }
}

class OpenAiRealtimeCallActionRequest {
  final Map<String, dynamic>? metadata;

  OpenAiRealtimeCallActionRequest({
    this.metadata
  });

  factory OpenAiRealtimeCallActionRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeCallActionRequest(
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
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class OpenAiRealtimeCallCreateRequest {
  final Map<String, dynamic>? metadata;
  final String? sdp;
  final dynamic session;

  OpenAiRealtimeCallCreateRequest({
    this.metadata,
    this.sdp,
    this.session
  });

  factory OpenAiRealtimeCallCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeCallCreateRequest(
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
      sdp: json['sdp']?.toString(),
      session: json['session']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'sdp': sdp,
      'session': session,
    };
  }
}

class OpenAiRealtimeCallMultipartRequest {
  final String? sdp;
  final String? session;

  OpenAiRealtimeCallMultipartRequest({
    this.sdp,
    this.session
  });

  factory OpenAiRealtimeCallMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeCallMultipartRequest(
      sdp: json['sdp']?.toString(),
      session: json['session']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'sdp': sdp,
      'session': session,
    };
  }
}

class OpenAiRealtimeCallReferRequest {
  final Map<String, dynamic>? metadata;
  final String? target;

  OpenAiRealtimeCallReferRequest({
    this.metadata,
    this.target
  });

  factory OpenAiRealtimeCallReferRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeCallReferRequest(
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
      target: json['target']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'target': target,
    };
  }
}

class OpenAiRealtimeClientSecret {
  final OpenAiRealtimeClientSecretValue? clientSecret;
  final dynamic session;

  OpenAiRealtimeClientSecret({
    this.clientSecret,
    this.session
  });

  factory OpenAiRealtimeClientSecret.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeClientSecret(
      clientSecret: (() {
        final map = _sdkworkAsMap(json['client_secret']);
        return map == null ? null : OpenAiRealtimeClientSecretValue.fromJson(map);
      })(),
      session: json['session']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'client_secret': clientSecret?.toJson(),
      'session': session,
    };
  }
}

class OpenAiRealtimeClientSecretCreateRequest {
  final String? instructions;
  final Map<String, dynamic>? metadata;
  final List<String>? modalities;
  final String? model;
  final String? voice;

  OpenAiRealtimeClientSecretCreateRequest({
    this.instructions,
    this.metadata,
    this.modalities,
    this.model,
    this.voice
  });

  factory OpenAiRealtimeClientSecretCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeClientSecretCreateRequest(
      instructions: json['instructions']?.toString(),
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
      model: json['model']?.toString(),
      voice: json['voice']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'instructions': instructions,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'modalities': modalities?.map((item) => item).toList(),
      'model': model,
      'voice': voice,
    };
  }
}

class OpenAiRealtimeClientSecretValue {
  final int? expiresAt;
  final String? value;

  OpenAiRealtimeClientSecretValue({
    this.expiresAt,
    this.value
  });

  factory OpenAiRealtimeClientSecretValue.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeClientSecretValue(
      expiresAt: json['expires_at'] is int ? json['expires_at'] : null,
      value: json['value']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'expires_at': expiresAt,
      'value': value,
    };
  }
}

class OpenAiRealtimeSession {
  final OpenAiRealtimeClientSecretValue? clientSecret;
  final String? id;
  final String? instructions;
  final List<String>? modalities;
  final String? model;
  final String? object;
  final String? voice;

  OpenAiRealtimeSession({
    this.clientSecret,
    this.id,
    this.instructions,
    this.modalities,
    this.model,
    this.object,
    this.voice
  });

  factory OpenAiRealtimeSession.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeSession(
      clientSecret: (() {
        final map = _sdkworkAsMap(json['client_secret']);
        return map == null ? null : OpenAiRealtimeClientSecretValue.fromJson(map);
      })(),
      id: json['id']?.toString(),
      instructions: json['instructions']?.toString(),
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
      model: json['model']?.toString(),
      object: json['object']?.toString(),
      voice: json['voice']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'client_secret': clientSecret?.toJson(),
      'id': id,
      'instructions': instructions,
      'modalities': modalities?.map((item) => item).toList(),
      'model': model,
      'object': object,
      'voice': voice,
    };
  }
}

class OpenAiRealtimeSessionCreateRequest {
  final String? instructions;
  final Map<String, dynamic>? metadata;
  final List<String>? modalities;
  final String? model;
  final String? voice;

  OpenAiRealtimeSessionCreateRequest({
    this.instructions,
    this.metadata,
    this.modalities,
    this.model,
    this.voice
  });

  factory OpenAiRealtimeSessionCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeSessionCreateRequest(
      instructions: json['instructions']?.toString(),
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
      model: json['model']?.toString(),
      voice: json['voice']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'instructions': instructions,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'modalities': modalities?.map((item) => item).toList(),
      'model': model,
      'voice': voice,
    };
  }
}

class OpenAiRealtimeTranscriptionSession {
  final OpenAiRealtimeClientSecretValue? clientSecret;
  final String? id;
  final String? inputAudioFormat;
  final dynamic inputAudioTranscription;
  final String? object;

  OpenAiRealtimeTranscriptionSession({
    this.clientSecret,
    this.id,
    this.inputAudioFormat,
    this.inputAudioTranscription,
    this.object
  });

  factory OpenAiRealtimeTranscriptionSession.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeTranscriptionSession(
      clientSecret: (() {
        final map = _sdkworkAsMap(json['client_secret']);
        return map == null ? null : OpenAiRealtimeClientSecretValue.fromJson(map);
      })(),
      id: json['id']?.toString(),
      inputAudioFormat: json['input_audio_format']?.toString(),
      inputAudioTranscription: json['input_audio_transcription']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'client_secret': clientSecret?.toJson(),
      'id': id,
      'input_audio_format': inputAudioFormat,
      'input_audio_transcription': inputAudioTranscription,
      'object': object,
    };
  }
}

class OpenAiRealtimeTranscriptionSessionCreateRequest {
  final String? inputAudioFormat;
  final dynamic inputAudioTranscription;
  final Map<String, dynamic>? metadata;
  final String? model;
  final dynamic turnDetection;

  OpenAiRealtimeTranscriptionSessionCreateRequest({
    this.inputAudioFormat,
    this.inputAudioTranscription,
    this.metadata,
    this.model,
    this.turnDetection
  });

  factory OpenAiRealtimeTranscriptionSessionCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeTranscriptionSessionCreateRequest(
      inputAudioFormat: json['input_audio_format']?.toString(),
      inputAudioTranscription: json['input_audio_transcription']?.toString(),
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
      turnDetection: json['turn_detection']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'input_audio_format': inputAudioFormat,
      'input_audio_transcription': inputAudioTranscription,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'turn_detection': turnDetection,
    };
  }
}

class OpenAiRealtimeTranslationSession {
  final OpenAiRealtimeClientSecretValue? clientSecret;
  final String? id;
  final String? object;
  final String? sourceLanguage;
  final String? targetLanguage;

  OpenAiRealtimeTranslationSession({
    this.clientSecret,
    this.id,
    this.object,
    this.sourceLanguage,
    this.targetLanguage
  });

  factory OpenAiRealtimeTranslationSession.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeTranslationSession(
      clientSecret: (() {
        final map = _sdkworkAsMap(json['client_secret']);
        return map == null ? null : OpenAiRealtimeClientSecretValue.fromJson(map);
      })(),
      id: json['id']?.toString(),
      object: json['object']?.toString(),
      sourceLanguage: json['source_language']?.toString(),
      targetLanguage: json['target_language']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'client_secret': clientSecret?.toJson(),
      'id': id,
      'object': object,
      'source_language': sourceLanguage,
      'target_language': targetLanguage,
    };
  }
}

class OpenAiRealtimeTranslationSessionCreateRequest {
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? sourceLanguage;
  final String? targetLanguage;

  OpenAiRealtimeTranslationSessionCreateRequest({
    this.metadata,
    this.model,
    this.sourceLanguage,
    this.targetLanguage
  });

  factory OpenAiRealtimeTranslationSessionCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRealtimeTranslationSessionCreateRequest(
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
      sourceLanguage: json['source_language']?.toString(),
      targetLanguage: json['target_language']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'source_language': sourceLanguage,
      'target_language': targetLanguage,
    };
  }
}

class OpenAiReasoningConfig {
  final String? effort;
  final String? summary;

  OpenAiReasoningConfig({
    this.effort,
    this.summary
  });

  factory OpenAiReasoningConfig.fromJson(Map<String, dynamic> json) {
    return OpenAiReasoningConfig(
      effort: json['effort']?.toString(),
      summary: json['summary']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'effort': effort,
      'summary': summary,
    };
  }
}

class OpenAiResponse {
  final int? createdAt;
  final OpenAiResponseError? error;
  final String? id;
  final OpenAiIncompleteDetails? incompleteDetails;
  final String? model;
  final String? object;
  final List<OpenAiResponseOutputItem>? output;
  final String? outputText;
  final String? status;
  final OpenAiResponseUsage? usage;

  OpenAiResponse({
    this.createdAt,
    this.error,
    this.id,
    this.incompleteDetails,
    this.model,
    this.object,
    this.output,
    this.outputText,
    this.status,
    this.usage
  });

  factory OpenAiResponse.fromJson(Map<String, dynamic> json) {
    return OpenAiResponse(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      error: (() {
        final map = _sdkworkAsMap(json['error']);
        return map == null ? null : OpenAiResponseError.fromJson(map);
      })(),
      id: json['id']?.toString(),
      incompleteDetails: (() {
        final map = _sdkworkAsMap(json['incomplete_details']);
        return map == null ? null : OpenAiIncompleteDetails.fromJson(map);
      })(),
      model: json['model']?.toString(),
      object: json['object']?.toString(),
      output: (() {
        final list = _sdkworkAsList(json['output']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiResponseOutputItem.fromJson(map);
      })())
            .whereType<OpenAiResponseOutputItem>()
            .toList();
      })(),
      outputText: json['output_text']?.toString(),
      status: json['status']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiResponseUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'error': error?.toJson(),
      'id': id,
      'incomplete_details': incompleteDetails?.toJson(),
      'model': model,
      'object': object,
      'output': output?.map((item) => item.toJson()).toList(),
      'output_text': outputText,
      'status': status,
      'usage': usage?.toJson(),
    };
  }
}

class OpenAiResponseCompactRequest {
  final dynamic input;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? previousResponseId;

  OpenAiResponseCompactRequest({
    this.input,
    this.metadata,
    this.model,
    this.previousResponseId
  });

  factory OpenAiResponseCompactRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseCompactRequest(
      input: json['input']?.toString(),
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
      previousResponseId: json['previous_response_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'input': input,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'previous_response_id': previousResponseId,
    };
  }
}

class OpenAiResponseError {
  final String? code;
  final String? message;
  final String? param;
  final String? type;

  OpenAiResponseError({
    this.code,
    this.message,
    this.param,
    this.type
  });

  factory OpenAiResponseError.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseError(
      code: json['code']?.toString(),
      message: json['message']?.toString(),
      param: json['param']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'message': message,
      'param': param,
      'type': type,
    };
  }
}

class OpenAiResponseFormat {
  final OpenAiJsonSchemaFormat? jsonSchema;
  final String? type;

  OpenAiResponseFormat({
    this.jsonSchema,
    this.type
  });

  factory OpenAiResponseFormat.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseFormat(
      jsonSchema: (() {
        final map = _sdkworkAsMap(json['json_schema']);
        return map == null ? null : OpenAiJsonSchemaFormat.fromJson(map);
      })(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'json_schema': jsonSchema?.toJson(),
      'type': type,
    };
  }
}

class OpenAiResponseInputContentPart {
  final String? detail;
  final String? fileData;
  final String? fileId;
  final String? filename;
  final String? imageUrl;
  final String? text;
  final String? type;

  OpenAiResponseInputContentPart({
    this.detail,
    this.fileData,
    this.fileId,
    this.filename,
    this.imageUrl,
    this.text,
    this.type
  });

  factory OpenAiResponseInputContentPart.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseInputContentPart(
      detail: json['detail']?.toString(),
      fileData: json['file_data']?.toString(),
      fileId: json['file_id']?.toString(),
      filename: json['filename']?.toString(),
      imageUrl: json['image_url']?.toString(),
      text: json['text']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'detail': detail,
      'file_data': fileData,
      'file_id': fileId,
      'filename': filename,
      'image_url': imageUrl,
      'text': text,
      'type': type,
    };
  }
}

class OpenAiResponseInputItem {
  final dynamic content;
  final String? id;
  final String? role;
  final String? status;
  final String? type;

  OpenAiResponseInputItem({
    this.content,
    this.id,
    this.role,
    this.status,
    this.type
  });

  factory OpenAiResponseInputItem.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseInputItem(
      content: json['content']?.toString(),
      id: json['id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'id': id,
      'role': role,
      'status': status,
      'type': type,
    };
  }
}

class OpenAiResponseInputItemList {
  final List<OpenAiResponseInputItem>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiResponseInputItemList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiResponseInputItemList.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseInputItemList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiResponseInputItem.fromJson(map);
      })())
            .whereType<OpenAiResponseInputItem>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiResponseInputTokenCount {
  final int? inputTokens;
  final OpenAiResponseInputTokensDetails? inputTokensDetails;
  final String? model;
  final String? object;

  OpenAiResponseInputTokenCount({
    this.inputTokens,
    this.inputTokensDetails,
    this.model,
    this.object
  });

  factory OpenAiResponseInputTokenCount.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseInputTokenCount(
      inputTokens: json['input_tokens'] is int ? json['input_tokens'] : null,
      inputTokensDetails: (() {
        final map = _sdkworkAsMap(json['input_tokens_details']);
        return map == null ? null : OpenAiResponseInputTokensDetails.fromJson(map);
      })(),
      model: json['model']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'input_tokens': inputTokens,
      'input_tokens_details': inputTokensDetails?.toJson(),
      'model': model,
      'object': object,
    };
  }
}

class OpenAiResponseInputTokenCountRequest {
  final dynamic input;
  final String? instructions;
  final String? model;
  final List<dynamic>? tools;

  OpenAiResponseInputTokenCountRequest({
    this.input,
    this.instructions,
    this.model,
    this.tools
  });

  factory OpenAiResponseInputTokenCountRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseInputTokenCountRequest(
      input: json['input']?.toString(),
      instructions: json['instructions']?.toString(),
      model: json['model']?.toString(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'input': input,
      'instructions': instructions,
      'model': model,
      'tools': tools?.map((item) => item).toList(),
    };
  }
}

class OpenAiResponseInputTokensDetails {
  final int? cachedTokens;

  OpenAiResponseInputTokensDetails({
    this.cachedTokens
  });

  factory OpenAiResponseInputTokensDetails.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseInputTokensDetails(
      cachedTokens: json['cached_tokens'] is int ? json['cached_tokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cached_tokens': cachedTokens,
    };
  }
}

class OpenAiResponseOutputContent {
  final List<OpenAiAnnotation>? annotations;
  final String? refusal;
  final String? text;
  final String? type;

  OpenAiResponseOutputContent({
    this.annotations,
    this.refusal,
    this.text,
    this.type
  });

  factory OpenAiResponseOutputContent.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseOutputContent(
      annotations: (() {
        final list = _sdkworkAsList(json['annotations']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiAnnotation.fromJson(map);
      })())
            .whereType<OpenAiAnnotation>()
            .toList();
      })(),
      refusal: json['refusal']?.toString(),
      text: json['text']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'annotations': annotations?.map((item) => item.toJson()).toList(),
      'refusal': refusal,
      'text': text,
      'type': type,
    };
  }
}

class OpenAiResponseOutputItem {
  final List<OpenAiResponseOutputContent>? content;
  final String? id;
  final String? role;
  final String? status;
  final String? type;

  OpenAiResponseOutputItem({
    this.content,
    this.id,
    this.role,
    this.status,
    this.type
  });

  factory OpenAiResponseOutputItem.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseOutputItem(
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiResponseOutputContent.fromJson(map);
      })())
            .whereType<OpenAiResponseOutputContent>()
            .toList();
      })(),
      id: json['id']?.toString(),
      role: json['role']?.toString(),
      status: json['status']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content?.map((item) => item.toJson()).toList(),
      'id': id,
      'role': role,
      'status': status,
      'type': type,
    };
  }
}

class OpenAiResponseOutputTokensDetails {
  final int? reasoningTokens;

  OpenAiResponseOutputTokensDetails({
    this.reasoningTokens
  });

  factory OpenAiResponseOutputTokensDetails.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseOutputTokensDetails(
      reasoningTokens: json['reasoning_tokens'] is int ? json['reasoning_tokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'reasoning_tokens': reasoningTokens,
    };
  }
}

class OpenAiResponseUsage {
  final int? inputTokens;
  final OpenAiResponseInputTokensDetails? inputTokensDetails;
  final int? outputTokens;
  final OpenAiResponseOutputTokensDetails? outputTokensDetails;
  final int? totalTokens;

  OpenAiResponseUsage({
    this.inputTokens,
    this.inputTokensDetails,
    this.outputTokens,
    this.outputTokensDetails,
    this.totalTokens
  });

  factory OpenAiResponseUsage.fromJson(Map<String, dynamic> json) {
    return OpenAiResponseUsage(
      inputTokens: json['input_tokens'] is int ? json['input_tokens'] : null,
      inputTokensDetails: (() {
        final map = _sdkworkAsMap(json['input_tokens_details']);
        return map == null ? null : OpenAiResponseInputTokensDetails.fromJson(map);
      })(),
      outputTokens: json['output_tokens'] is int ? json['output_tokens'] : null,
      outputTokensDetails: (() {
        final map = _sdkworkAsMap(json['output_tokens_details']);
        return map == null ? null : OpenAiResponseOutputTokensDetails.fromJson(map);
      })(),
      totalTokens: json['total_tokens'] is int ? json['total_tokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'input_tokens': inputTokens,
      'input_tokens_details': inputTokensDetails?.toJson(),
      'output_tokens': outputTokens,
      'output_tokens_details': outputTokensDetails?.toJson(),
      'total_tokens': totalTokens,
    };
  }
}

class OpenAiResponsesRequest {
  final bool? background;
  final dynamic conversation;
  final List<String>? include;
  final dynamic input;
  final String? instructions;
  final int? maxOutputTokens;
  final int? maxToolCalls;
  final Map<String, dynamic>? metadata;
  final String? model;
  final bool? parallelToolCalls;
  final String? previousResponseId;
  final OpenAiPromptReference? prompt;
  final String? promptCacheKey;
  final OpenAiReasoningConfig? reasoning;
  final String? serviceTier;
  final bool? store;
  final bool? stream;
  final double? temperature;
  final OpenAiTextConfig? text;
  final OpenAiToolChoice? toolChoice;
  final List<OpenAiTool>? tools;
  final int? topLogprobs;
  final double? topP;
  final String? truncation;
  final String? user;

  OpenAiResponsesRequest({
    this.background,
    this.conversation,
    this.include,
    this.input,
    this.instructions,
    this.maxOutputTokens,
    this.maxToolCalls,
    this.metadata,
    this.model,
    this.parallelToolCalls,
    this.previousResponseId,
    this.prompt,
    this.promptCacheKey,
    this.reasoning,
    this.serviceTier,
    this.store,
    this.stream,
    this.temperature,
    this.text,
    this.toolChoice,
    this.tools,
    this.topLogprobs,
    this.topP,
    this.truncation,
    this.user
  });

  factory OpenAiResponsesRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiResponsesRequest(
      background: json['background'] is bool ? json['background'] : null,
      conversation: json['conversation']?.toString(),
      include: (() {
        final list = _sdkworkAsList(json['include']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      input: json['input']?.toString(),
      instructions: json['instructions']?.toString(),
      maxOutputTokens: json['max_output_tokens'] is int ? json['max_output_tokens'] : null,
      maxToolCalls: json['max_tool_calls'] is int ? json['max_tool_calls'] : null,
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
      parallelToolCalls: json['parallel_tool_calls'] is bool ? json['parallel_tool_calls'] : null,
      previousResponseId: json['previous_response_id']?.toString(),
      prompt: (() {
        final map = _sdkworkAsMap(json['prompt']);
        return map == null ? null : OpenAiPromptReference.fromJson(map);
      })(),
      promptCacheKey: json['prompt_cache_key']?.toString(),
      reasoning: (() {
        final map = _sdkworkAsMap(json['reasoning']);
        return map == null ? null : OpenAiReasoningConfig.fromJson(map);
      })(),
      serviceTier: json['service_tier']?.toString(),
      store: json['store'] is bool ? json['store'] : null,
      stream: json['stream'] is bool ? json['stream'] : null,
      temperature: json['temperature'] is num ? json['temperature'].toDouble() : null,
      text: (() {
        final map = _sdkworkAsMap(json['text']);
        return map == null ? null : OpenAiTextConfig.fromJson(map);
      })(),
      toolChoice: (() {
        final map = _sdkworkAsMap(json['tool_choice']);
        return map == null ? null : OpenAiToolChoice.fromJson(map);
      })(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiTool.fromJson(map);
      })())
            .whereType<OpenAiTool>()
            .toList();
      })(),
      topLogprobs: json['top_logprobs'] is int ? json['top_logprobs'] : null,
      topP: json['top_p'] is num ? json['top_p'].toDouble() : null,
      truncation: json['truncation']?.toString(),
      user: json['user']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'background': background,
      'conversation': conversation,
      'include': include?.map((item) => item).toList(),
      'input': input,
      'instructions': instructions,
      'max_output_tokens': maxOutputTokens,
      'max_tool_calls': maxToolCalls,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'parallel_tool_calls': parallelToolCalls,
      'previous_response_id': previousResponseId,
      'prompt': prompt?.toJson(),
      'prompt_cache_key': promptCacheKey,
      'reasoning': reasoning?.toJson(),
      'service_tier': serviceTier,
      'store': store,
      'stream': stream,
      'temperature': temperature,
      'text': text?.toJson(),
      'tool_choice': toolChoice?.toJson(),
      'tools': tools?.map((item) => item.toJson()).toList(),
      'top_logprobs': topLogprobs,
      'top_p': topP,
      'truncation': truncation,
      'user': user,
    };
  }
}

class OpenAiRole {
  final int? createdAt;
  final String? description;
  final String? id;
  final String? name;
  final String? object;
  final List<String>? permissions;

  OpenAiRole({
    this.createdAt,
    this.description,
    this.id,
    this.name,
    this.object,
    this.permissions
  });

  factory OpenAiRole.fromJson(Map<String, dynamic> json) {
    return OpenAiRole(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      description: json['description']?.toString(),
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      permissions: (() {
        final list = _sdkworkAsList(json['permissions']);
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
      'created_at': createdAt,
      'description': description,
      'id': id,
      'name': name,
      'object': object,
      'permissions': permissions?.map((item) => item).toList(),
    };
  }
}

class OpenAiRoleAssignment {
  final int? createdAt;
  final String? groupId;
  final String? id;
  final String? object;
  final String? projectId;
  final String? roleId;
  final String? userId;

  OpenAiRoleAssignment({
    this.createdAt,
    this.groupId,
    this.id,
    this.object,
    this.projectId,
    this.roleId,
    this.userId
  });

  factory OpenAiRoleAssignment.fromJson(Map<String, dynamic> json) {
    return OpenAiRoleAssignment(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      groupId: json['group_id']?.toString(),
      id: json['id']?.toString(),
      object: json['object']?.toString(),
      projectId: json['project_id']?.toString(),
      roleId: json['role_id']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'group_id': groupId,
      'id': id,
      'object': object,
      'project_id': projectId,
      'role_id': roleId,
      'user_id': userId,
    };
  }
}

class OpenAiRoleAssignmentCreateRequest {
  final String? roleId;

  OpenAiRoleAssignmentCreateRequest({
    this.roleId
  });

  factory OpenAiRoleAssignmentCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRoleAssignmentCreateRequest(
      roleId: json['role_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'role_id': roleId,
    };
  }
}

class OpenAiRoleAssignmentList {
  final List<OpenAiRoleAssignment>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiRoleAssignmentList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiRoleAssignmentList.fromJson(Map<String, dynamic> json) {
    return OpenAiRoleAssignmentList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiRoleAssignment.fromJson(map);
      })())
            .whereType<OpenAiRoleAssignment>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiRoleCreateRequest {
  final String? description;
  final String? name;
  final List<String>? permissions;

  OpenAiRoleCreateRequest({
    this.description,
    this.name,
    this.permissions
  });

  factory OpenAiRoleCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRoleCreateRequest(
      description: json['description']?.toString(),
      name: json['name']?.toString(),
      permissions: (() {
        final list = _sdkworkAsList(json['permissions']);
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
      'description': description,
      'name': name,
      'permissions': permissions?.map((item) => item).toList(),
    };
  }
}

class OpenAiRoleList {
  final List<OpenAiRole>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiRoleList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiRoleList.fromJson(Map<String, dynamic> json) {
    return OpenAiRoleList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiRole.fromJson(map);
      })())
            .whereType<OpenAiRole>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiRoleUpdateRequest {
  final String? description;
  final String? name;
  final List<String>? permissions;

  OpenAiRoleUpdateRequest({
    this.description,
    this.name,
    this.permissions
  });

  factory OpenAiRoleUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRoleUpdateRequest(
      description: json['description']?.toString(),
      name: json['name']?.toString(),
      permissions: (() {
        final list = _sdkworkAsList(json['permissions']);
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
      'description': description,
      'name': name,
      'permissions': permissions?.map((item) => item).toList(),
    };
  }
}

class OpenAiRun {
  final String? assistantId;
  final int? cancelledAt;
  final int? completedAt;
  final int? createdAt;
  final int? expiresAt;
  final int? failedAt;
  final String? id;
  final String? instructions;
  final dynamic lastError;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final dynamic requiredAction;
  final int? startedAt;
  final String? status;
  final String? threadId;
  final List<dynamic>? tools;
  final OpenAiTokenUsage? usage;

  OpenAiRun({
    this.assistantId,
    this.cancelledAt,
    this.completedAt,
    this.createdAt,
    this.expiresAt,
    this.failedAt,
    this.id,
    this.instructions,
    this.lastError,
    this.metadata,
    this.model,
    this.object,
    this.requiredAction,
    this.startedAt,
    this.status,
    this.threadId,
    this.tools,
    this.usage
  });

  factory OpenAiRun.fromJson(Map<String, dynamic> json) {
    return OpenAiRun(
      assistantId: json['assistant_id']?.toString(),
      cancelledAt: json['cancelled_at'] is int ? json['cancelled_at'] : null,
      completedAt: json['completed_at'] is int ? json['completed_at'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      expiresAt: json['expires_at'] is int ? json['expires_at'] : null,
      failedAt: json['failed_at'] is int ? json['failed_at'] : null,
      id: json['id']?.toString(),
      instructions: json['instructions']?.toString(),
      lastError: json['last_error']?.toString(),
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
      object: json['object']?.toString(),
      requiredAction: json['required_action']?.toString(),
      startedAt: json['started_at'] is int ? json['started_at'] : null,
      status: json['status']?.toString(),
      threadId: json['thread_id']?.toString(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'assistant_id': assistantId,
      'cancelled_at': cancelledAt,
      'completed_at': completedAt,
      'created_at': createdAt,
      'expires_at': expiresAt,
      'failed_at': failedAt,
      'id': id,
      'instructions': instructions,
      'last_error': lastError,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'required_action': requiredAction,
      'started_at': startedAt,
      'status': status,
      'thread_id': threadId,
      'tools': tools?.map((item) => item).toList(),
      'usage': usage?.toJson(),
    };
  }
}

class OpenAiRunCreateRequest {
  final String? additionalInstructions;
  final String? assistantId;
  final String? instructions;
  final Map<String, dynamic>? metadata;
  final String? model;
  final bool? stream;
  final List<dynamic>? tools;

  OpenAiRunCreateRequest({
    this.additionalInstructions,
    this.assistantId,
    this.instructions,
    this.metadata,
    this.model,
    this.stream,
    this.tools
  });

  factory OpenAiRunCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRunCreateRequest(
      additionalInstructions: json['additional_instructions']?.toString(),
      assistantId: json['assistant_id']?.toString(),
      instructions: json['instructions']?.toString(),
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
      stream: json['stream'] is bool ? json['stream'] : null,
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'additional_instructions': additionalInstructions,
      'assistant_id': assistantId,
      'instructions': instructions,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'stream': stream,
      'tools': tools?.map((item) => item).toList(),
    };
  }
}

class OpenAiRunList {
  final List<OpenAiRun>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiRunList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiRunList.fromJson(Map<String, dynamic> json) {
    return OpenAiRunList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiRun.fromJson(map);
      })())
            .whereType<OpenAiRun>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiRunStep {
  final String? assistantId;
  final int? cancelledAt;
  final int? completedAt;
  final int? createdAt;
  final int? expiredAt;
  final int? failedAt;
  final String? id;
  final dynamic lastError;
  final Map<String, dynamic>? metadata;
  final String? object;
  final String? runId;
  final String? status;
  final dynamic stepDetails;
  final String? threadId;
  final String? type;
  final OpenAiTokenUsage? usage;

  OpenAiRunStep({
    this.assistantId,
    this.cancelledAt,
    this.completedAt,
    this.createdAt,
    this.expiredAt,
    this.failedAt,
    this.id,
    this.lastError,
    this.metadata,
    this.object,
    this.runId,
    this.status,
    this.stepDetails,
    this.threadId,
    this.type,
    this.usage
  });

  factory OpenAiRunStep.fromJson(Map<String, dynamic> json) {
    return OpenAiRunStep(
      assistantId: json['assistant_id']?.toString(),
      cancelledAt: json['cancelled_at'] is int ? json['cancelled_at'] : null,
      completedAt: json['completed_at'] is int ? json['completed_at'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      expiredAt: json['expired_at'] is int ? json['expired_at'] : null,
      failedAt: json['failed_at'] is int ? json['failed_at'] : null,
      id: json['id']?.toString(),
      lastError: json['last_error']?.toString(),
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
      object: json['object']?.toString(),
      runId: json['run_id']?.toString(),
      status: json['status']?.toString(),
      stepDetails: json['step_details']?.toString(),
      threadId: json['thread_id']?.toString(),
      type: json['type']?.toString(),
      usage: (() {
        final map = _sdkworkAsMap(json['usage']);
        return map == null ? null : OpenAiTokenUsage.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'assistant_id': assistantId,
      'cancelled_at': cancelledAt,
      'completed_at': completedAt,
      'created_at': createdAt,
      'expired_at': expiredAt,
      'failed_at': failedAt,
      'id': id,
      'last_error': lastError,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'run_id': runId,
      'status': status,
      'step_details': stepDetails,
      'thread_id': threadId,
      'type': type,
      'usage': usage?.toJson(),
    };
  }
}

class OpenAiRunStepList {
  final List<OpenAiRunStep>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiRunStepList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiRunStepList.fromJson(Map<String, dynamic> json) {
    return OpenAiRunStepList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiRunStep.fromJson(map);
      })())
            .whereType<OpenAiRunStep>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiRunSubmitToolOutputsRequest {
  final bool? stream;
  final List<dynamic>? toolOutputs;

  OpenAiRunSubmitToolOutputsRequest({
    this.stream,
    this.toolOutputs
  });

  factory OpenAiRunSubmitToolOutputsRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRunSubmitToolOutputsRequest(
      stream: json['stream'] is bool ? json['stream'] : null,
      toolOutputs: (() {
        final list = _sdkworkAsList(json['tool_outputs']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'stream': stream,
      'tool_outputs': toolOutputs?.map((item) => item).toList(),
    };
  }
}

class OpenAiRunUpdateRequest {
  final Map<String, dynamic>? metadata;

  OpenAiRunUpdateRequest({
    this.metadata
  });

  factory OpenAiRunUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiRunUpdateRequest(
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
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class OpenAiSkill {
  final int? createdAt;
  final String? description;
  final String? id;
  final String? latestVersion;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;
  final int? updatedAt;
  final List<OpenAiSkillVersion>? versions;

  OpenAiSkill({
    this.createdAt,
    this.description,
    this.id,
    this.latestVersion,
    this.metadata,
    this.name,
    this.object,
    this.status,
    this.updatedAt,
    this.versions
  });

  factory OpenAiSkill.fromJson(Map<String, dynamic> json) {
    return OpenAiSkill(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      description: json['description']?.toString(),
      id: json['id']?.toString(),
      latestVersion: json['latest_version']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      updatedAt: json['updated_at'] is int ? json['updated_at'] : null,
      versions: (() {
        final list = _sdkworkAsList(json['versions']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiSkillVersion.fromJson(map);
      })())
            .whereType<OpenAiSkillVersion>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'description': description,
      'id': id,
      'latest_version': latestVersion,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
      'updated_at': updatedAt,
      'versions': versions?.map((item) => item.toJson()).toList(),
    };
  }
}

class OpenAiSkillCreateMultipartRequest {
  final String? file;
  final String? metadata;
  final String? name;
  final String? package;

  OpenAiSkillCreateMultipartRequest({
    this.file,
    this.metadata,
    this.name,
    this.package
  });

  factory OpenAiSkillCreateMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiSkillCreateMultipartRequest(
      file: json['file']?.toString(),
      metadata: json['metadata']?.toString(),
      name: json['name']?.toString(),
      package: json['package']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
      'metadata': metadata,
      'name': name,
      'package': package,
    };
  }
}

class OpenAiSkillList {
  final List<OpenAiSkill>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiSkillList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiSkillList.fromJson(Map<String, dynamic> json) {
    return OpenAiSkillList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiSkill.fromJson(map);
      })())
            .whereType<OpenAiSkill>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiSkillUpdateRequest {
  final String? description;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiSkillUpdateRequest({
    this.description,
    this.metadata,
    this.name
  });

  factory OpenAiSkillUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiSkillUpdateRequest(
      description: json['description']?.toString(),
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiSkillVersion {
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? object;
  final String? packageSha256;
  final String? skillId;
  final String? status;
  final String? version;

  OpenAiSkillVersion({
    this.createdAt,
    this.id,
    this.metadata,
    this.object,
    this.packageSha256,
    this.skillId,
    this.status,
    this.version
  });

  factory OpenAiSkillVersion.fromJson(Map<String, dynamic> json) {
    return OpenAiSkillVersion(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      packageSha256: json['package_sha256']?.toString(),
      skillId: json['skill_id']?.toString(),
      status: json['status']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'package_sha256': packageSha256,
      'skill_id': skillId,
      'status': status,
      'version': version,
    };
  }
}

class OpenAiSkillVersionCreateMultipartRequest {
  final String? file;
  final String? metadata;
  final String? name;
  final String? package;

  OpenAiSkillVersionCreateMultipartRequest({
    this.file,
    this.metadata,
    this.name,
    this.package
  });

  factory OpenAiSkillVersionCreateMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiSkillVersionCreateMultipartRequest(
      file: json['file']?.toString(),
      metadata: json['metadata']?.toString(),
      name: json['name']?.toString(),
      package: json['package']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
      'metadata': metadata,
      'name': name,
      'package': package,
    };
  }
}

class OpenAiSkillVersionList {
  final List<OpenAiSkillVersion>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiSkillVersionList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiSkillVersionList.fromJson(Map<String, dynamic> json) {
    return OpenAiSkillVersionList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiSkillVersion.fromJson(map);
      })())
            .whereType<OpenAiSkillVersion>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiSpeechCreateRequest {
  final dynamic input;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? responseFormat;
  final double? speed;
  final String? voice;

  OpenAiSpeechCreateRequest({
    this.input,
    this.metadata,
    this.model,
    this.responseFormat,
    this.speed,
    this.voice
  });

  factory OpenAiSpeechCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiSpeechCreateRequest(
      input: json['input']?.toString(),
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
      responseFormat: json['response_format']?.toString(),
      speed: json['speed'] is num ? json['speed'].toDouble() : null,
      voice: json['voice']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'input': input,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'response_format': responseFormat,
      'speed': speed,
      'voice': voice,
    };
  }
}

class OpenAiStreamOptions {
  final bool? includeUsage;

  OpenAiStreamOptions({
    this.includeUsage
  });

  factory OpenAiStreamOptions.fromJson(Map<String, dynamic> json) {
    return OpenAiStreamOptions(
      includeUsage: json['include_usage'] is bool ? json['include_usage'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'include_usage': includeUsage,
    };
  }
}

class OpenAiTextConfig {
  final OpenAiResponseFormat? format;

  OpenAiTextConfig({
    this.format
  });

  factory OpenAiTextConfig.fromJson(Map<String, dynamic> json) {
    return OpenAiTextConfig(
      format: (() {
        final map = _sdkworkAsMap(json['format']);
        return map == null ? null : OpenAiResponseFormat.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'format': format?.toJson(),
    };
  }
}

class OpenAiThread {
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? object;
  final dynamic toolResources;

  OpenAiThread({
    this.createdAt,
    this.id,
    this.metadata,
    this.object,
    this.toolResources
  });

  factory OpenAiThread.fromJson(Map<String, dynamic> json) {
    return OpenAiThread(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      toolResources: json['tool_resources']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'tool_resources': toolResources,
    };
  }
}

class OpenAiThreadAndRunCreateRequest {
  final String? assistantId;
  final String? instructions;
  final Map<String, dynamic>? metadata;
  final String? model;
  final bool? stream;
  final OpenAiThreadCreateRequest? thread;
  final List<dynamic>? tools;

  OpenAiThreadAndRunCreateRequest({
    this.assistantId,
    this.instructions,
    this.metadata,
    this.model,
    this.stream,
    this.thread,
    this.tools
  });

  factory OpenAiThreadAndRunCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiThreadAndRunCreateRequest(
      assistantId: json['assistant_id']?.toString(),
      instructions: json['instructions']?.toString(),
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
      stream: json['stream'] is bool ? json['stream'] : null,
      thread: (() {
        final map = _sdkworkAsMap(json['thread']);
        return map == null ? null : OpenAiThreadCreateRequest.fromJson(map);
      })(),
      tools: (() {
        final list = _sdkworkAsList(json['tools']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'assistant_id': assistantId,
      'instructions': instructions,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'stream': stream,
      'thread': thread?.toJson(),
      'tools': tools?.map((item) => item).toList(),
    };
  }
}

class OpenAiThreadCreateRequest {
  final List<OpenAiThreadMessageCreateRequest>? messages;
  final Map<String, dynamic>? metadata;
  final dynamic toolResources;

  OpenAiThreadCreateRequest({
    this.messages,
    this.metadata,
    this.toolResources
  });

  factory OpenAiThreadCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiThreadCreateRequest(
      messages: (() {
        final list = _sdkworkAsList(json['messages']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiThreadMessageCreateRequest.fromJson(map);
      })())
            .whereType<OpenAiThreadMessageCreateRequest>()
            .toList();
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
      toolResources: json['tool_resources']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'messages': messages?.map((item) => item.toJson()).toList(),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'tool_resources': toolResources,
    };
  }
}

class OpenAiThreadMessage {
  final String? assistantId;
  final List<dynamic>? attachments;
  final int? completedAt;
  final List<dynamic>? content;
  final int? createdAt;
  final String? id;
  final int? incompleteAt;
  final dynamic incompleteDetails;
  final Map<String, dynamic>? metadata;
  final String? object;
  final String? role;
  final String? runId;
  final String? status;
  final String? threadId;

  OpenAiThreadMessage({
    this.assistantId,
    this.attachments,
    this.completedAt,
    this.content,
    this.createdAt,
    this.id,
    this.incompleteAt,
    this.incompleteDetails,
    this.metadata,
    this.object,
    this.role,
    this.runId,
    this.status,
    this.threadId
  });

  factory OpenAiThreadMessage.fromJson(Map<String, dynamic> json) {
    return OpenAiThreadMessage(
      assistantId: json['assistant_id']?.toString(),
      attachments: (() {
        final list = _sdkworkAsList(json['attachments']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      completedAt: json['completed_at'] is int ? json['completed_at'] : null,
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
      incompleteAt: json['incomplete_at'] is int ? json['incomplete_at'] : null,
      incompleteDetails: json['incomplete_details']?.toString(),
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
      object: json['object']?.toString(),
      role: json['role']?.toString(),
      runId: json['run_id']?.toString(),
      status: json['status']?.toString(),
      threadId: json['thread_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'assistant_id': assistantId,
      'attachments': attachments?.map((item) => item).toList(),
      'completed_at': completedAt,
      'content': content?.map((item) => item).toList(),
      'created_at': createdAt,
      'id': id,
      'incomplete_at': incompleteAt,
      'incomplete_details': incompleteDetails,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'object': object,
      'role': role,
      'run_id': runId,
      'status': status,
      'thread_id': threadId,
    };
  }
}

class OpenAiThreadMessageCreateRequest {
  final List<dynamic>? attachments;
  final dynamic content;
  final Map<String, dynamic>? metadata;
  final String? role;

  OpenAiThreadMessageCreateRequest({
    this.attachments,
    this.content,
    this.metadata,
    this.role
  });

  factory OpenAiThreadMessageCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiThreadMessageCreateRequest(
      attachments: (() {
        final list = _sdkworkAsList(json['attachments']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      content: json['content']?.toString(),
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
      role: json['role']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'attachments': attachments?.map((item) => item).toList(),
      'content': content,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'role': role,
    };
  }
}

class OpenAiThreadMessageList {
  final List<OpenAiThreadMessage>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiThreadMessageList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiThreadMessageList.fromJson(Map<String, dynamic> json) {
    return OpenAiThreadMessageList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiThreadMessage.fromJson(map);
      })())
            .whereType<OpenAiThreadMessage>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiThreadMessageUpdateRequest {
  final Map<String, dynamic>? metadata;

  OpenAiThreadMessageUpdateRequest({
    this.metadata
  });

  factory OpenAiThreadMessageUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiThreadMessageUpdateRequest(
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
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class OpenAiThreadUpdateRequest {
  final Map<String, dynamic>? metadata;
  final dynamic toolResources;

  OpenAiThreadUpdateRequest({
    this.metadata,
    this.toolResources
  });

  factory OpenAiThreadUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiThreadUpdateRequest(
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
      toolResources: json['tool_resources']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'tool_resources': toolResources,
    };
  }
}

class OpenAiTokenLogprob {
  final List<int>? bytes;
  final double? logprob;
  final String? token;
  final List<OpenAiTopLogprob>? topLogprobs;

  OpenAiTokenLogprob({
    this.bytes,
    this.logprob,
    this.token,
    this.topLogprobs
  });

  factory OpenAiTokenLogprob.fromJson(Map<String, dynamic> json) {
    return OpenAiTokenLogprob(
      bytes: (() {
        final list = _sdkworkAsList(json['bytes']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item is int ? item : null)
            .whereType<int>()
            .toList();
      })(),
      logprob: json['logprob'] is num ? json['logprob'].toDouble() : null,
      token: json['token']?.toString(),
      topLogprobs: (() {
        final list = _sdkworkAsList(json['top_logprobs']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiTopLogprob.fromJson(map);
      })())
            .whereType<OpenAiTopLogprob>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bytes': bytes?.map((item) => item).toList(),
      'logprob': logprob,
      'token': token,
      'top_logprobs': topLogprobs?.map((item) => item.toJson()).toList(),
    };
  }
}

class OpenAiTokenUsage {
  final int? completionTokens;
  final OpenAiCompletionTokensDetails? completionTokensDetails;
  final int? promptTokens;
  final OpenAiPromptTokensDetails? promptTokensDetails;
  final int? totalTokens;

  OpenAiTokenUsage({
    this.completionTokens,
    this.completionTokensDetails,
    this.promptTokens,
    this.promptTokensDetails,
    this.totalTokens
  });

  factory OpenAiTokenUsage.fromJson(Map<String, dynamic> json) {
    return OpenAiTokenUsage(
      completionTokens: json['completion_tokens'] is int ? json['completion_tokens'] : null,
      completionTokensDetails: (() {
        final map = _sdkworkAsMap(json['completion_tokens_details']);
        return map == null ? null : OpenAiCompletionTokensDetails.fromJson(map);
      })(),
      promptTokens: json['prompt_tokens'] is int ? json['prompt_tokens'] : null,
      promptTokensDetails: (() {
        final map = _sdkworkAsMap(json['prompt_tokens_details']);
        return map == null ? null : OpenAiPromptTokensDetails.fromJson(map);
      })(),
      totalTokens: json['total_tokens'] is int ? json['total_tokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'completion_tokens': completionTokens,
      'completion_tokens_details': completionTokensDetails?.toJson(),
      'prompt_tokens': promptTokens,
      'prompt_tokens_details': promptTokensDetails?.toJson(),
      'total_tokens': totalTokens,
    };
  }
}

class OpenAiTool {
  final OpenAiFunctionDefinition? function_;
  final String? type;

  OpenAiTool({
    this.function_,
    this.type
  });

  factory OpenAiTool.fromJson(Map<String, dynamic> json) {
    return OpenAiTool(
      function_: (() {
        final map = _sdkworkAsMap(json['function']);
        return map == null ? null : OpenAiFunctionDefinition.fromJson(map);
      })(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'function': function_?.toJson(),
      'type': type,
    };
  }
}

class OpenAiToolCall {
  final OpenAiFunctionCall? function_;
  final String? id;
  final String? type;

  OpenAiToolCall({
    this.function_,
    this.id,
    this.type
  });

  factory OpenAiToolCall.fromJson(Map<String, dynamic> json) {
    return OpenAiToolCall(
      function_: (() {
        final map = _sdkworkAsMap(json['function']);
        return map == null ? null : OpenAiFunctionCall.fromJson(map);
      })(),
      id: json['id']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'function': function_?.toJson(),
      'id': id,
      'type': type,
    };
  }
}

class OpenAiToolChoice {


  OpenAiToolChoice();

  factory OpenAiToolChoice.fromJson(Map<String, dynamic> json) {
    return OpenAiToolChoice();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class OpenAiTopLogprob {
  final List<int>? bytes;
  final double? logprob;
  final String? token;

  OpenAiTopLogprob({
    this.bytes,
    this.logprob,
    this.token
  });

  factory OpenAiTopLogprob.fromJson(Map<String, dynamic> json) {
    return OpenAiTopLogprob(
      bytes: (() {
        final list = _sdkworkAsList(json['bytes']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item is int ? item : null)
            .whereType<int>()
            .toList();
      })(),
      logprob: json['logprob'] is num ? json['logprob'].toDouble() : null,
      token: json['token']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bytes': bytes?.map((item) => item).toList(),
      'logprob': logprob,
      'token': token,
    };
  }
}

class OpenAiUpload {
  final int? bytes;
  final int? createdAt;
  final int? expiresAt;
  final OpenAiFile? file;
  final String? filename;
  final String? id;
  final String? object;
  final String? purpose;
  final String? status;

  OpenAiUpload({
    this.bytes,
    this.createdAt,
    this.expiresAt,
    this.file,
    this.filename,
    this.id,
    this.object,
    this.purpose,
    this.status
  });

  factory OpenAiUpload.fromJson(Map<String, dynamic> json) {
    return OpenAiUpload(
      bytes: json['bytes'] is int ? json['bytes'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      expiresAt: json['expires_at'] is int ? json['expires_at'] : null,
      file: (() {
        final map = _sdkworkAsMap(json['file']);
        return map == null ? null : OpenAiFile.fromJson(map);
      })(),
      filename: json['filename']?.toString(),
      id: json['id']?.toString(),
      object: json['object']?.toString(),
      purpose: json['purpose']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bytes': bytes,
      'created_at': createdAt,
      'expires_at': expiresAt,
      'file': file?.toJson(),
      'filename': filename,
      'id': id,
      'object': object,
      'purpose': purpose,
      'status': status,
    };
  }
}

class OpenAiUploadCompleteRequest {
  final String? md5;
  final List<String>? partIds;

  OpenAiUploadCompleteRequest({
    this.md5,
    this.partIds
  });

  factory OpenAiUploadCompleteRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiUploadCompleteRequest(
      md5: json['md5']?.toString(),
      partIds: (() {
        final list = _sdkworkAsList(json['part_ids']);
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
      'md5': md5,
      'part_ids': partIds?.map((item) => item).toList(),
    };
  }
}

class OpenAiUploadCreateRequest {
  final int? bytes;
  final String? filename;
  final String? mimeType;
  final String? purpose;

  OpenAiUploadCreateRequest({
    this.bytes,
    this.filename,
    this.mimeType,
    this.purpose
  });

  factory OpenAiUploadCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiUploadCreateRequest(
      bytes: json['bytes'] is int ? json['bytes'] : null,
      filename: json['filename']?.toString(),
      mimeType: json['mime_type']?.toString(),
      purpose: json['purpose']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bytes': bytes,
      'filename': filename,
      'mime_type': mimeType,
      'purpose': purpose,
    };
  }
}

class OpenAiUploadPart {
  final int? createdAt;
  final String? id;
  final String? object;
  final String? uploadId;

  OpenAiUploadPart({
    this.createdAt,
    this.id,
    this.object,
    this.uploadId
  });

  factory OpenAiUploadPart.fromJson(Map<String, dynamic> json) {
    return OpenAiUploadPart(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
      object: json['object']?.toString(),
      uploadId: json['upload_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'id': id,
      'object': object,
      'upload_id': uploadId,
    };
  }
}

class OpenAiUploadPartMultipartRequest {
  final String? data;

  OpenAiUploadPartMultipartRequest({
    this.data
  });

  factory OpenAiUploadPartMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiUploadPartMultipartRequest(
      data: json['data']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data,
    };
  }
}

class OpenAiVectorStore {
  final int? bytes;
  final int? createdAt;
  final dynamic expiresAfter;
  final int? expiresAt;
  final OpenAiVectorStoreFileCounts? fileCounts;
  final String? id;
  final int? lastActiveAt;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;
  final int? usageBytes;

  OpenAiVectorStore({
    this.bytes,
    this.createdAt,
    this.expiresAfter,
    this.expiresAt,
    this.fileCounts,
    this.id,
    this.lastActiveAt,
    this.metadata,
    this.name,
    this.object,
    this.status,
    this.usageBytes
  });

  factory OpenAiVectorStore.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStore(
      bytes: json['bytes'] is int ? json['bytes'] : null,
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      expiresAfter: json['expires_after']?.toString(),
      expiresAt: json['expires_at'] is int ? json['expires_at'] : null,
      fileCounts: (() {
        final map = _sdkworkAsMap(json['file_counts']);
        return map == null ? null : OpenAiVectorStoreFileCounts.fromJson(map);
      })(),
      id: json['id']?.toString(),
      lastActiveAt: json['last_active_at'] is int ? json['last_active_at'] : null,
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      usageBytes: json['usage_bytes'] is int ? json['usage_bytes'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bytes': bytes,
      'created_at': createdAt,
      'expires_after': expiresAfter,
      'expires_at': expiresAt,
      'file_counts': fileCounts?.toJson(),
      'id': id,
      'last_active_at': lastActiveAt,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
      'usage_bytes': usageBytes,
    };
  }
}

class OpenAiVectorStoreCreateRequest {
  final dynamic chunkingStrategy;
  final dynamic expiresAfter;
  final List<String>? fileIds;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiVectorStoreCreateRequest({
    this.chunkingStrategy,
    this.expiresAfter,
    this.fileIds,
    this.metadata,
    this.name
  });

  factory OpenAiVectorStoreCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreCreateRequest(
      chunkingStrategy: json['chunking_strategy']?.toString(),
      expiresAfter: json['expires_after']?.toString(),
      fileIds: (() {
        final list = _sdkworkAsList(json['file_ids']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'chunking_strategy': chunkingStrategy,
      'expires_after': expiresAfter,
      'file_ids': fileIds?.map((item) => item).toList(),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiVectorStoreFile {
  final Map<String, dynamic>? attributes;
  final dynamic chunkingStrategy;
  final int? createdAt;
  final String? id;
  final dynamic lastError;
  final String? object;
  final String? status;
  final int? usageBytes;
  final String? vectorStoreId;

  OpenAiVectorStoreFile({
    this.attributes,
    this.chunkingStrategy,
    this.createdAt,
    this.id,
    this.lastError,
    this.object,
    this.status,
    this.usageBytes,
    this.vectorStoreId
  });

  factory OpenAiVectorStoreFile.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreFile(
      attributes: (() {
        final map = _sdkworkAsMap(json['attributes']);
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
      chunkingStrategy: json['chunking_strategy']?.toString(),
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
      lastError: json['last_error']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      usageBytes: json['usage_bytes'] is int ? json['usage_bytes'] : null,
      vectorStoreId: json['vector_store_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'attributes': attributes?.map((key, item) => MapEntry(key, item)),
      'chunking_strategy': chunkingStrategy,
      'created_at': createdAt,
      'id': id,
      'last_error': lastError,
      'object': object,
      'status': status,
      'usage_bytes': usageBytes,
      'vector_store_id': vectorStoreId,
    };
  }
}

class OpenAiVectorStoreFileBatch {
  final int? createdAt;
  final OpenAiVectorStoreFileCounts? fileCounts;
  final String? id;
  final String? object;
  final String? status;
  final String? vectorStoreId;

  OpenAiVectorStoreFileBatch({
    this.createdAt,
    this.fileCounts,
    this.id,
    this.object,
    this.status,
    this.vectorStoreId
  });

  factory OpenAiVectorStoreFileBatch.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreFileBatch(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      fileCounts: (() {
        final map = _sdkworkAsMap(json['file_counts']);
        return map == null ? null : OpenAiVectorStoreFileCounts.fromJson(map);
      })(),
      id: json['id']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString(),
      vectorStoreId: json['vector_store_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'file_counts': fileCounts?.toJson(),
      'id': id,
      'object': object,
      'status': status,
      'vector_store_id': vectorStoreId,
    };
  }
}

class OpenAiVectorStoreFileBatchCreateRequest {
  final Map<String, dynamic>? attributes;
  final dynamic chunkingStrategy;
  final List<String>? fileIds;

  OpenAiVectorStoreFileBatchCreateRequest({
    this.attributes,
    this.chunkingStrategy,
    this.fileIds
  });

  factory OpenAiVectorStoreFileBatchCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreFileBatchCreateRequest(
      attributes: (() {
        final map = _sdkworkAsMap(json['attributes']);
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
      chunkingStrategy: json['chunking_strategy']?.toString(),
      fileIds: (() {
        final list = _sdkworkAsList(json['file_ids']);
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
      'attributes': attributes?.map((key, item) => MapEntry(key, item)),
      'chunking_strategy': chunkingStrategy,
      'file_ids': fileIds?.map((item) => item).toList(),
    };
  }
}

class OpenAiVectorStoreFileCounts {
  final int? cancelled;
  final int? completed;
  final int? failed;
  final int? inProgress;
  final int? total;

  OpenAiVectorStoreFileCounts({
    this.cancelled,
    this.completed,
    this.failed,
    this.inProgress,
    this.total
  });

  factory OpenAiVectorStoreFileCounts.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreFileCounts(
      cancelled: json['cancelled'] is int ? json['cancelled'] : null,
      completed: json['completed'] is int ? json['completed'] : null,
      failed: json['failed'] is int ? json['failed'] : null,
      inProgress: json['in_progress'] is int ? json['in_progress'] : null,
      total: json['total'] is int ? json['total'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cancelled': cancelled,
      'completed': completed,
      'failed': failed,
      'in_progress': inProgress,
      'total': total,
    };
  }
}

class OpenAiVectorStoreFileCreateRequest {
  final Map<String, dynamic>? attributes;
  final dynamic chunkingStrategy;
  final String? fileId;

  OpenAiVectorStoreFileCreateRequest({
    this.attributes,
    this.chunkingStrategy,
    this.fileId
  });

  factory OpenAiVectorStoreFileCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreFileCreateRequest(
      attributes: (() {
        final map = _sdkworkAsMap(json['attributes']);
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
      chunkingStrategy: json['chunking_strategy']?.toString(),
      fileId: json['file_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'attributes': attributes?.map((key, item) => MapEntry(key, item)),
      'chunking_strategy': chunkingStrategy,
      'file_id': fileId,
    };
  }
}

class OpenAiVectorStoreFileList {
  final List<OpenAiVectorStoreFile>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiVectorStoreFileList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiVectorStoreFileList.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreFileList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiVectorStoreFile.fromJson(map);
      })())
            .whereType<OpenAiVectorStoreFile>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiVectorStoreFileUpdateRequest {
  final Map<String, dynamic>? attributes;

  OpenAiVectorStoreFileUpdateRequest({
    this.attributes
  });

  factory OpenAiVectorStoreFileUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreFileUpdateRequest(
      attributes: (() {
        final map = _sdkworkAsMap(json['attributes']);
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
      'attributes': attributes?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class OpenAiVectorStoreList {
  final List<OpenAiVectorStore>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiVectorStoreList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiVectorStoreList.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiVectorStore.fromJson(map);
      })())
            .whereType<OpenAiVectorStore>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiVectorStoreSearchRequest {
  final dynamic filters;
  final int? maxNumResults;
  final dynamic query;
  final dynamic rankingOptions;
  final bool? rewriteQuery;

  OpenAiVectorStoreSearchRequest({
    this.filters,
    this.maxNumResults,
    this.query,
    this.rankingOptions,
    this.rewriteQuery
  });

  factory OpenAiVectorStoreSearchRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreSearchRequest(
      filters: json['filters']?.toString(),
      maxNumResults: json['max_num_results'] is int ? json['max_num_results'] : null,
      query: json['query']?.toString(),
      rankingOptions: json['ranking_options']?.toString(),
      rewriteQuery: json['rewrite_query'] is bool ? json['rewrite_query'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'filters': filters,
      'max_num_results': maxNumResults,
      'query': query,
      'ranking_options': rankingOptions,
      'rewrite_query': rewriteQuery,
    };
  }
}

class OpenAiVectorStoreSearchResponse {
  final List<OpenAiVectorStoreSearchResult>? data;
  final String? object;
  final List<String>? searchQuery;

  OpenAiVectorStoreSearchResponse({
    this.data,
    this.object,
    this.searchQuery
  });

  factory OpenAiVectorStoreSearchResponse.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreSearchResponse(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiVectorStoreSearchResult.fromJson(map);
      })())
            .whereType<OpenAiVectorStoreSearchResult>()
            .toList();
      })(),
      object: json['object']?.toString(),
      searchQuery: (() {
        final list = _sdkworkAsList(json['search_query']);
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
      'data': data?.map((item) => item.toJson()).toList(),
      'object': object,
      'search_query': searchQuery?.map((item) => item).toList(),
    };
  }
}

class OpenAiVectorStoreSearchResult {
  final Map<String, dynamic>? attributes;
  final List<dynamic>? content;
  final String? fileId;
  final String? filename;
  final double? score;

  OpenAiVectorStoreSearchResult({
    this.attributes,
    this.content,
    this.fileId,
    this.filename,
    this.score
  });

  factory OpenAiVectorStoreSearchResult.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreSearchResult(
      attributes: (() {
        final map = _sdkworkAsMap(json['attributes']);
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
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      fileId: json['file_id']?.toString(),
      filename: json['filename']?.toString(),
      score: json['score'] is num ? json['score'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'attributes': attributes?.map((key, item) => MapEntry(key, item)),
      'content': content?.map((item) => item).toList(),
      'file_id': fileId,
      'filename': filename,
      'score': score,
    };
  }
}

class OpenAiVectorStoreUpdateRequest {
  final dynamic expiresAfter;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiVectorStoreUpdateRequest({
    this.expiresAfter,
    this.metadata,
    this.name
  });

  factory OpenAiVectorStoreUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVectorStoreUpdateRequest(
      expiresAfter: json['expires_after']?.toString(),
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'expires_after': expiresAfter,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiVideo {
  final int? completedAt;
  final String? contentUrl;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? object;
  final String? prompt;
  final int? seconds;
  final String? size;
  final String? status;
  final String? url;

  OpenAiVideo({
    this.completedAt,
    this.contentUrl,
    this.createdAt,
    this.id,
    this.metadata,
    this.model,
    this.object,
    this.prompt,
    this.seconds,
    this.size,
    this.status,
    this.url
  });

  factory OpenAiVideo.fromJson(Map<String, dynamic> json) {
    return OpenAiVideo(
      completedAt: json['completed_at'] is int ? json['completed_at'] : null,
      contentUrl: json['content_url']?.toString(),
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      object: json['object']?.toString(),
      prompt: json['prompt']?.toString(),
      seconds: json['seconds'] is int ? json['seconds'] : null,
      size: json['size']?.toString(),
      status: json['status']?.toString(),
      url: json['url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'completed_at': completedAt,
      'content_url': contentUrl,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'object': object,
      'prompt': prompt,
      'seconds': seconds,
      'size': size,
      'status': status,
      'url': url,
    };
  }
}

class OpenAiVideoCharacter {
  final int? createdAt;
  final String? description;
  final String? id;
  final String? imageUrl;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;

  OpenAiVideoCharacter({
    this.createdAt,
    this.description,
    this.id,
    this.imageUrl,
    this.metadata,
    this.name,
    this.object
  });

  factory OpenAiVideoCharacter.fromJson(Map<String, dynamic> json) {
    return OpenAiVideoCharacter(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      description: json['description']?.toString(),
      id: json['id']?.toString(),
      imageUrl: json['image_url']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'description': description,
      'id': id,
      'image_url': imageUrl,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
    };
  }
}

class OpenAiVideoCharacterCreateRequest {
  final String? description;
  final dynamic image;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiVideoCharacterCreateRequest({
    this.description,
    this.image,
    this.metadata,
    this.name
  });

  factory OpenAiVideoCharacterCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVideoCharacterCreateRequest(
      description: json['description']?.toString(),
      image: json['image']?.toString(),
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'image': image,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiVideoCharacterMultipartRequest {
  final String? description;
  final String? file;
  final String? image;
  final String? metadata;
  final String? name;

  OpenAiVideoCharacterMultipartRequest({
    this.description,
    this.file,
    this.image,
    this.metadata,
    this.name
  });

  factory OpenAiVideoCharacterMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVideoCharacterMultipartRequest(
      description: json['description']?.toString(),
      file: json['file']?.toString(),
      image: json['image']?.toString(),
      metadata: json['metadata']?.toString(),
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'file': file,
      'image': image,
      'metadata': metadata,
      'name': name,
    };
  }
}

class OpenAiVideoCreateRequest {
  final dynamic image;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? prompt;
  final int? seconds;
  final String? size;
  final dynamic video;

  OpenAiVideoCreateRequest({
    this.image,
    this.metadata,
    this.model,
    this.prompt,
    this.seconds,
    this.size,
    this.video
  });

  factory OpenAiVideoCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVideoCreateRequest(
      image: json['image']?.toString(),
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
      prompt: json['prompt']?.toString(),
      seconds: json['seconds'] is int ? json['seconds'] : null,
      size: json['size']?.toString(),
      video: json['video']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'image': image,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'prompt': prompt,
      'seconds': seconds,
      'size': size,
      'video': video,
    };
  }
}

class OpenAiVideoEditRequest {
  final dynamic image;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? prompt;
  final int? seconds;
  final String? size;
  final dynamic video;

  OpenAiVideoEditRequest({
    this.image,
    this.metadata,
    this.model,
    this.prompt,
    this.seconds,
    this.size,
    this.video
  });

  factory OpenAiVideoEditRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVideoEditRequest(
      image: json['image']?.toString(),
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
      prompt: json['prompt']?.toString(),
      seconds: json['seconds'] is int ? json['seconds'] : null,
      size: json['size']?.toString(),
      video: json['video']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'image': image,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'prompt': prompt,
      'seconds': seconds,
      'size': size,
      'video': video,
    };
  }
}

class OpenAiVideoExtendRequest {
  final dynamic image;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? prompt;
  final int? seconds;
  final String? size;
  final dynamic video;

  OpenAiVideoExtendRequest({
    this.image,
    this.metadata,
    this.model,
    this.prompt,
    this.seconds,
    this.size,
    this.video
  });

  factory OpenAiVideoExtendRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVideoExtendRequest(
      image: json['image']?.toString(),
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
      prompt: json['prompt']?.toString(),
      seconds: json['seconds'] is int ? json['seconds'] : null,
      size: json['size']?.toString(),
      video: json['video']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'image': image,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'prompt': prompt,
      'seconds': seconds,
      'size': size,
      'video': video,
    };
  }
}

class OpenAiVideoList {
  final List<OpenAiVideo>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiVideoList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiVideoList.fromJson(Map<String, dynamic> json) {
    return OpenAiVideoList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiVideo.fromJson(map);
      })())
            .whereType<OpenAiVideo>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiVideoRemixRequest {
  final dynamic image;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? prompt;
  final int? seconds;
  final String? size;
  final dynamic video;

  OpenAiVideoRemixRequest({
    this.image,
    this.metadata,
    this.model,
    this.prompt,
    this.seconds,
    this.size,
    this.video
  });

  factory OpenAiVideoRemixRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVideoRemixRequest(
      image: json['image']?.toString(),
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
      prompt: json['prompt']?.toString(),
      seconds: json['seconds'] is int ? json['seconds'] : null,
      size: json['size']?.toString(),
      video: json['video']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'image': image,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'prompt': prompt,
      'seconds': seconds,
      'size': size,
      'video': video,
    };
  }
}

class OpenAiVoice {
  final int? createdAt;
  final String? description;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;

  OpenAiVoice({
    this.createdAt,
    this.description,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.status
  });

  factory OpenAiVoice.fromJson(Map<String, dynamic> json) {
    return OpenAiVoice(
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      description: json['description']?.toString(),
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'description': description,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
    };
  }
}

class OpenAiVoiceConsent {
  final dynamic consentDocument;
  final int? createdAt;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? object;
  final String? status;

  OpenAiVoiceConsent({
    this.consentDocument,
    this.createdAt,
    this.id,
    this.metadata,
    this.name,
    this.object,
    this.status
  });

  factory OpenAiVoiceConsent.fromJson(Map<String, dynamic> json) {
    return OpenAiVoiceConsent(
      consentDocument: json['consent_document']?.toString(),
      createdAt: json['created_at'] is int ? json['created_at'] : null,
      id: json['id']?.toString(),
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
      name: json['name']?.toString(),
      object: json['object']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'consent_document': consentDocument,
      'created_at': createdAt,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'object': object,
      'status': status,
    };
  }
}

class OpenAiVoiceConsentCreateRequest {
  final dynamic consentDocument;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiVoiceConsentCreateRequest({
    this.consentDocument,
    this.metadata,
    this.name
  });

  factory OpenAiVoiceConsentCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVoiceConsentCreateRequest(
      consentDocument: json['consent_document']?.toString(),
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'consent_document': consentDocument,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiVoiceConsentList {
  final List<OpenAiVoiceConsent>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiVoiceConsentList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiVoiceConsentList.fromJson(Map<String, dynamic> json) {
    return OpenAiVoiceConsentList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiVoiceConsent.fromJson(map);
      })())
            .whereType<OpenAiVoiceConsent>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class OpenAiVoiceConsentMultipartRequest {
  final String? file;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiVoiceConsentMultipartRequest({
    this.file,
    this.metadata,
    this.name
  });

  factory OpenAiVoiceConsentMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVoiceConsentMultipartRequest(
      file: json['file']?.toString(),
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiVoiceConsentUpdateRequest {
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiVoiceConsentUpdateRequest({
    this.metadata,
    this.name
  });

  factory OpenAiVoiceConsentUpdateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVoiceConsentUpdateRequest(
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiVoiceCreateMultipartRequest {
  final String? description;
  final String? file;
  final String? metadata;
  final String? name;

  OpenAiVoiceCreateMultipartRequest({
    this.description,
    this.file,
    this.metadata,
    this.name
  });

  factory OpenAiVoiceCreateMultipartRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVoiceCreateMultipartRequest(
      description: json['description']?.toString(),
      file: json['file']?.toString(),
      metadata: json['metadata']?.toString(),
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'file': file,
      'metadata': metadata,
      'name': name,
    };
  }
}

class OpenAiVoiceCreateRequest {
  final String? description;
  final Map<String, dynamic>? metadata;
  final String? name;

  OpenAiVoiceCreateRequest({
    this.description,
    this.metadata,
    this.name
  });

  factory OpenAiVoiceCreateRequest.fromJson(Map<String, dynamic> json) {
    return OpenAiVoiceCreateRequest(
      description: json['description']?.toString(),
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
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
    };
  }
}

class OpenAiVoiceList {
  final List<OpenAiVoice>? data;
  final String? firstId;
  final bool? hasMore;
  final String? lastId;
  final String? object;

  OpenAiVoiceList({
    this.data,
    this.firstId,
    this.hasMore,
    this.lastId,
    this.object
  });

  factory OpenAiVoiceList.fromJson(Map<String, dynamic> json) {
    return OpenAiVoiceList(
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : OpenAiVoice.fromJson(map);
      })())
            .whereType<OpenAiVoice>()
            .toList();
      })(),
      firstId: json['first_id']?.toString(),
      hasMore: json['has_more'] is bool ? json['has_more'] : null,
      lastId: json['last_id']?.toString(),
      object: json['object']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'data': data?.map((item) => item.toJson()).toList(),
      'first_id': firstId,
      'has_more': hasMore,
      'last_id': lastId,
      'object': object,
    };
  }
}

class ProviderGeneratedMedia {
  final double? duration;
  final int? height;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? mimeType;
  final String? uri;
  final String? url;
  final int? width;

  ProviderGeneratedMedia({
    this.duration,
    this.height,
    this.id,
    this.metadata,
    this.mimeType,
    this.uri,
    this.url,
    this.width
  });

  factory ProviderGeneratedMedia.fromJson(Map<String, dynamic> json) {
    return ProviderGeneratedMedia(
      duration: json['duration'] is num ? json['duration'].toDouble() : null,
      height: json['height'] is int ? json['height'] : null,
      id: json['id']?.toString(),
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
      mimeType: json['mime_type']?.toString(),
      uri: json['uri']?.toString(),
      url: json['url']?.toString(),
      width: json['width'] is int ? json['width'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'duration': duration,
      'height': height,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'mime_type': mimeType,
      'uri': uri,
      'url': url,
      'width': width,
    };
  }
}

class ProviderJsonSchema {
  final bool? additionalProperties;
  final String? description;
  final List<dynamic>? enum_;
  final dynamic items;
  final Map<String, dynamic>? properties;
  final List<String>? required_;
  final String? type;

  ProviderJsonSchema({
    this.additionalProperties,
    this.description,
    this.enum_,
    this.items,
    this.properties,
    this.required_,
    this.type
  });

  factory ProviderJsonSchema.fromJson(Map<String, dynamic> json) {
    return ProviderJsonSchema(
      additionalProperties: json['additionalProperties'] is bool ? json['additionalProperties'] : null,
      description: json['description']?.toString(),
      enum_: (() {
        final list = _sdkworkAsList(json['enum']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<dynamic>()
            .toList();
      })(),
      items: json['items'],
      properties: (() {
        final map = _sdkworkAsMap(json['properties']);
        if (map == null) {
          return null;
        }
        final result = <String, dynamic>{};
        map.forEach((key, item) {
          final deserialized = item;
          result[key] = deserialized;
        });
        return result;
      })(),
      required_: (() {
        final list = _sdkworkAsList(json['required']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'additionalProperties': additionalProperties,
      'description': description,
      'enum': enum_?.map((item) => item).toList(),
      'items': items,
      'properties': properties?.map((key, item) => MapEntry(key, item)),
      'required': required_?.map((item) => item).toList(),
      'type': type,
    };
  }
}

class ProviderTaskError {
  final String? code;
  final String? message;
  final String? type;

  ProviderTaskError({
    this.code,
    this.message,
    this.type
  });

  factory ProviderTaskError.fromJson(Map<String, dynamic> json) {
    return ProviderTaskError(
      code: json['code']?.toString(),
      message: json['message']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'message': message,
      'type': type,
    };
  }
}

class ProviderTaskResult {
  final List<ProviderGeneratedMedia>? audios;
  final List<VolcengineContentPart>? content;
  final String? id;
  final List<ProviderGeneratedMedia>? images;
  final Map<String, dynamic>? metadata;
  final String? status;
  final String? text;
  final List<ProviderGeneratedMedia>? videos;

  ProviderTaskResult({
    this.audios,
    this.content,
    this.id,
    this.images,
    this.metadata,
    this.status,
    this.text,
    this.videos
  });

  factory ProviderTaskResult.fromJson(Map<String, dynamic> json) {
    return ProviderTaskResult(
      audios: (() {
        final list = _sdkworkAsList(json['audios']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ProviderGeneratedMedia.fromJson(map);
      })())
            .whereType<ProviderGeneratedMedia>()
            .toList();
      })(),
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : VolcengineContentPart.fromJson(map);
      })())
            .whereType<VolcengineContentPart>()
            .toList();
      })(),
      id: json['id']?.toString(),
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ProviderGeneratedMedia.fromJson(map);
      })())
            .whereType<ProviderGeneratedMedia>()
            .toList();
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
      status: json['status']?.toString(),
      text: json['text']?.toString(),
      videos: (() {
        final list = _sdkworkAsList(json['videos']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ProviderGeneratedMedia.fromJson(map);
      })())
            .whereType<ProviderGeneratedMedia>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audios': audios?.map((item) => item.toJson()).toList(),
      'content': content?.map((item) => item.toJson()).toList(),
      'id': id,
      'images': images?.map((item) => item.toJson()).toList(),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'status': status,
      'text': text,
      'videos': videos?.map((item) => item.toJson()).toList(),
    };
  }
}

class SunoMusicGenerationRequest {
  final String? callbackUrl;
  final double? duration;
  final String? model;
  final String? negativeTags;
  final String? prompt;
  final String? tags;
  final String? title;

  SunoMusicGenerationRequest({
    this.callbackUrl,
    this.duration,
    this.model,
    this.negativeTags,
    this.prompt,
    this.tags,
    this.title
  });

  factory SunoMusicGenerationRequest.fromJson(Map<String, dynamic> json) {
    return SunoMusicGenerationRequest(
      callbackUrl: json['callback_url']?.toString(),
      duration: json['duration'] is num ? json['duration'].toDouble() : null,
      model: json['model']?.toString(),
      negativeTags: json['negative_tags']?.toString(),
      prompt: json['prompt']?.toString(),
      tags: json['tags']?.toString(),
      title: json['title']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'callback_url': callbackUrl,
      'duration': duration,
      'model': model,
      'negative_tags': negativeTags,
      'prompt': prompt,
      'tags': tags,
      'title': title,
    };
  }
}

class SunoMusicGenerationResponse {
  final String? createdAt;
  final String? id;
  final String? status;
  final String? taskId;

  SunoMusicGenerationResponse({
    this.createdAt,
    this.id,
    this.status,
    this.taskId
  });

  factory SunoMusicGenerationResponse.fromJson(Map<String, dynamic> json) {
    return SunoMusicGenerationResponse(
      createdAt: json['created_at']?.toString(),
      id: json['id']?.toString(),
      status: json['status']?.toString(),
      taskId: json['task_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'id': id,
      'status': status,
      'task_id': taskId,
    };
  }
}

class SunoMusicGenerationTaskResponse {
  final String? createdAt;
  final ProviderTaskError? error;
  final String? id;
  final String? status;
  final String? taskId;
  final String? title;
  final List<SunoMusicTrack>? tracks;
  final String? updatedAt;

  SunoMusicGenerationTaskResponse({
    this.createdAt,
    this.error,
    this.id,
    this.status,
    this.taskId,
    this.title,
    this.tracks,
    this.updatedAt
  });

  factory SunoMusicGenerationTaskResponse.fromJson(Map<String, dynamic> json) {
    return SunoMusicGenerationTaskResponse(
      createdAt: json['created_at']?.toString(),
      error: (() {
        final map = _sdkworkAsMap(json['error']);
        return map == null ? null : ProviderTaskError.fromJson(map);
      })(),
      id: json['id']?.toString(),
      status: json['status']?.toString(),
      taskId: json['task_id']?.toString(),
      title: json['title']?.toString(),
      tracks: (() {
        final list = _sdkworkAsList(json['tracks']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : SunoMusicTrack.fromJson(map);
      })())
            .whereType<SunoMusicTrack>()
            .toList();
      })(),
      updatedAt: json['updated_at']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'error': error?.toJson(),
      'id': id,
      'status': status,
      'task_id': taskId,
      'title': title,
      'tracks': tracks?.map((item) => item.toJson()).toList(),
      'updated_at': updatedAt,
    };
  }
}

class SunoMusicTrack {
  final String? audioUrl;
  final double? duration;
  final String? id;
  final String? imageUrl;
  final String? lyrics;
  final String? title;
  final String? videoUrl;

  SunoMusicTrack({
    this.audioUrl,
    this.duration,
    this.id,
    this.imageUrl,
    this.lyrics,
    this.title,
    this.videoUrl
  });

  factory SunoMusicTrack.fromJson(Map<String, dynamic> json) {
    return SunoMusicTrack(
      audioUrl: json['audio_url']?.toString(),
      duration: json['duration'] is num ? json['duration'].toDouble() : null,
      id: json['id']?.toString(),
      imageUrl: json['image_url']?.toString(),
      lyrics: json['lyrics']?.toString(),
      title: json['title']?.toString(),
      videoUrl: json['video_url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audio_url': audioUrl,
      'duration': duration,
      'id': id,
      'image_url': imageUrl,
      'lyrics': lyrics,
      'title': title,
      'video_url': videoUrl,
    };
  }
}

class ViduCreation {
  final String? audioUrl;
  final String? coverUrl;
  final String? createdAt;
  final double? duration;
  final int? height;
  final String? id;
  final String? imageUrl;
  final Map<String, dynamic>? metadata;
  final String? type;
  final String? uri;
  final String? url;
  final String? videoUrl;
  final int? width;

  ViduCreation({
    this.audioUrl,
    this.coverUrl,
    this.createdAt,
    this.duration,
    this.height,
    this.id,
    this.imageUrl,
    this.metadata,
    this.type,
    this.uri,
    this.url,
    this.videoUrl,
    this.width
  });

  factory ViduCreation.fromJson(Map<String, dynamic> json) {
    return ViduCreation(
      audioUrl: json['audio_url']?.toString(),
      coverUrl: json['cover_url']?.toString(),
      createdAt: json['created_at']?.toString(),
      duration: json['duration'] is num ? json['duration'].toDouble() : null,
      height: json['height'] is int ? json['height'] : null,
      id: json['id']?.toString(),
      imageUrl: json['image_url']?.toString(),
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
      type: json['type']?.toString(),
      uri: json['uri']?.toString(),
      url: json['url']?.toString(),
      videoUrl: json['video_url']?.toString(),
      width: json['width'] is int ? json['width'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audio_url': audioUrl,
      'cover_url': coverUrl,
      'created_at': createdAt,
      'duration': duration,
      'height': height,
      'id': id,
      'image_url': imageUrl,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'type': type,
      'uri': uri,
      'url': url,
      'video_url': videoUrl,
      'width': width,
    };
  }
}

class ViduImageGenerationTask {
  final String? createdAt;
  final List<ViduCreation>? creations;
  final String? model;
  final String? state;
  final String? taskId;

  ViduImageGenerationTask({
    this.createdAt,
    this.creations,
    this.model,
    this.state,
    this.taskId
  });

  factory ViduImageGenerationTask.fromJson(Map<String, dynamic> json) {
    return ViduImageGenerationTask(
      createdAt: json['created_at']?.toString(),
      creations: (() {
        final list = _sdkworkAsList(json['creations']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ViduCreation.fromJson(map);
      })())
            .whereType<ViduCreation>()
            .toList();
      })(),
      model: json['model']?.toString(),
      state: json['state']?.toString(),
      taskId: json['task_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'creations': creations?.map((item) => item.toJson()).toList(),
      'model': model,
      'state': state,
      'task_id': taskId,
    };
  }
}

class ViduImageToVideoRequest {
  final String? aspectRatio;
  final String? callbackUrl;
  final int? duration;
  final List<String>? images;
  final String? model;
  final String? movementAmplitude;
  final String? payload;
  final String? prompt;
  final String? resolution;
  final int? seed;

  ViduImageToVideoRequest({
    this.aspectRatio,
    this.callbackUrl,
    this.duration,
    this.images,
    this.model,
    this.movementAmplitude,
    this.payload,
    this.prompt,
    this.resolution,
    this.seed
  });

  factory ViduImageToVideoRequest.fromJson(Map<String, dynamic> json) {
    return ViduImageToVideoRequest(
      aspectRatio: json['aspect_ratio']?.toString(),
      callbackUrl: json['callback_url']?.toString(),
      duration: json['duration'] is int ? json['duration'] : null,
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      model: json['model']?.toString(),
      movementAmplitude: json['movement_amplitude']?.toString(),
      payload: json['payload']?.toString(),
      prompt: json['prompt']?.toString(),
      resolution: json['resolution']?.toString(),
      seed: json['seed'] is int ? json['seed'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aspect_ratio': aspectRatio,
      'callback_url': callbackUrl,
      'duration': duration,
      'images': images?.map((item) => item).toList(),
      'model': model,
      'movement_amplitude': movementAmplitude,
      'payload': payload,
      'prompt': prompt,
      'resolution': resolution,
      'seed': seed,
    };
  }
}

class ViduReferenceToImageRequest {
  final String? aspectRatio;
  final String? callbackUrl;
  final List<String>? images;
  final String? model;
  final String? payload;
  final String? prompt;
  final int? seed;
  final String? style;

  ViduReferenceToImageRequest({
    this.aspectRatio,
    this.callbackUrl,
    this.images,
    this.model,
    this.payload,
    this.prompt,
    this.seed,
    this.style
  });

  factory ViduReferenceToImageRequest.fromJson(Map<String, dynamic> json) {
    return ViduReferenceToImageRequest(
      aspectRatio: json['aspect_ratio']?.toString(),
      callbackUrl: json['callback_url']?.toString(),
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      model: json['model']?.toString(),
      payload: json['payload']?.toString(),
      prompt: json['prompt']?.toString(),
      seed: json['seed'] is int ? json['seed'] : null,
      style: json['style']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aspect_ratio': aspectRatio,
      'callback_url': callbackUrl,
      'images': images?.map((item) => item).toList(),
      'model': model,
      'payload': payload,
      'prompt': prompt,
      'seed': seed,
      'style': style,
    };
  }
}

class ViduReferenceToVideoRequest {
  final String? aspectRatio;
  final String? callbackUrl;
  final int? duration;
  final List<String>? images;
  final String? model;
  final String? movementAmplitude;
  final String? payload;
  final String? prompt;
  final String? resolution;
  final int? seed;

  ViduReferenceToVideoRequest({
    this.aspectRatio,
    this.callbackUrl,
    this.duration,
    this.images,
    this.model,
    this.movementAmplitude,
    this.payload,
    this.prompt,
    this.resolution,
    this.seed
  });

  factory ViduReferenceToVideoRequest.fromJson(Map<String, dynamic> json) {
    return ViduReferenceToVideoRequest(
      aspectRatio: json['aspect_ratio']?.toString(),
      callbackUrl: json['callback_url']?.toString(),
      duration: json['duration'] is int ? json['duration'] : null,
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      model: json['model']?.toString(),
      movementAmplitude: json['movement_amplitude']?.toString(),
      payload: json['payload']?.toString(),
      prompt: json['prompt']?.toString(),
      resolution: json['resolution']?.toString(),
      seed: json['seed'] is int ? json['seed'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aspect_ratio': aspectRatio,
      'callback_url': callbackUrl,
      'duration': duration,
      'images': images?.map((item) => item).toList(),
      'model': model,
      'movement_amplitude': movementAmplitude,
      'payload': payload,
      'prompt': prompt,
      'resolution': resolution,
      'seed': seed,
    };
  }
}

class ViduStartEndToVideoRequest {
  final String? aspectRatio;
  final String? callbackUrl;
  final int? duration;
  final List<String>? images;
  final String? model;
  final String? movementAmplitude;
  final String? payload;
  final String? prompt;
  final String? resolution;
  final int? seed;

  ViduStartEndToVideoRequest({
    this.aspectRatio,
    this.callbackUrl,
    this.duration,
    this.images,
    this.model,
    this.movementAmplitude,
    this.payload,
    this.prompt,
    this.resolution,
    this.seed
  });

  factory ViduStartEndToVideoRequest.fromJson(Map<String, dynamic> json) {
    return ViduStartEndToVideoRequest(
      aspectRatio: json['aspect_ratio']?.toString(),
      callbackUrl: json['callback_url']?.toString(),
      duration: json['duration'] is int ? json['duration'] : null,
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      model: json['model']?.toString(),
      movementAmplitude: json['movement_amplitude']?.toString(),
      payload: json['payload']?.toString(),
      prompt: json['prompt']?.toString(),
      resolution: json['resolution']?.toString(),
      seed: json['seed'] is int ? json['seed'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aspect_ratio': aspectRatio,
      'callback_url': callbackUrl,
      'duration': duration,
      'images': images?.map((item) => item).toList(),
      'model': model,
      'movement_amplitude': movementAmplitude,
      'payload': payload,
      'prompt': prompt,
      'resolution': resolution,
      'seed': seed,
    };
  }
}

class ViduTaskCreationsResponse {
  final String? createdAt;
  final List<ViduCreation>? creations;
  final String? model;
  final String? state;
  final String? taskId;

  ViduTaskCreationsResponse({
    this.createdAt,
    this.creations,
    this.model,
    this.state,
    this.taskId
  });

  factory ViduTaskCreationsResponse.fromJson(Map<String, dynamic> json) {
    return ViduTaskCreationsResponse(
      createdAt: json['created_at']?.toString(),
      creations: (() {
        final list = _sdkworkAsList(json['creations']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ViduCreation.fromJson(map);
      })())
            .whereType<ViduCreation>()
            .toList();
      })(),
      model: json['model']?.toString(),
      state: json['state']?.toString(),
      taskId: json['task_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'creations': creations?.map((item) => item.toJson()).toList(),
      'model': model,
      'state': state,
      'task_id': taskId,
    };
  }
}

class ViduTextToVideoRequest {
  final String? aspectRatio;
  final String? callbackUrl;
  final int? duration;
  final String? model;
  final String? movementAmplitude;
  final String? payload;
  final String? prompt;
  final String? resolution;
  final int? seed;

  ViduTextToVideoRequest({
    this.aspectRatio,
    this.callbackUrl,
    this.duration,
    this.model,
    this.movementAmplitude,
    this.payload,
    this.prompt,
    this.resolution,
    this.seed
  });

  factory ViduTextToVideoRequest.fromJson(Map<String, dynamic> json) {
    return ViduTextToVideoRequest(
      aspectRatio: json['aspect_ratio']?.toString(),
      callbackUrl: json['callback_url']?.toString(),
      duration: json['duration'] is int ? json['duration'] : null,
      model: json['model']?.toString(),
      movementAmplitude: json['movement_amplitude']?.toString(),
      payload: json['payload']?.toString(),
      prompt: json['prompt']?.toString(),
      resolution: json['resolution']?.toString(),
      seed: json['seed'] is int ? json['seed'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aspect_ratio': aspectRatio,
      'callback_url': callbackUrl,
      'duration': duration,
      'model': model,
      'movement_amplitude': movementAmplitude,
      'payload': payload,
      'prompt': prompt,
      'resolution': resolution,
      'seed': seed,
    };
  }
}

class ViduVideoGenerationTask {
  final String? createdAt;
  final List<ViduCreation>? creations;
  final String? model;
  final String? state;
  final String? taskId;

  ViduVideoGenerationTask({
    this.createdAt,
    this.creations,
    this.model,
    this.state,
    this.taskId
  });

  factory ViduVideoGenerationTask.fromJson(Map<String, dynamic> json) {
    return ViduVideoGenerationTask(
      createdAt: json['created_at']?.toString(),
      creations: (() {
        final list = _sdkworkAsList(json['creations']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ViduCreation.fromJson(map);
      })())
            .whereType<ViduCreation>()
            .toList();
      })(),
      model: json['model']?.toString(),
      state: json['state']?.toString(),
      taskId: json['task_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'creations': creations?.map((item) => item.toJson()).toList(),
      'model': model,
      'state': state,
      'task_id': taskId,
    };
  }
}

class VolcengineContentGenerationTask {
  final List<VolcengineContentPart>? content;
  final String? createdAt;
  final ProviderTaskError? error;
  final String? id;
  final String? model;
  final String? prompt;
  final ProviderTaskResult? result;
  final String? state;
  final String? status;
  final String? taskId;
  final String? updatedAt;
  final List<ProviderGeneratedMedia>? videos;

  VolcengineContentGenerationTask({
    this.content,
    this.createdAt,
    this.error,
    this.id,
    this.model,
    this.prompt,
    this.result,
    this.state,
    this.status,
    this.taskId,
    this.updatedAt,
    this.videos
  });

  factory VolcengineContentGenerationTask.fromJson(Map<String, dynamic> json) {
    return VolcengineContentGenerationTask(
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : VolcengineContentPart.fromJson(map);
      })())
            .whereType<VolcengineContentPart>()
            .toList();
      })(),
      createdAt: json['created_at']?.toString(),
      error: (() {
        final map = _sdkworkAsMap(json['error']);
        return map == null ? null : ProviderTaskError.fromJson(map);
      })(),
      id: json['id']?.toString(),
      model: json['model']?.toString(),
      prompt: json['prompt']?.toString(),
      result: (() {
        final map = _sdkworkAsMap(json['result']);
        return map == null ? null : ProviderTaskResult.fromJson(map);
      })(),
      state: json['state']?.toString(),
      status: json['status']?.toString(),
      taskId: json['task_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      videos: (() {
        final list = _sdkworkAsList(json['videos']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ProviderGeneratedMedia.fromJson(map);
      })())
            .whereType<ProviderGeneratedMedia>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content?.map((item) => item.toJson()).toList(),
      'created_at': createdAt,
      'error': error?.toJson(),
      'id': id,
      'model': model,
      'prompt': prompt,
      'result': result?.toJson(),
      'state': state,
      'status': status,
      'task_id': taskId,
      'updated_at': updatedAt,
      'videos': videos?.map((item) => item.toJson()).toList(),
    };
  }
}

class VolcengineContentGenerationTaskCreateRequest {
  final String? callbackUrl;
  final List<VolcengineContentPart>? content;
  final Map<String, dynamic>? metadata;
  final String? model;

  VolcengineContentGenerationTaskCreateRequest({
    this.callbackUrl,
    this.content,
    this.metadata,
    this.model
  });

  factory VolcengineContentGenerationTaskCreateRequest.fromJson(Map<String, dynamic> json) {
    return VolcengineContentGenerationTaskCreateRequest(
      callbackUrl: json['callback_url']?.toString(),
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : VolcengineContentPart.fromJson(map);
      })())
            .whereType<VolcengineContentPart>()
            .toList();
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
      model: json['model']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'callback_url': callbackUrl,
      'content': content?.map((item) => item.toJson()).toList(),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
    };
  }
}

class VolcengineContentGenerationTaskCreateResponse {
  final String? createdAt;
  final String? id;
  final String? status;
  final String? taskId;

  VolcengineContentGenerationTaskCreateResponse({
    this.createdAt,
    this.id,
    this.status,
    this.taskId
  });

  factory VolcengineContentGenerationTaskCreateResponse.fromJson(Map<String, dynamic> json) {
    return VolcengineContentGenerationTaskCreateResponse(
      createdAt: json['created_at']?.toString(),
      id: json['id']?.toString(),
      status: json['status']?.toString(),
      taskId: json['task_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'id': id,
      'status': status,
      'task_id': taskId,
    };
  }
}

class VolcengineContentPart {
  final String? fileId;
  final String? imageUrl;
  final String? text;
  final String? type;
  final String? videoUrl;

  VolcengineContentPart({
    this.fileId,
    this.imageUrl,
    this.text,
    this.type,
    this.videoUrl
  });

  factory VolcengineContentPart.fromJson(Map<String, dynamic> json) {
    return VolcengineContentPart(
      fileId: json['file_id']?.toString(),
      imageUrl: json['image_url']?.toString(),
      text: json['text']?.toString(),
      type: json['type']?.toString(),
      videoUrl: json['video_url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file_id': fileId,
      'image_url': imageUrl,
      'text': text,
      'type': type,
      'video_url': videoUrl,
    };
  }
}
