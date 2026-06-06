import Foundation

public class CommerceApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// Recharges Settings Retrieve
    public func rechargesSettingsRetrieve() async throws -> RechargesSettingsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/recharges/settings"), responseType: RechargesSettingsRetrieveResult.self)
    }



}
