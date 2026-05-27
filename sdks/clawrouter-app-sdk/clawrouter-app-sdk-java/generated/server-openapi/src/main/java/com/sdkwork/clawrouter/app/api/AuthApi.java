package com.sdkwork.clawrouter.app.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.model.*;
import java.util.List;
import java.util.Map;

public class AuthApi {
    private final HttpClient client;

    public AuthApi(HttpClient client) {
        this.client = client;
    }

    /** Retrieve OAuth authorization URL */
    public OauthAuthorizationUrlsRetrieveResult oauthAuthorizationUrlsRetrieve(String provider, String redirectUri, String state, String scope) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("provider", provider, "form", true, false, null),
            new QueryParameterSpec("redirect_uri", redirectUri, "form", true, false, null),
            new QueryParameterSpec("state", state, "form", true, false, null),
            new QueryParameterSpec("scope", scope, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/auth/oauth_authorization_urls"), query));
        return client.convertValue(raw, new TypeReference<OauthAuthorizationUrlsRetrieveResult>() {});
    }

    /** Create OAuth IAM session */
    public OauthSessionsCreateResult oauthSessionsCreate(IamOauthSessionCreateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/auth/oauth_sessions"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<OauthSessionsCreateResult>() {});
    }

    /** Create password reset request */
    public PasswordResetRequestsCreateResult passwordResetRequestsCreate(IamPasswordResetRequestCreateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/auth/password_reset_requests"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<PasswordResetRequestsCreateResult>() {});
    }

    /** Create password reset */
    public PasswordResetsCreateResult passwordResetsCreate(IamPasswordResetCreateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/auth/password_resets"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<PasswordResetsCreateResult>() {});
    }

    /** Create IAM registration */
    public RegistrationsCreateResult registrationsCreate(IamRegistrationCreateRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/auth/registrations"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<RegistrationsCreateResult>() {});
    }

    /** Create IAM session */
    public SessionsCreateResult sessionsCreate(IamSessionCreateRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/auth/sessions"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<SessionsCreateResult>() {});
    }

    /** Delete current IAM session */
    public SessionsCurrentDeleteResult sessionsCurrentDelete() throws Exception {
        Object raw = client.delete(ApiPaths.appPath("/auth/sessions/current"));
        return client.convertValue(raw, new TypeReference<SessionsCurrentDeleteResult>() {});
    }

