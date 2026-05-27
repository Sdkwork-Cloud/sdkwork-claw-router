package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class OpenPlatformApi(private val client: HttpClient) {

    /** Create open platform QR auth session */
    suspend fun qrAuthSessionsCreate(body: OpenPlatformQrAuthSessionCreateRequest): QrAuthSessionsCreateResult? {
        val raw = client.post(ApiPaths.appPath("/open_platform/qr_auth/sessions"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<QrAuthSessionsCreateResult>() {})
    }

    /** Retrieve open platform QR auth session */
    suspend fun qrAuthSessionsRetrieve(sessionKey: String): QrAuthSessionsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/open_platform/qr_auth/sessions/${serializePathParameter(sessionKey, PathParameterSpec("sessionKey", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<QrAuthSessionsRetrieveResult>() {})
    }

    /** Complete open platform QR auth by password */
    suspend fun qrAuthSessionsPasswordsCreate(sessionKey: String, body: OpenPlatformQrAuthPasswordCreateRequest): QrAuthSessionsPasswordsCreateResult? {
        val raw = client.post(ApiPaths.appPath("/open_platform/qr_auth/sessions/${serializePathParameter(sessionKey, PathParameterSpec("sessionKey", "simple", false))}/passwords"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<QrAuthSessionsPasswordsCreateResult>() {})
    }

    /** Record open platform QR auth scan */
    suspend fun qrAuthSessionsScansCreate(sessionKey: String, body: OpenPlatformQrAuthScanCreateRequest): QrAuthSessionsScansCreateResult? {
        val raw = client.post(ApiPaths.appPath("/open_platform/qr_auth/sessions/${serializePathParameter(sessionKey, PathParameterSpec("sessionKey", "simple", false))}/scans"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<QrAuthSessionsScansCreateResult>() {})
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


}
