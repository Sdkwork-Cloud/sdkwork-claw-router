import Foundation
import SDKworkCommon

public class SdkworkBackendClient {
    private let httpClient: HttpClient
    public let agents: AgentsApi
    public let ai: AiApi
    public let billing: BillingApi
    public let content: ContentApi
    public let ecosystem: EcosystemApi
    public let iam: IamApi
    public let integration: IntegrationApi
    public let platform: PlatformApi
    public let system: SystemApi

    public init(baseURL: String) {
        self.httpClient = HttpClient(baseURL: baseURL)
        self.agents = AgentsApi(client: httpClient)
        self.ai = AiApi(client: httpClient)
        self.billing = BillingApi(client: httpClient)
        self.content = ContentApi(client: httpClient)
        self.ecosystem = EcosystemApi(client: httpClient)
        self.iam = IamApi(client: httpClient)
        self.integration = IntegrationApi(client: httpClient)
        self.platform = PlatformApi(client: httpClient)
        self.system = SystemApi(client: httpClient)
    }

    public init(config: SdkConfig) {
        self.httpClient = HttpClient(config: config)
        self.agents = AgentsApi(client: httpClient)
        self.ai = AiApi(client: httpClient)
        self.billing = BillingApi(client: httpClient)
        self.content = ContentApi(client: httpClient)
        self.ecosystem = EcosystemApi(client: httpClient)
        self.iam = IamApi(client: httpClient)
        self.integration = IntegrationApi(client: httpClient)
        self.platform = PlatformApi(client: httpClient)
        self.system = SystemApi(client: httpClient)
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
