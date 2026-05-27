package com.sdkwork.clawrouter.app.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.model.*;
import java.util.List;
import java.util.Map;

public class SdkReferenceApi {
    private final HttpClient client;

    public SdkReferenceApi(HttpClient client) {
        this.client = client;
    }

    /** Generate SDK archive */
    public ArchivesCreateResult archivesCreate(SdkReferenceArchiveGenerateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/sdk_reference/archives"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<ArchivesCreateResult>() {});
    }

    /** Generate SDK reference documentation */
    public DocumentationCreateResult documentationCreate(SdkReferenceDocumentationGenerateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/sdk_reference/documentation"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<DocumentationCreateResult>() {});
    }




}
