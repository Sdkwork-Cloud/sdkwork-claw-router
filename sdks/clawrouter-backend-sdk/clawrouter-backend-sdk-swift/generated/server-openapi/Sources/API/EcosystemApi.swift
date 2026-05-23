import Foundation

public class EcosystemApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// List skills
    public func skillsList(q: String? = nil, marketStatus: String? = nil, reviewStatus: String? = nil, visibility: String? = nil, enabled: Bool? = nil, categoryId: String? = nil, page: Int? = nil, pageSize: Int? = nil) async throws -> SkillsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "market_status", value: marketStatus, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "review_status", value: reviewStatus, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "visibility", value: visibility, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "enabled", value: enabled, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "category_id", value: categoryId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/ecosystem/skills"), query), responseType: SkillsListResult.self)
    }

    /// Create skill
    public func skillsCreate(body: AdminSkillCreateRequest, xRequestId: String? = nil) async throws -> SkillsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsCreateResult.self)
    }

    /// List skill categories
    public func skillsCategoriesList() async throws -> SkillsCategoriesListResult? {
        return try await client.get(ApiPaths.backendPath("/ecosystem/skills/categories"), responseType: SkillsCategoriesListResult.self)
    }

    /// Create skill category
    public func skillsCategoriesCreate(body: AdminSkillCategoryCreateRequest, xRequestId: String? = nil) async throws -> SkillsCategoriesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/categories"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsCategoriesCreateResult.self)
    }

    /// Delete skill category
    public func skillsCategoriesDelete(categoryId: String, xRequestId: String? = nil) async throws -> SkillsCategoriesDeleteResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.delete(ApiPaths.backendPath("/ecosystem/skills/categories/\(serializePathParameter(categoryId, PathParameterSpec(name: "categoryId", style: "simple", explode: false)))"), params: nil, headers: requestHeaders, responseType: SkillsCategoriesDeleteResult.self)
    }

    /// Update skill category
    public func skillsCategoriesUpdate(categoryId: String, body: AdminSkillCategoryUpdateRequest, xRequestId: String? = nil) async throws -> SkillsCategoriesUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/ecosystem/skills/categories/\(serializePathParameter(categoryId, PathParameterSpec(name: "categoryId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsCategoriesUpdateResult.self)
    }

    /// List skill packages
    public func skillsPackageList(q: String? = nil, enabled: Bool? = nil, categoryId: String? = nil, page: Int? = nil, pageSize: Int? = nil) async throws -> SkillsPackageListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "enabled", value: enabled, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "category_id", value: categoryId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/ecosystem/skills/package"), query), responseType: SkillsPackageListResult.self)
    }

    /// Create skill package
    public func skillsPackageCreate(body: AdminSkillPackageCreateRequest, xRequestId: String? = nil) async throws -> SkillsPackageCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/package"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsPackageCreateResult.self)
    }

    /// Delete skill package
    public func skillsPackageDelete(packageId: String) async throws -> SkillsPackageDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/ecosystem/skills/package/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), responseType: SkillsPackageDeleteResult.self)
    }

    /// Get skill package
    public func skillsPackageRetrieve(packageId: String) async throws -> SkillsPackageRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/ecosystem/skills/package/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), responseType: SkillsPackageRetrieveResult.self)
    }

    /// Update skill package
    public func skillsPackageUpdate(packageId: String, body: AdminSkillPackageUpdateRequest, xRequestId: String? = nil) async throws -> SkillsPackageUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/ecosystem/skills/package/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsPackageUpdateResult.self)
    }

    /// Disable skill package
    public func skillsPackageDisable(packageId: String, xRequestId: String? = nil) async throws -> SkillsPackageDisableResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/package/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))/disable"), body: nil, params: nil, headers: requestHeaders, responseType: SkillsPackageDisableResult.self)
    }

    /// Enable skill package
    public func skillsPackageEnable(packageId: String, xRequestId: String? = nil) async throws -> SkillsPackageEnableResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/package/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))/enable"), body: nil, params: nil, headers: requestHeaders, responseType: SkillsPackageEnableResult.self)
    }

    /// Delete skill
    public func skillsDelete(skillId: String) async throws -> SkillsDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))"), responseType: SkillsDeleteResult.self)
    }

    /// Get skill
    public func skillsRetrieve(skillId: String) async throws -> SkillsRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))"), responseType: SkillsRetrieveResult.self)
    }

    /// Update skill
    public func skillsUpdate(skillId: String, body: AdminSkillUpdateRequest, xRequestId: String? = nil) async throws -> SkillsUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsUpdateResult.self)
    }

    /// List skill artifacts
    public func skillsArtifactsList(skillId: String) async throws -> SkillsArtifactsListResult? {
        return try await client.get(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/artifacts"), responseType: SkillsArtifactsListResult.self)
    }

    /// Create skill artifact
    public func skillsArtifactsCreate(skillId: String, body: AdminSkillArtifactCreateRequest, xRequestId: String? = nil) async throws -> SkillsArtifactsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/artifacts"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsArtifactsCreateResult.self)
    }

    /// Delete skill artifact
    public func skillsArtifactsDelete(skillId: String, artifactId: String, xRequestId: String? = nil) async throws -> SkillsArtifactsDeleteResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.delete(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/artifacts/\(serializePathParameter(artifactId, PathParameterSpec(name: "artifactId", style: "simple", explode: false)))"), params: nil, headers: requestHeaders, responseType: SkillsArtifactsDeleteResult.self)
    }

    /// Get skill artifact
    public func skillsArtifactsRetrieve(skillId: String, artifactId: String) async throws -> SkillsArtifactsRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/artifacts/\(serializePathParameter(artifactId, PathParameterSpec(name: "artifactId", style: "simple", explode: false)))"), responseType: SkillsArtifactsRetrieveResult.self)
    }

    /// Update skill artifact
    public func skillsArtifactsUpdate(skillId: String, artifactId: String, body: AdminSkillArtifactUpdateRequest, xRequestId: String? = nil) async throws -> SkillsArtifactsUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/artifacts/\(serializePathParameter(artifactId, PathParameterSpec(name: "artifactId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsArtifactsUpdateResult.self)
    }

    /// List skill assets
    public func skillsAssetsList(skillId: String) async throws -> SkillsAssetsListResult? {
        return try await client.get(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/assets"), responseType: SkillsAssetsListResult.self)
    }

    /// Create skill asset
    public func skillsAssetsCreate(skillId: String, body: AdminSkillAssetCreateRequest, xRequestId: String? = nil) async throws -> SkillsAssetsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/assets"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsAssetsCreateResult.self)
    }

    /// Delete skill asset
    public func skillsAssetsDelete(skillId: String, assetId: String, xRequestId: String? = nil) async throws -> SkillsAssetsDeleteResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.delete(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/assets/\(serializePathParameter(assetId, PathParameterSpec(name: "assetId", style: "simple", explode: false)))"), params: nil, headers: requestHeaders, responseType: SkillsAssetsDeleteResult.self)
    }

    /// Get skill asset
    public func skillsAssetsRetrieve(skillId: String, assetId: String) async throws -> SkillsAssetsRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/assets/\(serializePathParameter(assetId, PathParameterSpec(name: "assetId", style: "simple", explode: false)))"), responseType: SkillsAssetsRetrieveResult.self)
    }

    /// Update skill asset
    public func skillsAssetsUpdate(skillId: String, assetId: String, body: AdminSkillAssetUpdateRequest, xRequestId: String? = nil) async throws -> SkillsAssetsUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/assets/\(serializePathParameter(assetId, PathParameterSpec(name: "assetId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsAssetsUpdateResult.self)
    }

    /// Disable skill
    public func skillsDisable(skillId: String, xRequestId: String? = nil) async throws -> SkillsDisableResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/disable"), body: nil, params: nil, headers: requestHeaders, responseType: SkillsDisableResult.self)
    }

    /// Enable skill
    public func skillsEnable(skillId: String, xRequestId: String? = nil) async throws -> SkillsEnableResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/enable"), body: nil, params: nil, headers: requestHeaders, responseType: SkillsEnableResult.self)
    }

    /// Publish skill
    public func skillsPublish(skillId: String, xRequestId: String? = nil) async throws -> SkillsPublishResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/publish"), body: nil, params: nil, headers: requestHeaders, responseType: SkillsPublishResult.self)
    }

    /// Approve skill
    public func skillsReviewApprove(skillId: String, body: AdminSkillReviewRequest, xRequestId: String? = nil) async throws -> SkillsReviewApproveResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/review/approve"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsReviewApproveResult.self)
    }

    /// Reject skill
    public func skillsReviewReject(skillId: String, body: AdminSkillReviewRequest, xRequestId: String? = nil) async throws -> SkillsReviewRejectResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/review/reject"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SkillsReviewRejectResult.self)
    }

    /// Offline skill
    public func skillsUnpublish(skillId: String, xRequestId: String? = nil) async throws -> SkillsUnpublishResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/ecosystem/skills/\(serializePathParameter(skillId, PathParameterSpec(name: "skillId", style: "simple", explode: false)))/unpublish"), body: nil, params: nil, headers: requestHeaders, responseType: SkillsUnpublishResult.self)
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

    private struct QueryParameterSpec {
        let name: String
        let value: Any?
        let style: String
        let explode: Bool
        let allowReserved: Bool
        let contentType: String?
    }

    private func buildQueryString(_ parameters: [QueryParameterSpec]) -> String {
        var pairs: [String] = []
        for parameter in parameters {
            appendSerializedParameter(&pairs, parameter)
        }
        return pairs.joined(separator: "&")
    }

    private func appendSerializedParameter(_ pairs: inout [String], _ parameter: QueryParameterSpec) {
        guard let value = parameter.value else { return }
        if let contentType = parameter.contentType, !contentType.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            let data = (try? JSONSerialization.data(withJSONObject: value, options: [])) ?? Data(String(describing: value).utf8)
            let json = String(data: data, encoding: .utf8) ?? String(describing: value)
            pairs.append("\(urlEncode(parameter.name))=\(encodeQueryValue(json, allowReserved: parameter.allowReserved))")
            return
        }

        let style = parameter.style.isEmpty ? "form" : parameter.style
        if style == "deepObject", let object = value as? [String: Any] {
            appendDeepObjectParameter(&pairs, name: parameter.name, values: object, allowReserved: parameter.allowReserved)
        } else if let array = value as? [Any] {
            appendArrayParameter(&pairs, name: parameter.name, values: array, style: style, explode: parameter.explode, allowReserved: parameter.allowReserved)
        } else if let object = value as? [String: Any] {
            appendObjectParameter(&pairs, name: parameter.name, values: object, style: style, explode: parameter.explode, allowReserved: parameter.allowReserved)
        } else {
            pairs.append("\(urlEncode(parameter.name))=\(encodeQueryValue(String(describing: value), allowReserved: parameter.allowReserved))")
        }
    }

    private func appendArrayParameter(
        _ pairs: inout [String],
        name: String,
        values: [Any],
        style: String,
        explode: Bool,
        allowReserved: Bool
    ) {
        let serialized = values.map { String(describing: $0) }
        guard !serialized.isEmpty else { return }
        if style == "form" && explode {
            for item in serialized {
                pairs.append("\(urlEncode(name))=\(encodeQueryValue(item, allowReserved: allowReserved))")
            }
            return
        }
        pairs.append("\(urlEncode(name))=\(encodeQueryValue(serialized.joined(separator: ","), allowReserved: allowReserved))")
    }

    private func appendObjectParameter(
        _ pairs: inout [String],
        name: String,
        values: [String: Any],
        style: String,
        explode: Bool,
        allowReserved: Bool
    ) {
        var serialized: [String] = []
        for (key, value) in values {
            if style == "form" && explode {
                pairs.append("\(urlEncode(key))=\(encodeQueryValue(String(describing: value), allowReserved: allowReserved))")
            } else {
                serialized.append(key)
                serialized.append(String(describing: value))
            }
        }
        if !serialized.isEmpty {
            pairs.append("\(urlEncode(name))=\(encodeQueryValue(serialized.joined(separator: ","), allowReserved: allowReserved))")
        }
    }

    private func appendDeepObjectParameter(_ pairs: inout [String], name: String, values: [String: Any], allowReserved: Bool) {
        for (key, value) in values {
            pairs.append("\(urlEncode("\(name)[\(key)]"))=\(encodeQueryValue(String(describing: value), allowReserved: allowReserved))")
        }
    }

    private func encodeQueryValue(_ value: String, allowReserved: Bool) -> String {
        var encoded = urlEncode(value)
        if !allowReserved { return encoded }
        [
            "%3A": ":", "%2F": "/", "%3F": "?", "%23": "#",
            "%5B": "[", "%5D": "]", "%40": "@", "%21": "!",
            "%24": "$", "%26": "&", "%27": "'", "%28": "(",
            "%29": ")", "%2A": "*", "%2B": "+", "%2C": ",",
            "%3B": ";", "%3D": "=",
        ].forEach { encoded = encoded.replacingOccurrences(of: $0.key, with: $0.value) }
        return encoded
    }

    private func urlEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? value
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
