import Foundation

public class PlatformApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// List apps
    public func appsList(q: String? = nil, status: String? = nil, marketStatus: String? = nil, appType: String? = nil, categoryId: String? = nil, page: String? = nil, pageSize: String? = nil) async throws -> AppsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "market_status", value: marketStatus, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "app_type", value: appType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "category_id", value: categoryId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/platform/apps"), query), responseType: AppsListResult.self)
    }

    /// Create app
    public func appsCreate(body: AdminAppCreateRequest) async throws -> AppsCreateResult? {
        return try await client.post(ApiPaths.backendPath("/platform/apps"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AppsCreateResult.self)
    }

    /// List app categories
    public func appsCategoriesList() async throws -> AppsCategoriesListResult? {
        return try await client.get(ApiPaths.backendPath("/platform/apps/categories"), responseType: AppsCategoriesListResult.self)
    }

    /// Create app category
    public func appsCategoriesCreate(body: AdminAppCategoryCreateRequest) async throws -> AppsCategoriesCreateResult? {
        return try await client.post(ApiPaths.backendPath("/platform/apps/categories"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AppsCategoriesCreateResult.self)
    }

    /// Delete app category
    public func appsCategoriesDelete(categoryId: String) async throws -> AppsCategoriesDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/platform/apps/categories/\(serializePathParameter(categoryId, PathParameterSpec(name: "categoryId", style: "simple", explode: false)))"), responseType: AppsCategoriesDeleteResult.self)
    }

    /// Update app category
    public func appsCategoriesUpdate(categoryId: String, body: AdminAppCategoryUpdateRequest) async throws -> AppsCategoriesUpdateResult? {
        return try await client.put(ApiPaths.backendPath("/platform/apps/categories/\(serializePathParameter(categoryId, PathParameterSpec(name: "categoryId", style: "simple", explode: false)))"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AppsCategoriesUpdateResult.self)
    }

    /// List app templates
    public func appsTemplatesList(q: String? = nil, publishStatus: String? = nil, templateType: String? = nil, runtime: String? = nil, categoryId: String? = nil, page: String? = nil, pageSize: String? = nil) async throws -> AppsTemplatesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "publish_status", value: publishStatus, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "template_type", value: templateType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "runtime", value: runtime, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "category_id", value: categoryId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/platform/apps/templates"), query), responseType: AppsTemplatesListResult.self)
    }

    /// Create app template
    public func appsTemplatesCreate(body: AdminAppTemplateCreateRequest) async throws -> AppsTemplatesCreateResult? {
        return try await client.post(ApiPaths.backendPath("/platform/apps/templates"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AppsTemplatesCreateResult.self)
    }

    /// Delete app template
    public func appsTemplatesDelete(templateId: String) async throws -> AppsTemplatesDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/platform/apps/templates/\(serializePathParameter(templateId, PathParameterSpec(name: "templateId", style: "simple", explode: false)))"), responseType: AppsTemplatesDeleteResult.self)
    }

    /// List app template
    public func appsTemplatesRetrieve(templateId: String) async throws -> AppsTemplatesRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/platform/apps/templates/\(serializePathParameter(templateId, PathParameterSpec(name: "templateId", style: "simple", explode: false)))"), responseType: AppsTemplatesRetrieveResult.self)
    }

    /// Update app template
    public func appsTemplatesUpdate(templateId: String, body: AdminAppTemplateUpdateRequest) async throws -> AppsTemplatesUpdateResult? {
        return try await client.put(ApiPaths.backendPath("/platform/apps/templates/\(serializePathParameter(templateId, PathParameterSpec(name: "templateId", style: "simple", explode: false)))"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AppsTemplatesUpdateResult.self)
    }

    /// Publish app template
    public func appsTemplatesPublish(templateId: String) async throws -> AppsTemplatesPublishResult? {
        return try await client.post(ApiPaths.backendPath("/platform/apps/templates/\(serializePathParameter(templateId, PathParameterSpec(name: "templateId", style: "simple", explode: false)))/publish"), body: nil, responseType: AppsTemplatesPublishResult.self)
    }

    /// Offline app template
    public func appsTemplatesUnpublish(templateId: String) async throws -> AppsTemplatesUnpublishResult? {
        return try await client.post(ApiPaths.backendPath("/platform/apps/templates/\(serializePathParameter(templateId, PathParameterSpec(name: "templateId", style: "simple", explode: false)))/unpublish"), body: nil, responseType: AppsTemplatesUnpublishResult.self)
    }

    /// Delete app
    public func appsDelete(appId: String) async throws -> AppsDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/platform/apps/\(serializePathParameter(appId, PathParameterSpec(name: "appId", style: "simple", explode: false)))"), responseType: AppsDeleteResult.self)
    }

    /// List app
    public func appsRetrieve(appId: String) async throws -> AppsRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/platform/apps/\(serializePathParameter(appId, PathParameterSpec(name: "appId", style: "simple", explode: false)))"), responseType: AppsRetrieveResult.self)
    }

    /// Update app
    public func appsUpdate(appId: String, body: AdminAppUpdateRequest) async throws -> AppsUpdateResult? {
        return try await client.put(ApiPaths.backendPath("/platform/apps/\(serializePathParameter(appId, PathParameterSpec(name: "appId", style: "simple", explode: false)))"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AppsUpdateResult.self)
    }

    /// Disable app
    public func appsDisable(appId: String) async throws -> AppsDisableResult? {
        return try await client.post(ApiPaths.backendPath("/platform/apps/\(serializePathParameter(appId, PathParameterSpec(name: "appId", style: "simple", explode: false)))/disable"), body: nil, responseType: AppsDisableResult.self)
    }

    /// Enable app
    public func appsEnable(appId: String) async throws -> AppsEnableResult? {
        return try await client.post(ApiPaths.backendPath("/platform/apps/\(serializePathParameter(appId, PathParameterSpec(name: "appId", style: "simple", explode: false)))/enable"), body: nil, responseType: AppsEnableResult.self)
    }

    /// Publish app
    public func appsPublish(appId: String) async throws -> AppsPublishResult? {
        return try await client.post(ApiPaths.backendPath("/platform/apps/\(serializePathParameter(appId, PathParameterSpec(name: "appId", style: "simple", explode: false)))/publish"), body: nil, responseType: AppsPublishResult.self)
    }

    /// Offline app
    public func appsUnpublish(appId: String) async throws -> AppsUnpublishResult? {
        return try await client.post(ApiPaths.backendPath("/platform/apps/\(serializePathParameter(appId, PathParameterSpec(name: "appId", style: "simple", explode: false)))/unpublish"), body: nil, responseType: AppsUnpublishResult.self)
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

}
