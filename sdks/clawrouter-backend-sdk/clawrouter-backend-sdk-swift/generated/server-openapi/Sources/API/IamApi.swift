import Foundation

public class IamApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// List groups
    public func accessGroupsList() async throws -> AccessGroupsListResult? {
        return try await client.get(ApiPaths.backendPath("/iam/access_groups"), responseType: AccessGroupsListResult.self)
    }

    /// Create group
    public func accessGroupsCreate(body: AdminAccessGroupCreateRequest) async throws -> AccessGroupsCreateResult? {
        return try await client.post(ApiPaths.backendPath("/iam/access_groups"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AccessGroupsCreateResult.self)
    }

    /// Delete group
    public func accessGroupsDelete(groupId: String) async throws -> AccessGroupsDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/iam/access_groups/\(serializePathParameter(groupId, PathParameterSpec(name: "groupId", style: "simple", explode: false)))"), responseType: AccessGroupsDeleteResult.self)
    }

    /// Update group
    public func accessGroupsUpdate(groupId: String, body: AdminAccessGroupUpdateRequest) async throws -> AccessGroupsUpdateResult? {
        return try await client.patch(ApiPaths.backendPath("/iam/access_groups/\(serializePathParameter(groupId, PathParameterSpec(name: "groupId", style: "simple", explode: false)))"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AccessGroupsUpdateResult.self)
    }

    /// List group channel bindings
    public func accessGroupsChannelBindingsList(groupId: String) async throws -> AccessGroupsChannelBindingsListResult? {
        return try await client.get(ApiPaths.backendPath("/iam/access_groups/\(serializePathParameter(groupId, PathParameterSpec(name: "groupId", style: "simple", explode: false)))/channel_bindings"), responseType: AccessGroupsChannelBindingsListResult.self)
    }

    /// Replace group channel bindings
    public func accessGroupsChannelBindingsUpdate(groupId: String, body: AdminAccessGroupChannelBindingsReplaceRequest) async throws -> AccessGroupsChannelBindingsUpdateResult? {
        return try await client.put(ApiPaths.backendPath("/iam/access_groups/\(serializePathParameter(groupId, PathParameterSpec(name: "groupId", style: "simple", explode: false)))/channel_bindings"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AccessGroupsChannelBindingsUpdateResult.self)
    }

    /// List API key map
    public func apiKeysList() async throws -> ApiKeysListResult? {
        return try await client.get(ApiPaths.backendPath("/iam/api_keys"), responseType: ApiKeysListResult.self)
    }

    /// Create API key
    public func apiKeysCreate(body: AdminApiKeyCreateRequest, idempotencyKey: String) async throws -> ApiKeysCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/iam/api_keys"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: ApiKeysCreateResult.self)
    }

    /// Delete API key
    public func apiKeysDelete(apiKeyId: String) async throws -> ApiKeysDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/iam/api_keys/\(serializePathParameter(apiKeyId, PathParameterSpec(name: "apiKeyId", style: "simple", explode: false)))"), responseType: ApiKeysDeleteResult.self)
    }

    /// List users
    public func usersList() async throws -> UsersListResult? {
        return try await client.get(ApiPaths.backendPath("/iam/users"), responseType: UsersListResult.self)
    }

    /// Create user
    public func usersCreate(body: AdminUserCreateRequest) async throws -> UsersCreateResult? {
        return try await client.post(ApiPaths.backendPath("/iam/users"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: UsersCreateResult.self)
    }

    /// Update user
    public func usersUpdate(body: AdminUserUpdateRequest) async throws -> UsersUpdateResult? {
        return try await client.put(ApiPaths.backendPath("/iam/users"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: UsersUpdateResult.self)
    }

    private struct PathParameterSpec {
        let name: String
        let style: String
        let explode: Bool
    }

    private func serializePathParameter(_ value: Any?, _ spec: PathParameterSpec) -> String {
        guard let value else { return "" }
        let style = spec.style.isEmpty ? "simple" : spec.style
        if let array = value as? [Any] {
            return serializePathArray(spec.name, array, style, spec.explode)
        }
        if let object = value as? [String: Any] {
            return serializePathObject(spec.name, object, style, spec.explode)
        }
        return pathPrimitivePrefix(spec.name, style) + pathEncode(String(describing: value))
    }

    private func serializePathArray(_ name: String, _ values: [Any], _ style: String, _ explode: Bool) -> String {
        let serialized = values.map { pathEncode(String(describing: $0)) }
        if serialized.isEmpty { return pathPrefix(name, style) }
        if style == "matrix" {
            if explode {
                return serialized.map { ";\(name)=\($0)" }.joined()
            }
            return ";\(name)=" + serialized.joined(separator: ",")
        }
        let separator = explode ? "." : ","
        return pathPrefix(name, style) + serialized.joined(separator: separator)
    }

    private func serializePathObject(_ name: String, _ values: [String: Any], _ style: String, _ explode: Bool) -> String {
        var entries: [String] = []
        var exploded: [String] = []
        for (key, value) in values {
            let escapedKey = pathEncode(key)
            let escapedValue = pathEncode(String(describing: value))
            if explode {
                if style == "matrix" {
                    exploded.append(";\(escapedKey)=\(escapedValue)")
                } else {
                    exploded.append("\(escapedKey)=\(escapedValue)")
                }
            } else {
                entries.append(escapedKey)
                entries.append(escapedValue)
            }
        }
        if style == "matrix" {
            if explode {
                return exploded.joined()
            }
            return ";\(name)=" + entries.joined(separator: ",")
        }
        if explode {
            let separator = style == "label" ? "." : ","
            return pathPrefix(name, style) + exploded.joined(separator: separator)
        }
        return pathPrefix(name, style) + entries.joined(separator: ",")
    }

    private func pathPrefix(_ name: String, _ style: String) -> String {
        if style == "label" { return "." }
        if style == "matrix" { return ";\(name)" }
        return ""
    }

    private func pathPrimitivePrefix(_ name: String, _ style: String) -> String {
        style == "matrix" ? ";\(name)=" : pathPrefix(name, style)
    }

    private func pathEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? value
    }


    private struct HeaderParameterSpec {
        let value: Any?
        let style: String
        let explode: Bool
        let contentType: String?
    }

    private func buildRequestHeaders(_ headers: [String: HeaderParameterSpec], _ cookies: [String: HeaderParameterSpec]) -> [String: String]? {
        var requestHeaders: [String: String] = [:]
        for (name, parameter) in headers {
            if let serialized = serializeParameterValue(parameter) {
                requestHeaders[name] = serialized
            }
        }

        if let cookieHeader = buildCookieHeader(cookies), !cookieHeader.isEmpty {
            requestHeaders["Cookie"] = requestHeaders["Cookie"].map { "\($0); \(cookieHeader)" } ?? cookieHeader
        }

        return requestHeaders.isEmpty ? nil : requestHeaders
    }

    private func buildCookieHeader(_ cookies: [String: HeaderParameterSpec]) -> String? {
        let pairs = cookies.compactMap { name, parameter -> String? in
            guard let serialized = serializeParameterValue(parameter) else { return nil }
            return "\(urlEncode(name))=\(urlEncode(serialized))"
        }
        return pairs.isEmpty ? nil : pairs.joined(separator: "; ")
    }

    private func serializeParameterValue(_ parameter: HeaderParameterSpec?) -> String? {
        guard let parameter, let value = parameter.value else { return nil }
        if let contentType = parameter.contentType, !contentType.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            if JSONSerialization.isValidJSONObject(value),
               let data = try? JSONSerialization.data(withJSONObject: value, options: []),
               let json = String(data: data, encoding: .utf8) {
                return json
            }
            return String(describing: value)
        }
        if let array = value as? [Any?] {
            return array.compactMap { $0.map { String(describing: $0) } }.joined(separator: ",")
        }
        if let object = value as? [String: Any] {
            var values: [String] = []
            for (key, item) in object {
                if parameter.explode {
                    values.append("\(key)=\(item)")
                } else {
                    values.append(key)
                    values.append(String(describing: item))
                }
            }
            return values.joined(separator: ",")
        }
        if let date = value as? Date {
            return ISO8601DateFormatter().string(from: date)
        }
        return String(describing: value)
    }

    private func urlEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? value
    }
}
