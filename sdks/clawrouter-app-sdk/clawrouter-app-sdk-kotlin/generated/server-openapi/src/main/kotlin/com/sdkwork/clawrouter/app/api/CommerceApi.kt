package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class CommerceApi(private val client: HttpClient) {

    /** Recharges Settings Retrieve */
    suspend fun rechargesSettingsRetrieve(): RechargesSettingsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/recharges/settings"))
        return client.convertValue(raw, object : TypeReference<RechargesSettingsRetrieveResult>() {})
    }



}
