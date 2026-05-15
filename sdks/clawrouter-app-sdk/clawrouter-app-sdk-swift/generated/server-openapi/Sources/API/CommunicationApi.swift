import Foundation

public class CommunicationApi {
    private let client: HttpClient
    
    public init(client: HttpClient) {
        self.client = client
    }

    /// List messages
    public func notificationsList() async throws -> NotificationsListResult? {
        return try await client.get(ApiPaths.appPath("/communication/notifications"), responseType: NotificationsListResult.self)
    }



}
