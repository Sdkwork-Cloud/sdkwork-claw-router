import Foundation
import SDKworkCommon

public class SdkworkBackendClient {
    private let httpClient: HttpClient
    public let agents: AgentsApi
    public let ai: AiApi
    public let commerce: CommerceApi
    public let content: ContentApi
    public let ecosystem: EcosystemApi
    public let iam: IamApi
    public let integration: IntegrationApi
    public let mcp: McpApi
    public let messaging: MessagingApi
    public let openPlatform: OpenPlatformApi
    public let platform: PlatformApi
    public let system: SystemApi
    public let prompts: PromptsApi
    public let serviceProviders: ServiceProvidersApi
    public let sites: SitesApi
    public let storage: StorageApi

    public init(baseURL: String) {
        self.httpClient = HttpClient(baseURL: baseURL)
        self.agents = AgentsApi(client: httpClient)
        self.ai = AiApi(client: httpClient)
        self.commerce = CommerceApi(client: httpClient)
        self.content = ContentApi(client: httpClient)
        self.ecosystem = EcosystemApi(client: httpClient)
        self.iam = IamApi(client: httpClient)
        self.integration = IntegrationApi(client: httpClient)
        self.mcp = McpApi(client: httpClient)
        self.messaging = MessagingApi(client: httpClient)
        self.openPlatform = OpenPlatformApi(client: httpClient)
        self.platform = PlatformApi(client: httpClient)
        self.system = SystemApi(client: httpClient)
        self.prompts = PromptsApi(client: httpClient)
        self.serviceProviders = ServiceProvidersApi(client: httpClient)
        self.sites = SitesApi(client: httpClient)
        self.storage = StorageApi(client: httpClient)
    }

    public init(config: SdkConfig) {
        self.httpClient = HttpClient(config: config)
        self.agents = AgentsApi(client: httpClient)
        self.ai = AiApi(client: httpClient)
        self.commerce = CommerceApi(client: httpClient)
        self.content = ContentApi(client: httpClient)
        self.ecosystem = EcosystemApi(client: httpClient)
        self.iam = IamApi(client: httpClient)
        self.integration = IntegrationApi(client: httpClient)
        self.mcp = McpApi(client: httpClient)
        self.messaging = MessagingApi(client: httpClient)
        self.openPlatform = OpenPlatformApi(client: httpClient)
        self.platform = PlatformApi(client: httpClient)
        self.system = SystemApi(client: httpClient)
        self.prompts = PromptsApi(client: httpClient)
        self.serviceProviders = ServiceProvidersApi(client: httpClient)
        self.sites = SitesApi(client: httpClient)
        self.storage = StorageApi(client: httpClient)
    }

    public func setApiKey(_ apiKey: String) -> SdkworkBackendClient {
        httpClient.setApiKey(apiKey)
        return self
    }

    public func setAuthToken(_ token: String) -> SdkworkBackendClient {
        httpClient.setAuthToken(token)
        return self
    }

    public func setAccessToken(_ token: String) -> SdkworkBackendClient {
        httpClient.setAccessToken(token)
        return self
    }

    public func setHeader(_ key: String, value: String) -> SdkworkBackendClient {
        httpClient.setHeader(key, value: value)
        return self
    }
}
