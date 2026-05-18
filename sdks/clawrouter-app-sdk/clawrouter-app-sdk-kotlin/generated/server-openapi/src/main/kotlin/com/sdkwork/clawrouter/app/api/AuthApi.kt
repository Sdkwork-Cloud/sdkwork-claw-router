package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class AuthApi(private val client: HttpClient) {

    /** Retrieve OAuth authorization URL */
    suspend fun oauthAuthorizationUrlsRetrieve(provider: String, redirectUri: String, state: String? = null, scope: String? = null): OauthAuthorizationUrlsRetrieveResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("provider", provider, "form", true, false, null),
            QueryParameterSpec("redirect_uri", redirectUri, "form", true, false, null),
            QueryParameterSpec("state", state, "form", true, false, null),
            QueryParameterSpec("scope", scope, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/auth/oauth_authorization_urls"), query))
        return client.convertValue(raw, object : TypeReference<OauthAuthorizationUrlsRetrieveResult>() {})
    }

    /** Create OAuth IAM session */
    suspend fun oauthSessionsCreate(body: IamOauthSessionCreateRequest): OauthSessionsCreateResult? {
        val raw = client.post(ApiPaths.appPath("/auth/oauth_sessions"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<OauthSessionsCreateResult>() {})
    }

    /** Create password reset request */
    suspend fun passwordResetRequestsCreate(body: IamPasswordResetRequestCreateRequest): PasswordResetRequestsCreateResult? {
        val raw = client.post(ApiPaths.appPath("/auth/password_reset_requests"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<PasswordResetRequestsCreateResult>() {})
    }

    /** Create password reset */
    suspend fun passwordResetsCreate(body: IamPasswordResetCreateRequest): PasswordResetsCreateResult? {
        val raw = client.post(ApiPaths.appPath("/auth/password_resets"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<PasswordResetsCreateResult>() {})
    }

    /** Create QR login code */
    suspend fun loginQrCodesCreate(): LoginQrCodesCreateResult? {
        val raw = client.post(ApiPaths.appPath("/auth/qr_login_codes"), null)
        return client.convertValue(raw, object : TypeReference<LoginQrCodesCreateResult>() {})
    }

    /** Confirm QR login code */
    suspend fun loginQrCodesConfirm(body: IamLoginQrCodeConfirmRequest): LoginQrCodesConfirmResult? {
        val raw = client.post(ApiPaths.appPath("/auth/qr_login_codes/confirm"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<LoginQrCodesConfirmResult>() {})
    }

    /** Retrieve QR login status */
    suspend fun loginQrCodesRetrieve(qrKey: String): LoginQrCodesRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/auth/qr_login_codes/${serializePathParameter(qrKey, PathParameterSpec("qrKey", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<LoginQrCodesRetrieveResult>() {})
    }

    /** Create IAM registration */
    suspend fun registrationsCreate(body: IamRegistrationCreateRequest, xRequestId: String? = null): RegistrationsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/auth/registrations"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RegistrationsCreateResult>() {})
    }

    /** Retrieve public IAM auth runtime settings */
    suspend fun runtimeSettingsRetrieve(tenantCode: String? = null, organizationCode: String? = null): RuntimeSettingsRetrieveResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("tenant_code", tenantCode, "form", true, false, null),
            QueryParameterSpec("organization_code", organizationCode, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/auth/runtime_settings"), query))
        return client.convertValue(raw, object : TypeReference<RuntimeSettingsRetrieveResult>() {})
    }

    /** Create IAM session */
    suspend fun sessionsCreate(body: IamSessionCreateRequest, xRequestId: String? = null): SessionsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/auth/sessions"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SessionsCreateResult>() {})
    }

    /** Delete current IAM session */
    suspend fun sessionsCurrentDelete(): SessionsCurrentDeleteResult? {
        val raw = client.delete(ApiPaths.appPath("/auth/sessions/current"))
        return client.convertValue(raw, object : TypeReference<SessionsCurrentDeleteResult>() {})
    }

    /** Retrieve current IAM session */
    suspend fun sessionsCurrentRetrieve(): SessionsCurrentRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/auth/sessions/current"))
        return client.convertValue(raw, object : TypeReference<SessionsCurrentRetrieveResult>() {})
    }

    /** Update current IAM session */
    suspend fun sessionsCurrentUpdate(body: IamCurrentSessionUpdateRequest): SessionsCurrentUpdateResult? {
        val raw = client.patch(ApiPaths.appPath("/auth/sessions/current"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<SessionsCurrentUpdateResult>() {})
    }

    /** Refresh IAM session */
    suspend fun sessionsRefresh(body: IamSessionRefreshRequest): SessionsRefreshResult? {
        val raw = client.post(ApiPaths.appPath("/auth/sessions/refresh"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<SessionsRefreshResult>() {})
    }

    /** Create verification code */
    suspend fun verificationCodesCreate(body: IamVerificationCodeCreateRequest): VerificationCodesCreateResult? {
        val raw = client.post(ApiPaths.appPath("/auth/verification_codes"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<VerificationCodesCreateResult>() {})
    }

    /** Verify verification code */
    suspend fun verificationCodesVerify(body: IamVerificationCodeVerifyRequest): VerificationCodesVerifyResult? {
        val raw = client.post(ApiPaths.appPath("/auth/verification_codes/verify"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<VerificationCodesVerifyResult>() {})
    }

    /** Retrieve public IAM verification policy */
    suspend fun verificationPolicyRetrieve(): VerificationPolicyRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/auth/verification_policy"))
        return client.convertValue(raw, object : TypeReference<VerificationPolicyRetrieveResult>() {})
    }

    private data class PathParameterSpec(val name: String, val style: String, val explode: Boolean)

    private fun serializePathParameter(value: Any?, spec: PathParameterSpec): String {
        if (value == null) return ""
        val style = spec.style.ifBlank { "simple" }
        return when (value) {
            is Iterable<*> -> serializePathArray(spec.name, value, style, spec.explode)
            is Map<*, *> -> serializePathObject(spec.name, value, style, spec.explode)
            else -> pathPrimitivePrefix(spec.name, style) + pathEncode(value.toString())
        }
    }

    private fun serializePathArray(name: String, values: Iterable<*>, style: String, explode: Boolean): String {
        val serialized = values.mapNotNull { it?.toString()?.let(::pathEncode) }
        if (serialized.isEmpty()) return pathPrefix(name, style)
        if (style == "matrix") {
            if (explode) {
                return serialized.joinToString("") { ";$name=$it" }
            }
            return ";$name=" + serialized.joinToString(",")
        }
        val separator = if (explode) "." else ","
        return pathPrefix(name, style) + serialized.joinToString(separator)
    }

    private fun serializePathObject(name: String, values: Map<*, *>, style: String, explode: Boolean): String {
        val entries = mutableListOf<String>()
        val exploded = mutableListOf<String>()
        values.forEach { (key, value) ->
            if (value == null) return@forEach
            val escapedKey = pathEncode(key.toString())
            val escapedValue = pathEncode(value.toString())
            if (explode) {
                if (style == "matrix") {
                    exploded += ";$escapedKey=$escapedValue"
                } else {
                    exploded += "$escapedKey=$escapedValue"
                }
            } else {
                entries += escapedKey
                entries += escapedValue
            }
        }
        if (style == "matrix") {
            if (explode) return exploded.joinToString("")
            return ";$name=" + entries.joinToString(",")
        }
        if (explode) {
            val separator = if (style == "label") "." else ","
            return pathPrefix(name, style) + exploded.joinToString(separator)
        }
        return pathPrefix(name, style) + entries.joinToString(",")
    }

    private fun pathPrefix(name: String, style: String): String {
        return when (style) {
            "label" -> "."
            "matrix" -> ";$name"
            else -> ""
        }
    }

    private fun pathPrimitivePrefix(name: String, style: String): String {
        return if (style == "matrix") ";$name=" else pathPrefix(name, style)
    }

    private fun pathEncode(value: String): String {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20")
    }

    private data class QueryParameterSpec(
        val name: String,
        val value: Any?,
        val style: String,
        val explode: Boolean,
        val allowReserved: Boolean,
        val contentType: String?,
    )

    private val queryObjectMapper = ObjectMapper().registerKotlinModule()

    private fun buildQueryString(parameters: List<QueryParameterSpec>): String {
        val pairs = mutableListOf<String>()
        parameters.forEach { appendSerializedParameter(pairs, it) }
        return pairs.joinToString("&")
    }

    private fun appendSerializedParameter(pairs: MutableList<String>, parameter: QueryParameterSpec) {
        val value = parameter.value ?: return
        if (!parameter.contentType.isNullOrBlank()) {
            val json = queryObjectMapper.writeValueAsString(value)
            pairs += urlEncode(parameter.name) + "=" + encodeQueryValue(json, parameter.allowReserved)
            return
        }

        val style = parameter.style.ifBlank { "form" }
        when (value) {
            is Iterable<*> -> appendArrayParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved)
            is Map<*, *> -> if (style == "deepObject") {
                appendDeepObjectParameter(pairs, parameter.name, value, parameter.allowReserved)
            } else {
                appendObjectParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved)
            }
            else -> pairs += urlEncode(parameter.name) + "=" + encodeQueryValue(value.toString(), parameter.allowReserved)
        }
    }

    private fun appendArrayParameter(
        pairs: MutableList<String>,
        name: String,
        values: Iterable<*>,
        style: String,
        explode: Boolean,
        allowReserved: Boolean,
    ) {
        val serialized = values.mapNotNull { it?.toString() }
        if (serialized.isEmpty()) return
        if (style == "form" && explode) {
            serialized.forEach { pairs += urlEncode(name) + "=" + encodeQueryValue(it, allowReserved) }
            return
        }
        pairs += urlEncode(name) + "=" + encodeQueryValue(serialized.joinToString(","), allowReserved)
    }

    private fun appendObjectParameter(
        pairs: MutableList<String>,
        name: String,
        values: Map<*, *>,
        style: String,
        explode: Boolean,
        allowReserved: Boolean,
    ) {
        val serialized = mutableListOf<String>()
        values.forEach { (key, value) ->
            if (value == null) return@forEach
            if (style == "form" && explode) {
                pairs += urlEncode(key.toString()) + "=" + encodeQueryValue(value.toString(), allowReserved)
            } else {
                serialized += key.toString()
                serialized += value.toString()
            }
        }
        if (serialized.isNotEmpty()) {
            pairs += urlEncode(name) + "=" + encodeQueryValue(serialized.joinToString(","), allowReserved)
        }
    }

    private fun appendDeepObjectParameter(pairs: MutableList<String>, name: String, values: Map<*, *>, allowReserved: Boolean) {
        values.forEach { (key, value) ->
            if (value != null) {
                pairs += urlEncode("$name[$key]") + "=" + encodeQueryValue(value.toString(), allowReserved)
            }
        }
    }

    private fun encodeQueryValue(value: String, allowReserved: Boolean): String {
        var encoded = urlEncode(value)
        if (!allowReserved) return encoded
        mapOf(
            "%3A" to ":", "%2F" to "/", "%3F" to "?", "%23" to "#",
            "%5B" to "[", "%5D" to "]", "%40" to "@", "%21" to "!",
            "%24" to "$", "%26" to "&", "%27" to "'", "%28" to "(",
            "%29" to ")", "%2A" to "*", "%2B" to "+", "%2C" to ",",
            "%3B" to ";", "%3D" to "=",
        ).forEach { (escaped, reserved) -> encoded = encoded.replace(escaped, reserved) }
        return encoded
    }

    private fun urlEncode(value: String): String {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8)
    }

    private data class HeaderParameterSpec(val value: Any?, val style: String, val explode: Boolean, val contentType: String?)

    private val headerObjectMapper = ObjectMapper().registerKotlinModule()

    private fun buildRequestHeaders(headers: Map<String, HeaderParameterSpec>, cookies: Map<String, HeaderParameterSpec>): Map<String, String>? {
        val requestHeaders = linkedMapOf<String, String>()
        headers.forEach { (name, parameter) ->
            serializeParameterValue(parameter)?.let { requestHeaders[name] = it }
        }

        val cookieHeader = buildCookieHeader(cookies)
        if (cookieHeader.isNotEmpty()) {
            requestHeaders["Cookie"] = requestHeaders["Cookie"]?.let { "$it; $cookieHeader" } ?: cookieHeader
        }

        return requestHeaders.takeIf { it.isNotEmpty() }
    }

    private fun buildCookieHeader(cookies: Map<String, HeaderParameterSpec>): String {
        return cookies.mapNotNull { (name, parameter) ->
            serializeParameterValue(parameter)?.let {
                java.net.URLEncoder.encode(name, java.nio.charset.StandardCharsets.UTF_8) + "=" +
                    java.net.URLEncoder.encode(it, java.nio.charset.StandardCharsets.UTF_8)
            }
        }.joinToString("; ")
    }

    private fun serializeParameterValue(parameter: HeaderParameterSpec?): String? {
        val value = parameter?.value ?: return null
        if (!parameter.contentType.isNullOrBlank()) {
            return headerObjectMapper.writeValueAsString(value)
        }
        return when (value) {
            is Iterable<*> -> value.mapNotNull { it?.toString() }.joinToString(",")
            is Map<*, *> -> value.mapNotNull { (key, item) ->
                if (item == null) {
                    null
                } else if (parameter.explode) {
                    "$key=$item"
                } else {
                    listOf(key.toString(), item.toString()).joinToString(",")
                }
            }.joinToString(",")
            else -> value.toString()
        }
    }
}
