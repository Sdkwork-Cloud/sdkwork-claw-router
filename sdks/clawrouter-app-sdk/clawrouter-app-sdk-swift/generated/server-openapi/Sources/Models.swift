import Foundation

public struct AccountConsumptionItem: Codable {
    public let color: String?
    public let name: String?
    public let percentage: Double?
    public let value: Double?


    public init(color: String? = nil, name: String? = nil, percentage: Double? = nil, value: Double? = nil) {
        self.color = color
        self.name = name
        self.percentage = percentage
        self.value = value
    }
}

public struct AccountInvoiceSettings: Codable {
    public let invoiceType: String?
    public let orgFull: String?
    public let paymentMethod: String?
    public let taxId: String?


    public init(invoiceType: String? = nil, orgFull: String? = nil, paymentMethod: String? = nil, taxId: String? = nil) {
        self.invoiceType = invoiceType
        self.orgFull = orgFull
        self.paymentMethod = paymentMethod
        self.taxId = taxId
    }
}

public struct AccountLoginLog: Codable {
    public let device: String?
    public let ip: String?
    public let location: String?
    public let status: String?
    public let time: String?


    public init(device: String? = nil, ip: String? = nil, location: String? = nil, status: String? = nil, time: String? = nil) {
        self.device = device
        self.ip = ip
        self.location = location
        self.status = status
        self.time = time
    }
}

