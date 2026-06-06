package com.sdkwork.clawrouter.app.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.model.*;
import java.util.List;
import java.util.Map;

public class CommerceApi {
    private final HttpClient client;

    public CommerceApi(HttpClient client) {
        this.client = client;
    }

    /** Recharges Settings Retrieve */
    public RechargesSettingsRetrieveResult rechargesSettingsRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/recharges/settings"));
        return client.convertValue(raw, new TypeReference<RechargesSettingsRetrieveResult>() {});
    }




}
