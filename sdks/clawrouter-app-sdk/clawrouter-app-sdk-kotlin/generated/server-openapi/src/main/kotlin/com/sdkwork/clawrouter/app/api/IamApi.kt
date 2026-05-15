package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class IamApi(private val client: HttpClient) {

    /** List keys */
    suspend fun apiKeysList(): ApiKeysListResult? {
        val raw = client.get(ApiPaths.appPath("/iam/api_keys"))
        return client.convertValue(raw, object : TypeReference<ApiKeysListResult>() {})
    }

    /** Create key */
    suspend fun apiKeysCreate(body: CreateApiKeyRequest, idempotencyKey: String, xRequestId: String? = null): ApiKeysCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/iam/api_keys"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<ApiKeysCreateResult>() {})
    }

    /** Retrieve current IAM user */
    suspend fun usersCurrentRetrieve(): UsersCurrentRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/iam/users/current"))
        return client.convertValue(raw, object : TypeReference<UsersCurrentRetrieveResult>() {})
    }

    /** List settings */
    suspend fun usersSettingsRetrieve(): UsersSettingsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/iam/users/settings"))
        return client.convertValue(raw, object : TypeReference<UsersSettingsRetrieveResult>() {})
    }

    /** Update settings */
    suspend fun usersSettingsUpdate(body: UpdateSettingsRequest): UsersSettingsUpdateResult? {
        val raw = client.put(ApiPaths.appPath("/iam/users/settings"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<UsersSettingsUpdateResult>() {})
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