public struct AccountPointsExchangeRateRetrieveResult: Codable {
    public let code: String?
    public let data: CommercePointsExchangeRateResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommercePointsExchangeRateResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsExchangesCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsExchangesRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceWalletTransactionItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceWalletTransactionItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsExchangesRulesListResult: Codable {
    public let code: String?
    public let data: [CommerceExchangeRuleItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommerceExchangeRuleItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsHistoryListResult: Codable {
    public let code: String?
    public let data: [CommercePointsHistoryItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommercePointsHistoryItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsRechargesCreateResult: Codable {
    public let code: String?
    public let data: SubmitRechargeResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: SubmitRechargeResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsRechargesOrdersCancelResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsRechargesOrdersRetrieveResult: Codable {
    public let code: String?
    public let data: CheckoutStatusResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CheckoutStatusResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsRechargesPackagesListResult: Codable {
    public let code: String?
    public let data: [RechargePackage]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [RechargePackage]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsRechargesRecordsListResult: Codable {
    public let code: String?
    public let data: [BillingRechargeHistoryItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [BillingRechargeHistoryItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsRetrieveResult: Codable {
    public let code: String?
    public let data: CommercePointsBalanceResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommercePointsBalanceResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountPointsTransfersCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountSecuritySummary: Codable {
    public let ipWhitelistCount: Int?
    public let mfaEnabled: Bool?
    public let qpsLimit: Int?


    public init(ipWhitelistCount: Int? = nil, mfaEnabled: Bool? = nil, qpsLimit: Int? = nil) {
        self.ipWhitelistCount = ipWhitelistCount
        self.mfaEnabled = mfaEnabled
        self.qpsLimit = qpsLimit
    }
}

public struct AccountSummaryResponse: Codable {
    public let availableCredits: Double?
    public let consumptionByService: [AccountConsumptionItem]?
    public let email: String?
    public let estDaysRemaining: Int?
    public let id: String?
    public let invoiceSettings: AccountInvoiceSettings?
    public let isVerified: Bool?
    public let loginLogs: [AccountLoginLog]?
    public let monthlyConsumption: Double?
    public let name: String?
    public let organization: String?
    public let security: AccountSecuritySummary?
    public let tier: String?


    public init(availableCredits: Double? = nil, consumptionByService: [AccountConsumptionItem]? = nil, email: String? = nil, estDaysRemaining: Int? = nil, id: String? = nil, invoiceSettings: AccountInvoiceSettings? = nil, isVerified: Bool? = nil, loginLogs: [AccountLoginLog]? = nil, monthlyConsumption: Double? = nil, name: String? = nil, organization: String? = nil, security: AccountSecuritySummary? = nil, tier: String? = nil) {
        self.availableCredits = availableCredits
        self.consumptionByService = consumptionByService
        self.email = email
        self.estDaysRemaining = estDaysRemaining
        self.id = id
        self.invoiceSettings = invoiceSettings
        self.isVerified = isVerified
        self.loginLogs = loginLogs
        self.monthlyConsumption = monthlyConsumption
        self.name = name
        self.organization = organization
        self.security = security
        self.tier = tier
    }
}

public struct AccountSummaryRetrieveResult: Codable {
    public let code: String?
    public let data: AccountSummaryResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AccountSummaryResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountTokensDeductionsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccountTokensRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceTokenBalanceResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceTokenBalanceResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
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

public struct AgentsCreateResult: Codable {
    public let code: String?
    public let data: AgentItemResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AgentItemResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AgentsListResult: Codable {
    public let code: String?
    public let data: AgentListResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AgentListResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AgentsRetrieveResult: Codable {
    public let code: String?
    public let data: AgentItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AgentItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
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
    public let metadata: [String: String]?
    public let meteringStatus: String?
    public let organizationId: String?
    public let outputMessage: String?
    public let payloadHash: String?
    public let plannerModel: String?
    public let promptTokens: String?
    public let requestId: String?
    public let retentionUntil: String?
    public let runStatus: String?
    public let runUuid: String?
    public let sourceSurface: String?
    public let startedAt: String?
    public let status: String?
    public let targetModality: String?
    public let tenantId: String?
    public let totalSteps: Int?
    public let totalTokens: String?
    public let traceId: String?
    public let usageFactId: String?
    public let userId: String?
    public let uuid: String?
    public let videoSeconds: String?


    public init(agentId: String? = nil, agentVersionId: String? = nil, audioSeconds: String? = nil, cachedTokens: String? = nil, cancelledAt: String? = nil, completedAt: String? = nil, completionTokens: String? = nil, createdAt: String? = nil, errorMessageMasked: String? = nil, executionMode: String? = nil, failedAt: String? = nil, id: String? = nil, imageCount: String? = nil, inputMessage: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, meteringStatus: String? = nil, organizationId: String? = nil, outputMessage: String? = nil, payloadHash: String? = nil, plannerModel: String? = nil, promptTokens: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runStatus: String? = nil, runUuid: String? = nil, sourceSurface: String? = nil, startedAt: String? = nil, status: String? = nil, targetModality: String? = nil, tenantId: String? = nil, totalSteps: Int? = nil, totalTokens: String? = nil, traceId: String? = nil, usageFactId: String? = nil, userId: String? = nil, uuid: String? = nil, videoSeconds: String? = nil) {
        self.agentId = agentId
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
        self.metadata = metadata
        self.meteringStatus = meteringStatus
        self.organizationId = organizationId
        self.outputMessage = outputMessage
        self.payloadHash = payloadHash
        self.plannerModel = plannerModel
        self.promptTokens = promptTokens
        self.requestId = requestId
        self.retentionUntil = retentionUntil
        self.runStatus = runStatus
        self.runUuid = runUuid
        self.sourceSurface = sourceSurface
        self.startedAt = startedAt
        self.status = status
        self.targetModality = targetModality
        self.tenantId = tenantId
        self.totalSteps = totalSteps
        self.totalTokens = totalTokens
        self.traceId = traceId
        self.usageFactId = usageFactId
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
    public let skillId: String?
    public let startedAt: String?
    public let status: String?
    public let stepIndex: Int?
    public let stepStatus: String?
    public let stepType: String?
    public let tenantId: String?
    public let title: String?
    public let toolBindingId: String?
    public let totalTokens: String?
    public let traceId: String?
    public let usageFactId: String?
    public let userId: String?
    public let uuid: String?
    public let videoSeconds: String?


    public init(agentId: String? = nil, agentVersionId: String? = nil, audioSeconds: String? = nil, cachedTokens: String? = nil, completedAt: String? = nil, completionTokens: String? = nil, createdAt: String? = nil, errorMessageMasked: String? = nil, id: String? = nil, imageCount: String? = nil, inputSnapshot: [String: String]? = nil, latencyMs: Int? = nil, legalHold: Bool? = nil, mcpServerId: String? = nil, metadata: [String: String]? = nil, model: String? = nil, organizationId: String? = nil, outputSnapshot: [String: String]? = nil, payloadHash: String? = nil, promptTokens: String? = nil, requestId: String? = nil, retentionUntil: String? = nil, runId: String? = nil, skillId: String? = nil, startedAt: String? = nil, status: String? = nil, stepIndex: Int? = nil, stepStatus: String? = nil, stepType: String? = nil, tenantId: String? = nil, title: String? = nil, toolBindingId: String? = nil, totalTokens: String? = nil, traceId: String? = nil, usageFactId: String? = nil, userId: String? = nil, uuid: String? = nil, videoSeconds: String? = nil) {
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
        self.skillId = skillId
        self.startedAt = startedAt
        self.status = status
        self.stepIndex = stepIndex
        self.stepStatus = stepStatus
        self.stepType = stepType
        self.tenantId = tenantId
        self.title = title
        self.toolBindingId = toolBindingId
        self.totalTokens = totalTokens
        self.traceId = traceId
        self.usageFactId = usageFactId
        self.userId = userId
        self.uuid = uuid
        self.videoSeconds = videoSeconds
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
    public let regionCode: String?
    public let schemaVersion: String?
    public let sortOrder: Int?
    public let status: String?
    public let supported: Bool?
    public let tenantId: String?
    public let updatedAt: String?
    public let uuid: String?
    public let vendorCode: String?
    public let version: String?


    public init(capability: String? = nil, capabilityCode: String? = nil, catalogKey: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, endpointFormats: [String: String]? = nil, id: String? = nil, inputModalities: [String: String]? = nil, limitUnit: String? = nil, limitValue: String? = nil, metadata: [String: String]? = nil, modality: String? = nil, model: String? = nil, modelId: String? = nil, organizationId: String? = nil, outputModalities: [String: String]? = nil, parameterName: String? = nil, parameterSchema: [String: String]? = nil, regionCode: String? = nil, schemaVersion: String? = nil, sortOrder: Int? = nil, status: String? = nil, supported: Bool? = nil, tenantId: String? = nil, updatedAt: String? = nil, uuid: String? = nil, vendorCode: String? = nil, version: String? = nil) {
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
        self.regionCode = regionCode
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
    public let regionCode: String?
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


    public init(apiFormat: String? = nil, capabilities: [String: String]? = nil, capability: String? = nil, capabilityIntro: String? = nil, catalogKey: String? = nil, colorToken: String? = nil, contextTokens: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultPricingId: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deprecatedAt: String? = nil, description: String? = nil, displayName: String? = nil, docsUrl: String? = nil, familyCode: String? = nil, familyId: String? = nil, iconUrl: String? = nil, id: String? = nil, inputModalities: [String: String]? = nil, licenseType: String? = nil, limitations: [String: String]? = nil, maxDurationSeconds: Int? = nil, maxInputTokens: String? = nil, maxOutputTokens: String? = nil, metadata: [String: String]? = nil, modalities: [String: String]? = nil, model: String? = nil, modelAliases: [String: String]? = nil, modelFamily: String? = nil, modelVersion: String? = nil, organizationId: String? = nil, outputModalities: [String: String]? = nil, performanceProfile: [String: String]? = nil, providerHint: String? = nil, rankScore: String? = nil, regionCode: String? = nil, releaseStage: String? = nil, replacementModel: String? = nil, retiredAt: String? = nil, routingState: String? = nil, shelfState: String? = nil, status: String? = nil, supportedLanguages: [String: String]? = nil, supportsJsonSchema: Bool? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, tenantId: String? = nil, trainingDataCutoff: String? = nil, updatedAt: String? = nil, useCases: [String: String]? = nil, uuid: String? = nil, vendorCode: String? = nil, vendorId: String? = nil, vendorNameSnapshot: String? = nil, version: String? = nil) {
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
        self.regionCode = regionCode
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
    public let reasoningEffort: String?
    public let requestBytes: String?
    public let requestId: String?
    public let requestPath: String?
    public let requestPayloadHash: String?
    public let requestedModel: String?
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


    public init(apiKeyGroupId: String? = nil, apiKeyGroupSnapshot: String? = nil, apiKeyId: String? = nil, apiKeyNameSnapshot: String? = nil, attemptNo: Int? = nil, cachedTokens: String? = nil, channelId: String? = nil, channelNameSnapshot: String? = nil, clientIpHash: String? = nil, clientIpMasked: String? = nil, clientIpRegion: String? = nil, completionTokens: String? = nil, createdAt: String? = nil, decisionLogId: String? = nil, endedAt: String? = nil, endpoint: String? = nil, errorMessageMasked: String? = nil, errorType: String? = nil, httpMethod: String? = nil, httpStatus: Int? = nil, id: String? = nil, latencyMs: Int? = nil, legacyApiKeyId: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerNameSnapshot: String? = nil, ownerType: String? = nil, payloadHash: String? = nil, promptTokens: String? = nil, providerAccountId: String? = nil, providerErrorCode: String? = nil, providerId: String? = nil, providerModel: String? = nil, reasoningEffort: String? = nil, requestBytes: String? = nil, requestId: String? = nil, requestPath: String? = nil, requestPayloadHash: String? = nil, requestedModel: String? = nil, responseBytes: String? = nil, responsePayloadHash: String? = nil, retentionUntil: String? = nil, startedAt: String? = nil, status: String? = nil, streaming: Bool? = nil, tenantId: String? = nil, totalTokens: String? = nil, traceId: String? = nil, ttftMs: Int? = nil, userAgentHash: String? = nil, userId: String? = nil, uuid: String? = nil) {
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
        self.reasoningEffort = reasoningEffort
        self.requestBytes = requestBytes
        self.requestId = requestId
        self.requestPath = requestPath
        self.requestPayloadHash = requestPayloadHash
        self.requestedModel = requestedModel
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
    public let rateMultiplier: String?
    public let reasoningEffort: String?
    public let referenceMultiplier: String?
    public let requestCount: String?
    public let requestId: String?
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


    public init(apiKeyGroupId: String? = nil, apiKeyGroupSnapshot: String? = nil, apiKeyId: String? = nil, apiKeyNameSnapshot: String? = nil, audioSeconds: String? = nil, bandwidthBytes: String? = nil, baseInputUnitPrice: String? = nil, baseOutputUnitPrice: String? = nil, billableQuantity: String? = nil, billableUnit: String? = nil, billingMeterCode: String? = nil, billingMeterId: String? = nil, billingMode: String? = nil, billingTier: String? = nil, billingType: String? = nil, cacheReadUnitPrice: String? = nil, cachedTokens: String? = nil, catalogKey: String? = nil, channelId: String? = nil, characterCount: String? = nil, completionTokens: String? = nil, costAmount: String? = nil, createdAt: String? = nil, currency: String? = nil, customerChargeAmount: String? = nil, decisionLogId: String? = nil, id: String? = nil, imageCount: String? = nil, itemCount: String? = nil, legacyApiKeyId: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, modality: String? = nil, model: String? = nil, occurredAt: String? = nil, officialReferenceAmount: String? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerNameSnapshot: String? = nil, ownerType: String? = nil, payloadHash: String? = nil, pricingId: String? = nil, pricingPlanCode: String? = nil, pricingPlanId: String? = nil, pricingRuleId: String? = nil, pricingSnapshot: [String: String]? = nil, pricingTierId: String? = nil, promptTokens: String? = nil, providerAccountId: String? = nil, providerId: String? = nil, rateMultiplier: String? = nil, reasoningEffort: String? = nil, referenceMultiplier: String? = nil, requestCount: String? = nil, requestId: String? = nil, resultCount: String? = nil, retentionUntil: String? = nil, settlementId: String? = nil, settlementStatus: String? = nil, status: String? = nil, storageByteHours: String? = nil, tenantId: String? = nil, totalTokens: String? = nil, traceId: String? = nil, unitPriceSnapshot: String? = nil, upstreamCostAmount: String? = nil, usageType: String? = nil, userId: String? = nil, uuid: String? = nil, videoSeconds: String? = nil) {
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
        self.rateMultiplier = rateMultiplier
        self.reasoningEffort = reasoningEffort
        self.referenceMultiplier = referenceMultiplier
        self.requestCount = requestCount
        self.requestId = requestId
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

public struct ApiKeysCreateResult: Codable {
    public let code: String?
    public let data: CreateApiKeyResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CreateApiKeyResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ApiKeysDeleteResult: Codable {
    public let code: String?
    public let data: DeleteApiKeyResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: DeleteApiKeyResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ApiKeysListResult: Codable {
    public let code: String?
    public let data: AppApiKeyListResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AppApiKeyListResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ApiKeysUpdateResult: Codable {
    public let code: String?
    public let data: UpdateApiKeyResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: UpdateApiKeyResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
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

public struct AppApiKeyItem: Codable {
    public let copyableKey: String?
    public let created: String?
    public let expires: String?
    public let group: String?
    public let id: String?
    public let ipLimit: String?
    public let maskedKey: String?
    public let modalities: [String]?
    public let name: String?
    public let quota: String?
    public let rate: String?
    public let status: String?
    public let usedQuota: String?


    public init(copyableKey: String? = nil, created: String? = nil, expires: String? = nil, group: String? = nil, id: String? = nil, ipLimit: String? = nil, maskedKey: String? = nil, modalities: [String]? = nil, name: String? = nil, quota: String? = nil, rate: String? = nil, status: String? = nil, usedQuota: String? = nil) {
        self.copyableKey = copyableKey
        self.created = created
        self.expires = expires
        self.group = group
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
    public let items: [AppCatalogItem]?


    public init(items: [AppCatalogItem]? = nil) {
        self.items = items
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
    public let items: [AppModelCatalogItem]?


    public init(items: [AppModelCatalogItem]? = nil) {
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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CourseApplicationCreateResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ApplicationsVideosCreateResult: Codable {
    public let code: String?
    public let data: CourseApplicationVideoUploadResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CourseApplicationVideoUploadResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsStoreCategoriesListResult: Codable {
    public let code: String?
    public let data: AppCategoriesResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AppCategoriesResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsStoreListResult: Codable {
    public let code: String?
    public let data: AppCatalogResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AppCatalogResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsStoreRetrieveResult: Codable {
    public let code: String?
    public let data: AppDetailResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AppDetailResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
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
    public let recoveryMethods: [String]?
    public let registerMethods: [String]?
    public let verificationPolicy: AuthVerificationPolicy?


    public init(leftRailMode: String? = nil, loginMethods: [String]? = nil, oauthLoginEnabled: Bool? = nil, oauthProviders: [String]? = nil, oauthRegion: String? = nil, qrLoginEnabled: Bool? = nil, recoveryMethods: [String]? = nil, registerMethods: [String]? = nil, verificationPolicy: AuthVerificationPolicy? = nil) {
        self.leftRailMode = leftRailMode
        self.loginMethods = loginMethods
        self.oauthLoginEnabled = oauthLoginEnabled
        self.oauthProviders = oauthProviders
        self.oauthRegion = oauthRegion
        self.qrLoginEnabled = qrLoginEnabled
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

public struct BillingRechargeHistoryItem: Codable {
    public let amount: String?
    public let date: String?
    public let id: Int?
    public let method: String?
    public let orderNo: String?
    public let status: String?


    public init(amount: String? = nil, date: String? = nil, id: Int? = nil, method: String? = nil, orderNo: String? = nil, status: String? = nil) {
        self.amount = amount
        self.date = date
        self.id = id
        self.method = method
        self.orderNo = orderNo
        self.status = status
    }
}

public struct BillingRedeemHistoryItem: Codable {
    public let amount: String?
    public let code: String?
    public let date: String?
    public let id: Int?
    public let status: String?


    public init(amount: String? = nil, code: String? = nil, date: String? = nil, id: Int? = nil, status: String? = nil) {
        self.amount = amount
        self.code = code
        self.date = date
        self.id = id
        self.status = status
    }
}

public struct CheckoutStatusResponse: Codable {
    public let amount: String?
    public let createdAt: String?
    public let expiresAt: String?
    public let nextAction: String?
    public let orderNo: String?
    public let orderStatus: String?
    public let outTradeNo: String?
    public let paidAt: String?
    public let paymentMethod: String?
    public let paymentStatus: String?
    public let points: Int?
    public let qrCodePayload: String?
    public let rechargeStatus: String?
    public let status: String?


    public init(amount: String? = nil, createdAt: String? = nil, expiresAt: String? = nil, nextAction: String? = nil, orderNo: String? = nil, orderStatus: String? = nil, outTradeNo: String? = nil, paidAt: String? = nil, paymentMethod: String? = nil, paymentStatus: String? = nil, points: Int? = nil, qrCodePayload: String? = nil, rechargeStatus: String? = nil, status: String? = nil) {
        self.amount = amount
        self.createdAt = createdAt
        self.expiresAt = expiresAt
        self.nextAction = nextAction
        self.orderNo = orderNo
        self.orderStatus = orderStatus
        self.outTradeNo = outTradeNo
        self.paidAt = paidAt
        self.paymentMethod = paymentMethod
        self.paymentStatus = paymentStatus
        self.points = points
        self.qrCodePayload = qrCodePayload
        self.rechargeStatus = rechargeStatus
        self.status = status
    }
}

public struct CommentsCreateResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CommentsDeleteResult: Codable {
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

public struct CommentsLikesCreateResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CommentsLikesCurrentDeleteResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CommentsListResult: Codable {
    public let code: String?
    public let data: ForumCommentPage?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentPage? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CommentsPinsCreateResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CommentsPinsCurrentDeleteResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CommentsRepliesListResult: Codable {
    public let code: String?
    public let data: ForumCommentPage?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentPage? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CommentsReplyCreateResult: Codable {
    public let code: String?
    public let data: ForumCommentItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CommentsRetrieveResult: Codable {
    public let code: String?
    public let data: ForumCommentDetail?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentDetail? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CommentsStatisticsListResult: Codable {
    public let code: String?
    public let data: ForumCommentStatistics?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentStatistics? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CommerceBillingExportRecord: Codable {
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

public struct CommerceCouponCatalogItem: Codable {
    public let id: String?
    public let name: String?
    public let status: String?
    public let type: String?
    public let value: String?


    public init(id: String? = nil, name: String? = nil, status: String? = nil, type: String? = nil, value: String? = nil) {
        self.id = id
        self.name = name
        self.status = status
        self.type = type
        self.value = value
    }
}

public struct CommerceCouponClaimRequest: Codable {
    public let claimSource: String?
    public let couponId: String?


    public init(claimSource: String? = nil, couponId: String? = nil) {
        self.claimSource = claimSource
        self.couponId = couponId
    }
}

public struct CommerceCouponUsageRequest: Codable {
    public let amount: String?
    public let businessNo: String?
    public let requestNo: String?
    public let userCouponId: String?


    public init(amount: String? = nil, businessNo: String? = nil, requestNo: String? = nil, userCouponId: String? = nil) {
        self.amount = amount
        self.businessNo = businessNo
        self.requestNo = requestNo
        self.userCouponId = userCouponId
    }
}

public struct CommerceCouponUsageRollbackRequest: Codable {
    public let reason: String?
    public let requestNo: String?
    public let usageNo: String?


    public init(reason: String? = nil, requestNo: String? = nil, usageNo: String? = nil) {
        self.reason = reason
        self.requestNo = requestNo
        self.usageNo = usageNo
    }
}

public struct CommerceEmptyCommandRequest: Codable {

    public init() {}
}

public struct CommerceExchangeRuleItem: Codable {
    public let id: String?
    public let rate: String?
    public let sourceAssetType: String?
    public let status: String?
    public let targetAssetType: String?


    public init(id: String? = nil, rate: String? = nil, sourceAssetType: String? = nil, status: String? = nil, targetAssetType: String? = nil) {
        self.id = id
        self.rate = rate
        self.sourceAssetType = sourceAssetType
        self.status = status
        self.targetAssetType = targetAssetType
    }
}

public struct CommerceOperationResponse: Codable {
    public let requestNo: String?
    public let status: String?
    public let success: Bool?


    public init(requestNo: String? = nil, status: String? = nil, success: Bool? = nil) {
        self.requestNo = requestNo
        self.status = status
        self.success = success
    }
}

public struct CommercePointsBalanceResponse: Codable {
    public let availablePoints: Int?
    public let frozenPoints: Int?


    public init(availablePoints: Int? = nil, frozenPoints: Int? = nil) {
        self.availablePoints = availablePoints
        self.frozenPoints = frozenPoints
    }
}

public struct CommercePointsExchangeRateResponse: Codable {
    public let rate: String?
    public let sourceAssetType: String?
    public let targetAssetType: String?


    public init(rate: String? = nil, sourceAssetType: String? = nil, targetAssetType: String? = nil) {
        self.rate = rate
        self.sourceAssetType = sourceAssetType
        self.targetAssetType = targetAssetType
    }
}

public struct CommercePointsHistoryItem: Codable {
    public let amount: Int?
    public let balanceAfter: Int?
    public let businessType: String?
    public let createdAt: String?
    public let direction: String?
    public let id: String?


    public init(amount: Int? = nil, balanceAfter: Int? = nil, businessType: String? = nil, createdAt: String? = nil, direction: String? = nil, id: String? = nil) {
        self.amount = amount
        self.balanceAfter = balanceAfter
        self.businessType = businessType
        self.createdAt = createdAt
        self.direction = direction
        self.id = id
    }
}

public struct CommercePreflightRequest: Codable {
    public let amount: String?
    public let businessType: String?
    public let remarks: String?
    public let requestNo: String?


    public init(amount: String? = nil, businessType: String? = nil, remarks: String? = nil, requestNo: String? = nil) {
        self.amount = amount
        self.businessType = businessType
        self.remarks = remarks
        self.requestNo = requestNo
    }
}

public struct CommerceRechargeOrderCancelRequest: Codable {
    public let reason: String?


    public init(reason: String? = nil) {
        self.reason = reason
    }
}

public struct CommerceTokenBalanceResponse: Codable {
    public let availableTokens: Int?
    public let frozenTokens: Int?


    public init(availableTokens: Int? = nil, frozenTokens: Int? = nil) {
        self.availableTokens = availableTokens
        self.frozenTokens = frozenTokens
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

public struct CommerceUsageSettlementRecord: Codable {
    public let accountHistoryId: String?
    public let accountId: String?
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


    public init(accountHistoryId: String? = nil, accountId: String? = nil, amount: String? = nil, assetType: String? = nil, createdAt: String? = nil, currency: String? = nil, direction: String? = nil, failureCode: String? = nil, failureMessage: String? = nil, id: String? = nil, legalHold: Bool? = nil, metadata: [String: String]? = nil, orderId: String? = nil, organizationId: String? = nil, payloadHash: String? = nil, paymentId: String? = nil, points: String? = nil, priceSnapshot: [String: String]? = nil, requestId: String? = nil, retentionUntil: String? = nil, settledAt: String? = nil, settlementNo: String? = nil, settlementStatus: String? = nil, status: String? = nil, tenantId: String? = nil, tokens: String? = nil, traceId: String? = nil, usageFactId: String? = nil, userId: String? = nil, uuid: String? = nil) {
        self.accountHistoryId = accountHistoryId
        self.accountId = accountId
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

public struct CommerceVipBenefitItem: Codable {
    public let benefitType: String?
    public let code: String?
    public let id: String?
    public let name: String?
    public let status: String?


    public init(benefitType: String? = nil, code: String? = nil, id: String? = nil, name: String? = nil, status: String? = nil) {
        self.benefitType = benefitType
        self.code = code
        self.id = id
        self.name = name
        self.status = status
    }
}

public struct CommerceVipDailyRewardStatusResponse: Codable {
    public let available: Bool?
    public let claimedToday: Bool?


    public init(available: Bool? = nil, claimedToday: Bool? = nil) {
        self.available = available
        self.claimedToday = claimedToday
    }
}

public struct CommerceVipInfoResponse: Codable {
    public let levelCode: String?
    public let levelName: String?
    public let status: String?


    public init(levelCode: String? = nil, levelName: String? = nil, status: String? = nil) {
        self.levelCode = levelCode
        self.levelName = levelName
        self.status = status
    }
}

public struct CommerceVipLevelItem: Codable {
    public let code: String?
    public let id: String?
    public let name: String?
    public let rank: Int?
    public let status: String?


    public init(code: String? = nil, id: String? = nil, name: String? = nil, rank: Int? = nil, status: String? = nil) {
        self.code = code
        self.id = id
        self.name = name
        self.rank = rank
        self.status = status
    }
}

public struct CommerceVipPackGroupItem: Codable {
    public let code: String?
    public let id: String?
    public let name: String?
    public let sortOrder: Int?
    public let status: String?


    public init(code: String? = nil, id: String? = nil, name: String? = nil, sortOrder: Int? = nil, status: String? = nil) {
        self.code = code
        self.id = id
        self.name = name
        self.sortOrder = sortOrder
        self.status = status
    }
}

public struct CommerceVipPackItem: Codable {
    public let code: String?
    public let currencyCode: String?
    public let id: String?
    public let name: String?
    public let priceAmount: String?
    public let status: String?


    public init(code: String? = nil, currencyCode: String? = nil, id: String? = nil, name: String? = nil, priceAmount: String? = nil, status: String? = nil) {
        self.code = code
        self.currencyCode = currencyCode
        self.id = id
        self.name = name
        self.priceAmount = priceAmount
        self.status = status
    }
}

public struct CommerceVipPrivilegeSpeedUpRequest: Codable {
    public let privilegeCode: String?
    public let remarks: String?
    public let requestNo: String?


    public init(privilegeCode: String? = nil, remarks: String? = nil, requestNo: String? = nil) {
        self.privilegeCode = privilegeCode
        self.remarks = remarks
        self.requestNo = requestNo
    }
}

public struct CommerceVipPrivilegeUsageItem: Codable {
    public let periodKey: String?
    public let privilegeCode: String?
    public let quotaCount: Int?
    public let usedCount: Int?


    public init(periodKey: String? = nil, privilegeCode: String? = nil, quotaCount: Int? = nil, usedCount: Int? = nil) {
        self.periodKey = periodKey
        self.privilegeCode = privilegeCode
        self.quotaCount = quotaCount
        self.usedCount = usedCount
    }
}

public struct CommerceVipPurchaseRequest: Codable {
    public let packId: String?
    public let remarks: String?
    public let requestNo: String?


    public init(packId: String? = nil, remarks: String? = nil, requestNo: String? = nil) {
        self.packId = packId
        self.remarks = remarks
        self.requestNo = requestNo
    }
}

public struct CommerceWalletAccountItem: Codable {
    public let assetType: String?
    public let availableAmount: String?
    public let currencyCode: String?
    public let frozenAmount: String?
    public let id: String?
    public let status: String?


    public init(assetType: String? = nil, availableAmount: String? = nil, currencyCode: String? = nil, frozenAmount: String? = nil, id: String? = nil, status: String? = nil) {
        self.assetType = assetType
        self.availableAmount = availableAmount
        self.currencyCode = currencyCode
        self.frozenAmount = frozenAmount
        self.id = id
        self.status = status
    }
}

public struct CommerceWalletCommandRequest: Codable {
    public let amount: String?
    public let assetType: String?
    public let remarks: String?
    public let requestNo: String?


    public init(amount: String? = nil, assetType: String? = nil, remarks: String? = nil, requestNo: String? = nil) {
        self.amount = amount
        self.assetType = assetType
        self.remarks = remarks
        self.requestNo = requestNo
    }
}

public struct CommerceWalletOverviewResponse: Codable {
    public let availableAmount: String?
    public let currencyCode: String?
    public let frozenAmount: String?


    public init(availableAmount: String? = nil, currencyCode: String? = nil, frozenAmount: String? = nil) {
        self.availableAmount = availableAmount
        self.currencyCode = currencyCode
        self.frozenAmount = frozenAmount
    }
}

public struct CommerceWalletTransactionItem: Codable {
    public let amount: String?
    public let balanceAfter: String?
    public let businessType: String?
    public let createdAt: String?
    public let direction: String?
    public let id: String?
    public let transactionNo: String?


    public init(amount: String? = nil, balanceAfter: String? = nil, businessType: String? = nil, createdAt: String? = nil, direction: String? = nil, id: String? = nil, transactionNo: String? = nil) {
        self.amount = amount
        self.balanceAfter = balanceAfter
        self.businessType = businessType
        self.createdAt = createdAt
        self.direction = direction
        self.id = id
        self.transactionNo = transactionNo
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

public struct CouponsCatalogListResult: Codable {
    public let code: String?
    public let data: [CommerceCouponCatalogItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommerceCouponCatalogItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponsCatalogRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceCouponCatalogItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceCouponCatalogItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponsClaimsCreateResult: Codable {
    public let code: String?
    public let data: BillingRedeemHistoryItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: BillingRedeemHistoryItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponsRedeemCreateResult: Codable {
    public let code: String?
    public let data: RedeemCodeResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RedeemCodeResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponsUsageCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponsUsageReversalsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CourseCategoryItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CoursesListResult: Codable {
    public let code: String?
    public let data: CourseListResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CourseListResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CoursesOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: CourseOverview?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CourseOverview? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CoursesRetrieveResult: Codable {
    public let code: String?
    public let data: CourseDetail?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CourseDetail? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CreateApiKeyRequest: Codable {
    public let expires: String?
    public let group: String?
    public let ipLimit: String?
    public let isUnlimitedQuota: Bool?
    public let modalities: [String]?
    public let name: String?
    public let quota: String?


    public init(expires: String? = nil, group: String? = nil, ipLimit: String? = nil, isUnlimitedQuota: Bool? = nil, modalities: [String]? = nil, name: String? = nil, quota: String? = nil) {
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

public struct CreateRoutingChannelRequest: Codable {
    public let accessType: String?
    public let baseUrl: String?
    public let capabilities: [String]?
    public let models: [String]?
    public let name: String?
    public let protocol_: String?
    public let retryPolicy: ProviderRetryPolicy?
    public let secretRef: String?
    public let status: String?
    public let timeoutMs: Int?
    public let vendor: String?
    public let weight: Int?


    public init(accessType: String? = nil, baseUrl: String? = nil, capabilities: [String]? = nil, models: [String]? = nil, name: String? = nil, protocol_: String? = nil, retryPolicy: ProviderRetryPolicy? = nil, secretRef: String? = nil, status: String? = nil, timeoutMs: Int? = nil, vendor: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.baseUrl = baseUrl
        self.capabilities = capabilities
        self.models = models
        self.name = name
        self.protocol_ = protocol_
        self.retryPolicy = retryPolicy
        self.secretRef = secretRef
        self.status = status
        self.timeoutMs = timeoutMs
        self.vendor = vendor
        self.weight = weight
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
    public let name: String?
    public let remark: String?


    public init(domain: String? = nil, id: String? = nil, name: String? = nil, remark: String? = nil) {
        self.domain = domain
        self.id = id
        self.name = name
        self.remark = remark
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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: DashboardOverviewResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
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

public struct FeedsCategoryRetrieveResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsCollectionsCreateResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsCollectionsCurrentDeleteResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsCollectionsCurrentRetrieveResult: Codable {
    public let code: String?
    public let data: Bool?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: Bool? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsCreateResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsDeleteResult: Codable {
    public let code: String?
    public let data: Bool?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: Bool? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsHotListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsLikesCreateResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsLikesCurrentDeleteResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsMostLikedListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsMostViewedListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: ForumOverviewResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumOverviewResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsRecommendListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsRetrieveResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsSharesCreateResult: Codable {
    public let code: String?
    public let data: ForumFeedItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumFeedItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FeedsTopListResult: Codable {
    public let code: String?
    public let data: [ForumFeedItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [ForumFeedItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: GatewayTracesResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct GatewayTracesResponse: Codable {
    public let items: [GatewayTrace]?


    public init(items: [GatewayTrace]? = nil) {
        self.items = items
    }
}

public struct GenerationAgentMeteringEvent: Codable {
    public let quantity: String?
    public let type: String?
    public let usageFactMetadata: GenerationAgentUsageFactMetadata?


    public init(quantity: String? = nil, type: String? = nil, usageFactMetadata: GenerationAgentUsageFactMetadata? = nil) {
        self.quantity = quantity
        self.type = type
        self.usageFactMetadata = usageFactMetadata
    }
}

public struct GenerationAgentRunCreateRequest: Codable {
    public let prompt: String?
    public let selectedModel: String?


    public init(prompt: String? = nil, selectedModel: String? = nil) {
        self.prompt = prompt
        self.selectedModel = selectedModel
    }
}

public struct GenerationAgentRunCreateResponse: Codable {
    public let agent: GenerationAgentSnapshot?
    public let item: GenerationHistoryItem?
    public let meteringEvents: [GenerationAgentMeteringEvent]?
    public let run: GenerationAgentRunSnapshot?
    public let status: String?
    public let steps: [GenerationAgentRunStepSnapshot]?
    public let targetType: String?
    public let usage: GenerationAgentUsageSummary?


    public init(agent: GenerationAgentSnapshot? = nil, item: GenerationHistoryItem? = nil, meteringEvents: [GenerationAgentMeteringEvent]? = nil, run: GenerationAgentRunSnapshot? = nil, status: String? = nil, steps: [GenerationAgentRunStepSnapshot]? = nil, targetType: String? = nil, usage: GenerationAgentUsageSummary? = nil) {
        self.agent = agent
        self.item = item
        self.meteringEvents = meteringEvents
        self.run = run
        self.status = status
        self.steps = steps
        self.targetType = targetType
        self.usage = usage
    }
}

public struct GenerationAgentRunSnapshot: Codable {
    public let id: String?
    public let requestId: String?
    public let source: String?
    public let status: String?


    public init(id: String? = nil, requestId: String? = nil, source: String? = nil, status: String? = nil) {
        self.id = id
        self.requestId = requestId
        self.source = source
        self.status = status
    }
}

public struct GenerationAgentRunStepSnapshot: Codable {
    public let id: String?
    public let index: Int?
    public let status: String?
    public let title: String?
    public let type: String?


    public init(id: String? = nil, index: Int? = nil, status: String? = nil, title: String? = nil, type: String? = nil) {
        self.id = id
        self.index = index
        self.status = status
        self.title = title
        self.type = type
    }
}

public struct GenerationAgentRunsCreateResult: Codable {
    public let code: String?
    public let data: GenerationAgentRunCreateResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: GenerationAgentRunCreateResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct GenerationAgentSnapshot: Codable {
    public let id: String?
    public let model: String?
    public let name: String?
    public let versionId: String?


    public init(id: String? = nil, model: String? = nil, name: String? = nil, versionId: String? = nil) {
        self.id = id
        self.model = model
        self.name = name
        self.versionId = versionId
    }
}

public struct GenerationAgentUsageFactMetadata: Codable {
    public let agentId: String?
    public let agentVersionId: String?
    public let mcpServerId: String?
    public let meteringSource: String?
    public let runId: String?
    public let skillId: String?
    public let stepId: String?
    public let toolId: String?


    public init(agentId: String? = nil, agentVersionId: String? = nil, mcpServerId: String? = nil, meteringSource: String? = nil, runId: String? = nil, skillId: String? = nil, stepId: String? = nil, toolId: String? = nil) {
        self.agentId = agentId
        self.agentVersionId = agentVersionId
        self.mcpServerId = mcpServerId
        self.meteringSource = meteringSource
        self.runId = runId
        self.skillId = skillId
        self.stepId = stepId
        self.toolId = toolId
    }
}

public struct GenerationAgentUsageSummary: Codable {
    public let cachedTokens: Int?
    public let completionTokens: Int?
    public let events: [GenerationAgentMeteringEvent]?
    public let imageCount: Int?
    public let promptTokens: Int?
    public let totalTokens: Int?
    public let videoSeconds: String?


    public init(cachedTokens: Int? = nil, completionTokens: Int? = nil, events: [GenerationAgentMeteringEvent]? = nil, imageCount: Int? = nil, promptTokens: Int? = nil, totalTokens: Int? = nil, videoSeconds: String? = nil) {
        self.cachedTokens = cachedTokens
        self.completionTokens = completionTokens
        self.events = events
        self.imageCount = imageCount
        self.promptTokens = promptTokens
        self.totalTokens = totalTokens
        self.videoSeconds = videoSeconds
    }
}

public struct GenerationHistoryItem: Codable {
    public let createdAt: String?
    public let date: String?
    public let id: String?
    public let images: [String]?
    public let modelInfo: String?
    public let prompt: String?
    public let status: String?
    public let type: String?
    public let updatedAt: String?
    public let url: String?
    public let videos: [GenerationHistoryMediaItem]?


    public init(createdAt: String? = nil, date: String? = nil, id: String? = nil, images: [String]? = nil, modelInfo: String? = nil, prompt: String? = nil, status: String? = nil, type: String? = nil, updatedAt: String? = nil, url: String? = nil, videos: [GenerationHistoryMediaItem]? = nil) {
        self.createdAt = createdAt
        self.date = date
        self.id = id
        self.images = images
        self.modelInfo = modelInfo
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

public struct GenerationsListResult: Codable {
    public let code: String?
    public let data: GenerationHistoryResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: GenerationHistoryResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
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

public struct IamLoginQrCodeConfirmRequest: Codable {
    public let qrKey: String?


    public init(qrKey: String? = nil) {
        self.qrKey = qrKey
    }
}

public struct IamLoginQrCodeResponse: Codable {
    public let description: String?
    public let expireTime: Int?
    public let qrContent: String?
    public let qrKey: String?
    public let qrUrl: String?
    public let title: String?
    public let type: String?


    public init(description: String? = nil, expireTime: Int? = nil, qrContent: String? = nil, qrKey: String? = nil, qrUrl: String? = nil, title: String? = nil, type: String? = nil) {
        self.description = description
        self.expireTime = expireTime
        self.qrContent = qrContent
        self.qrKey = qrKey
        self.qrUrl = qrUrl
        self.title = title
        self.type = type
    }
}

public struct IamLoginQrCodeStatusResponse: Codable {
    public let session: IamSessionResponse?
    public let status: String?
    public let token: IamSessionResponse?
    public let userInfo: IamUserResponse?


    public init(session: IamSessionResponse? = nil, status: String? = nil, token: IamSessionResponse? = nil, userInfo: IamUserResponse? = nil) {
        self.session = session
        self.status = status
        self.token = token
        self.userInfo = userInfo
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
    public let debugCode: String?
    public let expiresAt: String?


    public init(codeId: String? = nil, debugCode: String? = nil, expiresAt: String? = nil) {
        self.codeId = codeId
        self.debugCode = debugCode
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
    public let baseUrlOverride: String?
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


    public init(accessType: String? = nil, accountId: String? = nil, baseUrlOverride: String? = nil, capabilities: [String: String]? = nil, channelCode: String? = nil, circuitBreakerPolicy: [String: String]? = nil, consecutiveErrorCount: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, environment: String? = nil, healthStatus: String? = nil, id: String? = nil, lastLatencyMs: Int? = nil, metadata: [String: String]? = nil, modelMode: String? = nil, name: String? = nil, organizationId: String? = nil, priority: Int? = nil, protocol_: String? = nil, providerCode: String? = nil, providerId: String? = nil, proxyId: String? = nil, region: String? = nil, retryPolicy: [String: String]? = nil, rpmLimit: String? = nil, status: String? = nil, tenantId: String? = nil, timeoutMs: Int? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.accountId = accountId
        self.baseUrlOverride = baseUrlOverride
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


    public init(accountCode: String? = nil, accountName: String? = nil, authConfig: [String: String]? = nil, authType: String? = nil, consecutiveErrorCount: String? = nil, createdAt: String? = nil, credentialProfile: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, externalAccountId: String? = nil, id: String? = nil, lastBalanceCheckedAt: String? = nil, lastRotatedAt: String? = nil, lastUsedAt: String? = nil, lastVerifiedAt: String? = nil, maskedLabel: String? = nil, metadata: [String: String]? = nil, nextRotateAt: String? = nil, organizationId: String? = nil, providerCode: String? = nil, providerId: String? = nil, quotaLimit: String? = nil, quotaUnit: String? = nil, quotaUsed: String? = nil, riskLevel: String? = nil, secretHash: String? = nil, secretRef: String? = nil, secretRotationPolicy: [String: String]? = nil, secretVersion: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, upstreamBalanceAmount: String? = nil, upstreamBalanceCurrency: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.accountCode = accountCode
        self.accountName = accountName
        self.authConfig = authConfig
        self.authType = authType
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

public struct IntegrationProviderRecord: Codable {
    public let authType: String?
    public let baseUrlTemplate: String?
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


    public init(authType: String? = nil, baseUrlTemplate: String? = nil, capabilities: [String: String]? = nil, colorToken: String? = nil, createdAt: String? = nil, dataScope: String? = nil, defaultVendorCode: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, description: String? = nil, displayName: String? = nil, docsUrl: String? = nil, iconUrl: String? = nil, id: String? = nil, integrationType: String? = nil, metadata: [String: String]? = nil, metadataSchemaVersion: String? = nil, organizationId: String? = nil, protocol_: String? = nil, providerCode: String? = nil, sortOrder: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, upstreamProviderCode: String? = nil, upstreamVendorCode: String? = nil, uuid: String? = nil, version: String? = nil, websiteUrl: String? = nil) {
        self.authType = authType
        self.baseUrlTemplate = baseUrlTemplate
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

public struct LoginQrCodesConfirmResult: Codable {
    public let code: String?
    public let data: IamLoginQrCodeStatusResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamLoginQrCodeStatusResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct LoginQrCodesCreateResult: Codable {
    public let code: String?
    public let data: IamLoginQrCodeResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamLoginQrCodeResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct LoginQrCodesRetrieveResult: Codable {
    public let code: String?
    public let data: IamLoginQrCodeStatusResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamLoginQrCodeStatusResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct Message: Codable {
    public let content: String?
    public let desc: String?
    public let id: String?
    public let read: Bool?
    public let showAsPopup: Bool?
    public let time: String?
    public let title: String?
    public let type: String?


    public init(content: String? = nil, desc: String? = nil, id: String? = nil, read: Bool? = nil, showAsPopup: Bool? = nil, time: String? = nil, title: String? = nil, type: String? = nil) {
        self.content = content
        self.desc = desc
        self.id = id
        self.read = read
        self.showAsPopup = showAsPopup
        self.time = time
        self.title = title
        self.type = type
    }
}

public struct MessagesResponse: Codable {
    public let items: [Message]?


    public init(items: [Message]? = nil) {
        self.items = items
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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ModelRankingsSnapshot? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RankingVendorOptionsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ModelsListResult: Codable {
    public let code: String?
    public let data: AppModelCatalogResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AppModelCatalogResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct NoData: Codable {

    public init() {}
}

public struct NotificationsListResult: Codable {
    public let code: String?
    public let data: MessagesResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: MessagesResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct OauthAuthorizationUrlsRetrieveResult: Codable {
    public let code: String?
    public let data: IamOauthAuthorizationUrlResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamOauthAuthorizationUrlResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct OauthSessionsCreateResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
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

public struct OpsCouponIssueBatchRecord: Codable {
    public let audienceFilter: [String: String]?
    public let availableCount: String?
    public let batchNo: String?
    public let campaignCode: String?
    public let claimedCount: String?
    public let codePattern: String?
    public let codePrefix: String?
    public let couponId: String?
    public let couponTemplateId: String?
    public let createdAt: String?
    public let createdBy: String?
    public let dataScope: String?
    public let deletedAt: String?
    public let deletedBy: String?
    public let expireAt: String?
    public let generatedAt: String?
    public let generatedCount: String?
    public let generationStatus: String?
    public let id: String?
    public let metadata: [String: String]?
    public let name: String?
    public let organizationId: String?
    public let requestedCount: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let usedCount: String?
    public let uuid: String?
    public let version: String?
    public let voidedCount: String?


    public init(audienceFilter: [String: String]? = nil, availableCount: String? = nil, batchNo: String? = nil, campaignCode: String? = nil, claimedCount: String? = nil, codePattern: String? = nil, codePrefix: String? = nil, couponId: String? = nil, couponTemplateId: String? = nil, createdAt: String? = nil, createdBy: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, expireAt: String? = nil, generatedAt: String? = nil, generatedCount: String? = nil, generationStatus: String? = nil, id: String? = nil, metadata: [String: String]? = nil, name: String? = nil, organizationId: String? = nil, requestedCount: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, usedCount: String? = nil, uuid: String? = nil, version: String? = nil, voidedCount: String? = nil) {
        self.audienceFilter = audienceFilter
        self.availableCount = availableCount
        self.batchNo = batchNo
        self.campaignCode = campaignCode
        self.claimedCount = claimedCount
        self.codePattern = codePattern
        self.codePrefix = codePrefix
        self.couponId = couponId
        self.couponTemplateId = couponTemplateId
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.dataScope = dataScope
        self.deletedAt = deletedAt
        self.deletedBy = deletedBy
        self.expireAt = expireAt
        self.generatedAt = generatedAt
        self.generatedCount = generatedCount
        self.generationStatus = generationStatus
        self.id = id
        self.metadata = metadata
        self.name = name
        self.organizationId = organizationId
        self.requestedCount = requestedCount
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
        self.usedCount = usedCount
        self.uuid = uuid
        self.version = version
        self.voidedCount = voidedCount
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
    public let readAt: String?
    public let retryCount: Int?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, deliveredAt: String? = nil, deliveryChannel: String? = nil, deliveryStatus: String? = nil, failureCode: String? = nil, id: String? = nil, messageId: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, ownerId: String? = nil, ownerType: String? = nil, readAt: String? = nil, retryCount: Int? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
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
    public let targetOwnerId: String?
    public let targetOwnerType: String?
    public let targetScope: String?
    public let targetUserId: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?
    public let uuid: String?
    public let version: String?


    public init(actionUrl: String? = nil, content: String? = nil, createdAt: String? = nil, dataScope: String? = nil, deletedAt: String? = nil, deletedBy: String? = nil, expireAt: String? = nil, id: String? = nil, messageCode: String? = nil, messageType: String? = nil, metadata: [String: String]? = nil, organizationId: String? = nil, publishedAt: String? = nil, severity: String? = nil, status: String? = nil, summary: String? = nil, targetOwnerId: String? = nil, targetOwnerType: String? = nil, targetScope: String? = nil, targetUserId: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.actionUrl = actionUrl
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
        self.targetOwnerId = targetOwnerId
        self.targetOwnerType = targetOwnerType
        self.targetScope = targetScope
        self.targetUserId = targetUserId
        self.tenantId = tenantId
        self.title = title
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

public struct PasswordResetRequestsCreateResult: Codable {
    public let code: String?
    public let data: IamPasswordResetRequestResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamPasswordResetRequestResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct PasswordResetsCreateResult: Codable {
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

public struct PaymentsCheckoutRetrieveResult: Codable {
    public let code: String?
    public let data: CheckoutStatusResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CheckoutStatusResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct PaymentsRecordsListResult: Codable {
    public let code: String?
    public let data: [BillingRechargeHistoryItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [BillingRechargeHistoryItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct PaymentsRecordsRetrieveResult: Codable {
    public let code: String?
    public let data: BillingRechargeHistoryItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: BillingRechargeHistoryItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct PlusAccountExchangeConfigRecord: Codable {

    public init() {}
}

public struct PlusAccountHistoryRecord: Codable {

    public init() {}
}

public struct PlusAccountRecord: Codable {

    public init() {}
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

public struct PlusCouponRecord: Codable {

    public init() {}
}

public struct PlusCouponTemplateRecord: Codable {

    public init() {}
}

public struct PlusCurrencyRecord: Codable {

    public init() {}
}

public struct PlusDepartmentRecord: Codable {

    public init() {}
}

public struct PlusExchangeRateRecord: Codable {

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

public struct PlusInvoiceItemRecord: Codable {

    public init() {}
}

public struct PlusInvoiceRecord: Codable {

    public init() {}
}

public struct PlusInvoiceRecordRecord: Codable {

    public init() {}
}

public struct PlusLedgerBridgeRecord: Codable {

    public init() {}
}

public struct PlusMemberCardRecord: Codable {

    public init() {}
}

public struct PlusMemberLevelRecord: Codable {

    public init() {}
}

public struct PlusOrderDispatchRuleRecord: Codable {

    public init() {}
}

public struct PlusOrderItemRecord: Codable {

    public init() {}
}

public struct PlusOrderRecord: Codable {

    public init() {}
}

public struct PlusOrderWorkerDispatchProfileRecord: Codable {

    public init() {}
}

public struct PlusPartnerRecord: Codable {

    public init() {}
}

public struct PlusPaymentRecord: Codable {

    public init() {}
}

public struct PlusPaymentWebhookEventRecord: Codable {

    public init() {}
}

public struct PlusPositionRecord: Codable {

    public init() {}
}

public struct PlusProductRecord: Codable {

    public init() {}
}

public struct PlusRefundRecord: Codable {

    public init() {}
}

public struct PlusShopRecord: Codable {

    public init() {}
}

public struct PlusShoppingCartItemRecord: Codable {

    public init() {}
}

public struct PlusShoppingCartRecord: Codable {

    public init() {}
}

public struct PlusSkuRecord: Codable {

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

public struct PlusUserCouponRecord: Codable {

    public init() {}
}

public struct PlusVipBenefitRecord: Codable {

    public init() {}
}

public struct PlusVipBenefitUsageRecord: Codable {

    public init() {}
}

public struct PlusVipLevelBenefitRecord: Codable {

    public init() {}
}

public struct PlusVipLevelRecord: Codable {

    public init() {}
}

public struct PlusVipPackGroupRecord: Codable {

    public init() {}
}

public struct PlusVipPackRecord: Codable {

    public init() {}
}

public struct PlusVipPointChangeRecord: Codable {

    public init() {}
}

public struct PlusVipRechargeMethodRecord: Codable {

    public init() {}
}

public struct PlusVipRechargePackRecord: Codable {

    public init() {}
}

public struct PlusVipRechargeRecord: Codable {

    public init() {}
}

public struct PlusVipUserRecord: Codable {

    public init() {}
}

public struct PreflightEstimatesCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct PreflightPrechecksCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct PreflightPreholdsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct PreflightReleasesCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct PreflightSettlementsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
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
    public let status: Int?
    public let title: String?
    public let traceId: String?
    public let type: String?


    public init(code: String? = nil, detail: String? = nil, errors: [FieldError]? = nil, instance: String? = nil, status: Int? = nil, title: String? = nil, traceId: String? = nil, type: String? = nil) {
        self.code = code
        self.detail = detail
        self.errors = errors
        self.instance = instance
        self.status = status
        self.title = title
        self.traceId = traceId
        self.type = type
    }
}

public struct ProviderConfig: Codable {
    public let description: String?
    public let id: String?
    public let integrationType: String?
    public let name: String?
    public let providerFamily: String?
    public let status: String?
    public let url: String?


    public init(description: String? = nil, id: String? = nil, integrationType: String? = nil, name: String? = nil, providerFamily: String? = nil, status: String? = nil, url: String? = nil) {
        self.description = description
        self.id = id
        self.integrationType = integrationType
        self.name = name
        self.providerFamily = providerFamily
        self.status = status
        self.url = url
    }
}

public struct ProviderRetryPolicy: Codable {
    public let backoffMs: Int?
    public let maxAttempts: Int?
    public let retryableStatusCodes: [Int]?


    public init(backoffMs: Int? = nil, maxAttempts: Int? = nil, retryableStatusCodes: [Int]? = nil) {
        self.backoffMs = backoffMs
        self.maxAttempts = maxAttempts
        self.retryableStatusCodes = retryableStatusCodes
    }
}

public struct ProvidersListResult: Codable {
    public let code: String?
    public let data: ProvidersResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ProvidersResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ProvidersResponse: Codable {
    public let items: [ProviderConfig]?


    public init(items: [ProviderConfig]? = nil) {
        self.items = items
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

public struct RechargePackage: Codable {
    public let bonus: Int?
    public let id: String?
    public let points: Int?
    public let rmb: String?


    public init(bonus: Int? = nil, id: String? = nil, points: Int? = nil, rmb: String? = nil) {
        self.bonus = bonus
        self.id = id
        self.points = points
        self.rmb = rmb
    }
}

public struct RedeemCodeRequest: Codable {
    public let code: String?


    public init(code: String? = nil) {
        self.code = code
    }
}

public struct RedeemCodeResponse: Codable {
    public let amount: String?
    public let balance: Int?
    public let creditedPoints: Int?
    public let message: String?


    public init(amount: String? = nil, balance: Int? = nil, creditedPoints: Int? = nil, message: String? = nil) {
        self.amount = amount
        self.balance = balance
        self.creditedPoints = creditedPoints
        self.message = message
    }
}

public struct RegistrationsCreateResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingApiKeysListResult: Codable {
    public let code: String?
    public let data: RoutingApiKeysResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RoutingApiKeysResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingApiKeysResponse: Codable {
    public let items: [[String: Any]]?


    public init(items: [[String: Any]]? = nil) {
        self.items = items
    }
}

public struct RoutingChannelDeleteResponse: Codable {
    public let deleted: Bool?


    public init(deleted: Bool? = nil) {
        self.deleted = deleted
    }
}

public struct RoutingChannelItem: Codable {
    public let accessType: String?
    public let apiKey: String?
    public let balance: String?
    public let baseUrl: String?
    public let capabilities: [String]?
    public let errors: Int?
    public let id: String?
    public let isMultimodal: Bool?
    public let latency: String?
    public let models: [String]?
    public let name: String?
    public let protocol_: String?
    public let provider: String?
    public let providerCode: String?
    public let retryPolicy: ProviderRetryPolicy?
    public let rpm: Int?
    public let status: String?
    public let timeoutMs: Int?
    public let vendor: String?
    public let weight: Int?


    public init(accessType: String? = nil, apiKey: String? = nil, balance: String? = nil, baseUrl: String? = nil, capabilities: [String]? = nil, errors: Int? = nil, id: String? = nil, isMultimodal: Bool? = nil, latency: String? = nil, models: [String]? = nil, name: String? = nil, protocol_: String? = nil, provider: String? = nil, providerCode: String? = nil, retryPolicy: ProviderRetryPolicy? = nil, rpm: Int? = nil, status: String? = nil, timeoutMs: Int? = nil, vendor: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.apiKey = apiKey
        self.balance = balance
        self.baseUrl = baseUrl
        self.capabilities = capabilities
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

public struct RoutingChannelMutationResponse: Codable {
    public let item: RoutingChannelItem?


    public init(item: RoutingChannelItem? = nil) {
        self.item = item
    }
}

public struct RoutingChannelTestResponse: Codable {
    public let channelId: String?
    public let item: RoutingChannelItem?
    public let latency: String?
    public let status: String?
    public let success: Bool?


    public init(channelId: String? = nil, item: RoutingChannelItem? = nil, latency: String? = nil, status: String? = nil, success: Bool? = nil) {
        self.channelId = channelId
        self.item = item
        self.latency = latency
        self.status = status
        self.success = success
    }
}

public struct RoutingChannelsCreateResult: Codable {
    public let code: String?
    public let data: RoutingChannelMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RoutingChannelMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingChannelsDeleteResult: Codable {
    public let code: String?
    public let data: RoutingChannelDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RoutingChannelDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingChannelsListResult: Codable {
    public let code: String?
    public let data: RoutingChannelsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RoutingChannelsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingChannelsResponse: Codable {
    public let items: [[String: Any]]?


    public init(items: [[String: Any]]? = nil) {
        self.items = items
    }
}

public struct RoutingChannelsStatusUpdateResult: Codable {
    public let code: String?
    public let data: RoutingChannelMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RoutingChannelMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingChannelsUpdateResult: Codable {
    public let code: String?
    public let data: RoutingChannelMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RoutingChannelMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingChannelsVerifyResult: Codable {
    public let code: String?
    public let data: RoutingChannelTestResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RoutingChannelTestResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingRequestTracesListResult: Codable {
    public let code: String?
    public let data: RoutingRequestTracesResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RoutingRequestTracesResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingRequestTracesResponse: Codable {
    public let items: [[String: Any]]?


    public init(items: [[String: Any]]? = nil) {
        self.items = items
    }
}

public struct RoutingStrategyListResult: Codable {
    public let code: String?
    public let data: RoutingStrategySnapshot?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RoutingStrategySnapshot? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingStrategySnapshot: Codable {
    public let mappingRules: [[String: Any]]?
    public let strategy: String?


    public init(mappingRules: [[String: Any]]? = nil, strategy: String? = nil) {
        self.mappingRules = mappingRules
        self.strategy = strategy
    }
}

public struct RoutingStrategyUpdateResult: Codable {
    public let code: String?
    public let data: UpdateRoutingStrategyResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: UpdateRoutingStrategyResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingUsageListResult: Codable {
    public let code: String?
    public let data: RoutingUsageSnapshot?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: RoutingUsageSnapshot? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RoutingUsageSnapshot: Codable {
    public let chartData: [[String: Any]]?
    public let modelStats: [[String: Any]]?


    public init(chartData: [[String: Any]]? = nil, modelStats: [[String: Any]]? = nil) {
        self.chartData = chartData
        self.modelStats = modelStats
    }
}

public struct RuntimeSettingsRetrieveResult: Codable {
    public let code: String?
    public let data: AuthRuntimeSettingsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AuthRuntimeSettingsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SessionsCreateResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SessionsCurrentDeleteResult: Codable {
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

public struct SessionsCurrentRetrieveResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SessionsCurrentUpdateResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SessionsRefreshResult: Codable {
    public let code: String?
    public let data: IamSessionResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamSessionResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SetRoutingChannelStatusRequest: Codable {
    public let status: String?


    public init(status: String? = nil) {
        self.status = status
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

public struct SettlementBill: Codable {
    public let breakdown: SettlementBillBreakdown?
    public let endDate: String?
    public let id: String?
    public let period: String?
    public let startDate: String?
    public let status: String?
    public let totalCost: String?
    public let totalTokens: String?


    public init(breakdown: SettlementBillBreakdown? = nil, endDate: String? = nil, id: String? = nil, period: String? = nil, startDate: String? = nil, status: String? = nil, totalCost: String? = nil, totalTokens: String? = nil) {
        self.breakdown = breakdown
        self.endDate = endDate
        self.id = id
        self.period = period
        self.startDate = startDate
        self.status = status
        self.totalCost = totalCost
        self.totalTokens = totalTokens
    }
}

public struct SettlementBillBreakdown: Codable {
    public let audio: SettlementBillBreakdownItem?
    public let image: SettlementBillBreakdownItem?
    public let music: SettlementBillBreakdownItem?
    public let text: SettlementBillBreakdownItem?
    public let video: SettlementBillBreakdownItem?


    public init(audio: SettlementBillBreakdownItem? = nil, image: SettlementBillBreakdownItem? = nil, music: SettlementBillBreakdownItem? = nil, text: SettlementBillBreakdownItem? = nil, video: SettlementBillBreakdownItem? = nil) {
        self.audio = audio
        self.image = image
        self.music = music
        self.text = text
        self.video = video
    }
}

public struct SettlementBillBreakdownItem: Codable {
    public let cost: String?
    public let models: [String]?
    public let usage: String?


    public init(cost: String? = nil, models: [String]? = nil, usage: String? = nil) {
        self.cost = cost
        self.models = models
        self.usage = usage
    }
}

public struct SettlementChartPoint: Codable {
    public let audio: String?
    public let day: String?
    public let image: String?
    public let music: String?
    public let text: String?
    public let video: String?


    public init(audio: String? = nil, day: String? = nil, image: String? = nil, music: String? = nil, text: String? = nil, video: String? = nil) {
        self.audio = audio
        self.day = day
        self.image = image
        self.music = music
        self.text = text
        self.video = video
    }
}

public struct SettlementDashboardResponse: Codable {
    public let bills: [SettlementBill]?
    public let chartData: [SettlementChartPoint]?


    public init(bills: [SettlementBill]? = nil, chartData: [SettlementChartPoint]? = nil) {
        self.bills = bills
        self.chartData = chartData
    }
}

public struct SettlementsDashboardListResult: Codable {
    public let code: String?
    public let data: SettlementDashboardResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: SettlementDashboardResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: SkillCategoriesResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsConfigUpdateResult: Codable {
    public let code: String?
    public let data: AppInstalledSkillResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AppInstalledSkillResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsDisableResult: Codable {
    public let code: String?
    public let data: AppInstalledSkillResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AppInstalledSkillResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsEnableResult: Codable {
    public let code: String?
    public let data: AppInstalledSkillResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AppInstalledSkillResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsListResult: Codable {
    public let code: String?
    public let data: SkillsCatalogResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: SkillsCatalogResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsRetrieveResult: Codable {
    public let code: String?
    public let data: SkillDetailResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: SkillDetailResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
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

public struct SubmitRechargeRequest: Codable {
    public let amount: String?
    public let method: String?


    public init(amount: String? = nil, method: String? = nil) {
        self.amount = amount
        self.method = method
    }
}

public struct SubmitRechargeResponse: Codable {
    public let amount: String?
    public let orderNo: String?
    public let paymentMethod: String?
    public let points: Int?
    public let status: String?
    public let success: Bool?


    public init(amount: String? = nil, orderNo: String? = nil, paymentMethod: String? = nil, points: Int? = nil, status: String? = nil, success: Bool? = nil) {
        self.amount = amount
        self.orderNo = orderNo
        self.paymentMethod = paymentMethod
        self.points = points
        self.status = status
        self.success = success
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

public struct UpdateApiKeyRequest: Codable {
    public let expires: String?
    public let group: String?
    public let ipLimit: String?
    public let isUnlimitedQuota: Bool?
    public let modalities: [String]?
    public let name: String?
    public let quota: String?


    public init(expires: String? = nil, group: String? = nil, ipLimit: String? = nil, isUnlimitedQuota: Bool? = nil, modalities: [String]? = nil, name: String? = nil, quota: String? = nil) {
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

public struct UpdateRoutingChannelRequest: Codable {
    public let accessType: String?
    public let baseUrl: String?
    public let capabilities: [String]?
    public let models: [String]?
    public let name: String?
    public let protocol_: String?
    public let retryPolicy: ProviderRetryPolicy?
    public let secretRef: String?
    public let status: String?
    public let timeoutMs: Int?
    public let vendor: String?
    public let weight: Int?


    public init(accessType: String? = nil, baseUrl: String? = nil, capabilities: [String]? = nil, models: [String]? = nil, name: String? = nil, protocol_: String? = nil, retryPolicy: ProviderRetryPolicy? = nil, secretRef: String? = nil, status: String? = nil, timeoutMs: Int? = nil, vendor: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.baseUrl = baseUrl
        self.capabilities = capabilities
        self.models = models
        self.name = name
        self.protocol_ = protocol_
        self.retryPolicy = retryPolicy
        self.secretRef = secretRef
        self.status = status
        self.timeoutMs = timeoutMs
        self.vendor = vendor
        self.weight = weight
    }
}

public struct UpdateRoutingStrategyRequest: Codable {
    public let mappingRules: [[String: Any]]?
    public let strategy: String?


    public init(mappingRules: [[String: Any]]? = nil, strategy: String? = nil) {
        self.mappingRules = mappingRules
        self.strategy = strategy
    }
}

public struct UpdateRoutingStrategyResponse: Codable {
    public let success: Bool?


    public init(success: Bool? = nil) {
        self.success = success
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
    public let group: String?
    public let id: String?
    public let inputTokens: Int?
    public let ip: String?
    public let isStream: Bool?
    public let model: String?
    public let multiplier: String?
    public let outputTokens: Int?
    public let path: String?
    public let reasoningEffort: String?
    public let requestId: String?
    public let time: String?
    public let tokenName: String?
    public let totalTime: String?
    public let ttft: String?
    public let type: String?


    public init(baseInputPrice: String? = nil, baseOutputPrice: String? = nil, cacheReadPrice: String? = nil, cacheReadTokens: Int? = nil, cost: String? = nil, group: String? = nil, id: String? = nil, inputTokens: Int? = nil, ip: String? = nil, isStream: Bool? = nil, model: String? = nil, multiplier: String? = nil, outputTokens: Int? = nil, path: String? = nil, reasoningEffort: String? = nil, requestId: String? = nil, time: String? = nil, tokenName: String? = nil, totalTime: String? = nil, ttft: String? = nil, type: String? = nil) {
        self.baseInputPrice = baseInputPrice
        self.baseOutputPrice = baseOutputPrice
        self.cacheReadPrice = cacheReadPrice
        self.cacheReadTokens = cacheReadTokens
        self.cost = cost
        self.group = group
        self.id = id
        self.inputTokens = inputTokens
        self.ip = ip
        self.isStream = isStream
        self.model = model
        self.multiplier = multiplier
        self.outputTokens = outputTokens
        self.path = path
        self.reasoningEffort = reasoningEffort
        self.requestId = requestId
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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: UsageLogsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
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

public struct UsersCurrentCommentsListResult: Codable {
    public let code: String?
    public let data: ForumCommentPage?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ForumCommentPage? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct UsersCurrentCouponsListResult: Codable {
    public let code: String?
    public let data: [BillingRedeemHistoryItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [BillingRedeemHistoryItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct UsersCurrentCouponsRetrieveResult: Codable {
    public let code: String?
    public let data: BillingRedeemHistoryItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: BillingRedeemHistoryItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct UsersCurrentRetrieveResult: Codable {
    public let code: String?
    public let data: IamUserResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamUserResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct UsersCurrentSkillsListResult: Codable {
    public let code: String?
    public let data: AppInstalledSkillsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AppInstalledSkillsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct UsersSettingsRetrieveResult: Codable {
    public let code: String?
    public let data: SettingsDataResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: SettingsDataResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct UsersSettingsUpdateResult: Codable {
    public let code: String?
    public let data: UpdateSettingsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: UpdateSettingsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VerificationCodesCreateResult: Codable {
    public let code: String?
    public let data: IamVerificationCodeResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamVerificationCodeResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VerificationCodesVerifyResult: Codable {
    public let code: String?
    public let data: IamVerificationCodeVerifyResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: IamVerificationCodeVerifyResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VerificationPolicyRetrieveResult: Codable {
    public let code: String?
    public let data: AuthVerificationPolicy?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AuthVerificationPolicy? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipBenefitsListResult: Codable {
    public let code: String?
    public let data: [CommerceVipBenefitItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommerceVipBenefitItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipInfoRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceVipInfoResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceVipInfoResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipLevelsListResult: Codable {
    public let code: String?
    public let data: [CommerceVipLevelItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommerceVipLevelItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPackGroupsListResult: Codable {
    public let code: String?
    public let data: [CommerceVipPackGroupItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommerceVipPackGroupItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPackGroupsPacksListResult: Codable {
    public let code: String?
    public let data: [CommerceVipPackItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommerceVipPackItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPackGroupsRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceVipPackGroupItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceVipPackGroupItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPacksListResult: Codable {
    public let code: String?
    public let data: [RechargePackage]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [RechargePackage]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPacksRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceVipPackItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceVipPackItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPointsBalanceRetrieveResult: Codable {
    public let code: String?
    public let data: CommercePointsBalanceResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommercePointsBalanceResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPointsDailyRewardsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPointsDailyRewardsStatusRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceVipDailyRewardStatusResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceVipDailyRewardStatusResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPointsHistoryListResult: Codable {
    public let code: String?
    public let data: [CommercePointsHistoryItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommercePointsHistoryItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPrivilegesSpeedUpsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPrivilegesUsageRetrieveResult: Codable {
    public let code: String?
    public let data: [CommerceVipPrivilegeUsageItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommerceVipPrivilegeUsageItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPurchaseCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPurchaseRenewResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipPurchaseUpgradeResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipStatusRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceVipInfoResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceVipInfoResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct WalletAccountsListResult: Codable {
    public let code: String?
    public let data: [CommerceWalletAccountItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommerceWalletAccountItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct WalletExchangesCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct WalletOperationsRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceWalletTransactionItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceWalletTransactionItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct WalletOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceWalletOverviewResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceWalletOverviewResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct WalletTopupsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct WalletTransactionsListResult: Codable {
    public let code: String?
    public let data: [CommerceWalletTransactionItem]?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: [CommerceWalletTransactionItem]? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct WalletTransactionsRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceWalletTransactionItem?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceWalletTransactionItem? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct WalletTransfersCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct WalletWithdrawalsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}
