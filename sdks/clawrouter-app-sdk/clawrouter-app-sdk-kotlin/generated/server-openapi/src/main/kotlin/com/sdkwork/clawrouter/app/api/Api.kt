package com.sdkwork.clawrouter.app.api

import com.sdkwork.clawrouter.app.http.HttpClient

/**
 * API modules for clawrouter-app-sdk
 */
class Api(private val client: HttpClient) {
    val agents: AgentsApi = AgentsApi(client)
    val ai: AiApi = AiApi(client)
    val chat: ChatApi = ChatApi(client)
    val content: ContentApi = ContentApi(client)
    val ecosystem: EcosystemApi = EcosystemApi(client)
    val iam: IamApi = IamApi(client)
    val memory: MemoryApi = MemoryApi(client)
    val notification: NotificationApi = NotificationApi(client)
    val platform: PlatformApi = PlatformApi(client)
    val system: SystemApi = SystemApi(client)
    val commerce: CommerceApi = CommerceApi(client)
    val runtime: RuntimeApi = RuntimeApi(client)
    val sdkReference: SdkReferenceApi = SdkReferenceApi(client)
}
