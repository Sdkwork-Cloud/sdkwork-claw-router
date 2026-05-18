import Foundation

public class AuthApi {
    private let client: HttpClient
    
    public init(client: HttpClient) {
        self.client = client
    }

    /// Retrieve OAuth authorization URL
    public func oauthAuthorizationUrlsRetrieve(provider: String, redirectUri: String, state: String? = nil, scope: String? = nil) async throws -> OauthAuthorizationUrlsRetrieveResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "provider", value: provider, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "redirect_uri", value: redirectUri, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "state", value: state, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "scope", value: scope, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/auth/oauth_authorization_urls"), query), responseType: OauthAuthorizationUrlsRetrieveResult.self)
    }

    /// Create OAuth IAM session
    public func oauthSessionsCreate(body: IamOauthSessionCreateRequest) async throws -> OauthSessionsCreateResult? {
        return try await client.post(ApiPaths.appPath("/auth/oauth_sessions"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: OauthSessionsCreateResult.self)
    }

    /// Create password reset request
    public func passwordResetRequestsCreate(body: IamPasswordResetRequestCreateRequest) async throws -> PasswordResetRequestsCreateResult? {
        return try await client.post(ApiPaths.appPath("/auth/password_reset_requests"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: PasswordResetRequestsCreateResult.self)
    }

    /// Create password reset
    public func passwordResetsCreate(body: IamPasswordResetCreateRequest) async throws -> PasswordResetsCreateResult? {
        return try await client.post(ApiPaths.appPath("/auth/password_resets"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: PasswordResetsCreateResult.self)
    }

    /// Create QR login code
    public func loginQrCodesCreate() async throws -> LoginQrCodesCreateResult? {
        return try await client.post(ApiPaths.appPath("/auth/qr_login_codes"), body: nil, responseType: LoginQrCodesCreateResult.self)
    }

    /// Confirm QR login code
    public func loginQrCodesConfirm(body: IamLoginQrCodeConfirmRequest) async throws -> LoginQrCodesConfirmResult? {
        return try await client.post(ApiPaths.appPath("/auth/qr_login_codes/confirm"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: LoginQrCodesConfirmResult.self)
    }

    /// Retrieve QR login status
    public func loginQrCodesRetrieve(qrKey: String) async throws -> LoginQrCodesRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/auth/qr_login_codes/\(serializePathParameter(qrKey, PathParameterSpec(name: "qrKey", style: "simple", explode: false)))"), responseType: LoginQrCodesRetrieveResult.self)
    }

    /// Create IAM registration
    public func registrationsCreate(body: IamRegistrationCreateRequest, xRequestId: String? = nil) async throws -> RegistrationsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/auth/registrations"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: RegistrationsCreateResult.self)
    }

    /// Retrieve public IAM auth runtime settings
    public func runtimeSettingsRetrieve(tenantCode: String? = nil, organizationCode: String? = nil) async throws -> RuntimeSettingsRetrieveResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "tenant_code", value: tenantCode, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "organization_code", value: organizationCode, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/auth/runtime_settings"), query), responseType: RuntimeSettingsRetrieveResult.self)
    }

    /// Create IAM session
    public func sessionsCreate(body: IamSessionCreateRequest, xRequestId: String? = nil) async throws -> SessionsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/auth/sessions"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: SessionsCreateResult.self)
    }

    /// Delete current IAM session
    public func sessionsCurrentDelete() async throws -> SessionsCurrentDeleteResult? {
        return try await client.delete(ApiPaths.appPath("/auth/sessions/current"), responseType: SessionsCurrentDeleteResult.self)
    }

    /// Retrieve current IAM session
    public func sessionsCurrentRetrieve() async throws -> SessionsCurrentRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/auth/sessions/current"), responseType: SessionsCurrentRetrieveResult.self)
    }

    /// Update current IAM session
    public func sessionsCurrentUpdate(body: IamCurrentSessionUpdateRequest) async throws -> SessionsCurrentUpdateResult? {
        return try await client.patch(ApiPaths.appPath("/auth/sessions/current"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: SessionsCurrentUpdateResult.self)
    }

    /// Refresh IAM session
    public func sessionsRefresh(body: IamSessionRefreshRequest) async throws -> SessionsRefreshResult? {
        return try await client.post(ApiPaths.appPath("/auth/sessions/refresh"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: SessionsRefreshResult.self)
    }

    /// Create verification code
    public func verificationCodesCreate(body: IamVerificationCodeCreateRequest) async throws -> VerificationCodesCreateResult? {
        return try await client.post(ApiPaths.appPath("/auth/verification_codes"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: VerificationCodesCreateResult.self)
    }

    /// Verify verification code
    public func verificationCodesVerify(body: IamVerificationCodeVerifyRequest) async throws -> VerificationCodesVerifyResult? {
        return try await client.post(ApiPaths.appPath("/auth/verification_codes/verify"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: VerificationCodesVerifyResult.self)
    }

    /// Retrieve public IAM verification policy
    public func verificationPolicyRetrieve() async throws -> VerificationPolicyRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/auth/verification_policy"), responseType: VerificationPolicyRetrieveResult.self)
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
