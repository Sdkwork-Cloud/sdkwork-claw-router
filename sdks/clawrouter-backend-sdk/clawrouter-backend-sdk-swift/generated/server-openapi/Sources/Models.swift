import Foundation

public struct AccessGroupsCreateResult: Codable {
    public let code: String?
    public let data: AdminAccessGroupMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAccessGroupMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccessGroupsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccessGroupsListResult: Codable {
    public let code: String?
    public let data: AdminAccessGroupsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAccessGroupsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AccessGroupsUpdateResult: Codable {
    public let code: String?
    public let data: AdminAccessGroupMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAccessGroupMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
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

public struct AdminAiModelCreateRequest: Codable {
    public let apiFormat: String?
    public let capabilityIntro: String?
    public let contextTokens: String?
    public let description: String?
    public let inputModalities: [String]?
    public let limitations: [String]?
    public let maxOutputTokens: Int?
    public let modalities: [String]?
    public let name: String?
    public let outputModalities: [String]?
    public let priceIn: String?
    public let priceOut: String?
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


    public init(apiFormat: String? = nil, capabilityIntro: String? = nil, contextTokens: String? = nil, description: String? = nil, inputModalities: [String]? = nil, limitations: [String]? = nil, maxOutputTokens: Int? = nil, modalities: [String]? = nil, name: String? = nil, outputModalities: [String]? = nil, priceIn: String? = nil, priceOut: String? = nil, releaseStage: Int? = nil, replacementModel: String? = nil, routingState: Int? = nil, shelfState: Int? = nil, supportedLanguages: [String]? = nil, supportsJsonSchema: Bool? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, trainingDataCutoff: String? = nil, type: String? = nil, useCases: [String]? = nil, vendorId: String? = nil) {
        self.apiFormat = apiFormat
        self.capabilityIntro = capabilityIntro
        self.contextTokens = contextTokens
        self.description = description
        self.inputModalities = inputModalities
        self.limitations = limitations
        self.maxOutputTokens = maxOutputTokens
        self.modalities = modalities
        self.name = name
        self.outputModalities = outputModalities
        self.priceIn = priceIn
        self.priceOut = priceOut
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
    public let calls: String?
    public let capabilityIntro: String?
    public let contextTokens: Int?
    public let description: String?
    public let id: String?
    public let inputModalities: [String]?
    public let limitations: [String]?
    public let maxOutputTokens: Int?
    public let modalities: [String]?
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


    public init(apiFormat: String? = nil, calls: String? = nil, capabilityIntro: String? = nil, contextTokens: Int? = nil, description: String? = nil, id: String? = nil, inputModalities: [String]? = nil, limitations: [String]? = nil, maxOutputTokens: Int? = nil, modalities: [String]? = nil, name: String? = nil, outputModalities: [String]? = nil, priceIn: String? = nil, priceOut: String? = nil, releaseStage: Int? = nil, replacementModel: String? = nil, routingState: Int? = nil, shelfState: Int? = nil, status: String? = nil, supportedLanguages: [String]? = nil, supportsJsonSchema: Bool? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, trainingDataCutoff: String? = nil, type: String? = nil, useCases: [String]? = nil, vendorCode: String? = nil, vendorId: String? = nil) {
        self.apiFormat = apiFormat
        self.calls = calls
        self.capabilityIntro = capabilityIntro
        self.contextTokens = contextTokens
        self.description = description
        self.id = id
        self.inputModalities = inputModalities
        self.limitations = limitations
        self.maxOutputTokens = maxOutputTokens
        self.modalities = modalities
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

public struct AdminAiModelUpdateRequest: Codable {
    public let apiFormat: String?
    public let capabilityIntro: String?
    public let contextTokens: String?
    public let description: String?
    public let inputModalities: [String]?
    public let limitations: [String]?
    public let maxOutputTokens: Int?
    public let modalities: [String]?
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
    public let vendorId: String?


    public init(apiFormat: String? = nil, capabilityIntro: String? = nil, contextTokens: String? = nil, description: String? = nil, inputModalities: [String]? = nil, limitations: [String]? = nil, maxOutputTokens: Int? = nil, modalities: [String]? = nil, name: String? = nil, outputModalities: [String]? = nil, priceIn: String? = nil, priceOut: String? = nil, releaseStage: Int? = nil, replacementModel: String? = nil, routingState: Int? = nil, shelfState: Int? = nil, status: String? = nil, supportedLanguages: [String]? = nil, supportsJsonSchema: Bool? = nil, supportsStreaming: Bool? = nil, supportsTools: Bool? = nil, trainingDataCutoff: String? = nil, type: String? = nil, useCases: [String]? = nil, vendorId: String? = nil) {
        self.apiFormat = apiFormat
        self.capabilityIntro = capabilityIntro
        self.contextTokens = contextTokens
        self.description = description
        self.inputModalities = inputModalities
        self.limitations = limitations
        self.maxOutputTokens = maxOutputTokens
        self.modalities = modalities
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
        self.vendorId = vendorId
    }
}

public struct AdminAiModelsResponse: Codable {
    public let items: [AdminAiModelItem]?


    public init(items: [AdminAiModelItem]? = nil) {
        self.items = items
    }
}

public struct AdminAnnouncementCreateRequest: Codable {
    public let content: String?
    public let status: String?
    public let target: String?
    public let title: String?


    public init(content: String? = nil, status: String? = nil, target: String? = nil, title: String? = nil) {
        self.content = content
        self.status = status
        self.target = target
        self.title = title
    }
}

public struct AdminAnnouncementItem: Codable {
    public let content: String?
    public let date: String?
    public let id: String?
    public let status: String?
    public let target: String?
    public let title: String?


    public init(content: String? = nil, date: String? = nil, id: String? = nil, status: String? = nil, target: String? = nil, title: String? = nil) {
        self.content = content
        self.date = date
        self.id = id
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
    public let status: String?
    public let target: String?
    public let title: String?


    public init(content: String? = nil, status: String? = nil, target: String? = nil, title: String? = nil) {
        self.content = content
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

public struct AdminBillingRecordItem: Codable {
    public let dueDate: String?
    public let id: String?
    public let period: String?
    public let status: String?
    public let totalCost: String?
    public let totalTokens: Int?
    public let userId: String?


    public init(dueDate: String? = nil, id: String? = nil, period: String? = nil, status: String? = nil, totalCost: String? = nil, totalTokens: Int? = nil, userId: String? = nil) {
        self.dueDate = dueDate
        self.id = id
        self.period = period
        self.status = status
        self.totalCost = totalCost
        self.totalTokens = totalTokens
        self.userId = userId
    }
}

public struct AdminBillingRecordsResponse: Codable {
    public let items: [AdminBillingRecordItem]?


    public init(items: [AdminBillingRecordItem]? = nil) {
        self.items = items
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

public struct AdminChannelItem: Codable {
    public let accessType: String?
    public let balance: String?
    public let baseUrl: String?
    public let capabilities: [String]?
    public let errors: Int?
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


    public init(accessType: String? = nil, balance: String? = nil, baseUrl: String? = nil, capabilities: [String]? = nil, errors: Int? = nil, id: String? = nil, isMultimodal: Bool? = nil, models: [String]? = nil, name: String? = nil, protocol_: String? = nil, retryPolicy: ProviderRetryPolicy? = nil, secretRef: String? = nil, status: String? = nil, timeoutMs: Int? = nil, vendor: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.balance = balance
        self.baseUrl = baseUrl
        self.capabilities = capabilities
        self.errors = errors
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
    public let baseUrl: String?
    public let capabilities: [String]?
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


    public init(accessType: String? = nil, baseUrl: String? = nil, capabilities: [String]? = nil, id: String? = nil, models: [String]? = nil, name: String? = nil, protocol_: String? = nil, retryPolicy: ProviderRetryPolicy? = nil, secretRef: String? = nil, status: String? = nil, timeoutMs: Int? = nil, vendor: String? = nil, weight: Int? = nil) {
        self.accessType = accessType
        self.baseUrl = baseUrl
        self.capabilities = capabilities
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

public struct AdminCouponBatchGenerateRequest: Codable {
    public let count: Int?
    public let couponId: Int?
    public let name: String?
    public let prefix_: String?


    public init(count: Int? = nil, couponId: Int? = nil, name: String? = nil, prefix_: String? = nil) {
        self.count = count
        self.couponId = couponId
        self.name = name
        self.prefix_ = prefix_
    }
}

public struct AdminCouponBatchGenerateResponse: Codable {
    public let batch: AdminCouponBatchItem?
    public let codes: [AdminPromoCodeItem]?


    public init(batch: AdminCouponBatchItem? = nil, codes: [AdminPromoCodeItem]? = nil) {
        self.batch = batch
        self.codes = codes
    }
}

public struct AdminCouponBatchItem: Codable {
    public let count: Int?
    public let couponId: String?
    public let createdAt: String?
    public let id: String?
    public let name: String?
    public let prefix_: String?


    public init(count: Int? = nil, couponId: String? = nil, createdAt: String? = nil, id: String? = nil, name: String? = nil, prefix_: String? = nil) {
        self.count = count
        self.couponId = couponId
        self.createdAt = createdAt
        self.id = id
        self.name = name
        self.prefix_ = prefix_
    }
}

public struct AdminCouponBatchesResponse: Codable {
    public let items: [AdminCouponBatchItem]?


    public init(items: [AdminCouponBatchItem]? = nil) {
        self.items = items
    }
}

public struct AdminCouponCreateRequest: Codable {
    public let name: String?
    public let status: String?
    public let type: String?
    public let value: String?


    public init(name: String? = nil, status: String? = nil, type: String? = nil, value: String? = nil) {
        self.name = name
        self.status = status
        self.type = type
        self.value = value
    }
}

public struct AdminCouponItem: Codable {
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

public struct AdminCouponMutationResponse: Codable {
    public let item: AdminCouponItem?


    public init(item: AdminCouponItem? = nil) {
        self.item = item
    }
}

public struct AdminCouponsResponse: Codable {
    public let items: [AdminCouponItem]?


    public init(items: [AdminCouponItem]? = nil) {
        self.items = items
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

public struct AdminPromoCodeItem: Codable {
    public let batchId: String?
    public let code: String?
    public let id: String?
    public let status: String?
    public let usedAt: String?
    public let usedBy: String?


    public init(batchId: String? = nil, code: String? = nil, id: String? = nil, status: String? = nil, usedAt: String? = nil, usedBy: String? = nil) {
        self.batchId = batchId
        self.code = code
        self.id = id
        self.status = status
        self.usedAt = usedAt
        self.usedBy = usedBy
    }
}

public struct AdminPromoCodeStatusUpdateRequest: Codable {
    public let status: String?


    public init(status: String? = nil) {
        self.status = status
    }
}

public struct AdminPromoCodeStatusUpdateResponse: Codable {
    public let updated: Bool?


    public init(updated: Bool? = nil) {
        self.updated = updated
    }
}

public struct AdminPromoCodesResponse: Codable {
    public let items: [AdminPromoCodeItem]?


    public init(items: [AdminPromoCodeItem]? = nil) {
        self.items = items
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

public struct AdminRechargeRecordItem: Codable {
    public let amount: String?
    public let id: String?
    public let method: String?
    public let status: String?
    public let time: String?
    public let tradeNo: String?
    public let usdCredited: String?
    public let user: String?
    public let userId: String?


    public init(amount: String? = nil, id: String? = nil, method: String? = nil, status: String? = nil, time: String? = nil, tradeNo: String? = nil, usdCredited: String? = nil, user: String? = nil, userId: String? = nil) {
        self.amount = amount
        self.id = id
        self.method = method
        self.status = status
        self.time = time
        self.tradeNo = tradeNo
        self.usdCredited = usdCredited
        self.user = user
        self.userId = userId
    }
}

public struct AdminRechargeRecordsResponse: Codable {
    public let items: [AdminRechargeRecordItem]?


    public init(items: [AdminRechargeRecordItem]? = nil) {
        self.items = items
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

public struct AdminRedemptionRecordItem: Codable {
    public let amount: String?
    public let code: String?
    public let id: String?
    public let time: String?
    public let user: String?
    public let userId: String?


    public init(amount: String? = nil, code: String? = nil, id: String? = nil, time: String? = nil, user: String? = nil, userId: String? = nil) {
        self.amount = amount
        self.code = code
        self.id = id
        self.time = time
        self.user = user
        self.userId = userId
    }
}

public struct AdminRedemptionRecordsResponse: Codable {
    public let items: [AdminRedemptionRecordItem]?


    public init(items: [AdminRedemptionRecordItem]? = nil) {
        self.items = items
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

public struct AdminTransactionRecordItem: Codable {
    public let amount: String?
    public let balance: String?
    public let description: String?
    public let id: String?
    public let status: String?
    public let time: String?
    public let type: String?
    public let userId: String?


    public init(amount: String? = nil, balance: String? = nil, description: String? = nil, id: String? = nil, status: String? = nil, time: String? = nil, type: String? = nil, userId: String? = nil) {
        self.amount = amount
        self.balance = balance
        self.description = description
        self.id = id
        self.status = status
        self.time = time
        self.type = type
        self.userId = userId
    }
}

public struct AdminTransactionsResponse: Codable {
    public let items: [AdminTransactionRecordItem]?


    public init(items: [AdminTransactionRecordItem]? = nil) {
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

public struct AdminUserBalanceAdjustmentRequest: Codable {
    public let amount: Double?
    public let type: String?


    public init(amount: Double? = nil, type: String? = nil) {
        self.amount = amount
        self.type = type
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

public struct AnnouncementsCreateResult: Codable {
    public let code: String?
    public let data: AdminAnnouncementMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAnnouncementMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AnnouncementsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AnnouncementsListResult: Codable {
    public let code: String?
    public let data: AdminAnnouncementsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAnnouncementsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AnnouncementsUpdateResult: Codable {
    public let code: String?
    public let data: AdminAnnouncementMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAnnouncementMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ApiKeysCreateResult: Codable {
    public let code: String?
    public let data: AdminApiKeyCreateResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminApiKeyCreateResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ApiKeysDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ApiKeysListResult: Codable {
    public let code: String?
    public let data: AdminApiKeysMapResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminApiKeysMapResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsCreateResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsDeleteResult: Codable {
    public let code: String?
    public let data: AdminAppDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsDisableResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsEnableResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsListResult: Codable {
    public let code: String?
    public let data: AdminAppListResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppListResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsPublishResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsUnpublishResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct AppsUpdateResult: Codable {
    public let code: String?
    public let data: AdminAppMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAppMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ChannelsCreateResult: Codable {
    public let code: String?
    public let data: AdminChannelMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminChannelMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ChannelsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ChannelsListResult: Codable {
    public let code: String?
    public let data: AdminChannelsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminChannelsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ChannelsUpdateResult: Codable {
    public let code: String?
    public let data: AdminChannelMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminChannelMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ChannelsVerifyResult: Codable {
    public let code: String?
    public let data: AdminChannelTestResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminChannelTestResponse? = nil, message: String? = nil, msg: String? = nil) {
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

public struct CouponBatchesCreateResult: Codable {
    public let code: String?
    public let data: AdminCouponBatchGenerateResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminCouponBatchGenerateResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponBatchesListResult: Codable {
    public let code: String?
    public let data: AdminCouponBatchesResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminCouponBatchesResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponCodesListResult: Codable {
    public let code: String?
    public let data: AdminPromoCodesResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminPromoCodesResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponCodesStatusUpdateResult: Codable {
    public let code: String?
    public let data: AdminPromoCodeStatusUpdateResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminPromoCodeStatusUpdateResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponsCreateResult: Codable {
    public let code: String?
    public let data: AdminCouponMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminCouponMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct CouponsListResult: Codable {
    public let code: String?
    public let data: AdminCouponsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminCouponsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct DashboardAdminOverviewRetrieveResult: Codable {
    public let code: String?
    public let data: AdminDashboardDataResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminDashboardDataResponse? = nil, message: String? = nil, msg: String? = nil) {
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

public struct FinanceAdminLedgerListResult: Codable {
    public let code: String?
    public let data: AdminTransactionsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminTransactionsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FinanceUsageStatementsListResult: Codable {
    public let code: String?
    public let data: AdminBillingRecordsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminBillingRecordsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FirewallsRulesCreateResult: Codable {
    public let code: String?
    public let data: AdminFirewallMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminFirewallMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FirewallsRulesDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct FirewallsRulesListResult: Codable {
    public let code: String?
    public let data: AdminFirewallRulesResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminFirewallRulesResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
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

public struct IamOrganizationMemberRecord: Codable {
    public let id: String?
    public let joinedAt: String?
    public let organizationId: String?
    public let roleCode: String?
    public let status: String?
    public let tenantId: String?
    public let userId: String?


    public init(id: String? = nil, joinedAt: String? = nil, organizationId: String? = nil, roleCode: String? = nil, status: String? = nil, tenantId: String? = nil, userId: String? = nil) {
        self.id = id
        self.joinedAt = joinedAt
        self.organizationId = organizationId
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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: InstallationStatusResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ModelRankingRefreshJobHistoryPage? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
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

public struct ModelRankingsRefreshResult: Codable {
    public let code: String?
    public let data: ModelRankingRefreshTriggerResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ModelRankingRefreshTriggerResponse? = nil, message: String? = nil, msg: String? = nil) {
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

public struct ModelRankingsStatusRetrieveResult: Codable {
    public let code: String?
    public let data: ModelRankingRefreshStatus?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: ModelRankingRefreshStatus? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ModelVendorsCreateResult: Codable {
    public let code: String?
    public let data: AdminModelVendorMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminModelVendorMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ModelVendorsListResult: Codable {
    public let code: String?
    public let data: AdminModelVendorsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminModelVendorsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ModelsCreateResult: Codable {
    public let code: String?
    public let data: AdminAiModelMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAiModelMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ModelsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ModelsListResult: Codable {
    public let code: String?
    public let data: AdminAiModelsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAiModelsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ModelsRefreshResult: Codable {
    public let code: String?
    public let data: AdminModelCatalogSyncResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminModelCatalogSyncResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ModelsUpdateResult: Codable {
    public let code: String?
    public let data: AdminAiModelMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminAiModelMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct MonitorAlertsListResult: Codable {
    public let code: String?
    public let data: AdminMonitorAlertsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminMonitorAlertsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct MonitorNodesListResult: Codable {
    public let code: String?
    public let data: AdminMonitorNodesResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminMonitorNodesResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct MonitorPerformanceListResult: Codable {
    public let code: String?
    public let data: AdminMonitorPerformanceResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminMonitorPerformanceResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct NoData: Codable {

    public init() {}
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

public struct PlusApiKeyRecord: Codable {

    public init() {}
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

public struct PlusOauthAccountRecord: Codable {

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

public struct PlusOrganizationMemberRecord: Codable {

    public init() {}
}

public struct PlusOrganizationRecord: Codable {

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

public struct PlusPermissionRecord: Codable {

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

public struct PlusRolePermissionRecord: Codable {

    public init() {}
}

public struct PlusRoleRecord: Codable {

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

public struct PlusTenantRecord: Codable {

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

public struct PlusUserRecord: Codable {

    public init() {}
}

public struct PlusUserRoleRecord: Codable {

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
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminProviderSecretMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ProviderSecretsDeleteResult: Codable {
    public let code: String?
    public let data: AdminDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ProviderSecretsListResult: Codable {
    public let code: String?
    public let data: AdminProviderSecretsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminProviderSecretsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ProviderSecretsUpdateResult: Codable {
    public let code: String?
    public let data: AdminProviderSecretMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminProviderSecretMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RateLimitsApiKeysCreateResult: Codable {
    public let code: String?
    public let data: AdminRateLimitMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminRateLimitMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RateLimitsApiKeysListResult: Codable {
    public let code: String?
    public let data: AdminTokenLimitsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminTokenLimitsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RateLimitsIpCreateResult: Codable {
    public let code: String?
    public let data: AdminRateLimitMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminRateLimitMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RateLimitsIpListResult: Codable {
    public let code: String?
    public let data: AdminIpLimitsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminIpLimitsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RateLimitsModelsCreateResult: Codable {
    public let code: String?
    public let data: AdminRateLimitMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminRateLimitMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RateLimitsModelsListResult: Codable {
    public let code: String?
    public let data: AdminModelLimitsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminModelLimitsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct RecordsListResult: Codable {
    public let code: String?
    public let data: AdminRecordLogsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminRecordLogsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct ReferralsStatsListResult: Codable {
    public let code: String?
    public let data: AdminReferralStatsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminReferralStatsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsArtifactsCreateResult: Codable {
    public let code: String?
    public let data: AdminSkillArtifactMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillArtifactMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsArtifactsDeleteResult: Codable {
    public let code: String?
    public let data: AdminSkillArtifactDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillArtifactDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsArtifactsListResult: Codable {
    public let code: String?
    public let data: AdminSkillArtifactListResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillArtifactListResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsArtifactsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminSkillArtifactMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillArtifactMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsArtifactsUpdateResult: Codable {
    public let code: String?
    public let data: AdminSkillArtifactMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillArtifactMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsAssetsCreateResult: Codable {
    public let code: String?
    public let data: AdminSkillAssetMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillAssetMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsAssetsDeleteResult: Codable {
    public let code: String?
    public let data: AdminSkillAssetDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillAssetDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsAssetsListResult: Codable {
    public let code: String?
    public let data: AdminSkillAssetListResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillAssetListResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsAssetsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminSkillAssetMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillAssetMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsAssetsUpdateResult: Codable {
    public let code: String?
    public let data: AdminSkillAssetMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillAssetMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsCategoriesCreateResult: Codable {
    public let code: String?
    public let data: AdminSkillCategoryMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillCategoryMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsCategoriesListResult: Codable {
    public let code: String?
    public let data: AdminSkillCategoryListResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillCategoryListResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsCreateResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsDeleteResult: Codable {
    public let code: String?
    public let data: AdminSkillDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsDisableResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsEnableResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsListResult: Codable {
    public let code: String?
    public let data: AdminSkillListResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillListResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsPackageCreateResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsPackageDeleteResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageDeleteResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageDeleteResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsPackageDisableResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsPackageEnableResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsPackageListResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageListResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageListResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsPackageRetrieveResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsPackageUpdateResult: Codable {
    public let code: String?
    public let data: AdminSkillPackageMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillPackageMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsPublishResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsRetrieveResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsReviewApproveResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsReviewRejectResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsUnpublishResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct SkillsUpdateResult: Codable {
    public let code: String?
    public let data: AdminSkillMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminSkillMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
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

public struct UsersBalanceAdjustmentsCreateResult: Codable {
    public let code: String?
    public let data: AdminUserMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminUserMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct UsersCouponsListResult: Codable {
    public let code: String?
    public let data: AdminRedemptionRecordsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminRedemptionRecordsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct UsersCreateResult: Codable {
    public let code: String?
    public let data: AdminUserMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminUserMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct UsersListResult: Codable {
    public let code: String?
    public let data: AdminUsersResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminUsersResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct UsersUpdateResult: Codable {
    public let code: String?
    public let data: AdminUserMutationResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminUserMutationResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}

public struct VipRechargeListResult: Codable {
    public let code: String?
    public let data: AdminRechargeRecordsResponse?
    public let message: String?
    public let msg: String?


    public init(code: String? = nil, data: AdminRechargeRecordsResponse? = nil, message: String? = nil, msg: String? = nil) {
        self.code = code
        self.data = data
        self.message = message
        self.msg = msg
    }
}
