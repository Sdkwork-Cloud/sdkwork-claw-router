import Foundation

public class AiApi {
    private let client: HttpClient
    
    public init(client: HttpClient) {
        self.client = client
    }

    /// List dashboard overview
    public func dashboardOverviewRetrieve(timeRange: String? = nil, startTime: String? = nil, endTime: String? = nil) async throws -> DashboardOverviewRetrieveResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "time_range", value: timeRange, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "start_time", value: startTime, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "end_time", value: endTime, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/dashboard/overview"), query), responseType: DashboardOverviewRetrieveResult.self)
    }

    /// List traces
    public func gatewayTracesList() async throws -> GatewayTracesListResult? {
        return try await client.get(ApiPaths.appPath("/ai/gateway/traces"), responseType: GatewayTracesListResult.self)
    }

    /// List generation history
    public func generationsList() async throws -> GenerationsListResult? {
        return try await client.get(ApiPaths.appPath("/ai/generations"), responseType: GenerationsListResult.self)
    }

    /// List model rankings
    public func modelRankingsList(rankScope: String? = nil, vendorCode: String? = nil, modality: String? = nil, q: String? = nil, limit: Int? = nil) async throws -> ModelRankingsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "rank_scope", value: rankScope, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "vendor_code", value: vendorCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "modality", value: modality, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "limit", value: limit, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/model_rankings"), query), responseType: ModelRankingsListResult.self)
    }

    /// List ranking vendor filters
    public func modelVendorsList() async throws -> ModelVendorsListResult? {
        return try await client.get(ApiPaths.appPath("/ai/model_vendors"), responseType: ModelVendorsListResult.self)
    }

    /// List models
    public func modelsList(billingMeter: String? = nil, vendorCode: String? = nil, vendorCodes: [String]? = nil, modalities: [String]? = nil, capabilities: [String]? = nil, categories: [String]? = nil, groups: [String]? = nil, q: String? = nil, limit: Int? = nil) async throws -> ModelsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "billing_meter", value: billingMeter, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "vendor_code", value: vendorCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "vendor_codes", value: vendorCodes, style: "form", explode: false, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "modalities", value: modalities, style: "form", explode: false, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "capabilities", value: capabilities, style: "form", explode: false, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "categories", value: categories, style: "form", explode: false, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "groups", value: groups, style: "form", explode: false, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "limit", value: limit, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/models"), query), responseType: ModelsListResult.self)
    }

    /// List providers
    public func providersList() async throws -> ProvidersListResult? {
        return try await client.get(ApiPaths.appPath("/ai/providers"), responseType: ProvidersListResult.self)
    }

    /// List API keys
    public func routingApiKeysList() async throws -> RoutingApiKeysListResult? {
        return try await client.get(ApiPaths.appPath("/ai/routing/api_keys"), responseType: RoutingApiKeysListResult.self)
    }

    /// List channels
    public func routingChannelsList() async throws -> RoutingChannelsListResult? {
        return try await client.get(ApiPaths.appPath("/ai/routing/channels"), responseType: RoutingChannelsListResult.self)
    }

    /// Create channel
    public func routingChannelsCreate(body: CreateRoutingChannelRequest, xRequestId: String? = nil) async throws -> RoutingChannelsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/ai/routing/channels"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: RoutingChannelsCreateResult.self)
    }

    /// Delete channel
    public func routingChannelsDelete(channelId: String) async throws -> RoutingChannelsDeleteResult? {
        return try await client.delete(ApiPaths.appPath("/ai/routing/channels/\(serializePathParameter(channelId, PathParameterSpec(name: "channelId", style: "simple", explode: false)))"), responseType: RoutingChannelsDeleteResult.self)
    }

    /// Update channel
    public func routingChannelsUpdate(channelId: String, body: UpdateRoutingChannelRequest, xRequestId: String? = nil) async throws -> RoutingChannelsUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.appPath("/ai/routing/channels/\(serializePathParameter(channelId, PathParameterSpec(name: "channelId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: RoutingChannelsUpdateResult.self)
    }

    /// Set channel status
    public func routingChannelsStatusUpdate(channelId: String, body: SetRoutingChannelStatusRequest, xRequestId: String? = nil) async throws -> RoutingChannelsStatusUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.appPath("/ai/routing/channels/\(serializePathParameter(channelId, PathParameterSpec(name: "channelId", style: "simple", explode: false)))/status"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: RoutingChannelsStatusUpdateResult.self)
    }

    /// Test channel
    public func routingChannelsVerify(channelId: String, xRequestId: String? = nil) async throws -> RoutingChannelsVerifyResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/ai/routing/channels/\(serializePathParameter(channelId, PathParameterSpec(name: "channelId", style: "simple", explode: false)))/verify"), body: nil, params: nil, headers: requestHeaders, responseType: RoutingChannelsVerifyResult.self)
    }

    /// List request traces
    public func routingRequestTracesList() async throws -> RoutingRequestTracesListResult? {
        return try await client.get(ApiPaths.appPath("/ai/routing/request_traces"), responseType: RoutingRequestTracesListResult.self)
    }

    /// List strategy
    public func routingStrategyList() async throws -> RoutingStrategyListResult? {
        return try await client.get(ApiPaths.appPath("/ai/routing/strategy"), responseType: RoutingStrategyListResult.self)
    }

    /// Update strategy
    public func routingStrategyUpdate(body: UpdateRoutingStrategyRequest) async throws -> RoutingStrategyUpdateResult? {
        return try await client.put(ApiPaths.appPath("/ai/routing/strategy"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: RoutingStrategyUpdateResult.self)
    }

    /// List usage data
    public func routingUsageList() async throws -> RoutingUsageListResult? {
        return try await client.get(ApiPaths.appPath("/ai/routing/usage"), responseType: RoutingUsageListResult.self)
    }

    /// List logs
    public func usageLogsList(page: Int? = nil, pageSize: Int? = nil, q: String? = nil, status: String? = nil, startTime: String? = nil, endTime: String? = nil) async throws -> UsageLogsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "start_time", value: startTime, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "end_time", value: endTime, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/usage/logs"), query), responseType: UsageLogsListResult.self)
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
