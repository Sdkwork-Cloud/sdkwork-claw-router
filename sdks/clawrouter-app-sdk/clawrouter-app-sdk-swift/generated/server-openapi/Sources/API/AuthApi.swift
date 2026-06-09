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

    /// Create IAM registration
    public func registrationsCreate(body: IamRegistrationCreateRequest) async throws -> RegistrationsCreateResult? {
        return try await client.post(ApiPaths.appPath("/auth/registrations"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: RegistrationsCreateResult.self)
    }

    /// Create IAM session
    public func sessionsCreate(body: IamSessionCreateRequest) async throws -> SessionsCreateResult? {
        return try await client.post(ApiPaths.appPath("/auth/sessions"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: SessionsCreateResult.self)
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
