import Foundation

/// API modules for clawrouter-backend-sdk
public struct API {
    public static let agents = AgentsApi.self
    public static let ai = AiApi.self
    public static let commerce = CommerceApi.self
    public static let content = ContentApi.self
    public static let ecosystem = EcosystemApi.self
    public static let iam = IamApi.self
    public static let integration = IntegrationApi.self
    public static let mcp = McpApi.self
    public static let messaging = MessagingApi.self
    public static let openPlatform = OpenPlatformApi.self
    public static let platform = PlatformApi.self
    public static let system = SystemApi.self
    public static let prompts = PromptsApi.self
    public static let serviceProviders = ServiceProvidersApi.self
    public static let storage = StorageApi.self
}
