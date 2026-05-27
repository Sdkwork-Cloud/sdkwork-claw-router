import Foundation

public class SdkReferenceApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// Generate SDK archive
    public func archivesCreate(body: SdkReferenceArchiveGenerateRequest) async throws -> ArchivesCreateResult? {
        return try await client.post(ApiPaths.appPath("/sdk_reference/archives"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: ArchivesCreateResult.self)
    }

    /// Generate SDK reference documentation
    public func documentationCreate(body: SdkReferenceDocumentationGenerateRequest) async throws -> DocumentationCreateResult? {
        return try await client.post(ApiPaths.appPath("/sdk_reference/documentation"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: DocumentationCreateResult.self)
    }



}
