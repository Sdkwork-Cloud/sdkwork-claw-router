import Foundation

public class CommerceApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// List category attribute bindings
    public func catalogCategoryAttributesList(categoryId: String? = nil, attributeId: String? = nil, status: String? = nil, page: String? = nil, pageSize: String? = nil) async throws -> CatalogCategoryAttributesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "category_id", value: categoryId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "attribute_id", value: attributeId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/category_attributes"), query), responseType: CatalogCategoryAttributesListResult.self)
    }

    /// Create category attribute binding
    public func catalogCategoryAttributesCreate(body: CommerceProductCategoryAttributeMutationRequest, idempotencyKey: String) async throws -> CatalogCategoryAttributesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/catalog/category_attributes"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogCategoryAttributesCreateResult.self)
    }

    /// Delete category attribute binding
    public func catalogCategoryAttributesDelete(bindingId: String) async throws -> CatalogCategoryAttributesDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/catalog/category_attributes/\(serializePathParameter(bindingId, PathParameterSpec(name: "bindingId", style: "simple", explode: false)))"), responseType: CatalogCategoryAttributesDeleteResult.self)
    }

    /// Update category attribute binding
    public func catalogCategoryAttributesUpdate(bindingId: String, body: CommerceProductCategoryAttributeMutationRequest, idempotencyKey: String) async throws -> CatalogCategoryAttributesUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/catalog/category_attributes/\(serializePathParameter(bindingId, PathParameterSpec(name: "bindingId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogCategoryAttributesUpdateResult.self)
    }

    /// Initialize admin category seed datasets
    public func catalogCategorySeedsCreate(body: CommerceCategorySeedInitializeRequest, idempotencyKey: String) async throws -> CatalogCategorySeedsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.backendPath("/catalog/category_seeds/initialize"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CatalogCategorySeedsCreateResult.self)
    }

    /// Delete product SPU
    public func catalogProductsDelete(productId: String) async throws -> CatalogProductsDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/catalog/products/\(serializePathParameter(productId, PathParameterSpec(name: "productId", style: "simple", explode: false)))"), responseType: CatalogProductsDeleteResult.self)
    }

    /// Delete product SKU
    public func catalogSkusDelete(skuId: String) async throws -> CatalogSkusDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/catalog/skus/\(serializePathParameter(skuId, PathParameterSpec(name: "skuId", style: "simple", explode: false)))"), responseType: CatalogSkusDeleteResult.self)
    }

    /// Update inventory stock
    public func inventoryStocksUpdate(stockId: String, body: CommerceInventoryStockUpdateRequest, idempotencyKey: String) async throws -> InventoryStocksUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/inventory/stocks/\(serializePathParameter(stockId, PathParameterSpec(name: "stockId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: InventoryStocksUpdateResult.self)
    }

    /// Memberships Members Status Update
    public func membershipsMembersStatusUpdate(membershipId: String, body: CommerceMembershipMemberStatusRequest, idempotencyKey: String) async throws -> MembershipsMembersStatusUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/memberships/members/\(serializePathParameter(membershipId, PathParameterSpec(name: "membershipId", style: "simple", explode: false)))/status"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsMembersStatusUpdateResult.self)
    }

    /// Memberships Package Groups Update
    public func membershipsPackageGroupsUpdate(packageGroupId: String, body: CommerceMembershipPackageGroupMutationRequest, idempotencyKey: String) async throws -> MembershipsPackageGroupsUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/memberships/package_groups/\(serializePathParameter(packageGroupId, PathParameterSpec(name: "packageGroupId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPackageGroupsUpdateResult.self)
    }

    /// Memberships Packages Update
    public func membershipsPackagesUpdate(packageId: String, body: CommerceMembershipPackageMutationRequest, idempotencyKey: String) async throws -> MembershipsPackagesUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/memberships/packages/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPackagesUpdateResult.self)
    }

    /// Memberships Plans Update
    public func membershipsPlansUpdate(planId: String, body: CommerceMembershipPlanMutationRequest, idempotencyKey: String) async throws -> MembershipsPlansUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.put(ApiPaths.backendPath("/memberships/plans/\(serializePathParameter(planId, PathParameterSpec(name: "planId", style: "simple", explode: false)))"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: MembershipsPlansUpdateResult.self)
    }

    /// Orders Retrieve
    public func ordersRetrieve(orderId: String) async throws -> OrdersRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/orders/\(serializePathParameter(orderId, PathParameterSpec(name: "orderId", style: "simple", explode: false)))"), responseType: OrdersRetrieveResult.self)
    }

    /// Payments Provider Accounts Delete
    public func paymentsProviderAccountsDelete(providerAccountId: String) async throws -> PaymentsProviderAccountsDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/payments/provider_accounts/\(serializePathParameter(providerAccountId, PathParameterSpec(name: "providerAccountId", style: "simple", explode: false)))"), responseType: PaymentsProviderAccountsDeleteResult.self)
    }

    /// Payments Provider Accounts Status Update
    public func paymentsProviderAccountsStatusUpdate(providerAccountId: String, body: CommercePaymentProviderAccountStatusUpdateRequest, idempotencyKey: String) async throws -> PaymentsProviderAccountsStatusUpdateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.patch(ApiPaths.backendPath("/payments/provider_accounts/\(serializePathParameter(providerAccountId, PathParameterSpec(name: "providerAccountId", style: "simple", explode: false)))/status"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: PaymentsProviderAccountsStatusUpdateResult.self)
    }

    /// Payments Providers List
    public func paymentsProvidersList(page: String? = nil, pageSize: String? = nil, status: String? = nil) async throws -> PaymentsProvidersListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/providers"), query), responseType: PaymentsProvidersListResult.self)
    }

    /// Payments Runtime Snapshot Retrieve
    public func paymentsRuntimeSnapshotRetrieve(environment: String? = nil) async throws -> PaymentsRuntimeSnapshotRetrieveResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "environment", value: environment, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/runtime/snapshot"), query), responseType: PaymentsRuntimeSnapshotRetrieveResult.self)
    }

    /// Recharges Packages Delete
    public func rechargesPackagesDelete(packageId: String) async throws -> RechargesPackagesDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/recharges/packages/\(serializePathParameter(packageId, PathParameterSpec(name: "packageId", style: "simple", explode: false)))"), responseType: RechargesPackagesDeleteResult.self)
    }

    /// Recharges Settings Retrieve
    public func rechargesSettingsRetrieve() async throws -> RechargesSettingsRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/recharges/settings"), responseType: RechargesSettingsRetrieveResult.self)
    }

    /// Recharges Settings Update
    public func rechargesSettingsUpdate(body: CommerceRechargeSettingsUpdateRequest) async throws -> RechargesSettingsUpdateResult? {
        return try await client.put(ApiPaths.backendPath("/recharges/settings"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: RechargesSettingsUpdateResult.self)
    }

    /// Shipments Tracking Events List
    public func shipmentsTrackingEventsList(shipmentId: String, page: String? = nil, pageSize: String? = nil, status: String? = nil) async throws -> ShipmentsTrackingEventsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/shipments/\(serializePathParameter(shipmentId, PathParameterSpec(name: "shipmentId", style: "simple", explode: false)))/tracking_events"), query), responseType: ShipmentsTrackingEventsListResult.self)
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
