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
    public let avatar: MediaResource?
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


    public init(avatar: MediaResource? = nil, capabilities: AgentCapabilities? = nil, code: String? = nil, createdAt: String? = nil, defaultVersion: AgentVersionItem? = nil, description: String? = nil, id: String? = nil, name: String? = nil, ownerUserId: Int? = nil, status: String? = nil, templateSource: String? = nil, updatedAt: String? = nil, visibility: String? = nil) {
        self.avatar = avatar
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
    public let runtime: String?
    public let sourceSurface: String?
    public let traceId: String?


    public init(agentId: String? = nil, agentVersionId: String? = nil, executionMode: String? = nil, inputMessage: String? = nil, memorySpaceId: String? = nil, metadata: [String: String]? = nil, model: String? = nil, runtime: String? = nil, sourceSurface: String? = nil, traceId: String? = nil) {
        self.agentId = agentId
        self.agentVersionId = agentVersionId
        self.executionMode = executionMode
        self.inputMessage = inputMessage
        self.memorySpaceId = memorySpaceId
        self.metadata = metadata
        self.model = model
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

public struct AppApiKeyItem: Codable {
    public let channelGroup: String?
    public let channelGroupName: String?
    public let copyableKey: String?
    public let created: String?
    public let defaultForRuntime: Bool?
    public let expires: String?
    public let id: String?
    public let ipLimit: String?
    public let maskedKey: String?
    public let modalities: [String]?
    public let name: String?
    public let quota: String?
    public let rate: String?
    public let status: String?
    public let usedQuota: String?


    public init(channelGroup: String? = nil, channelGroupName: String? = nil, copyableKey: String? = nil, created: String? = nil, defaultForRuntime: Bool? = nil, expires: String? = nil, id: String? = nil, ipLimit: String? = nil, maskedKey: String? = nil, modalities: [String]? = nil, name: String? = nil, quota: String? = nil, rate: String? = nil, status: String? = nil, usedQuota: String? = nil) {
        self.channelGroup = channelGroup
        self.channelGroupName = channelGroupName
        self.copyableKey = copyableKey
        self.created = created
        self.defaultForRuntime = defaultForRuntime
        self.expires = expires
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
    public let groups: [AppChannelGroup]?
    public let items: [AppApiKeyItem]?


    public init(groups: [AppChannelGroup]? = nil, items: [AppApiKeyItem]? = nil) {
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
    public let image: MediaResource?
    public let name: String?
    public let rating: Double?
    public let releases: [AppReleaseItem]?
    public let screenshots: [MediaResource]?


    public init(category: String? = nil, description: String? = nil, developer: String? = nil, downloads: String? = nil, features: [String]? = nil, id: String? = nil, image: MediaResource? = nil, name: String? = nil, rating: Double? = nil, releases: [AppReleaseItem]? = nil, screenshots: [MediaResource]? = nil) {
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

public struct AppChannelGroup: Codable {
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

public struct AppChannelGroupListResponse: Codable {
    public let items: [AppChannelGroup]?


    public init(items: [AppChannelGroup]? = nil) {
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
    public let image: MediaResource?
    public let name: String?
    public let rating: Double?
    public let releases: [AppReleaseItem]?
    public let screenshots: [MediaResource]?


    public init(category: String? = nil, description: String? = nil, developer: String? = nil, downloads: String? = nil, features: [String]? = nil, id: String? = nil, image: MediaResource? = nil, name: String? = nil, rating: Double? = nil, releases: [AppReleaseItem]? = nil, screenshots: [MediaResource]? = nil) {
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
    public let officialReferencePrices: [AppModelCatalogReferencePrice]?
    public let outputModalities: [String]?
    public let priceAvailability: AppModelCatalogPriceAvailability?
    public let providerCodes: [String]?
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


    public init(apiFormat: String? = nil, capabilities: [String]? = nil, capabilityIntro: String? = nil, catalogKey: String? = nil, categories: [String]? = nil, contextTokens: Int? = nil, description: String? = nil, displayName: String? = nil, groups: [String]? = nil, inputModalities: [String]? = nil, limitations: [String]? = nil, maxOutputTokens: Int? = nil, modalities: [String]? = nil, model: String? = nil, officialReferencePrices: [AppModelCatalogReferencePrice]? = nil, outputModalities: [String]? = nil, priceAvailability: AppModelCatalogPriceAvailability? = nil, providerCodes: [String]? = nil, releaseStage: Int? = nil, replacementModel: String? = nil, routingState: Int? = nil, shelfState: Int? = nil, supportedLanguages: [String]? = nil, supportsJsonSchema: Bool? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, trainingDataCutoff: String? = nil, useCases: [String]? = nil, vendor: String? = nil, vendorCode: String? = nil) {
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
        self.officialReferencePrices = officialReferencePrices
        self.outputModalities = outputModalities
        self.priceAvailability = priceAvailability
        self.providerCodes = providerCodes
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
    public let regionCode: String?
    public let unitPrice: String?


    public init(billingMeter: String? = nil, currency: String? = nil, regionCode: String? = nil, unitPrice: String? = nil) {
        self.billingMeter = billingMeter
        self.currency = currency
        self.regionCode = regionCode
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
    public let artifact: MediaResource?
    public let id: String?
    public let os: String?
    public let platformType: String?
    public let releaseDate: String?
    public let size: String?
    public let version: String?
    public let whatsNew: String?


    public init(artifact: MediaResource? = nil, id: String? = nil, os: String? = nil, platformType: String? = nil, releaseDate: String? = nil, size: String? = nil, version: String? = nil, whatsNew: String? = nil) {
        self.artifact = artifact
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

public struct ChannelGroupsListResult: Codable {
    public let code: String?
    public let data: AppChannelGroupListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AppChannelGroupListResponse? = nil, msg: String? = nil) {
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

public struct CommerceMembershipPurchaseRequest: Codable {
    public let couponId: String?
    public let packageId: Int?


    public init(couponId: String? = nil, packageId: Int? = nil) {
        self.couponId = couponId
        self.packageId = packageId
    }
}

public struct CommerceOperationResponse: Codable {
    public let paymentId: String?
    public let qrCode: MediaResource?
    public let qrCodePayload: String?
    public let requestNo: String?
    public let status: String?
    public let success: Bool?


    public init(paymentId: String? = nil, qrCode: MediaResource? = nil, qrCodePayload: String? = nil, requestNo: String? = nil, status: String? = nil, success: Bool? = nil) {
        self.paymentId = paymentId
        self.qrCode = qrCode
        self.qrCodePayload = qrCodePayload
        self.requestNo = requestNo
        self.status = status
        self.success = success
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

public struct CommercePaymentAttemptResponse: Codable {
    public let item: CommercePaymentAttemptItem?


    public init(item: CommercePaymentAttemptItem? = nil) {
        self.item = item
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

public struct CommerceProductMediaItem: Codable {
    public let altText: String?
    public let id: String?
    public let mediaRole: String?
    public let ownerId: String?
    public let ownerType: String?
    public let resource: MediaResource?
    public let sortOrder: Int?
    public let status: String?


    public init(altText: String? = nil, id: String? = nil, mediaRole: String? = nil, ownerId: String? = nil, ownerType: String? = nil, resource: MediaResource? = nil, sortOrder: Int? = nil, status: String? = nil) {
        self.altText = altText
        self.id = id
        self.mediaRole = mediaRole
        self.ownerId = ownerId
        self.ownerType = ownerType
        self.resource = resource
        self.sortOrder = sortOrder
        self.status = status
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
    public let categoryIds: [String]?
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


    public init(brand: String? = nil, categoryIds: [String]? = nil, createdAt: String? = nil, currencyCode: String? = nil, defaultSkuId: String? = nil, description: String? = nil, id: String? = nil, media: [CommerceProductMediaItem]? = nil, minPriceAmount: String? = nil, productType: String? = nil, publishedAt: String? = nil, spuNo: String? = nil, status: String? = nil, subtitle: String? = nil, title: String? = nil, updatedAt: String? = nil) {
        self.brand = brand
        self.categoryIds = categoryIds
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

public struct CommerceRechargeCheckoutStatusResponse: Codable {
    public let amount: String?
    public let cashierUrl: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let expiresAt: String?
    public let nextAction: String?
    public let orderNo: String?
    public let orderStatus: String?
    public let outTradeNo: String?
    public let paidAt: String?
    public let paymentMethod: String?
    public let paymentProduct: String?
    public let paymentStatus: String?
    public let points: Int?
    public let providerCode: String?
    public let qrCodePayload: String?
    public let rechargeStatus: String?
    public let requestPaymentPayload: [String: String]?
    public let status: String?


    public init(amount: String? = nil, cashierUrl: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, expiresAt: String? = nil, nextAction: String? = nil, orderNo: String? = nil, orderStatus: String? = nil, outTradeNo: String? = nil, paidAt: String? = nil, paymentMethod: String? = nil, paymentProduct: String? = nil, paymentStatus: String? = nil, points: Int? = nil, providerCode: String? = nil, qrCodePayload: String? = nil, rechargeStatus: String? = nil, requestPaymentPayload: [String: String]? = nil, status: String? = nil) {
        self.amount = amount
        self.cashierUrl = cashierUrl
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.expiresAt = expiresAt
        self.nextAction = nextAction
        self.orderNo = orderNo
        self.orderStatus = orderStatus
        self.outTradeNo = outTradeNo
        self.paidAt = paidAt
        self.paymentMethod = paymentMethod
        self.paymentProduct = paymentProduct
        self.paymentStatus = paymentStatus
        self.points = points
        self.providerCode = providerCode
        self.qrCodePayload = qrCodePayload
        self.rechargeStatus = rechargeStatus
        self.requestPaymentPayload = requestPaymentPayload
        self.status = status
    }
}

public struct CommerceRechargeOrderCreateRequest: Codable {
    public let amount: String?
    public let clientRequestNo: String?
    public let currencyCode: String?
    public let packageId: String?
    public let source: String?


    public init(amount: String? = nil, clientRequestNo: String? = nil, currencyCode: String? = nil, packageId: String? = nil, source: String? = nil) {
        self.amount = amount
        self.clientRequestNo = clientRequestNo
        self.currencyCode = currencyCode
        self.packageId = packageId
        self.source = source
    }
}

public struct CommerceRechargeOrderCreateResponse: Codable {
    public let amount: String?
    public let cashierUrl: String?
    public let currencyCode: String?
    public let nextAction: String?
    public let orderNo: String?
    public let paymentMethod: String?
    public let paymentProduct: String?
    public let points: Int?
    public let providerCode: String?
    public let qrCodePayload: String?
    public let requestPaymentPayload: [String: String]?
    public let status: String?
    public let success: Bool?


    public init(amount: String? = nil, cashierUrl: String? = nil, currencyCode: String? = nil, nextAction: String? = nil, orderNo: String? = nil, paymentMethod: String? = nil, paymentProduct: String? = nil, points: Int? = nil, providerCode: String? = nil, qrCodePayload: String? = nil, requestPaymentPayload: [String: String]? = nil, status: String? = nil, success: Bool? = nil) {
        self.amount = amount
        self.cashierUrl = cashierUrl
        self.currencyCode = currencyCode
        self.nextAction = nextAction
        self.orderNo = orderNo
        self.paymentMethod = paymentMethod
        self.paymentProduct = paymentProduct
        self.points = points
        self.providerCode = providerCode
        self.qrCodePayload = qrCodePayload
        self.requestPaymentPayload = requestPaymentPayload
        self.status = status
        self.success = success
    }
}

public struct CommerceRechargePackageItem: Codable {
    public let bonusPoints: Int?
    public let currencyCode: String?
    public let grantAmount: Int?
    public let id: String?
    public let name: String?
    public let packageNo: String?
    public let points: Int?
    public let priceAmount: String?
    public let skuId: String?
    public let status: String?
    public let updatedAt: String?


    public init(bonusPoints: Int? = nil, currencyCode: String? = nil, grantAmount: Int? = nil, id: String? = nil, name: String? = nil, packageNo: String? = nil, points: Int? = nil, priceAmount: String? = nil, skuId: String? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.bonusPoints = bonusPoints
        self.currencyCode = currencyCode
        self.grantAmount = grantAmount
        self.id = id
        self.name = name
        self.packageNo = packageNo
        self.points = points
        self.priceAmount = priceAmount
        self.skuId = skuId
        self.status = status
        self.updatedAt = updatedAt
    }
}

public struct CommerceRechargePackageListResponse: Codable {
    public let items: [CommerceRechargePackageItem]?


    public init(items: [CommerceRechargePackageItem]? = nil) {
        self.items = items
    }
}

public struct CommerceRechargeSettingsResponse: Codable {
    public let baseCurrencyCode: String?
    public let basePointsPerCny: String?
    public let currencyToCnyRates: [String: String]?
    public let previewExamples: [String: [String: [String: Any]]]?


    public init(baseCurrencyCode: String? = nil, basePointsPerCny: String? = nil, currencyToCnyRates: [String: String]? = nil, previewExamples: [String: [String: [String: Any]]]? = nil) {
        self.baseCurrencyCode = baseCurrencyCode
        self.basePointsPerCny = basePointsPerCny
        self.currencyToCnyRates = currencyToCnyRates
        self.previewExamples = previewExamples
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
    public let video: MediaResource?


    public init(category: String? = nil, contactEmail: String? = nil, contactName: String? = nil, description: String? = nil, externalBvid: String? = nil, notes: String? = nil, sourceProvider: String? = nil, title: String? = nil, video: MediaResource? = nil) {
        self.category = category
        self.contactEmail = contactEmail
        self.contactName = contactName
        self.description = description
        self.externalBvid = externalBvid
        self.notes = notes
        self.sourceProvider = sourceProvider
        self.title = title
        self.video = video
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
    public let video: MediaResource?


    public init(applicationId: Int? = nil, category: String? = nil, contactEmail: String? = nil, contactName: String? = nil, description: String? = nil, externalBvid: String? = nil, id: String? = nil, sourceProvider: String? = nil, status: String? = nil, submittedAt: String? = nil, title: String? = nil, video: MediaResource? = nil) {
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
        self.video = video
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
    public let video: MediaResource?


    public init(contentType: String? = nil, fileName: String? = nil, sha256: String? = nil, sizeBytes: Int? = nil, uploadedAt: String? = nil, video: MediaResource? = nil) {
        self.contentType = contentType
        self.fileName = fileName
        self.sha256 = sha256
        self.sizeBytes = sizeBytes
        self.uploadedAt = uploadedAt
        self.video = video
    }
}

public struct CourseCategoryItem: Codable {
    public let code: String?
    public let courseCount: Int?
    public let description: String?
    public let iconKey: String?
    public let id: String?
    public let label: String?
    public let name: String?
    public let sortWeight: Int?


    public init(code: String? = nil, courseCount: Int? = nil, description: String? = nil, iconKey: String? = nil, id: String? = nil, label: String? = nil, name: String? = nil, sortWeight: Int? = nil) {
        self.code = code
        self.courseCount = courseCount
        self.description = description
        self.iconKey = iconKey
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
    public let thumbnail: MediaResource?
    public let title: String?


    public init(category: String? = nil, categoryLabel: String? = nil, commentCount: Int? = nil, content: String? = nil, contentId: Int? = nil, courseCode: String? = nil, currency: String? = nil, description: String? = nil, durationText: String? = nil, engagement: CourseEngagement? = nil, externalBvid: String? = nil, id: String? = nil, instructor: CourseInstructor? = nil, isCollection: Bool? = nil, lessonsCount: Int? = nil, level: Int? = nil, levelLabel: String? = nil, priceAmount: String? = nil, publishedAt: String? = nil, ratingScore: Double? = nil, relatedCourses: [CourseItem]? = nil, sections: [CourseSectionItem]? = nil, source: CourseOverviewSource? = nil, studentsCount: Int? = nil, tags: [String]? = nil, thumbnail: MediaResource? = nil, title: String? = nil) {
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
        self.thumbnail = thumbnail
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
    public let avatar: MediaResource?
    public let bio: String?
    public let name: String?
    public let title: String?


    public init(avatar: MediaResource? = nil, bio: String? = nil, name: String? = nil, title: String? = nil) {
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
    public let thumbnail: MediaResource?
    public let title: String?


    public init(category: String? = nil, categoryLabel: String? = nil, commentCount: Int? = nil, content: String? = nil, contentId: Int? = nil, courseCode: String? = nil, currency: String? = nil, description: String? = nil, durationText: String? = nil, engagement: CourseEngagement? = nil, externalBvid: String? = nil, id: String? = nil, instructor: CourseInstructor? = nil, isCollection: Bool? = nil, lessonsCount: Int? = nil, level: Int? = nil, levelLabel: String? = nil, priceAmount: String? = nil, publishedAt: String? = nil, ratingScore: Double? = nil, studentsCount: Int? = nil, tags: [String]? = nil, thumbnail: MediaResource? = nil, title: String? = nil) {
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
        self.thumbnail = thumbnail
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
    public let video: MediaResource?


    public init(content: String? = nil, description: String? = nil, durationSeconds: Int? = nil, durationText: String? = nil, externalBvid: String? = nil, freePreview: Bool? = nil, id: String? = nil, lessonId: Int? = nil, lessonNo: Int? = nil, number: Int? = nil, sortOrder: Int? = nil, sourceProvider: String? = nil, title: String? = nil, video: MediaResource? = nil) {
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
        self.video = video
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
    public let channelGroup: String?
    public let defaultForRuntime: Bool?
    public let expires: String?
    public let ipLimit: String?
    public let isUnlimitedQuota: Bool?
    public let modalities: [String]?
    public let name: String?
    public let quota: String?


    public init(channelGroup: String? = nil, defaultForRuntime: Bool? = nil, expires: String? = nil, ipLimit: String? = nil, isUnlimitedQuota: Bool? = nil, modalities: [String]? = nil, name: String? = nil, quota: String? = nil) {
        self.channelGroup = channelGroup
        self.defaultForRuntime = defaultForRuntime
        self.expires = expires
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
    public let avatar: MediaResource?
    public let bio: String?
    public let id: Int?
    public let isFollowing: Bool?
    public let name: String?


    public init(avatar: MediaResource? = nil, bio: String? = nil, id: Int? = nil, isFollowing: Bool? = nil, name: String? = nil) {
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
    public let qrCode: MediaResource?
    public let tone: String?
    public let url: String?


    public init(id: String? = nil, label: String? = nil, qrCode: MediaResource? = nil, tone: String? = nil, url: String? = nil) {
        self.id = id
        self.label = label
        self.qrCode = qrCode
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
    public let images: [MediaResource]?
    public let source: String?
    public let sourceUrl: String?
    public let tags: [String]?
    public let title: String?


    public init(categoryId: Int? = nil, content: String? = nil, images: [MediaResource]? = nil, source: String? = nil, sourceUrl: String? = nil, tags: [String]? = nil, title: String? = nil) {
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
    public let cover: MediaResource?
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


    public init(author: ForumAuthor? = nil, categoryId: Int? = nil, commentCount: Int? = nil, content: String? = nil, contentType: String? = nil, cover: MediaResource? = nil, createdAt: String? = nil, id: Int? = nil, isCollected: Bool? = nil, isHot: Bool? = nil, isLiked: Bool? = nil, isRecommended: Bool? = nil, isTop: Bool? = nil, likeCount: Int? = nil, shareCount: Int? = nil, summary: String? = nil, tags: [String]? = nil, title: String? = nil, updatedAt: String? = nil, viewCount: Int? = nil) {
        self.author = author
        self.categoryId = categoryId
        self.commentCount = commentCount
        self.content = content
        self.contentType = contentType
        self.cover = cover
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
    public let asset: MediaResource?
    public let createdAt: String?
    public let date: String?
    public let durationSeconds: Int?
    public let id: String?
    public let images: [MediaResource]?
    public let modelCatalogKey: String?
    public let modelInfo: String?
    public let outputText: String?
    public let prompt: String?
    public let status: String?
    public let type: String?
    public let updatedAt: String?
    public let videos: [MediaResource]?


    public init(aspectRatio: String? = nil, asset: MediaResource? = nil, createdAt: String? = nil, date: String? = nil, durationSeconds: Int? = nil, id: String? = nil, images: [MediaResource]? = nil, modelCatalogKey: String? = nil, modelInfo: String? = nil, outputText: String? = nil, prompt: String? = nil, status: String? = nil, type: String? = nil, updatedAt: String? = nil, videos: [MediaResource]? = nil) {
        self.aspectRatio = aspectRatio
        self.asset = asset
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
        self.videos = videos
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

public struct IamUserResponse: Codable {
    public let avatar: MediaResource?
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


    public init(avatar: MediaResource? = nil, displayName: String? = nil, email: String? = nil, id: String? = nil, isVerified: Bool? = nil, language: String? = nil, lastLogin: String? = nil, lastLoginIp: String? = nil, passwordLastChanged: String? = nil, phone: String? = nil, registeredAt: String? = nil, status: String? = nil, thirdPartyBound: String? = nil, twoFactorEnabled: Bool? = nil, username: String? = nil) {
        self.avatar = avatar
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

public struct MediaAccess: Codable {
    public let expiresAt: String?
    public let visibility: String?


    public init(expiresAt: String? = nil, visibility: String? = nil) {
        self.expiresAt = expiresAt
        self.visibility = visibility
    }
}

public struct MediaAiProvenance: Codable {
    public let generationTaskId: String?
    public let model: String?
    public let moderationStatus: String?
    public let promptId: String?
    public let provenance: String?
    public let provider: String?
    public let safetyLabels: [String]?
    public let seed: String?
    public let sourceMediaIds: [String]?


    public init(generationTaskId: String? = nil, model: String? = nil, moderationStatus: String? = nil, promptId: String? = nil, provenance: String? = nil, provider: String? = nil, safetyLabels: [String]? = nil, seed: String? = nil, sourceMediaIds: [String]? = nil) {
        self.generationTaskId = generationTaskId
        self.model = model
        self.moderationStatus = moderationStatus
        self.promptId = promptId
        self.provenance = provenance
        self.provider = provider
        self.safetyLabels = safetyLabels
        self.seed = seed
        self.sourceMediaIds = sourceMediaIds
    }
}

public struct MediaChecksum: Codable {
    public let algorithm: String?
    public let value: String?


    public init(algorithm: String? = nil, value: String? = nil) {
        self.algorithm = algorithm
        self.value = value
    }
}

public struct MediaResource: Codable {
    public let access: MediaAccess?
    public let ai: MediaAiProvenance?
    public let altText: String?
    public let bucketId: String?
    public let checksum: MediaChecksum?
    public let durationSeconds: Double?
    public let fileName: String?
    public let height: Int?
    public let id: String?
    public let kind: String?
    public let metadata: [String: String]?
    public let mimeType: String?
    public let objectBlobId: String?
    public let objectKey: String?
    public let objectVersion: String?
    public let poster: MediaResource?
    public let publicUrl: String?
    public let sizeBytes: String?
    public let source: String?
    public let thumbnails: [MediaResource]?
    public let title: String?
    public let uri: String?
    public let url: String?
    public let variants: [MediaResource]?
    public let width: Int?


    public init(access: MediaAccess? = nil, ai: MediaAiProvenance? = nil, altText: String? = nil, bucketId: String? = nil, checksum: MediaChecksum? = nil, durationSeconds: Double? = nil, fileName: String? = nil, height: Int? = nil, id: String? = nil, kind: String? = nil, metadata: [String: String]? = nil, mimeType: String? = nil, objectBlobId: String? = nil, objectKey: String? = nil, objectVersion: String? = nil, poster: MediaResource? = nil, publicUrl: String? = nil, sizeBytes: String? = nil, source: String? = nil, thumbnails: [MediaResource]? = nil, title: String? = nil, uri: String? = nil, url: String? = nil, variants: [MediaResource]? = nil, width: Int? = nil) {
        self.access = access
        self.ai = ai
        self.altText = altText
        self.bucketId = bucketId
        self.checksum = checksum
        self.durationSeconds = durationSeconds
        self.fileName = fileName
        self.height = height
        self.id = id
        self.kind = kind
        self.metadata = metadata
        self.mimeType = mimeType
        self.objectBlobId = objectBlobId
        self.objectKey = objectKey
        self.objectVersion = objectVersion
        self.poster = poster
        self.publicUrl = publicUrl
        self.sizeBytes = sizeBytes
        self.source = source
        self.thumbnails = thumbnails
        self.title = title
        self.uri = uri
        self.url = url
        self.variants = variants
        self.width = width
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

public struct PromotionOperationResponse: Codable {
    public let paymentId: String?
    public let qrCode: MediaResource?
    public let qrCodePayload: String?
    public let requestNo: String?
    public let status: String?
    public let success: Bool?


    public init(paymentId: String? = nil, qrCode: MediaResource? = nil, qrCodePayload: String? = nil, requestNo: String? = nil, status: String? = nil, success: Bool? = nil) {
        self.paymentId = paymentId
        self.qrCode = qrCode
        self.qrCodePayload = qrCodePayload
        self.requestNo = requestNo
        self.status = status
        self.success = success
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
    public let data: CommerceRechargeOrderCreateResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceRechargeOrderCreateResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RechargesOrdersRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceRechargeCheckoutStatusResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceRechargeCheckoutStatusResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RechargesPackagesListResult: Codable {
    public let code: String?
    public let data: CommerceRechargePackageListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceRechargePackageListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RechargesSettingsRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceRechargeSettingsResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceRechargeSettingsResponse? = nil, msg: String? = nil) {
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

public struct RoutingApiKeyItem: Codable {
    public let copyableKey: String?
    public let createdAt: String?
    public let displayKey: String?
    public let id: String?
    public let name: String?
    public let status: String?
    public let totalUsage: String?


    public init(copyableKey: String? = nil, createdAt: String? = nil, displayKey: String? = nil, id: String? = nil, name: String? = nil, status: String? = nil, totalUsage: String? = nil) {
        self.copyableKey = copyableKey
        self.createdAt = createdAt
        self.displayKey = displayKey
        self.id = id
        self.name = name
        self.status = status
        self.totalUsage = totalUsage
    }
}

public struct RoutingApiKeysListResult: Codable {
    public let code: String?
    public let data: RoutingApiKeysResponse?
    public let msg: String?


    public init(code: String? = nil, data: RoutingApiKeysResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RoutingApiKeysResponse: Codable {
    public let items: [RoutingApiKeyItem]?


    public init(items: [RoutingApiKeyItem]? = nil) {
        self.items = items
    }
}

public struct RoutingChannelItem: Codable {
    public let accessType: String?
    public let apiKey: String?
    public let balance: String?
    public let baseUrl: String?
    public let capabilities: [String]?
    public let circuitBreakerPolicy: RoutingCircuitBreakerPolicy?
    public let errors: Int?
    public let id: String?
    public let isMultimodal: Bool?
    public let latency: String?
    public let models: [String]?
    public let name: String?
    public let protocol_: String?
    public let provider: String?
    public let providerCode: String?
    public let retryPolicy: RoutingRetryPolicy?
    public let rpm: Int?
    public let status: String?
    public let timeoutMs: Int?
    public let vendor: String?
    public let weight: Int?


    public init(accessType: String? = nil, apiKey: String? = nil, balance: String? = nil, baseUrl: String? = nil, capabilities: [String]? = nil, circuitBreakerPolicy: RoutingCircuitBreakerPolicy? = nil, errors: Int? = nil, id: String? = nil, isMultimodal: Bool? = nil, latency: String? = nil, models: [String]? = nil, name: String? = nil, protocol_: String? = nil, provider: String? = nil, providerCode: String? = nil, retryPolicy: RoutingRetryPolicy? = nil, rpm: Int? = nil, status: String? = nil, timeoutMs: Int? = nil, vendor: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.apiKey = apiKey
        self.balance = balance
        self.baseUrl = baseUrl
        self.capabilities = capabilities
        self.circuitBreakerPolicy = circuitBreakerPolicy
        self.errors = errors
        self.id = id
        self.isMultimodal = isMultimodal
        self.latency = latency
        self.models = models
        self.name = name
        self.protocol_ = protocol_
        self.provider = provider
        self.providerCode = providerCode
        self.retryPolicy = retryPolicy
        self.rpm = rpm
        self.status = status
        self.timeoutMs = timeoutMs
        self.vendor = vendor
        self.weight = weight
    }
}

public struct RoutingChannelsListResult: Codable {
    public let code: String?
    public let data: RoutingChannelsResponse?
    public let msg: String?


    public init(code: String? = nil, data: RoutingChannelsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RoutingChannelsResponse: Codable {
    public let items: [RoutingChannelItem]?


    public init(items: [RoutingChannelItem]? = nil) {
        self.items = items
    }
}

public struct RoutingCircuitBreakerPolicy: Codable {
    public let failureThreshold: Int?


    public init(failureThreshold: Int? = nil) {
        self.failureThreshold = failureThreshold
    }
}

public struct RoutingModelStats: Codable {
    public let lat: String?
    public let m: String?
    public let req: String?
    public let sr: String?
    public let tok: String?


    public init(lat: String? = nil, m: String? = nil, req: String? = nil, sr: String? = nil, tok: String? = nil) {
        self.lat = lat
        self.m = m
        self.req = req
        self.sr = sr
        self.tok = tok
    }
}

public struct RoutingRequestTraceItem: Codable {
    public let channel: String?
    public let duration: String?
    public let endedAt: String?
    public let errorMessageMasked: String?
    public let errorType: String?
    public let httpMethod: String?
    public let id: String?
    public let model: String?
    public let providerErrorCode: String?
    public let requestBytes: Int?
    public let requestId: String?
    public let requestPath: String?
    public let requestPayloadHash: String?
    public let responseBytes: Int?
    public let responsePayloadHash: String?
    public let startedAt: String?
    public let status: Int?
    public let streaming: Bool?
    public let time: String?
    public let tokens: Int?
    public let traceId: String?


    public init(channel: String? = nil, duration: String? = nil, endedAt: String? = nil, errorMessageMasked: String? = nil, errorType: String? = nil, httpMethod: String? = nil, id: String? = nil, model: String? = nil, providerErrorCode: String? = nil, requestBytes: Int? = nil, requestId: String? = nil, requestPath: String? = nil, requestPayloadHash: String? = nil, responseBytes: Int? = nil, responsePayloadHash: String? = nil, startedAt: String? = nil, status: Int? = nil, streaming: Bool? = nil, time: String? = nil, tokens: Int? = nil, traceId: String? = nil) {
        self.channel = channel
        self.duration = duration
        self.endedAt = endedAt
        self.errorMessageMasked = errorMessageMasked
        self.errorType = errorType
        self.httpMethod = httpMethod
        self.id = id
        self.model = model
        self.providerErrorCode = providerErrorCode
        self.requestBytes = requestBytes
        self.requestId = requestId
        self.requestPath = requestPath
        self.requestPayloadHash = requestPayloadHash
        self.responseBytes = responseBytes
        self.responsePayloadHash = responsePayloadHash
        self.startedAt = startedAt
        self.status = status
        self.streaming = streaming
        self.time = time
        self.tokens = tokens
        self.traceId = traceId
    }
}

public struct RoutingRequestTracesListResult: Codable {
    public let code: String?
    public let data: RoutingRequestTracesResponse?
    public let msg: String?


    public init(code: String? = nil, data: RoutingRequestTracesResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RoutingRequestTracesResponse: Codable {
    public let items: [RoutingRequestTraceItem]?


    public init(items: [RoutingRequestTraceItem]? = nil) {
        self.items = items
    }
}

public struct RoutingRetryPolicy: Codable {
    public let backoffMs: Int?
    public let maxAttempts: Int?
    public let retryableStatusCodes: [Int]?


    public init(backoffMs: Int? = nil, maxAttempts: Int? = nil, retryableStatusCodes: [Int]? = nil) {
        self.backoffMs = backoffMs
        self.maxAttempts = maxAttempts
        self.retryableStatusCodes = retryableStatusCodes
    }
}

public struct RoutingUsageData: Codable {
    public let latency: Int?
    public let requests: Int?
    public let time: String?


    public init(latency: Int? = nil, requests: Int? = nil, time: String? = nil) {
        self.latency = latency
        self.requests = requests
        self.time = time
    }
}

public struct RoutingUsageListResult: Codable {
    public let code: String?
    public let data: RoutingUsageSnapshot?
    public let msg: String?


    public init(code: String? = nil, data: RoutingUsageSnapshot? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RoutingUsageSnapshot: Codable {
    public let chartData: [RoutingUsageData]?
    public let modelStats: [RoutingModelStats]?


    public init(chartData: [RoutingUsageData]? = nil, modelStats: [RoutingModelStats]? = nil) {
        self.chartData = chartData
        self.modelStats = modelStats
    }
}

public struct RuntimeArtifactCreateRequest: Codable {
    public let artifactType: String?
    public let contentJson: [String: String]?
    public let contentText: String?
    public let metadata: [String: String]?
    public let mimeType: String?
    public let name: String?
    public let resource: MediaResource?
    public let sha256: String?
    public let sizeBytes: Int?
    public let storageKey: String?


    public init(artifactType: String? = nil, contentJson: [String: String]? = nil, contentText: String? = nil, metadata: [String: String]? = nil, mimeType: String? = nil, name: String? = nil, resource: MediaResource? = nil, sha256: String? = nil, sizeBytes: Int? = nil, storageKey: String? = nil) {
        self.artifactType = artifactType
        self.contentJson = contentJson
        self.contentText = contentText
        self.metadata = metadata
        self.mimeType = mimeType
        self.name = name
        self.resource = resource
        self.sha256 = sha256
        self.sizeBytes = sizeBytes
        self.storageKey = storageKey
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
    public let resource: MediaResource?
    public let sha256: String?
    public let sizeBytes: Int?
    public let storageKey: String?


    public init(artifactType: String? = nil, contentText: String? = nil, createdAt: String? = nil, id: String? = nil, invocationId: String? = nil, mimeType: String? = nil, name: String? = nil, resource: MediaResource? = nil, sha256: String? = nil, sizeBytes: Int? = nil, storageKey: String? = nil) {
        self.artifactType = artifactType
        self.contentText = contentText
        self.createdAt = createdAt
        self.id = id
        self.invocationId = invocationId
        self.mimeType = mimeType
        self.name = name
        self.resource = resource
        self.sha256 = sha256
        self.sizeBytes = sizeBytes
        self.storageKey = storageKey
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
    public let requestJson: [String: String]?
    public let runtime: String?
    public let sandboxPolicy: String?
    public let status: String?
    public let streaming: Bool?
    public let toolCallId: String?
    public let toolName: String?
    public let traceId: String?


    public init(agentRunId: String? = nil, agentRunStepId: String? = nil, agentSessionId: String? = nil, approvalPolicy: String? = nil, chatItemId: String? = nil, chatTurnId: String? = nil, conversationId: String? = nil, cwd: String? = nil, endpoint: String? = nil, invocationType: String? = nil, metadata: [String: String]? = nil, model: String? = nil, permissionMode: String? = nil, provider: String? = nil, requestJson: [String: String]? = nil, runtime: String? = nil, sandboxPolicy: String? = nil, status: String? = nil, streaming: Bool? = nil, toolCallId: String? = nil, toolName: String? = nil, traceId: String? = nil) {
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
    public let favicon: MediaResource?
    public let footerCopyright: String?
    public let icon: MediaResource?
    public let icpRecordNumber: String?
    public let icpRecordUrl: String?
    public let logo: MediaResource?
    public let policeRecordNumber: String?
    public let policeRecordUrl: String?
    public let privacyUrl: String?
    public let seoDescription: String?
    public let seoTitle: String?
    public let shortName: String?
    public let siteName: String?
    public let supportUrl: String?
    public let termsUrl: String?


    public init(accentColor: String? = nil, brandColor: String? = nil, customCss: String? = nil, description: String? = nil, docsUrl: String? = nil, favicon: MediaResource? = nil, footerCopyright: String? = nil, icon: MediaResource? = nil, icpRecordNumber: String? = nil, icpRecordUrl: String? = nil, logo: MediaResource? = nil, policeRecordNumber: String? = nil, policeRecordUrl: String? = nil, privacyUrl: String? = nil, seoDescription: String? = nil, seoTitle: String? = nil, shortName: String? = nil, siteName: String? = nil, supportUrl: String? = nil, termsUrl: String? = nil) {
        self.accentColor = accentColor
        self.brandColor = brandColor
        self.customCss = customCss
        self.description = description
        self.docsUrl = docsUrl
        self.favicon = favicon
        self.footerCopyright = footerCopyright
        self.icon = icon
        self.icpRecordNumber = icpRecordNumber
        self.icpRecordUrl = icpRecordUrl
        self.logo = logo
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
    public let image: MediaResource?
    public let lastUpdated: String?
    public let license: String?
    public let name: String?
    public let packages: [SkillPackageItem]?
    public let rating: Double?
    public let screenshots: [MediaResource]?
    public let size: String?
    public let version: String?


    public init(category: String? = nil, clawhubImage: String? = nil, description: String? = nil, developer: String? = nil, downloads: String? = nil, features: [String]? = nil, frameworks: [String]? = nil, id: String? = nil, image: MediaResource? = nil, lastUpdated: String? = nil, license: String? = nil, name: String? = nil, packages: [SkillPackageItem]? = nil, rating: Double? = nil, screenshots: [MediaResource]? = nil, size: String? = nil, version: String? = nil) {
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
    public let image: MediaResource?
    public let lastUpdated: String?
    public let license: String?
    public let name: String?
    public let packages: [SkillPackageItem]?
    public let rating: Double?
    public let screenshots: [MediaResource]?
    public let size: String?
    public let version: String?


    public init(category: String? = nil, clawhubImage: String? = nil, description: String? = nil, developer: String? = nil, downloads: String? = nil, features: [String]? = nil, frameworks: [String]? = nil, id: String? = nil, image: MediaResource? = nil, lastUpdated: String? = nil, license: String? = nil, name: String? = nil, packages: [SkillPackageItem]? = nil, rating: Double? = nil, screenshots: [MediaResource]? = nil, size: String? = nil, version: String? = nil) {
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
    public let channelGroup: String?
    public let defaultForRuntime: Bool?
    public let expires: String?
    public let ipLimit: String?
    public let isUnlimitedQuota: Bool?
    public let modalities: [String]?
    public let name: String?
    public let quota: String?


    public init(channelGroup: String? = nil, defaultForRuntime: Bool? = nil, expires: String? = nil, ipLimit: String? = nil, isUnlimitedQuota: Bool? = nil, modalities: [String]? = nil, name: String? = nil, quota: String? = nil) {
        self.channelGroup = channelGroup
        self.defaultForRuntime = defaultForRuntime
        self.expires = expires
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
    public let regionCode: String?
    public let requestId: String?
    public let requestedModelCatalogKey: String?
    public let status: String?
    public let time: String?
    public let tokenName: String?
    public let totalTime: String?
    public let ttft: String?
    public let type: String?
    public let userAgent: String?


    public init(baseInputPrice: String? = nil, baseOutputPrice: String? = nil, cacheReadPrice: String? = nil, cacheReadTokens: Int? = nil, cost: String? = nil, errorCode: String? = nil, errorMessage: String? = nil, errorType: String? = nil, group: String? = nil, httpStatus: Int? = nil, id: String? = nil, inputTokens: Int? = nil, ip: String? = nil, isStream: Bool? = nil, model: String? = nil, multiplier: String? = nil, outputTokens: Int? = nil, path: String? = nil, providerNativeModel: String? = nil, reasoningEffort: String? = nil, regionCode: String? = nil, requestId: String? = nil, requestedModelCatalogKey: String? = nil, status: String? = nil, time: String? = nil, tokenName: String? = nil, totalTime: String? = nil, ttft: String? = nil, type: String? = nil, userAgent: String? = nil) {
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
        self.regionCode = regionCode
        self.requestId = requestId
        self.requestedModelCatalogKey = requestedModelCatalogKey
        self.status = status
        self.time = time
        self.tokenName = tokenName
        self.totalTime = totalTime
        self.ttft = ttft
        self.type = type
        self.userAgent = userAgent
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
