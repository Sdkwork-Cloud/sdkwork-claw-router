import Foundation
import SDKworkCommon

public class SdkworkAppClient {
    private let httpClient: HttpClient
    public let agents: AgentsApi
    public let ai: AiApi
    public let auth: AuthApi
    public let billing: BillingApi
    public let communication: CommunicationApi
    public let content: ContentApi
    public let ecosystem: EcosystemApi
    public let iam: IamApi
    public let platform: PlatformApi

    public init(baseURL: String) {
        self.httpClient = HttpClient(baseURL: baseURL)
        self.agents = AgentsApi(client: httpClient)
        self.ai = AiApi(client: httpClient)
        self.auth = AuthApi(client: httpClient)
        self.billing = BillingApi(client: httpClient)
        self.communication = CommunicationApi(client: httpClient)
        self.content = ContentApi(client: httpClient)
        self.ecosystem = EcosystemApi(client: httpClient)
        self.iam = IamApi(client: httpClient)
        self.platform = PlatformApi(client: httpClient)
    }

    public init(config: SdkConfig) {
        self.httpClient = HttpClient(config: config)
        self.agents = AgentsApi(client: httpClient)
        self.ai = AiApi(client: httpClient)
        self.auth = AuthApi(client: httpClient)
        self.billing = BillingApi(client: httpClient)
        self.communication = CommunicationApi(client: httpClient)
        self.content = ContentApi(client: httpClient)
        self.ecosystem = EcosystemApi(client: httpClient)
        self.iam = IamApi(client: httpClient)
        self.platform = PlatformApi(client: httpClient)
    }

    public func setApiKey(_ apiKey: String) -> SdkworkAppClient {
        httpClient.setApiKey(apiKey)
        return self
    }

    public func setAuthToken(_ token: String) -> SdkworkAppClient {
        httpClient.setAuthToken(token)
        return self
    }

    public func setAccessToken(_ token: String) -> SdkworkAppClient {
        httpClient.setAccessToken(token)
        return self
    }

    public func setHeader(_ key: String, value: String) -> SdkworkAppClient {
        httpClient.setHeader(key, value: value)
        return self
    }
}
