package com.sdkwork.clawrouter.backend

import com.sdkwork.common.core.SdkConfig
import com.sdkwork.clawrouter.backend.http.HttpClient
import com.sdkwork.clawrouter.backend.api.AgentsApi
import com.sdkwork.clawrouter.backend.api.AiApi
import com.sdkwork.clawrouter.backend.api.BillingApi
import com.sdkwork.clawrouter.backend.api.ContentApi
import com.sdkwork.clawrouter.backend.api.EcosystemApi
import com.sdkwork.clawrouter.backend.api.IamApi
import com.sdkwork.clawrouter.backend.api.IntegrationApi
import com.sdkwork.clawrouter.backend.api.PlatformApi
import com.sdkwork.clawrouter.backend.api.SystemApi

class SdkworkBackendClient {
    private val httpClient: HttpClient

    lateinit var agents: AgentsApi
    lateinit var ai: AiApi
    lateinit var billing: BillingApi
    lateinit var content: ContentApi
    lateinit var ecosystem: EcosystemApi
    lateinit var iam: IamApi
    lateinit var integration: IntegrationApi
    lateinit var platform: PlatformApi
    lateinit var system: SystemApi

    constructor(baseUrl: String) {
        this.httpClient = HttpClient(baseUrl)
        agents = AgentsApi(httpClient)
        ai = AiApi(httpClient)
        billing = BillingApi(httpClient)
        content = ContentApi(httpClient)
        ecosystem = EcosystemApi(httpClient)
        iam = IamApi(httpClient)
        integration = IntegrationApi(httpClient)
        platform = PlatformApi(httpClient)
        system = SystemApi(httpClient)
    }

    constructor(config: SdkConfig) {
        this.httpClient = HttpClient(config)
        agents = AgentsApi(httpClient)
        ai = AiApi(httpClient)
        billing = BillingApi(httpClient)
        content = ContentApi(httpClient)
        ecosystem = EcosystemApi(httpClient)
        iam = IamApi(httpClient)
        integration = IntegrationApi(httpClient)
        platform = PlatformApi(httpClient)
        system = SystemApi(httpClient)
    }

    fun setApiKey(apiKey: String): SdkworkBackendClient {
        httpClient.setApiKey(apiKey)
        return this
    }

    fun setAuthToken(token: String): SdkworkBackendClient {
        httpClient.setAuthToken(token)
        return this
    }

    fun setAccessToken(token: String): SdkworkBackendClient {
        httpClient.setAccessToken(token)
        return this
    }

    fun setHeader(key: String, value: String): SdkworkBackendClient {
        httpClient.setHeader(key, value)
        return this
    }
}
