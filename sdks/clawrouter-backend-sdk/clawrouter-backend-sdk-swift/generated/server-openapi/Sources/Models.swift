import Foundation

public struct AccessGroupsCreateResult: Codable {
    public let code: String?
    public let data: AdminAccessGroupMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAccessGroupMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccessGroupsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccessGroupsListResult: Codable {
    public let code: String?
    public let data: AdminAccessGroupsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAccessGroupsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccessGroupsUpdateResult: Codable {
    public let code: String?
    public let data: AdminAccessGroupMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAccessGroupMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsCreateResult: Codable {
    public let code: String?
    public let data: OpenPlatformAccountResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformAccountResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsDeleteResult: Codable {
    public let code: String?
    public let data: OpenPlatformAccountResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformAccountResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsEntriesCreateResult: Codable {
    public let code: String?
    public let data: OpenPlatformEntryResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformEntryResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsEntriesDeleteResult: Codable {
    public let code: String?
    public let data: OpenPlatformEntryResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformEntryResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsEntriesListResult: Codable {
    public let code: String?
    public let data: OpenPlatformEntryListResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformEntryListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsEntriesUpdateResult: Codable {
    public let code: String?
    public let data: OpenPlatformEntryResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformEntryResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsListResult: Codable {
    public let code: String?
    public let data: OpenPlatformAccountListResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformAccountListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsPayBindingsCreateResult: Codable {
    public let code: String?
    public let data: OpenPlatformPayBindingResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformPayBindingResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsPayBindingsDeleteResult: Codable {
    public let code: String?
    public let data: OpenPlatformPayBindingResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformPayBindingResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsPayBindingsListResult: Codable {
    public let code: String?
    public let data: OpenPlatformPayBindingListResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformPayBindingListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsRetrieveResult: Codable {
    public let code: String?
    public let data: OpenPlatformAccountResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformAccountResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AccountsUpdateResult: Codable {
    public let code: String?
    public let data: OpenPlatformAccountResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformAccountResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AdminAccessGroupCreateRequest: Codable {
    public let billingType: String?
    public let capacity: [String: Any]?
    public let name: String?
    public let platform: String?
    public let rateMultiplier: Double?
    public let status: String?
    public let type: String?


    public init(billingType: String? = nil, capacity: [String: Any]? = nil, name: String? = nil, platform: String? = nil, rateMultiplier: Double? = nil, status: String? = nil, type: String? = nil) {
        self.billingType = billingType
        self.capacity = capacity
        self.name = name
        self.platform = platform
        self.rateMultiplier = rateMultiplier
        self.status = status
        self.type = type
    }
}

public struct AdminAccessGroupItem: Codable {
    public let accountCount: AdminCountPair?
    public let billingType: String?
    public let capacity: AdminCapacityPair?
    public let id: String?
    public let name: String?
    public let platform: String?
    public let rateMultiplier: Double?
    public let status: String?
    public let type: String?
    public let usage: AdminUsagePair?


    public init(accountCount: AdminCountPair? = nil, billingType: String? = nil, capacity: AdminCapacityPair? = nil, id: String? = nil, name: String? = nil, platform: String? = nil, rateMultiplier: Double? = nil, status: String? = nil, type: String? = nil, usage: AdminUsagePair? = nil) {
        self.accountCount = accountCount
        self.billingType = billingType
        self.capacity = capacity
        self.id = id
        self.name = name
        self.platform = platform
        self.rateMultiplier = rateMultiplier
        self.status = status
        self.type = type
        self.usage = usage
    }
}

public struct AdminAccessGroupMutationResponse: Codable {
    public let item: AdminAccessGroupItem?


    public init(item: AdminAccessGroupItem? = nil) {
        self.item = item
    }
}

public struct AdminAccessGroupUpdateRequest: Codable {
    public let billingType: String?
    public let capacity: [String: Any]?
    public let name: String?
    public let platform: String?
    public let rateMultiplier: Double?
    public let status: String?
    public let type: String?


    public init(billingType: String? = nil, capacity: [String: Any]? = nil, name: String? = nil, platform: String? = nil, rateMultiplier: Double? = nil, status: String? = nil, type: String? = nil) {
        self.billingType = billingType
        self.capacity = capacity
        self.name = name
        self.platform = platform
        self.rateMultiplier = rateMultiplier
        self.status = status
        self.type = type
    }
}

public struct AdminAccessGroupsResponse: Codable {
    public let items: [AdminAccessGroupItem]?


    public init(items: [AdminAccessGroupItem]? = nil) {
        self.items = items
    }
}

public struct AdminAgentCapabilities: Codable {
    public let mcpServerCount: Int?
    public let memoryEnabled: Bool?
    public let skillBindingCount: Int?


    public init(mcpServerCount: Int? = nil, memoryEnabled: Bool? = nil, skillBindingCount: Int? = nil) {
        self.mcpServerCount = mcpServerCount
        self.memoryEnabled = memoryEnabled
        self.skillBindingCount = skillBindingCount
    }
}

public struct AdminAgentItem: Codable {
    public let avatarUrl: String?
    public let capabilities: AdminAgentCapabilities?
    public let code: String?
    public let createdAt: String?
    public let defaultVersion: AdminAgentVersionItem?
    public let description: String?
    public let id: String?
    public let name: String?
    public let ownerUserId: Int?
    public let status: String?
    public let templateSource: String?
    public let updatedAt: String?
    public let visibility: String?


    public init(avatarUrl: String? = nil, capabilities: AdminAgentCapabilities? = nil, code: String? = nil, createdAt: String? = nil, defaultVersion: AdminAgentVersionItem? = nil, description: String? = nil, id: String? = nil, name: String? = nil, ownerUserId: Int? = nil, status: String? = nil, templateSource: String? = nil, updatedAt: String? = nil, visibility: String? = nil) {
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

public struct AdminAgentListResponse: Codable {
    public let items: [AdminAgentItem]?


    public init(items: [AdminAgentItem]? = nil) {
        self.items = items
    }
}

public struct AdminAgentVersionItem: Codable {
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

public struct AdminAiModelCreateRequest: Codable {
    public let apiFormat: String?
    public let cacheReadPrice: String?
    public let cacheWritePrice: String?
    public let capabilityIntro: String?
    public let contextTokens: String?
    public let description: String?
    public let displayName: String?
    public let inputModalities: [String]?
    public let limitations: [String]?
    public let maxOutputTokens: Int?
    public let modalities: [String]?
    public let model: String?
    public let name: String?
    public let outputModalities: [String]?
    public let priceIn: String?
    public let priceOut: String?
    public let regionPrices: [AdminAiModelRegionPrice]?
    public let releaseStage: Int?
    public let replacementModel: String?
    public let routingState: Int?
    public let shelfState: Int?
    public let supportedLanguages: [String]?
    public let supportsJsonSchema: Bool?
    public let supportsStreaming: Bool?
    public let supportsTools: Bool?
    public let trainingDataCutoff: String?
    public let type: String?
    public let useCases: [String]?
    public let vendorId: String?


    public init(apiFormat: String? = nil, cacheReadPrice: String? = nil, cacheWritePrice: String? = nil, capabilityIntro: String? = nil, contextTokens: String? = nil, description: String? = nil, displayName: String? = nil, inputModalities: [String]? = nil, limitations: [String]? = nil, maxOutputTokens: Int? = nil, modalities: [String]? = nil, model: String? = nil, name: String? = nil, outputModalities: [String]? = nil, priceIn: String? = nil, priceOut: String? = nil, regionPrices: [AdminAiModelRegionPrice]? = nil, releaseStage: Int? = nil, replacementModel: String? = nil, routingState: Int? = nil, shelfState: Int? = nil, supportedLanguages: [String]? = nil, supportsJsonSchema: Bool? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, trainingDataCutoff: String? = nil, type: String? = nil, useCases: [String]? = nil, vendorId: String? = nil) {
        self.apiFormat = apiFormat
        self.cacheReadPrice = cacheReadPrice
        self.cacheWritePrice = cacheWritePrice
        self.capabilityIntro = capabilityIntro
        self.contextTokens = contextTokens
        self.description = description
        self.displayName = displayName
        self.inputModalities = inputModalities
        self.limitations = limitations
        self.maxOutputTokens = maxOutputTokens
        self.modalities = modalities
        self.model = model
        self.name = name
        self.outputModalities = outputModalities
        self.priceIn = priceIn
        self.priceOut = priceOut
        self.regionPrices = regionPrices
        self.releaseStage = releaseStage
        self.replacementModel = replacementModel
        self.routingState = routingState
        self.shelfState = shelfState
        self.supportedLanguages = supportedLanguages
        self.supportsJsonSchema = supportsJsonSchema
        self.supportsStreaming = supportsStreaming
        self.supportsTools = supportsTools
        self.trainingDataCutoff = trainingDataCutoff
        self.type = type
        self.useCases = useCases
        self.vendorId = vendorId
    }
}

public struct AdminAiModelItem: Codable {
    public let apiFormat: String?
    public let cacheReadPrice: String?
    public let cacheWritePrice: String?
    public let calls: String?
    public let capabilityIntro: String?
    public let contextTokens: Int?
    public let description: String?
    public let displayName: String?
    public let id: String?
    public let inputModalities: [String]?
    public let limitations: [String]?
    public let maxOutputTokens: Int?
    public let modalities: [String]?
    public let model: String?
    public let name: String?
    public let outputModalities: [String]?
    public let priceIn: String?
    public let priceOut: String?
    public let releaseStage: Int?
    public let replacementModel: String?
    public let routingState: Int?
    public let shelfState: Int?
    public let status: String?
    public let supportedLanguages: [String]?
    public let supportsJsonSchema: Bool?
    public let supportsStreaming: Bool?
    public let supportsTools: Bool?
    public let trainingDataCutoff: String?
    public let type: String?
    public let useCases: [String]?
    public let vendorCode: String?
    public let vendorId: String?


    public init(apiFormat: String? = nil, cacheReadPrice: String? = nil, cacheWritePrice: String? = nil, calls: String? = nil, capabilityIntro: String? = nil, contextTokens: Int? = nil, description: String? = nil, displayName: String? = nil, id: String? = nil, inputModalities: [String]? = nil, limitations: [String]? = nil, maxOutputTokens: Int? = nil, modalities: [String]? = nil, model: String? = nil, name: String? = nil, outputModalities: [String]? = nil, priceIn: String? = nil, priceOut: String? = nil, releaseStage: Int? = nil, replacementModel: String? = nil, routingState: Int? = nil, shelfState: Int? = nil, status: String? = nil, supportedLanguages: [String]? = nil, supportsJsonSchema: Bool? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, trainingDataCutoff: String? = nil, type: String? = nil, useCases: [String]? = nil, vendorCode: String? = nil, vendorId: String? = nil) {
        self.apiFormat = apiFormat
        self.cacheReadPrice = cacheReadPrice
        self.cacheWritePrice = cacheWritePrice
        self.calls = calls
        self.capabilityIntro = capabilityIntro
        self.contextTokens = contextTokens
        self.description = description
        self.displayName = displayName
        self.id = id
        self.inputModalities = inputModalities
        self.limitations = limitations
        self.maxOutputTokens = maxOutputTokens
        self.modalities = modalities
        self.model = model
        self.name = name
        self.outputModalities = outputModalities
        self.priceIn = priceIn
        self.priceOut = priceOut
        self.releaseStage = releaseStage
        self.replacementModel = replacementModel
        self.routingState = routingState
        self.shelfState = shelfState
        self.status = status
        self.supportedLanguages = supportedLanguages
        self.supportsJsonSchema = supportsJsonSchema
        self.supportsStreaming = supportsStreaming
        self.supportsTools = supportsTools
        self.trainingDataCutoff = trainingDataCutoff
        self.type = type
        self.useCases = useCases
        self.vendorCode = vendorCode
        self.vendorId = vendorId
    }
}

public struct AdminAiModelMutationResponse: Codable {
    public let item: AdminAiModelItem?


    public init(item: AdminAiModelItem? = nil) {
        self.item = item
    }
}

public struct AdminAiModelRegionPrice: Codable {
    public let cacheReadPrice: String?
    public let cacheWritePrice: String?
    public let priceIn: String?
    public let priceOut: String?
    public let regionCode: String?


    public init(cacheReadPrice: String? = nil, cacheWritePrice: String? = nil, priceIn: String? = nil, priceOut: String? = nil, regionCode: String? = nil) {
        self.cacheReadPrice = cacheReadPrice
        self.cacheWritePrice = cacheWritePrice
        self.priceIn = priceIn
        self.priceOut = priceOut
        self.regionCode = regionCode
    }
}

public struct AdminAiModelUpdateRequest: Codable {
    public let apiFormat: String?
    public let cacheReadPrice: String?
    public let cacheWritePrice: String?
    public let capabilityIntro: String?
    public let contextTokens: String?
    public let description: String?
    public let displayName: String?
    public let inputModalities: [String]?
    public let limitations: [String]?
    public let maxOutputTokens: Int?
    public let modalities: [String]?
    public let model: String?
    public let name: String?
    public let outputModalities: [String]?
    public let priceIn: String?
    public let priceOut: String?
    public let regionPrices: [AdminAiModelRegionPrice]?
    public let releaseStage: Int?
    public let replacementModel: String?
    public let routingState: Int?
    public let shelfState: Int?
    public let status: String?
    public let supportedLanguages: [String]?
    public let supportsJsonSchema: Bool?
    public let supportsStreaming: Bool?
    public let supportsTools: Bool?
    public let trainingDataCutoff: String?
    public let type: String?
    public let useCases: [String]?
    public let vendorId: String?


    public init(apiFormat: String? = nil, cacheReadPrice: String? = nil, cacheWritePrice: String? = nil, capabilityIntro: String? = nil, contextTokens: String? = nil, description: String? = nil, displayName: String? = nil, inputModalities: [String]? = nil, limitations: [String]? = nil, maxOutputTokens: Int? = nil, modalities: [String]? = nil, model: String? = nil, name: String? = nil, outputModalities: [String]? = nil, priceIn: String? = nil, priceOut: String? = nil, regionPrices: [AdminAiModelRegionPrice]? = nil, releaseStage: Int? = nil, replacementModel: String? = nil, routingState: Int? = nil, shelfState: Int? = nil, status: String? = nil, supportedLanguages: [String]? = nil, supportsJsonSchema: Bool? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, trainingDataCutoff: String? = nil, type: String? = nil, useCases: [String]? = nil, vendorId: String? = nil) {
        self.apiFormat = apiFormat
        self.cacheReadPrice = cacheReadPrice
        self.cacheWritePrice = cacheWritePrice
        self.capabilityIntro = capabilityIntro
        self.contextTokens = contextTokens
        self.description = description
        self.displayName = displayName
        self.inputModalities = inputModalities
        self.limitations = limitations
        self.maxOutputTokens = maxOutputTokens
        self.modalities = modalities
        self.model = model
        self.name = name
        self.outputModalities = outputModalities
        self.priceIn = priceIn
        self.priceOut = priceOut
        self.regionPrices = regionPrices
        self.releaseStage = releaseStage
        self.replacementModel = replacementModel
        self.routingState = routingState
        self.shelfState = shelfState
        self.status = status
        self.supportedLanguages = supportedLanguages
        self.supportsJsonSchema = supportsJsonSchema
        self.supportsStreaming = supportsStreaming
        self.supportsTools = supportsTools
        self.trainingDataCutoff = trainingDataCutoff
        self.type = type
        self.useCases = useCases
        self.vendorId = vendorId
    }
}

public struct AdminAiModelsResponse: Codable {
    public let items: [AdminAiModelItem]?


    public init(items: [AdminAiModelItem]? = nil) {
        self.items = items
    }
}

public struct AdminAnalyticsInsight: Codable {
    public let detail: String?
    public let key: String?
    public let severity: String?
    public let title: String?
    public let value: String?


    public init(detail: String? = nil, key: String? = nil, severity: String? = nil, title: String? = nil, value: String? = nil) {
        self.detail = detail
        self.key = key
        self.severity = severity
        self.title = title
        self.value = value
    }
}

public struct AdminAnalyticsModelRankItem: Codable {
    public let averageTokensPerRequest: Double?
    public let catalogKey: String?
    public let errorRate: Double?
    public let modality: String?
    public let model: String?
    public let points: Double?
    public let rank: Int?
    public let requestCount: Int?
    public let totalTokens: Double?
    public let upstreamCost: Double?
    public let userCount: Int?
    public let vendor: String?


    public init(averageTokensPerRequest: Double? = nil, catalogKey: String? = nil, errorRate: Double? = nil, modality: String? = nil, model: String? = nil, points: Double? = nil, rank: Int? = nil, requestCount: Int? = nil, totalTokens: Double? = nil, upstreamCost: Double? = nil, userCount: Int? = nil, vendor: String? = nil) {
        self.averageTokensPerRequest = averageTokensPerRequest
        self.catalogKey = catalogKey
        self.errorRate = errorRate
        self.modality = modality
        self.model = model
        self.points = points
        self.rank = rank
        self.requestCount = requestCount
        self.totalTokens = totalTokens
        self.upstreamCost = upstreamCost
        self.userCount = userCount
        self.vendor = vendor
    }
}

public struct AdminAnalyticsModelRankings: Codable {
    public let points: [AdminAnalyticsModelRankItem]?
    public let requests: [AdminAnalyticsModelRankItem]?
    public let tokens: [AdminAnalyticsModelRankItem]?


    public init(points: [AdminAnalyticsModelRankItem]? = nil, requests: [AdminAnalyticsModelRankItem]? = nil, tokens: [AdminAnalyticsModelRankItem]? = nil) {
        self.points = points
        self.requests = requests
        self.tokens = tokens
    }
}

public struct AdminAnalyticsOverviewResponse: Codable {
    public let endTime: String?
    public let insights: [AdminAnalyticsInsight]?
    public let limit: Int?
    public let modalityDistribution: [AdminPieChartItem]?
    public let modelDistribution: [AdminPieChartItem]?
    public let modelRankings: AdminAnalyticsModelRankings?
    public let startTime: String?
    public let summary: AdminAnalyticsSummary?
    public let timeRange: String?
    public let trend: [AdminAnalyticsTrendPoint]?
    public let userRankings: AdminAnalyticsUserRankings?


    public init(endTime: String? = nil, insights: [AdminAnalyticsInsight]? = nil, limit: Int? = nil, modalityDistribution: [AdminPieChartItem]? = nil, modelDistribution: [AdminPieChartItem]? = nil, modelRankings: AdminAnalyticsModelRankings? = nil, startTime: String? = nil, summary: AdminAnalyticsSummary? = nil, timeRange: String? = nil, trend: [AdminAnalyticsTrendPoint]? = nil, userRankings: AdminAnalyticsUserRankings? = nil) {
        self.endTime = endTime
        self.insights = insights
        self.limit = limit
        self.modalityDistribution = modalityDistribution
        self.modelDistribution = modelDistribution
        self.modelRankings = modelRankings
        self.startTime = startTime
        self.summary = summary
        self.timeRange = timeRange
        self.trend = trend
        self.userRankings = userRankings
    }
}

public struct AdminAnalyticsSummary: Codable {
    public let activeModels: Int?
    public let activeUsers: Int?
    public let averagePointsPerRequest: Double?
    public let averageTokensPerRequest: Double?
    public let errorRate: Double?
    public let failedRequests: Int?
    public let successfulRequests: Int?
    public let totalPoints: Double?
    public let totalRequests: Int?
    public let totalTokens: Double?
    public let totalUsers: Int?
    public let upstreamCost: Double?


    public init(activeModels: Int? = nil, activeUsers: Int? = nil, averagePointsPerRequest: Double? = nil, averageTokensPerRequest: Double? = nil, errorRate: Double? = nil, failedRequests: Int? = nil, successfulRequests: Int? = nil, totalPoints: Double? = nil, totalRequests: Int? = nil, totalTokens: Double? = nil, totalUsers: Int? = nil, upstreamCost: Double? = nil) {
        self.activeModels = activeModels
        self.activeUsers = activeUsers
        self.averagePointsPerRequest = averagePointsPerRequest
        self.averageTokensPerRequest = averageTokensPerRequest
        self.errorRate = errorRate
        self.failedRequests = failedRequests
        self.successfulRequests = successfulRequests
        self.totalPoints = totalPoints
        self.totalRequests = totalRequests
        self.totalTokens = totalTokens
        self.totalUsers = totalUsers
        self.upstreamCost = upstreamCost
    }
}

public struct AdminAnalyticsTrendPoint: Codable {
    public let points: Double?
    public let requests: Double?
    public let time: String?
    public let tokens: Double?
    public let users: Int?


    public init(points: Double? = nil, requests: Double? = nil, time: String? = nil, tokens: Double? = nil, users: Int? = nil) {
        self.points = points
        self.requests = requests
        self.time = time
        self.tokens = tokens
        self.users = users
    }
}

public struct AdminAnalyticsUserRankItem: Codable {
    public let email: String?
    public let modelDistribution: [AdminPieChartItem]?
    public let points: Double?
    public let rank: Int?
    public let requestCount: Int?
    public let totalTokens: Double?
    public let userId: String?
    public let userName: String?


    public init(email: String? = nil, modelDistribution: [AdminPieChartItem]? = nil, points: Double? = nil, rank: Int? = nil, requestCount: Int? = nil, totalTokens: Double? = nil, userId: String? = nil, userName: String? = nil) {
        self.email = email
        self.modelDistribution = modelDistribution
        self.points = points
        self.rank = rank
        self.requestCount = requestCount
        self.totalTokens = totalTokens
        self.userId = userId
        self.userName = userName
    }
}

public struct AdminAnalyticsUserRankings: Codable {
    public let points: [AdminAnalyticsUserRankItem]?
    public let requests: [AdminAnalyticsUserRankItem]?
    public let tokens: [AdminAnalyticsUserRankItem]?


    public init(points: [AdminAnalyticsUserRankItem]? = nil, requests: [AdminAnalyticsUserRankItem]? = nil, tokens: [AdminAnalyticsUserRankItem]? = nil) {
        self.points = points
        self.requests = requests
        self.tokens = tokens
    }
}

public struct AdminAnnouncementCreateRequest: Codable {
    public let content: String?
    public let showAsPopup: Bool?
    public let status: String?
    public let target: String?
    public let title: String?


    public init(content: String? = nil, showAsPopup: Bool? = nil, status: String? = nil, target: String? = nil, title: String? = nil) {
        self.content = content
        self.showAsPopup = showAsPopup
        self.status = status
        self.target = target
        self.title = title
    }
}

public struct AdminAnnouncementItem: Codable {
    public let content: String?
    public let date: String?
    public let id: String?
    public let showAsPopup: Bool?
    public let status: String?
    public let target: String?
    public let title: String?


    public init(content: String? = nil, date: String? = nil, id: String? = nil, showAsPopup: Bool? = nil, status: String? = nil, target: String? = nil, title: String? = nil) {
        self.content = content
        self.date = date
        self.id = id
        self.showAsPopup = showAsPopup
        self.status = status
        self.target = target
        self.title = title
    }
}

public struct AdminAnnouncementMutationResponse: Codable {
    public let item: AdminAnnouncementItem?


    public init(item: AdminAnnouncementItem? = nil) {
        self.item = item
    }
}

public struct AdminAnnouncementUpdateRequest: Codable {
    public let content: String?
    public let showAsPopup: Bool?
    public let status: String?
    public let target: String?
    public let title: String?


    public init(content: String? = nil, showAsPopup: Bool? = nil, status: String? = nil, target: String? = nil, title: String? = nil) {
        self.content = content
        self.showAsPopup = showAsPopup
        self.status = status
        self.target = target
        self.title = title
    }
}

public struct AdminAnnouncementsResponse: Codable {
    public let items: [AdminAnnouncementItem]?


    public init(items: [AdminAnnouncementItem]? = nil) {
        self.items = items
    }
}

public struct AdminApiKeyCreateRequest: Codable {
    public let name: String?
    public let userId: Int?


    public init(name: String? = nil, userId: Int? = nil) {
        self.name = name
        self.userId = userId
    }
}

public struct AdminApiKeyCreateResponse: Codable {
    public let key: AdminApiKeyItem?
    public let rawKey: String?


    public init(key: AdminApiKeyItem? = nil, rawKey: String? = nil) {
        self.key = key
        self.rawKey = rawKey
    }
}

public struct AdminApiKeyItem: Codable {
    public let id: String?
    public let key: String?
    public let name: String?
    public let status: String?
    public let used: String?


    public init(id: String? = nil, key: String? = nil, name: String? = nil, status: String? = nil, used: String? = nil) {
        self.id = id
        self.key = key
        self.name = name
        self.status = status
        self.used = used
    }
}

public struct AdminApiKeysMapResponse: Codable {

    public init() {}
}

public struct AdminAppCategoryCreateRequest: Codable {
    public let code: String?
    public let description: String?
    public let icon: String?
    public let name: String?
    public let parentId: String?
    public let path: String?
    public let sortWeight: Int?
    public let status: Int?
    public let visible: Bool?


    public init(code: String? = nil, description: String? = nil, icon: String? = nil, name: String? = nil, parentId: String? = nil, path: String? = nil, sortWeight: Int? = nil, status: Int? = nil, visible: Bool? = nil) {
        self.code = code
        self.description = description
        self.icon = icon
        self.name = name
        self.parentId = parentId
        self.path = path
        self.sortWeight = sortWeight
        self.status = status
        self.visible = visible
    }
}

public struct AdminAppCategoryDeleteResponse: Codable {
    public let deleted: Bool?


    public init(deleted: Bool? = nil) {
        self.deleted = deleted
    }
}

public struct AdminAppCategoryItem: Codable {
    public let code: String?
    public let description: String?
    public let icon: String?
    public let id: String?
    public let name: String?
    public let parentId: String?
    public let path: String?
    public let sortWeight: Int?
    public let status: Int?
    public let type: Int?
    public let visible: Bool?


    public init(code: String? = nil, description: String? = nil, icon: String? = nil, id: String? = nil, name: String? = nil, parentId: String? = nil, path: String? = nil, sortWeight: Int? = nil, status: Int? = nil, type: Int? = nil, visible: Bool? = nil) {
        self.code = code
        self.description = description
        self.icon = icon
        self.id = id
        self.name = name
        self.parentId = parentId
        self.path = path
        self.sortWeight = sortWeight
        self.status = status
        self.type = type
        self.visible = visible
    }
}

public struct AdminAppCategoryListResponse: Codable {
    public let items: [AdminAppCategoryItem]?


    public init(items: [AdminAppCategoryItem]? = nil) {
        self.items = items
    }
}

public struct AdminAppCategoryMutationResponse: Codable {
    public let item: AdminAppCategoryItem?


    public init(item: AdminAppCategoryItem? = nil) {
        self.item = item
    }
}

public struct AdminAppCategoryUpdateRequest: Codable {
    public let code: String?
    public let description: String?
    public let icon: String?
    public let name: String?
    public let parentId: String?
    public let path: String?
    public let sortWeight: Int?
    public let status: Int?
    public let visible: Bool?


    public init(code: String? = nil, description: String? = nil, icon: String? = nil, name: String? = nil, parentId: String? = nil, path: String? = nil, sortWeight: Int? = nil, status: Int? = nil, visible: Bool? = nil) {
        self.code = code
        self.description = description
        self.icon = icon
        self.name = name
        self.parentId = parentId
        self.path = path
        self.sortWeight = sortWeight
        self.status = status
        self.visible = visible
    }
}

public struct AdminAppConfig: Codable {
    public let portal: AdminAppPortalConfig?
    public let standard: AdminAppConfigStandard?


    public init(portal: AdminAppPortalConfig? = nil, standard: AdminAppConfigStandard? = nil) {
        self.portal = portal
        self.standard = standard
    }
}

public struct AdminAppConfigStandard: Codable {
    public let appKey: String?


    public init(appKey: String? = nil) {
        self.appKey = appKey
    }
}

public struct AdminAppCreateRequest: Codable {
    public let accessUrl: String?
    public let appType: String?
    public let bundleId: String?
    public let config: AdminAppConfig?
    public let description: String?
    public let downloadUrl: String?
    public let icon: [String: String]?
    public let iconUrl: String?
    public let installConfig: [String: String]?
    public let installPlatforms: [String: String]?
    public let installSkill: [String: String]?
    public let marketStatus: String?
    public let name: String?
    public let packageName: String?
    public let platforms: [String: String]?
    public let projectId: String?
    public let releaseNotes: [[String: String]]?
    public let resourceList: [String: String]?
    public let status: String?
    public let storeUrl: String?
    public let userId: String?
    public let version: String?


    public init(accessUrl: String? = nil, appType: String? = nil, bundleId: String? = nil, config: AdminAppConfig? = nil, description: String? = nil, downloadUrl: String? = nil, icon: [String: String]? = nil, iconUrl: String? = nil, installConfig: [String: String]? = nil, installPlatforms: [String: String]? = nil, installSkill: [String: String]? = nil, marketStatus: String? = nil, name: String? = nil, packageName: String? = nil, platforms: [String: String]? = nil, projectId: String? = nil, releaseNotes: [[String: String]]? = nil, resourceList: [String: String]? = nil, status: String? = nil, storeUrl: String? = nil, userId: String? = nil, version: String? = nil) {
        self.accessUrl = accessUrl
        self.appType = appType
        self.bundleId = bundleId
        self.config = config
        self.description = description
        self.downloadUrl = downloadUrl
        self.icon = icon
        self.iconUrl = iconUrl
        self.installConfig = installConfig
        self.installPlatforms = installPlatforms
        self.installSkill = installSkill
        self.marketStatus = marketStatus
        self.name = name
        self.packageName = packageName
        self.platforms = platforms
        self.projectId = projectId
        self.releaseNotes = releaseNotes
        self.resourceList = resourceList
        self.status = status
        self.storeUrl = storeUrl
        self.userId = userId
        self.version = version
    }
}

public struct AdminAppDeleteResponse: Codable {
    public let deleted: Bool?


    public init(deleted: Bool? = nil) {
        self.deleted = deleted
    }
}

public struct AdminAppItemResponse: Codable {
    public let accessUrl: String?
    public let appKey: String?
    public let appType: String?
    public let bundleId: String?
    public let config: AdminAppConfig?
    public let createdAt: String?
    public let description: String?
    public let downloadUrl: String?
    public let icon: [String: String]?
    public let iconUrl: String?
    public let id: String?
    public let installConfig: [String: String]?
    public let installPlatforms: [String: String]?
    public let installSkill: [String: String]?
    public let marketStatus: String?
    public let name: String?
    public let packageName: String?
    public let platforms: [String: String]?
    public let projectId: String?
    public let releaseNotes: [[String: String]]?
    public let resourceList: [String: String]?
    public let status: String?
    public let storeUrl: String?
    public let updatedAt: String?
    public let userId: String?
    public let uuid: String?
    public let version: String?


    public init(accessUrl: String? = nil, appKey: String? = nil, appType: String? = nil, bundleId: String? = nil, config: AdminAppConfig? = nil, createdAt: String? = nil, description: String? = nil, downloadUrl: String? = nil, icon: [String: String]? = nil, iconUrl: String? = nil, id: String? = nil, installConfig: [String: String]? = nil, installPlatforms: [String: String]? = nil, installSkill: [String: String]? = nil, marketStatus: String? = nil, name: String? = nil, packageName: String? = nil, platforms: [String: String]? = nil, projectId: String? = nil, releaseNotes: [[String: String]]? = nil, resourceList: [String: String]? = nil, status: String? = nil, storeUrl: String? = nil, updatedAt: String? = nil, userId: String? = nil, uuid: String? = nil, version: String? = nil) {
        self.accessUrl = accessUrl
        self.appKey = appKey
        self.appType = appType
        self.bundleId = bundleId
        self.config = config
        self.createdAt = createdAt
        self.description = description
        self.downloadUrl = downloadUrl
        self.icon = icon
        self.iconUrl = iconUrl
        self.id = id
        self.installConfig = installConfig
        self.installPlatforms = installPlatforms
        self.installSkill = installSkill
        self.marketStatus = marketStatus
        self.name = name
        self.packageName = packageName
        self.platforms = platforms
        self.projectId = projectId
        self.releaseNotes = releaseNotes
        self.resourceList = resourceList
        self.status = status
        self.storeUrl = storeUrl
        self.updatedAt = updatedAt
        self.userId = userId
        self.uuid = uuid
        self.version = version
    }
}

public struct AdminAppListResponse: Codable {
    public let items: [AdminAppItemResponse]?


    public init(items: [AdminAppItemResponse]? = nil) {
        self.items = items
    }
}

public struct AdminAppMutationResponse: Codable {
    public let item: AdminAppItemResponse?


    public init(item: AdminAppItemResponse? = nil) {
        self.item = item
    }
}

public struct AdminAppPortalConfig: Codable {
    public let marketStatus: String?


    public init(marketStatus: String? = nil) {
        self.marketStatus = marketStatus
    }
}

public struct AdminAppUpdateRequest: Codable {
    public let accessUrl: String?
    public let appType: String?
    public let bundleId: String?
    public let config: AdminAppConfig?
    public let description: String?
    public let downloadUrl: String?
    public let icon: [String: String]?
    public let iconUrl: String?
    public let installConfig: [String: String]?
    public let installPlatforms: [String: String]?
    public let installSkill: [String: String]?
    public let name: String?
    public let packageName: String?
    public let platforms: [String: String]?
    public let projectId: String?
    public let releaseNotes: [[String: String]]?
    public let resourceList: [String: String]?
    public let storeUrl: String?
    public let userId: String?
    public let version: String?


    public init(accessUrl: String? = nil, appType: String? = nil, bundleId: String? = nil, config: AdminAppConfig? = nil, description: String? = nil, downloadUrl: String? = nil, icon: [String: String]? = nil, iconUrl: String? = nil, installConfig: [String: String]? = nil, installPlatforms: [String: String]? = nil, installSkill: [String: String]? = nil, name: String? = nil, packageName: String? = nil, platforms: [String: String]? = nil, projectId: String? = nil, releaseNotes: [[String: String]]? = nil, resourceList: [String: String]? = nil, storeUrl: String? = nil, userId: String? = nil, version: String? = nil) {
        self.accessUrl = accessUrl
        self.appType = appType
        self.bundleId = bundleId
        self.config = config
        self.description = description
        self.downloadUrl = downloadUrl
        self.icon = icon
        self.iconUrl = iconUrl
        self.installConfig = installConfig
        self.installPlatforms = installPlatforms
        self.installSkill = installSkill
        self.name = name
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

public struct AdminAuthSettingsResponse: Codable {
    public let leftRailMode: String?
    public let loginMethods: [String]?
    public let oauthLoginEnabled: Bool?
    public let oauthProviders: [String]?
    public let oauthRegion: String?
    public let qrLoginEnabled: Bool?
    public let qrLoginType: String?
    public let recoveryMethods: [String]?
    public let registerMethods: [String]?
    public let verificationPolicy: AdminAuthVerificationPolicy?
    public let wechat: AdminAuthWechatSettings?


    public init(leftRailMode: String? = nil, loginMethods: [String]? = nil, oauthLoginEnabled: Bool? = nil, oauthProviders: [String]? = nil, oauthRegion: String? = nil, qrLoginEnabled: Bool? = nil, qrLoginType: String? = nil, recoveryMethods: [String]? = nil, registerMethods: [String]? = nil, verificationPolicy: AdminAuthVerificationPolicy? = nil, wechat: AdminAuthWechatSettings? = nil) {
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
        self.wechat = wechat
    }
}

public struct AdminAuthSettingsUpdateRequest: Codable {
    public let leftRailMode: String?
    public let loginMethods: [String]?
    public let oauthLoginEnabled: Bool?
    public let oauthProviders: [String]?
    public let oauthRegion: String?
    public let qrLoginEnabled: Bool?
    public let qrLoginType: String?
    public let recoveryMethods: [String]?
    public let registerMethods: [String]?
    public let verificationPolicy: AdminAuthVerificationPolicy?
    public let wechat: AdminAuthWechatSettingsUpdate?


    public init(leftRailMode: String? = nil, loginMethods: [String]? = nil, oauthLoginEnabled: Bool? = nil, oauthProviders: [String]? = nil, oauthRegion: String? = nil, qrLoginEnabled: Bool? = nil, qrLoginType: String? = nil, recoveryMethods: [String]? = nil, registerMethods: [String]? = nil, verificationPolicy: AdminAuthVerificationPolicy? = nil, wechat: AdminAuthWechatSettingsUpdate? = nil) {
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
        self.wechat = wechat
    }
}

public struct AdminAuthVerificationPolicy: Codable {
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

public struct AdminAuthWechatMini: Codable {
    public let appId: String?
    public let enabled: Bool?
    public let env: String?
    public let key: String?
    public let name: String?
    public let path: String?
    public let primary: Bool?
    public let secretRef: String?
    public let url: String?


    public init(appId: String? = nil, enabled: Bool? = nil, env: String? = nil, key: String? = nil, name: String? = nil, path: String? = nil, primary: Bool? = nil, secretRef: String? = nil, url: String? = nil) {
        self.appId = appId
        self.enabled = enabled
        self.env = env
        self.key = key
        self.name = name
        self.path = path
        self.primary = primary
        self.secretRef = secretRef
        self.url = url
    }
}

public struct AdminAuthWechatOfficial: Codable {
    public let aesKeyRef: String?
    public let appId: String?
    public let enabled: Bool?
    public let key: String?
    public let name: String?
    public let originalId: String?
    public let primary: Bool?
    public let scene: String?
    public let secretRef: String?
    public let tokenRef: String?
    public let url: String?


    public init(aesKeyRef: String? = nil, appId: String? = nil, enabled: Bool? = nil, key: String? = nil, name: String? = nil, originalId: String? = nil, primary: Bool? = nil, scene: String? = nil, secretRef: String? = nil, tokenRef: String? = nil, url: String? = nil) {
        self.aesKeyRef = aesKeyRef
        self.appId = appId
        self.enabled = enabled
        self.key = key
        self.name = name
        self.originalId = originalId
        self.primary = primary
        self.scene = scene
        self.secretRef = secretRef
        self.tokenRef = tokenRef
        self.url = url
    }
}

public struct AdminAuthWechatSettings: Codable {
    public let mini: [AdminAuthWechatMini]?
    public let official: [AdminAuthWechatOfficial]?


    public init(mini: [AdminAuthWechatMini]? = nil, official: [AdminAuthWechatOfficial]? = nil) {
        self.mini = mini
        self.official = official
    }
}

public struct AdminAuthWechatSettingsUpdate: Codable {
    public let mini: [AdminAuthWechatMini]?
    public let official: [AdminAuthWechatOfficial]?


    public init(mini: [AdminAuthWechatMini]? = nil, official: [AdminAuthWechatOfficial]? = nil) {
        self.mini = mini
        self.official = official
    }
}

public struct AdminCacheInstance: Codable {
    public let cacheDeletes: Int?
    public let cacheErrors: Int?
    public let cacheHits: Int?
    public let cacheInspections: Int?
    public let cacheMisses: Int?
    public let cacheRefreshes: Int?
    public let cacheWrites: Int?
    public let connectionProfileName: String?
    public let defaultTtlSeconds: Int?
    public let entryCount: Int?
    public let expiredEntryCount: Int?
    public let keyPrefix: String?
    public let maxEntries: Int?
    public let name: String?
    public let providerKind: String?
    public let purpose: String?
    public let status: String?
    public let supportsDelete: Bool?
    public let supportsInspect: Bool?
    public let supportsRefresh: Bool?


    public init(cacheDeletes: Int? = nil, cacheErrors: Int? = nil, cacheHits: Int? = nil, cacheInspections: Int? = nil, cacheMisses: Int? = nil, cacheRefreshes: Int? = nil, cacheWrites: Int? = nil, connectionProfileName: String? = nil, defaultTtlSeconds: Int? = nil, entryCount: Int? = nil, expiredEntryCount: Int? = nil, keyPrefix: String? = nil, maxEntries: Int? = nil, name: String? = nil, providerKind: String? = nil, purpose: String? = nil, status: String? = nil, supportsDelete: Bool? = nil, supportsInspect: Bool? = nil, supportsRefresh: Bool? = nil) {
        self.cacheDeletes = cacheDeletes
        self.cacheErrors = cacheErrors
        self.cacheHits = cacheHits
        self.cacheInspections = cacheInspections
        self.cacheMisses = cacheMisses
        self.cacheRefreshes = cacheRefreshes
        self.cacheWrites = cacheWrites
        self.connectionProfileName = connectionProfileName
        self.defaultTtlSeconds = defaultTtlSeconds
        self.entryCount = entryCount
        self.expiredEntryCount = expiredEntryCount
        self.keyPrefix = keyPrefix
        self.maxEntries = maxEntries
        self.name = name
        self.providerKind = providerKind
        self.purpose = purpose
        self.status = status
        self.supportsDelete = supportsDelete
        self.supportsInspect = supportsInspect
        self.supportsRefresh = supportsRefresh
    }
}

public struct AdminCacheKeyItem: Codable {
    public let expiresInSeconds: Int?
    public let instanceName: String?
    public let key: String?
    public let namespace: String?
    public let status: String?


    public init(expiresInSeconds: Int? = nil, instanceName: String? = nil, key: String? = nil, namespace: String? = nil, status: String? = nil) {
        self.expiresInSeconds = expiresInSeconds
        self.instanceName = instanceName
        self.key = key
        self.namespace = namespace
        self.status = status
    }
}

public struct AdminCacheKeyListResponse: Codable {
    public let hasMore: Bool?
    public let instanceName: String?
    public let items: [AdminCacheKeyItem]?
    public let limit: Int?
    public let namespace: String?
    public let nextCursor: String?
    public let returnedItems: Int?
    public let scanComplete: Bool?
    public let scannedItems: Int?


    public init(hasMore: Bool? = nil, instanceName: String? = nil, items: [AdminCacheKeyItem]? = nil, limit: Int? = nil, namespace: String? = nil, nextCursor: String? = nil, returnedItems: Int? = nil, scanComplete: Bool? = nil, scannedItems: Int? = nil) {
        self.hasMore = hasMore
        self.instanceName = instanceName
        self.items = items
        self.limit = limit
        self.namespace = namespace
        self.nextCursor = nextCursor
        self.returnedItems = returnedItems
        self.scanComplete = scanComplete
        self.scannedItems = scannedItems
    }
}

public struct AdminCacheNamespacePolicy: Codable {
    public let consistency: String?
    public let enabled: Bool?
    public let failureMode: String?
    public let instanceName: String?
    public let jitterPercent: Int?
    public let namespace: String?
    public let scope: String?
    public let sensitivity: String?
    public let staleWhileRevalidateSeconds: Int?
    public let tags: [String]?
    public let ttlSeconds: Int?


    public init(consistency: String? = nil, enabled: Bool? = nil, failureMode: String? = nil, instanceName: String? = nil, jitterPercent: Int? = nil, namespace: String? = nil, scope: String? = nil, sensitivity: String? = nil, staleWhileRevalidateSeconds: Int? = nil, tags: [String]? = nil, ttlSeconds: Int? = nil) {
        self.consistency = consistency
        self.enabled = enabled
        self.failureMode = failureMode
        self.instanceName = instanceName
        self.jitterPercent = jitterPercent
        self.namespace = namespace
        self.scope = scope
        self.sensitivity = sensitivity
        self.staleWhileRevalidateSeconds = staleWhileRevalidateSeconds
        self.tags = tags
        self.ttlSeconds = ttlSeconds
    }
}

public struct AdminCacheOperationResponse: Codable {
    public let cacheKey: String?
    public let deletedEntries: Int?
    public let instanceName: String?
    public let namespace: String?
    public let operation: String?
    public let refreshedEntries: Int?
    public let status: String?


    public init(cacheKey: String? = nil, deletedEntries: Int? = nil, instanceName: String? = nil, namespace: String? = nil, operation: String? = nil, refreshedEntries: Int? = nil, status: String? = nil) {
        self.cacheKey = cacheKey
        self.deletedEntries = deletedEntries
        self.instanceName = instanceName
        self.namespace = namespace
        self.operation = operation
        self.refreshedEntries = refreshedEntries
        self.status = status
    }
}

public struct AdminCacheOverviewResponse: Codable {
    public let instances: [AdminCacheInstance]?
    public let namespacePolicies: [AdminCacheNamespacePolicy]?
    public let summary: AdminCacheSummary?


    public init(instances: [AdminCacheInstance]? = nil, namespacePolicies: [AdminCacheNamespacePolicy]? = nil, summary: AdminCacheSummary? = nil) {
        self.instances = instances
        self.namespacePolicies = namespacePolicies
        self.summary = summary
    }
}

public struct AdminCacheSummary: Codable {
    public let cacheDeletes: Int?
    public let cacheErrors: Int?
    public let cacheHits: Int?
    public let cacheInspections: Int?
    public let cacheMisses: Int?
    public let cacheRefreshes: Int?
    public let cacheWrites: Int?
    public let expiredEntries: Int?
    public let runtimeTarget: String?
    public let totalEntries: Int?
    public let totalInstances: Int?
    public let totalNamespaces: Int?


    public init(cacheDeletes: Int? = nil, cacheErrors: Int? = nil, cacheHits: Int? = nil, cacheInspections: Int? = nil, cacheMisses: Int? = nil, cacheRefreshes: Int? = nil, cacheWrites: Int? = nil, expiredEntries: Int? = nil, runtimeTarget: String? = nil, totalEntries: Int? = nil, totalInstances: Int? = nil, totalNamespaces: Int? = nil) {
        self.cacheDeletes = cacheDeletes
        self.cacheErrors = cacheErrors
        self.cacheHits = cacheHits
        self.cacheInspections = cacheInspections
        self.cacheMisses = cacheMisses
        self.cacheRefreshes = cacheRefreshes
        self.cacheWrites = cacheWrites
        self.expiredEntries = expiredEntries
        self.runtimeTarget = runtimeTarget
        self.totalEntries = totalEntries
        self.totalInstances = totalInstances
        self.totalNamespaces = totalNamespaces
    }
}

public struct AdminCapacityPair: Codable {
    public let total: Double?
    public let used: Double?


    public init(total: Double? = nil, used: Double? = nil) {
        self.total = total
        self.used = used
    }
}

public struct AdminChannelCreateRequest: Codable {
    public let accessType: String?
    public let apiKey: String?
    public let baseUrl: String?
    public let capabilities: [String]?
    public let circuitBreakerPolicy: ProviderCircuitBreakerPolicy?
    public let expiresAt: String?
    public let models: [String]?
    public let name: String?
    public let protocol_: String?
    public let retryPolicy: ProviderRetryPolicy?
    public let secretRef: String?
    public let status: String?
    public let timeoutMs: Int?
    public let vendor: String?
    public let weight: Int?


    public init(accessType: String? = nil, apiKey: String? = nil, baseUrl: String? = nil, capabilities: [String]? = nil, circuitBreakerPolicy: ProviderCircuitBreakerPolicy? = nil, expiresAt: String? = nil, models: [String]? = nil, name: String? = nil, protocol_: String? = nil, retryPolicy: ProviderRetryPolicy? = nil, secretRef: String? = nil, status: String? = nil, timeoutMs: Int? = nil, vendor: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.apiKey = apiKey
        self.baseUrl = baseUrl
        self.capabilities = capabilities
        self.circuitBreakerPolicy = circuitBreakerPolicy
        self.expiresAt = expiresAt
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

public struct AdminChannelItem: Codable {
    public let accessType: String?
    public let apiKey: String?
    public let balance: String?
    public let baseUrl: String?
    public let capabilities: [String]?
    public let circuitBreakerPolicy: ProviderCircuitBreakerPolicy?
    public let createdAt: String?
    public let errors: Int?
    public let expiresAt: String?
    public let id: String?
    public let isMultimodal: Bool?
    public let models: [String]?
    public let name: String?
    public let protocol_: String?
    public let retryPolicy: ProviderRetryPolicy?
    public let secretRef: String?
    public let status: String?
    public let timeoutMs: Int?
    public let vendor: String?
    public let weight: Int?


    public init(accessType: String? = nil, apiKey: String? = nil, balance: String? = nil, baseUrl: String? = nil, capabilities: [String]? = nil, circuitBreakerPolicy: ProviderCircuitBreakerPolicy? = nil, createdAt: String? = nil, errors: Int? = nil, expiresAt: String? = nil, id: String? = nil, isMultimodal: Bool? = nil, models: [String]? = nil, name: String? = nil, protocol_: String? = nil, retryPolicy: ProviderRetryPolicy? = nil, secretRef: String? = nil, status: String? = nil, timeoutMs: Int? = nil, vendor: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.apiKey = apiKey
        self.balance = balance
        self.baseUrl = baseUrl
        self.capabilities = capabilities
        self.circuitBreakerPolicy = circuitBreakerPolicy
        self.createdAt = createdAt
        self.errors = errors
        self.expiresAt = expiresAt
        self.id = id
        self.isMultimodal = isMultimodal
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

public struct AdminChannelMutationResponse: Codable {
    public let item: AdminChannelItem?


    public init(item: AdminChannelItem? = nil) {
        self.item = item
    }
}

public struct AdminChannelTestResponse: Codable {
    public let channelId: String?
    public let item: AdminChannelItem?
    public let latency: String?
    public let status: String?
    public let success: Bool?


    public init(channelId: String? = nil, item: AdminChannelItem? = nil, latency: String? = nil, status: String? = nil, success: Bool? = nil) {
        self.channelId = channelId
        self.item = item
        self.latency = latency
        self.status = status
        self.success = success
    }
}

public struct AdminChannelUpdateRequest: Codable {
    public let accessType: String?
    public let apiKey: String?
    public let baseUrl: String?
    public let capabilities: [String]?
    public let circuitBreakerPolicy: ProviderCircuitBreakerPolicy?
    public let expiresAt: String?
    public let id: String?
    public let models: [String]?
    public let name: String?
    public let protocol_: String?
    public let retryPolicy: ProviderRetryPolicy?
    public let secretRef: String?
    public let status: String?
    public let timeoutMs: Int?
    public let vendor: String?
    public let weight: Int?


    public init(accessType: String? = nil, apiKey: String? = nil, baseUrl: String? = nil, capabilities: [String]? = nil, circuitBreakerPolicy: ProviderCircuitBreakerPolicy? = nil, expiresAt: String? = nil, id: String? = nil, models: [String]? = nil, name: String? = nil, protocol_: String? = nil, retryPolicy: ProviderRetryPolicy? = nil, secretRef: String? = nil, status: String? = nil, timeoutMs: Int? = nil, vendor: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.apiKey = apiKey
        self.baseUrl = baseUrl
        self.capabilities = capabilities
        self.circuitBreakerPolicy = circuitBreakerPolicy
        self.expiresAt = expiresAt
        self.id = id
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

public struct AdminChannelsResponse: Codable {
    public let items: [AdminChannelItem]?


    public init(items: [AdminChannelItem]? = nil) {
        self.items = items
    }
}

public struct AdminCountPair: Codable {
    public let available: Double?
    public let total: Double?


    public init(available: Double? = nil, total: Double? = nil) {
        self.available = available
        self.total = total
    }
}

public struct AdminDashboardDataResponse: Codable {
    public let modelDistribution: [AdminPieChartItem]?
    public let multimodal: [AdminPieChartItem]?
    public let recentUsage: [AdminDashboardRecentUsageItem]?
    public let traffic: [AdminDashboardTrafficItem]?
    public let userConsumption: [AdminPieChartItem]?


    public init(modelDistribution: [AdminPieChartItem]? = nil, multimodal: [AdminPieChartItem]? = nil, recentUsage: [AdminDashboardRecentUsageItem]? = nil, traffic: [AdminDashboardTrafficItem]? = nil, userConsumption: [AdminPieChartItem]? = nil) {
        self.modelDistribution = modelDistribution
        self.multimodal = multimodal
        self.recentUsage = recentUsage
        self.traffic = traffic
        self.userConsumption = userConsumption
    }
}

public struct AdminDashboardRecentUsageItem: Codable {
    public let billingMode: String?
    public let cost: String?
    public let id: String?
    public let isApiUser: Bool?
    public let model: String?
    public let status: String?
    public let time: String?
    public let type: String?
    public let usageCount: Double?
    public let usageIn: Double?
    public let usageOut: Double?
    public let user: String?


    public init(billingMode: String? = nil, cost: String? = nil, id: String? = nil, isApiUser: Bool? = nil, model: String? = nil, status: String? = nil, time: String? = nil, type: String? = nil, usageCount: Double? = nil, usageIn: Double? = nil, usageOut: Double? = nil, user: String? = nil) {
        self.billingMode = billingMode
        self.cost = cost
        self.id = id
        self.isApiUser = isApiUser
        self.model = model
        self.status = status
        self.time = time
        self.type = type
        self.usageCount = usageCount
        self.usageIn = usageIn
        self.usageOut = usageOut
        self.user = user
    }
}

public struct AdminDashboardTrafficItem: Codable {
    public let cost: Double?
    public let requests: Double?
    public let time: String?
    public let tokens: Double?


    public init(cost: Double? = nil, requests: Double? = nil, time: String? = nil, tokens: Double? = nil) {
        self.cost = cost
        self.requests = requests
        self.time = time
        self.tokens = tokens
    }
}

public struct AdminDeleteResponse: Codable {
    public let deleted: Bool?


    public init(deleted: Bool? = nil) {
        self.deleted = deleted
    }
}

public struct AdminFirewallItem: Codable {
    public let id: String?
    public let reason: String?
    public let time: String?
    public let type: String?
    public let value: String?


    public init(id: String? = nil, reason: String? = nil, time: String? = nil, type: String? = nil, value: String? = nil) {
        self.id = id
        self.reason = reason
        self.time = time
        self.type = type
        self.value = value
    }
}

public struct AdminFirewallMutationResponse: Codable {
    public let item: AdminFirewallItem?


    public init(item: AdminFirewallItem? = nil) {
        self.item = item
    }
}

public struct AdminFirewallRuleCreateRequest: Codable {
    public let reason: String?
    public let type: String?
    public let value: String?


    public init(reason: String? = nil, type: String? = nil, value: String? = nil) {
        self.reason = reason
        self.type = type
        self.value = value
    }
}

public struct AdminFirewallRulesResponse: Codable {
    public let items: [AdminFirewallItem]?


    public init(items: [AdminFirewallItem]? = nil) {
        self.items = items
    }
}

public struct AdminIpLimitCreateRequest: Codable {
    public let blockDuration: String?
    public let rpm: Int?
    public let rps: Int?
    public let ruleName: String?
    public let status: String?
    public let targetIp: String?


    public init(blockDuration: String? = nil, rpm: Int? = nil, rps: Int? = nil, ruleName: String? = nil, status: String? = nil, targetIp: String? = nil) {
        self.blockDuration = blockDuration
        self.rpm = rpm
        self.rps = rps
        self.ruleName = ruleName
        self.status = status
        self.targetIp = targetIp
    }
}

public struct AdminIpLimitsResponse: Codable {
    public let items: [AdminRateLimitItem]?


    public init(items: [AdminRateLimitItem]? = nil) {
        self.items = items
    }
}

public struct AdminModelCatalogSyncRequest: Codable {
    public let catalogRoot: String?
    public let catalogVersion: String?
    public let force: Bool?
    public let mode: String?
    public let source: String?
    public let vendorCodes: [String]?


    public init(catalogRoot: String? = nil, catalogVersion: String? = nil, force: Bool? = nil, mode: String? = nil, source: String? = nil, vendorCodes: [String]? = nil) {
        self.catalogRoot = catalogRoot
        self.catalogVersion = catalogVersion
        self.force = force
        self.mode = mode
        self.source = source
        self.vendorCodes = vendorCodes
    }
}

public struct AdminModelCatalogSyncResponse: Codable {
    public let acceptedCount: Int?
    public let capabilityCount: Int?
    public let catalogRoot: String?
    public let catalogVersion: String?
    public let dryRun: Bool?
    public let familyCount: Int?
    public let meterCount: Int?
    public let mode: String?
    public let modelCount: Int?
    public let models: [AdminAiModelItem]?
    public let priceCount: Int?
    public let rankingCount: Int?
    public let requestedCatalogVersion: String?
    public let snapshotId: String?
    public let source: String?
    public let sourceHash: String?
    public let syncRunId: String?
    public let synced: Bool?
    public let vendorCodes: [String]?
    public let vendorCount: Int?
    public let vendors: [AdminModelVendorItem]?


    public init(acceptedCount: Int? = nil, capabilityCount: Int? = nil, catalogRoot: String? = nil, catalogVersion: String? = nil, dryRun: Bool? = nil, familyCount: Int? = nil, meterCount: Int? = nil, mode: String? = nil, modelCount: Int? = nil, models: [AdminAiModelItem]? = nil, priceCount: Int? = nil, rankingCount: Int? = nil, requestedCatalogVersion: String? = nil, snapshotId: String? = nil, source: String? = nil, sourceHash: String? = nil, syncRunId: String? = nil, synced: Bool? = nil, vendorCodes: [String]? = nil, vendorCount: Int? = nil, vendors: [AdminModelVendorItem]? = nil) {
        self.acceptedCount = acceptedCount
        self.capabilityCount = capabilityCount
        self.catalogRoot = catalogRoot
        self.catalogVersion = catalogVersion
        self.dryRun = dryRun
        self.familyCount = familyCount
        self.meterCount = meterCount
        self.mode = mode
        self.modelCount = modelCount
        self.models = models
        self.priceCount = priceCount
        self.rankingCount = rankingCount
        self.requestedCatalogVersion = requestedCatalogVersion
        self.snapshotId = snapshotId
        self.source = source
        self.sourceHash = sourceHash
        self.syncRunId = syncRunId
        self.synced = synced
        self.vendorCodes = vendorCodes
        self.vendorCount = vendorCount
        self.vendors = vendors
    }
}

public struct AdminModelLimitCreateRequest: Codable {
    public let group: String?
    public let model: String?
    public let rpm: Int?
    public let status: String?
    public let tpm: Int?


    public init(group: String? = nil, model: String? = nil, rpm: Int? = nil, status: String? = nil, tpm: Int? = nil) {
        self.group = group
        self.model = model
        self.rpm = rpm
        self.status = status
        self.tpm = tpm
    }
}

public struct AdminModelLimitsResponse: Codable {
    public let items: [AdminRateLimitItem]?


    public init(items: [AdminRateLimitItem]? = nil) {
        self.items = items
    }
}

public struct AdminModelVendorCreateRequest: Codable {
    public let color: String?
    public let description: String?
    public let name: String?
    public let status: String?
    public let vendorCode: String?


    public init(color: String? = nil, description: String? = nil, name: String? = nil, status: String? = nil, vendorCode: String? = nil) {
        self.color = color
        self.description = description
        self.name = name
        self.status = status
        self.vendorCode = vendorCode
    }
}

public struct AdminModelVendorItem: Codable {
    public let color: String?
    public let description: String?
    public let id: String?
    public let name: String?
    public let status: String?
    public let vendorCode: String?


    public init(color: String? = nil, description: String? = nil, id: String? = nil, name: String? = nil, status: String? = nil, vendorCode: String? = nil) {
        self.color = color
        self.description = description
        self.id = id
        self.name = name
        self.status = status
        self.vendorCode = vendorCode
    }
}

public struct AdminModelVendorMutationResponse: Codable {
    public let item: AdminModelVendorItem?


    public init(item: AdminModelVendorItem? = nil) {
        self.item = item
    }
}

public struct AdminModelVendorsResponse: Codable {
    public let items: [AdminModelVendorItem]?


    public init(items: [AdminModelVendorItem]? = nil) {
        self.items = items
    }
}

public struct AdminMonitorAlertItem: Codable {
    public let id: String?
    public let message: String?
    public let severity: String?
    public let source: String?
    public let status: String?
    public let time: String?
    public let title: String?


    public init(id: String? = nil, message: String? = nil, severity: String? = nil, source: String? = nil, status: String? = nil, time: String? = nil, title: String? = nil) {
        self.id = id
        self.message = message
        self.severity = severity
        self.source = source
        self.status = status
        self.time = time
        self.title = title
    }
}

public struct AdminMonitorAlertsResponse: Codable {
    public let items: [AdminMonitorAlertItem]?


    public init(items: [AdminMonitorAlertItem]? = nil) {
        self.items = items
    }
}

public struct AdminMonitorNodeItem: Codable {
    public let cpu: Double?
    public let id: String?
    public let ip: String?
    public let memory: Double?
    public let name: String?
    public let region: String?
    public let status: String?
    public let uptime: String?


    public init(cpu: Double? = nil, id: String? = nil, ip: String? = nil, memory: Double? = nil, name: String? = nil, region: String? = nil, status: String? = nil, uptime: String? = nil) {
        self.cpu = cpu
        self.id = id
        self.ip = ip
        self.memory = memory
        self.name = name
        self.region = region
        self.status = status
        self.uptime = uptime
    }
}

public struct AdminMonitorNodesResponse: Codable {
    public let items: [AdminMonitorNodeItem]?


    public init(items: [AdminMonitorNodeItem]? = nil) {
        self.items = items
    }
}

public struct AdminMonitorPerformanceItem: Codable {
    public let cpu: Double?
    public let memory: Double?
    public let network: Double?
    public let time: String?


    public init(cpu: Double? = nil, memory: Double? = nil, network: Double? = nil, time: String? = nil) {
        self.cpu = cpu
        self.memory = memory
        self.network = network
        self.time = time
    }
}

public struct AdminMonitorPerformanceResponse: Codable {
    public let items: [AdminMonitorPerformanceItem]?


    public init(items: [AdminMonitorPerformanceItem]? = nil) {
        self.items = items
    }
}

public struct AdminPieChartItem: Codable {
    public let color: String?
    public let name: String?
    public let value: Double?


    public init(color: String? = nil, name: String? = nil, value: Double? = nil) {
        self.color = color
        self.name = name
        self.value = value
    }
}

public struct AdminProviderSecretCreateRequest: Codable {
    public let authType: String?
    public let name: String?
    public let providerCode: String?
    public let secretRef: String?
    public let status: String?


    public init(authType: String? = nil, name: String? = nil, providerCode: String? = nil, secretRef: String? = nil, status: String? = nil) {
        self.authType = authType
        self.name = name
        self.providerCode = providerCode
        self.secretRef = secretRef
        self.status = status
    }
}

public struct AdminProviderSecretItem: Codable {
    public let accountCode: String?
    public let authType: String?
    public let createdAt: String?
    public let id: String?
    public let maskedLabel: String?
    public let name: String?
    public let providerCode: String?
    public let secretRef: String?
    public let status: String?
    public let updatedAt: String?


    public init(accountCode: String? = nil, authType: String? = nil, createdAt: String? = nil, id: String? = nil, maskedLabel: String? = nil, name: String? = nil, providerCode: String? = nil, secretRef: String? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.accountCode = accountCode
        self.authType = authType
        self.createdAt = createdAt
        self.id = id
        self.maskedLabel = maskedLabel
        self.name = name
        self.providerCode = providerCode
        self.secretRef = secretRef
        self.status = status
        self.updatedAt = updatedAt
    }
}

public struct AdminProviderSecretMutationResponse: Codable {
    public let item: AdminProviderSecretItem?


    public init(item: AdminProviderSecretItem? = nil) {
        self.item = item
    }
}

public struct AdminProviderSecretUpdateRequest: Codable {
    public let authType: String?
    public let id: String?
    public let name: String?
    public let providerCode: String?
    public let secretRef: String?
    public let status: String?


    public init(authType: String? = nil, id: String? = nil, name: String? = nil, providerCode: String? = nil, secretRef: String? = nil, status: String? = nil) {
        self.authType = authType
        self.id = id
        self.name = name
        self.providerCode = providerCode
        self.secretRef = secretRef
        self.status = status
    }
}

public struct AdminProviderSecretsResponse: Codable {
    public let items: [AdminProviderSecretItem]?


    public init(items: [AdminProviderSecretItem]? = nil) {
        self.items = items
    }
}

public struct AdminRateLimitItem: Codable {
    public let blockDuration: String?
    public let burst: Int?
    public let group: String?
    public let id: String?
    public let keyPrefix: String?
    public let model: String?
    public let rpd: Int?
    public let rpm: Int?
    public let rps: Int?
    public let ruleName: String?
    public let status: String?
    public let targetIp: String?
    public let tpm: Int?
    public let user: String?


    public init(blockDuration: String? = nil, burst: Int? = nil, group: String? = nil, id: String? = nil, keyPrefix: String? = nil, model: String? = nil, rpd: Int? = nil, rpm: Int? = nil, rps: Int? = nil, ruleName: String? = nil, status: String? = nil, targetIp: String? = nil, tpm: Int? = nil, user: String? = nil) {
        self.blockDuration = blockDuration
        self.burst = burst
        self.group = group
        self.id = id
        self.keyPrefix = keyPrefix
        self.model = model
        self.rpd = rpd
        self.rpm = rpm
        self.rps = rps
        self.ruleName = ruleName
        self.status = status
        self.targetIp = targetIp
        self.tpm = tpm
        self.user = user
    }
}

public struct AdminRateLimitMutationResponse: Codable {
    public let item: AdminRateLimitItem?


    public init(item: AdminRateLimitItem? = nil) {
        self.item = item
    }
}

public struct AdminRechargePackageMutationResponse: Codable {
    public let item: [String: Any]?


    public init(item: [String: Any]? = nil) {
        self.item = item
    }
}

public struct AdminRecordLogItem: Codable {
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
    public let user: String?


    public init(baseInputPrice: String? = nil, baseOutputPrice: String? = nil, cacheReadPrice: String? = nil, cacheReadTokens: Int? = nil, cost: String? = nil, group: String? = nil, id: String? = nil, inputTokens: Int? = nil, ip: String? = nil, isStream: Bool? = nil, model: String? = nil, multiplier: String? = nil, outputTokens: Int? = nil, path: String? = nil, reasoningEffort: String? = nil, requestId: String? = nil, time: String? = nil, tokenName: String? = nil, totalTime: String? = nil, ttft: String? = nil, type: String? = nil, user: String? = nil) {
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
        self.user = user
    }
}

public struct AdminRecordLogsResponse: Codable {
    public let logs: [AdminRecordLogItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(logs: [AdminRecordLogItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.logs = logs
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct AdminReferralStatItem: Codable {
    public let bonusAwarded: String?
    public let id: String?
    public let inviter: String?
    public let link: String?
    public let totalInvited: Int?
    public let totalRevenue: String?


    public init(bonusAwarded: String? = nil, id: String? = nil, inviter: String? = nil, link: String? = nil, totalInvited: Int? = nil, totalRevenue: String? = nil) {
        self.bonusAwarded = bonusAwarded
        self.id = id
        self.inviter = inviter
        self.link = link
        self.totalInvited = totalInvited
        self.totalRevenue = totalRevenue
    }
}

public struct AdminReferralStatsResponse: Codable {
    public let items: [AdminReferralStatItem]?


    public init(items: [AdminReferralStatItem]? = nil) {
        self.items = items
    }
}

public struct AdminSiteSettingsResponse: Codable {
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

public struct AdminSiteSettingsUpdateRequest: Codable {
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

public struct AdminSkillArtifactCreateRequest: Codable {
    public let artifactRef: String?
    public let artifactSizeBytes: Int?
    public let artifactType: Int?
    public let artifactUrl: String?
    public let checksumHash: String?
    public let deprecatedAt: String?
    public let frameworks: [String]?
    public let licenseName: String?
    public let osName: String?
    public let platformType: String?
    public let publishedAt: String?
    public let releaseNotes: String?
    public let runtime: String?
    public let status: Int?
    public let version: String?


    public init(artifactRef: String? = nil, artifactSizeBytes: Int? = nil, artifactType: Int? = nil, artifactUrl: String? = nil, checksumHash: String? = nil, deprecatedAt: String? = nil, frameworks: [String]? = nil, licenseName: String? = nil, osName: String? = nil, platformType: String? = nil, publishedAt: String? = nil, releaseNotes: String? = nil, runtime: String? = nil, status: Int? = nil, version: String? = nil) {
        self.artifactRef = artifactRef
        self.artifactSizeBytes = artifactSizeBytes
        self.artifactType = artifactType
        self.artifactUrl = artifactUrl
        self.checksumHash = checksumHash
        self.deprecatedAt = deprecatedAt
        self.frameworks = frameworks
        self.licenseName = licenseName
        self.osName = osName
        self.platformType = platformType
        self.publishedAt = publishedAt
        self.releaseNotes = releaseNotes
        self.runtime = runtime
        self.status = status
        self.version = version
    }
}

public struct AdminSkillArtifactDeleteResponse: Codable {
    public let deleted: Bool?


    public init(deleted: Bool? = nil) {
        self.deleted = deleted
    }
}

public struct AdminSkillArtifactItem: Codable {
    public let artifactRef: String?
    public let artifactSizeBytes: Int?
    public let artifactType: Int?
    public let artifactUrl: String?
    public let checksumHash: String?
    public let createdAt: String?
    public let deprecatedAt: String?
    public let frameworks: [String]?
    public let id: String?
    public let licenseName: String?
    public let osName: String?
    public let platformType: String?
    public let publishedAt: String?
    public let releaseNotes: String?
    public let runtime: String?
    public let skillId: String?
    public let status: Int?
    public let targetId: String?
    public let targetType: Int?
    public let updatedAt: String?
    public let version: String?


    public init(artifactRef: String? = nil, artifactSizeBytes: Int? = nil, artifactType: Int? = nil, artifactUrl: String? = nil, checksumHash: String? = nil, createdAt: String? = nil, deprecatedAt: String? = nil, frameworks: [String]? = nil, id: String? = nil, licenseName: String? = nil, osName: String? = nil, platformType: String? = nil, publishedAt: String? = nil, releaseNotes: String? = nil, runtime: String? = nil, skillId: String? = nil, status: Int? = nil, targetId: String? = nil, targetType: Int? = nil, updatedAt: String? = nil, version: String? = nil) {
        self.artifactRef = artifactRef
        self.artifactSizeBytes = artifactSizeBytes
        self.artifactType = artifactType
        self.artifactUrl = artifactUrl
        self.checksumHash = checksumHash
        self.createdAt = createdAt
        self.deprecatedAt = deprecatedAt
        self.frameworks = frameworks
        self.id = id
        self.licenseName = licenseName
        self.osName = osName
        self.platformType = platformType
        self.publishedAt = publishedAt
        self.releaseNotes = releaseNotes
        self.runtime = runtime
        self.skillId = skillId
        self.status = status
        self.targetId = targetId
        self.targetType = targetType
        self.updatedAt = updatedAt
        self.version = version
    }
}

public struct AdminSkillArtifactListResponse: Codable {
    public let items: [AdminSkillArtifactItem]?


    public init(items: [AdminSkillArtifactItem]? = nil) {
        self.items = items
    }
}

public struct AdminSkillArtifactMutationResponse: Codable {
    public let item: AdminSkillArtifactItem?


    public init(item: AdminSkillArtifactItem? = nil) {
        self.item = item
    }
}

public struct AdminSkillArtifactUpdateRequest: Codable {
    public let artifactRef: String?
    public let artifactSizeBytes: Int?
    public let artifactType: Int?
    public let artifactUrl: String?
    public let checksumHash: String?
    public let deprecatedAt: String?
    public let frameworks: [String]?
    public let licenseName: String?
    public let osName: String?
    public let platformType: String?
    public let publishedAt: String?
    public let releaseNotes: String?
    public let runtime: String?
    public let status: Int?
    public let version: String?


    public init(artifactRef: String? = nil, artifactSizeBytes: Int? = nil, artifactType: Int? = nil, artifactUrl: String? = nil, checksumHash: String? = nil, deprecatedAt: String? = nil, frameworks: [String]? = nil, licenseName: String? = nil, osName: String? = nil, platformType: String? = nil, publishedAt: String? = nil, releaseNotes: String? = nil, runtime: String? = nil, status: Int? = nil, version: String? = nil) {
        self.artifactRef = artifactRef
        self.artifactSizeBytes = artifactSizeBytes
        self.artifactType = artifactType
        self.artifactUrl = artifactUrl
        self.checksumHash = checksumHash
        self.deprecatedAt = deprecatedAt
        self.frameworks = frameworks
        self.licenseName = licenseName
        self.osName = osName
        self.platformType = platformType
        self.publishedAt = publishedAt
        self.releaseNotes = releaseNotes
        self.runtime = runtime
        self.status = status
        self.version = version
    }
}

public struct AdminSkillAssetCreateRequest: Codable {
    public let altText: String?
    public let artifactId: String?
    public let assetType: Int?
    public let assetUrl: String?
    public let durationSeconds: String?
    public let fileSize: Int?
    public let height: Int?
    public let mimeType: String?
    public let publishedAt: String?
    public let sortOrder: Int?
    public let status: Int?
    public let thumbnailUrl: String?
    public let title: String?
    public let width: Int?


    public init(altText: String? = nil, artifactId: String? = nil, assetType: Int? = nil, assetUrl: String? = nil, durationSeconds: String? = nil, fileSize: Int? = nil, height: Int? = nil, mimeType: String? = nil, publishedAt: String? = nil, sortOrder: Int? = nil, status: Int? = nil, thumbnailUrl: String? = nil, title: String? = nil, width: Int? = nil) {
        self.altText = altText
        self.artifactId = artifactId
        self.assetType = assetType
        self.assetUrl = assetUrl
        self.durationSeconds = durationSeconds
        self.fileSize = fileSize
        self.height = height
        self.mimeType = mimeType
        self.publishedAt = publishedAt
        self.sortOrder = sortOrder
        self.status = status
        self.thumbnailUrl = thumbnailUrl
        self.title = title
        self.width = width
    }
}

public struct AdminSkillAssetDeleteResponse: Codable {
    public let deleted: Bool?


    public init(deleted: Bool? = nil) {
        self.deleted = deleted
    }
}

public struct AdminSkillAssetItem: Codable {
    public let altText: String?
    public let artifactId: String?
    public let assetType: Int?
    public let assetUrl: String?
    public let createdAt: String?
    public let durationSeconds: String?
    public let fileSize: Int?
    public let height: Int?
    public let id: String?
    public let mimeType: String?
    public let publishedAt: String?
    public let skillId: String?
    public let sortOrder: Int?
    public let status: Int?
    public let targetId: String?
    public let targetType: Int?
    public let thumbnailUrl: String?
    public let title: String?
    public let updatedAt: String?
    public let width: Int?


    public init(altText: String? = nil, artifactId: String? = nil, assetType: Int? = nil, assetUrl: String? = nil, createdAt: String? = nil, durationSeconds: String? = nil, fileSize: Int? = nil, height: Int? = nil, id: String? = nil, mimeType: String? = nil, publishedAt: String? = nil, skillId: String? = nil, sortOrder: Int? = nil, status: Int? = nil, targetId: String? = nil, targetType: Int? = nil, thumbnailUrl: String? = nil, title: String? = nil, updatedAt: String? = nil, width: Int? = nil) {
        self.altText = altText
        self.artifactId = artifactId
        self.assetType = assetType
        self.assetUrl = assetUrl
        self.createdAt = createdAt
        self.durationSeconds = durationSeconds
        self.fileSize = fileSize
        self.height = height
        self.id = id
        self.mimeType = mimeType
        self.publishedAt = publishedAt
        self.skillId = skillId
        self.sortOrder = sortOrder
        self.status = status
        self.targetId = targetId
        self.targetType = targetType
        self.thumbnailUrl = thumbnailUrl
        self.title = title
        self.updatedAt = updatedAt
        self.width = width
    }
}

public struct AdminSkillAssetListResponse: Codable {
    public let items: [AdminSkillAssetItem]?


    public init(items: [AdminSkillAssetItem]? = nil) {
        self.items = items
    }
}

public struct AdminSkillAssetMutationResponse: Codable {
    public let item: AdminSkillAssetItem?


    public init(item: AdminSkillAssetItem? = nil) {
        self.item = item
    }
}

public struct AdminSkillAssetUpdateRequest: Codable {
    public let altText: String?
    public let artifactId: String?
    public let assetType: Int?
    public let assetUrl: String?
    public let durationSeconds: String?
    public let fileSize: Int?
    public let height: Int?
    public let mimeType: String?
    public let publishedAt: String?
    public let sortOrder: Int?
    public let status: Int?
    public let thumbnailUrl: String?
    public let title: String?
    public let width: Int?


    public init(altText: String? = nil, artifactId: String? = nil, assetType: Int? = nil, assetUrl: String? = nil, durationSeconds: String? = nil, fileSize: Int? = nil, height: Int? = nil, mimeType: String? = nil, publishedAt: String? = nil, sortOrder: Int? = nil, status: Int? = nil, thumbnailUrl: String? = nil, title: String? = nil, width: Int? = nil) {
        self.altText = altText
        self.artifactId = artifactId
        self.assetType = assetType
        self.assetUrl = assetUrl
        self.durationSeconds = durationSeconds
        self.fileSize = fileSize
        self.height = height
        self.mimeType = mimeType
        self.publishedAt = publishedAt
        self.sortOrder = sortOrder
        self.status = status
        self.thumbnailUrl = thumbnailUrl
        self.title = title
        self.width = width
    }
}

public struct AdminSkillCategoryCreateRequest: Codable {
    public let code: String?
    public let description: String?
    public let icon: String?
    public let name: String?
    public let parentId: String?
    public let path: String?
    public let sortWeight: Int?
    public let status: Int?
    public let type: Int?
    public let visible: Bool?


    public init(code: String? = nil, description: String? = nil, icon: String? = nil, name: String? = nil, parentId: String? = nil, path: String? = nil, sortWeight: Int? = nil, status: Int? = nil, type: Int? = nil, visible: Bool? = nil) {
        self.code = code
        self.description = description
        self.icon = icon
        self.name = name
        self.parentId = parentId
        self.path = path
        self.sortWeight = sortWeight
        self.status = status
        self.type = type
        self.visible = visible
    }
}

public struct AdminSkillCategoryDeleteResponse: Codable {
    public let deleted: Bool?


    public init(deleted: Bool? = nil) {
        self.deleted = deleted
    }
}

public struct AdminSkillCategoryItem: Codable {
    public let code: String?
    public let description: String?
    public let icon: String?
    public let id: String?
    public let name: String?
    public let parentId: String?
    public let path: String?
    public let sortWeight: Int?
    public let status: Int?
    public let type: Int?
    public let visible: Bool?


    public init(code: String? = nil, description: String? = nil, icon: String? = nil, id: String? = nil, name: String? = nil, parentId: String? = nil, path: String? = nil, sortWeight: Int? = nil, status: Int? = nil, type: Int? = nil, visible: Bool? = nil) {
        self.code = code
        self.description = description
        self.icon = icon
        self.id = id
        self.name = name
        self.parentId = parentId
        self.path = path
        self.sortWeight = sortWeight
        self.status = status
        self.type = type
        self.visible = visible
    }
}

public struct AdminSkillCategoryListResponse: Codable {
    public let items: [AdminSkillCategoryItem]?


    public init(items: [AdminSkillCategoryItem]? = nil) {
        self.items = items
    }
}

public struct AdminSkillCategoryMutationResponse: Codable {
    public let item: AdminSkillCategoryItem?


    public init(item: AdminSkillCategoryItem? = nil) {
        self.item = item
    }
}

public struct AdminSkillCategoryUpdateRequest: Codable {
    public let code: String?
    public let description: String?
    public let icon: String?
    public let name: String?
    public let parentId: String?
    public let path: String?
    public let sortWeight: Int?
    public let status: Int?
    public let type: Int?
    public let visible: Bool?


    public init(code: String? = nil, description: String? = nil, icon: String? = nil, name: String? = nil, parentId: String? = nil, path: String? = nil, sortWeight: Int? = nil, status: Int? = nil, type: Int? = nil, visible: Bool? = nil) {
        self.code = code
        self.description = description
        self.icon = icon
        self.name = name
        self.parentId = parentId
        self.path = path
        self.sortWeight = sortWeight
        self.status = status
        self.type = type
        self.visible = visible
    }
}

public struct AdminSkillCreateRequest: Codable {
    public let builtin: Bool?
    public let capabilities: [String]?
    public let categoryId: String?
    public let configSchema: [String: String]?
    public let coverImage: String?
    public let currency: String?
    public let defaultConfig: [String: String]?
    public let description: String?
    public let documentationUrl: String?
    public let enabled: Bool?
    public let entrypoint: String?
    public let featured: Bool?
    public let homepageUrl: String?
    public let icon: String?
    public let isBuiltin: Bool?
    public let licenseName: String?
    public let manifestUrl: String?
    public let marketStatus: String?
    public let name: String?
    public let packageId: String?
    public let price: String?
    public let provider: String?
    public let recommendWeight: Int?
    public let repositoryUrl: String?
    public let reviewStatus: String?
    public let runtime: String?
    public let skillKey: String?
    public let sourceType: String?
    public let summary: String?
    public let tags: [String]?
    public let version: String?
    public let versionName: String?
    public let visibility: String?


    public init(builtin: Bool? = nil, capabilities: [String]? = nil, categoryId: String? = nil, configSchema: [String: String]? = nil, coverImage: String? = nil, currency: String? = nil, defaultConfig: [String: String]? = nil, description: String? = nil, documentationUrl: String? = nil, enabled: Bool? = nil, entrypoint: String? = nil, featured: Bool? = nil, homepageUrl: String? = nil, icon: String? = nil, isBuiltin: Bool? = nil, licenseName: String? = nil, manifestUrl: String? = nil, marketStatus: String? = nil, name: String? = nil, packageId: String? = nil, price: String? = nil, provider: String? = nil, recommendWeight: Int? = nil, repositoryUrl: String? = nil, reviewStatus: String? = nil, runtime: String? = nil, skillKey: String? = nil, sourceType: String? = nil, summary: String? = nil, tags: [String]? = nil, version: String? = nil, versionName: String? = nil, visibility: String? = nil) {
        self.builtin = builtin
        self.capabilities = capabilities
        self.categoryId = categoryId
        self.configSchema = configSchema
        self.coverImage = coverImage
        self.currency = currency
        self.defaultConfig = defaultConfig
        self.description = description
        self.documentationUrl = documentationUrl
        self.enabled = enabled
        self.entrypoint = entrypoint
        self.featured = featured
        self.homepageUrl = homepageUrl
        self.icon = icon
        self.isBuiltin = isBuiltin
        self.licenseName = licenseName
        self.manifestUrl = manifestUrl
        self.marketStatus = marketStatus
        self.name = name
        self.packageId = packageId
        self.price = price
        self.provider = provider
        self.recommendWeight = recommendWeight
        self.repositoryUrl = repositoryUrl
        self.reviewStatus = reviewStatus
        self.runtime = runtime
        self.skillKey = skillKey
        self.sourceType = sourceType
        self.summary = summary
        self.tags = tags
        self.version = version
        self.versionName = versionName
        self.visibility = visibility
    }
}

public struct AdminSkillDeleteResponse: Codable {
    public let deleted: Bool?


    public init(deleted: Bool? = nil) {
        self.deleted = deleted
    }
}

public struct AdminSkillItem: Codable {
    public let builtin: Bool?
    public let capabilities: [String]?
    public let categoryId: String?
    public let configSchema: [String: String]?
    public let coverImage: String?
    public let createdAt: String?
    public let currency: String?
    public let defaultConfig: [String: String]?
    public let description: String?
    public let documentationUrl: String?
    public let enabled: Bool?
    public let entrypoint: String?
    public let featured: Bool?
    public let homepageUrl: String?
    public let icon: String?
    public let id: String?
    public let installCount: String?
    public let isBuiltin: Bool?
    public let latestPublishedAt: String?
    public let licenseName: String?
    public let manifestUrl: String?
    public let marketStatus: String?
    public let name: String?
    public let packageId: String?
    public let price: String?
    public let provider: String?
    public let ratingAvg: String?
    public let ratingCount: String?
    public let recommendWeight: Int?
    public let repositoryUrl: String?
    public let reviewComment: String?
    public let reviewStatus: String?
    public let reviewedAt: String?
    public let reviewedBy: String?
    public let runtime: String?
    public let skillKey: String?
    public let sourceType: String?
    public let summary: String?
    public let tags: [String]?
    public let updatedAt: String?
    public let version: String?
    public let versionName: String?
    public let visibility: String?


    public init(builtin: Bool? = nil, capabilities: [String]? = nil, categoryId: String? = nil, configSchema: [String: String]? = nil, coverImage: String? = nil, createdAt: String? = nil, currency: String? = nil, defaultConfig: [String: String]? = nil, description: String? = nil, documentationUrl: String? = nil, enabled: Bool? = nil, entrypoint: String? = nil, featured: Bool? = nil, homepageUrl: String? = nil, icon: String? = nil, id: String? = nil, installCount: String? = nil, isBuiltin: Bool? = nil, latestPublishedAt: String? = nil, licenseName: String? = nil, manifestUrl: String? = nil, marketStatus: String? = nil, name: String? = nil, packageId: String? = nil, price: String? = nil, provider: String? = nil, ratingAvg: String? = nil, ratingCount: String? = nil, recommendWeight: Int? = nil, repositoryUrl: String? = nil, reviewComment: String? = nil, reviewStatus: String? = nil, reviewedAt: String? = nil, reviewedBy: String? = nil, runtime: String? = nil, skillKey: String? = nil, sourceType: String? = nil, summary: String? = nil, tags: [String]? = nil, updatedAt: String? = nil, version: String? = nil, versionName: String? = nil, visibility: String? = nil) {
        self.builtin = builtin
        self.capabilities = capabilities
        self.categoryId = categoryId
        self.configSchema = configSchema
        self.coverImage = coverImage
        self.createdAt = createdAt
        self.currency = currency
        self.defaultConfig = defaultConfig
        self.description = description
        self.documentationUrl = documentationUrl
        self.enabled = enabled
        self.entrypoint = entrypoint
        self.featured = featured
        self.homepageUrl = homepageUrl
        self.icon = icon
        self.id = id
        self.installCount = installCount
        self.isBuiltin = isBuiltin
        self.latestPublishedAt = latestPublishedAt
        self.licenseName = licenseName
        self.manifestUrl = manifestUrl
        self.marketStatus = marketStatus
        self.name = name
        self.packageId = packageId
        self.price = price
        self.provider = provider
        self.ratingAvg = ratingAvg
        self.ratingCount = ratingCount
        self.recommendWeight = recommendWeight
        self.repositoryUrl = repositoryUrl
        self.reviewComment = reviewComment
        self.reviewStatus = reviewStatus
        self.reviewedAt = reviewedAt
        self.reviewedBy = reviewedBy
        self.runtime = runtime
        self.skillKey = skillKey
        self.sourceType = sourceType
        self.summary = summary
        self.tags = tags
        self.updatedAt = updatedAt
        self.version = version
        self.versionName = versionName
        self.visibility = visibility
    }
}

public struct AdminSkillListResponse: Codable {
    public let items: [AdminSkillItem]?


    public init(items: [AdminSkillItem]? = nil) {
        self.items = items
    }
}

public struct AdminSkillMutationResponse: Codable {
    public let item: AdminSkillItem?


    public init(item: AdminSkillItem? = nil) {
        self.item = item
    }
}

public struct AdminSkillPackageCreateRequest: Codable {
    public let categoryId: String?
    public let coverImage: String?
    public let description: String?
    public let enabled: Bool?
    public let featured: Bool?
    public let icon: String?
    public let name: String?
    public let packageKey: String?
    public let sortWeight: Int?
    public let summary: String?
    public let tags: [String]?


    public init(categoryId: String? = nil, coverImage: String? = nil, description: String? = nil, enabled: Bool? = nil, featured: Bool? = nil, icon: String? = nil, name: String? = nil, packageKey: String? = nil, sortWeight: Int? = nil, summary: String? = nil, tags: [String]? = nil) {
        self.categoryId = categoryId
        self.coverImage = coverImage
        self.description = description
        self.enabled = enabled
        self.featured = featured
        self.icon = icon
        self.name = name
        self.packageKey = packageKey
        self.sortWeight = sortWeight
        self.summary = summary
        self.tags = tags
    }
}

public struct AdminSkillPackageDeleteResponse: Codable {
    public let deleted: Bool?


    public init(deleted: Bool? = nil) {
        self.deleted = deleted
    }
}

public struct AdminSkillPackageItem: Codable {
    public let categoryId: String?
    public let coverImage: String?
    public let createdAt: String?
    public let description: String?
    public let enabled: Bool?
    public let featured: Bool?
    public let icon: String?
    public let id: String?
    public let latestPublishedAt: String?
    public let name: String?
    public let packageKey: String?
    public let sortWeight: Int?
    public let summary: String?
    public let tags: [String]?
    public let updatedAt: String?


    public init(categoryId: String? = nil, coverImage: String? = nil, createdAt: String? = nil, description: String? = nil, enabled: Bool? = nil, featured: Bool? = nil, icon: String? = nil, id: String? = nil, latestPublishedAt: String? = nil, name: String? = nil, packageKey: String? = nil, sortWeight: Int? = nil, summary: String? = nil, tags: [String]? = nil, updatedAt: String? = nil) {
        self.categoryId = categoryId
        self.coverImage = coverImage
        self.createdAt = createdAt
        self.description = description
        self.enabled = enabled
        self.featured = featured
        self.icon = icon
        self.id = id
        self.latestPublishedAt = latestPublishedAt
        self.name = name
        self.packageKey = packageKey
        self.sortWeight = sortWeight
        self.summary = summary
        self.tags = tags
        self.updatedAt = updatedAt
    }
}

public struct AdminSkillPackageListResponse: Codable {
    public let items: [AdminSkillPackageItem]?


    public init(items: [AdminSkillPackageItem]? = nil) {
        self.items = items
    }
}

public struct AdminSkillPackageMutationResponse: Codable {
    public let item: AdminSkillPackageItem?


    public init(item: AdminSkillPackageItem? = nil) {
        self.item = item
    }
}

public struct AdminSkillPackageUpdateRequest: Codable {
    public let categoryId: String?
    public let coverImage: String?
    public let description: String?
    public let enabled: Bool?
    public let featured: Bool?
    public let icon: String?
    public let name: String?
    public let packageKey: String?
    public let sortWeight: Int?
    public let summary: String?
    public let tags: [String]?


    public init(categoryId: String? = nil, coverImage: String? = nil, description: String? = nil, enabled: Bool? = nil, featured: Bool? = nil, icon: String? = nil, name: String? = nil, packageKey: String? = nil, sortWeight: Int? = nil, summary: String? = nil, tags: [String]? = nil) {
        self.categoryId = categoryId
        self.coverImage = coverImage
        self.description = description
        self.enabled = enabled
        self.featured = featured
        self.icon = icon
        self.name = name
        self.packageKey = packageKey
        self.sortWeight = sortWeight
        self.summary = summary
        self.tags = tags
    }
}

public struct AdminSkillReviewRequest: Codable {
    public let comment: String?
    public let reviewComment: String?


    public init(comment: String? = nil, reviewComment: String? = nil) {
        self.comment = comment
        self.reviewComment = reviewComment
    }
}

public struct AdminSkillUpdateRequest: Codable {
    public let builtin: Bool?
    public let capabilities: [String]?
    public let categoryId: String?
    public let configSchema: [String: String]?
    public let coverImage: String?
    public let currency: String?
    public let defaultConfig: [String: String]?
    public let description: String?
    public let documentationUrl: String?
    public let entrypoint: String?
    public let featured: Bool?
    public let homepageUrl: String?
    public let icon: String?
    public let isBuiltin: Bool?
    public let licenseName: String?
    public let manifestUrl: String?
    public let name: String?
    public let packageId: String?
    public let price: String?
    public let provider: String?
    public let recommendWeight: Int?
    public let repositoryUrl: String?
    public let runtime: String?
    public let skillKey: String?
    public let sourceType: String?
    public let summary: String?
    public let tags: [String]?
    public let version: String?
    public let versionName: String?
    public let visibility: String?


    public init(builtin: Bool? = nil, capabilities: [String]? = nil, categoryId: String? = nil, configSchema: [String: String]? = nil, coverImage: String? = nil, currency: String? = nil, defaultConfig: [String: String]? = nil, description: String? = nil, documentationUrl: String? = nil, entrypoint: String? = nil, featured: Bool? = nil, homepageUrl: String? = nil, icon: String? = nil, isBuiltin: Bool? = nil, licenseName: String? = nil, manifestUrl: String? = nil, name: String? = nil, packageId: String? = nil, price: String? = nil, provider: String? = nil, recommendWeight: Int? = nil, repositoryUrl: String? = nil, runtime: String? = nil, skillKey: String? = nil, sourceType: String? = nil, summary: String? = nil, tags: [String]? = nil, version: String? = nil, versionName: String? = nil, visibility: String? = nil) {
        self.builtin = builtin
        self.capabilities = capabilities
        self.categoryId = categoryId
        self.configSchema = configSchema
        self.coverImage = coverImage
        self.currency = currency
        self.defaultConfig = defaultConfig
        self.description = description
        self.documentationUrl = documentationUrl
        self.entrypoint = entrypoint
        self.featured = featured
        self.homepageUrl = homepageUrl
        self.icon = icon
        self.isBuiltin = isBuiltin
        self.licenseName = licenseName
        self.manifestUrl = manifestUrl
        self.name = name
        self.packageId = packageId
        self.price = price
        self.provider = provider
        self.recommendWeight = recommendWeight
        self.repositoryUrl = repositoryUrl
        self.runtime = runtime
        self.skillKey = skillKey
        self.sourceType = sourceType
        self.summary = summary
        self.tags = tags
        self.version = version
        self.versionName = versionName
        self.visibility = visibility
    }
}

public struct AdminTokenLimitCreateRequest: Codable {
    public let burst: Int?
    public let keyPrefix: String?
    public let rpd: Int?
    public let rps: Int?
    public let status: String?
    public let user: String?


    public init(burst: Int? = nil, keyPrefix: String? = nil, rpd: Int? = nil, rps: Int? = nil, status: String? = nil, user: String? = nil) {
        self.burst = burst
        self.keyPrefix = keyPrefix
        self.rpd = rpd
        self.rps = rps
        self.status = status
        self.user = user
    }
}

public struct AdminTokenLimitsResponse: Codable {
    public let items: [AdminRateLimitItem]?


    public init(items: [AdminRateLimitItem]? = nil) {
        self.items = items
    }
}

public struct AdminUsagePair: Codable {
    public let today: Double?
    public let total: Double?


    public init(today: Double? = nil, total: Double? = nil) {
        self.today = today
        self.total = total
    }
}

public struct AdminUserCreateRequest: Codable {
    public let balance: String?
    public let email: String?
    public let username: String?


    public init(balance: String? = nil, email: String? = nil, username: String? = nil) {
        self.balance = balance
        self.email = email
        self.username = username
    }
}

public struct AdminUserItem: Codable {
    public let balance: String?
    public let createdAt: String?
    public let email: String?
    public let group: String?
    public let id: Int?
    public let lastActive: String?
    public let lastUsed: String?
    public let role: String?
    public let status: String?
    public let username: String?


    public init(balance: String? = nil, createdAt: String? = nil, email: String? = nil, group: String? = nil, id: Int? = nil, lastActive: String? = nil, lastUsed: String? = nil, role: String? = nil, status: String? = nil, username: String? = nil) {
        self.balance = balance
        self.createdAt = createdAt
        self.email = email
        self.group = group
        self.id = id
        self.lastActive = lastActive
        self.lastUsed = lastUsed
        self.role = role
        self.status = status
        self.username = username
    }
}

public struct AdminUserMutationResponse: Codable {
    public let item: AdminUserItem?


    public init(item: AdminUserItem? = nil) {
        self.item = item
    }
}

public struct AdminUserUpdateRequest: Codable {
    public let group: String?
    public let id: Int?
    public let status: String?
    public let username: String?


    public init(group: String? = nil, id: Int? = nil, status: String? = nil, username: String? = nil) {
        self.group = group
        self.id = id
        self.status = status
        self.username = username
    }
}

public struct AdminUsersResponse: Codable {
    public let items: [AdminUserItem]?


    public init(items: [AdminUserItem]? = nil) {
        self.items = items
    }
}

public struct AgentDefinitionsListResult: Codable {
    public let code: String?
    public let data: AdminAgentListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAgentListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AgentDefinitionsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminAgentItem?
    public let msg: String?


    public init(code: String? = nil, data: AdminAgentItem? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
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

public struct AnalyticsAdminOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: AdminAnalyticsOverviewResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAnalyticsOverviewResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AnnouncementsCreateResult: Codable {
    public let code: String?
    public let data: AdminAnnouncementMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAnnouncementMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AnnouncementsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AnnouncementsListResult: Codable {
    public let code: String?
    public let data: AdminAnnouncementsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAnnouncementsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AnnouncementsUpdateResult: Codable {
    public let code: String?
    public let data: AdminAnnouncementMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAnnouncementMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ApiKeysCreateResult: Codable {
    public let code: String?
    public let data: AdminApiKeyCreateResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminApiKeyCreateResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ApiKeysDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ApiKeysListResult: Codable {
    public let code: String?
    public let data: AdminApiKeysMapResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminApiKeysMapResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsCategoriesCreateResult: Codable {
    public let code: String?
    public let data: AdminAppCategoryMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppCategoryMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsCategoriesDeleteResult: Codable {
    public let code: String?
    public let data: AdminAppCategoryDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppCategoryDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsCategoriesListResult: Codable {
    public let code: String?
    public let data: AdminAppCategoryListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppCategoryListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsCategoriesUpdateResult: Codable {
    public let code: String?
    public let data: AdminAppCategoryMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppCategoryMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsCreateResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsDeleteResult: Codable {
    public let code: String?
    public let data: AdminAppDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsDisableResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsEnableResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsListResult: Codable {
    public let code: String?
    public let data: AdminAppListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsPublishResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsUnpublishResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AppsUpdateResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AuditCommerceEventsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AuthSettingsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminAuthSettingsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAuthSettingsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct AuthSettingsUpdateResult: Codable {
    public let code: String?
    public let data: AdminAuthSettingsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAuthSettingsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CacheInstancesDeleteResult: Codable {
    public let code: String?
    public let data: AdminCacheOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminCacheOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CacheInstancesRefreshCreateResult: Codable {
    public let code: String?
    public let data: AdminCacheOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminCacheOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CacheNamespacesDeleteResult: Codable {
    public let code: String?
    public let data: AdminCacheOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminCacheOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CacheNamespacesKeysDeleteResult: Codable {
    public let code: String?
    public let data: AdminCacheOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminCacheOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CacheNamespacesKeysListResult: Codable {
    public let code: String?
    public let data: AdminCacheKeyListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminCacheKeyListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CacheNamespacesRefreshCreateResult: Codable {
    public let code: String?
    public let data: AdminCacheOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminCacheOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CacheOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: AdminCacheOverviewResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminCacheOverviewResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CacheRefreshCreateResult: Codable {
    public let code: String?
    public let data: AdminCacheOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminCacheOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogAttributesCreateResult: Codable {
    public let code: String?
    public let data: CommerceProductAttributeMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductAttributeMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogAttributesListResult: Codable {
    public let code: String?
    public let data: CommerceProductAttributeListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductAttributeListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogCategoriesCreateResult: Codable {
    public let code: String?
    public let data: CommerceProductCategoryMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductCategoryMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogCategoriesDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
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

public struct CatalogCategoriesUpdateResult: Codable {
    public let code: String?
    public let data: CommerceProductCategoryMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductCategoryMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogPriceListsCreateResult: Codable {
    public let code: String?
    public let data: CommercePriceListMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePriceListMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogPriceListsListResult: Codable {
    public let code: String?
    public let data: CommercePriceListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePriceListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogProductsCreateResult: Codable {
    public let code: String?
    public let data: CommerceProductSpuMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductSpuMutationResponse? = nil, msg: String? = nil) {
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

public struct CatalogProductsUpdateResult: Codable {
    public let code: String?
    public let data: CommerceProductSpuMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductSpuMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogSkusCreateResult: Codable {
    public let code: String?
    public let data: CommerceProductSkuMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductSkuMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogSkusListResult: Codable {
    public let code: String?
    public let data: CommerceProductSkuListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductSkuListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CatalogSkusUpdateResult: Codable {
    public let code: String?
    public let data: CommerceProductSkuMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceProductSkuMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ChannelsCreateResult: Codable {
    public let code: String?
    public let data: AdminChannelMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminChannelMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ChannelsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ChannelsListResult: Codable {
    public let code: String?
    public let data: AdminChannelsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminChannelsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ChannelsUpdateResult: Codable {
    public let code: String?
    public let data: AdminChannelMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminChannelMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ChannelsVerifyResult: Codable {
    public let code: String?
    public let data: AdminChannelTestResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminChannelTestResponse? = nil, msg: String? = nil) {
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

public struct CommerceCouponIssueBatchRecord: Codable {
    public let audienceFilter: String?
    public let batchNo: String?
    public let campaignCode: String?
    public let codePattern: String?
    public let codePrefix: String?
    public let couponTemplateId: String?
    public let createdAt: String?
    public let createdBy: String?
    public let generatedAt: String?
    public let generationStatus: String?
    public let organizationId: String?
    public let requestedQuantity: String?
    public let status: String?
    public let tenantId: String?
    public let title: String?
    public let updatedAt: String?


    public init(audienceFilter: String? = nil, batchNo: String? = nil, campaignCode: String? = nil, codePattern: String? = nil, codePrefix: String? = nil, couponTemplateId: String? = nil, createdAt: String? = nil, createdBy: String? = nil, generatedAt: String? = nil, generationStatus: String? = nil, organizationId: String? = nil, requestedQuantity: String? = nil, status: String? = nil, tenantId: String? = nil, title: String? = nil, updatedAt: String? = nil) {
        self.audienceFilter = audienceFilter
        self.batchNo = batchNo
        self.campaignCode = campaignCode
        self.codePattern = codePattern
        self.codePrefix = codePrefix
        self.couponTemplateId = couponTemplateId
        self.createdAt = createdAt
        self.createdBy = createdBy
        self.generatedAt = generatedAt
        self.generationStatus = generationStatus
        self.organizationId = organizationId
        self.requestedQuantity = requestedQuantity
        self.status = status
        self.tenantId = tenantId
        self.title = title
        self.updatedAt = updatedAt
    }
}

public struct CommerceCouponRecord: Codable {
    public let claimedAt: String?
    public let couponCode: String?
    public let createdAt: String?
    public let disabledAt: String?
    public let expiresAt: String?
    public let idempotencyKey: String?
    public let issueBatchId: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let redeemedAt: String?
    public let requestNo: String?
    public let status: String?
    public let templateId: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(claimedAt: String? = nil, couponCode: String? = nil, createdAt: String? = nil, disabledAt: String? = nil, expiresAt: String? = nil, idempotencyKey: String? = nil, issueBatchId: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, redeemedAt: String? = nil, requestNo: String? = nil, status: String? = nil, templateId: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.claimedAt = claimedAt
        self.couponCode = couponCode
        self.createdAt = createdAt
        self.disabledAt = disabledAt
        self.expiresAt = expiresAt
        self.idempotencyKey = idempotencyKey
        self.issueBatchId = issueBatchId
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.redeemedAt = redeemedAt
        self.requestNo = requestNo
        self.status = status
        self.templateId = templateId
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceCouponRedemptionRecord: Codable {
    public let couponId: String?
    public let createdAt: String?
    public let discountAmount: String?
    public let idempotencyKey: String?
    public let orderId: String?
    public let organizationId: String?
    public let ownerUserId: String?
    public let redeemedAt: String?
    public let requestNo: String?
    public let rolledBackAt: String?
    public let status: String?
    public let tenantId: String?
    public let updatedAt: String?


    public init(couponId: String? = nil, createdAt: String? = nil, discountAmount: String? = nil, idempotencyKey: String? = nil, orderId: String? = nil, organizationId: String? = nil, ownerUserId: String? = nil, redeemedAt: String? = nil, requestNo: String? = nil, rolledBackAt: String? = nil, status: String? = nil, tenantId: String? = nil, updatedAt: String? = nil) {
        self.couponId = couponId
        self.createdAt = createdAt
        self.discountAmount = discountAmount
        self.idempotencyKey = idempotencyKey
        self.orderId = orderId
        self.organizationId = organizationId
        self.ownerUserId = ownerUserId
        self.redeemedAt = redeemedAt
        self.requestNo = requestNo
        self.rolledBackAt = rolledBackAt
        self.status = status
        self.tenantId = tenantId
        self.updatedAt = updatedAt
    }
}

public struct CommerceCouponTemplateRecord: Codable {
    public let createdAt: String?
    public let discountType: String?
    public let discountValue: String?
    public let expiresAt: String?
    public let organizationId: String?
    public let startsAt: String?
    public let status: String?
    public let templateNo: String?
    public let tenantId: String?
    public let title: String?
    public let totalQuantity: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, discountType: String? = nil, discountValue: String? = nil, expiresAt: String? = nil, organizationId: String? = nil, startsAt: String? = nil, status: String? = nil, templateNo: String? = nil, tenantId: String? = nil, title: String? = nil, totalQuantity: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.discountType = discountType
        self.discountValue = discountValue
        self.expiresAt = expiresAt
        self.organizationId = organizationId
        self.startsAt = startsAt
        self.status = status
        self.templateNo = templateNo
        self.tenantId = tenantId
        self.title = title
        self.totalQuantity = totalQuantity
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

public struct CommerceInventoryLedgerItem: Codable {
    public let balanceAfter: Int?
    public let businessType: String?
    public let createdAt: String?
    public let direction: String?
    public let id: String?
    public let movementNo: String?
    public let quantity: Int?
    public let skuId: String?
    public let sourceId: String?
    public let sourceType: String?
    public let warehouseId: String?


    public init(balanceAfter: Int? = nil, businessType: String? = nil, createdAt: String? = nil, direction: String? = nil, id: String? = nil, movementNo: String? = nil, quantity: Int? = nil, skuId: String? = nil, sourceId: String? = nil, sourceType: String? = nil, warehouseId: String? = nil) {
        self.balanceAfter = balanceAfter
        self.businessType = businessType
        self.createdAt = createdAt
        self.direction = direction
        self.id = id
        self.movementNo = movementNo
        self.quantity = quantity
        self.skuId = skuId
        self.sourceId = sourceId
        self.sourceType = sourceType
        self.warehouseId = warehouseId
    }
}

public struct CommerceInventoryLedgerListResponse: Codable {
    public let items: [CommerceInventoryLedgerItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommerceInventoryLedgerItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
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

public struct CommerceInventoryReservationItem: Codable {
    public let checkoutSessionId: String?
    public let createdAt: String?
    public let expiresAt: String?
    public let id: String?
    public let orderId: String?
    public let quantity: Int?
    public let reservationNo: String?
    public let skuId: String?
    public let status: String?


    public init(checkoutSessionId: String? = nil, createdAt: String? = nil, expiresAt: String? = nil, id: String? = nil, orderId: String? = nil, quantity: Int? = nil, reservationNo: String? = nil, skuId: String? = nil, status: String? = nil) {
        self.checkoutSessionId = checkoutSessionId
        self.createdAt = createdAt
        self.expiresAt = expiresAt
        self.id = id
        self.orderId = orderId
        self.quantity = quantity
        self.reservationNo = reservationNo
        self.skuId = skuId
        self.status = status
    }
}

public struct CommerceInventoryReservationListResponse: Codable {
    public let items: [CommerceInventoryReservationItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommerceInventoryReservationItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
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

public struct CommerceInventoryStockItem: Codable {
    public let availableQuantity: Int?
    public let createdAt: String?
    public let id: String?
    public let reservedQuantity: Int?
    public let skuId: String?
    public let soldQuantity: Int?
    public let status: String?
    public let updatedAt: String?
    public let version: Int?
    public let warehouseId: String?


    public init(availableQuantity: Int? = nil, createdAt: String? = nil, id: String? = nil, reservedQuantity: Int? = nil, skuId: String? = nil, soldQuantity: Int? = nil, status: String? = nil, updatedAt: String? = nil, version: Int? = nil, warehouseId: String? = nil) {
        self.availableQuantity = availableQuantity
        self.createdAt = createdAt
        self.id = id
        self.reservedQuantity = reservedQuantity
        self.skuId = skuId
        self.soldQuantity = soldQuantity
        self.status = status
        self.updatedAt = updatedAt
        self.version = version
        self.warehouseId = warehouseId
    }
}

public struct CommerceInventoryStockListResponse: Codable {
    public let items: [CommerceInventoryStockItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommerceInventoryStockItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct CommerceInventoryStockMutationResponse: Codable {
    public let item: CommerceInventoryStockItem?


    public init(item: CommerceInventoryStockItem? = nil) {
        self.item = item
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

public struct CommerceInventoryStockUpdateRequest: Codable {
    public let availableQuantity: Int?
    public let reasonCode: String?
    public let reservedQuantity: Int?
    public let status: String?
    public let version: Int?


    public init(availableQuantity: Int? = nil, reasonCode: String? = nil, reservedQuantity: Int? = nil, status: String? = nil, version: Int? = nil) {
        self.availableQuantity = availableQuantity
        self.reasonCode = reasonCode
        self.reservedQuantity = reservedQuantity
        self.status = status
        self.version = version
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

public struct CommerceMembershipBenefitMutationRequest: Codable {
    public let benefitKey: String?
    public let claimed: Bool?
    public let description: String?
    public let icon: String?
    public let id: Int?
    public let name: String?
    public let type: String?
    public let usageLimit: Int?
    public let usedCount: Int?


    public init(benefitKey: String? = nil, claimed: Bool? = nil, description: String? = nil, icon: String? = nil, id: Int? = nil, name: String? = nil, type: String? = nil, usageLimit: Int? = nil, usedCount: Int? = nil) {
        self.benefitKey = benefitKey
        self.claimed = claimed
        self.description = description
        self.icon = icon
        self.id = id
        self.name = name
        self.type = type
        self.usageLimit = usageLimit
        self.usedCount = usedCount
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

public struct CommerceMembershipMemberStatusRequest: Codable {
    public let status: String?


    public init(status: String? = nil) {
        self.status = status
    }
}

public struct CommerceMembershipPackageGroupMutationRequest: Codable {
    public let billingCycle: String?
    public let code: String?
    public let description: String?
    public let durationDays: Int?
    public let name: String?
    public let sortWeight: Int?
    public let status: String?


    public init(billingCycle: String? = nil, code: String? = nil, description: String? = nil, durationDays: Int? = nil, name: String? = nil, sortWeight: Int? = nil, status: String? = nil) {
        self.billingCycle = billingCycle
        self.code = code
        self.description = description
        self.durationDays = durationDays
        self.name = name
        self.sortWeight = sortWeight
        self.status = status
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

public struct CommerceMembershipPackageMutationRequest: Codable {
    public let code: String?
    public let currencyCode: String?
    public let durationDays: Int?
    public let name: String?
    public let packageGroupId: String?
    public let planId: String?
    public let priceAmount: String?
    public let status: String?


    public init(code: String? = nil, currencyCode: String? = nil, durationDays: Int? = nil, name: String? = nil, packageGroupId: String? = nil, planId: String? = nil, priceAmount: String? = nil, status: String? = nil) {
        self.code = code
        self.currencyCode = currencyCode
        self.durationDays = durationDays
        self.name = name
        self.packageGroupId = packageGroupId
        self.planId = planId
        self.priceAmount = priceAmount
        self.status = status
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

public struct CommerceMembershipPlanMutationRequest: Codable {
    public let benefits: [CommerceMembershipBenefitMutationRequest]?
    public let code: String?
    public let name: String?
    public let rank: Int?
    public let status: String?


    public init(benefits: [CommerceMembershipBenefitMutationRequest]? = nil, code: String? = nil, name: String? = nil, rank: Int? = nil, status: String? = nil) {
        self.benefits = benefits
        self.code = code
        self.name = name
        self.rank = rank
        self.status = status
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

public struct CommercePaymentAttemptListResponse: Codable {
    public let items: [CommercePaymentAttemptItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommercePaymentAttemptItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
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

public struct CommercePaymentChannelItem: Codable {
    public let channelNo: String?
    public let countryCode: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let id: String?
    public let methodCode: String?
    public let priority: Int?
    public let providerAccountId: String?
    public let providerCode: String?
    public let sceneCode: String?
    public let status: String?
    public let updatedAt: String?


    public init(channelNo: String? = nil, countryCode: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, id: String? = nil, methodCode: String? = nil, priority: Int? = nil, providerAccountId: String? = nil, providerCode: String? = nil, sceneCode: String? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.channelNo = channelNo
        self.countryCode = countryCode
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.id = id
        self.methodCode = methodCode
        self.priority = priority
        self.providerAccountId = providerAccountId
        self.providerCode = providerCode
        self.sceneCode = sceneCode
        self.status = status
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentChannelListResponse: Codable {
    public let items: [CommercePaymentChannelItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommercePaymentChannelItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
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

public struct CommercePaymentIntentListResponse: Codable {
    public let items: [CommercePaymentIntentItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommercePaymentIntentItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
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

public struct CommercePaymentProviderAccountItem: Codable {
    public let accountNo: String?
    public let certificateRef: String?
    public let countryCode: String?
    public let createdAt: String?
    public let environment: String?
    public let id: String?
    public let merchantId: String?
    public let note: String?
    public let providerCode: String?
    public let rotatedAt: String?
    public let secretRef: String?
    public let settlementCurrency: String?
    public let status: String?
    public let updatedAt: String?
    public let webhookSecretRef: String?


    public init(accountNo: String? = nil, certificateRef: String? = nil, countryCode: String? = nil, createdAt: String? = nil, environment: String? = nil, id: String? = nil, merchantId: String? = nil, note: String? = nil, providerCode: String? = nil, rotatedAt: String? = nil, secretRef: String? = nil, settlementCurrency: String? = nil, status: String? = nil, updatedAt: String? = nil, webhookSecretRef: String? = nil) {
        self.accountNo = accountNo
        self.certificateRef = certificateRef
        self.countryCode = countryCode
        self.createdAt = createdAt
        self.environment = environment
        self.id = id
        self.merchantId = merchantId
        self.note = note
        self.providerCode = providerCode
        self.rotatedAt = rotatedAt
        self.secretRef = secretRef
        self.settlementCurrency = settlementCurrency
        self.status = status
        self.updatedAt = updatedAt
        self.webhookSecretRef = webhookSecretRef
    }
}

public struct CommercePaymentProviderAccountListResponse: Codable {
    public let items: [CommercePaymentProviderAccountItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommercePaymentProviderAccountItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct CommercePaymentProviderAccountMutationRequest: Codable {
    public let accountNo: String?
    public let certificateRef: String?
    public let clientRequestNo: String?
    public let countryCode: String?
    public let environment: String?
    public let merchantId: String?
    public let note: String?
    public let providerCode: String?
    public let rotatedAt: String?
    public let secretRef: String?
    public let settlementCurrency: String?
    public let status: String?
    public let webhookSecretRef: String?


    public init(accountNo: String? = nil, certificateRef: String? = nil, clientRequestNo: String? = nil, countryCode: String? = nil, environment: String? = nil, merchantId: String? = nil, note: String? = nil, providerCode: String? = nil, rotatedAt: String? = nil, secretRef: String? = nil, settlementCurrency: String? = nil, status: String? = nil, webhookSecretRef: String? = nil) {
        self.accountNo = accountNo
        self.certificateRef = certificateRef
        self.clientRequestNo = clientRequestNo
        self.countryCode = countryCode
        self.environment = environment
        self.merchantId = merchantId
        self.note = note
        self.providerCode = providerCode
        self.rotatedAt = rotatedAt
        self.secretRef = secretRef
        self.settlementCurrency = settlementCurrency
        self.status = status
        self.webhookSecretRef = webhookSecretRef
    }
}

public struct CommercePaymentProviderAccountMutationResponse: Codable {
    public let item: CommercePaymentProviderAccountItem?


    public init(item: CommercePaymentProviderAccountItem? = nil) {
        self.item = item
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

public struct CommercePaymentProviderItem: Codable {
    public let capabilities: [String]?
    public let createdAt: String?
    public let displayName: String?
    public let id: String?
    public let providerCode: String?
    public let providerType: String?
    public let settlementType: String?
    public let status: String?
    public let supportedCountries: [String]?
    public let supportedCurrencies: [String]?
    public let updatedAt: String?


    public init(capabilities: [String]? = nil, createdAt: String? = nil, displayName: String? = nil, id: String? = nil, providerCode: String? = nil, providerType: String? = nil, settlementType: String? = nil, status: String? = nil, supportedCountries: [String]? = nil, supportedCurrencies: [String]? = nil, updatedAt: String? = nil) {
        self.capabilities = capabilities
        self.createdAt = createdAt
        self.displayName = displayName
        self.id = id
        self.providerCode = providerCode
        self.providerType = providerType
        self.settlementType = settlementType
        self.status = status
        self.supportedCountries = supportedCountries
        self.supportedCurrencies = supportedCurrencies
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentProviderListResponse: Codable {
    public let items: [CommercePaymentProviderItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommercePaymentProviderItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
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

public struct CommercePaymentReconciliationRunItem: Codable {
    public let businessDate: String?
    public let createdAt: String?
    public let finishedAt: String?
    public let id: String?
    public let providerCode: String?
    public let runNo: String?
    public let status: String?


    public init(businessDate: String? = nil, createdAt: String? = nil, finishedAt: String? = nil, id: String? = nil, providerCode: String? = nil, runNo: String? = nil, status: String? = nil) {
        self.businessDate = businessDate
        self.createdAt = createdAt
        self.finishedAt = finishedAt
        self.id = id
        self.providerCode = providerCode
        self.runNo = runNo
        self.status = status
    }
}

public struct CommercePaymentReconciliationRunListResponse: Codable {
    public let items: [CommercePaymentReconciliationRunItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommercePaymentReconciliationRunItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
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

public struct CommercePaymentRouteRuleItem: Codable {
    public let channelId: String?
    public let countryCode: String?
    public let createdAt: String?
    public let currencyCode: String?
    public let fallbackChannelId: String?
    public let fallbackEnabled: Bool?
    public let id: String?
    public let methodCode: String?
    public let priority: Int?
    public let ruleNo: String?
    public let sceneCode: String?
    public let status: String?
    public let updatedAt: String?


    public init(channelId: String? = nil, countryCode: String? = nil, createdAt: String? = nil, currencyCode: String? = nil, fallbackChannelId: String? = nil, fallbackEnabled: Bool? = nil, id: String? = nil, methodCode: String? = nil, priority: Int? = nil, ruleNo: String? = nil, sceneCode: String? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.channelId = channelId
        self.countryCode = countryCode
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.fallbackChannelId = fallbackChannelId
        self.fallbackEnabled = fallbackEnabled
        self.id = id
        self.methodCode = methodCode
        self.priority = priority
        self.ruleNo = ruleNo
        self.sceneCode = sceneCode
        self.status = status
        self.updatedAt = updatedAt
    }
}

public struct CommercePaymentRouteRuleListResponse: Codable {
    public let items: [CommercePaymentRouteRuleItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommercePaymentRouteRuleItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
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

public struct CommercePaymentWebhookEventItem: Codable {
    public let eventNo: String?
    public let eventType: String?
    public let externalEventId: String?
    public let id: String?
    public let processStatus: String?
    public let processedAt: String?
    public let providerCode: String?
    public let receivedAt: String?


    public init(eventNo: String? = nil, eventType: String? = nil, externalEventId: String? = nil, id: String? = nil, processStatus: String? = nil, processedAt: String? = nil, providerCode: String? = nil, receivedAt: String? = nil) {
        self.eventNo = eventNo
        self.eventType = eventType
        self.externalEventId = externalEventId
        self.id = id
        self.processStatus = processStatus
        self.processedAt = processedAt
        self.providerCode = providerCode
        self.receivedAt = receivedAt
    }
}

public struct CommercePaymentWebhookEventListResponse: Codable {
    public let items: [CommercePaymentWebhookEventItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommercePaymentWebhookEventItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
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

public struct CommercePriceListItem: Codable {
    public let createdAt: String?
    public let currencyCode: String?
    public let customerSegment: String?
    public let endsAt: String?
    public let id: String?
    public let marketCode: String?
    public let priceListNo: String?
    public let startsAt: String?
    public let status: String?
    public let updatedAt: String?


    public init(createdAt: String? = nil, currencyCode: String? = nil, customerSegment: String? = nil, endsAt: String? = nil, id: String? = nil, marketCode: String? = nil, priceListNo: String? = nil, startsAt: String? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.createdAt = createdAt
        self.currencyCode = currencyCode
        self.customerSegment = customerSegment
        self.endsAt = endsAt
        self.id = id
        self.marketCode = marketCode
        self.priceListNo = priceListNo
        self.startsAt = startsAt
        self.status = status
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

public struct CommercePriceListMutationRequest: Codable {
    public let currencyCode: String?
    public let customerSegment: String?
    public let endsAt: String?
    public let marketCode: String?
    public let priceListNo: String?
    public let startsAt: String?
    public let status: String?


    public init(currencyCode: String? = nil, customerSegment: String? = nil, endsAt: String? = nil, marketCode: String? = nil, priceListNo: String? = nil, startsAt: String? = nil, status: String? = nil) {
        self.currencyCode = currencyCode
        self.customerSegment = customerSegment
        self.endsAt = endsAt
        self.marketCode = marketCode
        self.priceListNo = priceListNo
        self.startsAt = startsAt
        self.status = status
    }
}

public struct CommercePriceListMutationResponse: Codable {
    public let item: CommercePriceListItem?


    public init(item: CommercePriceListItem? = nil) {
        self.item = item
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

public struct CommercePriceListResponse: Codable {
    public let items: [CommercePriceListItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommercePriceListItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct CommerceProductAttributeItem: Codable {
    public let attributeNo: String?
    public let filterable: Bool?
    public let id: String?
    public let name: String?
    public let required_: Bool?
    public let scope: String?
    public let searchable: Bool?
    public let status: String?
    public let valueType: String?


    public init(attributeNo: String? = nil, filterable: Bool? = nil, id: String? = nil, name: String? = nil, required_: Bool? = nil, scope: String? = nil, searchable: Bool? = nil, status: String? = nil, valueType: String? = nil) {
        self.attributeNo = attributeNo
        self.filterable = filterable
        self.id = id
        self.name = name
        self.required_ = required_
        self.scope = scope
        self.searchable = searchable
        self.status = status
        self.valueType = valueType
    }
}

public struct CommerceProductAttributeListResponse: Codable {
    public let items: [CommerceProductAttributeItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommerceProductAttributeItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct CommerceProductAttributeMutationRequest: Codable {
    public let attributeNo: String?
    public let filterable: Bool?
    public let name: String?
    public let required_: Bool?
    public let scope: String?
    public let searchable: Bool?
    public let status: String?
    public let valueType: String?


    public init(attributeNo: String? = nil, filterable: Bool? = nil, name: String? = nil, required_: Bool? = nil, scope: String? = nil, searchable: Bool? = nil, status: String? = nil, valueType: String? = nil) {
        self.attributeNo = attributeNo
        self.filterable = filterable
        self.name = name
        self.required_ = required_
        self.scope = scope
        self.searchable = searchable
        self.status = status
        self.valueType = valueType
    }
}

public struct CommerceProductAttributeMutationResponse: Codable {
    public let item: CommerceProductAttributeItem?


    public init(item: CommerceProductAttributeItem? = nil) {
        self.item = item
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

public struct CommerceProductCategoryMutationRequest: Codable {
    public let categoryNo: String?
    public let name: String?
    public let parentId: String?
    public let sortOrder: Int?
    public let status: String?


    public init(categoryNo: String? = nil, name: String? = nil, parentId: String? = nil, sortOrder: Int? = nil, status: String? = nil) {
        self.categoryNo = categoryNo
        self.name = name
        self.parentId = parentId
        self.sortOrder = sortOrder
        self.status = status
    }
}

public struct CommerceProductCategoryMutationResponse: Codable {
    public let item: CommerceProductCategoryItem?


    public init(item: CommerceProductCategoryItem? = nil) {
        self.item = item
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

public struct CommerceProductSkuListResponse: Codable {
    public let items: [CommerceProductSkuItem]?
    public let page: Int?
    public let pageSize: Int?
    public let total: Int?


    public init(items: [CommerceProductSkuItem]? = nil, page: Int? = nil, pageSize: Int? = nil, total: Int? = nil) {
        self.items = items
        self.page = page
        self.pageSize = pageSize
        self.total = total
    }
}

public struct CommerceProductSkuMutationRequest: Codable {
    public let attributes: [CommerceProductSkuAttributeItem]?
    public let defaultCurrencyCode: String?
    public let defaultPriceAmount: String?
    public let fulfillmentType: String?
    public let productId: String?
    public let salesUnit: String?
    public let skuNo: String?
    public let status: String?
    public let taxCategory: String?
    public let title: String?


    public init(attributes: [CommerceProductSkuAttributeItem]? = nil, defaultCurrencyCode: String? = nil, defaultPriceAmount: String? = nil, fulfillmentType: String? = nil, productId: String? = nil, salesUnit: String? = nil, skuNo: String? = nil, status: String? = nil, taxCategory: String? = nil, title: String? = nil) {
        self.attributes = attributes
        self.defaultCurrencyCode = defaultCurrencyCode
        self.defaultPriceAmount = defaultPriceAmount
        self.fulfillmentType = fulfillmentType
        self.productId = productId
        self.salesUnit = salesUnit
        self.skuNo = skuNo
        self.status = status
        self.taxCategory = taxCategory
        self.title = title
    }
}

public struct CommerceProductSkuMutationResponse: Codable {
    public let item: CommerceProductSkuItem?


    public init(item: CommerceProductSkuItem? = nil) {
        self.item = item
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

public struct CommerceProductSpuMutationRequest: Codable {
    public let brand: String?
    public let categoryId: String?
    public let description: String?
    public let productType: String?
    public let spuNo: String?
    public let status: String?
    public let subtitle: String?
    public let title: String?


    public init(brand: String? = nil, categoryId: String? = nil, description: String? = nil, productType: String? = nil, spuNo: String? = nil, status: String? = nil, subtitle: String? = nil, title: String? = nil) {
        self.brand = brand
        self.categoryId = categoryId
        self.description = description
        self.productType = productType
        self.spuNo = spuNo
        self.status = status
        self.subtitle = subtitle
        self.title = title
    }
}

public struct CommerceProductSpuMutationResponse: Codable {
    public let item: CommerceProductSpuItem?


    public init(item: CommerceProductSpuItem? = nil) {
        self.item = item
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

public struct CommerceRechargePackageMutationRequest: Codable {
    public let bonus: Int?
    public let rmb: String?
    public let status: String?


    public init(bonus: Int? = nil, rmb: String? = nil, status: String? = nil) {
        self.bonus = bonus
        self.rmb = rmb
        self.status = status
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

public struct CommerceReportsOrderRevenueListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommerceReportsPaymentReconciliationRetrieveResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CommerceReportsRefundsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
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

public struct CouponsCampaignsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CouponsCodesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CouponsRedemptionsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct CouponsTemplatesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct DashboardAdminOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: AdminDashboardDataResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDashboardDataResponse? = nil, msg: String? = nil) {
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

public struct FirewallsRulesCreateResult: Codable {
    public let code: String?
    public let data: AdminFirewallMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminFirewallMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FirewallsRulesDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct FirewallsRulesListResult: Codable {
    public let code: String?
    public let data: AdminFirewallRulesResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminFirewallRulesResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
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

public struct InstallationStatusResponse: Codable {
    public let catalogSource: String?
    public let catalogVersion: String?
    public let changed: Bool?
    public let environment: String?
    public let externalCatalog: Bool?
    public let lastCatalogRefreshStatus: String?
    public let schemaVersion: String?
    public let seedProfile: String?
    public let status: String?


    public init(catalogSource: String? = nil, catalogVersion: String? = nil, changed: Bool? = nil, environment: String? = nil, externalCatalog: Bool? = nil, lastCatalogRefreshStatus: String? = nil, schemaVersion: String? = nil, seedProfile: String? = nil, status: String? = nil) {
        self.catalogSource = catalogSource
        self.catalogVersion = catalogVersion
        self.changed = changed
        self.environment = environment
        self.externalCatalog = externalCatalog
        self.lastCatalogRefreshStatus = lastCatalogRefreshStatus
        self.schemaVersion = schemaVersion
        self.seedProfile = seedProfile
        self.status = status
    }
}

public struct InstallationStatusRetrieveResult: Codable {
    public let code: String?
    public let data: InstallationStatusResponse?
    public let msg: String?


    public init(code: String? = nil, data: InstallationStatusResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
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

public struct InventoryLedgerEntriesListResult: Codable {
    public let code: String?
    public let data: CommerceInventoryLedgerListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceInventoryLedgerListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InventoryReservationsListResult: Codable {
    public let code: String?
    public let data: CommerceInventoryReservationListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceInventoryReservationListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InventoryStocksListResult: Codable {
    public let code: String?
    public let data: CommerceInventoryStockListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceInventoryStockListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct InventoryStocksUpdateResult: Codable {
    public let code: String?
    public let data: CommerceInventoryStockMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceInventoryStockMutationResponse? = nil, msg: String? = nil) {
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

public struct InvoicesTitlesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ManifestsListResult: Codable {
    public let code: String?
    public let data: OpenPlatformManifestListResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformManifestListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MarketingReferralStatsListResult: Codable {
    public let code: String?
    public let data: AdminReferralStatsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminReferralStatsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsEntitlementsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsMembersListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsMembersStatusUpdateResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPackageGroupsCreateResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPackageGroupsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
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

public struct MembershipsPackageGroupsUpdateResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPackagesCreateResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPackagesDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
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

public struct MembershipsPackagesUpdateResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPlansCreateResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MembershipsPlansDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
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

public struct MembershipsPlansUpdateResult: Codable {
    public let code: String?
    public let data: CommerceStandardResourceResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardResourceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
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

public struct ModelRankingRefreshJobHistoryPage: Codable {
    public let items: [ModelRankingRefreshJobItem]?


    public init(items: [ModelRankingRefreshJobItem]? = nil) {
        self.items = items
    }
}

public struct ModelRankingRefreshJobItem: Codable {
    public let durationMs: Int?
    public let endedAt: String?
    public let failureCount: Int?
    public let failureReason: String?
    public let generatedCount: Int?
    public let id: String?
    public let jobName: String?
    public let nextRefreshAt: String?
    public let organizationId: Int?
    public let rankScope: String?
    public let snapshotDate: String?
    public let snapshotPeriod: String?
    public let sourceCount: Int?
    public let startedAt: String?
    public let status: String?
    public let successCount: Int?
    public let tenantId: Int?
    public let windowEnd: String?
    public let windowStart: String?


    public init(durationMs: Int? = nil, endedAt: String? = nil, failureCount: Int? = nil, failureReason: String? = nil, generatedCount: Int? = nil, id: String? = nil, jobName: String? = nil, nextRefreshAt: String? = nil, organizationId: Int? = nil, rankScope: String? = nil, snapshotDate: String? = nil, snapshotPeriod: String? = nil, sourceCount: Int? = nil, startedAt: String? = nil, status: String? = nil, successCount: Int? = nil, tenantId: Int? = nil, windowEnd: String? = nil, windowStart: String? = nil) {
        self.durationMs = durationMs
        self.endedAt = endedAt
        self.failureCount = failureCount
        self.failureReason = failureReason
        self.generatedCount = generatedCount
        self.id = id
        self.jobName = jobName
        self.nextRefreshAt = nextRefreshAt
        self.organizationId = organizationId
        self.rankScope = rankScope
        self.snapshotDate = snapshotDate
        self.snapshotPeriod = snapshotPeriod
        self.sourceCount = sourceCount
        self.startedAt = startedAt
        self.status = status
        self.successCount = successCount
        self.tenantId = tenantId
        self.windowEnd = windowEnd
        self.windowStart = windowStart
    }
}

public struct ModelRankingRefreshLatestJob: Codable {
    public let durationMs: Int?
    public let endedAt: String?
    public let failureCount: Int?
    public let failureReason: String?
    public let generatedCount: Int?
    public let id: String?
    public let jobName: String?
    public let nextRefreshAt: String?
    public let organizationId: Int?
    public let rankScope: String?
    public let snapshotDate: String?
    public let snapshotPeriod: String?
    public let sourceCount: Int?
    public let startedAt: String?
    public let status: String?
    public let successCount: Int?
    public let tenantId: Int?
    public let windowEnd: String?
    public let windowStart: String?


    public init(durationMs: Int? = nil, endedAt: String? = nil, failureCount: Int? = nil, failureReason: String? = nil, generatedCount: Int? = nil, id: String? = nil, jobName: String? = nil, nextRefreshAt: String? = nil, organizationId: Int? = nil, rankScope: String? = nil, snapshotDate: String? = nil, snapshotPeriod: String? = nil, sourceCount: Int? = nil, startedAt: String? = nil, status: String? = nil, successCount: Int? = nil, tenantId: Int? = nil, windowEnd: String? = nil, windowStart: String? = nil) {
        self.durationMs = durationMs
        self.endedAt = endedAt
        self.failureCount = failureCount
        self.failureReason = failureReason
        self.generatedCount = generatedCount
        self.id = id
        self.jobName = jobName
        self.nextRefreshAt = nextRefreshAt
        self.organizationId = organizationId
        self.rankScope = rankScope
        self.snapshotDate = snapshotDate
        self.snapshotPeriod = snapshotPeriod
        self.sourceCount = sourceCount
        self.startedAt = startedAt
        self.status = status
        self.successCount = successCount
        self.tenantId = tenantId
        self.windowEnd = windowEnd
        self.windowStart = windowStart
    }
}

public struct ModelRankingRefreshStatus: Codable {
    public let cacheMaxAgeSeconds: Int?
    public let generatedAt: String?
    public let generatedCount: Int?
    public let latestJob: ModelRankingRefreshLatestJob?
    public let nextRefreshAt: String?
    public let organizationId: Int?
    public let rankScope: String?
    public let refreshIntervalSeconds: Int?
    public let snapshotDate: String?
    public let snapshotPeriod: String?
    public let sourceCount: Int?
    public let sourceTables: [String]?
    public let status: String?
    public let tenantId: Int?
    public let windowEnd: String?
    public let windowStart: String?


    public init(cacheMaxAgeSeconds: Int? = nil, generatedAt: String? = nil, generatedCount: Int? = nil, latestJob: ModelRankingRefreshLatestJob? = nil, nextRefreshAt: String? = nil, organizationId: Int? = nil, rankScope: String? = nil, refreshIntervalSeconds: Int? = nil, snapshotDate: String? = nil, snapshotPeriod: String? = nil, sourceCount: Int? = nil, sourceTables: [String]? = nil, status: String? = nil, tenantId: Int? = nil, windowEnd: String? = nil, windowStart: String? = nil) {
        self.cacheMaxAgeSeconds = cacheMaxAgeSeconds
        self.generatedAt = generatedAt
        self.generatedCount = generatedCount
        self.latestJob = latestJob
        self.nextRefreshAt = nextRefreshAt
        self.organizationId = organizationId
        self.rankScope = rankScope
        self.refreshIntervalSeconds = refreshIntervalSeconds
        self.snapshotDate = snapshotDate
        self.snapshotPeriod = snapshotPeriod
        self.sourceCount = sourceCount
        self.sourceTables = sourceTables
        self.status = status
        self.tenantId = tenantId
        self.windowEnd = windowEnd
        self.windowStart = windowStart
    }
}

public struct ModelRankingRefreshTriggerRequest: Codable {
    public let cacheMaxAgeSeconds: Int?
    public let limit: Int?
    public let lookbackDays: Int?
    public let rankScope: String?
    public let refreshIntervalSeconds: Int?
    public let snapshotPeriod: String?


    public init(cacheMaxAgeSeconds: Int? = nil, limit: Int? = nil, lookbackDays: Int? = nil, rankScope: String? = nil, refreshIntervalSeconds: Int? = nil, snapshotPeriod: String? = nil) {
        self.cacheMaxAgeSeconds = cacheMaxAgeSeconds
        self.limit = limit
        self.lookbackDays = lookbackDays
        self.rankScope = rankScope
        self.refreshIntervalSeconds = refreshIntervalSeconds
        self.snapshotPeriod = snapshotPeriod
    }
}

public struct ModelRankingRefreshTriggerResponse: Codable {
    public let cacheMaxAgeSeconds: Int?
    public let generatedCount: Int?
    public let nextRefreshAt: String?
    public let organizationId: Int?
    public let rankScope: String?
    public let refreshIntervalSeconds: Int?
    public let snapshotDate: String?
    public let snapshotPeriod: String?
    public let sourceCount: Int?
    public let status: String?
    public let tenantId: Int?
    public let triggered: Bool?
    public let windowEnd: String?
    public let windowStart: String?


    public init(cacheMaxAgeSeconds: Int? = nil, generatedCount: Int? = nil, nextRefreshAt: String? = nil, organizationId: Int? = nil, rankScope: String? = nil, refreshIntervalSeconds: Int? = nil, snapshotDate: String? = nil, snapshotPeriod: String? = nil, sourceCount: Int? = nil, status: String? = nil, tenantId: Int? = nil, triggered: Bool? = nil, windowEnd: String? = nil, windowStart: String? = nil) {
        self.cacheMaxAgeSeconds = cacheMaxAgeSeconds
        self.generatedCount = generatedCount
        self.nextRefreshAt = nextRefreshAt
        self.organizationId = organizationId
        self.rankScope = rankScope
        self.refreshIntervalSeconds = refreshIntervalSeconds
        self.snapshotDate = snapshotDate
        self.snapshotPeriod = snapshotPeriod
        self.sourceCount = sourceCount
        self.status = status
        self.tenantId = tenantId
        self.triggered = triggered
        self.windowEnd = windowEnd
        self.windowStart = windowStart
    }
}

public struct ModelRankingsJobsListResult: Codable {
    public let code: String?
    public let data: ModelRankingRefreshJobHistoryPage?
    public let msg: String?


    public init(code: String? = nil, data: ModelRankingRefreshJobHistoryPage? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
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

public struct ModelRankingsRefreshResult: Codable {
    public let code: String?
    public let data: ModelRankingRefreshTriggerResponse?
    public let msg: String?


    public init(code: String? = nil, data: ModelRankingRefreshTriggerResponse? = nil, msg: String? = nil) {
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

public struct ModelRankingsStatusRetrieveResult: Codable {
    public let code: String?
    public let data: ModelRankingRefreshStatus?
    public let msg: String?


    public init(code: String? = nil, data: ModelRankingRefreshStatus? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ModelVendorsCreateResult: Codable {
    public let code: String?
    public let data: AdminModelVendorMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminModelVendorMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ModelVendorsListResult: Codable {
    public let code: String?
    public let data: AdminModelVendorsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminModelVendorsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ModelsCreateResult: Codable {
    public let code: String?
    public let data: AdminAiModelMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAiModelMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ModelsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ModelsListResult: Codable {
    public let code: String?
    public let data: AdminAiModelsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAiModelsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ModelsRefreshResult: Codable {
    public let code: String?
    public let data: AdminModelCatalogSyncResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminModelCatalogSyncResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ModelsUpdateResult: Codable {
    public let code: String?
    public let data: AdminAiModelMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminAiModelMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MonitorAlertsListResult: Codable {
    public let code: String?
    public let data: AdminMonitorAlertsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminMonitorAlertsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MonitorNodesListResult: Codable {
    public let code: String?
    public let data: AdminMonitorNodesResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminMonitorNodesResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct MonitorPerformanceListResult: Codable {
    public let code: String?
    public let data: AdminMonitorPerformanceResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminMonitorPerformanceResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct NoData: Codable {

    public init() {}
}

public struct OpenPlatformAccountCreateRequest: Codable {
    public let aesKeyRef: String?
    public let appId: String?
    public let key: String?
    public let name: String?
    public let provider: String?
    public let secretRef: String?
    public let tokenRef: String?
    public let type: String?


    public init(aesKeyRef: String? = nil, appId: String? = nil, key: String? = nil, name: String? = nil, provider: String? = nil, secretRef: String? = nil, tokenRef: String? = nil, type: String? = nil) {
        self.aesKeyRef = aesKeyRef
        self.appId = appId
        self.key = key
        self.name = name
        self.provider = provider
        self.secretRef = secretRef
        self.tokenRef = tokenRef
        self.type = type
    }
}

public struct OpenPlatformAccountItem: Codable {
    public let aesKeyRef: String?
    public let appId: String?
    public let createdAt: String?
    public let defaultEntryId: String?
    public let id: String?
    public let key: String?
    public let name: String?
    public let provider: String?
    public let qrDefault: Bool?
    public let secretRef: String?
    public let status: String?
    public let tokenRef: String?
    public let type: String?
    public let updatedAt: String?


    public init(aesKeyRef: String? = nil, appId: String? = nil, createdAt: String? = nil, defaultEntryId: String? = nil, id: String? = nil, key: String? = nil, name: String? = nil, provider: String? = nil, qrDefault: Bool? = nil, secretRef: String? = nil, status: String? = nil, tokenRef: String? = nil, type: String? = nil, updatedAt: String? = nil) {
        self.aesKeyRef = aesKeyRef
        self.appId = appId
        self.createdAt = createdAt
        self.defaultEntryId = defaultEntryId
        self.id = id
        self.key = key
        self.name = name
        self.provider = provider
        self.qrDefault = qrDefault
        self.secretRef = secretRef
        self.status = status
        self.tokenRef = tokenRef
        self.type = type
        self.updatedAt = updatedAt
    }
}

public struct OpenPlatformAccountListResponse: Codable {
    public let items: [OpenPlatformAccountItem]?


    public init(items: [OpenPlatformAccountItem]? = nil) {
        self.items = items
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

public struct OpenPlatformAccountResponse: Codable {
    public let item: OpenPlatformAccountItem?


    public init(item: OpenPlatformAccountItem? = nil) {
        self.item = item
    }
}

public struct OpenPlatformAccountUpdateRequest: Codable {
    public let aesKeyRef: String?
    public let appId: String?
    public let defaultEntryId: String?
    public let name: String?
    public let qrDefault: Bool?
    public let secretRef: String?
    public let status: String?
    public let tokenRef: String?


    public init(aesKeyRef: String? = nil, appId: String? = nil, defaultEntryId: String? = nil, name: String? = nil, qrDefault: Bool? = nil, secretRef: String? = nil, status: String? = nil, tokenRef: String? = nil) {
        self.aesKeyRef = aesKeyRef
        self.appId = appId
        self.defaultEntryId = defaultEntryId
        self.name = name
        self.qrDefault = qrDefault
        self.secretRef = secretRef
        self.status = status
        self.tokenRef = tokenRef
    }
}

public struct OpenPlatformEntryCreateRequest: Codable {
    public let key: String?
    public let type: String?
    public let url: String?


    public init(key: String? = nil, type: String? = nil, url: String? = nil) {
        self.key = key
        self.type = type
        self.url = url
    }
}

public struct OpenPlatformEntryItem: Codable {
    public let accountId: String?
    public let createdAt: String?
    public let id: String?
    public let key: String?
    public let status: String?
    public let type: String?
    public let updatedAt: String?
    public let url: String?


    public init(accountId: String? = nil, createdAt: String? = nil, id: String? = nil, key: String? = nil, status: String? = nil, type: String? = nil, updatedAt: String? = nil, url: String? = nil) {
        self.accountId = accountId
        self.createdAt = createdAt
        self.id = id
        self.key = key
        self.status = status
        self.type = type
        self.updatedAt = updatedAt
        self.url = url
    }
}

public struct OpenPlatformEntryListResponse: Codable {
    public let items: [OpenPlatformEntryItem]?


    public init(items: [OpenPlatformEntryItem]? = nil) {
        self.items = items
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

public struct OpenPlatformEntryResponse: Codable {
    public let item: OpenPlatformEntryItem?


    public init(item: OpenPlatformEntryItem? = nil) {
        self.item = item
    }
}

public struct OpenPlatformEntryUpdateRequest: Codable {
    public let key: String?
    public let status: String?
    public let type: String?
    public let url: String?


    public init(key: String? = nil, status: String? = nil, type: String? = nil, url: String? = nil) {
        self.key = key
        self.status = status
        self.type = type
        self.url = url
    }
}

public struct OpenPlatformManifestItem: Codable {
    public let id: String?
    public let key: String?
    public let provider: String?
    public let status: String?
    public let type: String?
    public let version: String?


    public init(id: String? = nil, key: String? = nil, provider: String? = nil, status: String? = nil, type: String? = nil, version: String? = nil) {
        self.id = id
        self.key = key
        self.provider = provider
        self.status = status
        self.type = type
        self.version = version
    }
}

public struct OpenPlatformManifestListResponse: Codable {
    public let items: [OpenPlatformManifestItem]?


    public init(items: [OpenPlatformManifestItem]? = nil) {
        self.items = items
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

public struct OpenPlatformPayBindingCreateRequest: Codable {
    public let mode: String?
    public let paymentAccountId: String?
    public let paymentChannelId: String?
    public let scene: String?


    public init(mode: String? = nil, paymentAccountId: String? = nil, paymentChannelId: String? = nil, scene: String? = nil) {
        self.mode = mode
        self.paymentAccountId = paymentAccountId
        self.paymentChannelId = paymentChannelId
        self.scene = scene
    }
}

public struct OpenPlatformPayBindingItem: Codable {
    public let accountId: String?
    public let createdAt: String?
    public let id: String?
    public let mode: String?
    public let paymentAccountId: String?
    public let paymentChannelId: String?
    public let scene: String?
    public let status: String?
    public let updatedAt: String?


    public init(accountId: String? = nil, createdAt: String? = nil, id: String? = nil, mode: String? = nil, paymentAccountId: String? = nil, paymentChannelId: String? = nil, scene: String? = nil, status: String? = nil, updatedAt: String? = nil) {
        self.accountId = accountId
        self.createdAt = createdAt
        self.id = id
        self.mode = mode
        self.paymentAccountId = paymentAccountId
        self.paymentChannelId = paymentChannelId
        self.scene = scene
        self.status = status
        self.updatedAt = updatedAt
    }
}

public struct OpenPlatformPayBindingListResponse: Codable {
    public let items: [OpenPlatformPayBindingItem]?


    public init(items: [OpenPlatformPayBindingItem]? = nil) {
        self.items = items
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

public struct OpenPlatformPayBindingResponse: Codable {
    public let item: OpenPlatformPayBindingItem?


    public init(item: OpenPlatformPayBindingItem? = nil) {
        self.item = item
    }
}

public struct OpenPlatformProviderItem: Codable {
    public let id: String?
    public let name: String?
    public let provider: String?
    public let status: String?


    public init(id: String? = nil, name: String? = nil, provider: String? = nil, status: String? = nil) {
        self.id = id
        self.name = name
        self.provider = provider
        self.status = status
    }
}

public struct OpenPlatformProviderListResponse: Codable {
    public let items: [OpenPlatformProviderItem]?


    public init(items: [OpenPlatformProviderItem]? = nil) {
        self.items = items
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

public struct PaymentsAttemptsListResult: Codable {
    public let code: String?
    public let data: CommercePaymentAttemptListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentAttemptListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsChannelsListResult: Codable {
    public let code: String?
    public let data: CommercePaymentChannelListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentChannelListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsIntentsListResult: Codable {
    public let code: String?
    public let data: CommercePaymentIntentListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentIntentListResponse? = nil, msg: String? = nil) {
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

public struct PaymentsProviderAccountsCreateResult: Codable {
    public let code: String?
    public let data: CommercePaymentProviderAccountMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentProviderAccountMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsProviderAccountsListResult: Codable {
    public let code: String?
    public let data: CommercePaymentProviderAccountListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentProviderAccountListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsProvidersListResult: Codable {
    public let code: String?
    public let data: CommercePaymentProviderListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentProviderListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsReconciliationRunsListResult: Codable {
    public let code: String?
    public let data: CommercePaymentReconciliationRunListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentReconciliationRunListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsRouteRulesListResult: Codable {
    public let code: String?
    public let data: CommercePaymentRouteRuleListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentRouteRuleListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct PaymentsWebhookEventsListResult: Codable {
    public let code: String?
    public let data: CommercePaymentWebhookEventListResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommercePaymentWebhookEventListResponse? = nil, msg: String? = nil) {
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

public struct ProviderCircuitBreakerPolicy: Codable {
    public let failureThreshold: Int?


    public init(failureThreshold: Int? = nil) {
        self.failureThreshold = failureThreshold
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

public struct ProviderSecretsCreateResult: Codable {
    public let code: String?
    public let data: AdminProviderSecretMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminProviderSecretMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ProviderSecretsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ProviderSecretsListResult: Codable {
    public let code: String?
    public let data: AdminProviderSecretsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminProviderSecretsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ProviderSecretsUpdateResult: Codable {
    public let code: String?
    public let data: AdminProviderSecretMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminProviderSecretMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ProvidersListResult: Codable {
    public let code: String?
    public let data: OpenPlatformProviderListResponse?
    public let msg: String?


    public init(code: String? = nil, data: OpenPlatformProviderListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RateLimitsApiKeysCreateResult: Codable {
    public let code: String?
    public let data: AdminRateLimitMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminRateLimitMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RateLimitsApiKeysListResult: Codable {
    public let code: String?
    public let data: AdminTokenLimitsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminTokenLimitsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RateLimitsIpCreateResult: Codable {
    public let code: String?
    public let data: AdminRateLimitMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminRateLimitMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RateLimitsIpListResult: Codable {
    public let code: String?
    public let data: AdminIpLimitsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminIpLimitsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RateLimitsModelsCreateResult: Codable {
    public let code: String?
    public let data: AdminRateLimitMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminRateLimitMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RateLimitsModelsListResult: Codable {
    public let code: String?
    public let data: AdminModelLimitsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminModelLimitsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RechargesOrdersListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RechargesPackagesCreateResult: Codable {
    public let code: String?
    public let data: AdminRechargePackageMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminRechargePackageMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RechargesPackagesDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, msg: String? = nil) {
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

public struct RechargesPackagesUpdateResult: Codable {
    public let code: String?
    public let data: AdminRechargePackageMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminRechargePackageMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct RecordsListResult: Codable {
    public let code: String?
    public let data: AdminRecordLogsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminRecordLogsResponse? = nil, msg: String? = nil) {
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

public struct ShipmentsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct ShipmentsTrackingEventsListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SiteSettingsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminSiteSettingsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSiteSettingsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SiteSettingsUpdateResult: Codable {
    public let code: String?
    public let data: AdminSiteSettingsResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSiteSettingsResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsArtifactsCreateResult: Codable {
    public let code: String?
    public let data: AdminSkillArtifactMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillArtifactMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsArtifactsDeleteResult: Codable {
    public let code: String?
    public let data: AdminSkillArtifactDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillArtifactDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsArtifactsListResult: Codable {
    public let code: String?
    public let data: AdminSkillArtifactListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillArtifactListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsArtifactsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminSkillArtifactMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillArtifactMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsArtifactsUpdateResult: Codable {
    public let code: String?
    public let data: AdminSkillArtifactMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillArtifactMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsAssetsCreateResult: Codable {
    public let code: String?
    public let data: AdminSkillAssetMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillAssetMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsAssetsDeleteResult: Codable {
    public let code: String?
    public let data: AdminSkillAssetDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillAssetDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsAssetsListResult: Codable {
    public let code: String?
    public let data: AdminSkillAssetListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillAssetListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsAssetsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminSkillAssetMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillAssetMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsAssetsUpdateResult: Codable {
    public let code: String?
    public let data: AdminSkillAssetMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillAssetMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsCategoriesCreateResult: Codable {
    public let code: String?
    public let data: AdminSkillCategoryMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillCategoryMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsCategoriesDeleteResult: Codable {
    public let code: String?
    public let data: AdminSkillCategoryDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillCategoryDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsCategoriesListResult: Codable {
    public let code: String?
    public let data: AdminSkillCategoryListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillCategoryListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsCategoriesUpdateResult: Codable {
    public let code: String?
    public let data: AdminSkillCategoryMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillCategoryMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsCreateResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsDeleteResult: Codable {
    public let code: String?
    public let data: AdminSkillDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsDisableResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsEnableResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsListResult: Codable {
    public let code: String?
    public let data: AdminSkillListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsPackageCreateResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsPackageDeleteResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageDeleteResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageDeleteResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsPackageDisableResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsPackageEnableResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsPackageListResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageListResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageListResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsPackageRetrieveResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsPackageUpdateResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsPublishResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsReviewApproveResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsReviewRejectResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsUnpublishResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct SkillsUpdateResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
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

public struct UsersCreateResult: Codable {
    public let code: String?
    public let data: AdminUserMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminUserMutationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct UsersListResult: Codable {
    public let code: String?
    public let data: AdminUsersResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminUsersResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct UsersUpdateResult: Codable {
    public let code: String?
    public let data: AdminUserMutationResponse?
    public let msg: String?


    public init(code: String? = nil, data: AdminUserMutationResponse? = nil, msg: String? = nil) {
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

public struct WalletAdjustmentsCreateResult: Codable {
    public let code: String?
    public let data: CommerceOperationResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceOperationResponse? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.msg = msg
    }
}

public struct WalletExchangeRulesListResult: Codable {
    public let code: String?
    public let data: CommerceStandardCollectionResponse?
    public let msg: String?


    public init(code: String? = nil, data: CommerceStandardCollectionResponse? = nil, msg: String? = nil) {
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
