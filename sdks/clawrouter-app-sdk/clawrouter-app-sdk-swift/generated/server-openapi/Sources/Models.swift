import Foundation

public struct AccountsCurrentSummaryRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AddressesCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AddressesDefaultSelectionCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AddressesDeleteResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AddressesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AddressesUpdateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentCapabilities: Codable {
    public let mcpServerCount: Int?
    public let memoryEnabled: Bool?
    public let skillBindingCount: Int?


    public init(mcpServerCount: Int? = nil, memoryEnabled: Bool? = nil, skillBindingCount: Int? = nil) {
        self.mcpServerCount = mcpServerCount
        self.memoryEnabled = memoryEnabled
        self.skillBindingCount = skillBindingCount
    }
}

public struct AgentCreateRequest: Codable {
    public let code: String?
    public let description: String?
    public let mcpPolicy: [String: String]?
    public let memoryPolicy: [String: String]?
    public let model: String?
    public let name: String?
    public let runtimePolicy: [String: String]?
    public let skillPolicy: [String: String]?
    public let systemPrompt: String?
    public let toolPolicy: [String: String]?


    public init(code: String? = nil, description: String? = nil, mcpPolicy: [String: String]? = nil, memoryPolicy: [String: String]? = nil, model: String? = nil, name: String? = nil, runtimePolicy: [String: String]? = nil, skillPolicy: [String: String]? = nil, systemPrompt: String? = nil, toolPolicy: [String: String]? = nil) {
        self.code = code
        self.description = description
        self.mcpPolicy = mcpPolicy
        self.memoryPolicy = memoryPolicy
        self.model = model
        self.name = name
        self.runtimePolicy = runtimePolicy
        self.skillPolicy = skillPolicy
        self.systemPrompt = systemPrompt
        self.toolPolicy = toolPolicy
    }
}

public struct AgentDefinitionsCreateResult: Codable {
    public let code: String?
    public let data: AgentItemResponse?
    public let msg: String?


    public init(code: String? = nil, data: AgentItemResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentDefinitionsListResult: Codable {
    public let code: String?
    public let data: AgentListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AgentListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentDefinitionsRetrieveResult: Codable {
    public let code: String?
    public let data: AgentItem?
    public let msg: String?


    public init(code: String? = nil, data: AgentItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentItem: Codable {
    public let avatarUrl: String?
    public let capabilities: AgentCapabilities?
    public let code: String?
    public let createdAt: String?
    public let defaultVersion: AgentVersionItem?
    public let description: String?
    public let id: String?
    public let name: String?
    public let ownerUserId: Int?
    public let status: String?
    public let templateSource: String?
    public let updatedAt: String?
    public let visibility: String?


    public init(avatarUrl: String? = nil, capabilities: AgentCapabilities? = nil, code: String? = nil, createdAt: String? = nil, defaultVersion: AgentVersionItem? = nil, description: String? = nil, id: String? = nil, name: String? = nil, ownerUserId: Int? = nil, status: String? = nil, templateSource: String? = nil, updatedAt: String? = nil, visibility: String? = nil) {
        self.avatarUrl = avatarUrl
        self.capabilities = capabilities
        self.code = code
        self.createdAt = createdAt
        self.defaultVersion = defaultVersion
        self.description = description
        self.id = id
        self.name = name
        self.ownerUserId = ownerUserId
        self.status = status
        self.templateSource = templateSource
        self.updatedAt = updatedAt
        self.visibility = visibility
    }
}

public struct AgentItemResponse: Codable {
    public let item: AgentItem?


    public init(item: AgentItem? = nil) {
        self.item = item
    }
}

public struct AgentListResponse: Codable {
    public let items: [AgentItem]?


    public init(items: [AgentItem]? = nil) {
        self.items = items
    }
}

public struct AgentRunCompleteRequest: Codable {
    public let errorMessageMasked: String?
    public let metadata: [String: String]?
    public let outputMessage: String?
    public let status: String?
    public let usageJson: UsageSnapshot?


    public init(errorMessageMasked: String? = nil, metadata: [String: String]? = nil, outputMessage: String? = nil, status: String? = nil, usageJson: UsageSnapshot? = nil) {
        self.errorMessageMasked = errorMessageMasked
        self.metadata = metadata
        self.outputMessage = outputMessage
        self.status = status
        self.usageJson = usageJson
    }
}

public struct AgentRunCreateRequest: Codable {
    public let agentId: String?
    public let agentVersionId: String?
    public let executionMode: String?
    public let inputMessage: String?
    public let memorySpaceId: String?
    public let metadata: [String: String]?
    public let model: String?
    public let requestId: String?
    public let runtime: String?
    public let sourceSurface: String?
    public let traceId: String?


    public init(agentId: String? = nil, agentVersionId: String? = nil, executionMode: String? = nil, inputMessage: String? = nil, memorySpaceId: String? = nil, metadata: [String: String]? = nil, model: String? = nil, requestId: String? = nil, runtime: String? = nil, sourceSurface: String? = nil, traceId: String? = nil) {
        self.agentId = agentId
        self.agentVersionId = agentVersionId
        self.executionMode = executionMode
        self.inputMessage = inputMessage
        self.memorySpaceId = memorySpaceId
        self.metadata = metadata
        self.model = model
        self.requestId = requestId
        self.runtime = runtime
        self.sourceSurface = sourceSurface
        self.traceId = traceId
    }
}

public struct AgentRunItem: Codable {
    public let agentId: String?
    public let agentVersionId: String?
    public let cachedTokens: Int?
    public let completedAt: String?
    public let createdAt: String?
    public let errorMessageMasked: String?
    public let executionMode: String?
    public let id: String?
    public let inputMessage: String?
    public let inputTokens: Int?
    public let memorySpaceId: String?
    public let model: String?
    public let outputMessage: String?
    public let outputTokens: Int?
    public let requestId: String?
    public let runtime: String?
    public let sessionId: String?
    public let sourceSurface: String?
    public let startedAt: String?
    public let status: String?
    public let totalSteps: Int?
    public let totalTokens: Int?
    public let traceId: String?


    public init(agentId: String? = nil, agentVersionId: String? = nil, cachedTokens: Int? = nil, completedAt: String? = nil, createdAt: String? = nil, errorMessageMasked: String? = nil, executionMode: String? = nil, id: String? = nil, inputMessage: String? = nil, inputTokens: Int? = nil, memorySpaceId: String? = nil, model: String? = nil, outputMessage: String? = nil, outputTokens: Int? = nil, requestId: String? = nil, runtime: String? = nil, sessionId: String? = nil, sourceSurface: String? = nil, startedAt: String? = nil, status: String? = nil, totalSteps: Int? = nil, totalTokens: Int? = nil, traceId: String? = nil) {
        self.agentId = agentId
        self.agentVersionId = agentVersionId
        self.cachedTokens = cachedTokens
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.errorMessageMasked = errorMessageMasked
        self.executionMode = executionMode
        self.id = id
        self.inputMessage = inputMessage
        self.inputTokens = inputTokens
        self.memorySpaceId = memorySpaceId
        self.model = model
        self.outputMessage = outputMessage
        self.outputTokens = outputTokens
        self.requestId = requestId
        self.runtime = runtime
        self.sessionId = sessionId
        self.sourceSurface = sourceSurface
        self.startedAt = startedAt
        self.status = status
        self.totalSteps = totalSteps
        self.totalTokens = totalTokens
        self.traceId = traceId
    }
}

public struct AgentRunListResponse: Codable {
    public let items: [AgentRunItem]?


    public init(items: [AgentRunItem]? = nil) {
        self.items = items
    }
}

public struct AgentRunResponse: Codable {
    public let item: AgentRunItem?


    public init(item: AgentRunItem? = nil) {
        self.item = item
    }
}

public struct AgentRunStepCompleteRequest: Codable {
    public let errorMessageMasked: String?
    public let metadata: [String: String]?
    public let outputJson: [String: String]?
    public let status: String?
    public let usageJson: UsageSnapshot?


    public init(errorMessageMasked: String? = nil, metadata: [String: String]? = nil, outputJson: [String: String]? = nil, status: String? = nil, usageJson: UsageSnapshot? = nil) {
        self.errorMessageMasked = errorMessageMasked
        self.metadata = metadata
        self.outputJson = outputJson
        self.status = status
        self.usageJson = usageJson
    }
}

public struct AgentRunStepCreateRequest: Codable {
    public let inputJson: [String: String]?
    public let metadata: [String: String]?
    public let model: String?
    public let outputJson: [String: String]?
    public let runtimeInvocationId: String?
    public let status: String?
    public let stepType: String?
    public let title: String?
    public let toolName: String?
    public let usageJson: UsageSnapshot?


    public init(inputJson: [String: String]? = nil, metadata: [String: String]? = nil, model: String? = nil, outputJson: [String: String]? = nil, runtimeInvocationId: String? = nil, status: String? = nil, stepType: String? = nil, title: String? = nil, toolName: String? = nil, usageJson: UsageSnapshot? = nil) {
        self.inputJson = inputJson
        self.metadata = metadata
        self.model = model
        self.outputJson = outputJson
        self.runtimeInvocationId = runtimeInvocationId
        self.status = status
        self.stepType = stepType
        self.title = title
        self.toolName = toolName
        self.usageJson = usageJson
    }
}

public struct AgentRunStepItem: Codable {
    public let cachedTokens: Int?
    public let completedAt: String?
    public let createdAt: String?
    public let id: String?
    public let inputTokens: Int?
    public let latencyMs: Int?
    public let model: String?
    public let outputTokens: Int?
    public let runId: String?
    public let runtimeInvocationId: String?
    public let startedAt: String?
    public let status: String?
    public let stepIndex: Int?
    public let stepType: String?
    public let title: String?
    public let toolName: String?
    public let totalTokens: Int?


    public init(cachedTokens: Int? = nil, completedAt: String? = nil, createdAt: String? = nil, id: String? = nil, inputTokens: Int? = nil, latencyMs: Int? = nil, model: String? = nil, outputTokens: Int? = nil, runId: String? = nil, runtimeInvocationId: String? = nil, startedAt: String? = nil, status: String? = nil, stepIndex: Int? = nil, stepType: String? = nil, title: String? = nil, toolName: String? = nil, totalTokens: Int? = nil) {
        self.cachedTokens = cachedTokens
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.id = id
        self.inputTokens = inputTokens
        self.latencyMs = latencyMs
        self.model = model
        self.outputTokens = outputTokens
        self.runId = runId
        self.runtimeInvocationId = runtimeInvocationId
        self.startedAt = startedAt
        self.status = status
        self.stepIndex = stepIndex
        self.stepType = stepType
        self.title = title
        self.toolName = toolName
        self.totalTokens = totalTokens
    }
}

public struct AgentRunStepListResponse: Codable {
    public let items: [AgentRunStepItem]?


    public init(items: [AgentRunStepItem]? = nil) {
        self.items = items
    }
}

public struct AgentRunStepResponse: Codable {
    public let item: AgentRunStepItem?


    public init(item: AgentRunStepItem? = nil) {
        self.item = item
    }
}

public struct AgentRunStepsCreateResult: Codable {
    public let code: String?
    public let data: AgentRunStepResponse?
    public let msg: String?


    public init(code: String? = nil, data: AgentRunStepResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentRunStepsListResult: Codable {
    public let code: String?
    public let data: AgentRunStepListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AgentRunStepListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentRunStepsSubmitResult: Codable {
    public let code: String?
    public let data: AgentRunStepResponse?
    public let msg: String?


    public init(code: String? = nil, data: AgentRunStepResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentRunsCreateResult: Codable {
    public let code: String?
    public let data: AgentRunResponse?
    public let msg: String?


    public init(code: String? = nil, data: AgentRunResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentRunsListResult: Codable {
    public let code: String?
    public let data: AgentRunListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AgentRunListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentRunsRetrieveResult: Codable {
    public let code: String?
    public let data: AgentRunItem?
    public let msg: String?


    public init(code: String? = nil, data: AgentRunItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentRunsSubmitResult: Codable {
    public let code: String?
    public let data: AgentRunResponse?
    public let msg: String?


    public init(code: String? = nil, data: AgentRunResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentSessionCreateRequest: Codable {
    public let agentVersionId: String?
    public let approvalPolicy: String?
    public let chatConversationId: String?
    public let cwd: String?
    public let defaultModel: String?
    public let memorySpaceId: String?
    public let metadata: [String: String]?
    public let permissionMode: String?
    public let runtime: String?
    public let sandboxPolicy: String?
    public let sessionKind: String?
    public let sourceSurface: String?
    public let title: String?


    public init(agentVersionId: String? = nil, approvalPolicy: String? = nil, chatConversationId: String? = nil, cwd: String? = nil, defaultModel: String? = nil, memorySpaceId: String? = nil, metadata: [String: String]? = nil, permissionMode: String? = nil, runtime: String? = nil, sandboxPolicy: String? = nil, sessionKind: String? = nil, sourceSurface: String? = nil, title: String? = nil) {
        self.agentVersionId = agentVersionId
        self.approvalPolicy = approvalPolicy
        self.chatConversationId = chatConversationId
        self.cwd = cwd
        self.defaultModel = defaultModel
        self.memorySpaceId = memorySpaceId
        self.metadata = metadata
        self.permissionMode = permissionMode
        self.runtime = runtime
        self.sandboxPolicy = sandboxPolicy
        self.sessionKind = sessionKind
        self.sourceSurface = sourceSurface
        self.title = title
    }
}

public struct AgentSessionItem: Codable {
    public let agentId: String?
    public let agentVersionId: String?
    public let approvalPolicy: String?
    public let chatConversationId: String?
    public let createdAt: String?
    public let cwd: String?
    public let defaultModel: String?
    public let id: String?
    public let lastActiveAt: String?
    public let lastRunId: String?
    public let lastStepId: Int?
    public let memorySpaceId: String?
    public let permissionMode: String?
    public let runCount: Int?
    public let runtime: String?
    public let sandboxPolicy: String?
    public let sessionKind: String?
    public let sourceSurface: String?
    public let status: String?
    public let stepCount: Int?
    public let title: String?
    public let toolCallCount: Int?
    public let updatedAt: String?


    public init(agentId: String? = nil, agentVersionId: String? = nil, approvalPolicy: String? = nil, chatConversationId: String? = nil, createdAt: String? = nil, cwd: String? = nil, defaultModel: String? = nil, id: String? = nil, lastActiveAt: String? = nil, lastRunId: String? = nil, lastStepId: Int? = nil, memorySpaceId: String? = nil, permissionMode: String? = nil, runCount: Int? = nil, runtime: String? = nil, sandboxPolicy: String? = nil, sessionKind: String? = nil, sourceSurface: String? = nil, status: String? = nil, stepCount: Int? = nil, title: String? = nil, toolCallCount: Int? = nil, updatedAt: String? = nil) {
        self.agentId = agentId
        self.agentVersionId = agentVersionId
        self.approvalPolicy = approvalPolicy
        self.chatConversationId = chatConversationId
        self.createdAt = createdAt
        self.cwd = cwd
        self.defaultModel = defaultModel
        self.id = id
        self.lastActiveAt = lastActiveAt
        self.lastRunId = lastRunId
        self.lastStepId = lastStepId
        self.memorySpaceId = memorySpaceId
        self.permissionMode = permissionMode
        self.runCount = runCount
        self.runtime = runtime
        self.sandboxPolicy = sandboxPolicy
        self.sessionKind = sessionKind
        self.sourceSurface = sourceSurface
        self.status = status
        self.stepCount = stepCount
        self.title = title
        self.toolCallCount = toolCallCount
        self.updatedAt = updatedAt
    }
}

public struct AgentSessionListResponse: Codable {
    public let items: [AgentSessionItem]?


    public init(items: [AgentSessionItem]? = nil) {
        self.items = items
    }
}

public struct AgentSessionResponse: Codable {
    public let item: AgentSessionItem?


    public init(item: AgentSessionItem? = nil) {
        self.item = item
    }
}

public struct AgentSessionsCreateResult: Codable {
    public let code: String?
    public let data: AgentSessionResponse?
    public let msg: String?


    public init(code: String? = nil, data: AgentSessionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentSessionsListResult: Codable {
    public let code: String?
    public let data: AgentSessionListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AgentSessionListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentSessionsRetrieveResult: Codable {
    public let code: String?
    public let data: AgentSessionItem?
    public let msg: String?


    public init(code: String? = nil, data: AgentSessionItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentVersionItem: Codable {
    public let createdAt: String?
    public let id: String?
    public let mcpPolicy: [String: String]?
    public let memoryPolicy: [String: String]?
    public let model: String?
    public let releaseStatus: String?
    public let runtimePolicy: [String: String]?
    public let skillPolicy: [String: String]?
    public let systemPrompt: String?
    public let toolPolicy: [String: String]?
    public let updatedAt: String?
    public let versionNo: Int?


    public init(createdAt: String? = nil, id: String? = nil, mcpPolicy: [String: String]? = nil, memoryPolicy: [String: String]? = nil, model: String? = nil, releaseStatus: String? = nil, runtimePolicy: [String: String]? = nil, skillPolicy: [String: String]? = nil, systemPrompt: String? = nil, toolPolicy: [String: String]? = nil, updatedAt: String? = nil, versionNo: Int? = nil) {
        self.createdAt = createdAt
        self.id = id
        self.mcpPolicy = mcpPolicy
        self.memoryPolicy = memoryPolicy
        self.model = model
        self.releaseStatus = releaseStatus
        self.runtimePolicy = runtimePolicy
        self.skillPolicy = skillPolicy
        self.systemPrompt = systemPrompt
        self.toolPolicy = toolPolicy
        self.updatedAt = updatedAt
        self.versionNo = versionNo
    }
}

public struct AiAgentMcpServerRecord: Codable {
    public let connectionConfig: [String: String]?
    public let createdAt: String?
    public let credentialRef: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let healthStatus: String?
    public let id: String?
    public let lastCheckedAt: String?
    public let lastErrorMasked: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let permissionPolicy: [String: String]?
    public let promptCatalog: [String: String]?
    public let resourceCatalog: [String: String]?
    public let serverCode: String?
    public let status: String?
    public let tenantId: String?
    public let toolCatalog: [String: String]?
    public let transportType: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(connectionConfig: [String: String]? = nil, createdAt: String? = nil, credentialRef: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, healthStatus: String? = nil, id: String? = nil, lastCheckedAt: String? = nil, lastErrorMasked: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, permissionPolicy: [String: String]? = nil, promptCatalog: [String: String]? = nil, resourceCatalog: [String: String]? = nil, serverCode: String? = nil, status: String? = nil, tenantId: String? = nil, toolCatalog: [String: String]? = nil, transportType: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.connectionConfig = connectionConfig
        self.createdAt = createdAt
        self.credentialRef = credentialRef
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.healthStatus = healthStatus
        self.id = id
        self.lastCheckedAt = lastCheckedAt
        self.lastErrorMasked = lastErrorMasked
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.permissionPolicy = permissionPolicy
        self.promptCatalog = promptCatalog
        self.resourceCatalog = resourceCatalog
        self.serverCode = serverCode
        self.status = status
        self.tenantId = tenantId
        self.toolCatalog = toolCatalog
        self.transportType = transportType
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiAgentMemoryRecord: Codable {
    public let agentId: String?
    public let contentRef: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let embeddingRef: String?
    public let expiresAt: String?
    public let id: String?
    public let lastUsedAt: String?
    public let memoryHash: String?
    public let memoryScope: String?
    public let memoryType: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let ownerUserId: String?
    public let retentionPolicy: [String: String]?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(agentId: String? = nil, contentRef: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, embeddingRef: String? = nil, expiresAt: String? = nil, id: String? = nil, lastUsedAt: String? = nil, memoryHash: String? = nil, memoryScope: String? = nil, memoryType: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, ownerUserId: String? = nil, retentionPolicy: [String: String]? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.agentId = agentId
        self.contentRef = contentRef
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.embeddingRef = embeddingRef
        self.expiresAt = expiresAt
        self.id = id
        self.lastUsedAt = lastUsedAt
        self.memoryHash = memoryHash
        self.memoryScope = memoryScope
        self.memoryType = memoryType
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.ownerUserId = ownerUserId
        self.retentionPolicy = retentionPolicy
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct AiAgentRecord: Codable {
    public let agentCode: String?
    public let avatarUrl: String?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultVersionId: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let governanceStatus: String?
    public let id: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let publishedAt: String?
    public let publishedBy: String?
    public let status: String?
    public let templateSource: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let visibility: String?


    public init(agentCode: String? = nil, avatarUrl: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultVersionId: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, governanceStatus: String? = nil, id: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, publishedAt: String? = nil, publishedBy: String? = nil, status: String? = nil, templateSource: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, visibility: String? = nil) {
        self.agentCode = agentCode
        self.avatarUrl = avatarUrl
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultVersionId = defaultVersionId
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.governanceStatus = governanceStatus
        self.id = id
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.publishedAt = publishedAt
        self.publishedBy = publishedBy
        self.status = status
        self.templateSource = templateSource
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.visibility = visibility
    }
}

public struct AiAgentRunRecord: Codable {
    public let agentId: String?
    public let agentSessionId: String?
    public let agentVersionId: String?
    public let audioSeconds: String?
    public let cachedTokens: String?
    public let cancelledAt: String?
    public let completedAt: String?
    public let completionTokens: String?
    public let createdAt: String?
    public let errorMessageMasked: String?
    public let executionMode: String?
    public let failedAt: String?
    public let id: String?
    public let imageCount: String?
    public let inputMessage: String?
    public let legalHold: Bool?
    public let memorySpaceId: String?
    public let metadata: [String: String]?
    public let meteringStatus: String?
    public let model: String?
    public let organizationId: String?
    public let outputMessage: String?
    public let payloadHash: String?
    public let plannerModel: String?
    public let promptTokens: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let runUuid: String?
    public let runtime: String?
    public let sourceSurface: String?
    public let startedAt: String?
    public let status: String?
    public let targetModality: String?
    public let tenantId: String?
    public let totalSteps: Int?
    public let totalTokens: String?
    public let traceId: String?
    public let usageFactId: String?
    public let usageJson: [String: String]?
    public let userId: String?
    public let uuid: String?
    public let videoSeconds: String?


    public init(agentId: String? = nil, agentSessionId: String? = nil, agentVersionId: String? = nil, audioSeconds: String? = nil, cachedTokens: String? = nil, cancelledAt: String? = nil, completedAt: String? = nil, completionTokens: String? = nil, createdAt: String? = nil, errorMessageMasked: String? = nil, executionMode: String? = nil, failedAt: String? = nil, id: String? = nil, imageCount: String? = nil, inputMessage: String? = nil, legalHold: Bool? = nil, memorySpaceId: String? = nil, metadata: [String: String]? = nil, meteringStatus: String? = nil, model: String? = nil, organizationId: String? = nil, outputMessage: String? = nil, payloadHash: String? = nil, plannerModel: String? = nil, promptTokens: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runUuid: String? = nil, runtime: String? = nil, sourceSurface: String? = nil, startedAt: String? = nil, status: String? = nil, targetModality: String? = nil, tenantId: String? = nil, totalSteps: Int? = nil, totalTokens: String? = nil, traceId: String? = nil, usageFactId: String? = nil, usageJson: [String: String]? = nil, userId: String? = nil, uuid: String? = nil, videoSeconds: String? = nil) {
        self.agentId = agentId
        self.agentSessionId = agentSessionId
        self.agentVersionId = agentVersionId
        self.audioSeconds = audioSeconds
        self.cachedTokens = cachedTokens
        self.cancelledAt = cancelledAt
        self.completedAt = completedAt
        self.completionTokens = completionTokens
        self.createdAt = createdAt
        self.errorMessageMasked = errorMessageMasked
        self.executionMode = executionMode
        self.failedAt = failedAt
        self.id = id
        self.imageCount = imageCount
        self.inputMessage = inputMessage
        self.legalHold = legalHold
        self.memorySpaceId = memorySpaceId
        self.metadata = metadata
        self.meteringStatus = meteringStatus
        self.model = model
        self.organizationId = organizationId
        self.outputMessage = outputMessage
        self.payloadHash = payloadHash
        self.plannerModel = plannerModel
        self.promptTokens = promptTokens
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.runUuid = runUuid
        self.runtime = runtime
        self.sourceSurface = sourceSurface
        self.startedAt = startedAt
        self.status = status
        self.targetModality = targetModality
        self.tenantId = tenantId
        self.totalSteps = totalSteps
        self.totalTokens = totalTokens
        self.traceId = traceId
        self.usageFactId = usageFactId
        self.usageJson = usageJson
        self.userId = userId
        self.uuid = uuid
        self.videoSeconds = videoSeconds
    }
}

public struct AiAgentRunStepRecord: Codable {
    public let agentId: String?
    public let agentVersionId: String?
    public let audioSeconds: String?
    public let cachedTokens: String?
    public let completedAt: String?
    public let completionTokens: String?
    public let createdAt: String?
    public let errorMessageMasked: String?
    public let id: String?
    public let imageCount: String?
    public let inputSnapshot: [String: String]?
    public let latencyMs: Int?
    public let legalHold: Bool?
    public let mcpServerId: String?
    public let metadata: [String: String]?
    public let model: String?
    public let organizationId: String?
    public let outputSnapshot: [String: String]?
    public let payloadHash: String?
    public let promptTokens: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let runId: String?
    public let runtimeInvocationId: String?
    public let skillId: String?
    public let startedAt: String?
    public let status: String?
    public let stepIndex: Int?
    public let stepType: String?
    public let tenantId: String?
    public let title: String?
    public let toolBindingId: String?
    public let toolName: String?
    public let totalTokens: String?
    public let traceId: String?
    public let usageFactId: String?
    public let usageJson: [String: String]?
    public let userId: String?
    public let uuid: String?
    public let videoSeconds: String?


    public init(agentId: String? = nil, agentVersionId: String? = nil, audioSeconds: String? = nil, cachedTokens: String? = nil, completedAt: String? = nil, completionTokens: String? = nil, createdAt: String? = nil, errorMessageMasked: String? = nil, id: String? = nil, imageCount: String? = nil, inputSnapshot: [String: String]? = nil, latencyMs: Int? = nil, legalHold: Bool? = nil, mcpServerId: String? = nil, metadata: [String: String]? = nil, model: String? = nil, organizationId: String? = nil, outputSnapshot: [String: String]? = nil, payloadHash: String? = nil, promptTokens: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runId: String? = nil, runtimeInvocationId: String? = nil, skillId: String? = nil, startedAt: String? = nil, status: String? = nil, stepIndex: Int? = nil, stepType: String? = nil, tenantId: String? = nil, title: String? = nil, toolBindingId: String? = nil, toolName: String? = nil, totalTokens: String? = nil, traceId: String? = nil, usageFactId: String? = nil, usageJson: [String: String]? = nil, userId: String? = nil, uuid: String? = nil, videoSeconds: String? = nil) {
        self.agentId = agentId
        self.agentVersionId = agentVersionId
        self.audioSeconds = audioSeconds
        self.cachedTokens = cachedTokens
        self.completedAt = completedAt
        self.completionTokens = completionTokens
        self.createdAt = createdAt
        self.errorMessageMasked = errorMessageMasked
        self.id = id
        self.imageCount = imageCount
        self.inputSnapshot = inputSnapshot
        self.latencyMs = latencyMs
        self.legalHold = legalHold
        self.mcpServerId = mcpServerId
        self.metadata = metadata
        self.model = model
        self.organizationId = organizationId
        self.outputSnapshot = outputSnapshot
        self.payloadHash = payloadHash
        self.promptTokens = promptTokens
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.runId = runId
        self.runtimeInvocationId = runtimeInvocationId
        self.skillId = skillId
        self.startedAt = startedAt
        self.status = status
        self.stepIndex = stepIndex
        self.stepType = stepType
        self.tenantId = tenantId
        self.title = title
        self.toolBindingId = toolBindingId
        self.toolName = toolName
        self.totalTokens = totalTokens
        self.traceId = traceId
        self.usageFactId = usageFactId
        self.usageJson = usageJson
        self.userId = userId
        self.uuid = uuid
        self.videoSeconds = videoSeconds
    }
}

public struct AiAgentSessionRecord: Codable {
    public let agentId: String?
    public let agentVersionId: String?
    public let approvalPolicy: String?
    public let chatConversationId: String?
    public let createdAt: String?
    public let cwd: String?
    public let dataScope: String?
    public let defaultModel: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let executionMode: String?
    public let forkedFromRunId: String?
    public let forkedFromStepId: String?
    public let gitBranch: String?
    public let gitCommit: String?
    public let id: String?
    public let lastActiveAt: String?
    public let lastRunId: String?
    public let lastStepId: String?
    public let memorySpaceId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let parentSessionId: String?
    public let permissionMode: String?
    public let providerConversationId: String?
    public let providerSessionId: String?
    public let repositoryId: String?
    public let resumeStrategy: String?
    public let runCount: String?
    public let runtime: String?
    public let runtimeStateStorageKey: String?
    public let sandboxPolicy: String?
    public let sessionCode: String?
    public let sessionKind: String?
    public let sourceSurface: String?
    public let status: String?
    public let stepCount: String?
    public let summary: String?
    public let tenantId: String?
    public let title: String?
    public let toolCallCount: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?
    public let visibility: String?
    public let workspaceId: String?


    public init(agentId: String? = nil, agentVersionId: String? = nil, approvalPolicy: String? = nil, chatConversationId: String? = nil, createdAt: String? = nil, cwd: String? = nil, dataScope: String? = nil, defaultModel: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, executionMode: String? = nil, forkedFromRunId: String? = nil, forkedFromStepId: String? = nil, gitBranch: String? = nil, gitCommit: String? = nil, id: String? = nil, lastActiveAt: String? = nil, lastRunId: String? = nil, lastStepId: String? = nil, memorySpaceId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, parentSessionId: String? = nil, permissionMode: String? = nil, providerConversationId: String? = nil, providerSessionId: String? = nil, repositoryId: String? = nil, resumeStrategy: String? = nil, runCount: String? = nil, runtime: String? = nil, runtimeStateStorageKey: String? = nil, sandboxPolicy: String? = nil, sessionCode: String? = nil, sessionKind: String? = nil, sourceSurface: String? = nil, status: String? = nil, stepCount: String? = nil, summary: String? = nil, tenantId: String? = nil, title: String? = nil, toolCallCount: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil, visibility: String? = nil, workspaceId: String? = nil) {
        self.agentId = agentId
        self.agentVersionId = agentVersionId
        self.approvalPolicy = approvalPolicy
        self.chatConversationId = chatConversationId
        self.createdAt = createdAt
        self.cwd = cwd
        self.dataScope = dataScope
        self.defaultModel = defaultModel
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.executionMode = executionMode
        self.forkedFromRunId = forkedFromRunId
        self.forkedFromStepId = forkedFromStepId
        self.gitBranch = gitBranch
        self.gitCommit = gitCommit
        self.id = id
        self.lastActiveAt = lastActiveAt
        self.lastRunId = lastRunId
        self.lastStepId = lastStepId
        self.memorySpaceId = memorySpaceId
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.parentSessionId = parentSessionId
        self.permissionMode = permissionMode
        self.providerConversationId = providerConversationId
        self.providerSessionId = providerSessionId
        self.repositoryId = repositoryId
        self.resumeStrategy = resumeStrategy
        self.runCount = runCount
        self.runtime = runtime
        self.runtimeStateStorageKey = runtimeStateStorageKey
        self.sandboxPolicy = sandboxPolicy
        self.sessionCode = sessionCode
        self.sessionKind = sessionKind
        self.sourceSurface = sourceSurface
        self.status = status
        self.stepCount = stepCount
        self.summary = summary
        self.tenantId = tenantId
        self.title = title
        self.toolCallCount = toolCallCount
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
        self.visibility = visibility
        self.workspaceId = workspaceId
    }
}

public struct AiAgentToolBindingRecord: Codable {
    public let agentId: String?
    public let agentVersionId: String?
    public let bindingKey: String?
    public let bindingType: String?
    public let createdAt: String?
    public let credentialRef: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let enabled: Bool?
    public let healthStatus: String?
    public let id: String?
    public let lastCheckedAt: String?
    public let mcpServerId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let permissionPolicy: [String: String]?
    public let runtimeConfig: [String: String]?
    public let skillId: String?
    public let status: String?
    public let tenantId: String?
    public let toolName: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(agentId: String? = nil, agentVersionId: String? = nil, bindingKey: String? = nil, bindingType: String? = nil, createdAt: String? = nil, credentialRef: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, enabled: Bool? = nil, healthStatus: String? = nil, id: String? = nil, lastCheckedAt: String? = nil, mcpServerId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, permissionPolicy: [String: String]? = nil, runtimeConfig: [String: String]? = nil, skillId: String? = nil, status: String? = nil, tenantId: String? = nil, toolName: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.agentId = agentId
        self.agentVersionId = agentVersionId
        self.bindingKey = bindingKey
        self.bindingType = bindingType
        self.createdAt = createdAt
        self.credentialRef = credentialRef
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.enabled = enabled
        self.healthStatus = healthStatus
        self.id = id
        self.lastCheckedAt = lastCheckedAt
        self.mcpServerId = mcpServerId
        self.metadata = metadata
        self.organizationId = organizationId
        self.permissionPolicy = permissionPolicy
        self.runtimeConfig = runtimeConfig
        self.skillId = skillId
        self.status = status
        self.tenantId = tenantId
        self.toolName = toolName
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiAgentVersionRecord: Codable {
    public let agentId: String?
    public let configHash: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let mcpPolicy: [String: String]?
    public let memoryPolicy: [String: String]?
    public let metadata: [String: String]?
    public let modelPolicy: [String: String]?
    public let organizationId: String?
    public let publishedAt: String?
    public let publishedBy: String?
    public let releaseStatus: String?
    public let runtimePolicy: [String: String]?
    public let skillPolicy: [String: String]?
    public let status: String?
    public let systemPrompt: String?
    public let tenantId: String?
    public let toolPolicy: [String: String]?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let versionNo: String?


    public init(agentId: String? = nil, configHash: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, mcpPolicy: [String: String]? = nil, memoryPolicy: [String: String]? = nil, metadata: [String: String]? = nil, modelPolicy: [String: String]? = nil, organizationId: String? = nil, publishedAt: String? = nil, publishedBy: String? = nil, releaseStatus: String? = nil, runtimePolicy: [String: String]? = nil, skillPolicy: [String: String]? = nil, status: String? = nil, systemPrompt: String? = nil, tenantId: String? = nil, toolPolicy: [String: String]? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, versionNo: String? = nil) {
        self.agentId = agentId
        self.configHash = configHash
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.mcpPolicy = mcpPolicy
        self.memoryPolicy = memoryPolicy
        self.metadata = metadata
        self.modelPolicy = modelPolicy
        self.organizationId = organizationId
        self.publishedAt = publishedAt
        self.publishedBy = publishedBy
        self.releaseStatus = releaseStatus
        self.runtimePolicy = runtimePolicy
        self.skillPolicy = skillPolicy
        self.status = status
        self.systemPrompt = systemPrompt
        self.tenantId = tenantId
        self.toolPolicy = toolPolicy
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.versionNo = versionNo
    }
}

public struct AiBillingMeterRecord: Codable {
    public let aggregationMode: String?
    public let allowNegativeQuantity: Bool?
    public let billingMode: String?
    public let canonicalPriceItemType: String?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultUnit: String?
    public let defaultUnitSize: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let displayName: String?
    public let id: String?
    public let metadata: [String: String]?
    public let meterCode: String?
    public let modality: String?
    public let organizationId: String?
    public let quantityPrecision: Int?
    public let quantitySource: String?
    public let resultSelector: String?
    public let sortOrder: Int?
    public let status: String?
    public let supportsExpression: Bool?
    public let supportsTier: Bool?
    public let tenantId: String?
    public let updatedAt: String?
    public let usageType: String?
    public let uuid: String?
    public let version: String?


    public init(aggregationMode: String? = nil, allowNegativeQuantity: Bool? = nil, billingMode: String? = nil, canonicalPriceItemType: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultUnit: String? = nil, defaultUnitSize: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, displayName: String? = nil, id: String? = nil, metadata: [String: String]? = nil, meterCode: String? = nil, modality: String? = nil, organizationId: String? = nil, quantityPrecision: Int? = nil, quantitySource: String? = nil, resultSelector: String? = nil, sortOrder: Int? = nil, status: String? = nil, supportsExpression: Bool? = nil, supportsTier: Bool? = nil, tenantId: String? = nil, updatedAt: String? = nil, usageType: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.aggregationMode = aggregationMode
        self.allowNegativeQuantity = allowNegativeQuantity
        self.billingMode = billingMode
        self.canonicalPriceItemType = canonicalPriceItemType
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultUnit = defaultUnit
        self.defaultUnitSize = defaultUnitSize
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.displayName = displayName
        self.id = id
        self.metadata = metadata
        self.meterCode = meterCode
        self.modality = modality
        self.organizationId = organizationId
        self.quantityPrecision = quantityPrecision
        self.quantitySource = quantitySource
        self.resultSelector = resultSelector
        self.sortOrder = sortOrder
        self.status = status
        self.supportsExpression = supportsExpression
        self.supportsTier = supportsTier
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.usageType = usageType
        self.uuid = uuid
        self.version = version
    }
}

public struct AiChatContextSnapshotRecord: Codable {
    public let contextJson: [String: String]?
    public let conversationId: String?
    public let createdAt: String?
    public let excludedItemIds: [String: String]?
    public let excludedMemoryIds: [String: String]?
    public let id: String?
    public let includedItemIds: [String: String]?
    public let includedMemoryIds: [String: String]?
    public let inputTokenEstimate: String?
    public let legalHold: Bool?
    public let memoryPack: [String: String]?
    public let memoryTokenCount: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let previousResponseId: String?
    public let providerConversationId: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let runtimeInvocationId: String?
    public let snapshotNo: Int?
    public let status: String?
    public let strategy: String?
    public let tenantId: String?
    public let traceId: String?
    public let truncationReason: String?
    public let turnId: String?
    public let userId: String?
    public let uuid: String?


    public init(contextJson: [String: String]? = nil, conversationId: String? = nil, createdAt: String? = nil, excludedItemIds: [String: String]? = nil, excludedMemoryIds: [String: String]? = nil, id: String? = nil, includedItemIds: [String: String]? = nil, includedMemoryIds: [String: String]? = nil, inputTokenEstimate: String? = nil, legalHold: Bool? = nil, memoryPack: [String: String]? = nil, memoryTokenCount: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, previousResponseId: String? = nil, providerConversationId: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runtimeInvocationId: String? = nil, snapshotNo: Int? = nil, status: String? = nil, strategy: String? = nil, tenantId: String? = nil, traceId: String? = nil, truncationReason: String? = nil, turnId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.contextJson = contextJson
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.excludedItemIds = excludedItemIds
        self.excludedMemoryIds = excludedMemoryIds
        self.id = id
        self.includedItemIds = includedItemIds
        self.includedMemoryIds = includedMemoryIds
        self.inputTokenEstimate = inputTokenEstimate
        self.legalHold = legalHold
        self.memoryPack = memoryPack
        self.memoryTokenCount = memoryTokenCount
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.previousResponseId = previousResponseId
        self.providerConversationId = providerConversationId
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.runtimeInvocationId = runtimeInvocationId
        self.snapshotNo = snapshotNo
        self.status = status
        self.strategy = strategy
        self.tenantId = tenantId
        self.traceId = traceId
        self.truncationReason = truncationReason
        self.turnId = turnId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiChatConversationRecord: Codable {
    public let agentId: String?
    public let agentSessionId: String?
    public let cachedTokenTotal: String?
    public let conversationCode: String?
    public let costAmountTotal: String?
    public let createdAt: String?
    public let currency: String?
    public let dataScope: String?
    public let defaultEndpoint: String?
    public let defaultModel: String?
    public let defaultProvider: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let inputTokenTotal: String?
    public let itemCount: String?
    public let lastItemId: String?
    public let lastMessagePreview: String?
    public let lastTurnId: String?
    public let memorySpaceId: String?
    public let messageCount: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let outputTokenTotal: String?
    public let ownerId: String?
    public let ownerType: String?
    public let reasoningTokenTotal: String?
    public let sourceSurface: String?
    public let status: String?
    public let summary: String?
    public let tenantId: String?
    public let title: String?
    public let turnCount: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?
    public let visibility: String?


    public init(agentId: String? = nil, agentSessionId: String? = nil, cachedTokenTotal: String? = nil, conversationCode: String? = nil, costAmountTotal: String? = nil, createdAt: String? = nil, currency: String? = nil, dataScope: String? = nil, defaultEndpoint: String? = nil, defaultModel: String? = nil, defaultProvider: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, inputTokenTotal: String? = nil, itemCount: String? = nil, lastItemId: String? = nil, lastMessagePreview: String? = nil, lastTurnId: String? = nil, memorySpaceId: String? = nil, messageCount: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, outputTokenTotal: String? = nil, ownerId: String? = nil, ownerType: String? = nil, reasoningTokenTotal: String? = nil, sourceSurface: String? = nil, status: String? = nil, summary: String? = nil, tenantId: String? = nil, title: String? = nil, turnCount: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil, visibility: String? = nil) {
        self.agentId = agentId
        self.agentSessionId = agentSessionId
        self.cachedTokenTotal = cachedTokenTotal
        self.conversationCode = conversationCode
        self.costAmountTotal = costAmountTotal
        self.createdAt = createdAt
        self.currency = currency
        self.dataScope = dataScope
        self.defaultEndpoint = defaultEndpoint
        self.defaultModel = defaultModel
        self.defaultProvider = defaultProvider
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.inputTokenTotal = inputTokenTotal
        self.itemCount = itemCount
        self.lastItemId = lastItemId
        self.lastMessagePreview = lastMessagePreview
        self.lastTurnId = lastTurnId
        self.memorySpaceId = memorySpaceId
        self.messageCount = messageCount
        self.metadata = metadata
        self.organizationId = organizationId
        self.outputTokenTotal = outputTokenTotal
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.reasoningTokenTotal = reasoningTokenTotal
        self.sourceSurface = sourceSurface
        self.status = status
        self.summary = summary
        self.tenantId = tenantId
        self.title = title
        self.turnCount = turnCount
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
        self.visibility = visibility
    }
}

public struct AiChatItemRecord: Codable {
    public let completedAt: String?
    public let contentJson: [String: String]?
    public let contentText: String?
    public let conversationId: String?
    public let createdAt: String?
    public let direction: String?
    public let id: String?
    public let itemType: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let model: String?
    public let organizationId: String?
    public let parentItemId: String?
    public let payloadHash: String?
    public let provider: String?
    public let providerCallId: String?
    public let providerItemId: String?
    public let providerResponseId: String?
    public let rawProviderJson: [String: String]?
    public let requestId: String?
    public let retentionUntil: String?
    public let role: String?
    public let runtime: String?
    public let runtimeInvocationId: String?
    public let sequenceNo: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let turnId: String?
    public let userId: String?
    public let uuid: String?


    public init(completedAt: String? = nil, contentJson: [String: String]? = nil, contentText: String? = nil, conversationId: String? = nil, createdAt: String? = nil, direction: String? = nil, id: String? = nil, itemType: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, model: String? = nil, organizationId: String? = nil, parentItemId: String? = nil, payloadHash: String? = nil, provider: String? = nil, providerCallId: String? = nil, providerItemId: String? = nil, providerResponseId: String? = nil, rawProviderJson: [String: String]? = nil, requestId: String? = nil, retentionUntil: String? = nil, role: String? = nil, runtime: String? = nil, runtimeInvocationId: String? = nil, sequenceNo: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, turnId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.completedAt = completedAt
        self.contentJson = contentJson
        self.contentText = contentText
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.direction = direction
        self.id = id
        self.itemType = itemType
        self.legalHold = legalHold
        self.metadata = metadata
        self.model = model
        self.organizationId = organizationId
        self.parentItemId = parentItemId
        self.payloadHash = payloadHash
        self.provider = provider
        self.providerCallId = providerCallId
        self.providerItemId = providerItemId
        self.providerResponseId = providerResponseId
        self.rawProviderJson = rawProviderJson
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.role = role
        self.runtime = runtime
        self.runtimeInvocationId = runtimeInvocationId
        self.sequenceNo = sequenceNo
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.turnId = turnId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiChatMessagePartRecord: Codable {
    public let assetId: String?
    public let createdAt: String?
    public let fileName: String?
    public let fileSize: String?
    public let id: String?
    public let itemId: String?
    public let jsonContent: [String: String]?
    public let legalHold: Bool?
    public let messageId: String?
    public let metadata: [String: String]?
    public let mimeType: String?
    public let organizationId: String?
    public let partNo: Int?
    public let partType: String?
    public let payloadHash: String?
    public let providerPartId: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let sha256: String?
    public let status: String?
    public let storageUrl: String?
    public let tenantId: String?
    public let textContent: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(assetId: String? = nil, createdAt: String? = nil, fileName: String? = nil, fileSize: String? = nil, id: String? = nil, itemId: String? = nil, jsonContent: [String: String]? = nil, legalHold: Bool? = nil, messageId: String? = nil, metadata: [String: String]? = nil, mimeType: String? = nil, organizationId: String? = nil, partNo: Int? = nil, partType: String? = nil, payloadHash: String? = nil, providerPartId: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, sha256: String? = nil, status: String? = nil, storageUrl: String? = nil, tenantId: String? = nil, textContent: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.assetId = assetId
        self.createdAt = createdAt
        self.fileName = fileName
        self.fileSize = fileSize
        self.id = id
        self.itemId = itemId
        self.jsonContent = jsonContent
        self.legalHold = legalHold
        self.messageId = messageId
        self.metadata = metadata
        self.mimeType = mimeType
        self.organizationId = organizationId
        self.partNo = partNo
        self.partType = partType
        self.payloadHash = payloadHash
        self.providerPartId = providerPartId
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.sha256 = sha256
        self.status = status
        self.storageUrl = storageUrl
        self.tenantId = tenantId
        self.textContent = textContent
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiChatMessageRecord: Codable {
    public let contentJson: [String: String]?
    public let contentText: String?
    public let conversationId: String?
    public let createdAt: String?
    public let direction: String?
    public let finishReason: String?
    public let id: String?
    public let itemId: String?
    public let legalHold: Bool?
    public let messageKind: String?
    public let messageNo: String?
    public let metadata: [String: String]?
    public let model: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let provider: String?
    public let rawProviderJson: [String: String]?
    public let requestId: String?
    public let retentionUntil: String?
    public let role: String?
    public let runtime: String?
    public let runtimeInvocationId: String?
    public let status: String?
    public let tenantId: String?
    public let tokenCount: String?
    public let traceId: String?
    public let turnId: String?
    public let usageLinkId: String?
    public let userId: String?
    public let uuid: String?


    public init(contentJson: [String: String]? = nil, contentText: String? = nil, conversationId: String? = nil, createdAt: String? = nil, direction: String? = nil, finishReason: String? = nil, id: String? = nil, itemId: String? = nil, legalHold: Bool? = nil, messageKind: String? = nil, messageNo: String? = nil, metadata: [String: String]? = nil, model: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, provider: String? = nil, rawProviderJson: [String: String]? = nil, requestId: String? = nil, retentionUntil: String? = nil, role: String? = nil, runtime: String? = nil, runtimeInvocationId: String? = nil, status: String? = nil, tenantId: String? = nil, tokenCount: String? = nil, traceId: String? = nil, turnId: String? = nil, usageLinkId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.contentJson = contentJson
        self.contentText = contentText
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.direction = direction
        self.finishReason = finishReason
        self.id = id
        self.itemId = itemId
        self.legalHold = legalHold
        self.messageKind = messageKind
        self.messageNo = messageNo
        self.metadata = metadata
        self.model = model
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.provider = provider
        self.rawProviderJson = rawProviderJson
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.role = role
        self.runtime = runtime
        self.runtimeInvocationId = runtimeInvocationId
        self.status = status
        self.tenantId = tenantId
        self.tokenCount = tokenCount
        self.traceId = traceId
        self.turnId = turnId
        self.usageLinkId = usageLinkId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiChatTurnRecord: Codable {
    public let agentId: String?
    public let agentSessionId: String?
    public let branchId: String?
    public let cachedTokenTotal: String?
    public let completedAt: String?
    public let contextSnapshotId: String?
    public let conversationId: String?
    public let costAmount: String?
    public let createdAt: String?
    public let currency: String?
    public let endpoint: String?
    public let finalOutputItemId: String?
    public let id: String?
    public let inputItemId: String?
    public let inputTokenTotal: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let model: String?
    public let organizationId: String?
    public let outputTokenTotal: String?
    public let parentTurnId: String?
    public let payloadHash: String?
    public let provider: String?
    public let reasoningTokenTotal: String?
    public let requestId: String?
    public let requestSnapshot: [String: String]?
    public let responseSnapshot: [String: String]?
    public let retentionUntil: String?
    public let runtimeInvocationId: String?
    public let startedAt: String?
    public let status: String?
    public let streaming: Bool?
    public let tenantId: String?
    public let traceId: String?
    public let turnNo: String?
    public let usageSnapshot: [String: String]?
    public let userId: String?
    public let uuid: String?


    public init(agentId: String? = nil, agentSessionId: String? = nil, branchId: String? = nil, cachedTokenTotal: String? = nil, completedAt: String? = nil, contextSnapshotId: String? = nil, conversationId: String? = nil, costAmount: String? = nil, createdAt: String? = nil, currency: String? = nil, endpoint: String? = nil, finalOutputItemId: String? = nil, id: String? = nil, inputItemId: String? = nil, inputTokenTotal: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, model: String? = nil, organizationId: String? = nil, outputTokenTotal: String? = nil, parentTurnId: String? = nil, payloadHash: String? = nil, provider: String? = nil, reasoningTokenTotal: String? = nil, requestId: String? = nil, requestSnapshot: [String: String]? = nil, responseSnapshot: [String: String]? = nil, retentionUntil: String? = nil, runtimeInvocationId: String? = nil, startedAt: String? = nil, status: String? = nil, streaming: Bool? = nil, tenantId: String? = nil, traceId: String? = nil, turnNo: String? = nil, usageSnapshot: [String: String]? = nil, userId: String? = nil, uuid: String? = nil) {
        self.agentId = agentId
        self.agentSessionId = agentSessionId
        self.branchId = branchId
        self.cachedTokenTotal = cachedTokenTotal
        self.completedAt = completedAt
        self.contextSnapshotId = contextSnapshotId
        self.conversationId = conversationId
        self.costAmount = costAmount
        self.createdAt = createdAt
        self.currency = currency
        self.endpoint = endpoint
        self.finalOutputItemId = finalOutputItemId
        self.id = id
        self.inputItemId = inputItemId
        self.inputTokenTotal = inputTokenTotal
        self.legalHold = legalHold
        self.metadata = metadata
        self.model = model
        self.organizationId = organizationId
        self.outputTokenTotal = outputTokenTotal
        self.parentTurnId = parentTurnId
        self.payloadHash = payloadHash
        self.provider = provider
        self.reasoningTokenTotal = reasoningTokenTotal
        self.requestId = requestId
        self.requestSnapshot = requestSnapshot
        self.responseSnapshot = responseSnapshot
        self.retentionUntil = retentionUntil
        self.runtimeInvocationId = runtimeInvocationId
        self.startedAt = startedAt
        self.status = status
        self.streaming = streaming
        self.tenantId = tenantId
        self.traceId = traceId
        self.turnNo = turnNo
        self.usageSnapshot = usageSnapshot
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiGenerationAssetActionRecord: Codable {
    public let actionParams: [String: String]?
    public let actionType: String?
    public let assetId: String?
    public let clientIpHash: String?
    public let clientIpRegion: String?
    public let completedAt: String?
    public let createdAt: String?
    public let failureCode: String?
    public let id: String?
    public let jobId: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let requestId: String?
    public let resultAssetId: String?
    public let retentionUntil: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userAgentHash: String?
    public let userId: String?
    public let uuid: String?


    public init(actionParams: [String: String]? = nil, actionType: String? = nil, assetId: String? = nil, clientIpHash: String? = nil, clientIpRegion: String? = nil, completedAt: String? = nil, createdAt: String? = nil, failureCode: String? = nil, id: String? = nil, jobId: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, requestId: String? = nil, resultAssetId: String? = nil, retentionUntil: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userAgentHash: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.actionParams = actionParams
        self.actionType = actionType
        self.assetId = assetId
        self.clientIpHash = clientIpHash
        self.clientIpRegion = clientIpRegion
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.failureCode = failureCode
        self.id = id
        self.jobId = jobId
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.requestId = requestId
        self.resultAssetId = resultAssetId
        self.retentionUntil = retentionUntil
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userAgentHash = userAgentHash
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiGenerationAssetRecord: Codable {
    public let activeIndex: Int?
    public let assetType: String?
    public let assetUrl: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let downloadCount: String?
    public let durationSeconds: String?
    public let expireAt: String?
    public let favorite: Bool?
    public let fileSize: String?
    public let height: Int?
    public let id: String?
    public let jobId: String?
    public let lastAccessedAt: String?
    public let metadata: [String: String]?
    public let mimeType: String?
    public let modelSnapshot: String?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let parameterSnapshot: [String: String]?
    public let promptSnapshot: String?
    public let shareTokenHash: String?
    public let shared: Bool?
    public let status: String?
    public let storageKey: String?
    public let storageProvider: String?
    public let tenantId: String?
    public let thumbnailUrl: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?
    public let visibility: String?
    public let width: Int?


    public init(activeIndex: Int? = nil, assetType: String? = nil, assetUrl: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, downloadCount: String? = nil, durationSeconds: String? = nil, expireAt: String? = nil, favorite: Bool? = nil, fileSize: String? = nil, height: Int? = nil, id: String? = nil, jobId: String? = nil, lastAccessedAt: String? = nil, metadata: [String: String]? = nil, mimeType: String? = nil, modelSnapshot: String? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, parameterSnapshot: [String: String]? = nil, promptSnapshot: String? = nil, shareTokenHash: String? = nil, shared: Bool? = nil, status: String? = nil, storageKey: String? = nil, storageProvider: String? = nil, tenantId: String? = nil, thumbnailUrl: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil, visibility: String? = nil, width: Int? = nil) {
        self.activeIndex = activeIndex
        self.assetType = assetType
        self.assetUrl = assetUrl
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.downloadCount = downloadCount
        self.durationSeconds = durationSeconds
        self.expireAt = expireAt
        self.favorite = favorite
        self.fileSize = fileSize
        self.height = height
        self.id = id
        self.jobId = jobId
        self.lastAccessedAt = lastAccessedAt
        self.metadata = metadata
        self.mimeType = mimeType
        self.modelSnapshot = modelSnapshot
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.parameterSnapshot = parameterSnapshot
        self.promptSnapshot = promptSnapshot
        self.shareTokenHash = shareTokenHash
        self.shared = shared
        self.status = status
        self.storageKey = storageKey
        self.storageProvider = storageProvider
        self.tenantId = tenantId
        self.thumbnailUrl = thumbnailUrl
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
        self.visibility = visibility
        self.width = width
    }
}

public struct AiGenerationJobRecord: Codable {
    public let channelId: String?
    public let completedAt: String?
    public let createdAt: String?
    public let failureCode: String?
    public let failureMessageMasked: String?
    public let id: String?
    public let inputAssetIds: [String: String]?
    public let jobType: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let modality: String?
    public let model: String?
    public let negativePrompt: String?
    public let organizationId: String?
    public let parameterSnapshot: [String: String]?
    public let payloadHash: String?
    public let progressPercent: Int?
    public let prompt: String?
    public let providerId: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let sessionId: String?
    public let startedAt: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let usageFactId: String?
    public let userId: String?
    public let uuid: String?


    public init(channelId: String? = nil, completedAt: String? = nil, createdAt: String? = nil, failureCode: String? = nil, failureMessageMasked: String? = nil, id: String? = nil, inputAssetIds: [String: String]? = nil, jobType: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, modality: String? = nil, model: String? = nil, negativePrompt: String? = nil, organizationId: String? = nil, parameterSnapshot: [String: String]? = nil, payloadHash: String? = nil, progressPercent: Int? = nil, prompt: String? = nil, providerId: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, sessionId: String? = nil, startedAt: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, usageFactId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.channelId = channelId
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.failureCode = failureCode
        self.failureMessageMasked = failureMessageMasked
        self.id = id
        self.inputAssetIds = inputAssetIds
        self.jobType = jobType
        self.legalHold = legalHold
        self.metadata = metadata
        self.modality = modality
        self.model = model
        self.negativePrompt = negativePrompt
        self.organizationId = organizationId
        self.parameterSnapshot = parameterSnapshot
        self.payloadHash = payloadHash
        self.progressPercent = progressPercent
        self.prompt = prompt
        self.providerId = providerId
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.sessionId = sessionId
        self.startedAt = startedAt
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.usageFactId = usageFactId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiGenerationSessionRecord: Codable {
    public let activeModality: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let filterConfig: [String: String]?
    public let id: String?
    public let lastOpenedAt: String?
    public let lastPrompt: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let selectedModels: [String: String]?
    public let sessionCode: String?
    public let status: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(activeModality: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, filterConfig: [String: String]? = nil, id: String? = nil, lastOpenedAt: String? = nil, lastPrompt: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, selectedModels: [String: String]? = nil, sessionCode: String? = nil, status: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.activeModality = activeModality
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.filterConfig = filterConfig
        self.id = id
        self.lastOpenedAt = lastOpenedAt
        self.lastPrompt = lastPrompt
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.selectedModels = selectedModels
        self.sessionCode = sessionCode
        self.status = status
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct AiMcpBindingRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let serverId: String?
    public let serverRevisionId: String?
    public let status: String?
    public let tenantId: String?
    public let toolId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, serverId: String? = nil, serverRevisionId: String? = nil, status: String? = nil, tenantId: String? = nil, toolId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.serverId = serverId
        self.serverRevisionId = serverRevisionId
        self.status = status
        self.tenantId = tenantId
        self.toolId = toolId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiMcpServerRecord: Codable {
    public let categoryCode: String?
    public let categoryId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let deprecatedAt: String?
    public let description: String?
    public let id: String?
    public let lastCheckedAt: String?
    public let lastErrorMasked: String?
    public let latestRevisionId: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let publishedAt: String?
    public let publishedRevisionId: String?
    public let serverKey: String?
    public let status: String?
    public let tenantId: String?
    public let transport: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let visibility: String?


    public init(categoryCode: String? = nil, categoryId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deprecatedAt: String? = nil, description: String? = nil, id: String? = nil, lastCheckedAt: String? = nil, lastErrorMasked: String? = nil, latestRevisionId: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, publishedAt: String? = nil, publishedRevisionId: String? = nil, serverKey: String? = nil, status: String? = nil, tenantId: String? = nil, transport: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, visibility: String? = nil) {
        self.categoryCode = categoryCode
        self.categoryId = categoryId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.deprecatedAt = deprecatedAt
        self.description = description
        self.id = id
        self.lastCheckedAt = lastCheckedAt
        self.lastErrorMasked = lastErrorMasked
        self.latestRevisionId = latestRevisionId
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.publishedAt = publishedAt
        self.publishedRevisionId = publishedRevisionId
        self.serverKey = serverKey
        self.status = status
        self.tenantId = tenantId
        self.transport = transport
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.visibility = visibility
    }
}

public struct AiMcpServerRevisionRecord: Codable {
    public let command: String?
    public let configHash: String?
    public let createdAt: String?
    public let createdBy: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let deprecatedAt: String?
    public let endpointUrl: String?
    public let id: String?
    public let lifecycleStatus: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let publishedAt: String?
    public let revisionNo: String?
    public let secretRef: String?
    public let serverId: String?
    public let status: String?
    public let tenantId: String?
    public let transport: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(command: String? = nil, configHash: String? = nil, createdAt: String? = nil, createdBy: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deprecatedAt: String? = nil, endpointUrl: String? = nil, id: String? = nil, lifecycleStatus: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, publishedAt: String? = nil, revisionNo: String? = nil, secretRef: String? = nil, serverId: String? = nil, status: String? = nil, tenantId: String? = nil, transport: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.command = command
        self.configHash = configHash
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.deprecatedAt = deprecatedAt
        self.endpointUrl = endpointUrl
        self.id = id
        self.lifecycleStatus = lifecycleStatus
        self.metadata = metadata
        self.organizationId = organizationId
        self.publishedAt = publishedAt
        self.revisionNo = revisionNo
        self.secretRef = secretRef
        self.serverId = serverId
        self.status = status
        self.tenantId = tenantId
        self.transport = transport
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiMcpToolRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let discoveredAt: String?
    public let id: String?
    public let lastInvokedAt: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let schemaHash: String?
    public let serverId: String?
    public let serverRevisionId: String?
    public let status: String?
    public let tenantId: String?
    public let toolKey: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, discoveredAt: String? = nil, id: String? = nil, lastInvokedAt: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, schemaHash: String? = nil, serverId: String? = nil, serverRevisionId: String? = nil, status: String? = nil, tenantId: String? = nil, toolKey: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.discoveredAt = discoveredAt
        self.id = id
        self.lastInvokedAt = lastInvokedAt
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.schemaHash = schemaHash
        self.serverId = serverId
        self.serverRevisionId = serverRevisionId
        self.status = status
        self.tenantId = tenantId
        self.toolKey = toolKey
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiMemoryEmbeddingRecord: Codable {
    public let contentHash: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let embeddingDimensions: Int?
    public let embeddingModel: String?
    public let embeddingProvider: String?
    public let id: String?
    public let indexedAt: String?
    public let memoryId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vectorJson: [String: String]?
    public let vectorStorageKey: String?
    public let version: String?


    public init(contentHash: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, embeddingDimensions: Int? = nil, embeddingModel: String? = nil, embeddingProvider: String? = nil, id: String? = nil, indexedAt: String? = nil, memoryId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vectorJson: [String: String]? = nil, vectorStorageKey: String? = nil, version: String? = nil) {
        self.contentHash = contentHash
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.embeddingDimensions = embeddingDimensions
        self.embeddingModel = embeddingModel
        self.embeddingProvider = embeddingProvider
        self.id = id
        self.indexedAt = indexedAt
        self.memoryId = memoryId
        self.metadata = metadata
        self.organizationId = organizationId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.vectorJson = vectorJson
        self.vectorStorageKey = vectorStorageKey
        self.version = version
    }
}

public struct AiMemoryEntryRecord: Codable {
    public let confidenceScore: String?
    public let contentJson: [String: String]?
    public let contentText: String?
    public let createdAt: String?
    public let createdBy: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let expiresAt: String?
    public let id: String?
    public let importanceScore: String?
    public let lastRecalledAt: String?
    public let memoryCode: String?
    public let memoryType: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let recallCount: String?
    public let sensitivityLevel: String?
    public let sourceConversationId: String?
    public let sourceInvocationId: String?
    public let sourceItemId: String?
    public let sourceKind: String?
    public let sourceTurnId: String?
    public let spaceId: String?
    public let status: String?
    public let subjectKey: String?
    public let subjectType: String?
    public let supersedesMemoryId: String?
    public let tenantId: String?
    public let trustLevel: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let validFrom: String?
    public let validUntil: String?
    public let version: String?
    public let versionNo: String?


    public init(confidenceScore: String? = nil, contentJson: [String: String]? = nil, contentText: String? = nil, createdAt: String? = nil, createdBy: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, expiresAt: String? = nil, id: String? = nil, importanceScore: String? = nil, lastRecalledAt: String? = nil, memoryCode: String? = nil, memoryType: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, recallCount: String? = nil, sensitivityLevel: String? = nil, sourceConversationId: String? = nil, sourceInvocationId: String? = nil, sourceItemId: String? = nil, sourceKind: String? = nil, sourceTurnId: String? = nil, spaceId: String? = nil, status: String? = nil, subjectKey: String? = nil, subjectType: String? = nil, supersedesMemoryId: String? = nil, tenantId: String? = nil, trustLevel: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, validFrom: String? = nil, validUntil: String? = nil, version: String? = nil, versionNo: String? = nil) {
        self.confidenceScore = confidenceScore
        self.contentJson = contentJson
        self.contentText = contentText
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.expiresAt = expiresAt
        self.id = id
        self.importanceScore = importanceScore
        self.lastRecalledAt = lastRecalledAt
        self.memoryCode = memoryCode
        self.memoryType = memoryType
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.recallCount = recallCount
        self.sensitivityLevel = sensitivityLevel
        self.sourceConversationId = sourceConversationId
        self.sourceInvocationId = sourceInvocationId
        self.sourceItemId = sourceItemId
        self.sourceKind = sourceKind
        self.sourceTurnId = sourceTurnId
        self.spaceId = spaceId
        self.status = status
        self.subjectKey = subjectKey
        self.subjectType = subjectType
        self.supersedesMemoryId = supersedesMemoryId
        self.tenantId = tenantId
        self.trustLevel = trustLevel
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.validFrom = validFrom
        self.validUntil = validUntil
        self.version = version
        self.versionNo = versionNo
    }
}

public struct AiMemoryEventRecord: Codable {
    public let actorId: String?
    public let actorType: String?
    public let afterJson: [String: String]?
    public let beforeJson: [String: String]?
    public let conversationId: String?
    public let createdAt: String?
    public let decisionReason: String?
    public let eventType: String?
    public let id: String?
    public let invocationId: String?
    public let legalHold: Bool?
    public let memoryId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let spaceId: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let turnId: String?
    public let userId: String?
    public let uuid: String?


    public init(actorId: String? = nil, actorType: String? = nil, afterJson: [String: String]? = nil, beforeJson: [String: String]? = nil, conversationId: String? = nil, createdAt: String? = nil, decisionReason: String? = nil, eventType: String? = nil, id: String? = nil, invocationId: String? = nil, legalHold: Bool? = nil, memoryId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, spaceId: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, turnId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.actorId = actorId
        self.actorType = actorType
        self.afterJson = afterJson
        self.beforeJson = beforeJson
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.decisionReason = decisionReason
        self.eventType = eventType
        self.id = id
        self.invocationId = invocationId
        self.legalHold = legalHold
        self.memoryId = memoryId
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.spaceId = spaceId
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.turnId = turnId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiMemoryLinkRecord: Codable {
    public let agentRunId: String?
    public let agentRunStepId: String?
    public let agentSessionId: String?
    public let chatItemId: String?
    public let chatTurnId: String?
    public let conversationId: String?
    public let createdAt: String?
    public let id: String?
    public let injectedTextSnapshot: String?
    public let legalHold: Bool?
    public let linkType: String?
    public let memoryId: String?
    public let memorySpaceId: String?
    public let messageId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let policyDecision: String?
    public let recallQuery: String?
    public let recallRank: Int?
    public let recallScore: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let runtimeInvocationId: String?
    public let status: String?
    public let tenantId: String?
    public let tokenCount: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(agentRunId: String? = nil, agentRunStepId: String? = nil, agentSessionId: String? = nil, chatItemId: String? = nil, chatTurnId: String? = nil, conversationId: String? = nil, createdAt: String? = nil, id: String? = nil, injectedTextSnapshot: String? = nil, legalHold: Bool? = nil, linkType: String? = nil, memoryId: String? = nil, memorySpaceId: String? = nil, messageId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, policyDecision: String? = nil, recallQuery: String? = nil, recallRank: Int? = nil, recallScore: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runtimeInvocationId: String? = nil, status: String? = nil, tenantId: String? = nil, tokenCount: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.agentRunId = agentRunId
        self.agentRunStepId = agentRunStepId
        self.agentSessionId = agentSessionId
        self.chatItemId = chatItemId
        self.chatTurnId = chatTurnId
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.id = id
        self.injectedTextSnapshot = injectedTextSnapshot
        self.legalHold = legalHold
        self.linkType = linkType
        self.memoryId = memoryId
        self.memorySpaceId = memorySpaceId
        self.messageId = messageId
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.policyDecision = policyDecision
        self.recallQuery = recallQuery
        self.recallRank = recallRank
        self.recallScore = recallScore
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.runtimeInvocationId = runtimeInvocationId
        self.status = status
        self.tenantId = tenantId
        self.tokenCount = tokenCount
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiMemorySpaceBindingRecord: Codable {
    public let bindingId: String?
    public let bindingRole: String?
    public let bindingType: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let enabled: Bool?
    public let id: String?
    public let memorySpaceId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let priority: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(bindingId: String? = nil, bindingRole: String? = nil, bindingType: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, enabled: Bool? = nil, id: String? = nil, memorySpaceId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, priority: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.bindingId = bindingId
        self.bindingRole = bindingRole
        self.bindingType = bindingType
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.enabled = enabled
        self.id = id
        self.memorySpaceId = memorySpaceId
        self.metadata = metadata
        self.organizationId = organizationId
        self.priority = priority
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiMemorySpaceRecord: Codable {
    public let autoExtractEnabled: Bool?
    public let autoRecallEnabled: Bool?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let entryCount: String?
    public let id: String?
    public let maxInjectedTokens: String?
    public let memoryEnabled: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let retentionPolicy: [String: String]?
    public let reviewRequired: Bool?
    public let sensitivityPolicy: [String: String]?
    public let spaceType: String?
    public let status: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(autoExtractEnabled: Bool? = nil, autoRecallEnabled: Bool? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, entryCount: String? = nil, id: String? = nil, maxInjectedTokens: String? = nil, memoryEnabled: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, retentionPolicy: [String: String]? = nil, reviewRequired: Bool? = nil, sensitivityPolicy: [String: String]? = nil, spaceType: String? = nil, status: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.autoExtractEnabled = autoExtractEnabled
        self.autoRecallEnabled = autoRecallEnabled
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.entryCount = entryCount
        self.id = id
        self.maxInjectedTokens = maxInjectedTokens
        self.memoryEnabled = memoryEnabled
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.retentionPolicy = retentionPolicy
        self.reviewRequired = reviewRequired
        self.sensitivityPolicy = sensitivityPolicy
        self.spaceType = spaceType
        self.status = status
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct AiModelCapabilityRecord: Codable {
    public let capability: String?
    public let capabilityCode: String?
    public let catalogKey: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let endpointFormats: [String: String]?
    public let id: String?
    public let inputModalities: [String: String]?
    public let limitUnit: String?
    public let limitValue: String?
    public let metadata: [String: String]?
    public let modality: String?
    public let model: String?
    public let modelId: String?
    public let organizationId: String?
    public let outputModalities: [String: String]?
    public let parameterName: String?
    public let parameterSchema: [String: String]?
    public let schemaVersion: String?
    public let sortOrder: Int?
    public let status: String?
    public let supported: Bool?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vendorCode: String?
    public let version: String?


    public init(capability: String? = nil, capabilityCode: String? = nil, catalogKey: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, endpointFormats: [String: String]? = nil, id: String? = nil, inputModalities: [String: String]? = nil, limitUnit: String? = nil, limitValue: String? = nil, metadata: [String: String]? = nil, modality: String? = nil, model: String? = nil, modelId: String? = nil, organizationId: String? = nil, outputModalities: [String: String]? = nil, parameterName: String? = nil, parameterSchema: [String: String]? = nil, schemaVersion: String? = nil, sortOrder: Int? = nil, status: String? = nil, supported: Bool? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vendorCode: String? = nil, version: String? = nil) {
        self.capability = capability
        self.capabilityCode = capabilityCode
        self.catalogKey = catalogKey
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.endpointFormats = endpointFormats
        self.id = id
        self.inputModalities = inputModalities
        self.limitUnit = limitUnit
        self.limitValue = limitValue
        self.metadata = metadata
        self.modality = modality
        self.model = model
        self.modelId = modelId
        self.organizationId = organizationId
        self.outputModalities = outputModalities
        self.parameterName = parameterName
        self.parameterSchema = parameterSchema
        self.schemaVersion = schemaVersion
        self.sortOrder = sortOrder
        self.status = status
        self.supported = supported
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.vendorCode = vendorCode
        self.version = version
    }
}

public struct AiModelCatalogSourceRecord: Codable {
    public let catalogVersion: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let errorMessageMasked: String?
    public let id: String?
    public let lastObservedAt: String?
    public let lastSuccessAt: String?
    public let metadata: [String: String]?
    public let normalizedPayloadHash: String?
    public let organizationId: String?
    public let parserKind: String?
    public let providerCode: String?
    public let rawPayloadRef: String?
    public let refreshIntervalSeconds: String?
    public let regionCode: String?
    public let schemaVersion: String?
    public let sourceCode: String?
    public let sourceHash: String?
    public let sourceKind: String?
    public let sourceName: String?
    public let sourceUrl: String?
    public let status: String?
    public let tenantId: String?
    public let trustLevel: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vendorCode: String?
    public let version: String?


    public init(catalogVersion: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, errorMessageMasked: String? = nil, id: String? = nil, lastObservedAt: String? = nil, lastSuccessAt: String? = nil, metadata: [String: String]? = nil, normalizedPayloadHash: String? = nil, organizationId: String? = nil, parserKind: String? = nil, providerCode: String? = nil, rawPayloadRef: String? = nil, refreshIntervalSeconds: String? = nil, regionCode: String? = nil, schemaVersion: String? = nil, sourceCode: String? = nil, sourceHash: String? = nil, sourceKind: String? = nil, sourceName: String? = nil, sourceUrl: String? = nil, status: String? = nil, tenantId: String? = nil, trustLevel: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vendorCode: String? = nil, version: String? = nil) {
        self.catalogVersion = catalogVersion
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.errorMessageMasked = errorMessageMasked
        self.id = id
        self.lastObservedAt = lastObservedAt
        self.lastSuccessAt = lastSuccessAt
        self.metadata = metadata
        self.normalizedPayloadHash = normalizedPayloadHash
        self.organizationId = organizationId
        self.parserKind = parserKind
        self.providerCode = providerCode
        self.rawPayloadRef = rawPayloadRef
        self.refreshIntervalSeconds = refreshIntervalSeconds
        self.regionCode = regionCode
        self.schemaVersion = schemaVersion
        self.sourceCode = sourceCode
        self.sourceHash = sourceHash
        self.sourceKind = sourceKind
        self.sourceName = sourceName
        self.sourceUrl = sourceUrl
        self.status = status
        self.tenantId = tenantId
        self.trustLevel = trustLevel
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.vendorCode = vendorCode
        self.version = version
    }
}

public struct AiModelCatalogSyncRunRecord: Codable {
    public let acceptedCount: String?
    public let catalogVersion: String?
    public let changeSummary: [String: String]?
    public let createdAt: String?
    public let errorMessageMasked: String?
    public let finishedAt: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let observedAt: String?
    public let observedMeterCount: String?
    public let observedModelCount: String?
    public let observedPriceCount: String?
    public let observedVendorCount: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let providerCode: String?
    public let regionCode: String?
    public let rejectedCount: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let runStatus: String?
    public let skippedCount: String?
    public let sourceCode: String?
    public let sourceHash: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let startedAt: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?
    public let vendorCode: String?


    public init(acceptedCount: String? = nil, catalogVersion: String? = nil, changeSummary: [String: String]? = nil, createdAt: String? = nil, errorMessageMasked: String? = nil, finishedAt: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, observedAt: String? = nil, observedMeterCount: String? = nil, observedModelCount: String? = nil, observedPriceCount: String? = nil, observedVendorCount: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, providerCode: String? = nil, regionCode: String? = nil, rejectedCount: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runStatus: String? = nil, skippedCount: String? = nil, sourceCode: String? = nil, sourceHash: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, startedAt: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil, vendorCode: String? = nil) {
        self.acceptedCount = acceptedCount
        self.catalogVersion = catalogVersion
        self.changeSummary = changeSummary
        self.createdAt = createdAt
        self.errorMessageMasked = errorMessageMasked
        self.finishedAt = finishedAt
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.observedAt = observedAt
        self.observedMeterCount = observedMeterCount
        self.observedModelCount = observedModelCount
        self.observedPriceCount = observedPriceCount
        self.observedVendorCount = observedVendorCount
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.providerCode = providerCode
        self.regionCode = regionCode
        self.rejectedCount = rejectedCount
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.runStatus = runStatus
        self.skippedCount = skippedCount
        self.sourceCode = sourceCode
        self.sourceHash = sourceHash
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.startedAt = startedAt
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
        self.vendorCode = vendorCode
    }
}

public struct AiModelFamilyRecord: Codable {
    public let colorToken: String?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultModel: String?
    public let defaultModelId: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let displayName: String?
    public let docsUrl: String?
    public let familyCode: String?
    public let familyType: String?
    public let iconUrl: String?
    public let id: String?
    public let metadata: [String: String]?
    public let modelCount: String?
    public let organizationId: String?
    public let primaryModality: String?
    public let regionCode: String?
    public let sortOrder: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vendorCode: String?
    public let vendorId: String?
    public let version: String?


    public init(colorToken: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultModel: String? = nil, defaultModelId: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, displayName: String? = nil, docsUrl: String? = nil, familyCode: String? = nil, familyType: String? = nil, iconUrl: String? = nil, id: String? = nil, metadata: [String: String]? = nil, modelCount: String? = nil, organizationId: String? = nil, primaryModality: String? = nil, regionCode: String? = nil, sortOrder: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vendorCode: String? = nil, vendorId: String? = nil, version: String? = nil) {
        self.colorToken = colorToken
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultModel = defaultModel
        self.defaultModelId = defaultModelId
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.displayName = displayName
        self.docsUrl = docsUrl
        self.familyCode = familyCode
        self.familyType = familyType
        self.iconUrl = iconUrl
        self.id = id
        self.metadata = metadata
        self.modelCount = modelCount
        self.organizationId = organizationId
        self.primaryModality = primaryModality
        self.regionCode = regionCode
        self.sortOrder = sortOrder
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.vendorCode = vendorCode
        self.vendorId = vendorId
        self.version = version
    }
}

public struct AiModelPricingRecord: Codable {
    public let billingMeterCode: String?
    public let billingMeterId: String?
    public let billingMode: String?
    public let billingType: String?
    public let catalogKey: String?
    public let channelId: String?
    public let createdAt: String?
    public let currency: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let importSnapshotId: String?
    public let includedQuantity: String?
    public let markupAmount: String?
    public let metadata: [String: String]?
    public let meteringMode: String?
    public let minChargeAmount: String?
    public let minimumQuantity: String?
    public let model: String?
    public let modelId: String?
    public let observedAt: String?
    public let organizationId: String?
    public let platformCode: String?
    public let priceItemType: String?
    public let priceOrigin: String?
    public let priceSide: String?
    public let priceVersion: String?
    public let pricingFormulaMode: String?
    public let pricingPlanCode: String?
    public let pricingPlanId: String?
    public let pricingScope: String?
    public let pricingScopeId: String?
    public let priority: Int?
    public let providerCode: String?
    public let providerModel: String?
    public let publishedAt: String?
    public let quantityFormula: String?
    public let quantitySource: String?
    public let quantityStep: String?
    public let referenceMultiplier: String?
    public let referencePriceId: String?
    public let referencePriceSide: String?
    public let regionCode: String?
    public let resultSelector: String?
    public let roundingMode: String?
    public let serviceTier: String?
    public let sourceHash: String?
    public let sourcePriceId: String?
    public let sourceUrl: String?
    public let status: String?
    public let tenantId: String?
    public let unit: String?
    public let unitPrice: String?
    public let unitSize: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vendorCode: String?
    public let version: String?


    public init(billingMeterCode: String? = nil, billingMeterId: String? = nil, billingMode: String? = nil, billingType: String? = nil, catalogKey: String? = nil, channelId: String? = nil, createdAt: String? = nil, currency: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, importSnapshotId: String? = nil, includedQuantity: String? = nil, markupAmount: String? = nil, metadata: [String: String]? = nil, meteringMode: String? = nil, minChargeAmount: String? = nil, minimumQuantity: String? = nil, model: String? = nil, modelId: String? = nil, observedAt: String? = nil, organizationId: String? = nil, platformCode: String? = nil, priceItemType: String? = nil, priceOrigin: String? = nil, priceSide: String? = nil, priceVersion: String? = nil, pricingFormulaMode: String? = nil, pricingPlanCode: String? = nil, pricingPlanId: String? = nil, pricingScope: String? = nil, pricingScopeId: String? = nil, priority: Int? = nil, providerCode: String? = nil, providerModel: String? = nil, publishedAt: String? = nil, quantityFormula: String? = nil, quantitySource: String? = nil, quantityStep: String? = nil, referenceMultiplier: String? = nil, referencePriceId: String? = nil, referencePriceSide: String? = nil, regionCode: String? = nil, resultSelector: String? = nil, roundingMode: String? = nil, serviceTier: String? = nil, sourceHash: String? = nil, sourcePriceId: String? = nil, sourceUrl: String? = nil, status: String? = nil, tenantId: String? = nil, unit: String? = nil, unitPrice: String? = nil, unitSize: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vendorCode: String? = nil, version: String? = nil) {
        self.billingMeterCode = billingMeterCode
        self.billingMeterId = billingMeterId
        self.billingMode = billingMode
        self.billingType = billingType
        self.catalogKey = catalogKey
        self.channelId = channelId
        self.createdAt = createdAt
        self.currency = currency
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.importSnapshotId = importSnapshotId
        self.includedQuantity = includedQuantity
        self.markupAmount = markupAmount
        self.metadata = metadata
        self.meteringMode = meteringMode
        self.minChargeAmount = minChargeAmount
        self.minimumQuantity = minimumQuantity
        self.model = model
        self.modelId = modelId
        self.observedAt = observedAt
        self.organizationId = organizationId
        self.platformCode = platformCode
        self.priceItemType = priceItemType
        self.priceOrigin = priceOrigin
        self.priceSide = priceSide
        self.priceVersion = priceVersion
        self.pricingFormulaMode = pricingFormulaMode
        self.pricingPlanCode = pricingPlanCode
        self.pricingPlanId = pricingPlanId
        self.pricingScope = pricingScope
        self.pricingScopeId = pricingScopeId
        self.priority = priority
        self.providerCode = providerCode
        self.providerModel = providerModel
        self.publishedAt = publishedAt
        self.quantityFormula = quantityFormula
        self.quantitySource = quantitySource
        self.quantityStep = quantityStep
        self.referenceMultiplier = referenceMultiplier
        self.referencePriceId = referencePriceId
        self.referencePriceSide = referencePriceSide
        self.regionCode = regionCode
        self.resultSelector = resultSelector
        self.roundingMode = roundingMode
        self.serviceTier = serviceTier
        self.sourceHash = sourceHash
        self.sourcePriceId = sourcePriceId
        self.sourceUrl = sourceUrl
        self.status = status
        self.tenantId = tenantId
        self.unit = unit
        self.unitPrice = unitPrice
        self.unitSize = unitSize
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.vendorCode = vendorCode
        self.version = version
    }
}

public struct AiModelRankSnapshotRecord: Codable {
    public let baseVolume: String?
    public let catalogKey: String?
    public let colorToken: String?
    public let contextSizeText: String?
    public let costAmount: String?
    public let costIndicator: Int?
    public let createdAt: String?
    public let currency: String?
    public let id: String?
    public let isNew: Bool?
    public let latencyP50Ms: Int?
    public let latencyP95Ms: Int?
    public let licenseType: String?
    public let metadata: [String: String]?
    public let modality: String?
    public let model: String?
    public let modelId: String?
    public let organizationId: String?
    public let previousRankNo: Int?
    public let pricingText: String?
    public let providerCode: String?
    public let rankNo: Int?
    public let rankPayload: [String: String]?
    public let rankScope: String?
    public let rebuildVersion: String?
    public let regionCode: String?
    public let requestCount: String?
    public let snapshotDate: String?
    public let snapshotPeriod: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let status: String?
    public let strengths: [String: String]?
    public let successRate: String?
    public let tenantId: String?
    public let tokenCount: String?
    public let trendScore: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vendorCode: String?
    public let vendorNameSnapshot: String?
    public let winRate: String?


    public init(baseVolume: String? = nil, catalogKey: String? = nil, colorToken: String? = nil, contextSizeText: String? = nil, costAmount: String? = nil, costIndicator: Int? = nil, createdAt: String? = nil, currency: String? = nil, id: String? = nil, isNew: Bool? = nil, latencyP50Ms: Int? = nil, latencyP95Ms: Int? = nil, licenseType: String? = nil, metadata: [String: String]? = nil, modality: String? = nil, model: String? = nil, modelId: String? = nil, organizationId: String? = nil, previousRankNo: Int? = nil, pricingText: String? = nil, providerCode: String? = nil, rankNo: Int? = nil, rankPayload: [String: String]? = nil, rankScope: String? = nil, rebuildVersion: String? = nil, regionCode: String? = nil, requestCount: String? = nil, snapshotDate: String? = nil, snapshotPeriod: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, status: String? = nil, strengths: [String: String]? = nil, successRate: String? = nil, tenantId: String? = nil, tokenCount: String? = nil, trendScore: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vendorCode: String? = nil, vendorNameSnapshot: String? = nil, winRate: String? = nil) {
        self.baseVolume = baseVolume
        self.catalogKey = catalogKey
        self.colorToken = colorToken
        self.contextSizeText = contextSizeText
        self.costAmount = costAmount
        self.costIndicator = costIndicator
        self.createdAt = createdAt
        self.currency = currency
        self.id = id
        self.isNew = isNew
        self.latencyP50Ms = latencyP50Ms
        self.latencyP95Ms = latencyP95Ms
        self.licenseType = licenseType
        self.metadata = metadata
        self.modality = modality
        self.model = model
        self.modelId = modelId
        self.organizationId = organizationId
        self.previousRankNo = previousRankNo
        self.pricingText = pricingText
        self.providerCode = providerCode
        self.rankNo = rankNo
        self.rankPayload = rankPayload
        self.rankScope = rankScope
        self.rebuildVersion = rebuildVersion
        self.regionCode = regionCode
        self.requestCount = requestCount
        self.snapshotDate = snapshotDate
        self.snapshotPeriod = snapshotPeriod
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.status = status
        self.strengths = strengths
        self.successRate = successRate
        self.tenantId = tenantId
        self.tokenCount = tokenCount
        self.trendScore = trendScore
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.vendorCode = vendorCode
        self.vendorNameSnapshot = vendorNameSnapshot
        self.winRate = winRate
    }
}

public struct AiModelRecord: Codable {
    public let apiFormat: String?
    public let capabilities: [String: String]?
    public let capability: String?
    public let capabilityIntro: String?
    public let catalogKey: String?
    public let colorToken: String?
    public let contextTokens: String?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultPricingId: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let deprecatedAt: String?
    public let description: String?
    public let displayName: String?
    public let docsUrl: String?
    public let familyCode: String?
    public let familyId: String?
    public let iconUrl: String?
    public let id: String?
    public let inputModalities: [String: String]?
    public let licenseType: String?
    public let limitations: [String: String]?
    public let maxDurationSeconds: Int?
    public let maxInputTokens: String?
    public let maxOutputTokens: String?
    public let metadata: [String: String]?
    public let modalities: [String: String]?
    public let model: String?
    public let modelAliases: [String: String]?
    public let modelFamily: String?
    public let modelVersion: String?
    public let organizationId: String?
    public let outputModalities: [String: String]?
    public let performanceProfile: [String: String]?
    public let providerHint: String?
    public let rankScore: String?
    public let releaseStage: String?
    public let replacementModel: String?
    public let retiredAt: String?
    public let routingState: String?
    public let shelfState: String?
    public let status: String?
    public let supportedLanguages: [String: String]?
    public let supportsJsonSchema: Bool?
    public let supportsStreaming: Bool?
    public let supportsTools: Bool?
    public let tenantId: String?
    public let trainingDataCutoff: String?
    public let updatedAt: String?
    public let useCases: [String: String]?
    public let uuid: String?
    public let vendorCode: String?
    public let vendorId: String?
    public let vendorNameSnapshot: String?
    public let version: String?


    public init(apiFormat: String? = nil, capabilities: [String: String]? = nil, capability: String? = nil, capabilityIntro: String? = nil, catalogKey: String? = nil, colorToken: String? = nil, contextTokens: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultPricingId: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deprecatedAt: String? = nil, description: String? = nil, displayName: String? = nil, docsUrl: String? = nil, familyCode: String? = nil, familyId: String? = nil, iconUrl: String? = nil, id: String? = nil, inputModalities: [String: String]? = nil, licenseType: String? = nil, limitations: [String: String]? = nil, maxDurationSeconds: Int? = nil, maxInputTokens: String? = nil, maxOutputTokens: String? = nil, metadata: [String: String]? = nil, modalities: [String: String]? = nil, model: String? = nil, modelAliases: [String: String]? = nil, modelFamily: String? = nil, modelVersion: String? = nil, organizationId: String? = nil, outputModalities: [String: String]? = nil, performanceProfile: [String: String]? = nil, providerHint: String? = nil, rankScore: String? = nil, releaseStage: String? = nil, replacementModel: String? = nil, retiredAt: String? = nil, routingState: String? = nil, shelfState: String? = nil, status: String? = nil, supportedLanguages: [String: String]? = nil, supportsJsonSchema: Bool? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, tenantId: String? = nil, trainingDataCutoff: String? = nil, updatedAt: String? = nil, useCases: [String: String]? = nil, uuid: String? = nil, vendorCode: String? = nil, vendorId: String? = nil, vendorNameSnapshot: String? = nil, version: String? = nil) {
        self.apiFormat = apiFormat
        self.capabilities = capabilities
        self.capability = capability
        self.capabilityIntro = capabilityIntro
        self.catalogKey = catalogKey
        self.colorToken = colorToken
        self.contextTokens = contextTokens
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultPricingId = defaultPricingId
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.deprecatedAt = deprecatedAt
        self.description = description
        self.displayName = displayName
        self.docsUrl = docsUrl
        self.familyCode = familyCode
        self.familyId = familyId
        self.iconUrl = iconUrl
        self.id = id
        self.inputModalities = inputModalities
        self.licenseType = licenseType
        self.limitations = limitations
        self.maxDurationSeconds = maxDurationSeconds
        self.maxInputTokens = maxInputTokens
        self.maxOutputTokens = maxOutputTokens
        self.metadata = metadata
        self.modalities = modalities
        self.model = model
        self.modelAliases = modelAliases
        self.modelFamily = modelFamily
        self.modelVersion = modelVersion
        self.organizationId = organizationId
        self.outputModalities = outputModalities
        self.performanceProfile = performanceProfile
        self.providerHint = providerHint
        self.rankScore = rankScore
        self.releaseStage = releaseStage
        self.replacementModel = replacementModel
        self.retiredAt = retiredAt
        self.routingState = routingState
        self.shelfState = shelfState
        self.status = status
        self.supportedLanguages = supportedLanguages
        self.supportsJsonSchema = supportsJsonSchema
        self.supportsStreaming = supportsStreaming
        self.supportsTools = supportsTools
        self.tenantId = tenantId
        self.trainingDataCutoff = trainingDataCutoff
        self.updatedAt = updatedAt
        self.useCases = useCases
        self.uuid = uuid
        self.vendorCode = vendorCode
        self.vendorId = vendorId
        self.vendorNameSnapshot = vendorNameSnapshot
        self.version = version
    }
}

public struct AiModelVendorRecord: Codable {
    public let capabilities: [String: String]?
    public let colorToken: String?
    public let countryRegion: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let displayName: String?
    public let docsUrl: String?
    public let iconUrl: String?
    public let id: String?
    public let legalName: String?
    public let logoUrl: String?
    public let metadata: [String: String]?
    public let modelFamilies: [String: String]?
    public let openSource: Bool?
    public let organizationId: String?
    public let sortOrder: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vendorCode: String?
    public let vendorType: String?
    public let version: String?
    public let websiteUrl: String?


    public init(capabilities: [String: String]? = nil, colorToken: String? = nil, countryRegion: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, displayName: String? = nil, docsUrl: String? = nil, iconUrl: String? = nil, id: String? = nil, legalName: String? = nil, logoUrl: String? = nil, metadata: [String: String]? = nil, modelFamilies: [String: String]? = nil, openSource: Bool? = nil, organizationId: String? = nil, sortOrder: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vendorCode: String? = nil, vendorType: String? = nil, version: String? = nil, websiteUrl: String? = nil) {
        self.capabilities = capabilities
        self.colorToken = colorToken
        self.countryRegion = countryRegion
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.displayName = displayName
        self.docsUrl = docsUrl
        self.iconUrl = iconUrl
        self.id = id
        self.legalName = legalName
        self.logoUrl = logoUrl
        self.metadata = metadata
        self.modelFamilies = modelFamilies
        self.openSource = openSource
        self.organizationId = organizationId
        self.sortOrder = sortOrder
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.vendorCode = vendorCode
        self.vendorType = vendorType
        self.version = version
        self.websiteUrl = websiteUrl
    }
}

public struct AiModelVendorRegionRecord: Codable {
    public let billingCurrency: String?
    public let billingJurisdiction: String?
    public let capabilities: [String: String]?
    public let countryRegion: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let displayName: String?
    public let docsUrl: String?
    public let id: String?
    public let legalName: String?
    public let marketScope: String?
    public let metadata: [String: String]?
    public let openSource: Bool?
    public let operatingRegions: [String: String]?
    public let organizationId: String?
    public let regionCode: String?
    public let sortOrder: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vendorCode: String?
    public let vendorId: String?
    public let version: String?
    public let websiteUrl: String?


    public init(billingCurrency: String? = nil, billingJurisdiction: String? = nil, capabilities: [String: String]? = nil, countryRegion: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, displayName: String? = nil, docsUrl: String? = nil, id: String? = nil, legalName: String? = nil, marketScope: String? = nil, metadata: [String: String]? = nil, openSource: Bool? = nil, operatingRegions: [String: String]? = nil, organizationId: String? = nil, regionCode: String? = nil, sortOrder: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vendorCode: String? = nil, vendorId: String? = nil, version: String? = nil, websiteUrl: String? = nil) {
        self.billingCurrency = billingCurrency
        self.billingJurisdiction = billingJurisdiction
        self.capabilities = capabilities
        self.countryRegion = countryRegion
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.displayName = displayName
        self.docsUrl = docsUrl
        self.id = id
        self.legalName = legalName
        self.marketScope = marketScope
        self.metadata = metadata
        self.openSource = openSource
        self.operatingRegions = operatingRegions
        self.organizationId = organizationId
        self.regionCode = regionCode
        self.sortOrder = sortOrder
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.vendorCode = vendorCode
        self.vendorId = vendorId
        self.version = version
        self.websiteUrl = websiteUrl
    }
}

public struct AiPricingImportSnapshotRecord: Codable {
    public let acceptedCount: String?
    public let createdAt: String?
    public let currency: String?
    public let dataFormat: String?
    public let errorMessageMasked: String?
    public let id: String?
    public let importSource: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let normalizedPayloadHash: String?
    public let observedAt: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let publishedAt: String?
    public let rawPayloadRef: String?
    public let rejectedCount: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let rowCount: String?
    public let schemaVersion: String?
    public let sourceHash: String?
    public let sourceName: String?
    public let sourceUrl: String?
    public let sourceVersion: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let upstreamCommit: String?
    public let userId: String?
    public let uuid: String?


    public init(acceptedCount: String? = nil, createdAt: String? = nil, currency: String? = nil, dataFormat: String? = nil, errorMessageMasked: String? = nil, id: String? = nil, importSource: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, normalizedPayloadHash: String? = nil, observedAt: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, publishedAt: String? = nil, rawPayloadRef: String? = nil, rejectedCount: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, rowCount: String? = nil, schemaVersion: String? = nil, sourceHash: String? = nil, sourceName: String? = nil, sourceUrl: String? = nil, sourceVersion: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, upstreamCommit: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.acceptedCount = acceptedCount
        self.createdAt = createdAt
        self.currency = currency
        self.dataFormat = dataFormat
        self.errorMessageMasked = errorMessageMasked
        self.id = id
        self.importSource = importSource
        self.legalHold = legalHold
        self.metadata = metadata
        self.normalizedPayloadHash = normalizedPayloadHash
        self.observedAt = observedAt
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.publishedAt = publishedAt
        self.rawPayloadRef = rawPayloadRef
        self.rejectedCount = rejectedCount
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.rowCount = rowCount
        self.schemaVersion = schemaVersion
        self.sourceHash = sourceHash
        self.sourceName = sourceName
        self.sourceUrl = sourceUrl
        self.sourceVersion = sourceVersion
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.upstreamCommit = upstreamCommit
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiPricingPlanBindingRecord: Codable {
    public let bindingSource: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let metadata: [String: String]?
    public let multiplierOverride: String?
    public let organizationId: String?
    public let pricingPlanCode: String?
    public let pricingPlanId: String?
    public let priority: Int?
    public let quotaPolicyId: String?
    public let rpmOverride: String?
    public let status: String?
    public let subjectCode: String?
    public let subjectId: String?
    public let subjectType: String?
    public let tenantId: String?
    public let tpmOverride: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(bindingSource: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, metadata: [String: String]? = nil, multiplierOverride: String? = nil, organizationId: String? = nil, pricingPlanCode: String? = nil, pricingPlanId: String? = nil, priority: Int? = nil, quotaPolicyId: String? = nil, rpmOverride: String? = nil, status: String? = nil, subjectCode: String? = nil, subjectId: String? = nil, subjectType: String? = nil, tenantId: String? = nil, tpmOverride: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.bindingSource = bindingSource
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.metadata = metadata
        self.multiplierOverride = multiplierOverride
        self.organizationId = organizationId
        self.pricingPlanCode = pricingPlanCode
        self.pricingPlanId = pricingPlanId
        self.priority = priority
        self.quotaPolicyId = quotaPolicyId
        self.rpmOverride = rpmOverride
        self.status = status
        self.subjectCode = subjectCode
        self.subjectId = subjectId
        self.subjectType = subjectType
        self.tenantId = tenantId
        self.tpmOverride = tpmOverride
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiPricingPlanRecord: Codable {
    public let basePriceSide: String?
    public let basePricingScope: String?
    public let billingMode: String?
    public let createdAt: String?
    public let currency: String?
    public let dataScope: String?
    public let defaultMarkupAmount: String?
    public let defaultMultiplier: String?
    public let defaultReferencePriceId: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let fallbackMode: String?
    public let id: String?
    public let metadata: [String: String]?
    public let minChargeAmount: String?
    public let organizationId: String?
    public let planCode: String?
    public let planName: String?
    public let planScope: String?
    public let priceVersion: String?
    public let priority: Int?
    public let roundingMode: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(basePriceSide: String? = nil, basePricingScope: String? = nil, billingMode: String? = nil, createdAt: String? = nil, currency: String? = nil, dataScope: String? = nil, defaultMarkupAmount: String? = nil, defaultMultiplier: String? = nil, defaultReferencePriceId: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, fallbackMode: String? = nil, id: String? = nil, metadata: [String: String]? = nil, minChargeAmount: String? = nil, organizationId: String? = nil, planCode: String? = nil, planName: String? = nil, planScope: String? = nil, priceVersion: String? = nil, priority: Int? = nil, roundingMode: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.basePriceSide = basePriceSide
        self.basePricingScope = basePricingScope
        self.billingMode = billingMode
        self.createdAt = createdAt
        self.currency = currency
        self.dataScope = dataScope
        self.defaultMarkupAmount = defaultMarkupAmount
        self.defaultMultiplier = defaultMultiplier
        self.defaultReferencePriceId = defaultReferencePriceId
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.fallbackMode = fallbackMode
        self.id = id
        self.metadata = metadata
        self.minChargeAmount = minChargeAmount
        self.organizationId = organizationId
        self.planCode = planCode
        self.planName = planName
        self.planScope = planScope
        self.priceVersion = priceVersion
        self.priority = priority
        self.roundingMode = roundingMode
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiPricingRuleRecord: Codable {
    public let billingMeterCode: String?
    public let billingMeterId: String?
    public let billingMode: String?
    public let billingType: String?
    public let capabilityCode: String?
    public let channelId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let expression: String?
    public let expressionHash: String?
    public let fallbackMode: String?
    public let familyCode: String?
    public let formulaMode: String?
    public let id: String?
    public let includedQuantity: String?
    public let markupAmount: String?
    public let matchType: String?
    public let metadata: [String: String]?
    public let meteringMode: String?
    public let minimumQuantity: String?
    public let model: String?
    public let modelId: String?
    public let multiplier: String?
    public let organizationId: String?
    public let platformCode: String?
    public let priceItemType: String?
    public let priceSide: String?
    public let pricingPlanCode: String?
    public let pricingPlanId: String?
    public let priority: Int?
    public let providerCode: String?
    public let providerModel: String?
    public let quantityFormula: String?
    public let quantitySource: String?
    public let quantityStep: String?
    public let referencePriceSide: String?
    public let referencePricingId: String?
    public let referencePricingScope: String?
    public let region: String?
    public let resultSelector: String?
    public let ruleCode: String?
    public let ruleName: String?
    public let serviceTier: String?
    public let status: String?
    public let tenantId: String?
    public let unit: String?
    public let unitPriceOverride: String?
    public let unitSize: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vendorCode: String?
    public let version: String?


    public init(billingMeterCode: String? = nil, billingMeterId: String? = nil, billingMode: String? = nil, billingType: String? = nil, capabilityCode: String? = nil, channelId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, expression: String? = nil, expressionHash: String? = nil, fallbackMode: String? = nil, familyCode: String? = nil, formulaMode: String? = nil, id: String? = nil, includedQuantity: String? = nil, markupAmount: String? = nil, matchType: String? = nil, metadata: [String: String]? = nil, meteringMode: String? = nil, minimumQuantity: String? = nil, model: String? = nil, modelId: String? = nil, multiplier: String? = nil, organizationId: String? = nil, platformCode: String? = nil, priceItemType: String? = nil, priceSide: String? = nil, pricingPlanCode: String? = nil, pricingPlanId: String? = nil, priority: Int? = nil, providerCode: String? = nil, providerModel: String? = nil, quantityFormula: String? = nil, quantitySource: String? = nil, quantityStep: String? = nil, referencePriceSide: String? = nil, referencePricingId: String? = nil, referencePricingScope: String? = nil, region: String? = nil, resultSelector: String? = nil, ruleCode: String? = nil, ruleName: String? = nil, serviceTier: String? = nil, status: String? = nil, tenantId: String? = nil, unit: String? = nil, unitPriceOverride: String? = nil, unitSize: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vendorCode: String? = nil, version: String? = nil) {
        self.billingMeterCode = billingMeterCode
        self.billingMeterId = billingMeterId
        self.billingMode = billingMode
        self.billingType = billingType
        self.capabilityCode = capabilityCode
        self.channelId = channelId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.expression = expression
        self.expressionHash = expressionHash
        self.fallbackMode = fallbackMode
        self.familyCode = familyCode
        self.formulaMode = formulaMode
        self.id = id
        self.includedQuantity = includedQuantity
        self.markupAmount = markupAmount
        self.matchType = matchType
        self.metadata = metadata
        self.meteringMode = meteringMode
        self.minimumQuantity = minimumQuantity
        self.model = model
        self.modelId = modelId
        self.multiplier = multiplier
        self.organizationId = organizationId
        self.platformCode = platformCode
        self.priceItemType = priceItemType
        self.priceSide = priceSide
        self.pricingPlanCode = pricingPlanCode
        self.pricingPlanId = pricingPlanId
        self.priority = priority
        self.providerCode = providerCode
        self.providerModel = providerModel
        self.quantityFormula = quantityFormula
        self.quantitySource = quantitySource
        self.quantityStep = quantityStep
        self.referencePriceSide = referencePriceSide
        self.referencePricingId = referencePricingId
        self.referencePricingScope = referencePricingScope
        self.region = region
        self.resultSelector = resultSelector
        self.ruleCode = ruleCode
        self.ruleName = ruleName
        self.serviceTier = serviceTier
        self.status = status
        self.tenantId = tenantId
        self.unit = unit
        self.unitPriceOverride = unitPriceOverride
        self.unitSize = unitSize
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.vendorCode = vendorCode
        self.version = version
    }
}

public struct AiPricingTierRecord: Codable {
    public let audioUnitPrice: String?
    public let billingMeterCode: String?
    public let billingMeterId: String?
    public let billingMode: String?
    public let cacheReadUnitPrice: String?
    public let cacheWriteUnitPrice: String?
    public let createdAt: String?
    public let currency: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let imageUnitPrice: String?
    public let includedQuantity: String?
    public let inputUnitPrice: String?
    public let maxQuantity: String?
    public let metadata: [String: String]?
    public let minQuantity: String?
    public let modelPricingId: String?
    public let multiplier: String?
    public let organizationId: String?
    public let outputUnitPrice: String?
    public let perRequestPrice: String?
    public let priceItemType: String?
    public let pricingRuleId: String?
    public let quantityStep: String?
    public let quantityUnit: String?
    public let resultSelector: String?
    public let sortOrder: Int?
    public let status: String?
    public let tenantId: String?
    public let tierCode: String?
    public let tierLabel: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let videoUnitPrice: String?


    public init(audioUnitPrice: String? = nil, billingMeterCode: String? = nil, billingMeterId: String? = nil, billingMode: String? = nil, cacheReadUnitPrice: String? = nil, cacheWriteUnitPrice: String? = nil, createdAt: String? = nil, currency: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, imageUnitPrice: String? = nil, includedQuantity: String? = nil, inputUnitPrice: String? = nil, maxQuantity: String? = nil, metadata: [String: String]? = nil, minQuantity: String? = nil, modelPricingId: String? = nil, multiplier: String? = nil, organizationId: String? = nil, outputUnitPrice: String? = nil, perRequestPrice: String? = nil, priceItemType: String? = nil, pricingRuleId: String? = nil, quantityStep: String? = nil, quantityUnit: String? = nil, resultSelector: String? = nil, sortOrder: Int? = nil, status: String? = nil, tenantId: String? = nil, tierCode: String? = nil, tierLabel: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, videoUnitPrice: String? = nil) {
        self.audioUnitPrice = audioUnitPrice
        self.billingMeterCode = billingMeterCode
        self.billingMeterId = billingMeterId
        self.billingMode = billingMode
        self.cacheReadUnitPrice = cacheReadUnitPrice
        self.cacheWriteUnitPrice = cacheWriteUnitPrice
        self.createdAt = createdAt
        self.currency = currency
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.imageUnitPrice = imageUnitPrice
        self.includedQuantity = includedQuantity
        self.inputUnitPrice = inputUnitPrice
        self.maxQuantity = maxQuantity
        self.metadata = metadata
        self.minQuantity = minQuantity
        self.modelPricingId = modelPricingId
        self.multiplier = multiplier
        self.organizationId = organizationId
        self.outputUnitPrice = outputUnitPrice
        self.perRequestPrice = perRequestPrice
        self.priceItemType = priceItemType
        self.pricingRuleId = pricingRuleId
        self.quantityStep = quantityStep
        self.quantityUnit = quantityUnit
        self.resultSelector = resultSelector
        self.sortOrder = sortOrder
        self.status = status
        self.tenantId = tenantId
        self.tierCode = tierCode
        self.tierLabel = tierLabel
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.videoUnitPrice = videoUnitPrice
    }
}

public struct AiPromptBindingRecord: Codable {
    public let bindingRole: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let promptId: String?
    public let promptVersionId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(bindingRole: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, promptId: String? = nil, promptVersionId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.bindingRole = bindingRole
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.promptId = promptId
        self.promptVersionId = promptVersionId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiPromptRecord: Codable {
    public let categoryCode: String?
    public let categoryId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let deprecatedAt: String?
    public let description: String?
    public let id: String?
    public let latestVersionId: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let promptKey: String?
    public let promptType: String?
    public let publishedAt: String?
    public let publishedVersionId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let visibility: String?


    public init(categoryCode: String? = nil, categoryId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deprecatedAt: String? = nil, description: String? = nil, id: String? = nil, latestVersionId: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, promptKey: String? = nil, promptType: String? = nil, publishedAt: String? = nil, publishedVersionId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, visibility: String? = nil) {
        self.categoryCode = categoryCode
        self.categoryId = categoryId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.deprecatedAt = deprecatedAt
        self.description = description
        self.id = id
        self.latestVersionId = latestVersionId
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.promptKey = promptKey
        self.promptType = promptType
        self.publishedAt = publishedAt
        self.publishedVersionId = publishedVersionId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.visibility = visibility
    }
}

public struct AiPromptVersionRecord: Codable {
    public let checksumHash: String?
    public let content: String?
    public let createdAt: String?
    public let createdBy: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let deprecatedAt: String?
    public let id: String?
    public let lifecycleStatus: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let promptId: String?
    public let publishedAt: String?
    public let reviewComment: String?
    public let reviewStatus: String?
    public let status: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let versionNo: String?


    public init(checksumHash: String? = nil, content: String? = nil, createdAt: String? = nil, createdBy: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deprecatedAt: String? = nil, id: String? = nil, lifecycleStatus: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, promptId: String? = nil, publishedAt: String? = nil, reviewComment: String? = nil, reviewStatus: String? = nil, status: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, versionNo: String? = nil) {
        self.checksumHash = checksumHash
        self.content = content
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.deprecatedAt = deprecatedAt
        self.id = id
        self.lifecycleStatus = lifecycleStatus
        self.metadata = metadata
        self.organizationId = organizationId
        self.promptId = promptId
        self.publishedAt = publishedAt
        self.reviewComment = reviewComment
        self.reviewStatus = reviewStatus
        self.status = status
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.versionNo = versionNo
    }
}

public struct AiQuotaPolicyRecord: Codable {
    public let blockDurationSeconds: String?
    public let burstLimit: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let exhaustedAt: String?
    public let groupId: String?
    public let id: String?
    public let metadata: [String: String]?
    public let model: String?
    public let name: String?
    public let organizationId: String?
    public let policyCode: String?
    public let quotaLimit: String?
    public let quotaPeriod: String?
    public let quotaUnit: String?
    public let requestsPerDay: String?
    public let requestsPerMinute: String?
    public let requestsPerSecond: String?
    public let resetMode: String?
    public let scopeId: String?
    public let scopeType: String?
    public let status: String?
    public let subjectId: String?
    public let subjectRefHash: String?
    public let subjectRefMasked: String?
    public let subjectType: String?
    public let tenantId: String?
    public let tokensPerMinute: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(blockDurationSeconds: String? = nil, burstLimit: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, exhaustedAt: String? = nil, groupId: String? = nil, id: String? = nil, metadata: [String: String]? = nil, model: String? = nil, name: String? = nil, organizationId: String? = nil, policyCode: String? = nil, quotaLimit: String? = nil, quotaPeriod: String? = nil, quotaUnit: String? = nil, requestsPerDay: String? = nil, requestsPerMinute: String? = nil, requestsPerSecond: String? = nil, resetMode: String? = nil, scopeId: String? = nil, scopeType: String? = nil, status: String? = nil, subjectId: String? = nil, subjectRefHash: String? = nil, subjectRefMasked: String? = nil, subjectType: String? = nil, tenantId: String? = nil, tokensPerMinute: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.blockDurationSeconds = blockDurationSeconds
        self.burstLimit = burstLimit
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.exhaustedAt = exhaustedAt
        self.groupId = groupId
        self.id = id
        self.metadata = metadata
        self.model = model
        self.name = name
        self.organizationId = organizationId
        self.policyCode = policyCode
        self.quotaLimit = quotaLimit
        self.quotaPeriod = quotaPeriod
        self.quotaUnit = quotaUnit
        self.requestsPerDay = requestsPerDay
        self.requestsPerMinute = requestsPerMinute
        self.requestsPerSecond = requestsPerSecond
        self.resetMode = resetMode
        self.scopeId = scopeId
        self.scopeType = scopeType
        self.status = status
        self.subjectId = subjectId
        self.subjectRefHash = subjectRefHash
        self.subjectRefMasked = subjectRefMasked
        self.subjectType = subjectType
        self.tenantId = tenantId
        self.tokensPerMinute = tokensPerMinute
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiRateLimitBucketRecord: Codable {
    public let bucketKey: String?
    public let createdAt: String?
    public let currentCount: String?
    public let currentTokens: String?
    public let id: String?
    public let lastRequestAt: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let quotaPolicyId: String?
    public let rebuildVersion: String?
    public let remainingCount: String?
    public let remainingTokens: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let status: String?
    public let subjectId: String?
    public let subjectType: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let windowEnd: String?
    public let windowStart: String?


    public init(bucketKey: String? = nil, createdAt: String? = nil, currentCount: String? = nil, currentTokens: String? = nil, id: String? = nil, lastRequestAt: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, quotaPolicyId: String? = nil, rebuildVersion: String? = nil, remainingCount: String? = nil, remainingTokens: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, status: String? = nil, subjectId: String? = nil, subjectType: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, windowEnd: String? = nil, windowStart: String? = nil) {
        self.bucketKey = bucketKey
        self.createdAt = createdAt
        self.currentCount = currentCount
        self.currentTokens = currentTokens
        self.id = id
        self.lastRequestAt = lastRequestAt
        self.metadata = metadata
        self.organizationId = organizationId
        self.quotaPolicyId = quotaPolicyId
        self.rebuildVersion = rebuildVersion
        self.remainingCount = remainingCount
        self.remainingTokens = remainingTokens
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.status = status
        self.subjectId = subjectId
        self.subjectType = subjectType
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.windowEnd = windowEnd
        self.windowStart = windowStart
    }
}

public struct AiRequestTraceRecord: Codable {
    public let apiKeyGroupId: String?
    public let apiKeyGroupSnapshot: String?
    public let apiKeyId: String?
    public let apiKeyNameSnapshot: String?
    public let attemptNo: Int?
    public let cachedTokens: String?
    public let channelId: String?
    public let channelNameSnapshot: String?
    public let clientIpHash: String?
    public let clientIpMasked: String?
    public let clientIpRegion: String?
    public let completionTokens: String?
    public let createdAt: String?
    public let decisionLogId: String?
    public let endedAt: String?
    public let endpoint: String?
    public let errorMessageMasked: String?
    public let errorType: String?
    public let httpMethod: String?
    public let httpStatus: Int?
    public let id: String?
    public let latencyMs: Int?
    public let legacyApiKeyId: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerNameSnapshot: String?
    public let ownerType: String?
    public let payloadHash: String?
    public let promptTokens: String?
    public let providerAccountId: String?
    public let providerErrorCode: String?
    public let providerId: String?
    public let providerModel: String?
    public let providerNativeModel: String?
    public let reasoningEffort: String?
    public let requestBytes: String?
    public let requestId: String?
    public let requestPath: String?
    public let requestPayloadHash: String?
    public let requestedModel: String?
    public let requestedModelCatalogKey: String?
    public let responseBytes: String?
    public let responsePayloadHash: String?
    public let retentionUntil: String?
    public let startedAt: String?
    public let status: String?
    public let streaming: Bool?
    public let tenantId: String?
    public let totalTokens: String?
    public let traceId: String?
    public let ttftMs: Int?
    public let userAgentHash: String?
    public let userId: String?
    public let uuid: String?


    public init(apiKeyGroupId: String? = nil, apiKeyGroupSnapshot: String? = nil, apiKeyId: String? = nil, apiKeyNameSnapshot: String? = nil, attemptNo: Int? = nil, cachedTokens: String? = nil, channelId: String? = nil, channelNameSnapshot: String? = nil, clientIpHash: String? = nil, clientIpMasked: String? = nil, clientIpRegion: String? = nil, completionTokens: String? = nil, createdAt: String? = nil, decisionLogId: String? = nil, endedAt: String? = nil, endpoint: String? = nil, errorMessageMasked: String? = nil, errorType: String? = nil, httpMethod: String? = nil, httpStatus: Int? = nil, id: String? = nil, latencyMs: Int? = nil, legacyApiKeyId: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerNameSnapshot: String? = nil, ownerType: String? = nil, payloadHash: String? = nil, promptTokens: String? = nil, providerAccountId: String? = nil, providerErrorCode: String? = nil, providerId: String? = nil, providerModel: String? = nil, providerNativeModel: String? = nil, reasoningEffort: String? = nil, requestBytes: String? = nil, requestId: String? = nil, requestPath: String? = nil, requestPayloadHash: String? = nil, requestedModel: String? = nil, requestedModelCatalogKey: String? = nil, responseBytes: String? = nil, responsePayloadHash: String? = nil, retentionUntil: String? = nil, startedAt: String? = nil, status: String? = nil, streaming: Bool? = nil, tenantId: String? = nil, totalTokens: String? = nil, traceId: String? = nil, ttftMs: Int? = nil, userAgentHash: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.apiKeyGroupId = apiKeyGroupId
        self.apiKeyGroupSnapshot = apiKeyGroupSnapshot
        self.apiKeyId = apiKeyId
        self.apiKeyNameSnapshot = apiKeyNameSnapshot
        self.attemptNo = attemptNo
        self.cachedTokens = cachedTokens
        self.channelId = channelId
        self.channelNameSnapshot = channelNameSnapshot
        self.clientIpHash = clientIpHash
        self.clientIpMasked = clientIpMasked
        self.clientIpRegion = clientIpRegion
        self.completionTokens = completionTokens
        self.createdAt = createdAt
        self.decisionLogId = decisionLogId
        self.endedAt = endedAt
        self.endpoint = endpoint
        self.errorMessageMasked = errorMessageMasked
        self.errorType = errorType
        self.httpMethod = httpMethod
        self.httpStatus = httpStatus
        self.id = id
        self.latencyMs = latencyMs
        self.legacyApiKeyId = legacyApiKeyId
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerNameSnapshot = ownerNameSnapshot
        self.ownerType = ownerType
        self.payloadHash = payloadHash
        self.promptTokens = promptTokens
        self.providerAccountId = providerAccountId
        self.providerErrorCode = providerErrorCode
        self.providerId = providerId
        self.providerModel = providerModel
        self.providerNativeModel = providerNativeModel
        self.reasoningEffort = reasoningEffort
        self.requestBytes = requestBytes
        self.requestId = requestId
        self.requestPath = requestPath
        self.requestPayloadHash = requestPayloadHash
        self.requestedModel = requestedModel
        self.requestedModelCatalogKey = requestedModelCatalogKey
        self.responseBytes = responseBytes
        self.responsePayloadHash = responsePayloadHash
        self.retentionUntil = retentionUntil
        self.startedAt = startedAt
        self.status = status
        self.streaming = streaming
        self.tenantId = tenantId
        self.totalTokens = totalTokens
        self.traceId = traceId
        self.ttftMs = ttftMs
        self.userAgentHash = userAgentHash
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiRoutingDecisionLogRecord: Codable {
    public let apiKeyId: String?
    public let candidateSnapshot: [String: String]?
    public let capability: String?
    public let createdAt: String?
    public let decisionLatencyMs: Int?
    public let decisionMode: String?
    public let decisionReason: [String: String]?
    public let fallbackChain: [String: String]?
    public let id: String?
    public let legacyApiKeyId: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let policyId: String?
    public let profileId: String?
    public let requestId: String?
    public let requestedModel: String?
    public let resolvedModel: String?
    public let retentionUntil: String?
    public let ruleId: String?
    public let selectedAccountId: String?
    public let selectedChannelId: String?
    public let selectedProviderId: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(apiKeyId: String? = nil, candidateSnapshot: [String: String]? = nil, capability: String? = nil, createdAt: String? = nil, decisionLatencyMs: Int? = nil, decisionMode: String? = nil, decisionReason: [String: String]? = nil, fallbackChain: [String: String]? = nil, id: String? = nil, legacyApiKeyId: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, policyId: String? = nil, profileId: String? = nil, requestId: String? = nil, requestedModel: String? = nil, resolvedModel: String? = nil, retentionUntil: String? = nil, ruleId: String? = nil, selectedAccountId: String? = nil, selectedChannelId: String? = nil, selectedProviderId: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.apiKeyId = apiKeyId
        self.candidateSnapshot = candidateSnapshot
        self.capability = capability
        self.createdAt = createdAt
        self.decisionLatencyMs = decisionLatencyMs
        self.decisionMode = decisionMode
        self.decisionReason = decisionReason
        self.fallbackChain = fallbackChain
        self.id = id
        self.legacyApiKeyId = legacyApiKeyId
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.policyId = policyId
        self.profileId = profileId
        self.requestId = requestId
        self.requestedModel = requestedModel
        self.resolvedModel = resolvedModel
        self.retentionUntil = retentionUntil
        self.ruleId = ruleId
        self.selectedAccountId = selectedAccountId
        self.selectedChannelId = selectedChannelId
        self.selectedProviderId = selectedProviderId
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiRoutingPolicyRecord: Codable {
    public let capability: String?
    public let costCeiling: String?
    public let createdAt: String?
    public let currency: String?
    public let dataScope: String?
    public let defaultProfileId: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let fallbackMode: String?
    public let id: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let policyCode: String?
    public let policyScope: String?
    public let sloLatencyMs: Int?
    public let sloSuccessRate: String?
    public let status: String?
    public let subjectId: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(capability: String? = nil, costCeiling: String? = nil, createdAt: String? = nil, currency: String? = nil, dataScope: String? = nil, defaultProfileId: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, fallbackMode: String? = nil, id: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, policyCode: String? = nil, policyScope: String? = nil, sloLatencyMs: Int? = nil, sloSuccessRate: String? = nil, status: String? = nil, subjectId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.capability = capability
        self.costCeiling = costCeiling
        self.createdAt = createdAt
        self.currency = currency
        self.dataScope = dataScope
        self.defaultProfileId = defaultProfileId
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.fallbackMode = fallbackMode
        self.id = id
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.policyCode = policyCode
        self.policyScope = policyScope
        self.sloLatencyMs = sloLatencyMs
        self.sloSuccessRate = sloSuccessRate
        self.status = status
        self.subjectId = subjectId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiRoutingProfileRecord: Codable {
    public let configHash: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let policyId: String?
    public let profileName: String?
    public let profileVersion: String?
    public let publishedAt: String?
    public let publishedBy: String?
    public let releaseStatus: String?
    public let rollbackFromProfileId: String?
    public let status: String?
    public let tenantId: String?
    public let trafficPercent: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(configHash: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, policyId: String? = nil, profileName: String? = nil, profileVersion: String? = nil, publishedAt: String? = nil, publishedBy: String? = nil, releaseStatus: String? = nil, rollbackFromProfileId: String? = nil, status: String? = nil, tenantId: String? = nil, trafficPercent: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.configHash = configHash
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.policyId = policyId
        self.profileName = profileName
        self.profileVersion = profileVersion
        self.publishedAt = publishedAt
        self.publishedBy = publishedBy
        self.releaseStatus = releaseStatus
        self.rollbackFromProfileId = rollbackFromProfileId
        self.status = status
        self.tenantId = tenantId
        self.trafficPercent = trafficPercent
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiRoutingRuleRecord: Codable {
    public let candidateChannels: [String: String]?
    public let constraints: [String: String]?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let fallbackChain: [String: String]?
    public let id: String?
    public let matchExpression: [String: String]?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let priority: Int?
    public let profileId: String?
    public let rateLimitPolicyId: String?
    public let ruleCode: String?
    public let status: String?
    public let targetModel: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(candidateChannels: [String: String]? = nil, constraints: [String: String]? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, fallbackChain: [String: String]? = nil, id: String? = nil, matchExpression: [String: String]? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, priority: Int? = nil, profileId: String? = nil, rateLimitPolicyId: String? = nil, ruleCode: String? = nil, status: String? = nil, targetModel: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.candidateChannels = candidateChannels
        self.constraints = constraints
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.fallbackChain = fallbackChain
        self.id = id
        self.matchExpression = matchExpression
        self.metadata = metadata
        self.organizationId = organizationId
        self.priority = priority
        self.profileId = profileId
        self.rateLimitPolicyId = rateLimitPolicyId
        self.ruleCode = ruleCode
        self.status = status
        self.targetModel = targetModel
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct AiRuntimeArtifactRecord: Codable {
    public let agentRunId: String?
    public let agentRunStepId: String?
    public let agentSessionId: String?
    public let artifactType: String?
    public let chatItemId: String?
    public let chatTurnId: String?
    public let contentJson: [String: String]?
    public let contentText: String?
    public let conversationId: String?
    public let createdAt: String?
    public let id: String?
    public let legalHold: Bool?
    public let messageId: String?
    public let metadata: [String: String]?
    public let mimeType: String?
    public let name: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let runtimeInvocationId: String?
    public let sha256: String?
    public let sizeBytes: String?
    public let status: String?
    public let storageKey: String?
    public let storageUrl: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(agentRunId: String? = nil, agentRunStepId: String? = nil, agentSessionId: String? = nil, artifactType: String? = nil, chatItemId: String? = nil, chatTurnId: String? = nil, contentJson: [String: String]? = nil, contentText: String? = nil, conversationId: String? = nil, createdAt: String? = nil, id: String? = nil, legalHold: Bool? = nil, messageId: String? = nil, metadata: [String: String]? = nil, mimeType: String? = nil, name: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runtimeInvocationId: String? = nil, sha256: String? = nil, sizeBytes: String? = nil, status: String? = nil, storageKey: String? = nil, storageUrl: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.agentRunId = agentRunId
        self.agentRunStepId = agentRunStepId
        self.agentSessionId = agentSessionId
        self.artifactType = artifactType
        self.chatItemId = chatItemId
        self.chatTurnId = chatTurnId
        self.contentJson = contentJson
        self.contentText = contentText
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.id = id
        self.legalHold = legalHold
        self.messageId = messageId
        self.metadata = metadata
        self.mimeType = mimeType
        self.name = name
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.runtimeInvocationId = runtimeInvocationId
        self.sha256 = sha256
        self.sizeBytes = sizeBytes
        self.status = status
        self.storageKey = storageKey
        self.storageUrl = storageUrl
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiRuntimeInvocationEventRecord: Codable {
    public let agentRunId: String?
    public let agentRunStepId: String?
    public let agentSessionId: String?
    public let chatTurnId: String?
    public let conversationId: String?
    public let createdAt: String?
    public let eventNo: String?
    public let eventSource: String?
    public let eventType: String?
    public let id: String?
    public let invocationId: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let payloadJson: [String: String]?
    public let requestId: String?
    public let retentionUntil: String?
    public let status: String?
    public let tenantId: String?
    public let textDelta: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(agentRunId: String? = nil, agentRunStepId: String? = nil, agentSessionId: String? = nil, chatTurnId: String? = nil, conversationId: String? = nil, createdAt: String? = nil, eventNo: String? = nil, eventSource: String? = nil, eventType: String? = nil, id: String? = nil, invocationId: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, payloadJson: [String: String]? = nil, requestId: String? = nil, retentionUntil: String? = nil, status: String? = nil, tenantId: String? = nil, textDelta: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.agentRunId = agentRunId
        self.agentRunStepId = agentRunStepId
        self.agentSessionId = agentSessionId
        self.chatTurnId = chatTurnId
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.eventNo = eventNo
        self.eventSource = eventSource
        self.eventType = eventType
        self.id = id
        self.invocationId = invocationId
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.payloadJson = payloadJson
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.status = status
        self.tenantId = tenantId
        self.textDelta = textDelta
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiRuntimeInvocationRecord: Codable {
    public let agentRunId: String?
    public let agentRunStepId: String?
    public let agentSessionId: String?
    public let approvalPolicy: String?
    public let attemptNo: Int?
    public let chatItemId: String?
    public let chatTurnId: String?
    public let completedAt: String?
    public let conversationId: String?
    public let createdAt: String?
    public let cwd: String?
    public let endpoint: String?
    public let errorCode: String?
    public let errorMessageMasked: String?
    public let errorType: String?
    public let exitCode: String?
    public let finishReason: String?
    public let id: String?
    public let invocationNo: String?
    public let invocationType: String?
    public let latencyMs: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let model: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let permissionMode: String?
    public let provider: String?
    public let providerConversationId: String?
    public let providerResponseId: String?
    public let providerSessionId: String?
    public let providerStepId: String?
    public let requestId: String?
    public let requestJson: [String: String]?
    public let responseJson: [String: String]?
    public let retentionUntil: String?
    public let runtime: String?
    public let sandboxPolicy: String?
    public let startedAt: String?
    public let status: String?
    public let tenantId: String?
    public let toolCallId: String?
    public let toolName: String?
    public let traceId: String?
    public let ttftMs: String?
    public let usageJson: [String: String]?
    public let userId: String?
    public let uuid: String?


    public init(agentRunId: String? = nil, agentRunStepId: String? = nil, agentSessionId: String? = nil, approvalPolicy: String? = nil, attemptNo: Int? = nil, chatItemId: String? = nil, chatTurnId: String? = nil, completedAt: String? = nil, conversationId: String? = nil, createdAt: String? = nil, cwd: String? = nil, endpoint: String? = nil, errorCode: String? = nil, errorMessageMasked: String? = nil, errorType: String? = nil, exitCode: String? = nil, finishReason: String? = nil, id: String? = nil, invocationNo: String? = nil, invocationType: String? = nil, latencyMs: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, model: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, permissionMode: String? = nil, provider: String? = nil, providerConversationId: String? = nil, providerResponseId: String? = nil, providerSessionId: String? = nil, providerStepId: String? = nil, requestId: String? = nil, requestJson: [String: String]? = nil, responseJson: [String: String]? = nil, retentionUntil: String? = nil, runtime: String? = nil, sandboxPolicy: String? = nil, startedAt: String? = nil, status: String? = nil, tenantId: String? = nil, toolCallId: String? = nil, toolName: String? = nil, traceId: String? = nil, ttftMs: String? = nil, usageJson: [String: String]? = nil, userId: String? = nil, uuid: String? = nil) {
        self.agentRunId = agentRunId
        self.agentRunStepId = agentRunStepId
        self.agentSessionId = agentSessionId
        self.approvalPolicy = approvalPolicy
        self.attemptNo = attemptNo
        self.chatItemId = chatItemId
        self.chatTurnId = chatTurnId
        self.completedAt = completedAt
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.cwd = cwd
        self.endpoint = endpoint
        self.errorCode = errorCode
        self.errorMessageMasked = errorMessageMasked
        self.errorType = errorType
        self.exitCode = exitCode
        self.finishReason = finishReason
        self.id = id
        self.invocationNo = invocationNo
        self.invocationType = invocationType
        self.latencyMs = latencyMs
        self.legalHold = legalHold
        self.metadata = metadata
        self.model = model
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.permissionMode = permissionMode
        self.provider = provider
        self.providerConversationId = providerConversationId
        self.providerResponseId = providerResponseId
        self.providerSessionId = providerSessionId
        self.providerStepId = providerStepId
        self.requestId = requestId
        self.requestJson = requestJson
        self.responseJson = responseJson
        self.retentionUntil = retentionUntil
        self.runtime = runtime
        self.sandboxPolicy = sandboxPolicy
        self.startedAt = startedAt
        self.status = status
        self.tenantId = tenantId
        self.toolCallId = toolCallId
        self.toolName = toolName
        self.traceId = traceId
        self.ttftMs = ttftMs
        self.usageJson = usageJson
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiRuntimeUsageLinkRecord: Codable {
    public let agentRunId: String?
    public let agentRunStepId: String?
    public let agentSessionId: String?
    public let cachedTokens: String?
    public let chatItemId: String?
    public let chatTurnId: String?
    public let conversationId: String?
    public let costAmount: String?
    public let createdAt: String?
    public let currency: String?
    public let id: String?
    public let inputTokens: String?
    public let legalHold: Bool?
    public let messageId: String?
    public let metadata: [String: String]?
    public let model: String?
    public let occurredAt: String?
    public let organizationId: String?
    public let outputTokens: String?
    public let payloadHash: String?
    public let provider: String?
    public let reasoningTokens: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let runtimeInvocationId: String?
    public let status: String?
    public let tenantId: String?
    public let totalTokens: String?
    public let traceId: String?
    public let usageFactId: String?
    public let usageType: String?
    public let userId: String?
    public let uuid: String?


    public init(agentRunId: String? = nil, agentRunStepId: String? = nil, agentSessionId: String? = nil, cachedTokens: String? = nil, chatItemId: String? = nil, chatTurnId: String? = nil, conversationId: String? = nil, costAmount: String? = nil, createdAt: String? = nil, currency: String? = nil, id: String? = nil, inputTokens: String? = nil, legalHold: Bool? = nil, messageId: String? = nil, metadata: [String: String]? = nil, model: String? = nil, occurredAt: String? = nil, organizationId: String? = nil, outputTokens: String? = nil, payloadHash: String? = nil, provider: String? = nil, reasoningTokens: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runtimeInvocationId: String? = nil, status: String? = nil, tenantId: String? = nil, totalTokens: String? = nil, traceId: String? = nil, usageFactId: String? = nil, usageType: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.agentRunId = agentRunId
        self.agentRunStepId = agentRunStepId
        self.agentSessionId = agentSessionId
        self.cachedTokens = cachedTokens
        self.chatItemId = chatItemId
        self.chatTurnId = chatTurnId
        self.conversationId = conversationId
        self.costAmount = costAmount
        self.createdAt = createdAt
        self.currency = currency
        self.id = id
        self.inputTokens = inputTokens
        self.legalHold = legalHold
        self.messageId = messageId
        self.metadata = metadata
        self.model = model
        self.occurredAt = occurredAt
        self.organizationId = organizationId
        self.outputTokens = outputTokens
        self.payloadHash = payloadHash
        self.provider = provider
        self.reasoningTokens = reasoningTokens
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.runtimeInvocationId = runtimeInvocationId
        self.status = status
        self.tenantId = tenantId
        self.totalTokens = totalTokens
        self.traceId = traceId
        self.usageFactId = usageFactId
        self.usageType = usageType
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiUsageFactRecord: Codable {
    public let apiKeyGroupId: String?
    public let apiKeyGroupSnapshot: String?
    public let apiKeyId: String?
    public let apiKeyNameSnapshot: String?
    public let audioSeconds: String?
    public let bandwidthBytes: String?
    public let baseInputUnitPrice: String?
    public let baseOutputUnitPrice: String?
    public let billableQuantity: String?
    public let billableUnit: String?
    public let billingMeterCode: String?
    public let billingMeterId: String?
    public let billingMode: String?
    public let billingTier: String?
    public let billingType: String?
    public let cacheReadUnitPrice: String?
    public let cachedTokens: String?
    public let catalogKey: String?
    public let channelId: String?
    public let characterCount: String?
    public let completionTokens: String?
    public let costAmount: String?
    public let createdAt: String?
    public let currency: String?
    public let customerChargeAmount: String?
    public let decisionLogId: String?
    public let id: String?
    public let imageCount: String?
    public let itemCount: String?
    public let legacyApiKeyId: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let modality: String?
    public let model: String?
    public let occurredAt: String?
    public let officialReferenceAmount: String?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerNameSnapshot: String?
    public let ownerType: String?
    public let payloadHash: String?
    public let pricingId: String?
    public let pricingPlanCode: String?
    public let pricingPlanId: String?
    public let pricingRuleId: String?
    public let pricingSnapshot: [String: String]?
    public let pricingTierId: String?
    public let promptTokens: String?
    public let providerAccountId: String?
    public let providerId: String?
    public let providerNativeModel: String?
    public let rateMultiplier: String?
    public let reasoningEffort: String?
    public let referenceMultiplier: String?
    public let requestCount: String?
    public let requestId: String?
    public let requestedModelCatalogKey: String?
    public let resultCount: String?
    public let retentionUntil: String?
    public let settlementId: String?
    public let settlementStatus: String?
    public let status: String?
    public let storageByteHours: String?
    public let tenantId: String?
    public let totalTokens: String?
    public let traceId: String?
    public let unitPriceSnapshot: String?
    public let upstreamCostAmount: String?
    public let usageType: String?
    public let userId: String?
    public let uuid: String?
    public let videoSeconds: String?


    public init(apiKeyGroupId: String? = nil, apiKeyGroupSnapshot: String? = nil, apiKeyId: String? = nil, apiKeyNameSnapshot: String? = nil, audioSeconds: String? = nil, bandwidthBytes: String? = nil, baseInputUnitPrice: String? = nil, baseOutputUnitPrice: String? = nil, billableQuantity: String? = nil, billableUnit: String? = nil, billingMeterCode: String? = nil, billingMeterId: String? = nil, billingMode: String? = nil, billingTier: String? = nil, billingType: String? = nil, cacheReadUnitPrice: String? = nil, cachedTokens: String? = nil, catalogKey: String? = nil, channelId: String? = nil, characterCount: String? = nil, completionTokens: String? = nil, costAmount: String? = nil, createdAt: String? = nil, currency: String? = nil, customerChargeAmount: String? = nil, decisionLogId: String? = nil, id: String? = nil, imageCount: String? = nil, itemCount: String? = nil, legacyApiKeyId: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, modality: String? = nil, model: String? = nil, occurredAt: String? = nil, officialReferenceAmount: String? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerNameSnapshot: String? = nil, ownerType: String? = nil, payloadHash: String? = nil, pricingId: String? = nil, pricingPlanCode: String? = nil, pricingPlanId: String? = nil, pricingRuleId: String? = nil, pricingSnapshot: [String: String]? = nil, pricingTierId: String? = nil, promptTokens: String? = nil, providerAccountId: String? = nil, providerId: String? = nil, providerNativeModel: String? = nil, rateMultiplier: String? = nil, reasoningEffort: String? = nil, referenceMultiplier: String? = nil, requestCount: String? = nil, requestId: String? = nil, requestedModelCatalogKey: String? = nil, resultCount: String? = nil, retentionUntil: String? = nil, settlementId: String? = nil, settlementStatus: String? = nil, status: String? = nil, storageByteHours: String? = nil, tenantId: String? = nil, totalTokens: String? = nil, traceId: String? = nil, unitPriceSnapshot: String? = nil, upstreamCostAmount: String? = nil, usageType: String? = nil, userId: String? = nil, uuid: String? = nil, videoSeconds: String? = nil) {
        self.apiKeyGroupId = apiKeyGroupId
        self.apiKeyGroupSnapshot = apiKeyGroupSnapshot
        self.apiKeyId = apiKeyId
        self.apiKeyNameSnapshot = apiKeyNameSnapshot
        self.audioSeconds = audioSeconds
        self.bandwidthBytes = bandwidthBytes
        self.baseInputUnitPrice = baseInputUnitPrice
        self.baseOutputUnitPrice = baseOutputUnitPrice
        self.billableQuantity = billableQuantity
        self.billableUnit = billableUnit
        self.billingMeterCode = billingMeterCode
        self.billingMeterId = billingMeterId
        self.billingMode = billingMode
        self.billingTier = billingTier
        self.billingType = billingType
        self.cacheReadUnitPrice = cacheReadUnitPrice
        self.cachedTokens = cachedTokens
        self.catalogKey = catalogKey
        self.channelId = channelId
        self.characterCount = characterCount
        self.completionTokens = completionTokens
        self.costAmount = costAmount
        self.createdAt = createdAt
        self.currency = currency
        self.customerChargeAmount = customerChargeAmount
        self.decisionLogId = decisionLogId
        self.id = id
        self.imageCount = imageCount
        self.itemCount = itemCount
        self.legacyApiKeyId = legacyApiKeyId
        self.legalHold = legalHold
        self.metadata = metadata
        self.modality = modality
        self.model = model
        self.occurredAt = occurredAt
        self.officialReferenceAmount = officialReferenceAmount
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerNameSnapshot = ownerNameSnapshot
        self.ownerType = ownerType
        self.payloadHash = payloadHash
        self.pricingId = pricingId
        self.pricingPlanCode = pricingPlanCode
        self.pricingPlanId = pricingPlanId
        self.pricingRuleId = pricingRuleId
        self.pricingSnapshot = pricingSnapshot
        self.pricingTierId = pricingTierId
        self.promptTokens = promptTokens
        self.providerAccountId = providerAccountId
        self.providerId = providerId
        self.providerNativeModel = providerNativeModel
        self.rateMultiplier = rateMultiplier
        self.reasoningEffort = reasoningEffort
        self.referenceMultiplier = referenceMultiplier
        self.requestCount = requestCount
        self.requestId = requestId
        self.requestedModelCatalogKey = requestedModelCatalogKey
        self.resultCount = resultCount
        self.retentionUntil = retentionUntil
        self.settlementId = settlementId
        self.settlementStatus = settlementStatus
        self.status = status
        self.storageByteHours = storageByteHours
        self.tenantId = tenantId
        self.totalTokens = totalTokens
        self.traceId = traceId
        self.unitPriceSnapshot = unitPriceSnapshot
        self.upstreamCostAmount = upstreamCostAmount
        self.usageType = usageType
        self.userId = userId
        self.uuid = uuid
        self.videoSeconds = videoSeconds
    }
}

public struct AiUsageServiceProviderChainRecord: Codable {
    public let chainDepth: Int?
    public let chainHash: String?
    public let chainPathSnapshot: [String: String]?
    public let createdAt: String?
    public let id: String?
    public let leafProviderId: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let occurredAt: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let requestId: String?
    public let resolvedSubjectId: String?
    public let resolvedSubjectType: String?
    public let retentionUntil: String?
    public let rootProviderId: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let usageFactId: String?
    public let userId: String?
    public let uuid: String?


    public init(chainDepth: Int? = nil, chainHash: String? = nil, chainPathSnapshot: [String: String]? = nil, createdAt: String? = nil, id: String? = nil, leafProviderId: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, occurredAt: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, requestId: String? = nil, resolvedSubjectId: String? = nil, resolvedSubjectType: String? = nil, retentionUntil: String? = nil, rootProviderId: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, usageFactId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.chainDepth = chainDepth
        self.chainHash = chainHash
        self.chainPathSnapshot = chainPathSnapshot
        self.createdAt = createdAt
        self.id = id
        self.leafProviderId = leafProviderId
        self.legalHold = legalHold
        self.metadata = metadata
        self.occurredAt = occurredAt
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.requestId = requestId
        self.resolvedSubjectId = resolvedSubjectId
        self.resolvedSubjectType = resolvedSubjectType
        self.retentionUntil = retentionUntil
        self.rootProviderId = rootProviderId
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.usageFactId = usageFactId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AiUsageServiceProviderEdgeRecord: Codable {
    public let amountRole: String?
    public let billableQuantity: String?
    public let billingMeterCode: String?
    public let buyerProviderId: String?
    public let buyerSnapshot: [String: String]?
    public let chainId: String?
    public let chargeAmount: String?
    public let convertedChargeAmount: String?
    public let createdAt: String?
    public let currency: String?
    public let edgeDepth: Int?
    public let edgeId: String?
    public let fxRateSnapshot: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let occurredAt: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let priceSnapshot: [String: String]?
    public let pricingPlanId: String?
    public let pricingRuleId: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let sellerProviderId: String?
    public let sellerSnapshot: [String: String]?
    public let settlementCurrency: String?
    public let settlementStatus: String?
    public let status: String?
    public let tenantId: String?
    public let tokenKind: String?
    public let traceId: String?
    public let unitPrice: String?
    public let unitSize: String?
    public let usageFactId: String?
    public let userId: String?
    public let uuid: String?


    public init(amountRole: String? = nil, billableQuantity: String? = nil, billingMeterCode: String? = nil, buyerProviderId: String? = nil, buyerSnapshot: [String: String]? = nil, chainId: String? = nil, chargeAmount: String? = nil, convertedChargeAmount: String? = nil, createdAt: String? = nil, currency: String? = nil, edgeDepth: Int? = nil, edgeId: String? = nil, fxRateSnapshot: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, occurredAt: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, priceSnapshot: [String: String]? = nil, pricingPlanId: String? = nil, pricingRuleId: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, sellerProviderId: String? = nil, sellerSnapshot: [String: String]? = nil, settlementCurrency: String? = nil, settlementStatus: String? = nil, status: String? = nil, tenantId: String? = nil, tokenKind: String? = nil, traceId: String? = nil, unitPrice: String? = nil, unitSize: String? = nil, usageFactId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.amountRole = amountRole
        self.billableQuantity = billableQuantity
        self.billingMeterCode = billingMeterCode
        self.buyerProviderId = buyerProviderId
        self.buyerSnapshot = buyerSnapshot
        self.chainId = chainId
        self.chargeAmount = chargeAmount
        self.convertedChargeAmount = convertedChargeAmount
        self.createdAt = createdAt
        self.currency = currency
        self.edgeDepth = edgeDepth
        self.edgeId = edgeId
        self.fxRateSnapshot = fxRateSnapshot
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.occurredAt = occurredAt
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.priceSnapshot = priceSnapshot
        self.pricingPlanId = pricingPlanId
        self.pricingRuleId = pricingRuleId
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.sellerProviderId = sellerProviderId
        self.sellerSnapshot = sellerSnapshot
        self.settlementCurrency = settlementCurrency
        self.settlementStatus = settlementStatus
        self.status = status
        self.tenantId = tenantId
        self.tokenKind = tokenKind
        self.traceId = traceId
        self.unitPrice = unitPrice
        self.unitSize = unitSize
        self.usageFactId = usageFactId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct AnalyticsServiceProviderDailyRecord: Codable {
    public let ancestorProviderId: String?
    public let createdAt: String?
    public let currency: String?
    public let expenseAmount: String?
    public let failureCount: String?
    public let id: String?
    public let incomeAmount: String?
    public let marginAmount: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let providerId: String?
    public let rebuildVersion: String?
    public let reportDate: String?
    public let requestCount: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let status: String?
    public let successCount: String?
    public let tenantId: String?
    public let tokenCount: String?
    public let updatedAt: String?
    public let upstreamCostAmount: String?
    public let uuid: String?


    public init(ancestorProviderId: String? = nil, createdAt: String? = nil, currency: String? = nil, expenseAmount: String? = nil, failureCount: String? = nil, id: String? = nil, incomeAmount: String? = nil, marginAmount: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, providerId: String? = nil, rebuildVersion: String? = nil, reportDate: String? = nil, requestCount: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, status: String? = nil, successCount: String? = nil, tenantId: String? = nil, tokenCount: String? = nil, updatedAt: String? = nil, upstreamCostAmount: String? = nil, uuid: String? = nil) {
        self.ancestorProviderId = ancestorProviderId
        self.createdAt = createdAt
        self.currency = currency
        self.expenseAmount = expenseAmount
        self.failureCount = failureCount
        self.id = id
        self.incomeAmount = incomeAmount
        self.marginAmount = marginAmount
        self.metadata = metadata
        self.organizationId = organizationId
        self.providerId = providerId
        self.rebuildVersion = rebuildVersion
        self.reportDate = reportDate
        self.requestCount = requestCount
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.status = status
        self.successCount = successCount
        self.tenantId = tenantId
        self.tokenCount = tokenCount
        self.updatedAt = updatedAt
        self.upstreamCostAmount = upstreamCostAmount
        self.uuid = uuid
    }
}

public struct AnalyticsServiceProviderEdgeDailyRecord: Codable {
    public let billingMeterCode: String?
    public let buyerProviderId: String?
    public let catalogKey: String?
    public let createdAt: String?
    public let currency: String?
    public let edgeId: String?
    public let expenseAmount: String?
    public let id: String?
    public let incomeAmount: String?
    public let marginAmount: String?
    public let metadata: [String: String]?
    public let model: String?
    public let organizationId: String?
    public let rebuildVersion: String?
    public let reportDate: String?
    public let requestCount: String?
    public let sellerProviderId: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let status: String?
    public let tenantId: String?
    public let tokenCount: String?
    public let tokenKind: String?
    public let updatedAt: String?
    public let uuid: String?


    public init(billingMeterCode: String? = nil, buyerProviderId: String? = nil, catalogKey: String? = nil, createdAt: String? = nil, currency: String? = nil, edgeId: String? = nil, expenseAmount: String? = nil, id: String? = nil, incomeAmount: String? = nil, marginAmount: String? = nil, metadata: [String: String]? = nil, model: String? = nil, organizationId: String? = nil, rebuildVersion: String? = nil, reportDate: String? = nil, requestCount: String? = nil, sellerProviderId: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, status: String? = nil, tenantId: String? = nil, tokenCount: String? = nil, tokenKind: String? = nil, updatedAt: String? = nil, uuid: String? = nil) {
        self.billingMeterCode = billingMeterCode
        self.buyerProviderId = buyerProviderId
        self.catalogKey = catalogKey
        self.createdAt = createdAt
        self.currency = currency
        self.edgeId = edgeId
        self.expenseAmount = expenseAmount
        self.id = id
        self.incomeAmount = incomeAmount
        self.marginAmount = marginAmount
        self.metadata = metadata
        self.model = model
        self.organizationId = organizationId
        self.rebuildVersion = rebuildVersion
        self.reportDate = reportDate
        self.requestCount = requestCount
        self.sellerProviderId = sellerProviderId
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.status = status
        self.tenantId = tenantId
        self.tokenCount = tokenCount
        self.tokenKind = tokenKind
        self.updatedAt = updatedAt
        self.uuid = uuid
    }
}

public struct ApiKeyGroupsListResult: Codable {
    public let code: String?
    public let data: AppApiKeyGroupListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppApiKeyGroupListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ApiKeysCreateResult: Codable {
    public let code: String?
    public let data: CreateApiKeyResponse?
    public let msg: String?


    public init(code: String? = nil, data: CreateApiKeyResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ApiKeysDeleteResult: Codable {
    public let code: String?
    public let data: DeleteApiKeyResponse?
    public let msg: String?


    public init(code: String? = nil, data: DeleteApiKeyResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ApiKeysListResult: Codable {
    public let code: String?
    public let data: AppApiKeyListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppApiKeyListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ApiKeysUpdateResult: Codable {
    public let code: String?
    public let data: UpdateApiKeyResponse?
    public let msg: String?


    public init(code: String? = nil, data: UpdateApiKeyResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppApiKeyGroup: Codable {
    public let code: String?
    public let id: String?
    public let name: String?
    public let rate: String?


    public init(code: String? = nil, id: String? = nil, name: String? = nil, rate: String? = nil) {
        self.code = code
        self.id = id
        self.name = name
        self.rate = rate
    }
}

public struct AppApiKeyGroupListResponse: Codable {
    public let items: [AppApiKeyGroup]?


    public init(items: [AppApiKeyGroup]? = nil) {
        self.items = items
    }
}

public struct AppApiKeyItem: Codable {
    public let copyableKey: String?
    public let created: String?
    public let defaultForRuntime: Bool?
    public let expires: String?
    public let group: String?
    public let groupName: String?
    public let id: String?
    public let ipLimit: String?
    public let maskedKey: String?
    public let modalities: [String]?
    public let name: String?
    public let quota: String?
    public let rate: String?
    public let status: String?
    public let usedQuota: String?


    public init(copyableKey: String? = nil, created: String? = nil, defaultForRuntime: Bool? = nil, expires: String? = nil, group: String? = nil, groupName: String? = nil, id: String? = nil, ipLimit: String? = nil, maskedKey: String? = nil, modalities: [String]? = nil, name: String? = nil, quota: String? = nil, rate: String? = nil, status: String? = nil, usedQuota: String? = nil) {
        self.copyableKey = copyableKey
        self.created = created
        self.defaultForRuntime = defaultForRuntime
        self.expires = expires
        self.group = group
        self.groupName = groupName
        self.id = id
        self.ipLimit = ipLimit
        self.maskedKey = maskedKey
        self.modalities = modalities
        self.name = name
        self.quota = quota
        self.rate = rate
        self.status = status
        self.usedQuota = usedQuota
    }
}

public struct AppApiKeyListResponse: Codable {
    public let groups: [AppApiKeyGroup]?
    public let items: [AppApiKeyItem]?


    public init(groups: [AppApiKeyGroup]? = nil, items: [AppApiKeyItem]? = nil) {
        self.groups = groups
        self.items = items
    }
}

public struct AppCatalogItem: Codable {
    public let category: String?
    public let description: String?
    public let developer: String?
    public let downloads: String?
    public let features: [String]?
    public let id: String?
    public let image: String?
    public let name: String?
    public let rating: Double?
    public let releases: [AppReleaseItem]?
    public let screenshots: [String]?


    public init(category: String? = nil, description: String? = nil, developer: String? = nil, downloads: String? = nil, features: [String]? = nil, id: String? = nil, image: String? = nil, name: String? = nil, rating: Double? = nil, releases: [AppReleaseItem]? = nil, screenshots: [String]? = nil) {
        self.category = category
        self.description = description
        self.developer = developer
        self.downloads = downloads
        self.features = features
        self.id = id
        self.image = image
        self.name = name
        self.rating = rating
        self.releases = releases
        self.screenshots = screenshots
    }
}

public struct AppCatalogResponse: Codable {
    public let hasNextPage: Bool?
    public let items: [AppCatalogItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(hasNextPage: Bool? = nil, items: [AppCatalogItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.hasNextPage = hasNextPage
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct AppCategoriesResponse: Codable {
    public let items: [String]?


    public init(items: [String]? = nil) {
        self.items = items
    }
}

public struct AppDetailResponse: Codable {
    public let category: String?
    public let description: String?
    public let developer: String?
    public let downloads: String?
    public let features: [String]?
    public let id: String?
    public let image: String?
    public let name: String?
    public let rating: Double?
    public let releases: [AppReleaseItem]?
    public let screenshots: [String]?


    public init(category: String? = nil, description: String? = nil, developer: String? = nil, downloads: String? = nil, features: [String]? = nil, id: String? = nil, image: String? = nil, name: String? = nil, rating: Double? = nil, releases: [AppReleaseItem]? = nil, screenshots: [String]? = nil) {
        self.category = category
        self.description = description
        self.developer = developer
        self.downloads = downloads
        self.features = features
        self.id = id
        self.image = image
        self.name = name
        self.rating = rating
        self.releases = releases
        self.screenshots = screenshots
    }
}

public struct AppInstalledSkillItem: Codable {
    public let config: [String: String]?
    public let enabled: Bool?
    public let id: String?
    public let installedAt: String?
    public let lastEnabledAt: String?
    public let skill: SkillCatalogItem?
    public let skillId: String?


    public init(config: [String: String]? = nil, enabled: Bool? = nil, id: String? = nil, installedAt: String? = nil, lastEnabledAt: String? = nil, skill: SkillCatalogItem? = nil, skillId: String? = nil) {
        self.config = config
        self.enabled = enabled
        self.id = id
        self.installedAt = installedAt
        self.lastEnabledAt = lastEnabledAt
        self.skill = skill
        self.skillId = skillId
    }
}

public struct AppInstalledSkillResponse: Codable {
    public let item: AppInstalledSkillItem?


    public init(item: AppInstalledSkillItem? = nil) {
        self.item = item
    }
}

public struct AppInstalledSkillsResponse: Codable {
    public let items: [AppInstalledSkillItem]?


    public init(items: [AppInstalledSkillItem]? = nil) {
        self.items = items
    }
}

public struct AppModelCatalogGroupOption: Codable {
    public let key: String?
    public let label: String?
    public let modelCount: Int?


    public init(key: String? = nil, label: String? = nil, modelCount: Int? = nil) {
        self.key = key
        self.label = label
        self.modelCount = modelCount
    }
}

public struct AppModelCatalogItem: Codable {
    public let apiFormat: String?
    public let capabilities: [String]?
    public let capabilityIntro: String?
    public let catalogKey: String?
    public let categories: [String]?
    public let contextTokens: Int?
    public let description: String?
    public let displayName: String?
    public let groups: [String]?
    public let inputModalities: [String]?
    public let limitations: [String]?
    public let maxOutputTokens: Int?
    public let modalities: [String]?
    public let model: String?
    public let officialReferenceCurrency: String?
    public let officialReferencePrices: [AppModelCatalogReferencePrice]?
    public let officialReferenceUnitPrice: String?
    public let outputModalities: [String]?
    public let priceAvailability: AppModelCatalogPriceAvailability?
    public let providerCodes: [String]?
    public let regionCode: String?
    public let releaseStage: Int?
    public let replacementModel: String?
    public let routingState: Int?
    public let shelfState: Int?
    public let supportedLanguages: [String]?
    public let supportsJsonSchema: Bool?
    public let supportsStreaming: Bool?
    public let supportsTools: Bool?
    public let trainingDataCutoff: String?
    public let useCases: [String]?
    public let vendor: String?
    public let vendorCode: String?


    public init(apiFormat: String? = nil, capabilities: [String]? = nil, capabilityIntro: String? = nil, catalogKey: String? = nil, categories: [String]? = nil, contextTokens: Int? = nil, description: String? = nil, displayName: String? = nil, groups: [String]? = nil, inputModalities: [String]? = nil, limitations: [String]? = nil, maxOutputTokens: Int? = nil, modalities: [String]? = nil, model: String? = nil, officialReferenceCurrency: String? = nil, officialReferencePrices: [AppModelCatalogReferencePrice]? = nil, officialReferenceUnitPrice: String? = nil, outputModalities: [String]? = nil, priceAvailability: AppModelCatalogPriceAvailability? = nil, providerCodes: [String]? = nil, regionCode: String? = nil, releaseStage: Int? = nil, replacementModel: String? = nil, routingState: Int? = nil, shelfState: Int? = nil, supportedLanguages: [String]? = nil, supportsJsonSchema: Bool? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, trainingDataCutoff: String? = nil, useCases: [String]? = nil, vendor: String? = nil, vendorCode: String? = nil) {
        self.apiFormat = apiFormat
        self.capabilities = capabilities
        self.capabilityIntro = capabilityIntro
        self.catalogKey = catalogKey
        self.categories = categories
        self.contextTokens = contextTokens
        self.description = description
        self.displayName = displayName
        self.groups = groups
        self.inputModalities = inputModalities
        self.limitations = limitations
        self.maxOutputTokens = maxOutputTokens
        self.modalities = modalities
        self.model = model
        self.officialReferenceCurrency = officialReferenceCurrency
        self.officialReferencePrices = officialReferencePrices
        self.officialReferenceUnitPrice = officialReferenceUnitPrice
        self.outputModalities = outputModalities
        self.priceAvailability = priceAvailability
        self.providerCodes = providerCodes
        self.regionCode = regionCode
        self.releaseStage = releaseStage
        self.replacementModel = replacementModel
        self.routingState = routingState
        self.shelfState = shelfState
        self.supportedLanguages = supportedLanguages
        self.supportsJsonSchema = supportsJsonSchema
        self.supportsStreaming = supportsStreaming
        self.supportsTools = supportsTools
        self.trainingDataCutoff = trainingDataCutoff
        self.useCases = useCases
        self.vendor = vendor
        self.vendorCode = vendorCode
    }
}

public struct AppModelCatalogPriceAvailability: Codable {
    public let reason: String?
    public let status: String?


    public init(reason: String? = nil, status: String? = nil) {
        self.reason = reason
        self.status = status
    }
}

public struct AppModelCatalogReferencePrice: Codable {
    public let billingMeter: String?
    public let currency: String?
    public let unitPrice: String?


    public init(billingMeter: String? = nil, currency: String? = nil, unitPrice: String? = nil) {
        self.billingMeter = billingMeter
        self.currency = currency
        self.unitPrice = unitPrice
    }
}

public struct AppModelCatalogResponse: Codable {
    public let groups: [AppModelCatalogGroupOption]?
    public let items: [AppModelCatalogItem]?


    public init(groups: [AppModelCatalogGroupOption]? = nil, items: [AppModelCatalogItem]? = nil) {
        self.groups = groups
        self.items = items
    }
}

public struct AppReleaseItem: Codable {
    public let downloadUrl: String?
    public let id: String?
    public let os: String?
    public let platformType: String?
    public let releaseDate: String?
    public let size: String?
    public let version: String?
    public let whatsNew: String?


    public init(downloadUrl: String? = nil, id: String? = nil, os: String? = nil, platformType: String? = nil, releaseDate: String? = nil, size: String? = nil, version: String? = nil, whatsNew: String? = nil) {
        self.downloadUrl = downloadUrl
        self.id = id
        self.os = os
        self.platformType = platformType
        self.releaseDate = releaseDate
        self.size = size
        self.version = version
        self.whatsNew = whatsNew
    }
}

public struct AppSkillConfigRequest: Codable {
    public let config: [String: String]?


    public init(config: [String: String]? = nil) {
        self.config = config
    }
}

public struct ApplicationsCreateResult: Codable {
    public let code: String?
    public let data: CourseApplicationCreateResponse?
    public let msg: String?


    public init(code: String? = nil, data: CourseApplicationCreateResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ApplicationsVideosCreateResult: Codable {
    public let code: String?
    public let data: CourseApplicationVideoUploadResponse?
    public let msg: String?


    public init(code: String? = nil, data: CourseApplicationVideoUploadResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsStoreCategoriesListResult: Codable {
    public let code: String?
    public let data: AppCategoriesResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppCategoriesResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsStoreListResult: Codable {
    public let code: String?
    public let data: AppCatalogResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppCatalogResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsStoreRetrieveResult: Codable {
    public let code: String?
    public let data: AppDetailResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppDetailResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ArchivesCreateResult: Codable {
    public let code: String?
    public let data: SdkReferenceArchiveResponse?
    public let msg: String?


    public init(code: String? = nil, data: SdkReferenceArchiveResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ArtifactsCreateResult: Codable {
    public let code: String?
    public let data: RuntimeArtifactResponse?
    public let msg: String?


    public init(code: String? = nil, data: RuntimeArtifactResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ArtifactsListResult: Codable {
    public let code: String?
    public let data: RuntimeArtifactListResponse?
    public let msg: String?


    public init(code: String? = nil, data: RuntimeArtifactListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AuthRuntimeSettingsResponse: Codable {
    public let leftRailMode: String?
    public let loginMethods: [String]?
    public let oauthLoginEnabled: Bool?
    public let oauthProviders: [String]?
    public let oauthRegion: String?
    public let qrLoginEnabled: Bool?
    public let qrLoginType: String?
    public let recoveryMethods: [String]?
    public let registerMethods: [String]?
    public let verificationPolicy: AuthVerificationPolicy?


    public init(leftRailMode: String? = nil, loginMethods: [String]? = nil, oauthLoginEnabled: Bool? = nil, oauthProviders: [String]? = nil, oauthRegion: String? = nil, qrLoginEnabled: Bool? = nil, qrLoginType: String? = nil, recoveryMethods: [String]? = nil, registerMethods: [String]? = nil, verificationPolicy: AuthVerificationPolicy? = nil) {
        self.leftRailMode = leftRailMode
        self.loginMethods = loginMethods
        self.oauthLoginEnabled = oauthLoginEnabled
        self.oauthProviders = oauthProviders
        self.oauthRegion = oauthRegion
        self.qrLoginEnabled = qrLoginEnabled
        self.qrLoginType = qrLoginType
        self.recoveryMethods = recoveryMethods
        self.registerMethods = registerMethods
        self.verificationPolicy = verificationPolicy
    }
}

public struct AuthVerificationPolicy: Codable {
    public let emailCodeLoginEnabled: Bool?
    public let emailRegistrationVerificationRequired: Bool?
    public let phoneCodeLoginEnabled: Bool?
    public let phoneRegistrationVerificationRequired: Bool?


    public init(emailCodeLoginEnabled: Bool? = nil, emailRegistrationVerificationRequired: Bool? = nil, phoneCodeLoginEnabled: Bool? = nil, phoneRegistrationVerificationRequired: Bool? = nil) {
        self.emailCodeLoginEnabled = emailCodeLoginEnabled
        self.emailRegistrationVerificationRequired = emailRegistrationVerificationRequired
        self.phoneCodeLoginEnabled = phoneCodeLoginEnabled
        self.phoneRegistrationVerificationRequired = phoneRegistrationVerificationRequired
    }
}

public struct BillingHistoryCollectionResponse: Codable {
    public let items: [[String: Any]]?


    public init(items: [[String: Any]]? = nil) {
        self.items = items
    }
}

public struct BillingHistoryListResult: Codable {
    public let code: String?
    public let data: BillingHistoryCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: BillingHistoryCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CartCurrentRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CartItemsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CartItemsDeleteResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CartItemsUpdateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogCategoriesListResult: Codable {
    public let code: String?
    public let data: CommerceProductCategoryListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductCategoryListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogProductsListResult: Codable {
    public let code: String?
    public let data: CommerceProductSpuListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductSpuListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogProductsRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceProductSpuDetailResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductSpuDetailResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogSkusRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceProductSkuResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductSkuResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ChatConversationCreateRequest: Codable {
    public let agentId: String?
    public let agentSessionId: String?
    public let defaultModel: String?
    public let defaultProvider: String?
    public let memorySpaceId: String?
    public let metadata: [String: String]?
    public let sourceSurface: String?
    public let title: String?


    public init(agentId: String? = nil, agentSessionId: String? = nil, defaultModel: String? = nil, defaultProvider: String? = nil, memorySpaceId: String? = nil, metadata: [String: String]? = nil, sourceSurface: String? = nil, title: String? = nil) {
        self.agentId = agentId
        self.agentSessionId = agentSessionId
        self.defaultModel = defaultModel
        self.defaultProvider = defaultProvider
        self.memorySpaceId = memorySpaceId
        self.metadata = metadata
        self.sourceSurface = sourceSurface
        self.title = title
    }
}

public struct ChatConversationItem: Codable {
    public let agentId: String?
    public let agentSessionId: String?
    public let createdAt: String?
    public let defaultModel: String?
    public let defaultProvider: String?
    public let id: String?
    public let lastMessagePreview: String?
    public let memorySpaceId: String?
    public let messageCount: Int?
    public let sourceSurface: String?
    public let status: String?
    public let title: String?
    public let turnCount: Int?
    public let updatedAt: String?


    public init(agentId: String? = nil, agentSessionId: String? = nil, createdAt: String? = nil, defaultModel: String? = nil, defaultProvider: String? = nil, id: String? = nil, lastMessagePreview: String? = nil, memorySpaceId: String? = nil, messageCount: Int? = nil, sourceSurface: String? = nil, status: String? = nil, title: String? = nil, turnCount: Int? = nil, updatedAt: String? = nil) {
        self.agentId = agentId
        self.agentSessionId = agentSessionId
        self.createdAt = createdAt
        self.defaultModel = defaultModel
        self.defaultProvider = defaultProvider
        self.id = id
        self.lastMessagePreview = lastMessagePreview
        self.memorySpaceId = memorySpaceId
        self.messageCount = messageCount
        self.sourceSurface = sourceSurface
        self.status = status
        self.title = title
        self.turnCount = turnCount
        self.updatedAt = updatedAt
    }
}

public struct ChatConversationListResponse: Codable {
    public let items: [ChatConversationItem]?


    public init(items: [ChatConversationItem]? = nil) {
        self.items = items
    }
}

public struct ChatConversationResponse: Codable {
    public let item: ChatConversationItem?


    public init(item: ChatConversationItem? = nil) {
        self.item = item
    }
}

public struct ChatMessageItem: Codable {
    public let content: String?
    public let conversationId: String?
    public let createdAt: String?
    public let direction: String?
    public let id: String?
    public let model: String?
    public let provider: String?
    public let role: String?
    public let runtime: String?
    public let runtimeInvocationId: String?
    public let status: String?
    public let turnId: String?
    public let usage: [String: Any]?
    public let usageLinkId: String?


    public init(content: String? = nil, conversationId: String? = nil, createdAt: String? = nil, direction: String? = nil, id: String? = nil, model: String? = nil, provider: String? = nil, role: String? = nil, runtime: String? = nil, runtimeInvocationId: String? = nil, status: String? = nil, turnId: String? = nil, usage: [String: Any]? = nil, usageLinkId: String? = nil) {
        self.content = content
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.direction = direction
        self.id = id
        self.model = model
        self.provider = provider
        self.role = role
        self.runtime = runtime
        self.runtimeInvocationId = runtimeInvocationId
        self.status = status
        self.turnId = turnId
        self.usage = usage
        self.usageLinkId = usageLinkId
    }
}

public struct ChatMessageListResponse: Codable {
    public let items: [ChatMessageItem]?


    public init(items: [ChatMessageItem]? = nil) {
        self.items = items
    }
}

public struct ChatTurnCreateRequest: Codable {
    public let agentId: String?
    public let agentSessionId: String?
    public let message: String?
    public let metadata: [String: String]?
    public let mode: String?
    public let model: String?
    public let provider: String?


    public init(agentId: String? = nil, agentSessionId: String? = nil, message: String? = nil, metadata: [String: String]? = nil, mode: String? = nil, model: String? = nil, provider: String? = nil) {
        self.agentId = agentId
        self.agentSessionId = agentSessionId
        self.message = message
        self.metadata = metadata
        self.mode = mode
        self.model = model
        self.provider = provider
    }
}

public struct ChatTurnCreateResponse: Codable {
    public let messages: [ChatMessageItem]?
    public let turn: ChatTurnItem?


    public init(messages: [ChatMessageItem]? = nil, turn: ChatTurnItem? = nil) {
        self.messages = messages
        self.turn = turn
    }
}

public struct ChatTurnItem: Codable {
    public let agentId: String?
    public let agentSessionId: String?
    public let conversationId: String?
    public let createdAt: String?
    public let id: String?
    public let model: String?
    public let provider: String?
    public let status: String?
    public let updatedAt: String?


    public init(agentId: String? = nil, agentSessionId: String? = nil, conversationId: String? = nil, createdAt: String? = nil, id: String? = nil, model: String? = nil, provider: String? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.agentId = agentId
        self.agentSessionId = agentSessionId
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.id = id
        self.model = model
        self.provider = provider
        self.status = status
        self.updatedAt = updatedAt
    }
}

public struct ChatTurnResponseRequest: Codable {
    public let message: String?
    public let metadata: [String: String]?
    public let model: String?
    public let provider: String?
    public let runtime: String?
    public let runtimeInvocationId: String?
    public let status: String?
    public let usage: [String: Any]?
    public let usageFactId: String?


    public init(message: String? = nil, metadata: [String: String]? = nil, model: String? = nil, provider: String? = nil, runtime: String? = nil, runtimeInvocationId: String? = nil, status: String? = nil, usage: [String: Any]? = nil, usageFactId: String? = nil) {
        self.message = message
        self.metadata = metadata
        self.model = model
        self.provider = provider
        self.runtime = runtime
        self.runtimeInvocationId = runtimeInvocationId
        self.status = status
        self.usage = usage
        self.usageFactId = usageFactId
    }
}

public struct CheckoutSessionsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CheckoutSessionsOrdersCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CheckoutSessionsQuotesCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CheckoutSessionsRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsCreateResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsDeleteResult: Codable {
    public let code: String?
    public let data: NoData?
    public let msg: String?


    public init(code: String? = nil, data: NoData? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsLikesCreateResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsLikesCurrentDeleteResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsListResult: Codable {
    public let code: String?
    public let data: ForumCommentPage?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentPage? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsPinsCreateResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsPinsCurrentDeleteResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsRepliesListResult: Codable {
    public let code: String?
    public let data: ForumCommentPage?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentPage? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsReplyCreateResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsRetrieveResult: Codable {
    public let code: String?
    public let data: ForumCommentDetail?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentDetail? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommentsStatisticsListResult: Codable {
    public let code: String?
    public let data: ForumCommentStatistics?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentStatistics? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommerceAccountHoldRecord: Codable {
    public let accountId: String?
    public let amount: String?
    public let assetType: String?
    public let createdAt: String?
    public let expiresAt: String?
    public let idempotencyKey: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let preholdNo: String?
    public let releasedAt: String?
    public let requestNo: String?
    public let settledAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(accountId: String? = nil, amount: String? = nil, assetType: String? = nil, createdAt: String? = nil, expiresAt: String? = nil, idempotencyKey: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, preholdNo: String? = nil, releasedAt: String? = nil, requestNo: String? = nil, settledAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.accountId = accountId
        self.amount = amount
        self.assetType = assetType
        self.createdAt = createdAt
        self.expiresAt = expiresAt
        self.idempotencyKey = idempotencyKey
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.preholdNo = preholdNo
        self.releasedAt = releasedAt
        self.requestNo = requestNo
        self.settledAt = settledAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceAccountLedgerEntryRecord: Codable {
    public let accountId: String?
    public let amount: String?
    public let assetType: String?
    public let balanceAfter: String?
    public let businessType: String?
    public let createdAt: String?
    public let direction: String?
    public let idempotencyKey: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let remark: String?
    public let requestNo: String?
    public let sourceId: String?
    public let sourceType: String?
    public let tenantId: String?
    public let transactionNo: String?


    public init(accountId: String? = nil, amount: String? = nil, assetType: String? = nil, balanceAfter: String? = nil, businessType: String? = nil, createdAt: String? = nil, direction: String? = nil, idempotencyKey: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, remark: String? = nil, requestNo: String? = nil, sourceId: String? = nil, sourceType: String? = nil, tenantId: String? = nil, transactionNo: String? = nil) {
        self.accountId = accountId
        self.amount = amount
        self.assetType = assetType
        self.balanceAfter = balanceAfter
        self.businessType = businessType
        self.createdAt = createdAt
        self.direction = direction
        self.idempotencyKey = idempotencyKey
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.remark = remark
        self.requestNo = requestNo
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.tenantId = tenantId
        self.transactionNo = transactionNo
    }
}

public struct CommerceAccountRecord: Codable {
    public let assetType: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(assetType: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.assetType = assetType
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceBillingHistoryRecord: Codable {
    public let assetType: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let direction: String?
    public let historyNo: String?
    public let historyType: String?
    public let metadataJson: [String: String]?
    public let occurredAt: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let paymentMethod: String?
    public let referenceNo: String?
    public let relatedOrderId: String?
    public let relatedOrderNo: String?
    public let sourceId: String?
    public let sourceType: String?
    public let status: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?


    public init(assetType: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, direction: String? = nil, historyNo: String? = nil, historyType: String? = nil, metadataJson: [String: String]? = nil, occurredAt: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, paymentMethod: String? = nil, referenceNo: String? = nil, relatedOrderId: String? = nil, relatedOrderNo: String? = nil, sourceId: String? = nil, sourceType: String? = nil, status: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil) {
        self.assetType = assetType
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.direction = direction
        self.historyNo = historyNo
        self.historyType = historyType
        self.metadataJson = metadataJson
        self.occurredAt = occurredAt
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.paymentMethod = paymentMethod
        self.referenceNo = referenceNo
        self.relatedOrderId = relatedOrderId
        self.relatedOrderNo = relatedOrderNo
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.status = status
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
    }
}

public struct CommerceCartItemRecord: Codable {
    public let cartId: String?
    public let createdAt: String?
    public let metadataJson: [String: String]?
    public let organizationId: String?
    public let priceSnapshotJson: [String: String]?
    public let skuId: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(cartId: String? = nil, createdAt: String? = nil, metadataJson: [String: String]? = nil, organizationId: String? = nil, priceSnapshotJson: [String: String]? = nil, skuId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.cartId = cartId
        self.createdAt = createdAt
        self.metadataJson = metadataJson
        self.organizationId = organizationId
        self.priceSnapshotJson = priceSnapshotJson
        self.skuId = skuId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceCartRecord: Codable {
    public let cartNo: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(cartNo: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.cartNo = cartNo
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceCheckoutLineRecord: Codable {
    public let checkoutSessionId: String?
    public let createdAt: String?
    public let fulfillmentType: String?
    public let inventoryReservationId: String?
    public let organizationId: String?
    public let priceSnapshotJson: [String: String]?
    public let promotionSnapshotJson: [String: String]?
    public let purchaseType: String?
    public let skuId: String?
    public let tenantId: String?


    public init(checkoutSessionId: String? = nil, createdAt: String? = nil, fulfillmentType: String? = nil, inventoryReservationId: String? = nil, organizationId: String? = nil, priceSnapshotJson: [String: String]? = nil, promotionSnapshotJson: [String: String]? = nil, purchaseType: String? = nil, skuId: String? = nil, tenantId: String? = nil) {
        self.checkoutSessionId = checkoutSessionId
        self.createdAt = createdAt
        self.fulfillmentType = fulfillmentType
        self.inventoryReservationId = inventoryReservationId
        self.organizationId = organizationId
        self.priceSnapshotJson = priceSnapshotJson
        self.promotionSnapshotJson = promotionSnapshotJson
        self.purchaseType = purchaseType
        self.skuId = skuId
        self.tenantId = tenantId
    }
}

public struct CommerceCheckoutQuoteRecord: Codable {
    public let checkoutSessionId: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let expiresAt: String?
    public let organizationId: String?
    public let originalAmount: String?
    public let payableAmount: String?
    public let quoteNo: String?
    public let tenantId: String?


    public init(checkoutSessionId: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, expiresAt: String? = nil, organizationId: String? = nil, originalAmount: String? = nil, payableAmount: String? = nil, quoteNo: String? = nil, tenantId: String? = nil) {
        self.checkoutSessionId = checkoutSessionId
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.expiresAt = expiresAt
        self.organizationId = organizationId
        self.originalAmount = originalAmount
        self.payableAmount = payableAmount
        self.quoteNo = quoteNo
        self.tenantId = tenantId
    }
}

public struct CommerceCheckoutSessionRecord: Codable {
    public let checkoutSessionNo: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let expiresAt: String?
    public let idempotencyKey: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let requestHash: String?
    public let sourceId: String?
    public let sourceType: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(checkoutSessionNo: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, expiresAt: String? = nil, idempotencyKey: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, requestHash: String? = nil, sourceId: String? = nil, sourceType: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.checkoutSessionNo = checkoutSessionNo
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.expiresAt = expiresAt
        self.idempotencyKey = idempotencyKey
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.requestHash = requestHash
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceDigitalDeliveryRecord: Codable {
    public let createdAt: String?
    public let deliveredAt: String?
    public let deliveryNo: String?
    public let deliveryRef: String?
    public let deliveryType: String?
    public let fulfillmentId: String?
    public let orderItemId: String?
    public let organizationId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, deliveredAt: String? = nil, deliveryNo: String? = nil, deliveryRef: String? = nil, deliveryType: String? = nil, fulfillmentId: String? = nil, orderItemId: String? = nil, organizationId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.deliveredAt = deliveredAt
        self.deliveryNo = deliveryNo
        self.deliveryRef = deliveryRef
        self.deliveryType = deliveryType
        self.fulfillmentId = fulfillmentId
        self.orderItemId = orderItemId
        self.organizationId = organizationId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceExchangeRuleRecord: Codable {
    public let createdAt: String?
    public let idempotencyKey: String?
    public let organizationId: String?
    public let rate: String?
    public let remark: String?
    public let requestNo: String?
    public let ruleNo: String?
    public let sourceAssetType: String?
    public let status: String?
    public let targetAssetType: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, idempotencyKey: String? = nil, organizationId: String? = nil, rate: String? = nil, remark: String? = nil, requestNo: String? = nil, ruleNo: String? = nil, sourceAssetType: String? = nil, status: String? = nil, targetAssetType: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.idempotencyKey = idempotencyKey
        self.organizationId = organizationId
        self.rate = rate
        self.remark = remark
        self.requestNo = requestNo
        self.ruleNo = ruleNo
        self.sourceAssetType = sourceAssetType
        self.status = status
        self.targetAssetType = targetAssetType
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceFulfillmentItemRecord: Codable {
    public let createdAt: String?
    public let fulfillmentId: String?
    public let orderItemId: String?
    public let organizationId: String?
    public let skuId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, fulfillmentId: String? = nil, orderItemId: String? = nil, organizationId: String? = nil, skuId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.fulfillmentId = fulfillmentId
        self.orderItemId = orderItemId
        self.organizationId = organizationId
        self.skuId = skuId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceFulfillmentOrderRecord: Codable {
    public let addressSnapshotId: String?
    public let completedAt: String?
    public let createdAt: String?
    public let fulfillmentNo: String?
    public let fulfillmentType: String?
    public let orderId: String?
    public let organizationId: String?
    public let providerCode: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let warehouseId: String?


    public init(addressSnapshotId: String? = nil, completedAt: String? = nil, createdAt: String? = nil, fulfillmentNo: String? = nil, fulfillmentType: String? = nil, orderId: String? = nil, organizationId: String? = nil, providerCode: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, warehouseId: String? = nil) {
        self.addressSnapshotId = addressSnapshotId
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.fulfillmentNo = fulfillmentNo
        self.fulfillmentType = fulfillmentType
        self.orderId = orderId
        self.organizationId = organizationId
        self.providerCode = providerCode
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.warehouseId = warehouseId
    }
}

public struct CommerceIdempotencyKeyRecord: Codable {
    public let createdAt: String?
    public let expiresAt: String?
    public let idempotencyKey: String?
    public let lockedUntil: String?
    public let organizationId: String?
    public let requestHash: String?
    public let responseJson: String?
    public let scope: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, expiresAt: String? = nil, idempotencyKey: String? = nil, lockedUntil: String? = nil, organizationId: String? = nil, requestHash: String? = nil, responseJson: String? = nil, scope: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.expiresAt = expiresAt
        self.idempotencyKey = idempotencyKey
        self.lockedUntil = lockedUntil
        self.organizationId = organizationId
        self.requestHash = requestHash
        self.responseJson = responseJson
        self.scope = scope
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceInventoryLedgerRecord: Codable {
    public let businessType: String?
    public let createdAt: String?
    public let direction: String?
    public let idempotencyKey: String?
    public let movementNo: String?
    public let organizationId: String?
    public let skuId: String?
    public let sourceId: String?
    public let sourceType: String?
    public let tenantId: String?
    public let warehouseId: String?


    public init(businessType: String? = nil, createdAt: String? = nil, direction: String? = nil, idempotencyKey: String? = nil, movementNo: String? = nil, organizationId: String? = nil, skuId: String? = nil, sourceId: String? = nil, sourceType: String? = nil, tenantId: String? = nil, warehouseId: String? = nil) {
        self.businessType = businessType
        self.createdAt = createdAt
        self.direction = direction
        self.idempotencyKey = idempotencyKey
        self.movementNo = movementNo
        self.organizationId = organizationId
        self.skuId = skuId
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.tenantId = tenantId
        self.warehouseId = warehouseId
    }
}

public struct CommerceInventoryReservationRecord: Codable {
    public let checkoutSessionId: String?
    public let createdAt: String?
    public let expiresAt: String?
    public let idempotencyKey: String?
    public let orderId: String?
    public let organizationId: String?
    public let reservationNo: String?
    public let skuId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let warehouseId: String?


    public init(checkoutSessionId: String? = nil, createdAt: String? = nil, expiresAt: String? = nil, idempotencyKey: String? = nil, orderId: String? = nil, organizationId: String? = nil, reservationNo: String? = nil, skuId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, warehouseId: String? = nil) {
        self.checkoutSessionId = checkoutSessionId
        self.createdAt = createdAt
        self.expiresAt = expiresAt
        self.idempotencyKey = idempotencyKey
        self.orderId = orderId
        self.organizationId = organizationId
        self.reservationNo = reservationNo
        self.skuId = skuId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.warehouseId = warehouseId
    }
}

public struct CommerceInventoryStockRecord: Codable {
    public let createdAt: String?
    public let organizationId: String?
    public let skuId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let warehouseId: String?


    public init(createdAt: String? = nil, organizationId: String? = nil, skuId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, warehouseId: String? = nil) {
        self.createdAt = createdAt
        self.organizationId = organizationId
        self.skuId = skuId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.warehouseId = warehouseId
    }
}

public struct CommerceInvoiceEventRecord: Codable {
    public let actorId: String?
    public let actorType: String?
    public let createdAt: String?
    public let eventNo: String?
    public let eventType: String?
    public let fromStatus: String?
    public let idempotencyKey: String?
    public let invoiceId: String?
    public let message: String?
    public let organizationId: String?
    public let payloadJson: [String: String]?
    public let reasonCode: String?
    public let requestId: String?
    public let tenantId: String?
    public let toStatus: String?


    public init(actorId: String? = nil, actorType: String? = nil, createdAt: String? = nil, eventNo: String? = nil, eventType: String? = nil, fromStatus: String? = nil, idempotencyKey: String? = nil, invoiceId: String? = nil, message: String? = nil, organizationId: String? = nil, payloadJson: [String: String]? = nil, reasonCode: String? = nil, requestId: String? = nil, tenantId: String? = nil, toStatus: String? = nil) {
        self.actorId = actorId
        self.actorType = actorType
        self.createdAt = createdAt
        self.eventNo = eventNo
        self.eventType = eventType
        self.fromStatus = fromStatus
        self.idempotencyKey = idempotencyKey
        self.invoiceId = invoiceId
        self.message = message
        self.organizationId = organizationId
        self.payloadJson = payloadJson
        self.reasonCode = reasonCode
        self.requestId = requestId
        self.tenantId = tenantId
        self.toStatus = toStatus
    }
}

public struct CommerceInvoiceItemRecord: Codable {
    public let amount: String?
    public let createdAt: String?
    public let invoiceId: String?
    public let orderItemId: String?
    public let tenantId: String?
    public let title: String?


    public init(amount: String? = nil, createdAt: String? = nil, invoiceId: String? = nil, orderItemId: String? = nil, tenantId: String? = nil, title: String? = nil) {
        self.amount = amount
        self.createdAt = createdAt
        self.invoiceId = invoiceId
        self.orderItemId = orderItemId
        self.tenantId = tenantId
        self.title = title
    }
}

public struct CommerceInvoiceProviderAttemptRecord: Codable {
    public let attemptNo: String?
    public let createdAt: String?
    public let failedAt: String?
    public let failureCode: String?
    public let failureMessage: String?
    public let invoiceId: String?
    public let organizationId: String?
    public let providerAccountId: String?
    public let providerCode: String?
    public let providerInvoiceId: String?
    public let status: String?
    public let submittedAt: String?
    public let succeededAt: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(attemptNo: String? = nil, createdAt: String? = nil, failedAt: String? = nil, failureCode: String? = nil, failureMessage: String? = nil, invoiceId: String? = nil, organizationId: String? = nil, providerAccountId: String? = nil, providerCode: String? = nil, providerInvoiceId: String? = nil, status: String? = nil, submittedAt: String? = nil, succeededAt: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.attemptNo = attemptNo
        self.createdAt = createdAt
        self.failedAt = failedAt
        self.failureCode = failureCode
        self.failureMessage = failureMessage
        self.invoiceId = invoiceId
        self.organizationId = organizationId
        self.providerAccountId = providerAccountId
        self.providerCode = providerCode
        self.providerInvoiceId = providerInvoiceId
        self.status = status
        self.submittedAt = submittedAt
        self.succeededAt = succeededAt
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceInvoiceRecord: Codable {
    public let createdAt: String?
    public let documentUrl: String?
    public let invoiceCode: String?
    public let invoiceNo: String?
    public let issuedAt: String?
    public let orderId: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let paymentId: String?
    public let status: String?
    public let tenantId: String?
    public let titleId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, documentUrl: String? = nil, invoiceCode: String? = nil, invoiceNo: String? = nil, issuedAt: String? = nil, orderId: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, paymentId: String? = nil, status: String? = nil, tenantId: String? = nil, titleId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.documentUrl = documentUrl
        self.invoiceCode = invoiceCode
        self.invoiceNo = invoiceNo
        self.issuedAt = issuedAt
        self.orderId = orderId
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.paymentId = paymentId
        self.status = status
        self.tenantId = tenantId
        self.titleId = titleId
        self.updatedAt = updatedAt
    }
}

public struct CommerceInvoiceTitleRecord: Codable {
    public let createdAt: String?
    public let name: String?
    public let ownerUserId: String?
    public let taxNo: String?
    public let tenantId: String?
    public let titleType: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, name: String? = nil, ownerUserId: String? = nil, taxNo: String? = nil, tenantId: String? = nil, titleType: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.name = name
        self.ownerUserId = ownerUserId
        self.taxNo = taxNo
        self.tenantId = tenantId
        self.titleType = titleType
        self.updatedAt = updatedAt
    }
}

public struct CommerceMembershipEntitlementRecord: Codable {
    public let createdAt: String?
    public let entitlementCode: String?
    public let name: String?
    public let organizationId: String?
    public let planId: String?
    public let quotaAmount: String?
    public let quotaPeriod: String?
    public let resetPolicy: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, entitlementCode: String? = nil, name: String? = nil, organizationId: String? = nil, planId: String? = nil, quotaAmount: String? = nil, quotaPeriod: String? = nil, resetPolicy: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.entitlementCode = entitlementCode
        self.name = name
        self.organizationId = organizationId
        self.planId = planId
        self.quotaAmount = quotaAmount
        self.quotaPeriod = quotaPeriod
        self.resetPolicy = resetPolicy
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceMembershipEntitlementUsageRecord: Codable {
    public let balanceAfter: String?
    public let createdAt: String?
    public let entitlementId: String?
    public let idempotencyKey: String?
    public let membershipId: String?
    public let occurredAt: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let sourceId: String?
    public let sourceType: String?
    public let tenantId: String?
    public let usageNo: String?
    public let usedAmount: String?


    public init(balanceAfter: String? = nil, createdAt: String? = nil, entitlementId: String? = nil, idempotencyKey: String? = nil, membershipId: String? = nil, occurredAt: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, sourceId: String? = nil, sourceType: String? = nil, tenantId: String? = nil, usageNo: String? = nil, usedAmount: String? = nil) {
        self.balanceAfter = balanceAfter
        self.createdAt = createdAt
        self.entitlementId = entitlementId
        self.idempotencyKey = idempotencyKey
        self.membershipId = membershipId
        self.occurredAt = occurredAt
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.tenantId = tenantId
        self.usageNo = usageNo
        self.usedAmount = usedAmount
    }
}

public struct CommerceMembershipPackageGroupRecord: Codable {
    public let createdAt: String?
    public let description: String?
    public let groupNo: String?
    public let name: String?
    public let organizationId: String?
    public let planId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, description: String? = nil, groupNo: String? = nil, name: String? = nil, organizationId: String? = nil, planId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.description = description
        self.groupNo = groupNo
        self.name = name
        self.organizationId = organizationId
        self.planId = planId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceMembershipPackageRecord: Codable {
    public let createdAt: String?
    public let currencyCode: String?
    public let durationDays: String?
    public let endsAt: String?
    public let organizationId: String?
    public let packageGroupId: String?
    public let packageNo: String?
    public let planId: String?
    public let priceAmount: String?
    public let recurrenceCycle: String?
    public let skuId: String?
    public let startsAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, currencyCode: String? = nil, durationDays: String? = nil, endsAt: String? = nil, organizationId: String? = nil, packageGroupId: String? = nil, packageNo: String? = nil, planId: String? = nil, priceAmount: String? = nil, recurrenceCycle: String? = nil, skuId: String? = nil, startsAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.durationDays = durationDays
        self.endsAt = endsAt
        self.organizationId = organizationId
        self.packageGroupId = packageGroupId
        self.packageNo = packageNo
        self.planId = planId
        self.priceAmount = priceAmount
        self.recurrenceCycle = recurrenceCycle
        self.skuId = skuId
        self.startsAt = startsAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceMembershipPlanRecord: Codable {
    public let benefitsJson: [String: String]?
    public let createdAt: String?
    public let levelCode: String?
    public let name: String?
    public let organizationId: String?
    public let planNo: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(benefitsJson: [String: String]? = nil, createdAt: String? = nil, levelCode: String? = nil, name: String? = nil, organizationId: String? = nil, planNo: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.benefitsJson = benefitsJson
        self.createdAt = createdAt
        self.levelCode = levelCode
        self.name = name
        self.organizationId = organizationId
        self.planNo = planNo
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceMembershipPurchaseRequest: Codable {
    public let couponId: String?
    public let packageId: Int?
    public let paymentMethod: String?


    public init(couponId: String? = nil, packageId: Int? = nil, paymentMethod: String? = nil) {
        self.couponId = couponId
        self.packageId = packageId
        self.paymentMethod = paymentMethod
    }
}

public struct CommerceMembershipRecord: Codable {
    public let createdAt: String?
    public let expiresAt: String?
    public let graceUntil: String?
    public let membershipNo: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let planId: String?
    public let sourceOrderId: String?
    public let sourcePaymentIntentId: String?
    public let startsAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, expiresAt: String? = nil, graceUntil: String? = nil, membershipNo: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, planId: String? = nil, sourceOrderId: String? = nil, sourcePaymentIntentId: String? = nil, startsAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.expiresAt = expiresAt
        self.graceUntil = graceUntil
        self.membershipNo = membershipNo
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.planId = planId
        self.sourceOrderId = sourceOrderId
        self.sourcePaymentIntentId = sourcePaymentIntentId
        self.startsAt = startsAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceOperationResponse: Codable {
    public let paymentId: String?
    public let qrCodeImageUrl: String?
    public let qrCodePayload: String?
    public let requestNo: String?
    public let status: String?
    public let success: Bool?


    public init(paymentId: String? = nil, qrCodeImageUrl: String? = nil, qrCodePayload: String? = nil, requestNo: String? = nil, status: String? = nil, success: Bool? = nil) {
        self.paymentId = paymentId
        self.qrCodeImageUrl = qrCodeImageUrl
        self.qrCodePayload = qrCodePayload
        self.requestNo = requestNo
        self.status = status
        self.success = success
    }
}

public struct CommerceOrderAddressSnapshotRecord: Codable {
    public let addressLine1Encrypted: String?
    public let capturedAt: String?
    public let city: String?
    public let countryCode: String?
    public let district: String?
    public let orderId: String?
    public let organizationId: String?
    public let phoneMasked: String?
    public let postalCode: String?
    public let recipientNameSnapshot: String?
    public let regionCode: String?
    public let sourceAddressId: String?
    public let tenantId: String?


    public init(addressLine1Encrypted: String? = nil, capturedAt: String? = nil, city: String? = nil, countryCode: String? = nil, district: String? = nil, orderId: String? = nil, organizationId: String? = nil, phoneMasked: String? = nil, postalCode: String? = nil, recipientNameSnapshot: String? = nil, regionCode: String? = nil, sourceAddressId: String? = nil, tenantId: String? = nil) {
        self.addressLine1Encrypted = addressLine1Encrypted
        self.capturedAt = capturedAt
        self.city = city
        self.countryCode = countryCode
        self.district = district
        self.orderId = orderId
        self.organizationId = organizationId
        self.phoneMasked = phoneMasked
        self.postalCode = postalCode
        self.recipientNameSnapshot = recipientNameSnapshot
        self.regionCode = regionCode
        self.sourceAddressId = sourceAddressId
        self.tenantId = tenantId
    }
}

public struct CommerceOrderAmountBreakdownRecord: Codable {
    public let createdAt: String?
    public let currencyCode: String?
    public let discountAmount: String?
    public let orderId: String?
    public let originalAmount: String?
    public let payableAmount: String?
    public let tenantId: String?


    public init(createdAt: String? = nil, currencyCode: String? = nil, discountAmount: String? = nil, orderId: String? = nil, originalAmount: String? = nil, payableAmount: String? = nil, tenantId: String? = nil) {
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.discountAmount = discountAmount
        self.orderId = orderId
        self.originalAmount = originalAmount
        self.payableAmount = payableAmount
        self.tenantId = tenantId
    }
}

public struct CommerceOrderCancellationRecord: Codable {
    public let approvedBy: String?
    public let cancellationNo: String?
    public let completedAt: String?
    public let createdAt: String?
    public let idempotencyKey: String?
    public let orderId: String?
    public let organizationId: String?
    public let reasonCode: String?
    public let reasonMessage: String?
    public let requestedBy: String?
    public let status: String?
    public let tenantId: String?


    public init(approvedBy: String? = nil, cancellationNo: String? = nil, completedAt: String? = nil, createdAt: String? = nil, idempotencyKey: String? = nil, orderId: String? = nil, organizationId: String? = nil, reasonCode: String? = nil, reasonMessage: String? = nil, requestedBy: String? = nil, status: String? = nil, tenantId: String? = nil) {
        self.approvedBy = approvedBy
        self.cancellationNo = cancellationNo
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.idempotencyKey = idempotencyKey
        self.orderId = orderId
        self.organizationId = organizationId
        self.reasonCode = reasonCode
        self.reasonMessage = reasonMessage
        self.requestedBy = requestedBy
        self.status = status
        self.tenantId = tenantId
    }
}

public struct CommerceOrderEventRecord: Codable {
    public let actorId: String?
    public let actorType: String?
    public let createdAt: String?
    public let eventNo: String?
    public let eventType: String?
    public let fromStatus: String?
    public let idempotencyKey: String?
    public let message: String?
    public let orderId: String?
    public let organizationId: String?
    public let payloadJson: [String: String]?
    public let reasonCode: String?
    public let requestId: String?
    public let tenantId: String?
    public let toStatus: String?


    public init(actorId: String? = nil, actorType: String? = nil, createdAt: String? = nil, eventNo: String? = nil, eventType: String? = nil, fromStatus: String? = nil, idempotencyKey: String? = nil, message: String? = nil, orderId: String? = nil, organizationId: String? = nil, payloadJson: [String: String]? = nil, reasonCode: String? = nil, requestId: String? = nil, tenantId: String? = nil, toStatus: String? = nil) {
        self.actorId = actorId
        self.actorType = actorType
        self.createdAt = createdAt
        self.eventNo = eventNo
        self.eventType = eventType
        self.fromStatus = fromStatus
        self.idempotencyKey = idempotencyKey
        self.message = message
        self.orderId = orderId
        self.organizationId = organizationId
        self.payloadJson = payloadJson
        self.reasonCode = reasonCode
        self.requestId = requestId
        self.tenantId = tenantId
        self.toStatus = toStatus
    }
}

public struct CommerceOrderItemRecord: Codable {
    public let createdAt: String?
    public let orderId: String?
    public let quantity: String?
    public let skuId: String?
    public let tenantId: String?
    public let title: String?
    public let totalAmount: String?
    public let unitPriceAmount: String?


    public init(createdAt: String? = nil, orderId: String? = nil, quantity: String? = nil, skuId: String? = nil, tenantId: String? = nil, title: String? = nil, totalAmount: String? = nil, unitPriceAmount: String? = nil) {
        self.createdAt = createdAt
        self.orderId = orderId
        self.quantity = quantity
        self.skuId = skuId
        self.tenantId = tenantId
        self.title = title
        self.totalAmount = totalAmount
        self.unitPriceAmount = unitPriceAmount
    }
}

public struct CommerceOrderRecord: Codable {
    public let cancelledAt: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let expiredAt: String?
    public let idempotencyKey: String?
    public let orderNo: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let paidAt: String?
    public let requestNo: String?
    public let status: String?
    public let subject: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(cancelledAt: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, expiredAt: String? = nil, idempotencyKey: String? = nil, orderNo: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, paidAt: String? = nil, requestNo: String? = nil, status: String? = nil, subject: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.cancelledAt = cancelledAt
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.expiredAt = expiredAt
        self.idempotencyKey = idempotencyKey
        self.orderNo = orderNo
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.paidAt = paidAt
        self.requestNo = requestNo
        self.status = status
        self.subject = subject
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentAttemptCreateRequest: Codable {
    public let clientRequestNo: String?
    public let methodCode: String?
    public let note: String?
    public let providerCode: String?
    public let returnUrl: String?


    public init(clientRequestNo: String? = nil, methodCode: String? = nil, note: String? = nil, providerCode: String? = nil, returnUrl: String? = nil) {
        self.clientRequestNo = clientRequestNo
        self.methodCode = methodCode
        self.note = note
        self.providerCode = providerCode
        self.returnUrl = returnUrl
    }
}

public struct CommercePaymentAttemptItem: Codable {
    public let amount: String?
    public let attemptNo: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let externalTradeNo: String?
    public let id: String?
    public let intentId: String?
    public let methodCode: String?
    public let paidAt: String?
    public let providerCode: String?
    public let status: String?
    public let updatedAt: String?


    public init(amount: String? = nil, attemptNo: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, externalTradeNo: String? = nil, id: String? = nil, intentId: String? = nil, methodCode: String? = nil, paidAt: String? = nil, providerCode: String? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.amount = amount
        self.attemptNo = attemptNo
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.externalTradeNo = externalTradeNo
        self.id = id
        self.intentId = intentId
        self.methodCode = methodCode
        self.paidAt = paidAt
        self.providerCode = providerCode
        self.status = status
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentAttemptRecord: Codable {
    public let amount: String?
    public let callbackPayload: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let orderId: String?
    public let organizationId: String?
    public let outTradeNo: String?
    public let ownerUserId: String?
    public let paidAt: String?
    public let paymentIntentId: String?
    public let provider: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(amount: String? = nil, callbackPayload: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, orderId: String? = nil, organizationId: String? = nil, outTradeNo: String? = nil, ownerUserId: String? = nil, paidAt: String? = nil, paymentIntentId: String? = nil, provider: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.amount = amount
        self.callbackPayload = callbackPayload
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.orderId = orderId
        self.organizationId = organizationId
        self.outTradeNo = outTradeNo
        self.ownerUserId = ownerUserId
        self.paidAt = paidAt
        self.paymentIntentId = paymentIntentId
        self.provider = provider
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentAttemptResponse: Codable {
    public let item: CommercePaymentAttemptItem?


    public init(item: CommercePaymentAttemptItem? = nil) {
        self.item = item
    }
}

public struct CommercePaymentChannelRecord: Codable {
    public let channelNo: String?
    public let countryCode: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let methodId: String?
    public let organizationId: String?
    public let providerAccountId: String?
    public let sceneCode: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(channelNo: String? = nil, countryCode: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, methodId: String? = nil, organizationId: String? = nil, providerAccountId: String? = nil, sceneCode: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.channelNo = channelNo
        self.countryCode = countryCode
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.methodId = methodId
        self.organizationId = organizationId
        self.providerAccountId = providerAccountId
        self.sceneCode = sceneCode
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentIntentCreateRequest: Codable {
    public let amount: String?
    public let checkoutSessionId: String?
    public let clientRequestNo: String?
    public let currencyCode: String?
    public let methodCode: String?
    public let note: String?
    public let orderId: String?
    public let subjectType: String?


    public init(amount: String? = nil, checkoutSessionId: String? = nil, clientRequestNo: String? = nil, currencyCode: String? = nil, methodCode: String? = nil, note: String? = nil, orderId: String? = nil, subjectType: String? = nil) {
        self.amount = amount
        self.checkoutSessionId = checkoutSessionId
        self.clientRequestNo = clientRequestNo
        self.currencyCode = currencyCode
        self.methodCode = methodCode
        self.note = note
        self.orderId = orderId
        self.subjectType = subjectType
    }
}

public struct CommercePaymentIntentItem: Codable {
    public let amount: String?
    public let checkoutSessionId: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let id: String?
    public let intentNo: String?
    public let methodCode: String?
    public let orderId: String?
    public let providerCode: String?
    public let status: String?
    public let subjectType: String?
    public let updatedAt: String?


    public init(amount: String? = nil, checkoutSessionId: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, id: String? = nil, intentNo: String? = nil, methodCode: String? = nil, orderId: String? = nil, providerCode: String? = nil, status: String? = nil, subjectType: String? = nil, updatedAt: String? = nil) {
        self.amount = amount
        self.checkoutSessionId = checkoutSessionId
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.id = id
        self.intentNo = intentNo
        self.methodCode = methodCode
        self.orderId = orderId
        self.providerCode = providerCode
        self.status = status
        self.subjectType = subjectType
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentIntentRecord: Codable {
    public let amount: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let idempotencyKey: String?
    public let orderId: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let provider: String?
    public let requestNo: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(amount: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, idempotencyKey: String? = nil, orderId: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, provider: String? = nil, requestNo: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.amount = amount
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.idempotencyKey = idempotencyKey
        self.orderId = orderId
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.provider = provider
        self.requestNo = requestNo
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentIntentResponse: Codable {
    public let item: CommercePaymentIntentItem?


    public init(item: CommercePaymentIntentItem? = nil) {
        self.item = item
    }
}

public struct CommercePaymentMethodItem: Codable {
    public let checkoutScenes: [String]?
    public let createdAt: String?
    public let displayName: String?
    public let id: String?
    public let methodCode: String?
    public let methodType: String?
    public let providerCode: String?
    public let sortOrder: Int?
    public let status: String?
    public let updatedAt: String?


    public init(checkoutScenes: [String]? = nil, createdAt: String? = nil, displayName: String? = nil, id: String? = nil, methodCode: String? = nil, methodType: String? = nil, providerCode: String? = nil, sortOrder: Int? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.checkoutScenes = checkoutScenes
        self.createdAt = createdAt
        self.displayName = displayName
        self.id = id
        self.methodCode = methodCode
        self.methodType = methodType
        self.providerCode = providerCode
        self.sortOrder = sortOrder
        self.status = status
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentMethodListResponse: Codable {
    public let items: [CommercePaymentMethodItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommercePaymentMethodItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct CommercePaymentMethodRecord: Codable {
    public let createdAt: String?
    public let displayName: String?
    public let idempotencyKey: String?
    public let methodKey: String?
    public let organizationId: String?
    public let provider: String?
    public let requestNo: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, displayName: String? = nil, idempotencyKey: String? = nil, methodKey: String? = nil, organizationId: String? = nil, provider: String? = nil, requestNo: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.displayName = displayName
        self.idempotencyKey = idempotencyKey
        self.methodKey = methodKey
        self.organizationId = organizationId
        self.provider = provider
        self.requestNo = requestNo
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentProviderAccountRecord: Codable {
    public let accountNo: String?
    public let certificateRef: String?
    public let countryCode: String?
    public let createdAt: String?
    public let environment: String?
    public let merchantId: String?
    public let organizationId: String?
    public let providerCode: String?
    public let rotatedAt: String?
    public let secretRef: String?
    public let settlementCurrency: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let webhookSecretRef: String?


    public init(accountNo: String? = nil, certificateRef: String? = nil, countryCode: String? = nil, createdAt: String? = nil, environment: String? = nil, merchantId: String? = nil, organizationId: String? = nil, providerCode: String? = nil, rotatedAt: String? = nil, secretRef: String? = nil, settlementCurrency: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, webhookSecretRef: String? = nil) {
        self.accountNo = accountNo
        self.certificateRef = certificateRef
        self.countryCode = countryCode
        self.createdAt = createdAt
        self.environment = environment
        self.merchantId = merchantId
        self.organizationId = organizationId
        self.providerCode = providerCode
        self.rotatedAt = rotatedAt
        self.secretRef = secretRef
        self.settlementCurrency = settlementCurrency
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.webhookSecretRef = webhookSecretRef
    }
}

public struct CommercePaymentProviderRecord: Codable {
    public let createdAt: String?
    public let displayName: String?
    public let organizationId: String?
    public let providerCode: String?
    public let providerType: String?
    public let status: String?
    public let supportedCountries: [String: String]?
    public let supportedCurrencies: [String: String]?
    public let supportedMethods: [String: String]?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, displayName: String? = nil, organizationId: String? = nil, providerCode: String? = nil, providerType: String? = nil, status: String? = nil, supportedCountries: [String: String]? = nil, supportedCurrencies: [String: String]? = nil, supportedMethods: [String: String]? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.displayName = displayName
        self.organizationId = organizationId
        self.providerCode = providerCode
        self.providerType = providerType
        self.status = status
        self.supportedCountries = supportedCountries
        self.supportedCurrencies = supportedCurrencies
        self.supportedMethods = supportedMethods
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentReconciliationRunRecord: Codable {
    public let completedAt: String?
    public let createdAt: String?
    public let differenceAmount: String?
    public let idempotencyKey: String?
    public let matchedCount: String?
    public let mismatchedCount: String?
    public let missingInternalCount: String?
    public let missingProviderCount: String?
    public let organizationId: String?
    public let periodEnd: String?
    public let periodStart: String?
    public let providerAccountId: String?
    public let providerCode: String?
    public let reportFileRef: String?
    public let requestNo: String?
    public let runNo: String?
    public let settlementCurrency: String?
    public let startedAt: String?
    public let status: String?
    public let tenantId: String?
    public let totalInternalAmount: String?
    public let totalProviderAmount: String?
    public let updatedAt: String?


    public init(completedAt: String? = nil, createdAt: String? = nil, differenceAmount: String? = nil, idempotencyKey: String? = nil, matchedCount: String? = nil, mismatchedCount: String? = nil, missingInternalCount: String? = nil, missingProviderCount: String? = nil, organizationId: String? = nil, periodEnd: String? = nil, periodStart: String? = nil, providerAccountId: String? = nil, providerCode: String? = nil, reportFileRef: String? = nil, requestNo: String? = nil, runNo: String? = nil, settlementCurrency: String? = nil, startedAt: String? = nil, status: String? = nil, tenantId: String? = nil, totalInternalAmount: String? = nil, totalProviderAmount: String? = nil, updatedAt: String? = nil) {
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.differenceAmount = differenceAmount
        self.idempotencyKey = idempotencyKey
        self.matchedCount = matchedCount
        self.mismatchedCount = mismatchedCount
        self.missingInternalCount = missingInternalCount
        self.missingProviderCount = missingProviderCount
        self.organizationId = organizationId
        self.periodEnd = periodEnd
        self.periodStart = periodStart
        self.providerAccountId = providerAccountId
        self.providerCode = providerCode
        self.reportFileRef = reportFileRef
        self.requestNo = requestNo
        self.runNo = runNo
        self.settlementCurrency = settlementCurrency
        self.startedAt = startedAt
        self.status = status
        self.tenantId = tenantId
        self.totalInternalAmount = totalInternalAmount
        self.totalProviderAmount = totalProviderAmount
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentRouteRuleRecord: Codable {
    public let amountMax: String?
    public let amountMin: String?
    public let channelId: String?
    public let clientPlatform: String?
    public let countryCode: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let endsAt: String?
    public let organizationId: String?
    public let purchaseType: String?
    public let riskLevel: String?
    public let ruleNo: String?
    public let startsAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userSegment: String?


    public init(amountMax: String? = nil, amountMin: String? = nil, channelId: String? = nil, clientPlatform: String? = nil, countryCode: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, endsAt: String? = nil, organizationId: String? = nil, purchaseType: String? = nil, riskLevel: String? = nil, ruleNo: String? = nil, startsAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userSegment: String? = nil) {
        self.amountMax = amountMax
        self.amountMin = amountMin
        self.channelId = channelId
        self.clientPlatform = clientPlatform
        self.countryCode = countryCode
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.endsAt = endsAt
        self.organizationId = organizationId
        self.purchaseType = purchaseType
        self.riskLevel = riskLevel
        self.ruleNo = ruleNo
        self.startsAt = startsAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userSegment = userSegment
    }
}

public struct CommercePaymentWebhookEventRecord: Codable {
    public let createdAt: String?
    public let eventId: String?
    public let idempotencyKey: String?
    public let message: String?
    public let nonce: String?
    public let organizationId: String?
    public let outTradeNo: String?
    public let payloadDigest: String?
    public let processedAt: String?
    public let provider: String?
    public let requestNo: String?
    public let requestTimestamp: String?
    public let signature: String?
    public let status: String?
    public let tenantId: String?
    public let transactionId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, eventId: String? = nil, idempotencyKey: String? = nil, message: String? = nil, nonce: String? = nil, organizationId: String? = nil, outTradeNo: String? = nil, payloadDigest: String? = nil, processedAt: String? = nil, provider: String? = nil, requestNo: String? = nil, requestTimestamp: String? = nil, signature: String? = nil, status: String? = nil, tenantId: String? = nil, transactionId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.eventId = eventId
        self.idempotencyKey = idempotencyKey
        self.message = message
        self.nonce = nonce
        self.organizationId = organizationId
        self.outTradeNo = outTradeNo
        self.payloadDigest = payloadDigest
        self.processedAt = processedAt
        self.provider = provider
        self.requestNo = requestNo
        self.requestTimestamp = requestTimestamp
        self.signature = signature
        self.status = status
        self.tenantId = tenantId
        self.transactionId = transactionId
        self.updatedAt = updatedAt
    }
}

public struct CommercePriceListItemRecord: Codable {
    public let compareAtAmount: String?
    public let createdAt: String?
    public let maxQuantity: String?
    public let organizationId: String?
    public let priceAmount: String?
    public let priceListId: String?
    public let skuId: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(compareAtAmount: String? = nil, createdAt: String? = nil, maxQuantity: String? = nil, organizationId: String? = nil, priceAmount: String? = nil, priceListId: String? = nil, skuId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.compareAtAmount = compareAtAmount
        self.createdAt = createdAt
        self.maxQuantity = maxQuantity
        self.organizationId = organizationId
        self.priceAmount = priceAmount
        self.priceListId = priceListId
        self.skuId = skuId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommercePriceListRecord: Codable {
    public let createdAt: String?
    public let currencyCode: String?
    public let customerSegment: String?
    public let endsAt: String?
    public let marketCode: String?
    public let organizationId: String?
    public let priceListNo: String?
    public let startsAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, currencyCode: String? = nil, customerSegment: String? = nil, endsAt: String? = nil, marketCode: String? = nil, organizationId: String? = nil, priceListNo: String? = nil, startsAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.customerSegment = customerSegment
        self.endsAt = endsAt
        self.marketCode = marketCode
        self.organizationId = organizationId
        self.priceListNo = priceListNo
        self.startsAt = startsAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceProductAttributeRecord: Codable {
    public let attributeNo: String?
    public let createdAt: String?
    public let filterable: Bool?
    public let name: String?
    public let organizationId: String?
    public let required_: Bool?
    public let scope: String?
    public let searchable: Bool?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let valueType: String?


    public init(attributeNo: String? = nil, createdAt: String? = nil, filterable: Bool? = nil, name: String? = nil, organizationId: String? = nil, required_: Bool? = nil, scope: String? = nil, searchable: Bool? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, valueType: String? = nil) {
        self.attributeNo = attributeNo
        self.createdAt = createdAt
        self.filterable = filterable
        self.name = name
        self.organizationId = organizationId
        self.required_ = required_
        self.scope = scope
        self.searchable = searchable
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.valueType = valueType
    }
}

public struct CommerceProductAttributeValueRecord: Codable {
    public let attributeId: String?
    public let createdAt: String?
    public let displayValue: String?
    public let organizationId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let valueCode: String?


    public init(attributeId: String? = nil, createdAt: String? = nil, displayValue: String? = nil, organizationId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, valueCode: String? = nil) {
        self.attributeId = attributeId
        self.createdAt = createdAt
        self.displayValue = displayValue
        self.organizationId = organizationId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.valueCode = valueCode
    }
}

public struct CommerceProductCategoryItem: Codable {
    public let categoryNo: String?
    public let createdAt: String?
    public let id: String?
    public let levelNo: Int?
    public let name: String?
    public let parentId: String?
    public let path: String?
    public let sortOrder: Int?
    public let status: String?
    public let updatedAt: String?


    public init(categoryNo: String? = nil, createdAt: String? = nil, id: String? = nil, levelNo: Int? = nil, name: String? = nil, parentId: String? = nil, path: String? = nil, sortOrder: Int? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.categoryNo = categoryNo
        self.createdAt = createdAt
        self.id = id
        self.levelNo = levelNo
        self.name = name
        self.parentId = parentId
        self.path = path
        self.sortOrder = sortOrder
        self.status = status
        self.updatedAt = updatedAt
    }
}

public struct CommerceProductCategoryListResponse: Codable {
    public let items: [CommerceProductCategoryItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommerceProductCategoryItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct CommerceProductCategoryRecord: Codable {
    public let categoryNo: String?
    public let createdAt: String?
    public let description: String?
    public let iconUrl: String?
    public let levelNo: Int?
    public let name: String?
    public let organizationId: String?
    public let parentId: String?
    public let path: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(categoryNo: String? = nil, createdAt: String? = nil, description: String? = nil, iconUrl: String? = nil, levelNo: Int? = nil, name: String? = nil, organizationId: String? = nil, parentId: String? = nil, path: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.categoryNo = categoryNo
        self.createdAt = createdAt
        self.description = description
        self.iconUrl = iconUrl
        self.levelNo = levelNo
        self.name = name
        self.organizationId = organizationId
        self.parentId = parentId
        self.path = path
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceProductMediaItem: Codable {
    public let altText: String?
    public let id: String?
    public let mediaType: String?
    public let ownerId: String?
    public let ownerType: String?
    public let sortOrder: Int?
    public let status: String?
    public let url: String?


    public init(altText: String? = nil, id: String? = nil, mediaType: String? = nil, ownerId: String? = nil, ownerType: String? = nil, sortOrder: Int? = nil, status: String? = nil, url: String? = nil) {
        self.altText = altText
        self.id = id
        self.mediaType = mediaType
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.sortOrder = sortOrder
        self.status = status
        self.url = url
    }
}

public struct CommerceProductMediaRecord: Codable {
    public let altText: String?
    public let createdAt: String?
    public let mediaType: String?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let url: String?


    public init(altText: String? = nil, createdAt: String? = nil, mediaType: String? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, url: String? = nil) {
        self.altText = altText
        self.createdAt = createdAt
        self.mediaType = mediaType
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.url = url
    }
}

public struct CommerceProductSkuAttributeItem: Codable {
    public let attributeId: String?
    public let attributeName: String?
    public let attributeValueId: String?
    public let customValue: String?
    public let displayValue: String?
    public let valueCode: String?


    public init(attributeId: String? = nil, attributeName: String? = nil, attributeValueId: String? = nil, customValue: String? = nil, displayValue: String? = nil, valueCode: String? = nil) {
        self.attributeId = attributeId
        self.attributeName = attributeName
        self.attributeValueId = attributeValueId
        self.customValue = customValue
        self.displayValue = displayValue
        self.valueCode = valueCode
    }
}

public struct CommerceProductSkuAttributeRecord: Codable {
    public let attributeId: String?
    public let attributeValueId: String?
    public let createdAt: String?
    public let customValue: String?
    public let organizationId: String?
    public let skuId: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(attributeId: String? = nil, attributeValueId: String? = nil, createdAt: String? = nil, customValue: String? = nil, organizationId: String? = nil, skuId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.attributeId = attributeId
        self.attributeValueId = attributeValueId
        self.createdAt = createdAt
        self.customValue = customValue
        self.organizationId = organizationId
        self.skuId = skuId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceProductSkuItem: Codable {
    public let attributes: [CommerceProductSkuAttributeItem]?
    public let createdAt: String?
    public let defaultCurrencyCode: String?
    public let defaultPriceAmount: String?
    public let fulfillmentType: String?
    public let id: String?
    public let productId: String?
    public let publishedAt: String?
    public let salesUnit: String?
    public let skuNo: String?
    public let status: String?
    public let taxCategory: String?
    public let title: String?
    public let updatedAt: String?


    public init(attributes: [CommerceProductSkuAttributeItem]? = nil, createdAt: String? = nil, defaultCurrencyCode: String? = nil, defaultPriceAmount: String? = nil, fulfillmentType: String? = nil, id: String? = nil, productId: String? = nil, publishedAt: String? = nil, salesUnit: String? = nil, skuNo: String? = nil, status: String? = nil, taxCategory: String? = nil, title: String? = nil, updatedAt: String? = nil) {
        self.attributes = attributes
        self.createdAt = createdAt
        self.defaultCurrencyCode = defaultCurrencyCode
        self.defaultPriceAmount = defaultPriceAmount
        self.fulfillmentType = fulfillmentType
        self.id = id
        self.productId = productId
        self.publishedAt = publishedAt
        self.salesUnit = salesUnit
        self.skuNo = skuNo
        self.status = status
        self.taxCategory = taxCategory
        self.title = title
        self.updatedAt = updatedAt
    }
}

public struct CommerceProductSkuRecord: Codable {
    public let createdAt: String?
    public let defaultCurrencyCode: String?
    public let defaultPriceAmount: String?
    public let fulfillmentType: String?
    public let organizationId: String?
    public let publishedAt: String?
    public let salesUnit: String?
    public let skuNo: String?
    public let spuId: String?
    public let status: String?
    public let taxCategory: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, defaultCurrencyCode: String? = nil, defaultPriceAmount: String? = nil, fulfillmentType: String? = nil, organizationId: String? = nil, publishedAt: String? = nil, salesUnit: String? = nil, skuNo: String? = nil, spuId: String? = nil, status: String? = nil, taxCategory: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.defaultCurrencyCode = defaultCurrencyCode
        self.defaultPriceAmount = defaultPriceAmount
        self.fulfillmentType = fulfillmentType
        self.organizationId = organizationId
        self.publishedAt = publishedAt
        self.salesUnit = salesUnit
        self.skuNo = skuNo
        self.spuId = spuId
        self.status = status
        self.taxCategory = taxCategory
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
    }
}

public struct CommerceProductSkuResponse: Codable {
    public let item: CommerceProductSkuItem?


    public init(item: CommerceProductSkuItem? = nil) {
        self.item = item
    }
}

public struct CommerceProductSpuDetailResponse: Codable {
    public let item: CommerceProductSpuItem?
    public let skus: [CommerceProductSkuItem]?


    public init(item: CommerceProductSpuItem? = nil, skus: [CommerceProductSkuItem]? = nil) {
        self.item = item
        self.skus = skus
    }
}

public struct CommerceProductSpuItem: Codable {
    public let brand: String?
    public let categoryId: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let defaultSkuId: String?
    public let description: String?
    public let id: String?
    public let media: [CommerceProductMediaItem]?
    public let minPriceAmount: String?
    public let productType: String?
    public let publishedAt: String?
    public let spuNo: String?
    public let status: String?
    public let subtitle: String?
    public let title: String?
    public let updatedAt: String?


    public init(brand: String? = nil, categoryId: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, defaultSkuId: String? = nil, description: String? = nil, id: String? = nil, media: [CommerceProductMediaItem]? = nil, minPriceAmount: String? = nil, productType: String? = nil, publishedAt: String? = nil, spuNo: String? = nil, status: String? = nil, subtitle: String? = nil, title: String? = nil, updatedAt: String? = nil) {
        self.brand = brand
        self.categoryId = categoryId
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.defaultSkuId = defaultSkuId
        self.description = description
        self.id = id
        self.media = media
        self.minPriceAmount = minPriceAmount
        self.productType = productType
        self.publishedAt = publishedAt
        self.spuNo = spuNo
        self.status = status
        self.subtitle = subtitle
        self.title = title
        self.updatedAt = updatedAt
    }
}

public struct CommerceProductSpuListResponse: Codable {
    public let items: [CommerceProductSpuItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommerceProductSpuItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct CommerceProductSpuRecord: Codable {
    public let brand: String?
    public let categoryId: String?
    public let createdAt: String?
    public let description: String?
    public let organizationId: String?
    public let productType: String?
    public let publishedAt: String?
    public let spuNo: String?
    public let status: String?
    public let subtitle: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?


    public init(brand: String? = nil, categoryId: String? = nil, createdAt: String? = nil, description: String? = nil, organizationId: String? = nil, productType: String? = nil, publishedAt: String? = nil, spuNo: String? = nil, status: String? = nil, subtitle: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil) {
        self.brand = brand
        self.categoryId = categoryId
        self.createdAt = createdAt
        self.description = description
        self.organizationId = organizationId
        self.productType = productType
        self.publishedAt = publishedAt
        self.spuNo = spuNo
        self.status = status
        self.subtitle = subtitle
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
    }
}

public struct CommerceRechargePackageRecord: Codable {
    public let createdAt: String?
    public let currencyCode: String?
    public let externalId: String?
    public let idempotencyKey: String?
    public let name: String?
    public let organizationId: String?
    public let packageNo: String?
    public let priceAmount: String?
    public let requestNo: String?
    public let skuId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let validFrom: String?
    public let validTo: String?


    public init(createdAt: String? = nil, currencyCode: String? = nil, externalId: String? = nil, idempotencyKey: String? = nil, name: String? = nil, organizationId: String? = nil, packageNo: String? = nil, priceAmount: String? = nil, requestNo: String? = nil, skuId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, validFrom: String? = nil, validTo: String? = nil) {
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.externalId = externalId
        self.idempotencyKey = idempotencyKey
        self.name = name
        self.organizationId = organizationId
        self.packageNo = packageNo
        self.priceAmount = priceAmount
        self.requestNo = requestNo
        self.skuId = skuId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.validFrom = validFrom
        self.validTo = validTo
    }
}

public struct CommerceRefundAttemptRecord: Codable {
    public let amount: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let failedAt: String?
    public let failureCode: String?
    public let failureMessage: String?
    public let organizationId: String?
    public let outRefundNo: String?
    public let providerAccountId: String?
    public let providerCode: String?
    public let providerRefundId: String?
    public let refundAttemptNo: String?
    public let refundId: String?
    public let status: String?
    public let submittedAt: String?
    public let succeededAt: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(amount: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, failedAt: String? = nil, failureCode: String? = nil, failureMessage: String? = nil, organizationId: String? = nil, outRefundNo: String? = nil, providerAccountId: String? = nil, providerCode: String? = nil, providerRefundId: String? = nil, refundAttemptNo: String? = nil, refundId: String? = nil, status: String? = nil, submittedAt: String? = nil, succeededAt: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.amount = amount
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.failedAt = failedAt
        self.failureCode = failureCode
        self.failureMessage = failureMessage
        self.organizationId = organizationId
        self.outRefundNo = outRefundNo
        self.providerAccountId = providerAccountId
        self.providerCode = providerCode
        self.providerRefundId = providerRefundId
        self.refundAttemptNo = refundAttemptNo
        self.refundId = refundId
        self.status = status
        self.submittedAt = submittedAt
        self.succeededAt = succeededAt
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceRefundEventRecord: Codable {
    public let actorId: String?
    public let actorType: String?
    public let createdAt: String?
    public let eventNo: String?
    public let eventType: String?
    public let fromStatus: String?
    public let idempotencyKey: String?
    public let message: String?
    public let organizationId: String?
    public let payloadJson: [String: String]?
    public let reasonCode: String?
    public let refundId: String?
    public let requestId: String?
    public let tenantId: String?
    public let toStatus: String?


    public init(actorId: String? = nil, actorType: String? = nil, createdAt: String? = nil, eventNo: String? = nil, eventType: String? = nil, fromStatus: String? = nil, idempotencyKey: String? = nil, message: String? = nil, organizationId: String? = nil, payloadJson: [String: String]? = nil, reasonCode: String? = nil, refundId: String? = nil, requestId: String? = nil, tenantId: String? = nil, toStatus: String? = nil) {
        self.actorId = actorId
        self.actorType = actorType
        self.createdAt = createdAt
        self.eventNo = eventNo
        self.eventType = eventType
        self.fromStatus = fromStatus
        self.idempotencyKey = idempotencyKey
        self.message = message
        self.organizationId = organizationId
        self.payloadJson = payloadJson
        self.reasonCode = reasonCode
        self.refundId = refundId
        self.requestId = requestId
        self.tenantId = tenantId
        self.toStatus = toStatus
    }
}

public struct CommerceRefundItemRecord: Codable {
    public let createdAt: String?
    public let orderItemId: String?
    public let organizationId: String?
    public let refundAmount: String?
    public let refundId: String?
    public let tenantId: String?


    public init(createdAt: String? = nil, orderItemId: String? = nil, organizationId: String? = nil, refundAmount: String? = nil, refundId: String? = nil, tenantId: String? = nil) {
        self.createdAt = createdAt
        self.orderItemId = orderItemId
        self.organizationId = organizationId
        self.refundAmount = refundAmount
        self.refundId = refundId
        self.tenantId = tenantId
    }
}

public struct CommerceRefundRecord: Codable {
    public let amount: String?
    public let createdAt: String?
    public let idempotencyKey: String?
    public let paymentAttemptId: String?
    public let refundNo: String?
    public let requestNo: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(amount: String? = nil, createdAt: String? = nil, idempotencyKey: String? = nil, paymentAttemptId: String? = nil, refundNo: String? = nil, requestNo: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.amount = amount
        self.createdAt = createdAt
        self.idempotencyKey = idempotencyKey
        self.paymentAttemptId = paymentAttemptId
        self.refundNo = refundNo
        self.requestNo = requestNo
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceServiceProviderExposureSnapshotRecord: Codable {
    public let balanceAmount: String?
    public let calculatedAt: String?
    public let createdAt: String?
    public let creditLimitAmount: String?
    public let currency: String?
    public let exposureAmount: String?
    public let frozenAmount: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let overdueAmount: String?
    public let pendingSettlementAmount: String?
    public let rebuildVersion: String?
    public let riskStatus: String?
    public let serviceProviderId: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let usedCreditAmount: String?
    public let uuid: String?


    public init(balanceAmount: String? = nil, calculatedAt: String? = nil, createdAt: String? = nil, creditLimitAmount: String? = nil, currency: String? = nil, exposureAmount: String? = nil, frozenAmount: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, overdueAmount: String? = nil, pendingSettlementAmount: String? = nil, rebuildVersion: String? = nil, riskStatus: String? = nil, serviceProviderId: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, usedCreditAmount: String? = nil, uuid: String? = nil) {
        self.balanceAmount = balanceAmount
        self.calculatedAt = calculatedAt
        self.createdAt = createdAt
        self.creditLimitAmount = creditLimitAmount
        self.currency = currency
        self.exposureAmount = exposureAmount
        self.frozenAmount = frozenAmount
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.overdueAmount = overdueAmount
        self.pendingSettlementAmount = pendingSettlementAmount
        self.rebuildVersion = rebuildVersion
        self.riskStatus = riskStatus
        self.serviceProviderId = serviceProviderId
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.usedCreditAmount = usedCreditAmount
        self.uuid = uuid
    }
}

public struct CommerceSettlementExportRecord: Codable {
    public let approvedBy: String?
    public let auditLogId: String?
    public let createdAt: String?
    public let createdBy: String?
    public let downloadCount: String?
    public let expireAt: String?
    public let exportNo: String?
    public let exportType: String?
    public let fileHash: String?
    public let fileManifest: [String: String]?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let periodEnd: String?
    public let periodStart: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let statementId: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(approvedBy: String? = nil, auditLogId: String? = nil, createdAt: String? = nil, createdBy: String? = nil, downloadCount: String? = nil, expireAt: String? = nil, exportNo: String? = nil, exportType: String? = nil, fileHash: String? = nil, fileManifest: [String: String]? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, periodEnd: String? = nil, periodStart: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, statementId: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.approvedBy = approvedBy
        self.auditLogId = auditLogId
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.downloadCount = downloadCount
        self.expireAt = expireAt
        self.exportNo = exportNo
        self.exportType = exportType
        self.fileHash = fileHash
        self.fileManifest = fileManifest
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.periodEnd = periodEnd
        self.periodStart = periodStart
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.statementId = statementId
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct CommerceShipmentRecord: Codable {
    public let carrierCode: String?
    public let createdAt: String?
    public let deliveredAt: String?
    public let fulfillmentId: String?
    public let organizationId: String?
    public let shipmentNo: String?
    public let shippedAt: String?
    public let status: String?
    public let tenantId: String?
    public let trackingNo: String?
    public let updatedAt: String?


    public init(carrierCode: String? = nil, createdAt: String? = nil, deliveredAt: String? = nil, fulfillmentId: String? = nil, organizationId: String? = nil, shipmentNo: String? = nil, shippedAt: String? = nil, status: String? = nil, tenantId: String? = nil, trackingNo: String? = nil, updatedAt: String? = nil) {
        self.carrierCode = carrierCode
        self.createdAt = createdAt
        self.deliveredAt = deliveredAt
        self.fulfillmentId = fulfillmentId
        self.organizationId = organizationId
        self.shipmentNo = shipmentNo
        self.shippedAt = shippedAt
        self.status = status
        self.tenantId = tenantId
        self.trackingNo = trackingNo
        self.updatedAt = updatedAt
    }
}

public struct CommerceShipmentTrackingEventRecord: Codable {
    public let createdAt: String?
    public let description: String?
    public let eventCode: String?
    public let eventTime: String?
    public let location: String?
    public let organizationId: String?
    public let rawPayloadJson: [String: String]?
    public let shipmentId: String?
    public let tenantId: String?


    public init(createdAt: String? = nil, description: String? = nil, eventCode: String? = nil, eventTime: String? = nil, location: String? = nil, organizationId: String? = nil, rawPayloadJson: [String: String]? = nil, shipmentId: String? = nil, tenantId: String? = nil) {
        self.createdAt = createdAt
        self.description = description
        self.eventCode = eventCode
        self.eventTime = eventTime
        self.location = location
        self.organizationId = organizationId
        self.rawPayloadJson = rawPayloadJson
        self.shipmentId = shipmentId
        self.tenantId = tenantId
    }
}

public struct CommerceStandardCollectionResponse: Codable {
    public let items: [[String: Any]]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [[String: Any]]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct CommerceStandardCommandRequest: Codable {
    public let clientRequestNo: String?
    public let metadata: [String: String]?
    public let note: String?


    public init(clientRequestNo: String? = nil, metadata: [String: String]? = nil, note: String? = nil) {
        self.clientRequestNo = clientRequestNo
        self.metadata = metadata
        self.note = note
    }
}

public struct CommerceStandardResourceResponse: Codable {
    public let item: [String: Any]?


    public init(item: [String: Any]? = nil) {
        self.item = item
    }
}

public struct CommerceUsagePricingPlanRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let includedQuota: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let overagePricingId: String?
    public let planCode: String?
    public let planName: String?
    public let pricingMode: String?
    public let productId: String?
    public let rateMultiplier: String?
    public let skuId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let vipLevelId: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, includedQuota: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, overagePricingId: String? = nil, planCode: String? = nil, planName: String? = nil, pricingMode: String? = nil, productId: String? = nil, rateMultiplier: String? = nil, skuId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, vipLevelId: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.includedQuota = includedQuota
        self.metadata = metadata
        self.organizationId = organizationId
        self.overagePricingId = overagePricingId
        self.planCode = planCode
        self.planName = planName
        self.pricingMode = pricingMode
        self.productId = productId
        self.rateMultiplier = rateMultiplier
        self.skuId = skuId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.vipLevelId = vipLevelId
    }
}

public struct CommerceUsageServiceProviderAdjustmentRecord: Codable {
    public let adjustmentNo: String?
    public let adjustmentType: String?
    public let amount: String?
    public let approvalStatus: String?
    public let approvedBy: String?
    public let buyerProviderId: String?
    public let createdAt: String?
    public let currency: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let reasonCode: String?
    public let reasonMessage: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let sellerProviderId: String?
    public let settledLedgerEntryId: String?
    public let statementId: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let usageEdgeId: String?
    public let userId: String?
    public let uuid: String?


    public init(adjustmentNo: String? = nil, adjustmentType: String? = nil, amount: String? = nil, approvalStatus: String? = nil, approvedBy: String? = nil, buyerProviderId: String? = nil, createdAt: String? = nil, currency: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, reasonCode: String? = nil, reasonMessage: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, sellerProviderId: String? = nil, settledLedgerEntryId: String? = nil, statementId: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, usageEdgeId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.adjustmentNo = adjustmentNo
        self.adjustmentType = adjustmentType
        self.amount = amount
        self.approvalStatus = approvalStatus
        self.approvedBy = approvedBy
        self.buyerProviderId = buyerProviderId
        self.createdAt = createdAt
        self.currency = currency
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.reasonCode = reasonCode
        self.reasonMessage = reasonMessage
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.sellerProviderId = sellerProviderId
        self.settledLedgerEntryId = settledLedgerEntryId
        self.statementId = statementId
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.usageEdgeId = usageEdgeId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct CommerceUsageServiceProviderReconciliationItemRecord: Codable {
    public let createdAt: String?
    public let differenceAmount: String?
    public let externalAmount: String?
    public let id: String?
    public let internalAmount: String?
    public let legalHold: Bool?
    public let matchStatus: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let providerInvoiceItemId: String?
    public let reasonCode: String?
    public let requestId: String?
    public let resolutionStatus: String?
    public let retentionUntil: String?
    public let runId: String?
    public let statementItemId: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let usageEdgeId: String?
    public let usageFactId: String?
    public let userId: String?
    public let uuid: String?


    public init(createdAt: String? = nil, differenceAmount: String? = nil, externalAmount: String? = nil, id: String? = nil, internalAmount: String? = nil, legalHold: Bool? = nil, matchStatus: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, providerInvoiceItemId: String? = nil, reasonCode: String? = nil, requestId: String? = nil, resolutionStatus: String? = nil, retentionUntil: String? = nil, runId: String? = nil, statementItemId: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, usageEdgeId: String? = nil, usageFactId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.createdAt = createdAt
        self.differenceAmount = differenceAmount
        self.externalAmount = externalAmount
        self.id = id
        self.internalAmount = internalAmount
        self.legalHold = legalHold
        self.matchStatus = matchStatus
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.providerInvoiceItemId = providerInvoiceItemId
        self.reasonCode = reasonCode
        self.requestId = requestId
        self.resolutionStatus = resolutionStatus
        self.retentionUntil = retentionUntil
        self.runId = runId
        self.statementItemId = statementItemId
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.usageEdgeId = usageEdgeId
        self.usageFactId = usageFactId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct CommerceUsageServiceProviderReconciliationRunRecord: Codable {
    public let createdAt: String?
    public let differenceAmount: String?
    public let id: String?
    public let legalHold: Bool?
    public let matchedCount: String?
    public let metadata: [String: String]?
    public let mismatchCount: String?
    public let missingExternalCount: String?
    public let missingInternalCount: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let periodEnd: String?
    public let periodStart: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let runNo: String?
    public let scopeId: String?
    public let scopeType: String?
    public let status: String?
    public let tenantId: String?
    public let totalExternalAmount: String?
    public let totalInternalAmount: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(createdAt: String? = nil, differenceAmount: String? = nil, id: String? = nil, legalHold: Bool? = nil, matchedCount: String? = nil, metadata: [String: String]? = nil, mismatchCount: String? = nil, missingExternalCount: String? = nil, missingInternalCount: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, periodEnd: String? = nil, periodStart: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runNo: String? = nil, scopeId: String? = nil, scopeType: String? = nil, status: String? = nil, tenantId: String? = nil, totalExternalAmount: String? = nil, totalInternalAmount: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.createdAt = createdAt
        self.differenceAmount = differenceAmount
        self.id = id
        self.legalHold = legalHold
        self.matchedCount = matchedCount
        self.metadata = metadata
        self.mismatchCount = mismatchCount
        self.missingExternalCount = missingExternalCount
        self.missingInternalCount = missingInternalCount
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.periodEnd = periodEnd
        self.periodStart = periodStart
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.runNo = runNo
        self.scopeId = scopeId
        self.scopeType = scopeType
        self.status = status
        self.tenantId = tenantId
        self.totalExternalAmount = totalExternalAmount
        self.totalInternalAmount = totalInternalAmount
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct CommerceUsageServiceProviderSettlementRecord: Codable {
    public let amount: String?
    public let buyerAccountId: String?
    public let buyerLedgerEntryId: String?
    public let buyerProviderId: String?
    public let createdAt: String?
    public let currency: String?
    public let direction: String?
    public let failureCode: String?
    public let failureMessage: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let sellerAccountId: String?
    public let sellerLedgerEntryId: String?
    public let sellerProviderId: String?
    public let settledAt: String?
    public let settlementMode: String?
    public let settlementNo: String?
    public let settlementStatus: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let usageEdgeId: String?
    public let userId: String?
    public let uuid: String?


    public init(amount: String? = nil, buyerAccountId: String? = nil, buyerLedgerEntryId: String? = nil, buyerProviderId: String? = nil, createdAt: String? = nil, currency: String? = nil, direction: String? = nil, failureCode: String? = nil, failureMessage: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, sellerAccountId: String? = nil, sellerLedgerEntryId: String? = nil, sellerProviderId: String? = nil, settledAt: String? = nil, settlementMode: String? = nil, settlementNo: String? = nil, settlementStatus: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, usageEdgeId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.amount = amount
        self.buyerAccountId = buyerAccountId
        self.buyerLedgerEntryId = buyerLedgerEntryId
        self.buyerProviderId = buyerProviderId
        self.createdAt = createdAt
        self.currency = currency
        self.direction = direction
        self.failureCode = failureCode
        self.failureMessage = failureMessage
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.sellerAccountId = sellerAccountId
        self.sellerLedgerEntryId = sellerLedgerEntryId
        self.sellerProviderId = sellerProviderId
        self.settledAt = settledAt
        self.settlementMode = settlementMode
        self.settlementNo = settlementNo
        self.settlementStatus = settlementStatus
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.usageEdgeId = usageEdgeId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct CommerceUsageServiceProviderStatementItemRecord: Codable {
    public let amount: String?
    public let billingMeterCode: String?
    public let createdAt: String?
    public let currency: String?
    public let id: String?
    public let metadata: [String: String]?
    public let model: String?
    public let organizationId: String?
    public let quantity: String?
    public let rebuildVersion: String?
    public let requestCount: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceUsageFactIds: [String: String]?
    public let sourceVersion: String?
    public let statementId: String?
    public let status: String?
    public let tenantId: String?
    public let tokenCount: String?
    public let tokenKind: String?
    public let updatedAt: String?
    public let usageEdgeId: String?
    public let uuid: String?


    public init(amount: String? = nil, billingMeterCode: String? = nil, createdAt: String? = nil, currency: String? = nil, id: String? = nil, metadata: [String: String]? = nil, model: String? = nil, organizationId: String? = nil, quantity: String? = nil, rebuildVersion: String? = nil, requestCount: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceUsageFactIds: [String: String]? = nil, sourceVersion: String? = nil, statementId: String? = nil, status: String? = nil, tenantId: String? = nil, tokenCount: String? = nil, tokenKind: String? = nil, updatedAt: String? = nil, usageEdgeId: String? = nil, uuid: String? = nil) {
        self.amount = amount
        self.billingMeterCode = billingMeterCode
        self.createdAt = createdAt
        self.currency = currency
        self.id = id
        self.metadata = metadata
        self.model = model
        self.organizationId = organizationId
        self.quantity = quantity
        self.rebuildVersion = rebuildVersion
        self.requestCount = requestCount
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceUsageFactIds = sourceUsageFactIds
        self.sourceVersion = sourceVersion
        self.statementId = statementId
        self.status = status
        self.tenantId = tenantId
        self.tokenCount = tokenCount
        self.tokenKind = tokenKind
        self.updatedAt = updatedAt
        self.usageEdgeId = usageEdgeId
        self.uuid = uuid
    }
}

public struct CommerceUsageServiceProviderStatementRecord: Codable {
    public let buyerProviderId: String?
    public let createdAt: String?
    public let currency: String?
    public let dueAt: String?
    public let generatedAt: String?
    public let id: String?
    public let invoiceId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let paidAt: String?
    public let payableAmount: String?
    public let paymentStatus: String?
    public let period: String?
    public let periodEnd: String?
    public let periodStart: String?
    public let rebuildVersion: String?
    public let receivableAmount: String?
    public let sellerProviderId: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let statementNo: String?
    public let statementStatus: String?
    public let status: String?
    public let tenantId: String?
    public let totalRequests: String?
    public let totalTokens: String?
    public let updatedAt: String?
    public let uuid: String?


    public init(buyerProviderId: String? = nil, createdAt: String? = nil, currency: String? = nil, dueAt: String? = nil, generatedAt: String? = nil, id: String? = nil, invoiceId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, paidAt: String? = nil, payableAmount: String? = nil, paymentStatus: String? = nil, period: String? = nil, periodEnd: String? = nil, periodStart: String? = nil, rebuildVersion: String? = nil, receivableAmount: String? = nil, sellerProviderId: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, statementNo: String? = nil, statementStatus: String? = nil, status: String? = nil, tenantId: String? = nil, totalRequests: String? = nil, totalTokens: String? = nil, updatedAt: String? = nil, uuid: String? = nil) {
        self.buyerProviderId = buyerProviderId
        self.createdAt = createdAt
        self.currency = currency
        self.dueAt = dueAt
        self.generatedAt = generatedAt
        self.id = id
        self.invoiceId = invoiceId
        self.metadata = metadata
        self.organizationId = organizationId
        self.paidAt = paidAt
        self.payableAmount = payableAmount
        self.paymentStatus = paymentStatus
        self.period = period
        self.periodEnd = periodEnd
        self.periodStart = periodStart
        self.rebuildVersion = rebuildVersion
        self.receivableAmount = receivableAmount
        self.sellerProviderId = sellerProviderId
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.statementNo = statementNo
        self.statementStatus = statementStatus
        self.status = status
        self.tenantId = tenantId
        self.totalRequests = totalRequests
        self.totalTokens = totalTokens
        self.updatedAt = updatedAt
        self.uuid = uuid
    }
}

public struct CommerceUsageSettlementRecord: Codable {
    public let accountId: String?
    public let accountLedgerEntryId: String?
    public let amount: String?
    public let assetType: String?
    public let createdAt: String?
    public let currency: String?
    public let direction: String?
    public let failureCode: String?
    public let failureMessage: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let orderId: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let paymentId: String?
    public let points: String?
    public let priceSnapshot: [String: String]?
    public let requestId: String?
    public let retentionUntil: String?
    public let settledAt: String?
    public let settlementNo: String?
    public let settlementStatus: String?
    public let status: String?
    public let tenantId: String?
    public let tokens: String?
    public let traceId: String?
    public let usageFactId: String?
    public let userId: String?
    public let uuid: String?


    public init(accountId: String? = nil, accountLedgerEntryId: String? = nil, amount: String? = nil, assetType: String? = nil, createdAt: String? = nil, currency: String? = nil, direction: String? = nil, failureCode: String? = nil, failureMessage: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, orderId: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, paymentId: String? = nil, points: String? = nil, priceSnapshot: [String: String]? = nil, requestId: String? = nil, retentionUntil: String? = nil, settledAt: String? = nil, settlementNo: String? = nil, settlementStatus: String? = nil, status: String? = nil, tenantId: String? = nil, tokens: String? = nil, traceId: String? = nil, usageFactId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.accountId = accountId
        self.accountLedgerEntryId = accountLedgerEntryId
        self.amount = amount
        self.assetType = assetType
        self.createdAt = createdAt
        self.currency = currency
        self.direction = direction
        self.failureCode = failureCode
        self.failureMessage = failureMessage
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.orderId = orderId
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.paymentId = paymentId
        self.points = points
        self.priceSnapshot = priceSnapshot
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.settledAt = settledAt
        self.settlementNo = settlementNo
        self.settlementStatus = settlementStatus
        self.status = status
        self.tenantId = tenantId
        self.tokens = tokens
        self.traceId = traceId
        self.usageFactId = usageFactId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct CommerceUsageStatementItemRecord: Codable {
    public let assetCount: String?
    public let breakdownPayload: [String: String]?
    public let costAmount: String?
    public let createdAt: String?
    public let currency: String?
    public let durationSeconds: String?
    public let id: String?
    public let itemType: String?
    public let metadata: [String: String]?
    public let modality: String?
    public let model: String?
    public let modelList: [String: String]?
    public let organizationId: String?
    public let providerCode: String?
    public let rebuildVersion: String?
    public let requestCount: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceUsageFactIds: [String: String]?
    public let sourceVersion: String?
    public let statementId: String?
    public let status: String?
    public let tenantId: String?
    public let tokenCount: String?
    public let updatedAt: String?
    public let usageText: String?
    public let uuid: String?


    public init(assetCount: String? = nil, breakdownPayload: [String: String]? = nil, costAmount: String? = nil, createdAt: String? = nil, currency: String? = nil, durationSeconds: String? = nil, id: String? = nil, itemType: String? = nil, metadata: [String: String]? = nil, modality: String? = nil, model: String? = nil, modelList: [String: String]? = nil, organizationId: String? = nil, providerCode: String? = nil, rebuildVersion: String? = nil, requestCount: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceUsageFactIds: [String: String]? = nil, sourceVersion: String? = nil, statementId: String? = nil, status: String? = nil, tenantId: String? = nil, tokenCount: String? = nil, updatedAt: String? = nil, usageText: String? = nil, uuid: String? = nil) {
        self.assetCount = assetCount
        self.breakdownPayload = breakdownPayload
        self.costAmount = costAmount
        self.createdAt = createdAt
        self.currency = currency
        self.durationSeconds = durationSeconds
        self.id = id
        self.itemType = itemType
        self.metadata = metadata
        self.modality = modality
        self.model = model
        self.modelList = modelList
        self.organizationId = organizationId
        self.providerCode = providerCode
        self.rebuildVersion = rebuildVersion
        self.requestCount = requestCount
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceUsageFactIds = sourceUsageFactIds
        self.sourceVersion = sourceVersion
        self.statementId = statementId
        self.status = status
        self.tenantId = tenantId
        self.tokenCount = tokenCount
        self.updatedAt = updatedAt
        self.usageText = usageText
        self.uuid = uuid
    }
}

public struct CommerceUsageStatementRecord: Codable {
    public let createdAt: String?
    public let currency: String?
    public let dueAt: String?
    public let exportId: String?
    public let generatedAt: String?
    public let id: String?
    public let invoiceId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let paidAt: String?
    public let paymentStatus: String?
    public let period: String?
    public let periodEnd: String?
    public let periodStart: String?
    public let rebuildVersion: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let statementNo: String?
    public let statementStatus: String?
    public let status: String?
    public let tenantId: String?
    public let totalCost: String?
    public let totalRequests: String?
    public let totalTokens: String?
    public let updatedAt: String?
    public let uuid: String?


    public init(createdAt: String? = nil, currency: String? = nil, dueAt: String? = nil, exportId: String? = nil, generatedAt: String? = nil, id: String? = nil, invoiceId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, paidAt: String? = nil, paymentStatus: String? = nil, period: String? = nil, periodEnd: String? = nil, periodStart: String? = nil, rebuildVersion: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, statementNo: String? = nil, statementStatus: String? = nil, status: String? = nil, tenantId: String? = nil, totalCost: String? = nil, totalRequests: String? = nil, totalTokens: String? = nil, updatedAt: String? = nil, uuid: String? = nil) {
        self.createdAt = createdAt
        self.currency = currency
        self.dueAt = dueAt
        self.exportId = exportId
        self.generatedAt = generatedAt
        self.id = id
        self.invoiceId = invoiceId
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.paidAt = paidAt
        self.paymentStatus = paymentStatus
        self.period = period
        self.periodEnd = periodEnd
        self.periodStart = periodStart
        self.rebuildVersion = rebuildVersion
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.statementNo = statementNo
        self.statementStatus = statementStatus
        self.status = status
        self.tenantId = tenantId
        self.totalCost = totalCost
        self.totalRequests = totalRequests
        self.totalTokens = totalTokens
        self.updatedAt = updatedAt
        self.uuid = uuid
    }
}

public struct CommerceUserAddressRecord: Codable {
    public let addressLine1Encrypted: String?
    public let addressLine2Encrypted: String?
    public let city: String?
    public let countryCode: String?
    public let createdAt: String?
    public let district: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let phoneCountryCode: String?
    public let phoneMasked: String?
    public let phoneNumberEncrypted: String?
    public let postalCode: String?
    public let recipientName: String?
    public let regionCode: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(addressLine1Encrypted: String? = nil, addressLine2Encrypted: String? = nil, city: String? = nil, countryCode: String? = nil, createdAt: String? = nil, district: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, phoneCountryCode: String? = nil, phoneMasked: String? = nil, phoneNumberEncrypted: String? = nil, postalCode: String? = nil, recipientName: String? = nil, regionCode: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.addressLine1Encrypted = addressLine1Encrypted
        self.addressLine2Encrypted = addressLine2Encrypted
        self.city = city
        self.countryCode = countryCode
        self.createdAt = createdAt
        self.district = district
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.phoneCountryCode = phoneCountryCode
        self.phoneMasked = phoneMasked
        self.phoneNumberEncrypted = phoneNumberEncrypted
        self.postalCode = postalCode
        self.recipientName = recipientName
        self.regionCode = regionCode
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct ContentAnnouncementRecord: Codable {
    public let announcementType: String?
    public let audienceFilter: [String: String]?
    public let content: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let pinned: Bool?
    public let publishedAt: String?
    public let status: String?
    public let targetScope: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(announcementType: String? = nil, audienceFilter: [String: String]? = nil, content: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, pinned: Bool? = nil, publishedAt: String? = nil, status: String? = nil, targetScope: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.announcementType = announcementType
        self.audienceFilter = audienceFilter
        self.content = content
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.pinned = pinned
        self.publishedAt = publishedAt
        self.status = status
        self.targetScope = targetScope
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct ContentCourseApplicationRecord: Codable {
    public let category: String?
    public let contactEmail: String?
    public let contactName: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let externalBvid: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let reviewComment: String?
    public let reviewedAt: String?
    public let reviewedBy: String?
    public let sourceProvider: String?
    public let status: String?
    public let submittedAt: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?
    public let videoUrl: String?


    public init(category: String? = nil, contactEmail: String? = nil, contactName: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, externalBvid: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, reviewComment: String? = nil, reviewedAt: String? = nil, reviewedBy: String? = nil, sourceProvider: String? = nil, status: String? = nil, submittedAt: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil, videoUrl: String? = nil) {
        self.category = category
        self.contactEmail = contactEmail
        self.contactName = contactName
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.externalBvid = externalBvid
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.reviewComment = reviewComment
        self.reviewedAt = reviewedAt
        self.reviewedBy = reviewedBy
        self.sourceProvider = sourceProvider
        self.status = status
        self.submittedAt = submittedAt
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
        self.videoUrl = videoUrl
    }
}

public struct ContentCourseLessonRecord: Codable {
    public let content: String?
    public let courseId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let durationSeconds: String?
    public let durationText: String?
    public let externalBvid: String?
    public let freePreview: Bool?
    public let id: String?
    public let lessonNo: Int?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let sectionId: String?
    public let sortOrder: Int?
    public let sourceProvider: String?
    public let status: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let videoUrl: String?


    public init(content: String? = nil, courseId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, durationSeconds: String? = nil, durationText: String? = nil, externalBvid: String? = nil, freePreview: Bool? = nil, id: String? = nil, lessonNo: Int? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, sectionId: String? = nil, sortOrder: Int? = nil, sourceProvider: String? = nil, status: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, videoUrl: String? = nil) {
        self.content = content
        self.courseId = courseId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.durationSeconds = durationSeconds
        self.durationText = durationText
        self.externalBvid = externalBvid
        self.freePreview = freePreview
        self.id = id
        self.lessonNo = lessonNo
        self.metadata = metadata
        self.organizationId = organizationId
        self.sectionId = sectionId
        self.sortOrder = sortOrder
        self.sourceProvider = sourceProvider
        self.status = status
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.videoUrl = videoUrl
    }
}

public struct ContentCourseRecord: Codable {
    public let category: String?
    public let content: String?
    public let courseCode: String?
    public let createdAt: String?
    public let currency: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let durationText: String?
    public let externalBvid: String?
    public let id: String?
    public let instructorSnapshot: [String: String]?
    public let isCollection: Bool?
    public let lessonsCount: Int?
    public let level: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let priceAmount: String?
    public let publishedAt: String?
    public let ratingScore: String?
    public let status: String?
    public let studentsCount: String?
    public let tags: [String: String]?
    public let tenantId: String?
    public let thumbnailUrl: String?
    public let title: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(category: String? = nil, content: String? = nil, courseCode: String? = nil, createdAt: String? = nil, currency: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, durationText: String? = nil, externalBvid: String? = nil, id: String? = nil, instructorSnapshot: [String: String]? = nil, isCollection: Bool? = nil, lessonsCount: Int? = nil, level: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, priceAmount: String? = nil, publishedAt: String? = nil, ratingScore: String? = nil, status: String? = nil, studentsCount: String? = nil, tags: [String: String]? = nil, tenantId: String? = nil, thumbnailUrl: String? = nil, title: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.category = category
        self.content = content
        self.courseCode = courseCode
        self.createdAt = createdAt
        self.currency = currency
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.durationText = durationText
        self.externalBvid = externalBvid
        self.id = id
        self.instructorSnapshot = instructorSnapshot
        self.isCollection = isCollection
        self.lessonsCount = lessonsCount
        self.level = level
        self.metadata = metadata
        self.organizationId = organizationId
        self.priceAmount = priceAmount
        self.publishedAt = publishedAt
        self.ratingScore = ratingScore
        self.status = status
        self.studentsCount = studentsCount
        self.tags = tags
        self.tenantId = tenantId
        self.thumbnailUrl = thumbnailUrl
        self.title = title
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct ContentCourseRelationRecord: Codable {
    public let courseId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let relatedCourseId: String?
    public let relationType: String?
    public let sortOrder: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(courseId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, relatedCourseId: String? = nil, relationType: String? = nil, sortOrder: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.courseId = courseId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.relatedCourseId = relatedCourseId
        self.relationType = relationType
        self.sortOrder = sortOrder
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct ContentCourseSectionRecord: Codable {
    public let courseId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let durationSeconds: String?
    public let id: String?
    public let lessonCount: Int?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let sectionNo: Int?
    public let sortOrder: Int?
    public let status: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(courseId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, durationSeconds: String? = nil, id: String? = nil, lessonCount: Int? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, sectionNo: Int? = nil, sortOrder: Int? = nil, status: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.courseId = courseId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.durationSeconds = durationSeconds
        self.id = id
        self.lessonCount = lessonCount
        self.metadata = metadata
        self.organizationId = organizationId
        self.sectionNo = sectionNo
        self.sortOrder = sortOrder
        self.status = status
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct ContentDocPageRecord: Codable {
    public let contentHash: String?
    public let contentSource: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let docCode: String?
    public let docType: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let path: String?
    public let publishedAt: String?
    public let slug: String?
    public let sortOrder: Int?
    public let sourceRef: String?
    public let status: String?
    public let summary: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(contentHash: String? = nil, contentSource: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, docCode: String? = nil, docType: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, path: String? = nil, publishedAt: String? = nil, slug: String? = nil, sortOrder: Int? = nil, sourceRef: String? = nil, status: String? = nil, summary: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.contentHash = contentHash
        self.contentSource = contentSource
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.docCode = docCode
        self.docType = docType
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.path = path
        self.publishedAt = publishedAt
        self.slug = slug
        self.sortOrder = sortOrder
        self.sourceRef = sourceRef
        self.status = status
        self.summary = summary
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct ContentForumCommentRecord: Codable {
    public let authorId: String?
    public let authorSnapshot: [String: String]?
    public let body: String?
    public let courseId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let likeCount: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let parentId: String?
    public let postId: String?
    public let rootId: String?
    public let status: String?
    public let targetId: String?
    public let targetType: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(authorId: String? = nil, authorSnapshot: [String: String]? = nil, body: String? = nil, courseId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, likeCount: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, parentId: String? = nil, postId: String? = nil, rootId: String? = nil, status: String? = nil, targetId: String? = nil, targetType: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.authorId = authorId
        self.authorSnapshot = authorSnapshot
        self.body = body
        self.courseId = courseId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.likeCount = likeCount
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.parentId = parentId
        self.postId = postId
        self.rootId = rootId
        self.status = status
        self.targetId = targetId
        self.targetType = targetType
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct ContentForumPostRecord: Codable {
    public let authorId: String?
    public let authorSnapshot: [String: String]?
    public let body: String?
    public let category: String?
    public let commentCount: String?
    public let contentSnippet: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let lastRepliedAt: String?
    public let likeCount: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let pinned: Bool?
    public let status: String?
    public let tags: [String: String]?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?
    public let viewCount: String?


    public init(authorId: String? = nil, authorSnapshot: [String: String]? = nil, body: String? = nil, category: String? = nil, commentCount: String? = nil, contentSnippet: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, lastRepliedAt: String? = nil, likeCount: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, pinned: Bool? = nil, status: String? = nil, tags: [String: String]? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil, viewCount: String? = nil) {
        self.authorId = authorId
        self.authorSnapshot = authorSnapshot
        self.body = body
        self.category = category
        self.commentCount = commentCount
        self.contentSnippet = contentSnippet
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.lastRepliedAt = lastRepliedAt
        self.likeCount = likeCount
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.pinned = pinned
        self.status = status
        self.tags = tags
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
        self.viewCount = viewCount
    }
}

public struct ContentOpenapiSnapshotRecord: Codable {
    public let apiSurface: String?
    public let apiSystem: String?
    public let categoryTree: [String: String]?
    public let createdAt: String?
    public let endpointCount: Int?
    public let exampleManifest: [String: String]?
    public let id: String?
    public let metadata: [String: String]?
    public let openapiHash: String?
    public let organizationId: String?
    public let publishedAt: String?
    public let rebuildVersion: String?
    public let sourceId: String?
    public let sourceRef: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let status: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(apiSurface: String? = nil, apiSystem: String? = nil, categoryTree: [String: String]? = nil, createdAt: String? = nil, endpointCount: Int? = nil, exampleManifest: [String: String]? = nil, id: String? = nil, metadata: [String: String]? = nil, openapiHash: String? = nil, organizationId: String? = nil, publishedAt: String? = nil, rebuildVersion: String? = nil, sourceId: String? = nil, sourceRef: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, status: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.apiSurface = apiSurface
        self.apiSystem = apiSystem
        self.categoryTree = categoryTree
        self.createdAt = createdAt
        self.endpointCount = endpointCount
        self.exampleManifest = exampleManifest
        self.id = id
        self.metadata = metadata
        self.openapiHash = openapiHash
        self.organizationId = organizationId
        self.publishedAt = publishedAt
        self.rebuildVersion = rebuildVersion
        self.sourceId = sourceId
        self.sourceRef = sourceRef
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.status = status
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct ContentReactionRecord: Codable {
    public let cancelledAt: String?
    public let clientIpHash: String?
    public let createdAt: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let reactionType: String?
    public let reactionValue: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let status: String?
    public let targetId: String?
    public let targetType: String?
    public let tenantId: String?
    public let traceId: String?
    public let userAgentHash: String?
    public let userId: String?
    public let uuid: String?


    public init(cancelledAt: String? = nil, clientIpHash: String? = nil, createdAt: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, reactionType: String? = nil, reactionValue: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, status: String? = nil, targetId: String? = nil, targetType: String? = nil, tenantId: String? = nil, traceId: String? = nil, userAgentHash: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.cancelledAt = cancelledAt
        self.clientIpHash = clientIpHash
        self.createdAt = createdAt
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.reactionType = reactionType
        self.reactionValue = reactionValue
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.status = status
        self.targetId = targetId
        self.targetType = targetType
        self.tenantId = tenantId
        self.traceId = traceId
        self.userAgentHash = userAgentHash
        self.userId = userId
        self.uuid = uuid
    }
}

public struct ContentSdkReleaseRecord: Codable {
    public let apiSystem: String?
    public let artifactManifest: [String: String]?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultBaseUrl: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let docsUrl: String?
    public let exampleCode: String?
    public let exampleManifest: [String: String]?
    public let githubUrl: String?
    public let id: String?
    public let importCode: String?
    public let initCode: String?
    public let installCommand: String?
    public let language: String?
    public let languageDescription: String?
    public let languageIcon: String?
    public let metadata: [String: String]?
    public let openapiSnapshotId: String?
    public let organizationId: String?
    public let packageManager: String?
    public let packageName: String?
    public let publishedAt: String?
    public let sourceRepo: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(apiSystem: String? = nil, artifactManifest: [String: String]? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultBaseUrl: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, docsUrl: String? = nil, exampleCode: String? = nil, exampleManifest: [String: String]? = nil, githubUrl: String? = nil, id: String? = nil, importCode: String? = nil, initCode: String? = nil, installCommand: String? = nil, language: String? = nil, languageDescription: String? = nil, languageIcon: String? = nil, metadata: [String: String]? = nil, openapiSnapshotId: String? = nil, organizationId: String? = nil, packageManager: String? = nil, packageName: String? = nil, publishedAt: String? = nil, sourceRepo: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.apiSystem = apiSystem
        self.artifactManifest = artifactManifest
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultBaseUrl = defaultBaseUrl
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.docsUrl = docsUrl
        self.exampleCode = exampleCode
        self.exampleManifest = exampleManifest
        self.githubUrl = githubUrl
        self.id = id
        self.importCode = importCode
        self.initCode = initCode
        self.installCommand = installCommand
        self.language = language
        self.languageDescription = languageDescription
        self.languageIcon = languageIcon
        self.metadata = metadata
        self.openapiSnapshotId = openapiSnapshotId
        self.organizationId = organizationId
        self.packageManager = packageManager
        self.packageName = packageName
        self.publishedAt = publishedAt
        self.sourceRepo = sourceRepo
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct ConversationMessagesListResult: Codable {
    public let code: String?
    public let data: ChatMessageListResponse?
    public let msg: String?


    public init(code: String? = nil, data: ChatMessageListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ConversationsCreateResult: Codable {
    public let code: String?
    public let data: ChatConversationResponse?
    public let msg: String?


    public init(code: String? = nil, data: ChatConversationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ConversationsListResult: Codable {
    public let code: String?
    public let data: ChatConversationListResponse?
    public let msg: String?


    public init(code: String? = nil, data: ChatConversationListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ConversationsRetrieveResult: Codable {
    public let code: String?
    public let data: ChatConversationItem?
    public let msg: String?


    public init(code: String? = nil, data: ChatConversationItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CourseApplicationCreateRequest: Codable {
    public let category: String?
    public let contactEmail: String?
    public let contactName: String?
    public let description: String?
    public let externalBvid: String?
    public let notes: String?
    public let sourceProvider: String?
    public let title: String?
    public let videoUrl: String?


    public init(category: String? = nil, contactEmail: String? = nil, contactName: String? = nil, description: String? = nil, externalBvid: String? = nil, notes: String? = nil, sourceProvider: String? = nil, title: String? = nil, videoUrl: String? = nil) {
        self.category = category
        self.contactEmail = contactEmail
        self.contactName = contactName
        self.description = description
        self.externalBvid = externalBvid
        self.notes = notes
        self.sourceProvider = sourceProvider
        self.title = title
        self.videoUrl = videoUrl
    }
}

public struct CourseApplicationCreateResponse: Codable {
    public let applicationId: Int?
    public let category: String?
    public let contactEmail: String?
    public let contactName: String?
    public let description: String?
    public let externalBvid: String?
    public let id: String?
    public let sourceProvider: String?
    public let status: String?
    public let submittedAt: String?
    public let title: String?
    public let videoUrl: String?


    public init(applicationId: Int? = nil, category: String? = nil, contactEmail: String? = nil, contactName: String? = nil, description: String? = nil, externalBvid: String? = nil, id: String? = nil, sourceProvider: String? = nil, status: String? = nil, submittedAt: String? = nil, title: String? = nil, videoUrl: String? = nil) {
        self.applicationId = applicationId
        self.category = category
        self.contactEmail = contactEmail
        self.contactName = contactName
        self.description = description
        self.externalBvid = externalBvid
        self.id = id
        self.sourceProvider = sourceProvider
        self.status = status
        self.submittedAt = submittedAt
        self.title = title
        self.videoUrl = videoUrl
    }
}

public struct CourseApplicationVideoUploadRequest: Codable {
    public let file: String?
    public let fileName: String?


    public init(file: String? = nil, fileName: String? = nil) {
        self.file = file
        self.fileName = fileName
    }
}

public struct CourseApplicationVideoUploadResponse: Codable {
    public let contentType: String?
    public let fileName: String?
    public let sha256: String?
    public let sizeBytes: Int?
    public let uploadedAt: String?
    public let videoUrl: String?


    public init(contentType: String? = nil, fileName: String? = nil, sha256: String? = nil, sizeBytes: Int? = nil, uploadedAt: String? = nil, videoUrl: String? = nil) {
        self.contentType = contentType
        self.fileName = fileName
        self.sha256 = sha256
        self.sizeBytes = sizeBytes
        self.uploadedAt = uploadedAt
        self.videoUrl = videoUrl
    }
}

public struct CourseCategoryItem: Codable {
    public let code: String?
    public let courseCount: Int?
    public let description: String?
    public let icon: String?
    public let id: String?
    public let label: String?
    public let name: String?
    public let sortWeight: Int?


    public init(code: String? = nil, courseCount: Int? = nil, description: String? = nil, icon: String? = nil, id: String? = nil, label: String? = nil, name: String? = nil, sortWeight: Int? = nil) {
        self.code = code
        self.courseCount = courseCount
        self.description = description
        self.icon = icon
        self.id = id
        self.label = label
        self.name = name
        self.sortWeight = sortWeight
    }
}

public struct CourseDetail: Codable {
    public let category: String?
    public let categoryLabel: String?
    public let commentCount: Int?
    public let content: String?
    public let contentId: Int?
    public let courseCode: String?
    public let currency: String?
    public let description: String?
    public let durationText: String?
    public let engagement: CourseEngagement?
    public let externalBvid: String?
    public let id: String?
    public let instructor: CourseInstructor?
    public let isCollection: Bool?
    public let lessonsCount: Int?
    public let level: Int?
    public let levelLabel: String?
    public let priceAmount: String?
    public let publishedAt: String?
    public let ratingScore: Double?
    public let relatedCourses: [CourseItem]?
    public let sections: [CourseSectionItem]?
    public let source: CourseOverviewSource?
    public let studentsCount: Int?
    public let tags: [String]?
    public let thumbnailUrl: String?
    public let title: String?


    public init(category: String? = nil, categoryLabel: String? = nil, commentCount: Int? = nil, content: String? = nil, contentId: Int? = nil, courseCode: String? = nil, currency: String? = nil, description: String? = nil, durationText: String? = nil, engagement: CourseEngagement? = nil, externalBvid: String? = nil, id: String? = nil, instructor: CourseInstructor? = nil, isCollection: Bool? = nil, lessonsCount: Int? = nil, level: Int? = nil, levelLabel: String? = nil, priceAmount: String? = nil, publishedAt: String? = nil, ratingScore: Double? = nil, relatedCourses: [CourseItem]? = nil, sections: [CourseSectionItem]? = nil, source: CourseOverviewSource? = nil, studentsCount: Int? = nil, tags: [String]? = nil, thumbnailUrl: String? = nil, title: String? = nil) {
        self.category = category
        self.categoryLabel = categoryLabel
        self.commentCount = commentCount
        self.content = content
        self.contentId = contentId
        self.courseCode = courseCode
        self.currency = currency
        self.description = description
        self.durationText = durationText
        self.engagement = engagement
        self.externalBvid = externalBvid
        self.id = id
        self.instructor = instructor
        self.isCollection = isCollection
        self.lessonsCount = lessonsCount
        self.level = level
        self.levelLabel = levelLabel
        self.priceAmount = priceAmount
        self.publishedAt = publishedAt
        self.ratingScore = ratingScore
        self.relatedCourses = relatedCourses
        self.sections = sections
        self.source = source
        self.studentsCount = studentsCount
        self.tags = tags
        self.thumbnailUrl = thumbnailUrl
        self.title = title
    }
}

public struct CourseEngagement: Codable {
    public let discussions: Int?
    public let likes: Int?
    public let saves: Int?
    public let shares: Int?
    public let studentsCount: Int?
    public let views: Int?


    public init(discussions: Int? = nil, likes: Int? = nil, saves: Int? = nil, shares: Int? = nil, studentsCount: Int? = nil, views: Int? = nil) {
        self.discussions = discussions
        self.likes = likes
        self.saves = saves
        self.shares = shares
        self.studentsCount = studentsCount
        self.views = views
    }
}

public struct CourseInstructor: Codable {
    public let avatar: String?
    public let bio: String?
    public let name: String?
    public let title: String?


    public init(avatar: String? = nil, bio: String? = nil, name: String? = nil, title: String? = nil) {
        self.avatar = avatar
        self.bio = bio
        self.name = name
        self.title = title
    }
}

public struct CourseItem: Codable {
    public let category: String?
    public let categoryLabel: String?
    public let commentCount: Int?
    public let content: String?
    public let contentId: Int?
    public let courseCode: String?
    public let currency: String?
    public let description: String?
    public let durationText: String?
    public let engagement: CourseEngagement?
    public let externalBvid: String?
    public let id: String?
    public let instructor: CourseInstructor?
    public let isCollection: Bool?
    public let lessonsCount: Int?
    public let level: Int?
    public let levelLabel: String?
    public let priceAmount: String?
    public let publishedAt: String?
    public let ratingScore: Double?
    public let studentsCount: Int?
    public let tags: [String]?
    public let thumbnailUrl: String?
    public let title: String?


    public init(category: String? = nil, categoryLabel: String? = nil, commentCount: Int? = nil, content: String? = nil, contentId: Int? = nil, courseCode: String? = nil, currency: String? = nil, description: String? = nil, durationText: String? = nil, engagement: CourseEngagement? = nil, externalBvid: String? = nil, id: String? = nil, instructor: CourseInstructor? = nil, isCollection: Bool? = nil, lessonsCount: Int? = nil, level: Int? = nil, levelLabel: String? = nil, priceAmount: String? = nil, publishedAt: String? = nil, ratingScore: Double? = nil, studentsCount: Int? = nil, tags: [String]? = nil, thumbnailUrl: String? = nil, title: String? = nil) {
        self.category = category
        self.categoryLabel = categoryLabel
        self.commentCount = commentCount
        self.content = content
        self.contentId = contentId
        self.courseCode = courseCode
        self.currency = currency
        self.description = description
        self.durationText = durationText
        self.engagement = engagement
        self.externalBvid = externalBvid
        self.id = id
        self.instructor = instructor
        self.isCollection = isCollection
        self.lessonsCount = lessonsCount
        self.level = level
        self.levelLabel = levelLabel
        self.priceAmount = priceAmount
        self.publishedAt = publishedAt
        self.ratingScore = ratingScore
        self.studentsCount = studentsCount
        self.tags = tags
        self.thumbnailUrl = thumbnailUrl
        self.title = title
    }
}

public struct CourseLessonItem: Codable {
    public let content: String?
    public let description: String?
    public let durationSeconds: Int?
    public let durationText: String?
    public let externalBvid: String?
    public let freePreview: Bool?
    public let id: String?
    public let lessonId: Int?
    public let lessonNo: Int?
    public let number: Int?
    public let sortOrder: Int?
    public let sourceProvider: String?
    public let title: String?
    public let videoUrl: String?


    public init(content: String? = nil, description: String? = nil, durationSeconds: Int? = nil, durationText: String? = nil, externalBvid: String? = nil, freePreview: Bool? = nil, id: String? = nil, lessonId: Int? = nil, lessonNo: Int? = nil, number: Int? = nil, sortOrder: Int? = nil, sourceProvider: String? = nil, title: String? = nil, videoUrl: String? = nil) {
        self.content = content
        self.description = description
        self.durationSeconds = durationSeconds
        self.durationText = durationText
        self.externalBvid = externalBvid
        self.freePreview = freePreview
        self.id = id
        self.lessonId = lessonId
        self.lessonNo = lessonNo
        self.number = number
        self.sortOrder = sortOrder
        self.sourceProvider = sourceProvider
        self.title = title
        self.videoUrl = videoUrl
    }
}

public struct CourseListResponse: Codable {
    public let content: [CourseItem]?
    public let items: [CourseItem]?
    public let page: Int?
    public let size: Int?
    public let totalElements: Int?


    public init(content: [CourseItem]? = nil, items: [CourseItem]? = nil, page: Int? = nil, size: Int? = nil, totalElements: Int? = nil) {
        self.content = content
        self.items = items
        self.page = page
        self.size = size
        self.totalElements = totalElements
    }
}

public struct CourseOverview: Codable {
    public let source: CourseOverviewSource?
    public let stats: CourseOverviewStats?


    public init(source: CourseOverviewSource? = nil, stats: CourseOverviewStats? = nil) {
        self.source = source
        self.stats = stats
    }
}

public struct CourseOverviewSource: Codable {
    public let observedAt: String?
    public let sourceDescription: String?
    public let sourceLabel: String?
    public let sourceTables: [String]?


    public init(observedAt: String? = nil, sourceDescription: String? = nil, sourceLabel: String? = nil, sourceTables: [String]? = nil) {
        self.observedAt = observedAt
        self.sourceDescription = sourceDescription
        self.sourceLabel = sourceLabel
        self.sourceTables = sourceTables
    }
}

public struct CourseOverviewStats: Codable {
    public let totalCategories: Int?
    public let totalCourses: Int?
    public let totalLessons: Int?
    public let totalStudents: Int?


    public init(totalCategories: Int? = nil, totalCourses: Int? = nil, totalLessons: Int? = nil, totalStudents: Int? = nil) {
        self.totalCategories = totalCategories
        self.totalCourses = totalCourses
        self.totalLessons = totalLessons
        self.totalStudents = totalStudents
    }
}

public struct CourseSectionItem: Codable {
    public let description: String?
    public let durationSeconds: Int?
    public let id: String?
    public let lessonCount: Int?
    public let lessons: [CourseLessonItem]?
    public let sectionId: Int?
    public let sectionNo: Int?
    public let sortOrder: Int?
    public let title: String?


    public init(description: String? = nil, durationSeconds: Int? = nil, id: String? = nil, lessonCount: Int? = nil, lessons: [CourseLessonItem]? = nil, sectionId: Int? = nil, sectionNo: Int? = nil, sortOrder: Int? = nil, title: String? = nil) {
        self.description = description
        self.durationSeconds = durationSeconds
        self.id = id
        self.lessonCount = lessonCount
        self.lessons = lessons
        self.sectionId = sectionId
        self.sectionNo = sectionNo
        self.sortOrder = sortOrder
        self.title = title
    }
}

public struct CoursesCategoriesListResult: Codable {
    public let code: String?
    public let data: [CourseCategoryItem]?
    public let msg: String?


    public init(code: String? = nil, data: [CourseCategoryItem]? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CoursesListResult: Codable {
    public let code: String?
    public let data: CourseListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CourseListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CoursesOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: CourseOverview?
    public let msg: String?


    public init(code: String? = nil, data: CourseOverview? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CoursesRetrieveResult: Codable {
    public let code: String?
    public let data: CourseDetail?
    public let msg: String?


    public init(code: String? = nil, data: CourseDetail? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CreateApiKeyRequest: Codable {
    public let defaultForRuntime: Bool?
    public let expires: String?
    public let group: String?
    public let ipLimit: String?
    public let isUnlimitedQuota: Bool?
    public let modalities: [String]?
    public let name: String?
    public let quota: String?


    public init(defaultForRuntime: Bool? = nil, expires: String? = nil, group: String? = nil, ipLimit: String? = nil, isUnlimitedQuota: Bool? = nil, modalities: [String]? = nil, name: String? = nil, quota: String? = nil) {
        self.defaultForRuntime = defaultForRuntime
        self.expires = expires
        self.group = group
        self.ipLimit = ipLimit
        self.isUnlimitedQuota = isUnlimitedQuota
        self.modalities = modalities
        self.name = name
        self.quota = quota
    }
}

public struct CreateApiKeyResponse: Codable {
    public let item: AppApiKeyItem?
    public let rawKey: String?


    public init(item: AppApiKeyItem? = nil, rawKey: String? = nil) {
        self.item = item
        self.rawKey = rawKey
    }
}

public struct DashboardAnnouncement: Codable {
    public let id: Int?
    public let text: String?
    public let time: String?
    public let type: String?


    public init(id: Int? = nil, text: String? = nil, time: String? = nil, type: String? = nil) {
        self.id = id
        self.text = text
        self.time = time
        self.type = type
    }
}

public struct DashboardChartPoint: Codable {
    public let audioWhisper: Double?
    public let imageMidjourneyDallE: Double?
    public let llmText: Double?
    public let musicSuno: Double?
    public let time: String?
    public let videoRunwaySora: Double?


    public init(audioWhisper: Double? = nil, imageMidjourneyDallE: Double? = nil, llmText: Double? = nil, musicSuno: Double? = nil, time: String? = nil, videoRunwaySora: Double? = nil) {
        self.audioWhisper = audioWhisper
        self.imageMidjourneyDallE = imageMidjourneyDallE
        self.llmText = llmText
        self.musicSuno = musicSuno
        self.time = time
        self.videoRunwaySora = videoRunwaySora
    }
}

public struct DashboardConfigurationDomain: Codable {
    public let domain: String?
    public let id: String?
    public let ip: String?
    public let name: String?
    public let remark: String?
    public let status: String?


    public init(domain: String? = nil, id: String? = nil, ip: String? = nil, name: String? = nil, remark: String? = nil, status: String? = nil) {
        self.domain = domain
        self.id = id
        self.ip = ip
        self.name = name
        self.remark = remark
        self.status = status
    }
}

public struct DashboardOverviewResponse: Codable {
    public let announcements: [DashboardAnnouncement]?
    public let chartData: [DashboardChartPoint]?
    public let configurationDomains: [DashboardConfigurationDomain]?
    public let multimodalSparkline: [DashboardSparklinePoint]?
    public let performanceSparkline: [DashboardSparklinePoint]?
    public let requestSparkline: [DashboardSparklinePoint]?
    public let summary: DashboardOverviewSummary?
    public let topModels: [DashboardTopModel]?
    public let warnings: [String]?


    public init(announcements: [DashboardAnnouncement]? = nil, chartData: [DashboardChartPoint]? = nil, configurationDomains: [DashboardConfigurationDomain]? = nil, multimodalSparkline: [DashboardSparklinePoint]? = nil, performanceSparkline: [DashboardSparklinePoint]? = nil, requestSparkline: [DashboardSparklinePoint]? = nil, summary: DashboardOverviewSummary? = nil, topModels: [DashboardTopModel]? = nil, warnings: [String]? = nil) {
        self.announcements = announcements
        self.chartData = chartData
        self.configurationDomains = configurationDomains
        self.multimodalSparkline = multimodalSparkline
        self.performanceSparkline = performanceSparkline
        self.requestSparkline = requestSparkline
        self.summary = summary
        self.topModels = topModels
        self.warnings = warnings
    }
}

public struct DashboardOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: DashboardOverviewResponse?
    public let msg: String?


    public init(code: String? = nil, data: DashboardOverviewResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct DashboardOverviewSummary: Codable {
    public let audioRequests: Int?
    public let availableCredits: Double?
    public let errorCount: Int?
    public let imageRequests: Int?
    public let musicRequests: Int?
    public let requestCount: Int?
    public let rpm: Double?
    public let totalRequestCount: Int?
    public let totalUsedCredits: Double?
    public let tpm: Double?
    public let usedCredits: Double?
    public let videoRequests: Int?


    public init(audioRequests: Int? = nil, availableCredits: Double? = nil, errorCount: Int? = nil, imageRequests: Int? = nil, musicRequests: Int? = nil, requestCount: Int? = nil, rpm: Double? = nil, totalRequestCount: Int? = nil, totalUsedCredits: Double? = nil, tpm: Double? = nil, usedCredits: Double? = nil, videoRequests: Int? = nil) {
        self.audioRequests = audioRequests
        self.availableCredits = availableCredits
        self.errorCount = errorCount
        self.imageRequests = imageRequests
        self.musicRequests = musicRequests
        self.requestCount = requestCount
        self.rpm = rpm
        self.totalRequestCount = totalRequestCount
        self.totalUsedCredits = totalUsedCredits
        self.tpm = tpm
        self.usedCredits = usedCredits
        self.videoRequests = videoRequests
    }
}

public struct DashboardSparklinePoint: Codable {
    public let value: Double?


    public init(value: Double? = nil) {
        self.value = value
    }
}

public struct DashboardTopModel: Codable {
    public let cost: Double?
    public let isUp: Bool?
    public let modality: String?
    public let name: String?
    public let rank: Int?
    public let requests: Int?
    public let supplier: String?
    public let trend: String?


    public init(cost: Double? = nil, isUp: Bool? = nil, modality: String? = nil, name: String? = nil, rank: Int? = nil, requests: Int? = nil, supplier: String? = nil, trend: String? = nil) {
        self.cost = cost
        self.isUp = isUp
        self.modality = modality
        self.name = name
        self.rank = rank
        self.requests = requests
        self.supplier = supplier
        self.trend = trend
    }
}

public struct DeleteApiKeyResponse: Codable {
    public let deleted: Bool?
    public let id: String?


    public init(deleted: Bool? = nil, id: String? = nil) {
        self.deleted = deleted
        self.id = id
    }
}

public struct DocumentationCreateResult: Codable {
    public let code: String?
    public let data: SdkReferenceDocumentationResponse?
    public let msg: String?


    public init(code: String? = nil, data: SdkReferenceDocumentationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct EntriesCreateResult: Codable {
    public let code: String?
    public let data: MemoryEntryResponse?
    public let msg: String?


    public init(code: String? = nil, data: MemoryEntryResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct EntriesListResult: Codable {
    public let code: String?
    public let data: MemoryEntryListResponse?
    public let msg: String?


    public init(code: String? = nil, data: MemoryEntryListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct EntriesRetrieveResult: Codable {
    public let code: String?
    public let data: MemoryEntryItem?
    public let msg: String?


    public init(code: String? = nil, data: MemoryEntryItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsCategoryRetrieveResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsCollectionsCreateResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsCollectionsCurrentDeleteResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsCollectionsCurrentRetrieveResult: Codable {
    public let code: String?
    public let data: Bool?
    public let msg: String?


    public init(code: String? = nil, data: Bool? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsCreateResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsDeleteResult: Codable {
    public let code: String?
    public let data: Bool?
    public let msg: String?


    public init(code: String? = nil, data: Bool? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsHotListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsLikesCreateResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsLikesCurrentDeleteResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsMostLikedListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsMostViewedListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: ForumOverviewResponse?
    public let msg: String?


    public init(code: String? = nil, data: ForumOverviewResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsRecommendListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsRetrieveResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsSharesCreateResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FeedsTopListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FieldError: Codable {
    public let code: String?
    public let field: String?
    public let message: String?


    public init(code: String? = nil, field: String? = nil, message: String? = nil) {
        self.code = code
        self.field = field
        self.message = message
    }
}

public struct ForumAuthor: Codable {
    public let avatar: String?
    public let bio: String?
    public let id: Int?
    public let isFollowing: Bool?
    public let name: String?


    public init(avatar: String? = nil, bio: String? = nil, id: Int? = nil, isFollowing: Bool? = nil, name: String? = nil) {
        self.avatar = avatar
        self.bio = bio
        self.id = id
        self.isFollowing = isFollowing
        self.name = name
    }
}

public struct ForumCommentDetail: Codable {
    public let author: ForumAuthor?
    public let commentId: String?
    public let content: String?
    public let contentId: Int?
    public let contentType: String?
    public let createdAt: String?
    public let deviceInfo: String?
    public let ipAddress: String?
    public let isTop: Bool?
    public let likes: Int?
    public let parentId: Int?
    public let replies: [ForumCommentItem]?
    public let replyCount: Int?
    public let status: String?
    public let updatedAt: String?
    public let userId: Int?


    public init(author: ForumAuthor? = nil, commentId: String? = nil, content: String? = nil, contentId: Int? = nil, contentType: String? = nil, createdAt: String? = nil, deviceInfo: String? = nil, ipAddress: String? = nil, isTop: Bool? = nil, likes: Int? = nil, parentId: Int? = nil, replies: [ForumCommentItem]? = nil, replyCount: Int? = nil, status: String? = nil, updatedAt: String? = nil, userId: Int? = nil) {
        self.author = author
        self.commentId = commentId
        self.content = content
        self.contentId = contentId
        self.contentType = contentType
        self.createdAt = createdAt
        self.deviceInfo = deviceInfo
        self.ipAddress = ipAddress
        self.isTop = isTop
        self.likes = likes
        self.parentId = parentId
        self.replies = replies
        self.replyCount = replyCount
        self.status = status
        self.updatedAt = updatedAt
        self.userId = userId
    }
}

public struct ForumCommentItem: Codable {
    public let author: ForumAuthor?
    public let commentId: String?
    public let content: String?
    public let contentId: Int?
    public let contentType: String?
    public let createdAt: String?
    public let isTop: Bool?
    public let likes: Int?
    public let parentId: Int?
    public let replyCount: Int?
    public let status: String?
    public let userId: Int?


    public init(author: ForumAuthor? = nil, commentId: String? = nil, content: String? = nil, contentId: Int? = nil, contentType: String? = nil, createdAt: String? = nil, isTop: Bool? = nil, likes: Int? = nil, parentId: Int? = nil, replyCount: Int? = nil, status: String? = nil, userId: Int? = nil) {
        self.author = author
        self.commentId = commentId
        self.content = content
        self.contentId = contentId
        self.contentType = contentType
        self.createdAt = createdAt
        self.isTop = isTop
        self.likes = likes
        self.parentId = parentId
        self.replyCount = replyCount
        self.status = status
        self.userId = userId
    }
}

public struct ForumCommentPage: Codable {
    public let content: [ForumCommentItem]?
    public let items: [ForumCommentItem]?
    public let page: Int?
    public let size: Int?
    public let totalElements: Int?


    public init(content: [ForumCommentItem]? = nil, items: [ForumCommentItem]? = nil, page: Int? = nil, size: Int? = nil, totalElements: Int? = nil) {
        self.content = content
        self.items = items
        self.page = page
        self.size = size
        self.totalElements = totalElements
    }
}

public struct ForumCommentStatistics: Codable {
    public let totalComments: Int?


    public init(totalComments: Int? = nil) {
        self.totalComments = totalComments
    }
}

public struct ForumCommunityLink: Codable {
    public let id: String?
    public let label: String?
    public let qrCodeUrl: String?
    public let tone: String?
    public let url: String?


    public init(id: String? = nil, label: String? = nil, qrCodeUrl: String? = nil, tone: String? = nil, url: String? = nil) {
        self.id = id
        self.label = label
        self.qrCodeUrl = qrCodeUrl
        self.tone = tone
        self.url = url
    }
}

public struct ForumCreateCommentRequest: Codable {
    public let content: String?
    public let contentId: Int?
    public let contentType: String?
    public let deviceInfo: String?


    public init(content: String? = nil, contentId: Int? = nil, contentType: String? = nil, deviceInfo: String? = nil) {
        self.content = content
        self.contentId = contentId
        self.contentType = contentType
        self.deviceInfo = deviceInfo
    }
}

public struct ForumCreateFeedRequest: Codable {
    public let categoryId: Int?
    public let content: String?
    public let images: [String]?
    public let source: String?
    public let sourceUrl: String?
    public let tags: [String]?
    public let title: String?


    public init(categoryId: Int? = nil, content: String? = nil, images: [String]? = nil, source: String? = nil, sourceUrl: String? = nil, tags: [String]? = nil, title: String? = nil) {
        self.categoryId = categoryId
        self.content = content
        self.images = images
        self.source = source
        self.sourceUrl = sourceUrl
        self.tags = tags
        self.title = title
    }
}

public struct ForumFeedItem: Codable {
    public let author: ForumAuthor?
    public let categoryId: Int?
    public let commentCount: Int?
    public let content: String?
    public let contentType: String?
    public let coverImage: String?
    public let createdAt: String?
    public let id: Int?
    public let isCollected: Bool?
    public let isHot: Bool?
    public let isLiked: Bool?
    public let isRecommended: Bool?
    public let isTop: Bool?
    public let likeCount: Int?
    public let shareCount: Int?
    public let summary: String?
    public let tags: [String]?
    public let title: String?
    public let updatedAt: String?
    public let viewCount: Int?


    public init(author: ForumAuthor? = nil, categoryId: Int? = nil, commentCount: Int? = nil, content: String? = nil, contentType: String? = nil, coverImage: String? = nil, createdAt: String? = nil, id: Int? = nil, isCollected: Bool? = nil, isHot: Bool? = nil, isLiked: Bool? = nil, isRecommended: Bool? = nil, isTop: Bool? = nil, likeCount: Int? = nil, shareCount: Int? = nil, summary: String? = nil, tags: [String]? = nil, title: String? = nil, updatedAt: String? = nil, viewCount: Int? = nil) {
        self.author = author
        self.categoryId = categoryId
        self.commentCount = commentCount
        self.content = content
        self.contentType = contentType
        self.coverImage = coverImage
        self.createdAt = createdAt
        self.id = id
        self.isCollected = isCollected
        self.isHot = isHot
        self.isLiked = isLiked
        self.isRecommended = isRecommended
        self.isTop = isTop
        self.likeCount = likeCount
        self.shareCount = shareCount
        self.summary = summary
        self.tags = tags
        self.title = title
        self.updatedAt = updatedAt
        self.viewCount = viewCount
    }
}

public struct ForumOverviewResponse: Codable {
    public let communityLinks: [ForumCommunityLink]?
    public let source: ForumOverviewSource?
    public let stats: ForumOverviewStats?


    public init(communityLinks: [ForumCommunityLink]? = nil, source: ForumOverviewSource? = nil, stats: ForumOverviewStats? = nil) {
        self.communityLinks = communityLinks
        self.source = source
        self.stats = stats
    }
}

public struct ForumOverviewSource: Codable {
    public let observedAt: String?
    public let sourceDescription: String?
    public let sourceLabel: String?
    public let sourceTables: [String]?


    public init(observedAt: String? = nil, sourceDescription: String? = nil, sourceLabel: String? = nil, sourceTables: [String]? = nil) {
        self.observedAt = observedAt
        self.sourceDescription = sourceDescription
        self.sourceLabel = sourceLabel
        self.sourceTables = sourceTables
    }
}

public struct ForumOverviewStats: Codable {
    public let memberCount: Int?
    public let onlineMembers: Int?
    public let totalComments: Int?
    public let totalPosts: Int?


    public init(memberCount: Int? = nil, onlineMembers: Int? = nil, totalComments: Int? = nil, totalPosts: Int? = nil) {
        self.memberCount = memberCount
        self.onlineMembers = onlineMembers
        self.totalComments = totalComments
        self.totalPosts = totalPosts
    }
}

public struct ForumReplyCommentRequest: Codable {
    public let content: String?
    public let deviceInfo: String?


    public init(content: String? = nil, deviceInfo: String? = nil) {
        self.content = content
        self.deviceInfo = deviceInfo
    }
}

public struct FulfillmentsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FulfillmentsRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct GatewayTrace: Codable {
    public let channel: String?
    public let duration: String?
    public let endpoint: String?
    public let id: String?
    public let ip: String?
    public let method: String?
    public let status: Int?
    public let time: String?


    public init(channel: String? = nil, duration: String? = nil, endpoint: String? = nil, id: String? = nil, ip: String? = nil, method: String? = nil, status: Int? = nil, time: String? = nil) {
        self.channel = channel
        self.duration = duration
        self.endpoint = endpoint
        self.id = id
        self.ip = ip
        self.method = method
        self.status = status
        self.time = time
    }
}

public struct GatewayTracesListResult: Codable {
    public let code: String?
    public let data: GatewayTracesResponse?
    public let msg: String?


    public init(code: String? = nil, data: GatewayTracesResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct GatewayTracesResponse: Codable {
    public let items: [GatewayTrace]?


    public init(items: [GatewayTrace]? = nil) {
        self.items = items
    }
}

public struct GenerationHistoryItem: Codable {
    public let aspectRatio: String?
    public let createdAt: String?
    public let date: String?
    public let durationSeconds: Int?
    public let id: String?
    public let images: [String]?
    public let modelCatalogKey: String?
    public let modelInfo: String?
    public let outputText: String?
    public let prompt: String?
    public let status: String?
    public let type: String?
    public let updatedAt: String?
    public let url: String?
    public let videos: [GenerationHistoryMediaItem]?


    public init(aspectRatio: String? = nil, createdAt: String? = nil, date: String? = nil, durationSeconds: Int? = nil, id: String? = nil, images: [String]? = nil, modelCatalogKey: String? = nil, modelInfo: String? = nil, outputText: String? = nil, prompt: String? = nil, status: String? = nil, type: String? = nil, updatedAt: String? = nil, url: String? = nil, videos: [GenerationHistoryMediaItem]? = nil) {
        self.aspectRatio = aspectRatio
        self.createdAt = createdAt
        self.date = date
        self.durationSeconds = durationSeconds
        self.id = id
        self.images = images
        self.modelCatalogKey = modelCatalogKey
        self.modelInfo = modelInfo
        self.outputText = outputText
        self.prompt = prompt
        self.status = status
        self.type = type
        self.updatedAt = updatedAt
        self.url = url
        self.videos = videos
    }
}

public struct GenerationHistoryMediaItem: Codable {
    public let thumb: String?
    public let url: String?


    public init(thumb: String? = nil, url: String? = nil) {
        self.thumb = thumb
        self.url = url
    }
}

public struct GenerationHistoryResponse: Codable {
    public let items: [GenerationHistoryItem]?


    public init(items: [GenerationHistoryItem]? = nil) {
        self.items = items
    }
}

public struct GenerationListResult: Codable {
    public let code: String?
    public let data: GenerationHistoryResponse?
    public let msg: String?


    public init(code: String? = nil, data: GenerationHistoryResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct IamApiKeyGroupChannelRecord: Codable {
    public let capabilities: [String: String]?
    public let channelId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let groupId: String?
    public let id: String?
    public let metadata: [String: String]?
    public let modelScope: [String: String]?
    public let organizationId: String?
    public let priority: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let weight: Int?


    public init(capabilities: [String: String]? = nil, channelId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, groupId: String? = nil, id: String? = nil, metadata: [String: String]? = nil, modelScope: [String: String]? = nil, organizationId: String? = nil, priority: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, weight: Int? = nil) {
        self.capabilities = capabilities
        self.channelId = channelId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.groupId = groupId
        self.id = id
        self.metadata = metadata
        self.modelScope = modelScope
        self.organizationId = organizationId
        self.priority = priority
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.weight = weight
    }
}

public struct IamApiKeyRecord: Codable {
    public let createdAt: String?
    public let expiresAt: String?
    public let id: String?
    public let keyHash: String?
    public let name: String?
    public let permissionScopeJson: [String: String]?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?


    public init(createdAt: String? = nil, expiresAt: String? = nil, id: String? = nil, keyHash: String? = nil, name: String? = nil, permissionScopeJson: [String: String]? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil) {
        self.createdAt = createdAt
        self.expiresAt = expiresAt
        self.id = id
        self.keyHash = keyHash
        self.name = name
        self.permissionScopeJson = permissionScopeJson
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
    }
}

public struct IamAppContext: Codable {
    public let appId: String?
    public let authLevel: String?
    public let dataScope: [String]?
    public let deploymentMode: String?
    public let environment: String?
    public let organizationId: String?
    public let permissionScope: [String]?
    public let sessionId: String?
    public let tenantId: String?
    public let userId: String?


    public init(appId: String? = nil, authLevel: String? = nil, dataScope: [String]? = nil, deploymentMode: String? = nil, environment: String? = nil, organizationId: String? = nil, permissionScope: [String]? = nil, sessionId: String? = nil, tenantId: String? = nil, userId: String? = nil) {
        self.appId = appId
        self.authLevel = authLevel
        self.dataScope = dataScope
        self.deploymentMode = deploymentMode
        self.environment = environment
        self.organizationId = organizationId
        self.permissionScope = permissionScope
        self.sessionId = sessionId
        self.tenantId = tenantId
        self.userId = userId
    }
}

public struct IamAuditEventRecord: Codable {
    public let action: String?
    public let actorUserId: String?
    public let appId: String?
    public let createdAt: String?
    public let detailJson: [String: String]?
    public let environment: String?
    public let id: String?
    public let organizationId: String?
    public let requestId: String?
    public let resourceId: String?
    public let resourceType: String?
    public let shardingKey: String?
    public let tenantId: String?


    public init(action: String? = nil, actorUserId: String? = nil, appId: String? = nil, createdAt: String? = nil, detailJson: [String: String]? = nil, environment: String? = nil, id: String? = nil, organizationId: String? = nil, requestId: String? = nil, resourceId: String? = nil, resourceType: String? = nil, shardingKey: String? = nil, tenantId: String? = nil) {
        self.action = action
        self.actorUserId = actorUserId
        self.appId = appId
        self.createdAt = createdAt
        self.detailJson = detailJson
        self.environment = environment
        self.id = id
        self.organizationId = organizationId
        self.requestId = requestId
        self.resourceId = resourceId
        self.resourceType = resourceType
        self.shardingKey = shardingKey
        self.tenantId = tenantId
    }
}

public struct IamCredentialRecord: Codable {
    public let createdAt: String?
    public let credentialHash: String?
    public let credentialType: String?
    public let expiresAt: String?
    public let id: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?


    public init(createdAt: String? = nil, credentialHash: String? = nil, credentialType: String? = nil, expiresAt: String? = nil, id: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil) {
        self.createdAt = createdAt
        self.credentialHash = credentialHash
        self.credentialType = credentialType
        self.expiresAt = expiresAt
        self.id = id
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
    }
}

public struct IamCurrentSessionUpdateRequest: Codable {
    public let deviceName: String?
    public let organizationCode: String?
    public let organizationId: String?


    public init(deviceName: String? = nil, organizationCode: String? = nil, organizationId: String? = nil) {
        self.deviceName = deviceName
        self.organizationCode = organizationCode
        self.organizationId = organizationId
    }
}

public struct IamDeviceRecord: Codable {
    public let createdAt: String?
    public let deviceFingerprint: String?
    public let id: String?
    public let lastSeenAt: String?
    public let name: String?
    public let tenantId: String?
    public let trusted: Bool?
    public let userId: String?


    public init(createdAt: String? = nil, deviceFingerprint: String? = nil, id: String? = nil, lastSeenAt: String? = nil, name: String? = nil, tenantId: String? = nil, trusted: Bool? = nil, userId: String? = nil) {
        self.createdAt = createdAt
        self.deviceFingerprint = deviceFingerprint
        self.id = id
        self.lastSeenAt = lastSeenAt
        self.name = name
        self.tenantId = tenantId
        self.trusted = trusted
        self.userId = userId
    }
}

public struct IamGatewayAccessPolicyRecord: Codable {
    public let allowedCapabilities: [String: String]?
    public let allowedModels: [String: String]?
    public let createdAt: String?
    public let dataRetentionMode: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let deniedCapabilities: [String: String]?
    public let deniedModels: [String: String]?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let ipAllowlist: [String: String]?
    public let ipDenylist: [String: String]?
    public let ipRuleCount: Int?
    public let maxContextTokens: String?
    public let metadata: [String: String]?
    public let name: String?
    public let networkPolicyMode: String?
    public let organizationId: String?
    public let policyType: String?
    public let regionAllowlist: [String: String]?
    public let status: String?
    public let subjectId: String?
    public let subjectRefHash: String?
    public let subjectRefMasked: String?
    public let subjectType: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(allowedCapabilities: [String: String]? = nil, allowedModels: [String: String]? = nil, createdAt: String? = nil, dataRetentionMode: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deniedCapabilities: [String: String]? = nil, deniedModels: [String: String]? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, ipAllowlist: [String: String]? = nil, ipDenylist: [String: String]? = nil, ipRuleCount: Int? = nil, maxContextTokens: String? = nil, metadata: [String: String]? = nil, name: String? = nil, networkPolicyMode: String? = nil, organizationId: String? = nil, policyType: String? = nil, regionAllowlist: [String: String]? = nil, status: String? = nil, subjectId: String? = nil, subjectRefHash: String? = nil, subjectRefMasked: String? = nil, subjectType: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.allowedCapabilities = allowedCapabilities
        self.allowedModels = allowedModels
        self.createdAt = createdAt
        self.dataRetentionMode = dataRetentionMode
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.deniedCapabilities = deniedCapabilities
        self.deniedModels = deniedModels
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.ipAllowlist = ipAllowlist
        self.ipDenylist = ipDenylist
        self.ipRuleCount = ipRuleCount
        self.maxContextTokens = maxContextTokens
        self.metadata = metadata
        self.name = name
        self.networkPolicyMode = networkPolicyMode
        self.organizationId = organizationId
        self.policyType = policyType
        self.regionAllowlist = regionAllowlist
        self.status = status
        self.subjectId = subjectId
        self.subjectRefHash = subjectRefHash
        self.subjectRefMasked = subjectRefMasked
        self.subjectType = subjectType
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IamGatewayApiKeyGroupMetricSnapshotRecord: Codable {
    public let accountAvailableCount: String?
    public let accountTotalCount: String?
    public let capacityLimit: String?
    public let capacityUsed: String?
    public let createdAt: String?
    public let groupCode: String?
    public let groupId: String?
    public let healthStatus: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let providerCode: String?
    public let rebuildVersion: String?
    public let requestCountToday: String?
    public let requestCountTotal: String?
    public let snapshotAt: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let usageAmountToday: String?
    public let usageAmountTotal: String?
    public let uuid: String?


    public init(accountAvailableCount: String? = nil, accountTotalCount: String? = nil, capacityLimit: String? = nil, capacityUsed: String? = nil, createdAt: String? = nil, groupCode: String? = nil, groupId: String? = nil, healthStatus: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, providerCode: String? = nil, rebuildVersion: String? = nil, requestCountToday: String? = nil, requestCountTotal: String? = nil, snapshotAt: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, usageAmountToday: String? = nil, usageAmountTotal: String? = nil, uuid: String? = nil) {
        self.accountAvailableCount = accountAvailableCount
        self.accountTotalCount = accountTotalCount
        self.capacityLimit = capacityLimit
        self.capacityUsed = capacityUsed
        self.createdAt = createdAt
        self.groupCode = groupCode
        self.groupId = groupId
        self.healthStatus = healthStatus
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.providerCode = providerCode
        self.rebuildVersion = rebuildVersion
        self.requestCountToday = requestCountToday
        self.requestCountTotal = requestCountTotal
        self.snapshotAt = snapshotAt
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.usageAmountToday = usageAmountToday
        self.usageAmountTotal = usageAmountTotal
        self.uuid = uuid
    }
}

public struct IamGatewayApiKeyGroupRecord: Codable {
    public let allowedOrigin: [String: String]?
    public let billingType: String?
    public let capacityLimit: String?
    public let code: String?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultPolicyId: String?
    public let defaultQuotaPolicyId: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let environment: String?
    public let groupType: String?
    public let id: String?
    public let metadata: [String: String]?
    public let name: String?
    public let officialPriceMultiplier: String?
    public let organizationId: String?
    public let priceReferenceMode: String?
    public let pricingPlanCode: String?
    public let pricingPlanId: String?
    public let providerCode: String?
    public let rateMultiplier: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(allowedOrigin: [String: String]? = nil, billingType: String? = nil, capacityLimit: String? = nil, code: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultPolicyId: String? = nil, defaultQuotaPolicyId: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, environment: String? = nil, groupType: String? = nil, id: String? = nil, metadata: [String: String]? = nil, name: String? = nil, officialPriceMultiplier: String? = nil, organizationId: String? = nil, priceReferenceMode: String? = nil, pricingPlanCode: String? = nil, pricingPlanId: String? = nil, providerCode: String? = nil, rateMultiplier: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.allowedOrigin = allowedOrigin
        self.billingType = billingType
        self.capacityLimit = capacityLimit
        self.code = code
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultPolicyId = defaultPolicyId
        self.defaultQuotaPolicyId = defaultQuotaPolicyId
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.environment = environment
        self.groupType = groupType
        self.id = id
        self.metadata = metadata
        self.name = name
        self.officialPriceMultiplier = officialPriceMultiplier
        self.organizationId = organizationId
        self.priceReferenceMode = priceReferenceMode
        self.pricingPlanCode = pricingPlanCode
        self.pricingPlanId = pricingPlanId
        self.providerCode = providerCode
        self.rateMultiplier = rateMultiplier
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IamGatewayApiKeyRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let environment: String?
    public let expireAt: String?
    public let groupId: String?
    public let hashAlg: String?
    public let id: String?
    public let idempotencyKey: String?
    public let keyDisplayMasked: String?
    public let keyHash: String?
    public let keyPrefix: String?
    public let lastRevealedAt: String?
    public let lastUsedAt: String?
    public let lastUsedIpHash: String?
    public let lastUsedIpMasked: String?
    public let lastUsedIpRegion: String?
    public let legacyApiKeyId: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let policyId: String?
    public let quotaPolicyId: String?
    public let rateLimitPolicyId: String?
    public let revokedAt: String?
    public let revokedBy: String?
    public let rotatedFromKeyId: String?
    public let secretVersion: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, environment: String? = nil, expireAt: String? = nil, groupId: String? = nil, hashAlg: String? = nil, id: String? = nil, idempotencyKey: String? = nil, keyDisplayMasked: String? = nil, keyHash: String? = nil, keyPrefix: String? = nil, lastRevealedAt: String? = nil, lastUsedAt: String? = nil, lastUsedIpHash: String? = nil, lastUsedIpMasked: String? = nil, lastUsedIpRegion: String? = nil, legacyApiKeyId: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, policyId: String? = nil, quotaPolicyId: String? = nil, rateLimitPolicyId: String? = nil, revokedAt: String? = nil, revokedBy: String? = nil, rotatedFromKeyId: String? = nil, secretVersion: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.environment = environment
        self.expireAt = expireAt
        self.groupId = groupId
        self.hashAlg = hashAlg
        self.id = id
        self.idempotencyKey = idempotencyKey
        self.keyDisplayMasked = keyDisplayMasked
        self.keyHash = keyHash
        self.keyPrefix = keyPrefix
        self.lastRevealedAt = lastRevealedAt
        self.lastUsedAt = lastUsedAt
        self.lastUsedIpHash = lastUsedIpHash
        self.lastUsedIpMasked = lastUsedIpMasked
        self.lastUsedIpRegion = lastUsedIpRegion
        self.legacyApiKeyId = legacyApiKeyId
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.policyId = policyId
        self.quotaPolicyId = quotaPolicyId
        self.rateLimitPolicyId = rateLimitPolicyId
        self.revokedAt = revokedAt
        self.revokedBy = revokedBy
        self.rotatedFromKeyId = rotatedFromKeyId
        self.secretVersion = secretVersion
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct IamGatewayRiskRuleRecord: Codable {
    public let action: String?
    public let blockDurationSeconds: String?
    public let burstLimit: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let hitCount: String?
    public let id: String?
    public let lastHitAt: String?
    public let matchMode: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let priority: Int?
    public let reason: String?
    public let requestsPerDay: String?
    public let requestsPerMinute: String?
    public let requestsPerSecond: String?
    public let ruleCategory: String?
    public let ruleName: String?
    public let ruleType: String?
    public let scopeId: String?
    public let scopeType: String?
    public let status: String?
    public let targetType: String?
    public let targetValue: String?
    public let targetValueCipherRef: String?
    public let targetValueHash: String?
    public let targetValueMasked: String?
    public let tenantId: String?
    public let tokensPerMinute: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(action: String? = nil, blockDurationSeconds: String? = nil, burstLimit: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, hitCount: String? = nil, id: String? = nil, lastHitAt: String? = nil, matchMode: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, priority: Int? = nil, reason: String? = nil, requestsPerDay: String? = nil, requestsPerMinute: String? = nil, requestsPerSecond: String? = nil, ruleCategory: String? = nil, ruleName: String? = nil, ruleType: String? = nil, scopeId: String? = nil, scopeType: String? = nil, status: String? = nil, targetType: String? = nil, targetValue: String? = nil, targetValueCipherRef: String? = nil, targetValueHash: String? = nil, targetValueMasked: String? = nil, tenantId: String? = nil, tokensPerMinute: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.action = action
        self.blockDurationSeconds = blockDurationSeconds
        self.burstLimit = burstLimit
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.hitCount = hitCount
        self.id = id
        self.lastHitAt = lastHitAt
        self.matchMode = matchMode
        self.metadata = metadata
        self.organizationId = organizationId
        self.priority = priority
        self.reason = reason
        self.requestsPerDay = requestsPerDay
        self.requestsPerMinute = requestsPerMinute
        self.requestsPerSecond = requestsPerSecond
        self.ruleCategory = ruleCategory
        self.ruleName = ruleName
        self.ruleType = ruleType
        self.scopeId = scopeId
        self.scopeType = scopeType
        self.status = status
        self.targetType = targetType
        self.targetValue = targetValue
        self.targetValueCipherRef = targetValueCipherRef
        self.targetValueHash = targetValueHash
        self.targetValueMasked = targetValueMasked
        self.tenantId = tenantId
        self.tokensPerMinute = tokensPerMinute
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IamMfaFactorRecord: Codable {
    public let createdAt: String?
    public let factorType: String?
    public let id: String?
    public let secretRef: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?


    public init(createdAt: String? = nil, factorType: String? = nil, id: String? = nil, secretRef: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil) {
        self.createdAt = createdAt
        self.factorType = factorType
        self.id = id
        self.secretRef = secretRef
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
    }
}

public struct IamOauthAuthorizationUrlResponse: Codable {
    public let authUrl: String?


    public init(authUrl: String? = nil) {
        self.authUrl = authUrl
    }
}

public struct IamOauthSessionCreateRequest: Codable {
    public let code: String?
    public let deviceId: String?
    public let deviceType: String?
    public let provider: String?
    public let state: String?


    public init(code: String? = nil, deviceId: String? = nil, deviceType: String? = nil, provider: String? = nil, state: String? = nil) {
        self.code = code
        self.deviceId = deviceId
        self.deviceType = deviceType
        self.provider = provider
        self.state = state
    }
}

public struct IamOrganizationMemberRecord: Codable {
    public let id: String?
    public let joinedAt: String?
    public let leftAt: String?
    public let organizationId: String?
    public let remark: String?
    public let roleCode: String?
    public let status: String?
    public let tenantId: String?
    public let userId: String?


    public init(id: String? = nil, joinedAt: String? = nil, leftAt: String? = nil, organizationId: String? = nil, remark: String? = nil, roleCode: String? = nil, status: String? = nil, tenantId: String? = nil, userId: String? = nil) {
        self.id = id
        self.joinedAt = joinedAt
        self.leftAt = leftAt
        self.organizationId = organizationId
        self.remark = remark
        self.roleCode = roleCode
        self.status = status
        self.tenantId = tenantId
        self.userId = userId
    }
}

public struct IamOrganizationRecord: Codable {
    public let code: String?
    public let createdAt: String?
    public let id: String?
    public let name: String?
    public let parentId: String?
    public let path: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(code: String? = nil, createdAt: String? = nil, id: String? = nil, name: String? = nil, parentId: String? = nil, path: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.code = code
        self.createdAt = createdAt
        self.id = id
        self.name = name
        self.parentId = parentId
        self.path = path
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct IamPasswordResetCreateRequest: Codable {
    public let account: String?
    public let code: String?
    public let confirmPassword: String?
    public let newPassword: String?


    public init(account: String? = nil, code: String? = nil, confirmPassword: String? = nil, newPassword: String? = nil) {
        self.account = account
        self.code = code
        self.confirmPassword = confirmPassword
        self.newPassword = newPassword
    }
}

public struct IamPasswordResetRequestCreateRequest: Codable {
    public let account: String?
    public let channel: String?


    public init(account: String? = nil, channel: String? = nil) {
        self.account = account
        self.channel = channel
    }
}

public struct IamPasswordResetRequestResponse: Codable {
    public let debugCode: String?
    public let expiresAt: String?
    public let requestId: String?


    public init(debugCode: String? = nil, expiresAt: String? = nil, requestId: String? = nil) {
        self.debugCode = debugCode
        self.expiresAt = expiresAt
        self.requestId = requestId
    }
}

public struct IamPermissionRecord: Codable {
    public let action: String?
    public let code: String?
    public let createdAt: String?
    public let id: String?
    public let name: String?
    public let resource: String?


    public init(action: String? = nil, code: String? = nil, createdAt: String? = nil, id: String? = nil, name: String? = nil, resource: String? = nil) {
        self.action = action
        self.code = code
        self.createdAt = createdAt
        self.id = id
        self.name = name
        self.resource = resource
    }
}

public struct IamPolicyRecord: Codable {
    public let code: String?
    public let createdAt: String?
    public let id: String?
    public let name: String?
    public let policyJson: [String: String]?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(code: String? = nil, createdAt: String? = nil, id: String? = nil, name: String? = nil, policyJson: [String: String]? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.code = code
        self.createdAt = createdAt
        self.id = id
        self.name = name
        self.policyJson = policyJson
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct IamRegistrationCreateRequest: Codable {
    public let channel: String?
    public let confirmPassword: String?
    public let email: String?
    public let organizationCode: String?
    public let password: String?
    public let phone: String?
    public let tenantCode: String?
    public let username: String?
    public let verificationCode: String?


    public init(channel: String? = nil, confirmPassword: String? = nil, email: String? = nil, organizationCode: String? = nil, password: String? = nil, phone: String? = nil, tenantCode: String? = nil, username: String? = nil, verificationCode: String? = nil) {
        self.channel = channel
        self.confirmPassword = confirmPassword
        self.email = email
        self.organizationCode = organizationCode
        self.password = password
        self.phone = phone
        self.tenantCode = tenantCode
        self.username = username
        self.verificationCode = verificationCode
    }
}

public struct IamRolePermissionRecord: Codable {
    public let createdAt: String?
    public let id: String?
    public let permissionId: String?
    public let roleId: String?
    public let tenantId: String?


    public init(createdAt: String? = nil, id: String? = nil, permissionId: String? = nil, roleId: String? = nil, tenantId: String? = nil) {
        self.createdAt = createdAt
        self.id = id
        self.permissionId = permissionId
        self.roleId = roleId
        self.tenantId = tenantId
    }
}

public struct IamRoleRecord: Codable {
    public let code: String?
    public let createdAt: String?
    public let id: String?
    public let name: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(code: String? = nil, createdAt: String? = nil, id: String? = nil, name: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.code = code
        self.createdAt = createdAt
        self.id = id
        self.name = name
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct IamRuntimeRetrieveResult: Codable {
    public let code: String?
    public let data: AuthRuntimeSettingsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AuthRuntimeSettingsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct IamSecurityEventRecord: Codable {
    public let createdAt: String?
    public let detailJson: [String: String]?
    public let eventType: String?
    public let id: String?
    public let sessionId: String?
    public let severity: String?
    public let tenantId: String?
    public let userId: String?


    public init(createdAt: String? = nil, detailJson: [String: String]? = nil, eventType: String? = nil, id: String? = nil, sessionId: String? = nil, severity: String? = nil, tenantId: String? = nil, userId: String? = nil) {
        self.createdAt = createdAt
        self.detailJson = detailJson
        self.eventType = eventType
        self.id = id
        self.sessionId = sessionId
        self.severity = severity
        self.tenantId = tenantId
        self.userId = userId
    }
}

public struct IamSessionCreateRequest: Codable {
    public let code: String?
    public let deviceId: String?
    public let deviceName: String?
    public let deviceType: String?
    public let email: String?
    public let grantType: String?
    public let name: String?
    public let organizationCode: String?
    public let password: String?
    public let phone: String?
    public let subject: String?
    public let tenantCode: String?
    public let username: String?


    public init(code: String? = nil, deviceId: String? = nil, deviceName: String? = nil, deviceType: String? = nil, email: String? = nil, grantType: String? = nil, name: String? = nil, organizationCode: String? = nil, password: String? = nil, phone: String? = nil, subject: String? = nil, tenantCode: String? = nil, username: String? = nil) {
        self.code = code
        self.deviceId = deviceId
        self.deviceName = deviceName
        self.deviceType = deviceType
        self.email = email
        self.grantType = grantType
        self.name = name
        self.organizationCode = organizationCode
        self.password = password
        self.phone = phone
        self.subject = subject
        self.tenantCode = tenantCode
        self.username = username
    }
}

public struct IamSessionRecord: Codable {
    public let accessTokenHash: String?
    public let appId: String?
    public let authLevel: String?
    public let authTokenHash: String?
    public let createdAt: String?
    public let dataScopeJson: [String: String]?
    public let deploymentMode: String?
    public let environment: String?
    public let expiresAt: String?
    public let id: String?
    public let organizationId: String?
    public let permissionScopeJson: [String: String]?
    public let refreshTokenHash: String?
    public let revokedAt: String?
    public let shardingKey: String?
    public let shardingStrategy: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?


    public init(accessTokenHash: String? = nil, appId: String? = nil, authLevel: String? = nil, authTokenHash: String? = nil, createdAt: String? = nil, dataScopeJson: [String: String]? = nil, deploymentMode: String? = nil, environment: String? = nil, expiresAt: String? = nil, id: String? = nil, organizationId: String? = nil, permissionScopeJson: [String: String]? = nil, refreshTokenHash: String? = nil, revokedAt: String? = nil, shardingKey: String? = nil, shardingStrategy: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil) {
        self.accessTokenHash = accessTokenHash
        self.appId = appId
        self.authLevel = authLevel
        self.authTokenHash = authTokenHash
        self.createdAt = createdAt
        self.dataScopeJson = dataScopeJson
        self.deploymentMode = deploymentMode
        self.environment = environment
        self.expiresAt = expiresAt
        self.id = id
        self.organizationId = organizationId
        self.permissionScopeJson = permissionScopeJson
        self.refreshTokenHash = refreshTokenHash
        self.revokedAt = revokedAt
        self.shardingKey = shardingKey
        self.shardingStrategy = shardingStrategy
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
    }
}

public struct IamSessionRefreshRequest: Codable {
    public let refreshToken: String?


    public init(refreshToken: String? = nil) {
        self.refreshToken = refreshToken
    }
}

public struct IamSessionResponse: Codable {
    public let accessToken: String?
    public let authToken: String?
    public let context: IamAppContext?
    public let expiresAt: String?
    public let refreshToken: String?
    public let sessionId: String?
    public let user: IamUserResponse?


    public init(accessToken: String? = nil, authToken: String? = nil, context: IamAppContext? = nil, expiresAt: String? = nil, refreshToken: String? = nil, sessionId: String? = nil, user: IamUserResponse? = nil) {
        self.accessToken = accessToken
        self.authToken = authToken
        self.context = context
        self.expiresAt = expiresAt
        self.refreshToken = refreshToken
        self.sessionId = sessionId
        self.user = user
    }
}

public struct IamTenantRecord: Codable {
    public let code: String?
    public let createdAt: String?
    public let id: String?
    public let name: String?
    public let status: String?
    public let updatedAt: String?


    public init(code: String? = nil, createdAt: String? = nil, id: String? = nil, name: String? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.code = code
        self.createdAt = createdAt
        self.id = id
        self.name = name
        self.status = status
        self.updatedAt = updatedAt
    }
}

public struct IamUserIdentityRecord: Codable {
    public let createdAt: String?
    public let email: String?
    public let id: String?
    public let provider: String?
    public let subject: String?
    public let tenantId: String?
    public let userId: String?


    public init(createdAt: String? = nil, email: String? = nil, id: String? = nil, provider: String? = nil, subject: String? = nil, tenantId: String? = nil, userId: String? = nil) {
        self.createdAt = createdAt
        self.email = email
        self.id = id
        self.provider = provider
        self.subject = subject
        self.tenantId = tenantId
        self.userId = userId
    }
}

public struct IamUserLoginEventRecord: Codable {
    public let authMethod: String?
    public let authProvider: String?
    public let clientIpHash: String?
    public let clientIpMasked: String?
    public let clientIpRegion: String?
    public let createdAt: String?
    public let deviceFingerprintHash: String?
    public let deviceLabel: String?
    public let failureReasonCode: String?
    public let id: String?
    public let legalHold: Bool?
    public let loginResult: String?
    public let metadata: [String: String]?
    public let mfaVerified: Bool?
    public let occurredAt: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let riskLevel: String?
    public let sessionIdHash: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userAgentHash: String?
    public let userId: String?
    public let uuid: String?


    public init(authMethod: String? = nil, authProvider: String? = nil, clientIpHash: String? = nil, clientIpMasked: String? = nil, clientIpRegion: String? = nil, createdAt: String? = nil, deviceFingerprintHash: String? = nil, deviceLabel: String? = nil, failureReasonCode: String? = nil, id: String? = nil, legalHold: Bool? = nil, loginResult: String? = nil, metadata: [String: String]? = nil, mfaVerified: Bool? = nil, occurredAt: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, riskLevel: String? = nil, sessionIdHash: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userAgentHash: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.authMethod = authMethod
        self.authProvider = authProvider
        self.clientIpHash = clientIpHash
        self.clientIpMasked = clientIpMasked
        self.clientIpRegion = clientIpRegion
        self.createdAt = createdAt
        self.deviceFingerprintHash = deviceFingerprintHash
        self.deviceLabel = deviceLabel
        self.failureReasonCode = failureReasonCode
        self.id = id
        self.legalHold = legalHold
        self.loginResult = loginResult
        self.metadata = metadata
        self.mfaVerified = mfaVerified
        self.occurredAt = occurredAt
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.riskLevel = riskLevel
        self.sessionIdHash = sessionIdHash
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userAgentHash = userAgentHash
        self.userId = userId
        self.uuid = uuid
    }
}

public struct IamUserPreferenceRecord: Codable {
    public let appearanceConfig: [String: String]?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultConsolePath: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let language: String?
    public let metadata: [String: String]?
    public let notificationPreferences: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let status: String?
    public let tenantId: String?
    public let themeMode: String?
    public let timezone: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(appearanceConfig: [String: String]? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultConsolePath: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, language: String? = nil, metadata: [String: String]? = nil, notificationPreferences: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, status: String? = nil, tenantId: String? = nil, themeMode: String? = nil, timezone: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.appearanceConfig = appearanceConfig
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultConsolePath = defaultConsolePath
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.language = language
        self.metadata = metadata
        self.notificationPreferences = notificationPreferences
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.status = status
        self.tenantId = tenantId
        self.themeMode = themeMode
        self.timezone = timezone
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct IamUserRecord: Codable {
    public let avatarUrl: String?
    public let createdAt: String?
    public let displayName: String?
    public let email: String?
    public let id: String?
    public let phone: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let username: String?


    public init(avatarUrl: String? = nil, createdAt: String? = nil, displayName: String? = nil, email: String? = nil, id: String? = nil, phone: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, username: String? = nil) {
        self.avatarUrl = avatarUrl
        self.createdAt = createdAt
        self.displayName = displayName
        self.email = email
        self.id = id
        self.phone = phone
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.username = username
    }
}

public struct IamUserResponse: Codable {
    public let avatarUrl: String?
    public let displayName: String?
    public let email: String?
    public let id: String?
    public let isVerified: Bool?
    public let language: String?
    public let lastLogin: String?
    public let lastLoginIp: String?
    public let passwordLastChanged: String?
    public let phone: String?
    public let registeredAt: String?
    public let status: String?
    public let thirdPartyBound: String?
    public let twoFactorEnabled: Bool?
    public let username: String?


    public init(avatarUrl: String? = nil, displayName: String? = nil, email: String? = nil, id: String? = nil, isVerified: Bool? = nil, language: String? = nil, lastLogin: String? = nil, lastLoginIp: String? = nil, passwordLastChanged: String? = nil, phone: String? = nil, registeredAt: String? = nil, status: String? = nil, thirdPartyBound: String? = nil, twoFactorEnabled: Bool? = nil, username: String? = nil) {
        self.avatarUrl = avatarUrl
        self.displayName = displayName
        self.email = email
        self.id = id
        self.isVerified = isVerified
        self.language = language
        self.lastLogin = lastLogin
        self.lastLoginIp = lastLoginIp
        self.passwordLastChanged = passwordLastChanged
        self.phone = phone
        self.registeredAt = registeredAt
        self.status = status
        self.thirdPartyBound = thirdPartyBound
        self.twoFactorEnabled = twoFactorEnabled
        self.username = username
    }
}

public struct IamUserRoleRecord: Codable {
    public let createdAt: String?
    public let id: String?
    public let organizationId: String?
    public let roleId: String?
    public let tenantId: String?
    public let userId: String?


    public init(createdAt: String? = nil, id: String? = nil, organizationId: String? = nil, roleId: String? = nil, tenantId: String? = nil, userId: String? = nil) {
        self.createdAt = createdAt
        self.id = id
        self.organizationId = organizationId
        self.roleId = roleId
        self.tenantId = tenantId
        self.userId = userId
    }
}

public struct IamUserSecuritySettingRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let lastLoginAt: String?
    public let lastLoginIpHash: String?
    public let metadata: [String: String]?
    public let mfaEnabled: Bool?
    public let mfaMethod: String?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let passwordLastChangedAt: String?
    public let securityLevel: String?
    public let status: String?
    public let tenantId: String?
    public let thirdPartyBoundSnapshot: [String: String]?
    public let trustedDeviceCount: Int?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, lastLoginAt: String? = nil, lastLoginIpHash: String? = nil, metadata: [String: String]? = nil, mfaEnabled: Bool? = nil, mfaMethod: String? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, passwordLastChangedAt: String? = nil, securityLevel: String? = nil, status: String? = nil, tenantId: String? = nil, thirdPartyBoundSnapshot: [String: String]? = nil, trustedDeviceCount: Int? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.lastLoginAt = lastLoginAt
        self.lastLoginIpHash = lastLoginIpHash
        self.metadata = metadata
        self.mfaEnabled = mfaEnabled
        self.mfaMethod = mfaMethod
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.passwordLastChangedAt = passwordLastChangedAt
        self.securityLevel = securityLevel
        self.status = status
        self.tenantId = tenantId
        self.thirdPartyBoundSnapshot = thirdPartyBoundSnapshot
        self.trustedDeviceCount = trustedDeviceCount
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct IamVerificationAttemptRecord: Codable {
    public let createdAt: String?
    public let deviceHash: String?
    public let failureReason: String?
    public let id: String?
    public let ipHash: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(createdAt: String? = nil, deviceHash: String? = nil, failureReason: String? = nil, id: String? = nil, ipHash: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.createdAt = createdAt
        self.deviceHash = deviceHash
        self.failureReason = failureReason
        self.id = id
        self.ipHash = ipHash
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct IamVerificationChallengeRecord: Codable {
    public let consumedAt: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let deliveryRequestId: String?
    public let id: String?
    public let lockedUntil: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let saltRef: String?
    public let status: String?
    public let targetMasked: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let verifiedAt: String?
    public let version: String?


    public init(consumedAt: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deliveryRequestId: String? = nil, id: String? = nil, lockedUntil: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, saltRef: String? = nil, status: String? = nil, targetMasked: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, verifiedAt: String? = nil, version: String? = nil) {
        self.consumedAt = consumedAt
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.deliveryRequestId = deliveryRequestId
        self.id = id
        self.lockedUntil = lockedUntil
        self.metadata = metadata
        self.organizationId = organizationId
        self.saltRef = saltRef
        self.status = status
        self.targetMasked = targetMasked
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.verifiedAt = verifiedAt
        self.version = version
    }
}

public struct IamVerificationCodeCreateRequest: Codable {
    public let scene: String?
    public let target: String?
    public let verifyType: String?


    public init(scene: String? = nil, target: String? = nil, verifyType: String? = nil) {
        self.scene = scene
        self.target = target
        self.verifyType = verifyType
    }
}

public struct IamVerificationCodeResponse: Codable {
    public let codeId: String?
    public let deliveryRequestId: String?
    public let expiresAt: String?


    public init(codeId: String? = nil, deliveryRequestId: String? = nil, expiresAt: String? = nil) {
        self.codeId = codeId
        self.deliveryRequestId = deliveryRequestId
        self.expiresAt = expiresAt
    }
}

public struct IamVerificationCodeVerifyRequest: Codable {
    public let code: String?
    public let codeId: String?
    public let scene: String?
    public let target: String?
    public let verifyType: String?


    public init(code: String? = nil, codeId: String? = nil, scene: String? = nil, target: String? = nil, verifyType: String? = nil) {
        self.code = code
        self.codeId = codeId
        self.scene = scene
        self.target = target
        self.verifyType = verifyType
    }
}

public struct IamVerificationCodeVerifyResponse: Codable {
    public let valid: Bool?
    public let verified: Bool?


    public init(valid: Bool? = nil, verified: Bool? = nil) {
        self.valid = valid
        self.verified = verified
    }
}

public struct IamVerificationPolicyRetrieveResult: Codable {
    public let code: String?
    public let data: AuthVerificationPolicy?
    public let msg: String?


    public init(code: String? = nil, data: AuthVerificationPolicy? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct IamVerificationScenePolicyRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let defaultChannel: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let sceneName: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, defaultChannel: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, sceneName: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultChannel = defaultChannel
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.sceneName = sceneName
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationChannelModelRecord: Codable {
    public let capability: String?
    public let catalogKey: String?
    public let channelId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultParameters: [String: String]?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let maxInputTokens: String?
    public let maxOutputTokens: String?
    public let metadata: [String: String]?
    public let model: String?
    public let modelAliases: [String: String]?
    public let modelId: String?
    public let organizationId: String?
    public let providerModel: String?
    public let status: String?
    public let supportsStreaming: Bool?
    public let supportsTools: Bool?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vendorCode: String?
    public let version: String?


    public init(capability: String? = nil, catalogKey: String? = nil, channelId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultParameters: [String: String]? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, maxInputTokens: String? = nil, maxOutputTokens: String? = nil, metadata: [String: String]? = nil, model: String? = nil, modelAliases: [String: String]? = nil, modelId: String? = nil, organizationId: String? = nil, providerModel: String? = nil, status: String? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vendorCode: String? = nil, version: String? = nil) {
        self.capability = capability
        self.catalogKey = catalogKey
        self.channelId = channelId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultParameters = defaultParameters
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.maxInputTokens = maxInputTokens
        self.maxOutputTokens = maxOutputTokens
        self.metadata = metadata
        self.model = model
        self.modelAliases = modelAliases
        self.modelId = modelId
        self.organizationId = organizationId
        self.providerModel = providerModel
        self.status = status
        self.supportsStreaming = supportsStreaming
        self.supportsTools = supportsTools
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.vendorCode = vendorCode
        self.version = version
    }
}

public struct IntegrationChannelRecord: Codable {
    public let accessType: String?
    public let accountId: String?
    public let baseUrl: String?
    public let capabilities: [String: String]?
    public let channelCode: String?
    public let circuitBreakerPolicy: [String: String]?
    public let consecutiveErrorCount: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let environment: String?
    public let healthStatus: String?
    public let id: String?
    public let lastLatencyMs: Int?
    public let metadata: [String: String]?
    public let modelMode: String?
    public let name: String?
    public let organizationId: String?
    public let priority: Int?
    public let protocol_: String?
    public let providerCode: String?
    public let providerId: String?
    public let proxyId: String?
    public let region: String?
    public let retryPolicy: [String: String]?
    public let rpmLimit: String?
    public let status: String?
    public let tenantId: String?
    public let timeoutMs: Int?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let weight: Int?


    public init(accessType: String? = nil, accountId: String? = nil, baseUrl: String? = nil, capabilities: [String: String]? = nil, channelCode: String? = nil, circuitBreakerPolicy: [String: String]? = nil, consecutiveErrorCount: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, environment: String? = nil, healthStatus: String? = nil, id: String? = nil, lastLatencyMs: Int? = nil, metadata: [String: String]? = nil, modelMode: String? = nil, name: String? = nil, organizationId: String? = nil, priority: Int? = nil, protocol_: String? = nil, providerCode: String? = nil, providerId: String? = nil, proxyId: String? = nil, region: String? = nil, retryPolicy: [String: String]? = nil, rpmLimit: String? = nil, status: String? = nil, tenantId: String? = nil, timeoutMs: Int? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.accountId = accountId
        self.baseUrl = baseUrl
        self.capabilities = capabilities
        self.channelCode = channelCode
        self.circuitBreakerPolicy = circuitBreakerPolicy
        self.consecutiveErrorCount = consecutiveErrorCount
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.environment = environment
        self.healthStatus = healthStatus
        self.id = id
        self.lastLatencyMs = lastLatencyMs
        self.metadata = metadata
        self.modelMode = modelMode
        self.name = name
        self.organizationId = organizationId
        self.priority = priority
        self.protocol_ = protocol_
        self.providerCode = providerCode
        self.providerId = providerId
        self.proxyId = proxyId
        self.region = region
        self.retryPolicy = retryPolicy
        self.rpmLimit = rpmLimit
        self.status = status
        self.tenantId = tenantId
        self.timeoutMs = timeoutMs
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.weight = weight
    }
}

public struct IntegrationProviderAccountRecord: Codable {
    public let accountCode: String?
    public let accountName: String?
    public let authConfig: [String: String]?
    public let authType: String?
    public let baseUrl: String?
    public let consecutiveErrorCount: String?
    public let createdAt: String?
    public let credentialProfile: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let externalAccountId: String?
    public let id: String?
    public let lastBalanceCheckedAt: String?
    public let lastRotatedAt: String?
    public let lastUsedAt: String?
    public let lastVerifiedAt: String?
    public let maskedLabel: String?
    public let metadata: [String: String]?
    public let nextRotateAt: String?
    public let organizationId: String?
    public let providerCode: String?
    public let providerId: String?
    public let quotaLimit: String?
    public let quotaUnit: String?
    public let quotaUsed: String?
    public let riskLevel: String?
    public let secretHash: String?
    public let secretRef: String?
    public let secretRotationPolicy: [String: String]?
    public let secretVersion: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let upstreamBalanceAmount: String?
    public let upstreamBalanceCurrency: String?
    public let uuid: String?
    public let version: String?


    public init(accountCode: String? = nil, accountName: String? = nil, authConfig: [String: String]? = nil, authType: String? = nil, baseUrl: String? = nil, consecutiveErrorCount: String? = nil, createdAt: String? = nil, credentialProfile: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, externalAccountId: String? = nil, id: String? = nil, lastBalanceCheckedAt: String? = nil, lastRotatedAt: String? = nil, lastUsedAt: String? = nil, lastVerifiedAt: String? = nil, maskedLabel: String? = nil, metadata: [String: String]? = nil, nextRotateAt: String? = nil, organizationId: String? = nil, providerCode: String? = nil, providerId: String? = nil, quotaLimit: String? = nil, quotaUnit: String? = nil, quotaUsed: String? = nil, riskLevel: String? = nil, secretHash: String? = nil, secretRef: String? = nil, secretRotationPolicy: [String: String]? = nil, secretVersion: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, upstreamBalanceAmount: String? = nil, upstreamBalanceCurrency: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.accountCode = accountCode
        self.accountName = accountName
        self.authConfig = authConfig
        self.authType = authType
        self.baseUrl = baseUrl
        self.consecutiveErrorCount = consecutiveErrorCount
        self.createdAt = createdAt
        self.credentialProfile = credentialProfile
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.externalAccountId = externalAccountId
        self.id = id
        self.lastBalanceCheckedAt = lastBalanceCheckedAt
        self.lastRotatedAt = lastRotatedAt
        self.lastUsedAt = lastUsedAt
        self.lastVerifiedAt = lastVerifiedAt
        self.maskedLabel = maskedLabel
        self.metadata = metadata
        self.nextRotateAt = nextRotateAt
        self.organizationId = organizationId
        self.providerCode = providerCode
        self.providerId = providerId
        self.quotaLimit = quotaLimit
        self.quotaUnit = quotaUnit
        self.quotaUsed = quotaUsed
        self.riskLevel = riskLevel
        self.secretHash = secretHash
        self.secretRef = secretRef
        self.secretRotationPolicy = secretRotationPolicy
        self.secretVersion = secretVersion
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.upstreamBalanceAmount = upstreamBalanceAmount
        self.upstreamBalanceCurrency = upstreamBalanceCurrency
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationProviderHealthSnapshotRecord: Codable {
    public let channelId: String?
    public let checkType: String?
    public let checkedAt: String?
    public let createdAt: String?
    public let errorCode: String?
    public let errorMessageMasked: String?
    public let healthStatus: String?
    public let httpStatus: Int?
    public let id: String?
    public let latencyMs: Int?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let providerAccountId: String?
    public let providerId: String?
    public let quotaSnapshot: [String: String]?
    public let requestId: String?
    public let retentionUntil: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(channelId: String? = nil, checkType: String? = nil, checkedAt: String? = nil, createdAt: String? = nil, errorCode: String? = nil, errorMessageMasked: String? = nil, healthStatus: String? = nil, httpStatus: Int? = nil, id: String? = nil, latencyMs: Int? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, providerAccountId: String? = nil, providerId: String? = nil, quotaSnapshot: [String: String]? = nil, requestId: String? = nil, retentionUntil: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.channelId = channelId
        self.checkType = checkType
        self.checkedAt = checkedAt
        self.createdAt = createdAt
        self.errorCode = errorCode
        self.errorMessageMasked = errorMessageMasked
        self.healthStatus = healthStatus
        self.httpStatus = httpStatus
        self.id = id
        self.latencyMs = latencyMs
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.providerAccountId = providerAccountId
        self.providerId = providerId
        self.quotaSnapshot = quotaSnapshot
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct IntegrationProviderInvoiceImportRecord: Codable {
    public let createdAt: String?
    public let currency: String?
    public let id: String?
    public let importNo: String?
    public let importStatus: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let periodEnd: String?
    public let periodStart: String?
    public let providerAccountId: String?
    public let providerCode: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let sourceFileRef: String?
    public let sourceHash: String?
    public let status: String?
    public let tenantId: String?
    public let totalAmount: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(createdAt: String? = nil, currency: String? = nil, id: String? = nil, importNo: String? = nil, importStatus: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, periodEnd: String? = nil, periodStart: String? = nil, providerAccountId: String? = nil, providerCode: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, sourceFileRef: String? = nil, sourceHash: String? = nil, status: String? = nil, tenantId: String? = nil, totalAmount: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.createdAt = createdAt
        self.currency = currency
        self.id = id
        self.importNo = importNo
        self.importStatus = importStatus
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.periodEnd = periodEnd
        self.periodStart = periodStart
        self.providerAccountId = providerAccountId
        self.providerCode = providerCode
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.sourceFileRef = sourceFileRef
        self.sourceHash = sourceHash
        self.status = status
        self.tenantId = tenantId
        self.totalAmount = totalAmount
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct IntegrationProviderInvoiceItemRecord: Codable {
    public let amount: String?
    public let billingMeterCode: String?
    public let createdAt: String?
    public let currency: String?
    public let id: String?
    public let importId: String?
    public let legalHold: Bool?
    public let matchStatus: String?
    public let metadata: [String: String]?
    public let model: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let providerRequestId: String?
    public let providerUsageId: String?
    public let quantity: String?
    public let rawPayloadHash: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(amount: String? = nil, billingMeterCode: String? = nil, createdAt: String? = nil, currency: String? = nil, id: String? = nil, importId: String? = nil, legalHold: Bool? = nil, matchStatus: String? = nil, metadata: [String: String]? = nil, model: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, providerRequestId: String? = nil, providerUsageId: String? = nil, quantity: String? = nil, rawPayloadHash: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.amount = amount
        self.billingMeterCode = billingMeterCode
        self.createdAt = createdAt
        self.currency = currency
        self.id = id
        self.importId = importId
        self.legalHold = legalHold
        self.matchStatus = matchStatus
        self.metadata = metadata
        self.model = model
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.providerRequestId = providerRequestId
        self.providerUsageId = providerUsageId
        self.quantity = quantity
        self.rawPayloadHash = rawPayloadHash
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct IntegrationProviderRecord: Codable {
    public let authType: String?
    public let baseUrl: String?
    public let capabilities: [String: String]?
    public let colorToken: String?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultVendorCode: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let displayName: String?
    public let docsUrl: String?
    public let iconUrl: String?
    public let id: String?
    public let integrationType: String?
    public let metadata: [String: String]?
    public let metadataSchemaVersion: String?
    public let organizationId: String?
    public let protocol_: String?
    public let providerCode: String?
    public let sortOrder: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let upstreamProviderCode: String?
    public let upstreamVendorCode: String?
    public let uuid: String?
    public let version: String?
    public let websiteUrl: String?


    public init(authType: String? = nil, baseUrl: String? = nil, capabilities: [String: String]? = nil, colorToken: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultVendorCode: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, displayName: String? = nil, docsUrl: String? = nil, iconUrl: String? = nil, id: String? = nil, integrationType: String? = nil, metadata: [String: String]? = nil, metadataSchemaVersion: String? = nil, organizationId: String? = nil, protocol_: String? = nil, providerCode: String? = nil, sortOrder: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, upstreamProviderCode: String? = nil, upstreamVendorCode: String? = nil, uuid: String? = nil, version: String? = nil, websiteUrl: String? = nil) {
        self.authType = authType
        self.baseUrl = baseUrl
        self.capabilities = capabilities
        self.colorToken = colorToken
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultVendorCode = defaultVendorCode
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.displayName = displayName
        self.docsUrl = docsUrl
        self.iconUrl = iconUrl
        self.id = id
        self.integrationType = integrationType
        self.metadata = metadata
        self.metadataSchemaVersion = metadataSchemaVersion
        self.organizationId = organizationId
        self.protocol_ = protocol_
        self.providerCode = providerCode
        self.sortOrder = sortOrder
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.upstreamProviderCode = upstreamProviderCode
        self.upstreamVendorCode = upstreamVendorCode
        self.uuid = uuid
        self.version = version
        self.websiteUrl = websiteUrl
    }
}

public struct IntegrationProxyRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let endpoint: String?
    public let healthStatus: String?
    public let id: String?
    public let lastCheckedAt: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let proxyCode: String?
    public let proxyType: String?
    public let region: String?
    public let secretHash: String?
    public let secretRef: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, endpoint: String? = nil, healthStatus: String? = nil, id: String? = nil, lastCheckedAt: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, proxyCode: String? = nil, proxyType: String? = nil, region: String? = nil, secretHash: String? = nil, secretRef: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.endpoint = endpoint
        self.healthStatus = healthStatus
        self.id = id
        self.lastCheckedAt = lastCheckedAt
        self.metadata = metadata
        self.organizationId = organizationId
        self.proxyCode = proxyCode
        self.proxyType = proxyType
        self.region = region
        self.secretHash = secretHash
        self.secretRef = secretRef
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationServiceProviderAccountBindingRecord: Codable {
    public let accountRole: String?
    public let assetType: String?
    public let commerceAccountId: String?
    public let createdAt: String?
    public let currency: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let serviceProviderId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(accountRole: String? = nil, assetType: String? = nil, commerceAccountId: String? = nil, createdAt: String? = nil, currency: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, serviceProviderId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.accountRole = accountRole
        self.assetType = assetType
        self.commerceAccountId = commerceAccountId
        self.createdAt = createdAt
        self.currency = currency
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.serviceProviderId = serviceProviderId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationServiceProviderClosureRecord: Codable {
    public let ancestorProviderId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let depth: Int?
    public let descendantProviderId: String?
    public let directEdgeId: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let path: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(ancestorProviderId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, depth: Int? = nil, descendantProviderId: String? = nil, directEdgeId: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, path: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.ancestorProviderId = ancestorProviderId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.depth = depth
        self.descendantProviderId = descendantProviderId
        self.directEdgeId = directEdgeId
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.path = path
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationServiceProviderContractRecord: Codable {
    public let buyerProviderId: String?
    public let contractFileRef: String?
    public let contractNo: String?
    public let contractType: String?
    public let createdAt: String?
    public let currentVersionId: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let edgeId: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let sellerProviderId: String?
    public let signedAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(buyerProviderId: String? = nil, contractFileRef: String? = nil, contractNo: String? = nil, contractType: String? = nil, createdAt: String? = nil, currentVersionId: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, edgeId: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, sellerProviderId: String? = nil, signedAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.buyerProviderId = buyerProviderId
        self.contractFileRef = contractFileRef
        self.contractNo = contractNo
        self.contractType = contractType
        self.createdAt = createdAt
        self.currentVersionId = currentVersionId
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.edgeId = edgeId
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.sellerProviderId = sellerProviderId
        self.signedAt = signedAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationServiceProviderContractVersionRecord: Codable {
    public let approvalStatus: String?
    public let approvedAt: String?
    public let approvedBy: String?
    public let contractId: String?
    public let contractPayload: [String: String]?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let publishedAt: String?
    public let requestedBy: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let versionHash: String?
    public let versionNo: Int?


    public init(approvalStatus: String? = nil, approvedAt: String? = nil, approvedBy: String? = nil, contractId: String? = nil, contractPayload: [String: String]? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, publishedAt: String? = nil, requestedBy: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, versionHash: String? = nil, versionNo: Int? = nil) {
        self.approvalStatus = approvalStatus
        self.approvedAt = approvedAt
        self.approvedBy = approvedBy
        self.contractId = contractId
        self.contractPayload = contractPayload
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.publishedAt = publishedAt
        self.requestedBy = requestedBy
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.versionHash = versionHash
        self.versionNo = versionNo
    }
}

public struct IntegrationServiceProviderEdgeRecord: Codable {
    public let buyerProviderId: String?
    public let contractNo: String?
    public let contractSnapshot: [String: String]?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let edgeNo: String?
    public let edgeType: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let sellerProviderId: String?
    public let settlementMode: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(buyerProviderId: String? = nil, contractNo: String? = nil, contractSnapshot: [String: String]? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, edgeNo: String? = nil, edgeType: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, sellerProviderId: String? = nil, settlementMode: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.buyerProviderId = buyerProviderId
        self.contractNo = contractNo
        self.contractSnapshot = contractSnapshot
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.edgeNo = edgeNo
        self.edgeType = edgeType
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.sellerProviderId = sellerProviderId
        self.settlementMode = settlementMode
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationServiceProviderFinanceProfileRecord: Codable {
    public let billingCycle: String?
    public let createdAt: String?
    public let creditLimitAmount: String?
    public let currency: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let invoiceTitleId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let paymentTermsDays: Int?
    public let serviceProviderId: String?
    public let settlementDay: Int?
    public let settlementMode: String?
    public let status: String?
    public let suspendThresholdAmount: String?
    public let taxProfileRef: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let warningThresholdAmount: String?


    public init(billingCycle: String? = nil, createdAt: String? = nil, creditLimitAmount: String? = nil, currency: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, invoiceTitleId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, paymentTermsDays: Int? = nil, serviceProviderId: String? = nil, settlementDay: Int? = nil, settlementMode: String? = nil, status: String? = nil, suspendThresholdAmount: String? = nil, taxProfileRef: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, warningThresholdAmount: String? = nil) {
        self.billingCycle = billingCycle
        self.createdAt = createdAt
        self.creditLimitAmount = creditLimitAmount
        self.currency = currency
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.invoiceTitleId = invoiceTitleId
        self.metadata = metadata
        self.organizationId = organizationId
        self.paymentTermsDays = paymentTermsDays
        self.serviceProviderId = serviceProviderId
        self.settlementDay = settlementDay
        self.settlementMode = settlementMode
        self.status = status
        self.suspendThresholdAmount = suspendThresholdAmount
        self.taxProfileRef = taxProfileRef
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.warningThresholdAmount = warningThresholdAmount
    }
}

public struct IntegrationServiceProviderMemberRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let memberUserId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let permissionPolicyId: String?
    public let roleCode: String?
    public let serviceProviderId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, memberUserId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, permissionPolicyId: String? = nil, roleCode: String? = nil, serviceProviderId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.memberUserId = memberUserId
        self.metadata = metadata
        self.organizationId = organizationId
        self.permissionPolicyId = permissionPolicyId
        self.roleCode = roleCode
        self.serviceProviderId = serviceProviderId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationServiceProviderPriceChangeRequestRecord: Codable {
    public let afterHash: String?
    public let approvalStatus: String?
    public let approvedBy: String?
    public let beforeHash: String?
    public let buyerProviderId: String?
    public let changeNo: String?
    public let changeType: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let draftPayload: [String: String]?
    public let effectiveFrom: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let publishedAt: String?
    public let requestedBy: String?
    public let sellerProviderId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(afterHash: String? = nil, approvalStatus: String? = nil, approvedBy: String? = nil, beforeHash: String? = nil, buyerProviderId: String? = nil, changeNo: String? = nil, changeType: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, draftPayload: [String: String]? = nil, effectiveFrom: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, publishedAt: String? = nil, requestedBy: String? = nil, sellerProviderId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.afterHash = afterHash
        self.approvalStatus = approvalStatus
        self.approvedBy = approvedBy
        self.beforeHash = beforeHash
        self.buyerProviderId = buyerProviderId
        self.changeNo = changeNo
        self.changeType = changeType
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.draftPayload = draftPayload
        self.effectiveFrom = effectiveFrom
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.publishedAt = publishedAt
        self.requestedBy = requestedBy
        self.sellerProviderId = sellerProviderId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationServiceProviderPricePlanRecord: Codable {
    public let baseAmountSource: String?
    public let buyerProviderId: String?
    public let createdAt: String?
    public let currency: String?
    public let dataScope: String?
    public let defaultMarkupAmount: String?
    public let defaultMultiplier: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let edgeId: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let fallbackMode: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let planCode: String?
    public let planName: String?
    public let pricingMode: String?
    public let sellerProviderId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(baseAmountSource: String? = nil, buyerProviderId: String? = nil, createdAt: String? = nil, currency: String? = nil, dataScope: String? = nil, defaultMarkupAmount: String? = nil, defaultMultiplier: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, edgeId: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, fallbackMode: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, planCode: String? = nil, planName: String? = nil, pricingMode: String? = nil, sellerProviderId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.baseAmountSource = baseAmountSource
        self.buyerProviderId = buyerProviderId
        self.createdAt = createdAt
        self.currency = currency
        self.dataScope = dataScope
        self.defaultMarkupAmount = defaultMarkupAmount
        self.defaultMultiplier = defaultMultiplier
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.edgeId = edgeId
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.fallbackMode = fallbackMode
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.planCode = planCode
        self.planName = planName
        self.pricingMode = pricingMode
        self.sellerProviderId = sellerProviderId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationServiceProviderPriceRuleRecord: Codable {
    public let billingMeterCode: String?
    public let buyerProviderId: String?
    public let catalogKey: String?
    public let channelId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let edgeId: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let metadata: [String: String]?
    public let minimumCharge: String?
    public let model: String?
    public let organizationId: String?
    public let pricePlanId: String?
    public let priority: Int?
    public let providerCode: String?
    public let roundingMode: String?
    public let sellerProviderId: String?
    public let status: String?
    public let tenantId: String?
    public let tokenKind: String?
    public let unitPrice: String?
    public let unitSize: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(billingMeterCode: String? = nil, buyerProviderId: String? = nil, catalogKey: String? = nil, channelId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, edgeId: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, metadata: [String: String]? = nil, minimumCharge: String? = nil, model: String? = nil, organizationId: String? = nil, pricePlanId: String? = nil, priority: Int? = nil, providerCode: String? = nil, roundingMode: String? = nil, sellerProviderId: String? = nil, status: String? = nil, tenantId: String? = nil, tokenKind: String? = nil, unitPrice: String? = nil, unitSize: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.billingMeterCode = billingMeterCode
        self.buyerProviderId = buyerProviderId
        self.catalogKey = catalogKey
        self.channelId = channelId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.edgeId = edgeId
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.metadata = metadata
        self.minimumCharge = minimumCharge
        self.model = model
        self.organizationId = organizationId
        self.pricePlanId = pricePlanId
        self.priority = priority
        self.providerCode = providerCode
        self.roundingMode = roundingMode
        self.sellerProviderId = sellerProviderId
        self.status = status
        self.tenantId = tenantId
        self.tokenKind = tokenKind
        self.unitPrice = unitPrice
        self.unitSize = unitSize
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationServiceProviderRecord: Codable {
    public let activatedAt: String?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultCurrency: String?
    public let defaultTimezone: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let displayName: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerOrganizationId: String?
    public let ownerTenantId: String?
    public let ownerUserId: String?
    public let providerNo: String?
    public let providerType: String?
    public let riskLevel: String?
    public let status: String?
    public let suspendedAt: String?
    public let suspendedReasonCode: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(activatedAt: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultCurrency: String? = nil, defaultTimezone: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, displayName: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerOrganizationId: String? = nil, ownerTenantId: String? = nil, ownerUserId: String? = nil, providerNo: String? = nil, providerType: String? = nil, riskLevel: String? = nil, status: String? = nil, suspendedAt: String? = nil, suspendedReasonCode: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.activatedAt = activatedAt
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultCurrency = defaultCurrency
        self.defaultTimezone = defaultTimezone
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.displayName = displayName
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerOrganizationId = ownerOrganizationId
        self.ownerTenantId = ownerTenantId
        self.ownerUserId = ownerUserId
        self.providerNo = providerNo
        self.providerType = providerType
        self.riskLevel = riskLevel
        self.status = status
        self.suspendedAt = suspendedAt
        self.suspendedReasonCode = suspendedReasonCode
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationServiceProviderSubjectBindingRecord: Codable {
    public let bindingPriority: Int?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let serviceProviderId: String?
    public let status: String?
    public let subjectCode: String?
    public let subjectId: String?
    public let subjectType: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(bindingPriority: Int? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, serviceProviderId: String? = nil, status: String? = nil, subjectCode: String? = nil, subjectId: String? = nil, subjectType: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.bindingPriority = bindingPriority
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.serviceProviderId = serviceProviderId
        self.status = status
        self.subjectCode = subjectCode
        self.subjectId = subjectId
        self.subjectType = subjectType
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct IntegrationWebhookEndpointRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let endpointCode: String?
    public let eventTypes: [String: String]?
    public let failureCount: String?
    public let id: String?
    public let lastFailureAt: String?
    public let lastSuccessAt: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let retryPolicy: [String: String]?
    public let secretHash: String?
    public let secretRef: String?
    public let signingAlg: String?
    public let status: String?
    public let targetUrl: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, endpointCode: String? = nil, eventTypes: [String: String]? = nil, failureCount: String? = nil, id: String? = nil, lastFailureAt: String? = nil, lastSuccessAt: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, retryPolicy: [String: String]? = nil, secretHash: String? = nil, secretRef: String? = nil, signingAlg: String? = nil, status: String? = nil, targetUrl: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.endpointCode = endpointCode
        self.eventTypes = eventTypes
        self.failureCount = failureCount
        self.id = id
        self.lastFailureAt = lastFailureAt
        self.lastSuccessAt = lastSuccessAt
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.retryPolicy = retryPolicy
        self.secretHash = secretHash
        self.secretRef = secretRef
        self.signingAlg = signingAlg
        self.status = status
        self.targetUrl = targetUrl
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct InvocationEventStreamsListResult: Codable {
    public let code: String?
    public let data: RuntimeEventListResponse?
    public let msg: String?


    public init(code: String? = nil, data: RuntimeEventListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InvocationEventsCreateResult: Codable {
    public let code: String?
    public let data: RuntimeEventResponse?
    public let msg: String?


    public init(code: String? = nil, data: RuntimeEventResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InvocationEventsListResult: Codable {
    public let code: String?
    public let data: RuntimeEventListResponse?
    public let msg: String?


    public init(code: String? = nil, data: RuntimeEventListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InvocationsCreateResult: Codable {
    public let code: String?
    public let data: RuntimeInvocationResponse?
    public let msg: String?


    public init(code: String? = nil, data: RuntimeInvocationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InvocationsListResult: Codable {
    public let code: String?
    public let data: RuntimeInvocationListResponse?
    public let msg: String?


    public init(code: String? = nil, data: RuntimeInvocationListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InvocationsRetrieveResult: Codable {
    public let code: String?
    public let data: RuntimeInvocationItem?
    public let msg: String?


    public init(code: String? = nil, data: RuntimeInvocationItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InvocationsSubmitResult: Codable {
    public let code: String?
    public let data: RuntimeInvocationResponse?
    public let msg: String?


    public init(code: String? = nil, data: RuntimeInvocationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InvoicesCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InvoicesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InvoicesRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsBenefitsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsCurrentRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsCurrentStatusRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPackageGroupsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPackageGroupsPackagesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPackageGroupsRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPackagesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPackagesRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPlansListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPointsBalanceRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPointsDailyRewardsCreateRequest: Codable {

    public init() {}
}

public struct MembershipsPointsDailyRewardsCreateResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPointsDailyRewardsStatusRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPointsHistoryListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPrivilegesSpeedUpsCreateRequest: Codable {

    public init() {}
}

public struct MembershipsPrivilegesSpeedUpsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPrivilegesUsageRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPurchasesCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPurchasesRenewResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPurchasesUpgradeResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MemoryEntryCreateRequest: Codable {
    public let confidenceScore: String?
    public let content: String?
    public let contentJson: [String: String]?
    public let importanceScore: String?
    public let memoryType: String?
    public let metadata: [String: String]?
    public let sensitivityLevel: String?
    public let sourceConversationId: String?
    public let sourceInvocationId: String?
    public let sourceItemId: String?
    public let sourceKind: String?
    public let sourceTurnId: String?
    public let status: String?
    public let subjectKey: String?
    public let subjectType: String?
    public let trustLevel: String?


    public init(confidenceScore: String? = nil, content: String? = nil, contentJson: [String: String]? = nil, importanceScore: String? = nil, memoryType: String? = nil, metadata: [String: String]? = nil, sensitivityLevel: String? = nil, sourceConversationId: String? = nil, sourceInvocationId: String? = nil, sourceItemId: String? = nil, sourceKind: String? = nil, sourceTurnId: String? = nil, status: String? = nil, subjectKey: String? = nil, subjectType: String? = nil, trustLevel: String? = nil) {
        self.confidenceScore = confidenceScore
        self.content = content
        self.contentJson = contentJson
        self.importanceScore = importanceScore
        self.memoryType = memoryType
        self.metadata = metadata
        self.sensitivityLevel = sensitivityLevel
        self.sourceConversationId = sourceConversationId
        self.sourceInvocationId = sourceInvocationId
        self.sourceItemId = sourceItemId
        self.sourceKind = sourceKind
        self.sourceTurnId = sourceTurnId
        self.status = status
        self.subjectKey = subjectKey
        self.subjectType = subjectType
        self.trustLevel = trustLevel
    }
}

public struct MemoryEntryItem: Codable {
    public let confidenceScore: String?
    public let content: String?
    public let createdAt: String?
    public let id: String?
    public let importanceScore: String?
    public let memoryType: String?
    public let recallCount: Int?
    public let sensitivityLevel: String?
    public let sourceConversationId: String?
    public let sourceInvocationId: String?
    public let sourceItemId: String?
    public let sourceKind: String?
    public let sourceTurnId: String?
    public let spaceId: String?
    public let status: String?
    public let subjectKey: String?
    public let subjectType: String?
    public let trustLevel: String?
    public let updatedAt: String?


    public init(confidenceScore: String? = nil, content: String? = nil, createdAt: String? = nil, id: String? = nil, importanceScore: String? = nil, memoryType: String? = nil, recallCount: Int? = nil, sensitivityLevel: String? = nil, sourceConversationId: String? = nil, sourceInvocationId: String? = nil, sourceItemId: String? = nil, sourceKind: String? = nil, sourceTurnId: String? = nil, spaceId: String? = nil, status: String? = nil, subjectKey: String? = nil, subjectType: String? = nil, trustLevel: String? = nil, updatedAt: String? = nil) {
        self.confidenceScore = confidenceScore
        self.content = content
        self.createdAt = createdAt
        self.id = id
        self.importanceScore = importanceScore
        self.memoryType = memoryType
        self.recallCount = recallCount
        self.sensitivityLevel = sensitivityLevel
        self.sourceConversationId = sourceConversationId
        self.sourceInvocationId = sourceInvocationId
        self.sourceItemId = sourceItemId
        self.sourceKind = sourceKind
        self.sourceTurnId = sourceTurnId
        self.spaceId = spaceId
        self.status = status
        self.subjectKey = subjectKey
        self.subjectType = subjectType
        self.trustLevel = trustLevel
        self.updatedAt = updatedAt
    }
}

public struct MemoryEntryListResponse: Codable {
    public let items: [MemoryEntryItem]?


    public init(items: [MemoryEntryItem]? = nil) {
        self.items = items
    }
}

public struct MemoryEntryResponse: Codable {
    public let item: MemoryEntryItem?


    public init(item: MemoryEntryItem? = nil) {
        self.item = item
    }
}

public struct MemorySpaceCreateRequest: Codable {
    public let autoExtractEnabled: Bool?
    public let autoRecallEnabled: Bool?
    public let maxInjectedTokens: Int?
    public let memoryEnabled: Bool?
    public let metadata: [String: String]?
    public let ownerId: String?
    public let ownerType: String?
    public let retentionPolicy: [String: String]?
    public let reviewRequired: Bool?
    public let sensitivityPolicy: [String: String]?
    public let spaceType: String?
    public let title: String?


    public init(autoExtractEnabled: Bool? = nil, autoRecallEnabled: Bool? = nil, maxInjectedTokens: Int? = nil, memoryEnabled: Bool? = nil, metadata: [String: String]? = nil, ownerId: String? = nil, ownerType: String? = nil, retentionPolicy: [String: String]? = nil, reviewRequired: Bool? = nil, sensitivityPolicy: [String: String]? = nil, spaceType: String? = nil, title: String? = nil) {
        self.autoExtractEnabled = autoExtractEnabled
        self.autoRecallEnabled = autoRecallEnabled
        self.maxInjectedTokens = maxInjectedTokens
        self.memoryEnabled = memoryEnabled
        self.metadata = metadata
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.retentionPolicy = retentionPolicy
        self.reviewRequired = reviewRequired
        self.sensitivityPolicy = sensitivityPolicy
        self.spaceType = spaceType
        self.title = title
    }
}

public struct MemorySpaceItem: Codable {
    public let autoExtractEnabled: Bool?
    public let autoRecallEnabled: Bool?
    public let createdAt: String?
    public let entryCount: Int?
    public let id: String?
    public let maxInjectedTokens: Int?
    public let memoryEnabled: Bool?
    public let ownerId: String?
    public let ownerType: String?
    public let reviewRequired: Bool?
    public let spaceType: String?
    public let status: String?
    public let title: String?
    public let updatedAt: String?


    public init(autoExtractEnabled: Bool? = nil, autoRecallEnabled: Bool? = nil, createdAt: String? = nil, entryCount: Int? = nil, id: String? = nil, maxInjectedTokens: Int? = nil, memoryEnabled: Bool? = nil, ownerId: String? = nil, ownerType: String? = nil, reviewRequired: Bool? = nil, spaceType: String? = nil, status: String? = nil, title: String? = nil, updatedAt: String? = nil) {
        self.autoExtractEnabled = autoExtractEnabled
        self.autoRecallEnabled = autoRecallEnabled
        self.createdAt = createdAt
        self.entryCount = entryCount
        self.id = id
        self.maxInjectedTokens = maxInjectedTokens
        self.memoryEnabled = memoryEnabled
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.reviewRequired = reviewRequired
        self.spaceType = spaceType
        self.status = status
        self.title = title
        self.updatedAt = updatedAt
    }
}

public struct MemorySpaceListResponse: Codable {
    public let items: [MemorySpaceItem]?


    public init(items: [MemorySpaceItem]? = nil) {
        self.items = items
    }
}

public struct MemorySpaceResponse: Codable {
    public let item: MemorySpaceItem?


    public init(item: MemorySpaceItem? = nil) {
        self.item = item
    }
}

public struct MessagingDeliveryEventRecord: Codable {
    public let createdAt: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let providerMessageId: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let sendAttemptId: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(createdAt: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, providerMessageId: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, sendAttemptId: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.createdAt = createdAt
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.providerMessageId = providerMessageId
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.sendAttemptId = sendAttemptId
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct MessagingProviderCapabilityRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let lastVerifiedAt: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, lastVerifiedAt: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.lastVerifiedAt = lastVerifiedAt
        self.metadata = metadata
        self.organizationId = organizationId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct MessagingRateLimitBucketRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let lastEventAt: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, lastEventAt: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.lastEventAt = lastEventAt
        self.metadata = metadata
        self.organizationId = organizationId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct MessagingRouteRuleRecord: Codable {
    public let appId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let effectiveFrom: String?
    public let effectiveTo: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(appId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, effectiveFrom: String? = nil, effectiveTo: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.appId = appId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.effectiveFrom = effectiveFrom
        self.effectiveTo = effectiveTo
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct MessagingRouteRuleTargetRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let senderIdentityId: String?
    public let status: String?
    public let templateBindingId: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, senderIdentityId: String? = nil, status: String? = nil, templateBindingId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.senderIdentityId = senderIdentityId
        self.status = status
        self.templateBindingId = templateBindingId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct MessagingSendAttemptRecord: Codable {
    public let createdAt: String?
    public let failureCode: String?
    public let failureMessageMasked: String?
    public let httpStatus: Int?
    public let id: String?
    public let latencyMs: Int?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let providerMessageId: String?
    public let providerRequestId: String?
    public let providerStatus: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let retryAfterAt: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(createdAt: String? = nil, failureCode: String? = nil, failureMessageMasked: String? = nil, httpStatus: Int? = nil, id: String? = nil, latencyMs: Int? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, providerMessageId: String? = nil, providerRequestId: String? = nil, providerStatus: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, retryAfterAt: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.createdAt = createdAt
        self.failureCode = failureCode
        self.failureMessageMasked = failureMessageMasked
        self.httpStatus = httpStatus
        self.id = id
        self.latencyMs = latencyMs
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.providerMessageId = providerMessageId
        self.providerRequestId = providerRequestId
        self.providerStatus = providerStatus
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.retryAfterAt = retryAfterAt
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct MessagingSendRequestRecord: Codable {
    public let acceptedAt: String?
    public let appId: String?
    public let createdAt: String?
    public let deliveredAt: String?
    public let expiresAt: String?
    public let failedAt: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let requestId: String?
    public let resolvedProviderAccountId: String?
    public let resolvedRouteRuleId: String?
    public let resolvedSenderIdentityId: String?
    public let retentionUntil: String?
    public let scheduledAt: String?
    public let sentAt: String?
    public let status: String?
    public let targetMasked: String?
    public let templateVariantId: String?
    public let templateVersionId: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(acceptedAt: String? = nil, appId: String? = nil, createdAt: String? = nil, deliveredAt: String? = nil, expiresAt: String? = nil, failedAt: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, requestId: String? = nil, resolvedProviderAccountId: String? = nil, resolvedRouteRuleId: String? = nil, resolvedSenderIdentityId: String? = nil, retentionUntil: String? = nil, scheduledAt: String? = nil, sentAt: String? = nil, status: String? = nil, targetMasked: String? = nil, templateVariantId: String? = nil, templateVersionId: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.acceptedAt = acceptedAt
        self.appId = appId
        self.createdAt = createdAt
        self.deliveredAt = deliveredAt
        self.expiresAt = expiresAt
        self.failedAt = failedAt
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.requestId = requestId
        self.resolvedProviderAccountId = resolvedProviderAccountId
        self.resolvedRouteRuleId = resolvedRouteRuleId
        self.resolvedSenderIdentityId = resolvedSenderIdentityId
        self.retentionUntil = retentionUntil
        self.scheduledAt = scheduledAt
        self.sentAt = sentAt
        self.status = status
        self.targetMasked = targetMasked
        self.templateVariantId = templateVariantId
        self.templateVersionId = templateVersionId
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct MessagingSenderIdentityRecord: Codable {
    public let countryCode: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let displayName: String?
    public let domainName: String?
    public let fromEmail: String?
    public let fromName: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let rejectionReason: String?
    public let replyTo: String?
    public let senderId: String?
    public let signName: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let verifiedAt: String?
    public let version: String?


    public init(countryCode: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, displayName: String? = nil, domainName: String? = nil, fromEmail: String? = nil, fromName: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, rejectionReason: String? = nil, replyTo: String? = nil, senderId: String? = nil, signName: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, verifiedAt: String? = nil, version: String? = nil) {
        self.countryCode = countryCode
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.displayName = displayName
        self.domainName = domainName
        self.fromEmail = fromEmail
        self.fromName = fromName
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.rejectionReason = rejectionReason
        self.replyTo = replyTo
        self.senderId = senderId
        self.signName = signName
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.verifiedAt = verifiedAt
        self.version = version
    }
}

public struct MessagingSuppressionRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let endsAt: String?
    public let id: String?
    public let metadata: [String: String]?
    public let note: String?
    public let organizationId: String?
    public let status: String?
    public let targetMasked: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, endsAt: String? = nil, id: String? = nil, metadata: [String: String]? = nil, note: String? = nil, organizationId: String? = nil, status: String? = nil, targetMasked: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.endsAt = endsAt
        self.id = id
        self.metadata = metadata
        self.note = note
        self.organizationId = organizationId
        self.status = status
        self.targetMasked = targetMasked
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct MessagingTemplateBindingRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let lastSyncedAt: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let providerTemplateVersion: String?
    public let rejectionReason: String?
    public let status: String?
    public let syncPayloadHash: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, lastSyncedAt: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, providerTemplateVersion: String? = nil, rejectionReason: String? = nil, status: String? = nil, syncPayloadHash: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.lastSyncedAt = lastSyncedAt
        self.metadata = metadata
        self.organizationId = organizationId
        self.providerTemplateVersion = providerTemplateVersion
        self.rejectionReason = rejectionReason
        self.status = status
        self.syncPayloadHash = syncPayloadHash
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct MessagingTemplateRecord: Codable {
    public let createdAt: String?
    public let currentVersionId: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let description: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerAppId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, currentVersionId: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerAppId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.currentVersionId = currentVersionId
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.description = description
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerAppId = ownerAppId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct MessagingTemplateVariantRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let lengthLimit: Int?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, lengthLimit: Int? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.lengthLimit = lengthLimit
        self.metadata = metadata
        self.organizationId = organizationId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct MessagingTemplateVersionRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let htmlTemplate: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let publishedAt: String?
    public let retiredAt: String?
    public let status: String?
    public let subjectTemplate: String?
    public let tenantId: String?
    public let textTemplate: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, htmlTemplate: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, publishedAt: String? = nil, retiredAt: String? = nil, status: String? = nil, subjectTemplate: String? = nil, tenantId: String? = nil, textTemplate: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.htmlTemplate = htmlTemplate
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.publishedAt = publishedAt
        self.retiredAt = retiredAt
        self.status = status
        self.subjectTemplate = subjectTemplate
        self.tenantId = tenantId
        self.textTemplate = textTemplate
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct ModelRankingHistoryEntry: Codable {
    public let catalogKey: String?
    public let color: String?
    public let model: String?
    public let rank: Int?
    public let volume: Int?


    public init(catalogKey: String? = nil, color: String? = nil, model: String? = nil, rank: Int? = nil, volume: Int? = nil) {
        self.catalogKey = catalogKey
        self.color = color
        self.model = model
        self.rank = rank
        self.volume = volume
    }
}

public struct ModelRankingHistoryPoint: Codable {
    public let date: String?
    public let entries: [ModelRankingHistoryEntry]?
    public let index: Int?


    public init(date: String? = nil, entries: [ModelRankingHistoryEntry]? = nil, index: Int? = nil) {
        self.date = date
        self.entries = entries
        self.index = index
    }
}

public struct ModelRankingItem: Codable {
    public let baseVolume: Int?
    public let color: String?
    public let contextSize: String?
    public let cost: Double?
    public let costIndicator: Int?
    public let currency: String?
    public let id: String?
    public let isNew: Bool?
    public let latency: Int?
    public let license: String?
    public let modality: String?
    public let name: String?
    public let prevRank: Int?
    public let pricing: String?
    public let rank: Int?
    public let requests: Int?
    public let strengths: [String]?
    public let tokens: Int?
    public let trendScore: Double?
    public let vendor: String?
    public let vendorCode: String?
    public let winRate: Double?


    public init(baseVolume: Int? = nil, color: String? = nil, contextSize: String? = nil, cost: Double? = nil, costIndicator: Int? = nil, currency: String? = nil, id: String? = nil, isNew: Bool? = nil, latency: Int? = nil, license: String? = nil, modality: String? = nil, name: String? = nil, prevRank: Int? = nil, pricing: String? = nil, rank: Int? = nil, requests: Int? = nil, strengths: [String]? = nil, tokens: Int? = nil, trendScore: Double? = nil, vendor: String? = nil, vendorCode: String? = nil, winRate: Double? = nil) {
        self.baseVolume = baseVolume
        self.color = color
        self.contextSize = contextSize
        self.cost = cost
        self.costIndicator = costIndicator
        self.currency = currency
        self.id = id
        self.isNew = isNew
        self.latency = latency
        self.license = license
        self.modality = modality
        self.name = name
        self.prevRank = prevRank
        self.pricing = pricing
        self.rank = rank
        self.requests = requests
        self.strengths = strengths
        self.tokens = tokens
        self.trendScore = trendScore
        self.vendor = vendor
        self.vendorCode = vendorCode
        self.winRate = winRate
    }
}

public struct ModelRankingsListResult: Codable {
    public let code: String?
    public let data: ModelRankingsSnapshot?
    public let msg: String?


    public init(code: String? = nil, data: ModelRankingsSnapshot? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ModelRankingsSnapshot: Codable {
    public let history: [ModelRankingHistoryPoint]?
    public let items: [ModelRankingItem]?
    public let source: ModelRankingsSource?


    public init(history: [ModelRankingHistoryPoint]? = nil, items: [ModelRankingItem]? = nil, source: ModelRankingsSource? = nil) {
        self.history = history
        self.items = items
        self.source = source
    }
}

public struct ModelRankingsSource: Codable {
    public let cacheMaxAgeSeconds: Int?
    public let generatedAt: String?
    public let nextRefreshAt: String?
    public let observedAt: String?
    public let rankScope: String?
    public let refreshIntervalSeconds: Int?
    public let snapshotDate: String?
    public let snapshotPeriod: String?
    public let sourceDescription: String?
    public let sourceLabel: String?
    public let sourceTables: [String]?
    public let windowEnd: String?
    public let windowStart: String?


    public init(cacheMaxAgeSeconds: Int? = nil, generatedAt: String? = nil, nextRefreshAt: String? = nil, observedAt: String? = nil, rankScope: String? = nil, refreshIntervalSeconds: Int? = nil, snapshotDate: String? = nil, snapshotPeriod: String? = nil, sourceDescription: String? = nil, sourceLabel: String? = nil, sourceTables: [String]? = nil, windowEnd: String? = nil, windowStart: String? = nil) {
        self.cacheMaxAgeSeconds = cacheMaxAgeSeconds
        self.generatedAt = generatedAt
        self.nextRefreshAt = nextRefreshAt
        self.observedAt = observedAt
        self.rankScope = rankScope
        self.refreshIntervalSeconds = refreshIntervalSeconds
        self.snapshotDate = snapshotDate
        self.snapshotPeriod = snapshotPeriod
        self.sourceDescription = sourceDescription
        self.sourceLabel = sourceLabel
        self.sourceTables = sourceTables
        self.windowEnd = windowEnd
        self.windowStart = windowStart
    }
}

public struct ModelVendorsListResult: Codable {
    public let code: String?
    public let data: RankingVendorOptionsResponse?
    public let msg: String?


    public init(code: String? = nil, data: RankingVendorOptionsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ModelsListResult: Codable {
    public let code: String?
    public let data: AppModelCatalogResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppModelCatalogResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct NoData: Codable {

    public init() {}
}

public struct NotificationItem: Codable {
    public let actionUrl: String?
    public let appId: String?
    public let archived: Bool?
    public let content: String?
    public let desc: String?
    public let id: String?
    public let popupSeen: Bool?
    public let read: Bool?
    public let showAsPopup: Bool?
    public let time: String?
    public let title: String?
    public let type: String?


    public init(actionUrl: String? = nil, appId: String? = nil, archived: Bool? = nil, content: String? = nil, desc: String? = nil, id: String? = nil, popupSeen: Bool? = nil, read: Bool? = nil, showAsPopup: Bool? = nil, time: String? = nil, title: String? = nil, type: String? = nil) {
        self.actionUrl = actionUrl
        self.appId = appId
        self.archived = archived
        self.content = content
        self.desc = desc
        self.id = id
        self.popupSeen = popupSeen
        self.read = read
        self.showAsPopup = showAsPopup
        self.time = time
        self.title = title
        self.type = type
    }
}

public struct NotificationMutationResponse: Codable {
    public let state: String?
    public let updated: Bool?


    public init(state: String? = nil, updated: Bool? = nil) {
        self.state = state
        self.updated = updated
    }
}

public struct NotificationsAcknowledgeCreateResult: Codable {
    public let code: String?
    public let data: NotificationMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: NotificationMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct NotificationsListResult: Codable {
    public let code: String?
    public let data: NotificationsResponse?
    public let msg: String?


    public init(code: String? = nil, data: NotificationsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct NotificationsPopupSeenCreateResult: Codable {
    public let code: String?
    public let data: NotificationMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: NotificationMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct NotificationsResponse: Codable {
    public let items: [NotificationItem]?


    public init(items: [NotificationItem]? = nil) {
        self.items = items
    }
}

public struct OauthAuthorizationUrlsRetrieveResult: Codable {
    public let code: String?
    public let data: IamOauthAuthorizationUrlResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamOauthAuthorizationUrlResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct OauthSessionsCreateResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ObjectBlobRecord: Codable {
    public let bucketId: String?
    public let contentSha256: String?
    public let contentType: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let encryptionMode: String?
    public let id: String?
    public let kmsKeyRef: String?
    public let lastVerifiedAt: String?
    public let metadata: [String: String]?
    public let objectKey: String?
    public let organizationId: String?
    public let originalFilename: String?
    public let ownerId: String?
    public let ownerType: String?
    public let providerId: String?
    public let retentionUntil: String?
    public let status: String?
    public let storageClass: String?
    public let storageEtag: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?
    public let versionId: String?


    public init(bucketId: String? = nil, contentSha256: String? = nil, contentType: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, encryptionMode: String? = nil, id: String? = nil, kmsKeyRef: String? = nil, lastVerifiedAt: String? = nil, metadata: [String: String]? = nil, objectKey: String? = nil, organizationId: String? = nil, originalFilename: String? = nil, ownerId: String? = nil, ownerType: String? = nil, providerId: String? = nil, retentionUntil: String? = nil, status: String? = nil, storageClass: String? = nil, storageEtag: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil, versionId: String? = nil) {
        self.bucketId = bucketId
        self.contentSha256 = contentSha256
        self.contentType = contentType
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.encryptionMode = encryptionMode
        self.id = id
        self.kmsKeyRef = kmsKeyRef
        self.lastVerifiedAt = lastVerifiedAt
        self.metadata = metadata
        self.objectKey = objectKey
        self.organizationId = organizationId
        self.originalFilename = originalFilename
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.providerId = providerId
        self.retentionUntil = retentionUntil
        self.status = status
        self.storageClass = storageClass
        self.storageEtag = storageEtag
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
        self.versionId = versionId
    }
}

public struct ObjectBucketRecord: Codable {
    public let bucketName: String?
    public let bucketRegion: String?
    public let createdAt: String?
    public let dataResidencyRegion: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let idempotencyKey: String?
    public let kmsKeyRef: String?
    public let logicalScope: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let providerId: String?
    public let requestId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(bucketName: String? = nil, bucketRegion: String? = nil, createdAt: String? = nil, dataResidencyRegion: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, idempotencyKey: String? = nil, kmsKeyRef: String? = nil, logicalScope: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, providerId: String? = nil, requestId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.bucketName = bucketName
        self.bucketRegion = bucketRegion
        self.createdAt = createdAt
        self.dataResidencyRegion = dataResidencyRegion
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.idempotencyKey = idempotencyKey
        self.kmsKeyRef = kmsKeyRef
        self.logicalScope = logicalScope
        self.metadata = metadata
        self.organizationId = organizationId
        self.providerId = providerId
        self.requestId = requestId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct ObjectProviderRecord: Codable {
    public let createdAt: String?
    public let credentialRef: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let endpointUrl: String?
    public let id: String?
    public let idempotencyKey: String?
    public let lastHealthCheckAt: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let providerCode: String?
    public let providerType: String?
    public let region: String?
    public let requestId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, credentialRef: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, endpointUrl: String? = nil, id: String? = nil, idempotencyKey: String? = nil, lastHealthCheckAt: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, providerCode: String? = nil, providerType: String? = nil, region: String? = nil, requestId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.credentialRef = credentialRef
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.endpointUrl = endpointUrl
        self.id = id
        self.idempotencyKey = idempotencyKey
        self.lastHealthCheckAt = lastHealthCheckAt
        self.metadata = metadata
        self.organizationId = organizationId
        self.providerCode = providerCode
        self.providerType = providerType
        self.region = region
        self.requestId = requestId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct ObjectTagRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let objectBlobId: String?
    public let organizationId: String?
    public let status: String?
    public let tagKey: String?
    public let tagValue: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, objectBlobId: String? = nil, organizationId: String? = nil, status: String? = nil, tagKey: String? = nil, tagValue: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.objectBlobId = objectBlobId
        self.organizationId = organizationId
        self.status = status
        self.tagKey = tagKey
        self.tagValue = tagValue
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct OpenPlatformAccountRecord: Codable {
    public let accountKey: String?
    public let accountType: String?
    public let aesKeyRef: String?
    public let appId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultEntryId: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let provider: String?
    public let qrDefault: Bool?
    public let secretRef: String?
    public let status: String?
    public let tenantId: String?
    public let tokenRef: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(accountKey: String? = nil, accountType: String? = nil, aesKeyRef: String? = nil, appId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultEntryId: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, provider: String? = nil, qrDefault: Bool? = nil, secretRef: String? = nil, status: String? = nil, tenantId: String? = nil, tokenRef: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.accountKey = accountKey
        self.accountType = accountType
        self.aesKeyRef = aesKeyRef
        self.appId = appId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultEntryId = defaultEntryId
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.provider = provider
        self.qrDefault = qrDefault
        self.secretRef = secretRef
        self.status = status
        self.tenantId = tenantId
        self.tokenRef = tokenRef
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct OpenPlatformEntryRecord: Codable {
    public let accountId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let entryKey: String?
    public let entryType: String?
    public let entryUrl: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(accountId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, entryKey: String? = nil, entryType: String? = nil, entryUrl: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.accountId = accountId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.entryKey = entryKey
        self.entryType = entryType
        self.entryUrl = entryUrl
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct OpenPlatformManifestRecord: Codable {
    public let accountType: String?
    public let callbackSchema: [String: String]?
    public let capabilitySchema: [String: String]?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let entrySchema: [String: String]?
    public let id: String?
    public let manifestKey: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let provider: String?
    public let sortOrder: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(accountType: String? = nil, callbackSchema: [String: String]? = nil, capabilitySchema: [String: String]? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, entrySchema: [String: String]? = nil, id: String? = nil, manifestKey: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, provider: String? = nil, sortOrder: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.accountType = accountType
        self.callbackSchema = callbackSchema
        self.capabilitySchema = capabilitySchema
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.entrySchema = entrySchema
        self.id = id
        self.manifestKey = manifestKey
        self.metadata = metadata
        self.organizationId = organizationId
        self.provider = provider
        self.sortOrder = sortOrder
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct OpenPlatformPayBindingRecord: Codable {
    public let accountId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let mode: String?
    public let organizationId: String?
    public let paymentAccountId: String?
    public let paymentChannelId: String?
    public let scene: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(accountId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, mode: String? = nil, organizationId: String? = nil, paymentAccountId: String? = nil, paymentChannelId: String? = nil, scene: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.accountId = accountId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.mode = mode
        self.organizationId = organizationId
        self.paymentAccountId = paymentAccountId
        self.paymentChannelId = paymentChannelId
        self.scene = scene
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct OpenPlatformProviderRecord: Codable {
    public let capabilities: [String: String]?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let docsUrl: String?
    public let iconUrl: String?
    public let id: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let provider: String?
    public let sortOrder: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let websiteUrl: String?


    public init(capabilities: [String: String]? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, docsUrl: String? = nil, iconUrl: String? = nil, id: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, provider: String? = nil, sortOrder: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, websiteUrl: String? = nil) {
        self.capabilities = capabilities
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.docsUrl = docsUrl
        self.iconUrl = iconUrl
        self.id = id
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.provider = provider
        self.sortOrder = sortOrder
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.websiteUrl = websiteUrl
    }
}

public struct OpenPlatformQrAuthPasswordCreateRequest: Codable {
    public let channel: String?
    public let confirmPassword: String?
    public let email: String?
    public let password: String?
    public let phone: String?
    public let username: String?
    public let verificationCode: String?


    public init(channel: String? = nil, confirmPassword: String? = nil, email: String? = nil, password: String? = nil, phone: String? = nil, username: String? = nil, verificationCode: String? = nil) {
        self.channel = channel
        self.confirmPassword = confirmPassword
        self.email = email
        self.password = password
        self.phone = phone
        self.username = username
        self.verificationCode = verificationCode
    }
}

public struct OpenPlatformQrAuthScanCreateRequest: Codable {
    public let accountId: String?
    public let entryId: String?
    public let externalUserId: String?
    public let ipHash: String?
    public let scanSource: String?
    public let userAgent: String?


    public init(accountId: String? = nil, entryId: String? = nil, externalUserId: String? = nil, ipHash: String? = nil, scanSource: String? = nil, userAgent: String? = nil) {
        self.accountId = accountId
        self.entryId = entryId
        self.externalUserId = externalUserId
        self.ipHash = ipHash
        self.scanSource = scanSource
        self.userAgent = userAgent
    }
}

public struct OpenPlatformQrAuthScanResponse: Codable {
    public let accountId: String?
    public let createdAt: String?
    public let entryId: String?
    public let externalUserId: String?
    public let id: String?
    public let ipHash: String?
    public let scanSource: String?
    public let sessionId: String?
    public let sessionKey: String?
    public let userAgent: String?


    public init(accountId: String? = nil, createdAt: String? = nil, entryId: String? = nil, externalUserId: String? = nil, id: String? = nil, ipHash: String? = nil, scanSource: String? = nil, sessionId: String? = nil, sessionKey: String? = nil, userAgent: String? = nil) {
        self.accountId = accountId
        self.createdAt = createdAt
        self.entryId = entryId
        self.externalUserId = externalUserId
        self.id = id
        self.ipHash = ipHash
        self.scanSource = scanSource
        self.sessionId = sessionId
        self.sessionKey = sessionKey
        self.userAgent = userAgent
    }
}

public struct OpenPlatformQrAuthSessionCreateRequest: Codable {
    public let purpose: String?


    public init(purpose: String? = nil) {
        self.purpose = purpose
    }
}

public struct OpenPlatformQrAuthSessionResponse: Codable {
    public let completedAt: String?
    public let createdAt: String?
    public let defaultAccountId: String?
    public let defaultAccountType: String?
    public let defaultEntryId: String?
    public let defaultProvider: String?
    public let expiresAt: String?
    public let fallbackUrl: String?
    public let id: String?
    public let purpose: String?
    public let qrContent: [String: Any]?
    public let scannedAt: String?
    public let session: IamSessionResponse?
    public let sessionKey: String?
    public let status: String?
    public let token: IamSessionResponse?
    public let updatedAt: String?
    public let userInfo: IamUserResponse?


    public init(completedAt: String? = nil, createdAt: String? = nil, defaultAccountId: String? = nil, defaultAccountType: String? = nil, defaultEntryId: String? = nil, defaultProvider: String? = nil, expiresAt: String? = nil, fallbackUrl: String? = nil, id: String? = nil, purpose: String? = nil, qrContent: [String: Any]? = nil, scannedAt: String? = nil, session: IamSessionResponse? = nil, sessionKey: String? = nil, status: String? = nil, token: IamSessionResponse? = nil, updatedAt: String? = nil, userInfo: IamUserResponse? = nil) {
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.defaultAccountId = defaultAccountId
        self.defaultAccountType = defaultAccountType
        self.defaultEntryId = defaultEntryId
        self.defaultProvider = defaultProvider
        self.expiresAt = expiresAt
        self.fallbackUrl = fallbackUrl
        self.id = id
        self.purpose = purpose
        self.qrContent = qrContent
        self.scannedAt = scannedAt
        self.session = session
        self.sessionKey = sessionKey
        self.status = status
        self.token = token
        self.updatedAt = updatedAt
        self.userInfo = userInfo
    }
}

public struct OpsAlertEventRecord: Codable {
    public let alertNo: String?
    public let alertStatus: String?
    public let createdAt: String?
    public let firstSeenAt: String?
    public let id: String?
    public let lastSeenAt: String?
    public let legalHold: Bool?
    public let message: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let requestId: String?
    public let resolvedAt: String?
    public let resolvedBy: String?
    public let retentionUntil: String?
    public let severity: String?
    public let source: String?
    public let status: String?
    public let tenantId: String?
    public let title: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(alertNo: String? = nil, alertStatus: String? = nil, createdAt: String? = nil, firstSeenAt: String? = nil, id: String? = nil, lastSeenAt: String? = nil, legalHold: Bool? = nil, message: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, requestId: String? = nil, resolvedAt: String? = nil, resolvedBy: String? = nil, retentionUntil: String? = nil, severity: String? = nil, source: String? = nil, status: String? = nil, tenantId: String? = nil, title: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.alertNo = alertNo
        self.alertStatus = alertStatus
        self.createdAt = createdAt
        self.firstSeenAt = firstSeenAt
        self.id = id
        self.lastSeenAt = lastSeenAt
        self.legalHold = legalHold
        self.message = message
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.requestId = requestId
        self.resolvedAt = resolvedAt
        self.resolvedBy = resolvedBy
        self.retentionUntil = retentionUntil
        self.severity = severity
        self.source = source
        self.status = status
        self.tenantId = tenantId
        self.title = title
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct OpsAuditLogRecord: Codable {
    public let action: String?
    public let afterHash: String?
    public let approvalId: String?
    public let beforeHash: String?
    public let changeSummary: [String: String]?
    public let clientIpHash: String?
    public let createdAt: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let operatorId: String?
    public let operatorNameSnapshot: String?
    public let operatorType: String?
    public let organizationId: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let riskLevel: String?
    public let targetId: String?
    public let targetType: String?
    public let targetUuid: String?
    public let tenantId: String?
    public let traceId: String?
    public let userAgentHash: String?
    public let uuid: String?


    public init(action: String? = nil, afterHash: String? = nil, approvalId: String? = nil, beforeHash: String? = nil, changeSummary: [String: String]? = nil, clientIpHash: String? = nil, createdAt: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, operatorId: String? = nil, operatorNameSnapshot: String? = nil, operatorType: String? = nil, organizationId: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, riskLevel: String? = nil, targetId: String? = nil, targetType: String? = nil, targetUuid: String? = nil, tenantId: String? = nil, traceId: String? = nil, userAgentHash: String? = nil, uuid: String? = nil) {
        self.action = action
        self.afterHash = afterHash
        self.approvalId = approvalId
        self.beforeHash = beforeHash
        self.changeSummary = changeSummary
        self.clientIpHash = clientIpHash
        self.createdAt = createdAt
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.operatorId = operatorId
        self.operatorNameSnapshot = operatorNameSnapshot
        self.operatorType = operatorType
        self.organizationId = organizationId
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.riskLevel = riskLevel
        self.targetId = targetId
        self.targetType = targetType
        self.targetUuid = targetUuid
        self.tenantId = tenantId
        self.traceId = traceId
        self.userAgentHash = userAgentHash
        self.uuid = uuid
    }
}

public struct OpsConfigSnapshotRecord: Codable {
    public let configHash: String?
    public let configPayload: [String: String]?
    public let configScope: String?
    public let configType: String?
    public let createdAt: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let publishedAt: String?
    public let publishedBy: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let rollbackFromSnapshotId: String?
    public let snapshotNo: String?
    public let sourceIds: [String: String]?
    public let sourceTable: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(configHash: String? = nil, configPayload: [String: String]? = nil, configScope: String? = nil, configType: String? = nil, createdAt: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, publishedAt: String? = nil, publishedBy: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, rollbackFromSnapshotId: String? = nil, snapshotNo: String? = nil, sourceIds: [String: String]? = nil, sourceTable: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.configHash = configHash
        self.configPayload = configPayload
        self.configScope = configScope
        self.configType = configType
        self.createdAt = createdAt
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.publishedAt = publishedAt
        self.publishedBy = publishedBy
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.rollbackFromSnapshotId = rollbackFromSnapshotId
        self.snapshotNo = snapshotNo
        self.sourceIds = sourceIds
        self.sourceTable = sourceTable
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct OpsGatewayHeartbeatRecord: Codable {
    public let activeConnections: String?
    public let cpuPercent: String?
    public let createdAt: String?
    public let diskPercent: String?
    public let heartbeatAt: String?
    public let id: String?
    public let instanceId: String?
    public let legalHold: Bool?
    public let memoryPercent: String?
    public let metadata: [String: String]?
    public let networkInBytes: String?
    public let networkOutBytes: String?
    public let openFileCount: String?
    public let organizationId: String?
    public let payload: [String: String]?
    public let payloadHash: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let status: String?
    public let tenantId: String?
    public let threadCount: String?
    public let traceId: String?
    public let uptimeSeconds: String?
    public let userId: String?
    public let uuid: String?


    public init(activeConnections: String? = nil, cpuPercent: String? = nil, createdAt: String? = nil, diskPercent: String? = nil, heartbeatAt: String? = nil, id: String? = nil, instanceId: String? = nil, legalHold: Bool? = nil, memoryPercent: String? = nil, metadata: [String: String]? = nil, networkInBytes: String? = nil, networkOutBytes: String? = nil, openFileCount: String? = nil, organizationId: String? = nil, payload: [String: String]? = nil, payloadHash: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, status: String? = nil, tenantId: String? = nil, threadCount: String? = nil, traceId: String? = nil, uptimeSeconds: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.activeConnections = activeConnections
        self.cpuPercent = cpuPercent
        self.createdAt = createdAt
        self.diskPercent = diskPercent
        self.heartbeatAt = heartbeatAt
        self.id = id
        self.instanceId = instanceId
        self.legalHold = legalHold
        self.memoryPercent = memoryPercent
        self.metadata = metadata
        self.networkInBytes = networkInBytes
        self.networkOutBytes = networkOutBytes
        self.openFileCount = openFileCount
        self.organizationId = organizationId
        self.payload = payload
        self.payloadHash = payloadHash
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.status = status
        self.tenantId = tenantId
        self.threadCount = threadCount
        self.traceId = traceId
        self.uptimeSeconds = uptimeSeconds
        self.userId = userId
        self.uuid = uuid
    }
}

public struct OpsGatewayInstanceRecord: Codable {
    public let cell: String?
    public let configHash: String?
    public let containerIdHash: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let deploymentMode: String?
    public let desktopDeviceHash: String?
    public let healthStatus: String?
    public let hostName: String?
    public let id: String?
    public let instanceCode: String?
    public let ipAddressHash: String?
    public let ipAddressMasked: String?
    public let lastHeartbeatAt: String?
    public let metadata: [String: String]?
    public let nodeName: String?
    public let orchestrator: String?
    public let organizationId: String?
    public let podName: String?
    public let region: String?
    public let runtimeType: String?
    public let startedAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let versionName: String?


    public init(cell: String? = nil, configHash: String? = nil, containerIdHash: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deploymentMode: String? = nil, desktopDeviceHash: String? = nil, healthStatus: String? = nil, hostName: String? = nil, id: String? = nil, instanceCode: String? = nil, ipAddressHash: String? = nil, ipAddressMasked: String? = nil, lastHeartbeatAt: String? = nil, metadata: [String: String]? = nil, nodeName: String? = nil, orchestrator: String? = nil, organizationId: String? = nil, podName: String? = nil, region: String? = nil, runtimeType: String? = nil, startedAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, versionName: String? = nil) {
        self.cell = cell
        self.configHash = configHash
        self.containerIdHash = containerIdHash
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.deploymentMode = deploymentMode
        self.desktopDeviceHash = desktopDeviceHash
        self.healthStatus = healthStatus
        self.hostName = hostName
        self.id = id
        self.instanceCode = instanceCode
        self.ipAddressHash = ipAddressHash
        self.ipAddressMasked = ipAddressMasked
        self.lastHeartbeatAt = lastHeartbeatAt
        self.metadata = metadata
        self.nodeName = nodeName
        self.orchestrator = orchestrator
        self.organizationId = organizationId
        self.podName = podName
        self.region = region
        self.runtimeType = runtimeType
        self.startedAt = startedAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.versionName = versionName
    }
}

public struct OpsInboxEventRecord: Codable {
    public let consumerName: String?
    public let createdAt: String?
    public let eventType: String?
    public let eventVersion: Int?
    public let failureReason: String?
    public let id: String?
    public let legalHold: Bool?
    public let messageId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let processStatus: String?
    public let processedAt: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let retryCount: Int?
    public let sourceSystem: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(consumerName: String? = nil, createdAt: String? = nil, eventType: String? = nil, eventVersion: Int? = nil, failureReason: String? = nil, id: String? = nil, legalHold: Bool? = nil, messageId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, processStatus: String? = nil, processedAt: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, retryCount: Int? = nil, sourceSystem: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.consumerName = consumerName
        self.createdAt = createdAt
        self.eventType = eventType
        self.eventVersion = eventVersion
        self.failureReason = failureReason
        self.id = id
        self.legalHold = legalHold
        self.messageId = messageId
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.processStatus = processStatus
        self.processedAt = processedAt
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.retryCount = retryCount
        self.sourceSystem = sourceSystem
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct OpsJobExecutionRecord: Codable {
    public let createdAt: String?
    public let durationMs: String?
    public let endedAt: String?
    public let executionStatus: String?
    public let failureCount: String?
    public let failureReason: String?
    public let id: String?
    public let jobName: String?
    public let jobType: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payload: [String: String]?
    public let payloadHash: String?
    public let processedCount: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let startedAt: String?
    public let status: String?
    public let successCount: String?
    public let tenantId: String?
    public let traceId: String?
    public let triggerType: String?
    public let userId: String?
    public let uuid: String?


    public init(createdAt: String? = nil, durationMs: String? = nil, endedAt: String? = nil, executionStatus: String? = nil, failureCount: String? = nil, failureReason: String? = nil, id: String? = nil, jobName: String? = nil, jobType: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payload: [String: String]? = nil, payloadHash: String? = nil, processedCount: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, startedAt: String? = nil, status: String? = nil, successCount: String? = nil, tenantId: String? = nil, traceId: String? = nil, triggerType: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.createdAt = createdAt
        self.durationMs = durationMs
        self.endedAt = endedAt
        self.executionStatus = executionStatus
        self.failureCount = failureCount
        self.failureReason = failureReason
        self.id = id
        self.jobName = jobName
        self.jobType = jobType
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payload = payload
        self.payloadHash = payloadHash
        self.processedCount = processedCount
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.startedAt = startedAt
        self.status = status
        self.successCount = successCount
        self.tenantId = tenantId
        self.traceId = traceId
        self.triggerType = triggerType
        self.userId = userId
        self.uuid = uuid
    }
}

public struct OpsMetricSnapshotRecord: Codable {
    public let createdAt: String?
    public let dimensionKey: String?
    public let dimensionValue: String?
    public let id: String?
    public let metadata: [String: String]?
    public let metricName: String?
    public let metricPeriod: String?
    public let metricScope: String?
    public let metricUnit: String?
    public let metricValue: String?
    public let organizationId: String?
    public let payload: [String: String]?
    public let periodEnd: String?
    public let periodStart: String?
    public let rebuildVersion: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?


    public init(createdAt: String? = nil, dimensionKey: String? = nil, dimensionValue: String? = nil, id: String? = nil, metadata: [String: String]? = nil, metricName: String? = nil, metricPeriod: String? = nil, metricScope: String? = nil, metricUnit: String? = nil, metricValue: String? = nil, organizationId: String? = nil, payload: [String: String]? = nil, periodEnd: String? = nil, periodStart: String? = nil, rebuildVersion: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil) {
        self.createdAt = createdAt
        self.dimensionKey = dimensionKey
        self.dimensionValue = dimensionValue
        self.id = id
        self.metadata = metadata
        self.metricName = metricName
        self.metricPeriod = metricPeriod
        self.metricScope = metricScope
        self.metricUnit = metricUnit
        self.metricValue = metricValue
        self.organizationId = organizationId
        self.payload = payload
        self.periodEnd = periodEnd
        self.periodStart = periodStart
        self.rebuildVersion = rebuildVersion
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
    }
}

public struct OpsNotificationDeliveryRecord: Codable {
    public let archivedAt: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let deliveredAt: String?
    public let deliveryChannel: String?
    public let deliveryStatus: String?
    public let failureCode: String?
    public let id: String?
    public let messageId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let popupSeenAt: String?
    public let readAt: String?
    public let retryCount: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(archivedAt: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deliveredAt: String? = nil, deliveryChannel: String? = nil, deliveryStatus: String? = nil, failureCode: String? = nil, id: String? = nil, messageId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, popupSeenAt: String? = nil, readAt: String? = nil, retryCount: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.archivedAt = archivedAt
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.deliveredAt = deliveredAt
        self.deliveryChannel = deliveryChannel
        self.deliveryStatus = deliveryStatus
        self.failureCode = failureCode
        self.id = id
        self.messageId = messageId
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.popupSeenAt = popupSeenAt
        self.readAt = readAt
        self.retryCount = retryCount
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct OpsNotificationMessageRecord: Codable {
    public let actionUrl: String?
    public let appId: String?
    public let content: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let expireAt: String?
    public let id: String?
    public let messageCode: String?
    public let messageType: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let publishedAt: String?
    public let severity: String?
    public let status: String?
    public let summary: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(actionUrl: String? = nil, appId: String? = nil, content: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, expireAt: String? = nil, id: String? = nil, messageCode: String? = nil, messageType: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, publishedAt: String? = nil, severity: String? = nil, status: String? = nil, summary: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.actionUrl = actionUrl
        self.appId = appId
        self.content = content
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.expireAt = expireAt
        self.id = id
        self.messageCode = messageCode
        self.messageType = messageType
        self.metadata = metadata
        self.organizationId = organizationId
        self.publishedAt = publishedAt
        self.severity = severity
        self.status = status
        self.summary = summary
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct OpsNotificationPreferenceRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct OpsNotificationRecipientRecord: Codable {
    public let appId: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let recipientRoleCode: String?
    public let recipientUserId: String?
    public let recipientValue: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(appId: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, recipientRoleCode: String? = nil, recipientUserId: String? = nil, recipientValue: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.appId = appId
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.recipientRoleCode = recipientRoleCode
        self.recipientUserId = recipientUserId
        self.recipientValue = recipientValue
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct OpsOutboxEventRecord: Codable {
    public let aggregateId: String?
    public let aggregateType: String?
    public let aggregateUuid: String?
    public let createdAt: String?
    public let eventId: String?
    public let eventPayload: [String: String]?
    public let eventType: String?
    public let eventVersion: Int?
    public let failureReason: String?
    public let headers: [String: String]?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let nextRetryAt: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let publishStatus: String?
    public let publishedAt: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let retryCount: Int?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(aggregateId: String? = nil, aggregateType: String? = nil, aggregateUuid: String? = nil, createdAt: String? = nil, eventId: String? = nil, eventPayload: [String: String]? = nil, eventType: String? = nil, eventVersion: Int? = nil, failureReason: String? = nil, headers: [String: String]? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, nextRetryAt: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, publishStatus: String? = nil, publishedAt: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, retryCount: Int? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.aggregateId = aggregateId
        self.aggregateType = aggregateType
        self.aggregateUuid = aggregateUuid
        self.createdAt = createdAt
        self.eventId = eventId
        self.eventPayload = eventPayload
        self.eventType = eventType
        self.eventVersion = eventVersion
        self.failureReason = failureReason
        self.headers = headers
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.nextRetryAt = nextRetryAt
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.publishStatus = publishStatus
        self.publishedAt = publishedAt
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.retryCount = retryCount
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct OpsReferralStatSnapshotRecord: Codable {
    public let createdAt: String?
    public let currency: String?
    public let directInvitedCount: String?
    public let id: String?
    public let invitationCode: String?
    public let invitationCodeId: String?
    public let inviteLink: String?
    public let inviterEmailSnapshot: String?
    public let inviterNameSnapshot: String?
    public let inviterUserId: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let paidInviteeCount: String?
    public let periodEnd: String?
    public let periodStart: String?
    public let rebuildVersion: String?
    public let rewardAwardedAmount: String?
    public let rewardPendingAmount: String?
    public let secondaryInvitedCount: String?
    public let snapshotAt: String?
    public let snapshotPeriod: String?
    public let sourceId: String?
    public let sourceType: String?
    public let sourceVersion: String?
    public let status: String?
    public let tenantId: String?
    public let totalInvitedCount: String?
    public let totalRevenueAmount: String?
    public let updatedAt: String?
    public let uuid: String?


    public init(createdAt: String? = nil, currency: String? = nil, directInvitedCount: String? = nil, id: String? = nil, invitationCode: String? = nil, invitationCodeId: String? = nil, inviteLink: String? = nil, inviterEmailSnapshot: String? = nil, inviterNameSnapshot: String? = nil, inviterUserId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, paidInviteeCount: String? = nil, periodEnd: String? = nil, periodStart: String? = nil, rebuildVersion: String? = nil, rewardAwardedAmount: String? = nil, rewardPendingAmount: String? = nil, secondaryInvitedCount: String? = nil, snapshotAt: String? = nil, snapshotPeriod: String? = nil, sourceId: String? = nil, sourceType: String? = nil, sourceVersion: String? = nil, status: String? = nil, tenantId: String? = nil, totalInvitedCount: String? = nil, totalRevenueAmount: String? = nil, updatedAt: String? = nil, uuid: String? = nil) {
        self.createdAt = createdAt
        self.currency = currency
        self.directInvitedCount = directInvitedCount
        self.id = id
        self.invitationCode = invitationCode
        self.invitationCodeId = invitationCodeId
        self.inviteLink = inviteLink
        self.inviterEmailSnapshot = inviterEmailSnapshot
        self.inviterNameSnapshot = inviterNameSnapshot
        self.inviterUserId = inviterUserId
        self.metadata = metadata
        self.organizationId = organizationId
        self.paidInviteeCount = paidInviteeCount
        self.periodEnd = periodEnd
        self.periodStart = periodStart
        self.rebuildVersion = rebuildVersion
        self.rewardAwardedAmount = rewardAwardedAmount
        self.rewardPendingAmount = rewardPendingAmount
        self.secondaryInvitedCount = secondaryInvitedCount
        self.snapshotAt = snapshotAt
        self.snapshotPeriod = snapshotPeriod
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.sourceVersion = sourceVersion
        self.status = status
        self.tenantId = tenantId
        self.totalInvitedCount = totalInvitedCount
        self.totalRevenueAmount = totalRevenueAmount
        self.updatedAt = updatedAt
        self.uuid = uuid
    }
}

public struct OrdersCancellationsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct OrdersEventsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct OrdersListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct OrdersRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PasswordResetRequestsCreateResult: Codable {
    public let code: String?
    public let data: IamPasswordResetRequestResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamPasswordResetRequestResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PasswordResetsCreateResult: Codable {
    public let code: String?
    public let data: NoData?
    public let msg: String?


    public init(code: String? = nil, data: NoData? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsAttemptsRetrieveResult: Codable {
    public let code: String?
    public let data: CommercePaymentAttemptResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentAttemptResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsIntentsAttemptsCreateResult: Codable {
    public let code: String?
    public let data: CommercePaymentAttemptResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentAttemptResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsIntentsCreateResult: Codable {
    public let code: String?
    public let data: CommercePaymentIntentResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentIntentResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsIntentsRetrieveResult: Codable {
    public let code: String?
    public let data: CommercePaymentIntentResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentIntentResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsMethodsListResult: Codable {
    public let code: String?
    public let data: CommercePaymentMethodListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentMethodListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PlusAgentSkillPackageRecord: Codable {
    public let categoryId: String?
    public let coverImage: String?
    public let description: String?
    public let icon: String?
    public let latestPublishedAt: String?
    public let summary: String?
    public let userId: String?


    public init(categoryId: String? = nil, coverImage: String? = nil, description: String? = nil, icon: String? = nil, latestPublishedAt: String? = nil, summary: String? = nil, userId: String? = nil) {
        self.categoryId = categoryId
        self.coverImage = coverImage
        self.description = description
        self.icon = icon
        self.latestPublishedAt = latestPublishedAt
        self.summary = summary
        self.userId = userId
    }
}

public struct PlusAgentSkillRecord: Codable {
    public let categoryId: String?
    public let coverImage: String?
    public let description: String?
    public let documentationUrl: String?
    public let entrypoint: String?
    public let homepageUrl: String?
    public let icon: String?
    public let latestPublishedAt: String?
    public let licenseName: String?
    public let manifestUrl: String?
    public let packageId: String?
    public let price: String?
    public let provider: String?
    public let repositoryUrl: String?
    public let reviewComment: String?
    public let reviewedAt: String?
    public let reviewedBy: String?
    public let runtime: String?
    public let summary: String?
    public let userId: String?
    public let version: String?
    public let versionName: String?


    public init(categoryId: String? = nil, coverImage: String? = nil, description: String? = nil, documentationUrl: String? = nil, entrypoint: String? = nil, homepageUrl: String? = nil, icon: String? = nil, latestPublishedAt: String? = nil, licenseName: String? = nil, manifestUrl: String? = nil, packageId: String? = nil, price: String? = nil, provider: String? = nil, repositoryUrl: String? = nil, reviewComment: String? = nil, reviewedAt: String? = nil, reviewedBy: String? = nil, runtime: String? = nil, summary: String? = nil, userId: String? = nil, version: String? = nil, versionName: String? = nil) {
        self.categoryId = categoryId
        self.coverImage = coverImage
        self.description = description
        self.documentationUrl = documentationUrl
        self.entrypoint = entrypoint
        self.homepageUrl = homepageUrl
        self.icon = icon
        self.latestPublishedAt = latestPublishedAt
        self.licenseName = licenseName
        self.manifestUrl = manifestUrl
        self.packageId = packageId
        self.price = price
        self.provider = provider
        self.repositoryUrl = repositoryUrl
        self.reviewComment = reviewComment
        self.reviewedAt = reviewedAt
        self.reviewedBy = reviewedBy
        self.runtime = runtime
        self.summary = summary
        self.userId = userId
        self.version = version
        self.versionName = versionName
    }
}

public struct PlusApiResult: Codable {
    public let code: String?
    public let data: NoData?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: NoData? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct PlusAppRecord: Codable {
    public let accessUrl: String?
    public let appType: String?
    public let bundleId: String?
    public let description: String?
    public let downloadUrl: String?
    public let icon: [String: String]?
    public let iconUrl: String?
    public let installConfig: [String: String]?
    public let installPlatforms: [String: String]?
    public let installSkill: [String: String]?
    public let packageName: String?
    public let platforms: [String: String]?
    public let projectId: String?
    public let releaseNotes: [String: String]?
    public let resourceList: [String: String]?
    public let storeUrl: String?
    public let userId: String?
    public let version: String?


    public init(accessUrl: String? = nil, appType: String? = nil, bundleId: String? = nil, description: String? = nil, downloadUrl: String? = nil, icon: [String: String]? = nil, iconUrl: String? = nil, installConfig: [String: String]? = nil, installPlatforms: [String: String]? = nil, installSkill: [String: String]? = nil, packageName: String? = nil, platforms: [String: String]? = nil, projectId: String? = nil, releaseNotes: [String: String]? = nil, resourceList: [String: String]? = nil, storeUrl: String? = nil, userId: String? = nil, version: String? = nil) {
        self.accessUrl = accessUrl
        self.appType = appType
        self.bundleId = bundleId
        self.description = description
        self.downloadUrl = downloadUrl
        self.icon = icon
        self.iconUrl = iconUrl
        self.installConfig = installConfig
        self.installPlatforms = installPlatforms
        self.installSkill = installSkill
        self.packageName = packageName
        self.platforms = platforms
        self.projectId = projectId
        self.releaseNotes = releaseNotes
        self.resourceList = resourceList
        self.storeUrl = storeUrl
        self.userId = userId
        self.version = version
    }
}

public struct PlusCardRecord: Codable {

    public init() {}
}

public struct PlusCardTemplateRecord: Codable {

    public init() {}
}

public struct PlusCategoryRecord: Codable {
    public let code: String?
    public let description: String?
    public let groupName: String?
    public let icon: String?
    public let parentId: String?
    public let path: String?
    public let shopId: String?


    public init(code: String? = nil, description: String? = nil, groupName: String? = nil, icon: String? = nil, parentId: String? = nil, path: String? = nil, shopId: String? = nil) {
        self.code = code
        self.description = description
        self.groupName = groupName
        self.icon = icon
        self.parentId = parentId
        self.path = path
        self.shopId = shopId
    }
}

public struct PlusChannelAccountRecord: Codable {

    public init() {}
}

public struct PlusChannelProxyRecord: Codable {

    public init() {}
}

public struct PlusChannelRecord: Codable {

    public init() {}
}

public struct PlusCommentsRecord: Codable {
    public let author: [String: String]?
    public let deviceInfo: String?
    public let ipAddress: String?
    public let parentId: String?
    public let path: String?
    public let userId: String?


    public init(author: [String: String]? = nil, deviceInfo: String? = nil, ipAddress: String? = nil, parentId: String? = nil, path: String? = nil, userId: String? = nil) {
        self.author = author
        self.deviceInfo = deviceInfo
        self.ipAddress = ipAddress
        self.parentId = parentId
        self.path = path
        self.userId = userId
    }
}

public struct PlusContentVoteRecord: Codable {
    public let clientIp: String?
    public let deviceInfo: String?
    public let source: String?
    public let userId: String?


    public init(clientIp: String? = nil, deviceInfo: String? = nil, source: String? = nil, userId: String? = nil) {
        self.clientIp = clientIp
        self.deviceInfo = deviceInfo
        self.source = source
        self.userId = userId
    }
}

public struct PlusDepartmentRecord: Codable {

    public init() {}
}

public struct PlusFavoriteRecord: Codable {
    public let folderId: String?
    public let image: [String: String]?
    public let lastViewedAt: String?
    public let remark: String?
    public let tags: String?
    public let title: String?
    public let userId: String?


    public init(folderId: String? = nil, image: [String: String]? = nil, lastViewedAt: String? = nil, remark: String? = nil, tags: String? = nil, title: String? = nil, userId: String? = nil) {
        self.folderId = folderId
        self.image = image
        self.lastViewedAt = lastViewedAt
        self.remark = remark
        self.tags = tags
        self.title = title
        self.userId = userId
    }
}

public struct PlusFeedsRecord: Codable {
    public let author: [String: String]?
    public let coverImages: [String: String]?
    public let publishTime: String?
    public let resourceList: [String: String]?
    public let source: String?
    public let sourceUrl: String?
    public let summary: String?
    public let tags: [String: String]?
    public let userId: String?


    public init(author: [String: String]? = nil, coverImages: [String: String]? = nil, publishTime: String? = nil, resourceList: [String: String]? = nil, source: String? = nil, sourceUrl: String? = nil, summary: String? = nil, tags: [String: String]? = nil, userId: String? = nil) {
        self.author = author
        self.coverImages = coverImages
        self.publishTime = publishTime
        self.resourceList = resourceList
        self.source = source
        self.sourceUrl = sourceUrl
        self.summary = summary
        self.tags = tags
        self.userId = userId
    }
}

public struct PlusInvitationCodeRecord: Codable {

    public init() {}
}

public struct PlusInvitationRelationRecord: Codable {

    public init() {}
}

public struct PlusMemberCardRecord: Codable {

    public init() {}
}

public struct PlusMemberLevelRecord: Codable {

    public init() {}
}

public struct PlusPartnerRecord: Codable {

    public init() {}
}

public struct PlusPositionRecord: Codable {

    public init() {}
}

public struct PlusUsageRecordRecord: Codable {

    public init() {}
}

public struct PlusUserAddressRecord: Codable {

    public init() {}
}

public struct PlusUserAgentSkillRecord: Codable {
    public let installedAt: String?
    public let lastEnabledAt: String?
    public let lastUsedAt: String?


    public init(installedAt: String? = nil, lastEnabledAt: String? = nil, lastUsedAt: String? = nil) {
        self.installedAt = installedAt
        self.lastEnabledAt = lastEnabledAt
        self.lastUsedAt = lastUsedAt
    }
}

public struct PlusUserCardRecord: Codable {

    public init() {}
}

public struct ProblemDetail: Codable {
    public let code: String?
    public let detail: String?
    public let errors: [FieldError]?
    public let instance: String?
    public let requestId: String?
    public let status: Int?
    public let title: String?
    public let traceId: String?
    public let type: String?


    public init(code: String? = nil, detail: String? = nil, errors: [FieldError]? = nil, instance: String? = nil, requestId: String? = nil, status: Int? = nil, title: String? = nil, traceId: String? = nil, type: String? = nil) {
        self.code = code
        self.detail = detail
        self.errors = errors
        self.instance = instance
        self.requestId = requestId
        self.status = status
        self.title = title
        self.traceId = traceId
        self.type = type
    }
}

public struct PromotionBudgetAccountRecord: Codable {
    public let budgetNo: String?
    public let budgetType: String?
    public let createdAt: String?
    public let createdBy: String?
    public let currencyCode: String?
    public let lockMode: String?
    public let offerId: String?
    public let offerVersionId: String?
    public let organizationId: String?
    public let overrunAmountMinor: String?
    public let plannedAmountMinor: String?
    public let status: String?
    public let stockId: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let updatedBy: String?


    public init(budgetNo: String? = nil, budgetType: String? = nil, createdAt: String? = nil, createdBy: String? = nil, currencyCode: String? = nil, lockMode: String? = nil, offerId: String? = nil, offerVersionId: String? = nil, organizationId: String? = nil, overrunAmountMinor: String? = nil, plannedAmountMinor: String? = nil, status: String? = nil, stockId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, updatedBy: String? = nil) {
        self.budgetNo = budgetNo
        self.budgetType = budgetType
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.currencyCode = currencyCode
        self.lockMode = lockMode
        self.offerId = offerId
        self.offerVersionId = offerVersionId
        self.organizationId = organizationId
        self.overrunAmountMinor = overrunAmountMinor
        self.plannedAmountMinor = plannedAmountMinor
        self.status = status
        self.stockId = stockId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.updatedBy = updatedBy
    }
}

public struct PromotionBudgetLedgerEntryRecord: Codable {
    public let applicationId: String?
    public let budgetAccountId: String?
    public let businessType: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let direction: String?
    public let idempotencyKey: String?
    public let ledgerNo: String?
    public let occurredAt: String?
    public let organizationId: String?
    public let requestNo: String?
    public let sourceId: String?
    public let sourceType: String?
    public let tenantId: String?


    public init(applicationId: String? = nil, budgetAccountId: String? = nil, businessType: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, direction: String? = nil, idempotencyKey: String? = nil, ledgerNo: String? = nil, occurredAt: String? = nil, organizationId: String? = nil, requestNo: String? = nil, sourceId: String? = nil, sourceType: String? = nil, tenantId: String? = nil) {
        self.applicationId = applicationId
        self.budgetAccountId = budgetAccountId
        self.businessType = businessType
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.direction = direction
        self.idempotencyKey = idempotencyKey
        self.ledgerNo = ledgerNo
        self.occurredAt = occurredAt
        self.organizationId = organizationId
        self.requestNo = requestNo
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.tenantId = tenantId
    }
}

public struct PromotionCodeRecord: Codable {
    public let activatedAt: String?
    public let activationStatus: String?
    public let canResend: Bool?
    public let cancelUntil: String?
    public let canceledAt: String?
    public let channelCode: String?
    public let claimCodeHash: String?
    public let claimCodeSuffix: String?
    public let codeNo: String?
    public let codeType: String?
    public let createdAt: String?
    public let createdBy: String?
    public let currencyCode: String?
    public let expiresAt: String?
    public let offerId: String?
    public let offerVersionId: String?
    public let organizationId: String?
    public let promotionCodeHash: String?
    public let promotionCodeLast4: String?
    public let startsAt: String?
    public let status: String?
    public let stockId: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let updatedBy: String?


    public init(activatedAt: String? = nil, activationStatus: String? = nil, canResend: Bool? = nil, cancelUntil: String? = nil, canceledAt: String? = nil, channelCode: String? = nil, claimCodeHash: String? = nil, claimCodeSuffix: String? = nil, codeNo: String? = nil, codeType: String? = nil, createdAt: String? = nil, createdBy: String? = nil, currencyCode: String? = nil, expiresAt: String? = nil, offerId: String? = nil, offerVersionId: String? = nil, organizationId: String? = nil, promotionCodeHash: String? = nil, promotionCodeLast4: String? = nil, startsAt: String? = nil, status: String? = nil, stockId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, updatedBy: String? = nil) {
        self.activatedAt = activatedAt
        self.activationStatus = activationStatus
        self.canResend = canResend
        self.cancelUntil = cancelUntil
        self.canceledAt = canceledAt
        self.channelCode = channelCode
        self.claimCodeHash = claimCodeHash
        self.claimCodeSuffix = claimCodeSuffix
        self.codeNo = codeNo
        self.codeType = codeType
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.currencyCode = currencyCode
        self.expiresAt = expiresAt
        self.offerId = offerId
        self.offerVersionId = offerVersionId
        self.organizationId = organizationId
        self.promotionCodeHash = promotionCodeHash
        self.promotionCodeLast4 = promotionCodeLast4
        self.startsAt = startsAt
        self.status = status
        self.stockId = stockId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.updatedBy = updatedBy
    }
}

public struct PromotionCodeRedemptionRecord: Codable {
    public let codeId: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let failureCode: String?
    public let failureMessage: String?
    public let idempotencyKey: String?
    public let occurredAt: String?
    public let offerId: String?
    public let offerVersionId: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let redemptionChannel: String?
    public let redemptionNo: String?
    public let redemptionScene: String?
    public let requestNo: String?
    public let resultStatus: String?
    public let stockId: String?
    public let subjectId: String?
    public let subjectType: String?
    public let submittedCodeHash: String?
    public let submittedCodeSuffix: String?
    public let tenantId: String?
    public let userCouponId: String?


    public init(codeId: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, failureCode: String? = nil, failureMessage: String? = nil, idempotencyKey: String? = nil, occurredAt: String? = nil, offerId: String? = nil, offerVersionId: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, redemptionChannel: String? = nil, redemptionNo: String? = nil, redemptionScene: String? = nil, requestNo: String? = nil, resultStatus: String? = nil, stockId: String? = nil, subjectId: String? = nil, subjectType: String? = nil, submittedCodeHash: String? = nil, submittedCodeSuffix: String? = nil, tenantId: String? = nil, userCouponId: String? = nil) {
        self.codeId = codeId
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.failureCode = failureCode
        self.failureMessage = failureMessage
        self.idempotencyKey = idempotencyKey
        self.occurredAt = occurredAt
        self.offerId = offerId
        self.offerVersionId = offerVersionId
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.redemptionChannel = redemptionChannel
        self.redemptionNo = redemptionNo
        self.redemptionScene = redemptionScene
        self.requestNo = requestNo
        self.resultStatus = resultStatus
        self.stockId = stockId
        self.subjectId = subjectId
        self.subjectType = subjectType
        self.submittedCodeHash = submittedCodeHash
        self.submittedCodeSuffix = submittedCodeSuffix
        self.tenantId = tenantId
        self.userCouponId = userCouponId
    }
}

public struct PromotionCodeRedemptionRequest: Codable {
    public let clientRequestNo: String?
    public let code: String?
    public let note: String?
    public let scene: String?
    public let source: String?


    public init(clientRequestNo: String? = nil, code: String? = nil, note: String? = nil, scene: String? = nil, source: String? = nil) {
        self.clientRequestNo = clientRequestNo
        self.code = code
        self.note = note
        self.scene = scene
        self.source = source
    }
}

public struct PromotionCommandRequest: Codable {
    public let clientRequestNo: String?
    public let metadata: [String: String]?
    public let note: String?


    public init(clientRequestNo: String? = nil, metadata: [String: String]? = nil, note: String? = nil) {
        self.clientRequestNo = clientRequestNo
        self.metadata = metadata
        self.note = note
    }
}

public struct PromotionCouponLedgerEntryRecord: Codable {
    public let applicationId: String?
    public let businessType: String?
    public let createdAt: String?
    public let direction: String?
    public let idempotencyKey: String?
    public let ledgerNo: String?
    public let occurredAt: String?
    public let offerId: String?
    public let organizationId: String?
    public let requestNo: String?
    public let sourceId: String?
    public let sourceType: String?
    public let stockId: String?
    public let subjectId: String?
    public let subjectType: String?
    public let tenantId: String?
    public let userCouponId: String?


    public init(applicationId: String? = nil, businessType: String? = nil, createdAt: String? = nil, direction: String? = nil, idempotencyKey: String? = nil, ledgerNo: String? = nil, occurredAt: String? = nil, offerId: String? = nil, organizationId: String? = nil, requestNo: String? = nil, sourceId: String? = nil, sourceType: String? = nil, stockId: String? = nil, subjectId: String? = nil, subjectType: String? = nil, tenantId: String? = nil, userCouponId: String? = nil) {
        self.applicationId = applicationId
        self.businessType = businessType
        self.createdAt = createdAt
        self.direction = direction
        self.idempotencyKey = idempotencyKey
        self.ledgerNo = ledgerNo
        self.occurredAt = occurredAt
        self.offerId = offerId
        self.organizationId = organizationId
        self.requestNo = requestNo
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.stockId = stockId
        self.subjectId = subjectId
        self.subjectType = subjectType
        self.tenantId = tenantId
        self.userCouponId = userCouponId
    }
}

public struct PromotionCouponStockRecord: Codable {
    public let activationStatus: String?
    public let budgetAccountId: String?
    public let budgetStopThresholdBps: Int?
    public let budgetWarningThresholdBps: Int?
    public let canResend: Bool?
    public let cancelUntil: String?
    public let codeMode: String?
    public let codePrefix: String?
    public let createdAt: String?
    public let createdBy: String?
    public let currencyCode: String?
    public let expiresAt: String?
    public let issueChannel: String?
    public let maxClaimsPerNaturalPerson: Int?
    public let maxClaimsPerSubject: Int?
    public let name: String?
    public let offerId: String?
    public let offerVersionId: String?
    public let organizationId: String?
    public let overspendPolicy: String?
    public let perSubjectLimit: String?
    public let startsAt: String?
    public let status: String?
    public let stockCreatorMerchantId: String?
    public let stockNo: String?
    public let stockType: String?
    public let tenantId: String?
    public let title: String?
    public let totalQuantity: String?
    public let updatedAt: String?
    public let updatedBy: String?


    public init(activationStatus: String? = nil, budgetAccountId: String? = nil, budgetStopThresholdBps: Int? = nil, budgetWarningThresholdBps: Int? = nil, canResend: Bool? = nil, cancelUntil: String? = nil, codeMode: String? = nil, codePrefix: String? = nil, createdAt: String? = nil, createdBy: String? = nil, currencyCode: String? = nil, expiresAt: String? = nil, issueChannel: String? = nil, maxClaimsPerNaturalPerson: Int? = nil, maxClaimsPerSubject: Int? = nil, name: String? = nil, offerId: String? = nil, offerVersionId: String? = nil, organizationId: String? = nil, overspendPolicy: String? = nil, perSubjectLimit: String? = nil, startsAt: String? = nil, status: String? = nil, stockCreatorMerchantId: String? = nil, stockNo: String? = nil, stockType: String? = nil, tenantId: String? = nil, title: String? = nil, totalQuantity: String? = nil, updatedAt: String? = nil, updatedBy: String? = nil) {
        self.activationStatus = activationStatus
        self.budgetAccountId = budgetAccountId
        self.budgetStopThresholdBps = budgetStopThresholdBps
        self.budgetWarningThresholdBps = budgetWarningThresholdBps
        self.canResend = canResend
        self.cancelUntil = cancelUntil
        self.codeMode = codeMode
        self.codePrefix = codePrefix
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.currencyCode = currencyCode
        self.expiresAt = expiresAt
        self.issueChannel = issueChannel
        self.maxClaimsPerNaturalPerson = maxClaimsPerNaturalPerson
        self.maxClaimsPerSubject = maxClaimsPerSubject
        self.name = name
        self.offerId = offerId
        self.offerVersionId = offerVersionId
        self.organizationId = organizationId
        self.overspendPolicy = overspendPolicy
        self.perSubjectLimit = perSubjectLimit
        self.startsAt = startsAt
        self.status = status
        self.stockCreatorMerchantId = stockCreatorMerchantId
        self.stockNo = stockNo
        self.stockType = stockType
        self.tenantId = tenantId
        self.title = title
        self.totalQuantity = totalQuantity
        self.updatedAt = updatedAt
        self.updatedBy = updatedBy
    }
}

public struct PromotionCouponWalletItem: Codable {
    public let claimSource: String?
    public let claimedAt: String?
    public let codeId: String?
    public let couponNo: String?
    public let currencyCode: String?
    public let discountType: String?
    public let expiresAt: String?
    public let faceValueMinor: Int?
    public let id: String?
    public let lockExpiresAt: String?
    public let lockedAt: String?
    public let offerId: String?
    public let redeemedAt: String?
    public let returnedAt: String?
    public let sourceCodeLast4: String?
    public let status: String?
    public let stockId: String?
    public let validFrom: String?


    public init(claimSource: String? = nil, claimedAt: String? = nil, codeId: String? = nil, couponNo: String? = nil, currencyCode: String? = nil, discountType: String? = nil, expiresAt: String? = nil, faceValueMinor: Int? = nil, id: String? = nil, lockExpiresAt: String? = nil, lockedAt: String? = nil, offerId: String? = nil, redeemedAt: String? = nil, returnedAt: String? = nil, sourceCodeLast4: String? = nil, status: String? = nil, stockId: String? = nil, validFrom: String? = nil) {
        self.claimSource = claimSource
        self.claimedAt = claimedAt
        self.codeId = codeId
        self.couponNo = couponNo
        self.currencyCode = currencyCode
        self.discountType = discountType
        self.expiresAt = expiresAt
        self.faceValueMinor = faceValueMinor
        self.id = id
        self.lockExpiresAt = lockExpiresAt
        self.lockedAt = lockedAt
        self.offerId = offerId
        self.redeemedAt = redeemedAt
        self.returnedAt = returnedAt
        self.sourceCodeLast4 = sourceCodeLast4
        self.status = status
        self.stockId = stockId
        self.validFrom = validFrom
    }
}

public struct PromotionDiscountAllocationRecord: Codable {
    public let allocationRatioBps: Int?
    public let applicationId: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let orderId: String?
    public let orderItemId: String?
    public let organizationId: String?
    public let skuId: String?
    public let tenantId: String?


    public init(allocationRatioBps: Int? = nil, applicationId: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, orderId: String? = nil, orderItemId: String? = nil, organizationId: String? = nil, skuId: String? = nil, tenantId: String? = nil) {
        self.allocationRatioBps = allocationRatioBps
        self.applicationId = applicationId
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.orderId = orderId
        self.orderItemId = orderItemId
        self.organizationId = organizationId
        self.skuId = skuId
        self.tenantId = tenantId
    }
}

public struct PromotionDiscountApplicationRecord: Codable {
    public let applicationNo: String?
    public let appliedAt: String?
    public let budgetAccountId: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let failureCode: String?
    public let failureMessage: String?
    public let idempotencyKey: String?
    public let offerId: String?
    public let offerVersionId: String?
    public let orderId: String?
    public let orderNo: String?
    public let organizationId: String?
    public let paymentId: String?
    public let releasedAt: String?
    public let requestNo: String?
    public let reservationExpiresAt: String?
    public let reservedAt: String?
    public let rolledBackAt: String?
    public let ruleSnapshotJson: [String: String]?
    public let settledAt: String?
    public let status: String?
    public let stockId: String?
    public let subjectId: String?
    public let subjectType: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userCouponId: String?


    public init(applicationNo: String? = nil, appliedAt: String? = nil, budgetAccountId: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, failureCode: String? = nil, failureMessage: String? = nil, idempotencyKey: String? = nil, offerId: String? = nil, offerVersionId: String? = nil, orderId: String? = nil, orderNo: String? = nil, organizationId: String? = nil, paymentId: String? = nil, releasedAt: String? = nil, requestNo: String? = nil, reservationExpiresAt: String? = nil, reservedAt: String? = nil, rolledBackAt: String? = nil, ruleSnapshotJson: [String: String]? = nil, settledAt: String? = nil, status: String? = nil, stockId: String? = nil, subjectId: String? = nil, subjectType: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userCouponId: String? = nil) {
        self.applicationNo = applicationNo
        self.appliedAt = appliedAt
        self.budgetAccountId = budgetAccountId
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.failureCode = failureCode
        self.failureMessage = failureMessage
        self.idempotencyKey = idempotencyKey
        self.offerId = offerId
        self.offerVersionId = offerVersionId
        self.orderId = orderId
        self.orderNo = orderNo
        self.organizationId = organizationId
        self.paymentId = paymentId
        self.releasedAt = releasedAt
        self.requestNo = requestNo
        self.reservationExpiresAt = reservationExpiresAt
        self.reservedAt = reservedAt
        self.rolledBackAt = rolledBackAt
        self.ruleSnapshotJson = ruleSnapshotJson
        self.settledAt = settledAt
        self.status = status
        self.stockId = stockId
        self.subjectId = subjectId
        self.subjectType = subjectType
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userCouponId = userCouponId
    }
}

public struct PromotionEventOutboxRecord: Codable {
    public let aggregateId: String?
    public let aggregateType: String?
    public let createdAt: String?
    public let eventNo: String?
    public let eventType: String?
    public let eventVersion: Int?
    public let nextRetryAt: String?
    public let occurredAt: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let payloadJson: [String: String]?
    public let publishedAt: String?
    public let status: String?
    public let tenantId: String?


    public init(aggregateId: String? = nil, aggregateType: String? = nil, createdAt: String? = nil, eventNo: String? = nil, eventType: String? = nil, eventVersion: Int? = nil, nextRetryAt: String? = nil, occurredAt: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, payloadJson: [String: String]? = nil, publishedAt: String? = nil, status: String? = nil, tenantId: String? = nil) {
        self.aggregateId = aggregateId
        self.aggregateType = aggregateType
        self.createdAt = createdAt
        self.eventNo = eventNo
        self.eventType = eventType
        self.eventVersion = eventVersion
        self.nextRetryAt = nextRetryAt
        self.occurredAt = occurredAt
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.payloadJson = payloadJson
        self.publishedAt = publishedAt
        self.status = status
        self.tenantId = tenantId
    }
}

public struct PromotionExternalBindingRecord: Codable {
    public let bindingNo: String?
    public let claimCodeHash: String?
    public let claimCodeSuffix: String?
    public let codeId: String?
    public let createdAt: String?
    public let createdBy: String?
    public let externalCurrencyCode: String?
    public let externalMerchantId: String?
    public let externalObjectId: String?
    public let externalObjectType: String?
    public let lastErrorCode: String?
    public let lastErrorMessage: String?
    public let lastSyncAt: String?
    public let metadataJson: [String: String]?
    public let offerId: String?
    public let offerVersionId: String?
    public let organizationId: String?
    public let platform: String?
    public let platformCardId: String?
    public let platformCouponId: String?
    public let platformStockId: String?
    public let platformTemplateId: String?
    public let stockId: String?
    public let syncStatus: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let updatedBy: String?
    public let userCouponId: String?


    public init(bindingNo: String? = nil, claimCodeHash: String? = nil, claimCodeSuffix: String? = nil, codeId: String? = nil, createdAt: String? = nil, createdBy: String? = nil, externalCurrencyCode: String? = nil, externalMerchantId: String? = nil, externalObjectId: String? = nil, externalObjectType: String? = nil, lastErrorCode: String? = nil, lastErrorMessage: String? = nil, lastSyncAt: String? = nil, metadataJson: [String: String]? = nil, offerId: String? = nil, offerVersionId: String? = nil, organizationId: String? = nil, platform: String? = nil, platformCardId: String? = nil, platformCouponId: String? = nil, platformStockId: String? = nil, platformTemplateId: String? = nil, stockId: String? = nil, syncStatus: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, updatedBy: String? = nil, userCouponId: String? = nil) {
        self.bindingNo = bindingNo
        self.claimCodeHash = claimCodeHash
        self.claimCodeSuffix = claimCodeSuffix
        self.codeId = codeId
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.externalCurrencyCode = externalCurrencyCode
        self.externalMerchantId = externalMerchantId
        self.externalObjectId = externalObjectId
        self.externalObjectType = externalObjectType
        self.lastErrorCode = lastErrorCode
        self.lastErrorMessage = lastErrorMessage
        self.lastSyncAt = lastSyncAt
        self.metadataJson = metadataJson
        self.offerId = offerId
        self.offerVersionId = offerVersionId
        self.organizationId = organizationId
        self.platform = platform
        self.platformCardId = platformCardId
        self.platformCouponId = platformCouponId
        self.platformStockId = platformStockId
        self.platformTemplateId = platformTemplateId
        self.stockId = stockId
        self.syncStatus = syncStatus
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.updatedBy = updatedBy
        self.userCouponId = userCouponId
    }
}

public struct PromotionExternalOperationRecord: Codable {
    public let aggregateId: String?
    public let aggregateType: String?
    public let bindingId: String?
    public let callbackAt: String?
    public let callbackId: String?
    public let callbackSigHash: String?
    public let cancelUntil: String?
    public let createdAt: String?
    public let errorCode: String?
    public let errorMessage: String?
    public let externalOperationId: String?
    public let externalRequestNo: String?
    public let externalStatus: String?
    public let idempotencyKey: String?
    public let nextRetryAt: String?
    public let occurredAt: String?
    public let operationNo: String?
    public let operationType: String?
    public let organizationId: String?
    public let platform: String?
    public let providerCode: String?
    public let providerRequestId: String?
    public let replayOpId: String?
    public let requestHash: String?
    public let responseHash: String?
    public let sanitizedRequestJson: [String: String]?
    public let sanitizedResponseJson: [String: String]?
    public let status: String?
    public let tenantId: String?


    public init(aggregateId: String? = nil, aggregateType: String? = nil, bindingId: String? = nil, callbackAt: String? = nil, callbackId: String? = nil, callbackSigHash: String? = nil, cancelUntil: String? = nil, createdAt: String? = nil, errorCode: String? = nil, errorMessage: String? = nil, externalOperationId: String? = nil, externalRequestNo: String? = nil, externalStatus: String? = nil, idempotencyKey: String? = nil, nextRetryAt: String? = nil, occurredAt: String? = nil, operationNo: String? = nil, operationType: String? = nil, organizationId: String? = nil, platform: String? = nil, providerCode: String? = nil, providerRequestId: String? = nil, replayOpId: String? = nil, requestHash: String? = nil, responseHash: String? = nil, sanitizedRequestJson: [String: String]? = nil, sanitizedResponseJson: [String: String]? = nil, status: String? = nil, tenantId: String? = nil) {
        self.aggregateId = aggregateId
        self.aggregateType = aggregateType
        self.bindingId = bindingId
        self.callbackAt = callbackAt
        self.callbackId = callbackId
        self.callbackSigHash = callbackSigHash
        self.cancelUntil = cancelUntil
        self.createdAt = createdAt
        self.errorCode = errorCode
        self.errorMessage = errorMessage
        self.externalOperationId = externalOperationId
        self.externalRequestNo = externalRequestNo
        self.externalStatus = externalStatus
        self.idempotencyKey = idempotencyKey
        self.nextRetryAt = nextRetryAt
        self.occurredAt = occurredAt
        self.operationNo = operationNo
        self.operationType = operationType
        self.organizationId = organizationId
        self.platform = platform
        self.providerCode = providerCode
        self.providerRequestId = providerRequestId
        self.replayOpId = replayOpId
        self.requestHash = requestHash
        self.responseHash = responseHash
        self.sanitizedRequestJson = sanitizedRequestJson
        self.sanitizedResponseJson = sanitizedResponseJson
        self.status = status
        self.tenantId = tenantId
    }
}

public struct PromotionOfferAudienceRuleRecord: Codable {
    public let createdAt: String?
    public let offerVersionId: String?
    public let organizationId: String?
    public let ruleOperator: String?
    public let ruleType: String?
    public let ruleValue: String?
    public let ruleValueJson: [String: String]?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, offerVersionId: String? = nil, organizationId: String? = nil, ruleOperator: String? = nil, ruleType: String? = nil, ruleValue: String? = nil, ruleValueJson: [String: String]? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.offerVersionId = offerVersionId
        self.organizationId = organizationId
        self.ruleOperator = ruleOperator
        self.ruleType = ruleType
        self.ruleValue = ruleValue
        self.ruleValueJson = ruleValueJson
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct PromotionOfferPresentationRecord: Codable {
    public let brandName: String?
    public let coverAssetId: String?
    public let createdAt: String?
    public let createdBy: String?
    public let customerActionJson: [String: String]?
    public let displayName: String?
    public let fieldSchemaJson: [String: String]?
    public let locale: String?
    public let logoAssetId: String?
    public let merchantDisplayName: String?
    public let offerId: String?
    public let offerVersionId: String?
    public let organizationId: String?
    public let paramSchemaJson: [String: String]?
    public let presentationNo: String?
    public let primaryColor: String?
    public let recognitionHash: String?
    public let recognitionType: String?
    public let secondaryColor: String?
    public let status: String?
    public let styleSnapshotJson: [String: String]?
    public let surfaceType: String?
    public let tenantId: String?
    public let termsJson: [String: String]?
    public let updatedAt: String?
    public let updatedBy: String?
    public let verifyMethod: String?


    public init(brandName: String? = nil, coverAssetId: String? = nil, createdAt: String? = nil, createdBy: String? = nil, customerActionJson: [String: String]? = nil, displayName: String? = nil, fieldSchemaJson: [String: String]? = nil, locale: String? = nil, logoAssetId: String? = nil, merchantDisplayName: String? = nil, offerId: String? = nil, offerVersionId: String? = nil, organizationId: String? = nil, paramSchemaJson: [String: String]? = nil, presentationNo: String? = nil, primaryColor: String? = nil, recognitionHash: String? = nil, recognitionType: String? = nil, secondaryColor: String? = nil, status: String? = nil, styleSnapshotJson: [String: String]? = nil, surfaceType: String? = nil, tenantId: String? = nil, termsJson: [String: String]? = nil, updatedAt: String? = nil, updatedBy: String? = nil, verifyMethod: String? = nil) {
        self.brandName = brandName
        self.coverAssetId = coverAssetId
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.customerActionJson = customerActionJson
        self.displayName = displayName
        self.fieldSchemaJson = fieldSchemaJson
        self.locale = locale
        self.logoAssetId = logoAssetId
        self.merchantDisplayName = merchantDisplayName
        self.offerId = offerId
        self.offerVersionId = offerVersionId
        self.organizationId = organizationId
        self.paramSchemaJson = paramSchemaJson
        self.presentationNo = presentationNo
        self.primaryColor = primaryColor
        self.recognitionHash = recognitionHash
        self.recognitionType = recognitionType
        self.secondaryColor = secondaryColor
        self.status = status
        self.styleSnapshotJson = styleSnapshotJson
        self.surfaceType = surfaceType
        self.tenantId = tenantId
        self.termsJson = termsJson
        self.updatedAt = updatedAt
        self.updatedBy = updatedBy
        self.verifyMethod = verifyMethod
    }
}

public struct PromotionOfferRecord: Codable {
    public let audienceScope: String?
    public let combinability: String?
    public let createdAt: String?
    public let createdBy: String?
    public let currentOfferVersionId: String?
    public let description: String?
    public let endsAt: String?
    public let name: String?
    public let offerCode: String?
    public let offerNo: String?
    public let offerType: String?
    public let organizationId: String?
    public let startsAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let updatedBy: String?


    public init(audienceScope: String? = nil, combinability: String? = nil, createdAt: String? = nil, createdBy: String? = nil, currentOfferVersionId: String? = nil, description: String? = nil, endsAt: String? = nil, name: String? = nil, offerCode: String? = nil, offerNo: String? = nil, offerType: String? = nil, organizationId: String? = nil, startsAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, updatedBy: String? = nil) {
        self.audienceScope = audienceScope
        self.combinability = combinability
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.currentOfferVersionId = currentOfferVersionId
        self.description = description
        self.endsAt = endsAt
        self.name = name
        self.offerCode = offerCode
        self.offerNo = offerNo
        self.offerType = offerType
        self.organizationId = organizationId
        self.startsAt = startsAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.updatedBy = updatedBy
    }
}

public struct PromotionOfferScopeRecord: Codable {
    public let createdAt: String?
    public let matchMode: String?
    public let offerVersionId: String?
    public let organizationId: String?
    public let scopeType: String?
    public let targetCode: String?
    public let targetId: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, matchMode: String? = nil, offerVersionId: String? = nil, organizationId: String? = nil, scopeType: String? = nil, targetCode: String? = nil, targetId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.matchMode = matchMode
        self.offerVersionId = offerVersionId
        self.organizationId = organizationId
        self.scopeType = scopeType
        self.targetCode = targetCode
        self.targetId = targetId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct PromotionOfferTimeWindowRecord: Codable {
    public let createdAt: String?
    public let endsAt: String?
    public let localEndTime: String?
    public let localStartTime: String?
    public let offerVersionId: String?
    public let organizationId: String?
    public let startsAt: String?
    public let tenantId: String?
    public let timezone: String?
    public let updatedAt: String?
    public let weekdayMask: Int?
    public let windowType: String?


    public init(createdAt: String? = nil, endsAt: String? = nil, localEndTime: String? = nil, localStartTime: String? = nil, offerVersionId: String? = nil, organizationId: String? = nil, startsAt: String? = nil, tenantId: String? = nil, timezone: String? = nil, updatedAt: String? = nil, weekdayMask: Int? = nil, windowType: String? = nil) {
        self.createdAt = createdAt
        self.endsAt = endsAt
        self.localEndTime = localEndTime
        self.localStartTime = localStartTime
        self.offerVersionId = offerVersionId
        self.organizationId = organizationId
        self.startsAt = startsAt
        self.tenantId = tenantId
        self.timezone = timezone
        self.updatedAt = updatedAt
        self.weekdayMask = weekdayMask
        self.windowType = windowType
    }
}

public struct PromotionOfferVersionRecord: Codable {
    public let benefitDefinitionId: String?
    public let benefitKind: String?
    public let benefitQuantity: String?
    public let breakagePolicy: String?
    public let createdAt: String?
    public let createdBy: String?
    public let currencyCode: String?
    public let discountAmountMinor: String?
    public let discountPercentBps: Int?
    public let discountType: String?
    public let faceValueMinor: String?
    public let fixedPriceMinor: String?
    public let liabilityPolicy: String?
    public let lifecycleStatus: String?
    public let maximumDiscountAmountMinor: String?
    public let offerId: String?
    public let organizationId: String?
    public let publishedAt: String?
    public let returnPolicy: String?
    public let ruleSnapshotJson: [String: String]?
    public let settlementPolicy: String?
    public let stackStrategy: String?
    public let taxTreatment: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let updatedBy: String?
    public let validityDurationSeconds: String?
    public let validityType: String?
    public let versionNo: String?


    public init(benefitDefinitionId: String? = nil, benefitKind: String? = nil, benefitQuantity: String? = nil, breakagePolicy: String? = nil, createdAt: String? = nil, createdBy: String? = nil, currencyCode: String? = nil, discountAmountMinor: String? = nil, discountPercentBps: Int? = nil, discountType: String? = nil, faceValueMinor: String? = nil, fixedPriceMinor: String? = nil, liabilityPolicy: String? = nil, lifecycleStatus: String? = nil, maximumDiscountAmountMinor: String? = nil, offerId: String? = nil, organizationId: String? = nil, publishedAt: String? = nil, returnPolicy: String? = nil, ruleSnapshotJson: [String: String]? = nil, settlementPolicy: String? = nil, stackStrategy: String? = nil, taxTreatment: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, updatedBy: String? = nil, validityDurationSeconds: String? = nil, validityType: String? = nil, versionNo: String? = nil) {
        self.benefitDefinitionId = benefitDefinitionId
        self.benefitKind = benefitKind
        self.benefitQuantity = benefitQuantity
        self.breakagePolicy = breakagePolicy
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.currencyCode = currencyCode
        self.discountAmountMinor = discountAmountMinor
        self.discountPercentBps = discountPercentBps
        self.discountType = discountType
        self.faceValueMinor = faceValueMinor
        self.fixedPriceMinor = fixedPriceMinor
        self.liabilityPolicy = liabilityPolicy
        self.lifecycleStatus = lifecycleStatus
        self.maximumDiscountAmountMinor = maximumDiscountAmountMinor
        self.offerId = offerId
        self.organizationId = organizationId
        self.publishedAt = publishedAt
        self.returnPolicy = returnPolicy
        self.ruleSnapshotJson = ruleSnapshotJson
        self.settlementPolicy = settlementPolicy
        self.stackStrategy = stackStrategy
        self.taxTreatment = taxTreatment
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.updatedBy = updatedBy
        self.validityDurationSeconds = validityDurationSeconds
        self.validityType = validityType
        self.versionNo = versionNo
    }
}

public struct PromotionOperationResponse: Codable {
    public let paymentId: String?
    public let qrCodeImageUrl: String?
    public let qrCodePayload: String?
    public let requestNo: String?
    public let status: String?
    public let success: Bool?


    public init(paymentId: String? = nil, qrCodeImageUrl: String? = nil, qrCodePayload: String? = nil, requestNo: String? = nil, status: String? = nil, success: Bool? = nil) {
        self.paymentId = paymentId
        self.qrCodeImageUrl = qrCodeImageUrl
        self.qrCodePayload = qrCodePayload
        self.requestNo = requestNo
        self.status = status
        self.success = success
    }
}

public struct PromotionUserCouponRecord: Codable {
    public let activationStatus: String?
    public let budgetAccountId: String?
    public let canResend: Bool?
    public let cancelUntil: String?
    public let claimCodeHash: String?
    public let claimCodeSuffix: String?
    public let claimSource: String?
    public let claimedAt: String?
    public let codeId: String?
    public let couponCodeHash: String?
    public let couponCodeSuffix: String?
    public let couponNo: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let disabledAt: String?
    public let discountPercentBps: Int?
    public let expiresAt: String?
    public let idempotencyKey: String?
    public let lockExpiresAt: String?
    public let lockedAt: String?
    public let offerId: String?
    public let offerVersionId: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let recognitionHash: String?
    public let recognitionType: String?
    public let redeemedAt: String?
    public let requestNo: String?
    public let returnedAt: String?
    public let status: String?
    public let stockId: String?
    public let subjectId: String?
    public let subjectType: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let validFrom: String?
    public let verifyMethod: String?


    public init(activationStatus: String? = nil, budgetAccountId: String? = nil, canResend: Bool? = nil, cancelUntil: String? = nil, claimCodeHash: String? = nil, claimCodeSuffix: String? = nil, claimSource: String? = nil, claimedAt: String? = nil, codeId: String? = nil, couponCodeHash: String? = nil, couponCodeSuffix: String? = nil, couponNo: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, disabledAt: String? = nil, discountPercentBps: Int? = nil, expiresAt: String? = nil, idempotencyKey: String? = nil, lockExpiresAt: String? = nil, lockedAt: String? = nil, offerId: String? = nil, offerVersionId: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, recognitionHash: String? = nil, recognitionType: String? = nil, redeemedAt: String? = nil, requestNo: String? = nil, returnedAt: String? = nil, status: String? = nil, stockId: String? = nil, subjectId: String? = nil, subjectType: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, validFrom: String? = nil, verifyMethod: String? = nil) {
        self.activationStatus = activationStatus
        self.budgetAccountId = budgetAccountId
        self.canResend = canResend
        self.cancelUntil = cancelUntil
        self.claimCodeHash = claimCodeHash
        self.claimCodeSuffix = claimCodeSuffix
        self.claimSource = claimSource
        self.claimedAt = claimedAt
        self.codeId = codeId
        self.couponCodeHash = couponCodeHash
        self.couponCodeSuffix = couponCodeSuffix
        self.couponNo = couponNo
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.disabledAt = disabledAt
        self.discountPercentBps = discountPercentBps
        self.expiresAt = expiresAt
        self.idempotencyKey = idempotencyKey
        self.lockExpiresAt = lockExpiresAt
        self.lockedAt = lockedAt
        self.offerId = offerId
        self.offerVersionId = offerVersionId
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.recognitionHash = recognitionHash
        self.recognitionType = recognitionType
        self.redeemedAt = redeemedAt
        self.requestNo = requestNo
        self.returnedAt = returnedAt
        self.status = status
        self.stockId = stockId
        self.subjectId = subjectId
        self.subjectType = subjectType
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.validFrom = validFrom
        self.verifyMethod = verifyMethod
    }
}

public struct PromotionUserCouponWalletListResponse: Codable {
    public let items: [PromotionCouponWalletItem]?


    public init(items: [PromotionCouponWalletItem]? = nil) {
        self.items = items
    }
}

public struct PromotionsCodesRedemptionsCreateResult: Codable {
    public let code: String?
    public let data: PromotionOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: PromotionOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PromotionsDiscountApplicationsCreateResult: Codable {
    public let code: String?
    public let data: PromotionOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: PromotionOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PromotionsDiscountApplicationsReleaseResult: Codable {
    public let code: String?
    public let data: PromotionOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: PromotionOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PromotionsDiscountApplicationsReversalsCreateResult: Codable {
    public let code: String?
    public let data: PromotionOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: PromotionOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PromotionsDiscountApplicationsSettleResult: Codable {
    public let code: String?
    public let data: PromotionOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: PromotionOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PromotionsUserCouponsClaimsCreateResult: Codable {
    public let code: String?
    public let data: PromotionOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: PromotionOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PromotionsUserCouponsWalletListResult: Codable {
    public let code: String?
    public let data: PromotionUserCouponWalletListResponse?
    public let msg: String?


    public init(code: String? = nil, data: PromotionUserCouponWalletListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct QrAuthSessionsCreateResult: Codable {
    public let code: String?
    public let data: OpenPlatformQrAuthSessionResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformQrAuthSessionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct QrAuthSessionsPasswordsCreateResult: Codable {
    public let code: String?
    public let data: OpenPlatformQrAuthSessionResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformQrAuthSessionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct QrAuthSessionsRetrieveResult: Codable {
    public let code: String?
    public let data: OpenPlatformQrAuthSessionResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformQrAuthSessionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct QrAuthSessionsScansCreateResult: Codable {
    public let code: String?
    public let data: OpenPlatformQrAuthScanResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformQrAuthScanResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RankingVendorOption: Codable {
    public let code: String?
    public let label: String?
    public let modelCount: Int?


    public init(code: String? = nil, label: String? = nil, modelCount: Int? = nil) {
        self.code = code
        self.label = label
        self.modelCount = modelCount
    }
}

public struct RankingVendorOptionsResponse: Codable {
    public let items: [RankingVendorOption]?


    public init(items: [RankingVendorOption]? = nil) {
        self.items = items
    }
}

public struct RechargesOrdersCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RechargesOrdersRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RechargesPackagesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RefundsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RefundsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RefundsRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RegistrationsCreateResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RuntimeArtifactCreateRequest: Codable {
    public let artifactType: String?
    public let contentJson: [String: String]?
    public let contentText: String?
    public let metadata: [String: String]?
    public let mimeType: String?
    public let name: String?
    public let sha256: String?
    public let sizeBytes: Int?
    public let storageKey: String?
    public let storageUrl: String?


    public init(artifactType: String? = nil, contentJson: [String: String]? = nil, contentText: String? = nil, metadata: [String: String]? = nil, mimeType: String? = nil, name: String? = nil, sha256: String? = nil, sizeBytes: Int? = nil, storageKey: String? = nil, storageUrl: String? = nil) {
        self.artifactType = artifactType
        self.contentJson = contentJson
        self.contentText = contentText
        self.metadata = metadata
        self.mimeType = mimeType
        self.name = name
        self.sha256 = sha256
        self.sizeBytes = sizeBytes
        self.storageKey = storageKey
        self.storageUrl = storageUrl
    }
}

public struct RuntimeArtifactItem: Codable {
    public let artifactType: String?
    public let contentText: String?
    public let createdAt: String?
    public let id: String?
    public let invocationId: String?
    public let mimeType: String?
    public let name: String?
    public let sha256: String?
    public let sizeBytes: Int?
    public let storageKey: String?
    public let storageUrl: String?


    public init(artifactType: String? = nil, contentText: String? = nil, createdAt: String? = nil, id: String? = nil, invocationId: String? = nil, mimeType: String? = nil, name: String? = nil, sha256: String? = nil, sizeBytes: Int? = nil, storageKey: String? = nil, storageUrl: String? = nil) {
        self.artifactType = artifactType
        self.contentText = contentText
        self.createdAt = createdAt
        self.id = id
        self.invocationId = invocationId
        self.mimeType = mimeType
        self.name = name
        self.sha256 = sha256
        self.sizeBytes = sizeBytes
        self.storageKey = storageKey
        self.storageUrl = storageUrl
    }
}

public struct RuntimeArtifactListResponse: Codable {
    public let items: [RuntimeArtifactItem]?


    public init(items: [RuntimeArtifactItem]? = nil) {
        self.items = items
    }
}

public struct RuntimeArtifactResponse: Codable {
    public let item: RuntimeArtifactItem?


    public init(item: RuntimeArtifactItem? = nil) {
        self.item = item
    }
}

public struct RuntimeEventCreateRequest: Codable {
    public let eventSource: String?
    public let eventType: String?
    public let metadata: [String: String]?
    public let payloadJson: [String: String]?
    public let textDelta: String?


    public init(eventSource: String? = nil, eventType: String? = nil, metadata: [String: String]? = nil, payloadJson: [String: String]? = nil, textDelta: String? = nil) {
        self.eventSource = eventSource
        self.eventType = eventType
        self.metadata = metadata
        self.payloadJson = payloadJson
        self.textDelta = textDelta
    }
}

public struct RuntimeEventItem: Codable {
    public let createdAt: String?
    public let eventNo: Int?
    public let eventSource: String?
    public let eventType: String?
    public let id: String?
    public let invocationId: String?
    public let payloadJson: [String: String]?
    public let textDelta: String?


    public init(createdAt: String? = nil, eventNo: Int? = nil, eventSource: String? = nil, eventType: String? = nil, id: String? = nil, invocationId: String? = nil, payloadJson: [String: String]? = nil, textDelta: String? = nil) {
        self.createdAt = createdAt
        self.eventNo = eventNo
        self.eventSource = eventSource
        self.eventType = eventType
        self.id = id
        self.invocationId = invocationId
        self.payloadJson = payloadJson
        self.textDelta = textDelta
    }
}

public struct RuntimeEventListResponse: Codable {
    public let items: [RuntimeEventItem]?


    public init(items: [RuntimeEventItem]? = nil) {
        self.items = items
    }
}

public struct RuntimeEventResponse: Codable {
    public let item: RuntimeEventItem?


    public init(item: RuntimeEventItem? = nil) {
        self.item = item
    }
}

public struct RuntimeInvocationCompleteRequest: Codable {
    public let errorCode: String?
    public let errorMessageMasked: String?
    public let errorType: String?
    public let exitCode: Int?
    public let finishReason: String?
    public let latencyMs: Int?
    public let metadata: [String: String]?
    public let providerConversationId: String?
    public let providerResponseId: String?
    public let providerSessionId: String?
    public let providerStepId: String?
    public let responseJson: [String: String]?
    public let status: String?
    public let ttftMs: Int?
    public let usageJson: UsageSnapshot?


    public init(errorCode: String? = nil, errorMessageMasked: String? = nil, errorType: String? = nil, exitCode: Int? = nil, finishReason: String? = nil, latencyMs: Int? = nil, metadata: [String: String]? = nil, providerConversationId: String? = nil, providerResponseId: String? = nil, providerSessionId: String? = nil, providerStepId: String? = nil, responseJson: [String: String]? = nil, status: String? = nil, ttftMs: Int? = nil, usageJson: UsageSnapshot? = nil) {
        self.errorCode = errorCode
        self.errorMessageMasked = errorMessageMasked
        self.errorType = errorType
        self.exitCode = exitCode
        self.finishReason = finishReason
        self.latencyMs = latencyMs
        self.metadata = metadata
        self.providerConversationId = providerConversationId
        self.providerResponseId = providerResponseId
        self.providerSessionId = providerSessionId
        self.providerStepId = providerStepId
        self.responseJson = responseJson
        self.status = status
        self.ttftMs = ttftMs
        self.usageJson = usageJson
    }
}

public struct RuntimeInvocationCreateRequest: Codable {
    public let agentRunId: String?
    public let agentRunStepId: String?
    public let agentSessionId: String?
    public let approvalPolicy: String?
    public let chatItemId: String?
    public let chatTurnId: String?
    public let conversationId: String?
    public let cwd: String?
    public let endpoint: String?
    public let invocationType: String?
    public let metadata: [String: String]?
    public let model: String?
    public let permissionMode: String?
    public let provider: String?
    public let requestId: String?
    public let requestJson: [String: String]?
    public let runtime: String?
    public let sandboxPolicy: String?
    public let status: String?
    public let streaming: Bool?
    public let toolCallId: String?
    public let toolName: String?
    public let traceId: String?


    public init(agentRunId: String? = nil, agentRunStepId: String? = nil, agentSessionId: String? = nil, approvalPolicy: String? = nil, chatItemId: String? = nil, chatTurnId: String? = nil, conversationId: String? = nil, cwd: String? = nil, endpoint: String? = nil, invocationType: String? = nil, metadata: [String: String]? = nil, model: String? = nil, permissionMode: String? = nil, provider: String? = nil, requestId: String? = nil, requestJson: [String: String]? = nil, runtime: String? = nil, sandboxPolicy: String? = nil, status: String? = nil, streaming: Bool? = nil, toolCallId: String? = nil, toolName: String? = nil, traceId: String? = nil) {
        self.agentRunId = agentRunId
        self.agentRunStepId = agentRunStepId
        self.agentSessionId = agentSessionId
        self.approvalPolicy = approvalPolicy
        self.chatItemId = chatItemId
        self.chatTurnId = chatTurnId
        self.conversationId = conversationId
        self.cwd = cwd
        self.endpoint = endpoint
        self.invocationType = invocationType
        self.metadata = metadata
        self.model = model
        self.permissionMode = permissionMode
        self.provider = provider
        self.requestId = requestId
        self.requestJson = requestJson
        self.runtime = runtime
        self.sandboxPolicy = sandboxPolicy
        self.status = status
        self.streaming = streaming
        self.toolCallId = toolCallId
        self.toolName = toolName
        self.traceId = traceId
    }
}

public struct RuntimeInvocationItem: Codable {
    public let agentRunId: String?
    public let agentRunStepId: String?
    public let agentSessionId: String?
    public let approvalPolicy: String?
    public let attemptNo: Int?
    public let chatItemId: String?
    public let chatTurnId: String?
    public let completedAt: String?
    public let conversationId: String?
    public let createdAt: String?
    public let cwd: String?
    public let endpoint: String?
    public let errorCode: String?
    public let errorMessageMasked: String?
    public let errorType: String?
    public let exitCode: Int?
    public let finishReason: String?
    public let id: String?
    public let invocationNo: Int?
    public let invocationType: String?
    public let latencyMs: Int?
    public let model: String?
    public let permissionMode: String?
    public let provider: String?
    public let providerConversationId: String?
    public let providerResponseId: String?
    public let providerSessionId: String?
    public let providerStepId: String?
    public let requestId: String?
    public let runtime: String?
    public let sandboxPolicy: String?
    public let startedAt: String?
    public let status: String?
    public let streaming: Bool?
    public let toolCallId: String?
    public let toolName: String?
    public let traceId: String?
    public let ttftMs: Int?


    public init(agentRunId: String? = nil, agentRunStepId: String? = nil, agentSessionId: String? = nil, approvalPolicy: String? = nil, attemptNo: Int? = nil, chatItemId: String? = nil, chatTurnId: String? = nil, completedAt: String? = nil, conversationId: String? = nil, createdAt: String? = nil, cwd: String? = nil, endpoint: String? = nil, errorCode: String? = nil, errorMessageMasked: String? = nil, errorType: String? = nil, exitCode: Int? = nil, finishReason: String? = nil, id: String? = nil, invocationNo: Int? = nil, invocationType: String? = nil, latencyMs: Int? = nil, model: String? = nil, permissionMode: String? = nil, provider: String? = nil, providerConversationId: String? = nil, providerResponseId: String? = nil, providerSessionId: String? = nil, providerStepId: String? = nil, requestId: String? = nil, runtime: String? = nil, sandboxPolicy: String? = nil, startedAt: String? = nil, status: String? = nil, streaming: Bool? = nil, toolCallId: String? = nil, toolName: String? = nil, traceId: String? = nil, ttftMs: Int? = nil) {
        self.agentRunId = agentRunId
        self.agentRunStepId = agentRunStepId
        self.agentSessionId = agentSessionId
        self.approvalPolicy = approvalPolicy
        self.attemptNo = attemptNo
        self.chatItemId = chatItemId
        self.chatTurnId = chatTurnId
        self.completedAt = completedAt
        self.conversationId = conversationId
        self.createdAt = createdAt
        self.cwd = cwd
        self.endpoint = endpoint
        self.errorCode = errorCode
        self.errorMessageMasked = errorMessageMasked
        self.errorType = errorType
        self.exitCode = exitCode
        self.finishReason = finishReason
        self.id = id
        self.invocationNo = invocationNo
        self.invocationType = invocationType
        self.latencyMs = latencyMs
        self.model = model
        self.permissionMode = permissionMode
        self.provider = provider
        self.providerConversationId = providerConversationId
        self.providerResponseId = providerResponseId
        self.providerSessionId = providerSessionId
        self.providerStepId = providerStepId
        self.requestId = requestId
        self.runtime = runtime
        self.sandboxPolicy = sandboxPolicy
        self.startedAt = startedAt
        self.status = status
        self.streaming = streaming
        self.toolCallId = toolCallId
        self.toolName = toolName
        self.traceId = traceId
        self.ttftMs = ttftMs
    }
}

public struct RuntimeInvocationListResponse: Codable {
    public let items: [RuntimeInvocationItem]?


    public init(items: [RuntimeInvocationItem]? = nil) {
        self.items = items
    }
}

public struct RuntimeInvocationResponse: Codable {
    public let item: RuntimeInvocationItem?


    public init(item: RuntimeInvocationItem? = nil) {
        self.item = item
    }
}

public struct SdkReferenceArchiveGenerateRequest: Codable {
    public let config: [String: Any]?
    public let language: String?
    public let spec: [String: String]?


    public init(config: [String: Any]? = nil, language: String? = nil, spec: [String: String]? = nil) {
        self.config = config
        self.language = language
        self.spec = spec
    }
}

public struct SdkReferenceArchiveResponse: Codable {
    public let contentBase64: String?
    public let contentType: String?
    public let fileName: String?
    public let language: String?


    public init(contentBase64: String? = nil, contentType: String? = nil, fileName: String? = nil, language: String? = nil) {
        self.contentBase64 = contentBase64
        self.contentType = contentType
        self.fileName = fileName
        self.language = language
    }
}

public struct SdkReferenceDocumentationGenerateRequest: Codable {
    public let config: [String: Any]?
    public let language: String?
    public let spec: [String: String]?


    public init(config: [String: Any]? = nil, language: String? = nil, spec: [String: String]? = nil) {
        self.config = config
        self.language = language
        self.spec = spec
    }
}

public struct SdkReferenceDocumentationResponse: Codable {
    public let generated: Bool?
    public let language: String?
    public let methodDefinition: String?
    public let readme: String?
    public let usageExample: String?


    public init(generated: Bool? = nil, language: String? = nil, methodDefinition: String? = nil, readme: String? = nil, usageExample: String? = nil) {
        self.generated = generated
        self.language = language
        self.methodDefinition = methodDefinition
        self.readme = readme
        self.usageExample = usageExample
    }
}

public struct SessionsCreateResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SessionsCurrentDeleteResult: Codable {
    public let code: String?
    public let data: NoData?
    public let msg: String?


    public init(code: String? = nil, data: NoData? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SessionsCurrentRetrieveResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SessionsCurrentUpdateResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SessionsRefreshResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SettingsDataResponse: Codable {
    public let language: String?
    public let notifications: SettingsNotifications?
    public let timezone: String?
    public let webhookUrl: String?


    public init(language: String? = nil, notifications: SettingsNotifications? = nil, timezone: String? = nil, webhookUrl: String? = nil) {
        self.language = language
        self.notifications = notifications
        self.timezone = timezone
        self.webhookUrl = webhookUrl
    }
}

public struct SettingsNotifications: Codable {
    public let apiMonitor: Bool?
    public let billReminder: Bool?
    public let quotaWarning: Bool?


    public init(apiMonitor: Bool? = nil, billReminder: Bool? = nil, quotaWarning: Bool? = nil) {
        self.apiMonitor = apiMonitor
        self.billReminder = billReminder
        self.quotaWarning = quotaWarning
    }
}

public struct ShipmentsRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SiteRuntimeRetrieveResult: Codable {
    public let code: String?
    public let data: SiteRuntimeSettingsResponse?
    public let msg: String?


    public init(code: String? = nil, data: SiteRuntimeSettingsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SiteRuntimeSettingsResponse: Codable {
    public let accentColor: String?
    public let brandColor: String?
    public let customCss: String?
    public let description: String?
    public let docsUrl: String?
    public let faviconUrl: String?
    public let footerCopyright: String?
    public let iconUrl: String?
    public let icpRecordNumber: String?
    public let icpRecordUrl: String?
    public let logoUrl: String?
    public let policeRecordNumber: String?
    public let policeRecordUrl: String?
    public let privacyUrl: String?
    public let seoDescription: String?
    public let seoTitle: String?
    public let shortName: String?
    public let siteName: String?
    public let supportUrl: String?
    public let termsUrl: String?


    public init(accentColor: String? = nil, brandColor: String? = nil, customCss: String? = nil, description: String? = nil, docsUrl: String? = nil, faviconUrl: String? = nil, footerCopyright: String? = nil, iconUrl: String? = nil, icpRecordNumber: String? = nil, icpRecordUrl: String? = nil, logoUrl: String? = nil, policeRecordNumber: String? = nil, policeRecordUrl: String? = nil, privacyUrl: String? = nil, seoDescription: String? = nil, seoTitle: String? = nil, shortName: String? = nil, siteName: String? = nil, supportUrl: String? = nil, termsUrl: String? = nil) {
        self.accentColor = accentColor
        self.brandColor = brandColor
        self.customCss = customCss
        self.description = description
        self.docsUrl = docsUrl
        self.faviconUrl = faviconUrl
        self.footerCopyright = footerCopyright
        self.iconUrl = iconUrl
        self.icpRecordNumber = icpRecordNumber
        self.icpRecordUrl = icpRecordUrl
        self.logoUrl = logoUrl
        self.policeRecordNumber = policeRecordNumber
        self.policeRecordUrl = policeRecordUrl
        self.privacyUrl = privacyUrl
        self.seoDescription = seoDescription
        self.seoTitle = seoTitle
        self.shortName = shortName
        self.siteName = siteName
        self.supportUrl = supportUrl
        self.termsUrl = termsUrl
    }
}

public struct SkillCatalogItem: Codable {
    public let category: String?
    public let clawhubImage: String?
    public let description: String?
    public let developer: String?
    public let downloads: String?
    public let features: [String]?
    public let frameworks: [String]?
    public let id: String?
    public let image: String?
    public let lastUpdated: String?
    public let license: String?
    public let name: String?
    public let packages: [SkillPackageItem]?
    public let rating: Double?
    public let screenshots: [String]?
    public let size: String?
    public let version: String?


    public init(category: String? = nil, clawhubImage: String? = nil, description: String? = nil, developer: String? = nil, downloads: String? = nil, features: [String]? = nil, frameworks: [String]? = nil, id: String? = nil, image: String? = nil, lastUpdated: String? = nil, license: String? = nil, name: String? = nil, packages: [SkillPackageItem]? = nil, rating: Double? = nil, screenshots: [String]? = nil, size: String? = nil, version: String? = nil) {
        self.category = category
        self.clawhubImage = clawhubImage
        self.description = description
        self.developer = developer
        self.downloads = downloads
        self.features = features
        self.frameworks = frameworks
        self.id = id
        self.image = image
        self.lastUpdated = lastUpdated
        self.license = license
        self.name = name
        self.packages = packages
        self.rating = rating
        self.screenshots = screenshots
        self.size = size
        self.version = version
    }
}

public struct SkillCategoriesResponse: Codable {
    public let items: [String]?


    public init(items: [String]? = nil) {
        self.items = items
    }
}

public struct SkillDetailResponse: Codable {
    public let category: String?
    public let clawhubImage: String?
    public let description: String?
    public let developer: String?
    public let downloads: String?
    public let features: [String]?
    public let frameworks: [String]?
    public let id: String?
    public let image: String?
    public let lastUpdated: String?
    public let license: String?
    public let name: String?
    public let packages: [SkillPackageItem]?
    public let rating: Double?
    public let screenshots: [String]?
    public let size: String?
    public let version: String?


    public init(category: String? = nil, clawhubImage: String? = nil, description: String? = nil, developer: String? = nil, downloads: String? = nil, features: [String]? = nil, frameworks: [String]? = nil, id: String? = nil, image: String? = nil, lastUpdated: String? = nil, license: String? = nil, name: String? = nil, packages: [SkillPackageItem]? = nil, rating: Double? = nil, screenshots: [String]? = nil, size: String? = nil, version: String? = nil) {
        self.category = category
        self.clawhubImage = clawhubImage
        self.description = description
        self.developer = developer
        self.downloads = downloads
        self.features = features
        self.frameworks = frameworks
        self.id = id
        self.image = image
        self.lastUpdated = lastUpdated
        self.license = license
        self.name = name
        self.packages = packages
        self.rating = rating
        self.screenshots = screenshots
        self.size = size
        self.version = version
    }
}

public struct SkillPackageItem: Codable {
    public let artifactRef: String?
    public let artifactSizeBytes: Int?
    public let frameworks: [String]?
    public let id: String?
    public let licenseName: String?
    public let publishedAt: String?
    public let version: String?


    public init(artifactRef: String? = nil, artifactSizeBytes: Int? = nil, frameworks: [String]? = nil, id: String? = nil, licenseName: String? = nil, publishedAt: String? = nil, version: String? = nil) {
        self.artifactRef = artifactRef
        self.artifactSizeBytes = artifactSizeBytes
        self.frameworks = frameworks
        self.id = id
        self.licenseName = licenseName
        self.publishedAt = publishedAt
        self.version = version
    }
}

public struct SkillsCatalogResponse: Codable {
    public let items: [SkillCatalogItem]?


    public init(items: [SkillCatalogItem]? = nil) {
        self.items = items
    }
}

public struct SkillsCategoriesListResult: Codable {
    public let code: String?
    public let data: SkillCategoriesResponse?
    public let msg: String?


    public init(code: String? = nil, data: SkillCategoriesResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsConfigUpdateResult: Codable {
    public let code: String?
    public let data: AppInstalledSkillResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppInstalledSkillResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsDisableResult: Codable {
    public let code: String?
    public let data: AppInstalledSkillResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppInstalledSkillResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsEnableResult: Codable {
    public let code: String?
    public let data: AppInstalledSkillResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppInstalledSkillResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsListResult: Codable {
    public let code: String?
    public let data: SkillsCatalogResponse?
    public let msg: String?


    public init(code: String? = nil, data: SkillsCatalogResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsRetrieveResult: Codable {
    public let code: String?
    public let data: SkillDetailResponse?
    public let msg: String?


    public init(code: String? = nil, data: SkillDetailResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SpacesCreateResult: Codable {
    public let code: String?
    public let data: MemorySpaceResponse?
    public let msg: String?


    public init(code: String? = nil, data: MemorySpaceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SpacesListResult: Codable {
    public let code: String?
    public let data: MemorySpaceListResponse?
    public let msg: String?


    public init(code: String? = nil, data: MemorySpaceListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SpacesRetrieveResult: Codable {
    public let code: String?
    public let data: MemorySpaceItem?
    public let msg: String?


    public init(code: String? = nil, data: MemorySpaceItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct StorageDefaultBucketPolicyRecord: Codable {
    public let bucketId: String?
    public let bucketLogicalScope: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let logicalScope: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let reason: String?
    public let requestId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let updatedBy: String?
    public let uuid: String?
    public let version: String?


    public init(bucketId: String? = nil, bucketLogicalScope: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, logicalScope: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, reason: String? = nil, requestId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, updatedBy: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.bucketId = bucketId
        self.bucketLogicalScope = bucketLogicalScope
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.logicalScope = logicalScope
        self.metadata = metadata
        self.organizationId = organizationId
        self.reason = reason
        self.requestId = requestId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.updatedBy = updatedBy
        self.uuid = uuid
        self.version = version
    }
}

public struct StorageGcJobRecord: Codable {
    public let completedAt: String?
    public let createdAt: String?
    public let cursorToken: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let idempotencyKey: String?
    public let jobType: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let requestId: String?
    public let requestedBy: String?
    public let startedAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(completedAt: String? = nil, createdAt: String? = nil, cursorToken: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, idempotencyKey: String? = nil, jobType: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, requestId: String? = nil, requestedBy: String? = nil, startedAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.cursorToken = cursorToken
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.idempotencyKey = idempotencyKey
        self.jobType = jobType
        self.metadata = metadata
        self.organizationId = organizationId
        self.requestId = requestId
        self.requestedBy = requestedBy
        self.startedAt = startedAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct StorageQuotaPolicyRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let enforcement: String?
    public let id: String?
    public let idempotencyKey: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let quotaLimitBytes: String?
    public let requestId: String?
    public let scopeId: String?
    public let scopeType: String?
    public let singleFileLimitBytes: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, enforcement: String? = nil, id: String? = nil, idempotencyKey: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, quotaLimitBytes: String? = nil, requestId: String? = nil, scopeId: String? = nil, scopeType: String? = nil, singleFileLimitBytes: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.enforcement = enforcement
        self.id = id
        self.idempotencyKey = idempotencyKey
        self.metadata = metadata
        self.organizationId = organizationId
        self.quotaLimitBytes = quotaLimitBytes
        self.requestId = requestId
        self.scopeId = scopeId
        self.scopeType = scopeType
        self.singleFileLimitBytes = singleFileLimitBytes
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct StorageQuotaReservationRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let expiresAt: String?
    public let id: String?
    public let idempotencyKey: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let releasedAt: String?
    public let reservationNo: String?
    public let scopeId: String?
    public let scopeType: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uploadSessionId: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, expiresAt: String? = nil, id: String? = nil, idempotencyKey: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, releasedAt: String? = nil, reservationNo: String? = nil, scopeId: String? = nil, scopeType: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uploadSessionId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.expiresAt = expiresAt
        self.id = id
        self.idempotencyKey = idempotencyKey
        self.metadata = metadata
        self.organizationId = organizationId
        self.releasedAt = releasedAt
        self.reservationNo = reservationNo
        self.scopeId = scopeId
        self.scopeType = scopeType
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uploadSessionId = uploadSessionId
        self.uuid = uuid
        self.version = version
    }
}

public struct StorageReconciliationItemRecord: Codable {
    public let actualHash: String?
    public let actualSizeBytes: String?
    public let bucketId: String?
    public let createdAt: String?
    public let expectedHash: String?
    public let expectedSizeBytes: String?
    public let id: String?
    public let issueType: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let objectBlobId: String?
    public let objectKey: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let repairPayload: [String: String]?
    public let repairStatus: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let runId: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let userId: String?
    public let uuid: String?


    public init(actualHash: String? = nil, actualSizeBytes: String? = nil, bucketId: String? = nil, createdAt: String? = nil, expectedHash: String? = nil, expectedSizeBytes: String? = nil, id: String? = nil, issueType: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, objectBlobId: String? = nil, objectKey: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, repairPayload: [String: String]? = nil, repairStatus: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runId: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.actualHash = actualHash
        self.actualSizeBytes = actualSizeBytes
        self.bucketId = bucketId
        self.createdAt = createdAt
        self.expectedHash = expectedHash
        self.expectedSizeBytes = expectedSizeBytes
        self.id = id
        self.issueType = issueType
        self.legalHold = legalHold
        self.metadata = metadata
        self.objectBlobId = objectBlobId
        self.objectKey = objectKey
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.repairPayload = repairPayload
        self.repairStatus = repairStatus
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.runId = runId
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct StorageReconciliationRunRecord: Codable {
    public let bucketId: String?
    public let checkMode: String?
    public let completedAt: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let idempotencyKey: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let providerId: String?
    public let requestId: String?
    public let requestedBy: String?
    public let runType: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(bucketId: String? = nil, checkMode: String? = nil, completedAt: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, idempotencyKey: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, providerId: String? = nil, requestId: String? = nil, requestedBy: String? = nil, runType: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.bucketId = bucketId
        self.checkMode = checkMode
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.idempotencyKey = idempotencyKey
        self.metadata = metadata
        self.organizationId = organizationId
        self.providerId = providerId
        self.requestId = requestId
        self.requestedBy = requestedBy
        self.runType = runType
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct StorageUsageCounterRecord: Codable {
    public let appId: String?
    public let businessDomain: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerId: String?
    public let ownerType: String?
    public let scopeId: String?
    public let scopeType: String?
    public let spaceId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(appId: String? = nil, businessDomain: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, scopeId: String? = nil, scopeType: String? = nil, spaceId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.appId = appId
        self.businessDomain = businessDomain
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.scopeId = scopeId
        self.scopeType = scopeType
        self.spaceId = spaceId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct StorageUsageLedgerRecord: Codable {
    public let appId: String?
    public let businessDomain: String?
    public let createdAt: String?
    public let id: String?
    public let idempotencyKey: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let reason: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let scopeId: String?
    public let scopeType: String?
    public let spaceId: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let usageEventType: String?
    public let userId: String?
    public let uuid: String?


    public init(appId: String? = nil, businessDomain: String? = nil, createdAt: String? = nil, id: String? = nil, idempotencyKey: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, reason: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, scopeId: String? = nil, scopeType: String? = nil, spaceId: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, usageEventType: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.appId = appId
        self.businessDomain = businessDomain
        self.createdAt = createdAt
        self.id = id
        self.idempotencyKey = idempotencyKey
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.reason = reason
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.scopeId = scopeId
        self.scopeType = scopeType
        self.spaceId = spaceId
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.usageEventType = usageEventType
        self.userId = userId
        self.uuid = uuid
    }
}

public struct StorageUsageSnapshotRecord: Codable {
    public let appId: String?
    public let businessDomain: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let scopeId: String?
    public let scopeType: String?
    public let snapshotType: String?
    public let spaceId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(appId: String? = nil, businessDomain: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, scopeId: String? = nil, scopeType: String? = nil, snapshotType: String? = nil, spaceId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.appId = appId
        self.businessDomain = businessDomain
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.scopeId = scopeId
        self.scopeType = scopeType
        self.snapshotType = snapshotType
        self.spaceId = spaceId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct StudioAppTemplateRecord: Codable {
    public let appConfigSchema: [String: String]?
    public let capabilityManifest: [String: String]?
    public let categoryCode: String?
    public let categoryId: String?
    public let coverUrl: String?
    public let createdAt: String?
    public let currentVersionId: String?
    public let dataScope: String?
    public let defaultAppConfig: [String: String]?
    public let deletedAt: String?
    public let deletedBy: String?
    public let dependencyManifest: [String: String]?
    public let deprecatedAt: String?
    public let description: String?
    public let featured: Bool?
    public let framework: String?
    public let gitRef: String?
    public let gitRepoUrl: String?
    public let gitSubPath: String?
    public let iconUrl: String?
    public let id: String?
    public let language: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let ownerUserId: String?
    public let publishStatus: String?
    public let publishedAt: String?
    public let runtime: String?
    public let sortWeight: Int?
    public let sourceAppId: String?
    public let status: String?
    public let templateCode: String?
    public let templateName: String?
    public let templateNo: String?
    public let templateType: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let variableSchema: [String: String]?
    public let version: String?
    public let visibility: String?


    public init(appConfigSchema: [String: String]? = nil, capabilityManifest: [String: String]? = nil, categoryCode: String? = nil, categoryId: String? = nil, coverUrl: String? = nil, createdAt: String? = nil, currentVersionId: String? = nil, dataScope: String? = nil, defaultAppConfig: [String: String]? = nil, deletedAt: String? = nil, deletedBy: String? = nil, dependencyManifest: [String: String]? = nil, deprecatedAt: String? = nil, description: String? = nil, featured: Bool? = nil, framework: String? = nil, gitRef: String? = nil, gitRepoUrl: String? = nil, gitSubPath: String? = nil, iconUrl: String? = nil, id: String? = nil, language: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerUserId: String? = nil, publishStatus: String? = nil, publishedAt: String? = nil, runtime: String? = nil, sortWeight: Int? = nil, sourceAppId: String? = nil, status: String? = nil, templateCode: String? = nil, templateName: String? = nil, templateNo: String? = nil, templateType: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, variableSchema: [String: String]? = nil, version: String? = nil, visibility: String? = nil) {
        self.appConfigSchema = appConfigSchema
        self.capabilityManifest = capabilityManifest
        self.categoryCode = categoryCode
        self.categoryId = categoryId
        self.coverUrl = coverUrl
        self.createdAt = createdAt
        self.currentVersionId = currentVersionId
        self.dataScope = dataScope
        self.defaultAppConfig = defaultAppConfig
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.dependencyManifest = dependencyManifest
        self.deprecatedAt = deprecatedAt
        self.description = description
        self.featured = featured
        self.framework = framework
        self.gitRef = gitRef
        self.gitRepoUrl = gitRepoUrl
        self.gitSubPath = gitSubPath
        self.iconUrl = iconUrl
        self.id = id
        self.language = language
        self.metadata = metadata
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.publishStatus = publishStatus
        self.publishedAt = publishedAt
        self.runtime = runtime
        self.sortWeight = sortWeight
        self.sourceAppId = sourceAppId
        self.status = status
        self.templateCode = templateCode
        self.templateName = templateName
        self.templateNo = templateNo
        self.templateType = templateType
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.variableSchema = variableSchema
        self.version = version
        self.visibility = visibility
    }
}

public struct StudioAppTemplateUsageRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let inputSnapshot: [String: String]?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let outputSnapshot: [String: String]?
    public let requestId: String?
    public let status: String?
    public let targetAppId: String?
    public let templateId: String?
    public let templateVersionId: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let usageType: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, inputSnapshot: [String: String]? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, outputSnapshot: [String: String]? = nil, requestId: String? = nil, status: String? = nil, targetAppId: String? = nil, templateId: String? = nil, templateVersionId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, usageType: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.inputSnapshot = inputSnapshot
        self.metadata = metadata
        self.organizationId = organizationId
        self.outputSnapshot = outputSnapshot
        self.requestId = requestId
        self.status = status
        self.targetAppId = targetAppId
        self.templateId = templateId
        self.templateVersionId = templateVersionId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.usageType = usageType
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct StudioAppTemplateVersionRecord: Codable {
    public let appConfigSchema: [String: String]?
    public let artifactId: String?
    public let capabilityManifest: [String: String]?
    public let changelog: String?
    public let createdAt: String?
    public let dataScope: String?
    public let defaultAppConfig: [String: String]?
    public let deletedAt: String?
    public let deletedBy: String?
    public let dependencyManifest: [String: String]?
    public let deprecatedAt: String?
    public let fileManifest: [String: String]?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let publishStatus: String?
    public let publishedAt: String?
    public let status: String?
    public let templateId: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let variableSchema: [String: String]?
    public let version: String?
    public let versionNo: String?


    public init(appConfigSchema: [String: String]? = nil, artifactId: String? = nil, capabilityManifest: [String: String]? = nil, changelog: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultAppConfig: [String: String]? = nil, deletedAt: String? = nil, deletedBy: String? = nil, dependencyManifest: [String: String]? = nil, deprecatedAt: String? = nil, fileManifest: [String: String]? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, publishStatus: String? = nil, publishedAt: String? = nil, status: String? = nil, templateId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, variableSchema: [String: String]? = nil, version: String? = nil, versionNo: String? = nil) {
        self.appConfigSchema = appConfigSchema
        self.artifactId = artifactId
        self.capabilityManifest = capabilityManifest
        self.changelog = changelog
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.defaultAppConfig = defaultAppConfig
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.dependencyManifest = dependencyManifest
        self.deprecatedAt = deprecatedAt
        self.fileManifest = fileManifest
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.publishStatus = publishStatus
        self.publishedAt = publishedAt
        self.status = status
        self.templateId = templateId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.variableSchema = variableSchema
        self.version = version
        self.versionNo = versionNo
    }
}

public struct StudioCatalogActionRecord: Codable {
    public let actionType: String?
    public let clientIpHash: String?
    public let createdAt: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let payloadHash: String?
    public let ratingScore: String?
    public let releaseId: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let reviewBody: String?
    public let reviewTitle: String?
    public let status: String?
    public let targetId: String?
    public let targetType: String?
    public let tenantId: String?
    public let traceId: String?
    public let userAgentHash: String?
    public let userId: String?
    public let uuid: String?


    public init(actionType: String? = nil, clientIpHash: String? = nil, createdAt: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, payloadHash: String? = nil, ratingScore: String? = nil, releaseId: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, reviewBody: String? = nil, reviewTitle: String? = nil, status: String? = nil, targetId: String? = nil, targetType: String? = nil, tenantId: String? = nil, traceId: String? = nil, userAgentHash: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.actionType = actionType
        self.clientIpHash = clientIpHash
        self.createdAt = createdAt
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.ratingScore = ratingScore
        self.releaseId = releaseId
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.reviewBody = reviewBody
        self.reviewTitle = reviewTitle
        self.status = status
        self.targetId = targetId
        self.targetType = targetType
        self.tenantId = tenantId
        self.traceId = traceId
        self.userAgentHash = userAgentHash
        self.userId = userId
        self.uuid = uuid
    }
}

public struct StudioCatalogArtifactRecord: Codable {
    public let artifactRef: String?
    public let artifactSizeBytes: String?
    public let artifactType: String?
    public let artifactUrl: String?
    public let checksumHash: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let deprecatedAt: String?
    public let frameworks: [String: String]?
    public let id: String?
    public let licenseName: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let osName: String?
    public let platformType: String?
    public let publishedAt: String?
    public let releaseNotes: String?
    public let runtime: String?
    public let status: String?
    public let targetId: String?
    public let targetType: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(artifactRef: String? = nil, artifactSizeBytes: String? = nil, artifactType: String? = nil, artifactUrl: String? = nil, checksumHash: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deprecatedAt: String? = nil, frameworks: [String: String]? = nil, id: String? = nil, licenseName: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, osName: String? = nil, platformType: String? = nil, publishedAt: String? = nil, releaseNotes: String? = nil, runtime: String? = nil, status: String? = nil, targetId: String? = nil, targetType: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.artifactRef = artifactRef
        self.artifactSizeBytes = artifactSizeBytes
        self.artifactType = artifactType
        self.artifactUrl = artifactUrl
        self.checksumHash = checksumHash
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.deprecatedAt = deprecatedAt
        self.frameworks = frameworks
        self.id = id
        self.licenseName = licenseName
        self.metadata = metadata
        self.organizationId = organizationId
        self.osName = osName
        self.platformType = platformType
        self.publishedAt = publishedAt
        self.releaseNotes = releaseNotes
        self.runtime = runtime
        self.status = status
        self.targetId = targetId
        self.targetType = targetType
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct StudioCatalogAssetRecord: Codable {
    public let altText: String?
    public let artifactId: String?
    public let assetType: String?
    public let assetUrl: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let durationSeconds: String?
    public let fileSize: String?
    public let height: Int?
    public let id: String?
    public let metadata: [String: String]?
    public let mimeType: String?
    public let organizationId: String?
    public let publishedAt: String?
    public let sortOrder: Int?
    public let status: String?
    public let targetId: String?
    public let targetType: String?
    public let tenantId: String?
    public let thumbnailUrl: String?
    public let title: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?
    public let width: Int?


    public init(altText: String? = nil, artifactId: String? = nil, assetType: String? = nil, assetUrl: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, durationSeconds: String? = nil, fileSize: String? = nil, height: Int? = nil, id: String? = nil, metadata: [String: String]? = nil, mimeType: String? = nil, organizationId: String? = nil, publishedAt: String? = nil, sortOrder: Int? = nil, status: String? = nil, targetId: String? = nil, targetType: String? = nil, tenantId: String? = nil, thumbnailUrl: String? = nil, title: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, width: Int? = nil) {
        self.altText = altText
        self.artifactId = artifactId
        self.assetType = assetType
        self.assetUrl = assetUrl
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.durationSeconds = durationSeconds
        self.fileSize = fileSize
        self.height = height
        self.id = id
        self.metadata = metadata
        self.mimeType = mimeType
        self.organizationId = organizationId
        self.publishedAt = publishedAt
        self.sortOrder = sortOrder
        self.status = status
        self.targetId = targetId
        self.targetType = targetType
        self.tenantId = tenantId
        self.thumbnailUrl = thumbnailUrl
        self.title = title
        self.updatedAt = updatedAt
        self.uuid = uuid
        self.version = version
        self.width = width
    }
}

public struct SystemInstallationStateRecord: Codable {
    public let catalogVersion: String?
    public let databaseEngine: String?
    public let environment: String?
    public let id: String?
    public let installationId: String?
    public let installedAt: String?
    public let lastCheckedAt: String?
    public let metadata: [String: String]?
    public let schemaVersion: String?
    public let seedProfile: String?
    public let status: String?
    public let upgradedAt: String?


    public init(catalogVersion: String? = nil, databaseEngine: String? = nil, environment: String? = nil, id: String? = nil, installationId: String? = nil, installedAt: String? = nil, lastCheckedAt: String? = nil, metadata: [String: String]? = nil, schemaVersion: String? = nil, seedProfile: String? = nil, status: String? = nil, upgradedAt: String? = nil) {
        self.catalogVersion = catalogVersion
        self.databaseEngine = databaseEngine
        self.environment = environment
        self.id = id
        self.installationId = installationId
        self.installedAt = installedAt
        self.lastCheckedAt = lastCheckedAt
        self.metadata = metadata
        self.schemaVersion = schemaVersion
        self.seedProfile = seedProfile
        self.status = status
        self.upgradedAt = upgradedAt
    }
}

public struct SystemSchemaMigrationRecord: Codable {
    public let checksum: String?
    public let errorMessage: String?
    public let finishedAt: String?
    public let id: String?
    public let migrationKey: String?
    public let migrationVersion: String?
    public let startedAt: String?
    public let status: String?


    public init(checksum: String? = nil, errorMessage: String? = nil, finishedAt: String? = nil, id: String? = nil, migrationKey: String? = nil, migrationVersion: String? = nil, startedAt: String? = nil, status: String? = nil) {
        self.checksum = checksum
        self.errorMessage = errorMessage
        self.finishedAt = finishedAt
        self.id = id
        self.migrationKey = migrationKey
        self.migrationVersion = migrationVersion
        self.startedAt = startedAt
        self.status = status
    }
}

public struct TurnResponsesCreateResult: Codable {
    public let code: String?
    public let data: ChatTurnCreateResponse?
    public let msg: String?


    public init(code: String? = nil, data: ChatTurnCreateResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct TurnsCreateResult: Codable {
    public let code: String?
    public let data: ChatTurnCreateResponse?
    public let msg: String?


    public init(code: String? = nil, data: ChatTurnCreateResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct UpdateApiKeyRequest: Codable {
    public let defaultForRuntime: Bool?
    public let expires: String?
    public let group: String?
    public let ipLimit: String?
    public let isUnlimitedQuota: Bool?
    public let modalities: [String]?
    public let name: String?
    public let quota: String?


    public init(defaultForRuntime: Bool? = nil, expires: String? = nil, group: String? = nil, ipLimit: String? = nil, isUnlimitedQuota: Bool? = nil, modalities: [String]? = nil, name: String? = nil, quota: String? = nil) {
        self.defaultForRuntime = defaultForRuntime
        self.expires = expires
        self.group = group
        self.ipLimit = ipLimit
        self.isUnlimitedQuota = isUnlimitedQuota
        self.modalities = modalities
        self.name = name
        self.quota = quota
    }
}

public struct UpdateApiKeyResponse: Codable {
    public let item: AppApiKeyItem?


    public init(item: AppApiKeyItem? = nil) {
        self.item = item
    }
}

public struct UpdateSettingsRequest: Codable {
    public let language: String?
    public let notifications: SettingsNotifications?
    public let timezone: String?
    public let webhookUrl: String?


    public init(language: String? = nil, notifications: SettingsNotifications? = nil, timezone: String? = nil, webhookUrl: String? = nil) {
        self.language = language
        self.notifications = notifications
        self.timezone = timezone
        self.webhookUrl = webhookUrl
    }
}

public struct UpdateSettingsResponse: Codable {
    public let success: Bool?


    public init(success: Bool? = nil) {
        self.success = success
    }
}

public struct UploadCompletionAttemptRecord: Codable {
    public let attemptNo: Int?
    public let completionStatus: String?
    public let createdAt: String?
    public let errorCode: String?
    public let errorMessageMasked: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let objectBlobId: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let providerRequestId: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let uploadSessionId: String?
    public let userId: String?
    public let uuid: String?


    public init(attemptNo: Int? = nil, completionStatus: String? = nil, createdAt: String? = nil, errorCode: String? = nil, errorMessageMasked: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, objectBlobId: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, providerRequestId: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, uploadSessionId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.attemptNo = attemptNo
        self.completionStatus = completionStatus
        self.createdAt = createdAt
        self.errorCode = errorCode
        self.errorMessageMasked = errorMessageMasked
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.objectBlobId = objectBlobId
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.providerRequestId = providerRequestId
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.uploadSessionId = uploadSessionId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct UploadPartRecord: Codable {
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let id: String?
    public let metadata: [String: String]?
    public let organizationId: String?
    public let partEtag: String?
    public let partNumber: Int?
    public let partSha256: String?
    public let presignedUrlExpiresAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uploadSessionId: String?
    public let uploadedAt: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, id: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, partEtag: String? = nil, partNumber: Int? = nil, partSha256: String? = nil, presignedUrlExpiresAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uploadSessionId: String? = nil, uploadedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.id = id
        self.metadata = metadata
        self.organizationId = organizationId
        self.partEtag = partEtag
        self.partNumber = partNumber
        self.partSha256 = partSha256
        self.presignedUrlExpiresAt = presignedUrlExpiresAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uploadSessionId = uploadSessionId
        self.uploadedAt = uploadedAt
        self.uuid = uuid
        self.version = version
    }
}

public struct UploadPresignGrantRecord: Codable {
    public let bucketId: String?
    public let canonicalHeaders: [String: String]?
    public let consumedAt: String?
    public let createdAt: String?
    public let expiresAt: String?
    public let id: String?
    public let legalHold: Bool?
    public let metadata: [String: String]?
    public let method: String?
    public let objectKey: String?
    public let organizationId: String?
    public let payloadHash: String?
    public let providerId: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let signedHeaders: [String: String]?
    public let status: String?
    public let tenantId: String?
    public let traceId: String?
    public let uploadPartId: String?
    public let uploadSessionId: String?
    public let userId: String?
    public let uuid: String?


    public init(bucketId: String? = nil, canonicalHeaders: [String: String]? = nil, consumedAt: String? = nil, createdAt: String? = nil, expiresAt: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, method: String? = nil, objectKey: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, providerId: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, signedHeaders: [String: String]? = nil, status: String? = nil, tenantId: String? = nil, traceId: String? = nil, uploadPartId: String? = nil, uploadSessionId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.bucketId = bucketId
        self.canonicalHeaders = canonicalHeaders
        self.consumedAt = consumedAt
        self.createdAt = createdAt
        self.expiresAt = expiresAt
        self.id = id
        self.legalHold = legalHold
        self.metadata = metadata
        self.method = method
        self.objectKey = objectKey
        self.organizationId = organizationId
        self.payloadHash = payloadHash
        self.providerId = providerId
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.signedHeaders = signedHeaders
        self.status = status
        self.tenantId = tenantId
        self.traceId = traceId
        self.uploadPartId = uploadPartId
        self.uploadSessionId = uploadSessionId
        self.userId = userId
        self.uuid = uuid
    }
}

public struct UploadSessionRecord: Codable {
    public let abortedAt: String?
    public let bucketId: String?
    public let completedAt: String?
    public let contentType: String?
    public let createdAt: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let expectedSha256: String?
    public let expiresAt: String?
    public let id: String?
    public let idempotencyKey: String?
    public let logicalScope: String?
    public let metadata: [String: String]?
    public let objectKey: String?
    public let organizationId: String?
    public let originalFilename: String?
    public let ownerId: String?
    public let ownerType: String?
    public let providerId: String?
    public let requestId: String?
    public let s3UploadId: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let uploadMode: String?
    public let uploadSessionNo: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(abortedAt: String? = nil, bucketId: String? = nil, completedAt: String? = nil, contentType: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, expectedSha256: String? = nil, expiresAt: String? = nil, id: String? = nil, idempotencyKey: String? = nil, logicalScope: String? = nil, metadata: [String: String]? = nil, objectKey: String? = nil, organizationId: String? = nil, originalFilename: String? = nil, ownerId: String? = nil, ownerType: String? = nil, providerId: String? = nil, requestId: String? = nil, s3UploadId: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, uploadMode: String? = nil, uploadSessionNo: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.abortedAt = abortedAt
        self.bucketId = bucketId
        self.completedAt = completedAt
        self.contentType = contentType
        self.createdAt = createdAt
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.expectedSha256 = expectedSha256
        self.expiresAt = expiresAt
        self.id = id
        self.idempotencyKey = idempotencyKey
        self.logicalScope = logicalScope
        self.metadata = metadata
        self.objectKey = objectKey
        self.organizationId = organizationId
        self.originalFilename = originalFilename
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.providerId = providerId
        self.requestId = requestId
        self.s3UploadId = s3UploadId
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.uploadMode = uploadMode
        self.uploadSessionNo = uploadSessionNo
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct UsageLogItem: Codable {
    public let baseInputPrice: String?
    public let baseOutputPrice: String?
    public let cacheReadPrice: String?
    public let cacheReadTokens: Int?
    public let cost: String?
    public let errorCode: String?
    public let errorMessage: String?
    public let errorType: String?
    public let group: String?
    public let httpStatus: Int?
    public let id: String?
    public let inputTokens: Int?
    public let ip: String?
    public let isStream: Bool?
    public let model: String?
    public let multiplier: String?
    public let outputTokens: Int?
    public let path: String?
    public let providerNativeModel: String?
    public let reasoningEffort: String?
    public let requestId: String?
    public let requestedModelCatalogKey: String?
    public let status: String?
    public let time: String?
    public let tokenName: String?
    public let totalTime: String?
    public let ttft: String?
    public let type: String?


    public init(baseInputPrice: String? = nil, baseOutputPrice: String? = nil, cacheReadPrice: String? = nil, cacheReadTokens: Int? = nil, cost: String? = nil, errorCode: String? = nil, errorMessage: String? = nil, errorType: String? = nil, group: String? = nil, httpStatus: Int? = nil, id: String? = nil, inputTokens: Int? = nil, ip: String? = nil, isStream: Bool? = nil, model: String? = nil, multiplier: String? = nil, outputTokens: Int? = nil, path: String? = nil, providerNativeModel: String? = nil, reasoningEffort: String? = nil, requestId: String? = nil, requestedModelCatalogKey: String? = nil, status: String? = nil, time: String? = nil, tokenName: String? = nil, totalTime: String? = nil, ttft: String? = nil, type: String? = nil) {
        self.baseInputPrice = baseInputPrice
        self.baseOutputPrice = baseOutputPrice
        self.cacheReadPrice = cacheReadPrice
        self.cacheReadTokens = cacheReadTokens
        self.cost = cost
        self.errorCode = errorCode
        self.errorMessage = errorMessage
        self.errorType = errorType
        self.group = group
        self.httpStatus = httpStatus
        self.id = id
        self.inputTokens = inputTokens
        self.ip = ip
        self.isStream = isStream
        self.model = model
        self.multiplier = multiplier
        self.outputTokens = outputTokens
        self.path = path
        self.providerNativeModel = providerNativeModel
        self.reasoningEffort = reasoningEffort
        self.requestId = requestId
        self.requestedModelCatalogKey = requestedModelCatalogKey
        self.status = status
        self.time = time
        self.tokenName = tokenName
        self.totalTime = totalTime
        self.ttft = ttft
        self.type = type
    }
}

public struct UsageLogsListResult: Codable {
    public let code: String?
    public let data: UsageLogsResponse?
    public let msg: String?


    public init(code: String? = nil, data: UsageLogsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct UsageLogsResponse: Codable {
    public let logs: [UsageLogItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(logs: [UsageLogItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.logs = logs
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct UsageSnapshot: Codable {
    public let cachedTokens: Int?
    public let inputTokens: Int?
    public let outputTokens: Int?
    public let totalTokens: Int?


    public init(cachedTokens: Int? = nil, inputTokens: Int? = nil, outputTokens: Int? = nil, totalTokens: Int? = nil) {
        self.cachedTokens = cachedTokens
        self.inputTokens = inputTokens
        self.outputTokens = outputTokens
        self.totalTokens = totalTokens
    }
}

public struct UsersCurrentCommentsListResult: Codable {
    public let code: String?
    public let data: ForumCommentPage?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentPage? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct UsersCurrentRetrieveResult: Codable {
    public let code: String?
    public let data: IamUserResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamUserResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct UsersCurrentSkillsListResult: Codable {
    public let code: String?
    public let data: AppInstalledSkillsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppInstalledSkillsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct UsersSettingsRetrieveResult: Codable {
    public let code: String?
    public let data: SettingsDataResponse?
    public let msg: String?


    public init(code: String? = nil, data: SettingsDataResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct UsersSettingsUpdateResult: Codable {
    public let code: String?
    public let data: UpdateSettingsResponse?
    public let msg: String?


    public init(code: String? = nil, data: UpdateSettingsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct VerificationCodesCreateResult: Codable {
    public let code: String?
    public let data: IamVerificationCodeResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamVerificationCodeResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct VerificationCodesVerifyResult: Codable {
    public let code: String?
    public let data: IamVerificationCodeVerifyResponse?
    public let msg: String?


    public init(code: String? = nil, data: IamVerificationCodeVerifyResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct WalletAccountsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct WalletExchangeRateRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct WalletLedgerEntriesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct WalletOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct WalletPointsExchangeRulesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct WalletTokensRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}
