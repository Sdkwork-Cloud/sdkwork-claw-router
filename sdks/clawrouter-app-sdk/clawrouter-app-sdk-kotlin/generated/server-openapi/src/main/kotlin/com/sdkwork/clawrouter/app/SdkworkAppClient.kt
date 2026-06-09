package com.sdkwork.clawrouter.app

import com.sdkwork.common.core.SdkConfig
import com.sdkwork.clawrouter.app.http.HttpClient
import com.sdkwork.clawrouter.app.api.AgentsApi
import com.sdkwork.clawrouter.app.api.AiApi
import com.sdkwork.clawrouter.app.api.AuthApi
import com.sdkwork.clawrouter.app.api.ChatApi
import com.sdkwork.clawrouter.app.api.ContentApi
import com.sdkwork.clawrouter.app.api.EcosystemApi
import com.sdkwork.clawrouter.app.api.IamApi
import com.sdkwork.clawrouter.app.api.MemoryApi
import com.sdkwork.clawrouter.app.api.NotificationApi
import com.sdkwork.clawrouter.app.api.PlatformApi
import com.sdkwork.clawrouter.app.api.RuntimeApi
import com.sdkwork.clawrouter.app.api.SdkReferenceApi
import com.sdkwork.clawrouter.app.api.SystemApi

open class SdkworkAppClient {
    private val httpClient: HttpClient

    lateinit var agents: AgentsApi
    lateinit var ai: AiApi
    lateinit var auth: AuthApi
    lateinit var chat: ChatApi
    lateinit var content: ContentApi
    lateinit var ecosystem: EcosystemApi
    lateinit var iam: IamApi
    lateinit var memory: MemoryApi
    lateinit var notification: NotificationApi
    lateinit var platform: PlatformApi
    lateinit var runtime: RuntimeApi
    lateinit var sdkReference: SdkReferenceApi
    lateinit var system: SystemApi

    constructor(baseUrl: String) {
        this.httpClient = HttpClient(baseUrl)
        agents = AgentsApi(httpClient)
        ai = AiApi(httpClient)
        auth = AuthApi(httpClient)
        chat = ChatApi(httpClient)
        content = ContentApi(httpClient)
        ecosystem = EcosystemApi(httpClient)
        iam = IamApi(httpClient)
        memory = MemoryApi(httpClient)
        notification = NotificationApi(httpClient)
        platform = PlatformApi(httpClient)
        runtime = RuntimeApi(httpClient)
        sdkReference = SdkReferenceApi(httpClient)
        system = SystemApi(httpClient)
    }

    constructor(config: SdkConfig) {
        this.httpClient = HttpClient(config)
        agents = AgentsApi(httpClient)
        ai = AiApi(httpClient)
        auth = AuthApi(httpClient)
        chat = ChatApi(httpClient)
        content = ContentApi(httpClient)
        ecosystem = EcosystemApi(httpClient)
        iam = IamApi(httpClient)
        memory = MemoryApi(httpClient)
        notification = NotificationApi(httpClient)
        platform = PlatformApi(httpClient)
        runtime = RuntimeApi(httpClient)
        sdkReference = SdkReferenceApi(httpClient)
        system = SystemApi(httpClient)
    }
    fun setAuthToken(token: String): SdkworkAppClient {
        httpClient.setAuthToken(token)
        return this
    }

    fun setAccessToken(token: String): SdkworkAppClient {
        httpClient.setAccessToken(token)
        return this
    }

    fun setHeader(key: String, value: String): SdkworkAppClient {
        httpClient.setHeader(key, value)
        return this
    }
}
