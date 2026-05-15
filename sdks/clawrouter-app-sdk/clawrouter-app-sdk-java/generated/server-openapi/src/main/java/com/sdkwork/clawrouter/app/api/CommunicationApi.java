package com.sdkwork.clawrouter.app.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.model.*;
import java.util.List;
import java.util.Map;

public class CommunicationApi {
    private final HttpClient client;
    
    public CommunicationApi(HttpClient client) {
        this.client = client;
    }

    /** List messages */
    public NotificationsListResult notificationsList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/communication/notifications"));
        return client.convertValue(raw, new TypeReference<NotificationsListResult>() {});
    }




}
