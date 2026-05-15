package com.sdkwork.clawrouter.app.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.model.*;
import java.util.List;
import java.util.Map;

public class IamApi {
    private final HttpClient client;
    
    public IamApi(HttpClient client) {
        this.client = client;
    }

    /** List keys */
    public ApiKeysListResult apiKeysList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/iam/api_keys"));
        return client.convertValue(raw, new TypeReference<ApiKeysListResult>() {});
    }

    /** Create key */
    public ApiKeysCreateResult apiKeysCreate(CreateApiKeyRequest body, String idempotencyKey, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null), "X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/iam/api_keys"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<ApiKeysCreateResult>() {});
    }

    /** Retrieve current IAM user */
    public UsersCurrentRetrieveResult usersCurrentRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/iam/users/current"));
        return client.convertValue(raw, new TypeReference<UsersCurrentRetrieveResult>() {});
    }

    /** List settings */
    public UsersSettingsRetrieveResult usersSettingsRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/iam/users/settings"));
        return client.convertValue(raw, new TypeReference<UsersSettingsRetrieveResult>() {});
    }

    /** Update settings */
    public UsersSettingsUpdateResult usersSettingsUpdate(UpdateSettingsRequest body) throws Exception {
        Object raw = client.put(ApiPaths.appPath("/iam/users/settings"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<UsersSettingsUpdateResult>() {});
    }



    private record HeaderParameterSpec(Object value, String style, boolean explode, String contentType) {}

    private static Map<String, String> buildRequestHeaders(Map<String, HeaderParameterSpec> headers, Map<String, HeaderParameterSpec> cookies) throws Exception {
        Map<String, String> requestHeaders = new java.util.LinkedHashMap<>();
        for (Map.Entry<String, HeaderParameterSpec> entry : headers.entrySet()) {
            String serialized = serializeParameterValue(entry.getValue());
            if (serialized != null) {
                requestHeaders.put(entry.getKey(), serialized);
            }
        }

        String cookieHeader = buildCookieHeader(cookies);
        if (cookieHeader != null && !cookieHeader.isEmpty()) {
            requestHeaders.merge("Cookie", cookieHeader, (left, right) -> left + "; " + right);
        }

        return requestHeaders.isEmpty() ? null : requestHeaders;
    }

    private static String buildCookieHeader(Map<String, HeaderParameterSpec> cookies) throws Exception {
        java.util.List<String> pairs = new java.util.ArrayList<>();
        for (Map.Entry<String, HeaderParameterSpec> entry : cookies.entrySet()) {
            String serialized = serializeParameterValue(entry.getValue());
            if (serialized != null) {
                pairs.add(urlEncode(entry.getKey()) + "=" + urlEncode(serialized));
            }
        }
        return String.join("; ", pairs);
    }

    private static String serializeParameterValue(HeaderParameterSpec parameter) throws Exception {
        if (parameter == null || parameter.value() == null) {
            return null;
        }
        Object value = parameter.value();
        if (parameter.contentType() != null && !parameter.contentType().isBlank()) {
            return headerObjectMapper().writeValueAsString(value);
        }
        if (value instanceof Iterable<?> iterable) {
            java.util.List<String> values = new java.util.ArrayList<>();
            for (Object item : iterable) {
                if (item != null) {
                    values.add(String.valueOf(item));
                }
            }
            return String.join(",", values);
        }
        if (value instanceof Map<?, ?> map) {
            java.util.List<String> values = new java.util.ArrayList<>();
            map.forEach((key, item) -> {
                if (item == null) {
                    return;
                }
                if (parameter.explode()) {
                    values.add(String.valueOf(key) + "=" + String.valueOf(item));
                } else {
                    values.add(String.valueOf(key));
                    values.add(String.valueOf(item));
                }
            });
            return String.join(",", values);
        }
        return String.valueOf(value);
    }

    private static com.fasterxml.jackson.databind.ObjectMapper headerObjectMapper() {
        return new com.fasterxml.jackson.databind.ObjectMapper();
    }

    private static String urlEncode(String value) {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8);
    }
}