    /** Retrieve current IAM session */
    public SessionsCurrentRetrieveResult sessionsCurrentRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/auth/sessions/current"));
        return client.convertValue(raw, new TypeReference<SessionsCurrentRetrieveResult>() {});
    }

    /** Update current IAM session */
    public SessionsCurrentUpdateResult sessionsCurrentUpdate(IamCurrentSessionUpdateRequest body) throws Exception {
        Object raw = client.patch(ApiPaths.appPath("/auth/sessions/current"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<SessionsCurrentUpdateResult>() {});
    }

    /** Refresh IAM session */
    public SessionsRefreshResult sessionsRefresh(IamSessionRefreshRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/auth/sessions/refresh"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<SessionsRefreshResult>() {});
    }

    /** Create verification code */
    public VerificationCodesCreateResult verificationCodesCreate(IamVerificationCodeCreateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/auth/verification_codes"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<VerificationCodesCreateResult>() {});
    }

    /** Verify verification code */
    public VerificationCodesVerifyResult verificationCodesVerify(IamVerificationCodeVerifyRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/auth/verification_codes/verify"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<VerificationCodesVerifyResult>() {});
    }


    private record QueryParameterSpec(String name, Object value, String style, boolean explode, boolean allowReserved, String contentType) {}

    private static String buildQueryString(List<QueryParameterSpec> parameters) throws Exception {
        List<String> pairs = new java.util.ArrayList<>();
        for (QueryParameterSpec parameter : parameters) {
            appendSerializedParameter(pairs, parameter);
        }
        return String.join("&", pairs);
    }

    private static void appendSerializedParameter(List<String> pairs, QueryParameterSpec parameter) throws Exception {
        if (parameter.value() == null) {
            return;
        }
        if (parameter.contentType() != null && !parameter.contentType().isBlank()) {
            String json = clientObjectMapper().writeValueAsString(parameter.value());
            pairs.add(urlEncode(parameter.name()) + "=" + encodeQueryValue(json, parameter.allowReserved()));
            return;
        }

        String style = parameter.style() == null || parameter.style().isBlank() ? "form" : parameter.style();
        Object value = parameter.value();
        if ("deepObject".equals(style) && value instanceof Map<?, ?> map) {
            appendDeepObjectParameter(pairs, parameter.name(), map, parameter.allowReserved());
        } else if (value instanceof Iterable<?> iterable) {
            appendArrayParameter(pairs, parameter.name(), iterable, style, parameter.explode(), parameter.allowReserved());
        } else if (value instanceof Map<?, ?> map) {
            appendObjectParameter(pairs, parameter.name(), map, style, parameter.explode(), parameter.allowReserved());
        } else {
            pairs.add(urlEncode(parameter.name()) + "=" + encodeQueryValue(String.valueOf(value), parameter.allowReserved()));
        }
    }

    private static void appendArrayParameter(List<String> pairs, String name, Iterable<?> values, String style, boolean explode, boolean allowReserved) {
        List<String> serialized = new java.util.ArrayList<>();
        for (Object item : values) {
            if (item != null) {
                serialized.add(String.valueOf(item));
            }
        }
        if (serialized.isEmpty()) {
            return;
        }
        if ("form".equals(style) && explode) {
            for (String item : serialized) {
                pairs.add(urlEncode(name) + "=" + encodeQueryValue(item, allowReserved));
            }
            return;
        }
        pairs.add(urlEncode(name) + "=" + encodeQueryValue(String.join(",", serialized), allowReserved));
    }

    private static void appendObjectParameter(List<String> pairs, String name, Map<?, ?> values, String style, boolean explode, boolean allowReserved) {
        List<String> serialized = new java.util.ArrayList<>();
        values.forEach((key, value) -> {
            if (value == null) {
                return;
            }
            if ("form".equals(style) && explode) {
                pairs.add(urlEncode(String.valueOf(key)) + "=" + encodeQueryValue(String.valueOf(value), allowReserved));
            } else {
                serialized.add(String.valueOf(key));
                serialized.add(String.valueOf(value));
            }
        });
        if (!serialized.isEmpty()) {
            pairs.add(urlEncode(name) + "=" + encodeQueryValue(String.join(",", serialized), allowReserved));
        }
    }

    private static void appendDeepObjectParameter(List<String> pairs, String name, Map<?, ?> values, boolean allowReserved) {
        values.forEach((key, value) -> {
            if (value != null) {
                pairs.add(urlEncode(name + "[" + key + "]") + "=" + encodeQueryValue(String.valueOf(value), allowReserved));
            }
        });
    }

    private static String encodeQueryValue(String value, boolean allowReserved) {
        String encoded = urlEncode(value);
        if (!allowReserved) {
            return encoded;
        }
        return encoded
            .replace("%3A", ":").replace("%2F", "/").replace("%3F", "?").replace("%23", "#")
            .replace("%5B", "[").replace("%5D", "]").replace("%40", "@").replace("%21", "!")
            .replace("%24", "$").replace("%26", "&").replace("%27", "'").replace("%28", "(")
            .replace("%29", ")").replace("%2A", "*").replace("%2B", "+").replace("%2C", ",")
            .replace("%3B", ";").replace("%3D", "=");
    }

    private static com.fasterxml.jackson.databind.ObjectMapper clientObjectMapper() {
        return new com.fasterxml.jackson.databind.ObjectMapper();
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
