package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class CommunicationApi(private val client: HttpClient) {

    /** List messages */
    suspend fun notificationsList(): NotificationsListResult? {
        val raw = client.get(ApiPaths.appPath("/communication/notifications"))
        return client.convertValue(raw, object : TypeReference<NotificationsListResult>() {})
    }



}
