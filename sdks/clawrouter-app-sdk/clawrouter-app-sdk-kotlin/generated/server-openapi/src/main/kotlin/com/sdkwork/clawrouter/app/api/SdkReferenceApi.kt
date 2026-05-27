package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class SdkReferenceApi(private val client: HttpClient) {

    /** Generate SDK archive */
    suspend fun archivesCreate(body: SdkReferenceArchiveGenerateRequest): ArchivesCreateResult? {
        val raw = client.post(ApiPaths.appPath("/sdk_reference/archives"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<ArchivesCreateResult>() {})
    }

    /** Generate SDK reference documentation */
    suspend fun documentationCreate(body: SdkReferenceDocumentationGenerateRequest): DocumentationCreateResult? {
        val raw = client.post(ApiPaths.appPath("/sdk_reference/documentation"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<DocumentationCreateResult>() {})
    }



}
