import Foundation

public class BillingApi {
    private let client: HttpClient
    
    public init(client: HttpClient) {
        self.client = client
    }

    /// List batches
    public func couponBatchesList(couponId: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> CouponBatchesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "coupon_id", value: couponId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/coupon_batches"), query), responseType: CouponBatchesListResult.self)
    }

    /// Generate batch
    public func couponBatchesCreate(body: AdminCouponBatchGenerateRequest, xRequestId: String? = nil) async throws -> CouponBatchesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/billing/coupon_batches"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CouponBatchesCreateResult.self)
    }

    /// List promo codes
    public func couponCodesList(couponId: String? = nil, batchId: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> CouponCodesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "coupon_id", value: couponId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "batch_id", value: batchId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/coupon_codes"), query), responseType: CouponCodesListResult.self)
    }

    /// Update promo code status
    public func couponCodesStatusUpdate(codeId: String, body: AdminPromoCodeStatusUpdateRequest, xRequestId: String? = nil) async throws -> CouponCodesStatusUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/billing/coupon_codes/\(serializePathParameter(codeId, PathParameterSpec(name: "codeId", style: "simple", explode: false)))/status"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CouponCodesStatusUpdateResult.self)
    }

    /// List coupons
    public func couponsList(status: String? = nil, page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> CouponsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/coupons"), query), responseType: CouponsListResult.self)
    }

    /// Create coupon
    public func couponsCreate(body: AdminCouponCreateRequest, xRequestId: String? = nil) async throws -> CouponsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/billing/coupons"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CouponsCreateResult.self)
    }

    /// Delete coupon
    public func couponsDelete(couponId: String) async throws -> CouponsDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/billing/coupons/\(serializePathParameter(couponId, PathParameterSpec(name: "couponId", style: "simple", explode: false)))"), responseType: CouponsDeleteResult.self)
    }

    /// Update coupon
    public func couponsUpdate(couponId: String, body: AdminCouponCreateRequest, xRequestId: String? = nil) async throws -> CouponsUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/billing/coupons/\(serializePathParameter(couponId, PathParameterSpec(name: "couponId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CouponsUpdateResult.self)
    }

    /// List exchange rules
    public func exchangeRulesList(sourceAssetType: String? = nil, targetAssetType: String? = nil, status: String? = nil) async throws -> ExchangeRulesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "source_asset_type", value: sourceAssetType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "target_asset_type", value: targetAssetType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/exchange_rules"), query), responseType: ExchangeRulesListResult.self)
    }

    /// Upsert exchange rule
    public func exchangeRulesUpdate(body: CommerceExchangeRuleUpsertRequest, xRequestId: String? = nil) async throws -> ExchangeRulesUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/billing/exchange_rules"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: ExchangeRulesUpdateResult.self)
    }

    /// List transactions
    public func financeLedgerList(page: Int? = nil, pageSize: Int? = nil, q: String? = nil, status: String? = nil, startTime: String? = nil, endTime: String? = nil) async throws -> FinanceLedgerListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "start_time", value: startTime, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "end_time", value: endTime, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/finance/ledger"), query), responseType: FinanceLedgerListResult.self)
    }

    /// List billing
    public func financeUsageStatementsList(page: Int? = nil, pageSize: Int? = nil, q: String? = nil, status: String? = nil, startTime: String? = nil, endTime: String? = nil) async throws -> FinanceUsageStatementsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "start_time", value: startTime, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "end_time", value: endTime, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/finance/usage_statements"), query), responseType: FinanceUsageStatementsListResult.self)
    }

    /// List payment attempts
    public func paymentsAttemptsList(provider: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> PaymentsAttemptsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "provider", value: provider, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/payments/attempts"), query), responseType: PaymentsAttemptsListResult.self)
    }

    /// List recharge packages
    public func rechargesPackagesList(status: String? = nil) async throws -> RechargesPackagesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/recharges/packages"), query), responseType: RechargesPackagesListResult.self)
    }

    /// Create recharge package
    public func rechargesPackagesCreate(body: CommerceRechargePackageMutationRequest, xRequestId: String? = nil) async throws -> RechargesPackagesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/billing/recharges/packages"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: RechargesPackagesCreateResult.self)
    }

    /// Delete recharge package
    public func rechargesPackagesDelete(packageId: String) async throws -> RechargesPackagesDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/billing/recharges/packages/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), responseType: RechargesPackagesDeleteResult.self)
    }

    /// Update recharge package
    public func rechargesPackagesUpdate(packageId: String, body: CommerceRechargePackageMutationRequest, xRequestId: String? = nil) async throws -> RechargesPackagesUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/billing/recharges/packages/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: RechargesPackagesUpdateResult.self)
    }

    /// List recharge records
    public func rechargesRecordsList(userId: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> RechargesRecordsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "user_id", value: userId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/recharges/records"), query), responseType: RechargesRecordsListResult.self)
    }

    /// Retrieve recharge record
    public func rechargesRecordsRetrieve(orderNo: String) async throws -> RechargesRecordsRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/billing/recharges/records/\(serializePathParameter(orderNo, PathParameterSpec(name: "orderNo", style: "simple", explode: false)))"), responseType: RechargesRecordsRetrieveResult.self)
    }

    /// List referral stats
    public func referralsStatsList() async throws -> ReferralsStatsListResult? {
        return try await client.get(ApiPaths.backendPath("/billing/referrals/stats"), responseType: ReferralsStatsListResult.self)
    }

    /// List redemption records
    public func usersCouponsList(userId: String? = nil, status: String? = nil, page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> UsersCouponsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "user_id", value: userId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/users/coupons"), query), responseType: UsersCouponsListResult.self)
    }

    /// Update balance
    public func usersBalanceAdjustmentsCreate(userId: String, body: AdminUserBalanceAdjustmentRequest, xRequestId: String? = nil) async throws -> UsersBalanceAdjustmentsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/billing/users/\(serializePathParameter(userId, PathParameterSpec(name: "userId", style: "simple", explode: false)))/balance_adjustments"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: UsersBalanceAdjustmentsCreateResult.self)
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
