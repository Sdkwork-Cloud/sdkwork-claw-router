package com.sdkwork.clawrouter.app.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.model.*;
import java.util.List;
import java.util.Map;

public class AiApi {
    private final HttpClient client;

    public AiApi(HttpClient client) {
        this.client = client;
    }

    /** List dashboard overview */
    public DashboardOverviewRetrieveResult dashboardOverviewRetrieve(String timeRange, String startTime, String endTime) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("time_range", timeRange, "form", true, false, null),
            new QueryParameterSpec("start_time", startTime, "form", true, false, null),
            new QueryParameterSpec("end_time", endTime, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/dashboard/overview"), query));
        return client.convertValue(raw, new TypeReference<DashboardOverviewRetrieveResult>() {});
    }

    /** List traces */
    public GatewayTracesListResult gatewayTracesList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/ai/gateway/traces"));
        return client.convertValue(raw, new TypeReference<GatewayTracesListResult>() {});
    }

    /** List generation history */
    public GenerationListResult generationList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/ai/generations"));
        return client.convertValue(raw, new TypeReference<GenerationListResult>() {});
    }

    /** List model rankings */
    public ModelRankingsListResult modelRankingsList(String rankScope, String vendorCode, String modality, String q, Integer limit) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("rank_scope", rankScope, "form", true, false, null),
            new QueryParameterSpec("vendor_code", vendorCode, "form", true, false, null),
            new QueryParameterSpec("modality", modality, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("limit", limit, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/model_rankings"), query));
        return client.convertValue(raw, new TypeReference<ModelRankingsListResult>() {});
    }

    /** List ranking vendor filters */
    public ModelVendorsListResult modelVendorsList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/ai/model_vendors"));
        return client.convertValue(raw, new TypeReference<ModelVendorsListResult>() {});
    }

    /** List models */
    public ModelsListResult modelsList(String billingMeter, String vendorCode, List<String> vendorCodes, List<String> modalities, List<String> capabilities, List<String> categories, List<String> groups, String q, Integer limit) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("billing_meter", billingMeter, "form", true, false, null),
            new QueryParameterSpec("vendor_code", vendorCode, "form", true, false, null),
            new QueryParameterSpec("vendor_codes", vendorCodes, "form", false, false, null),
            new QueryParameterSpec("modalities", modalities, "form", false, false, null),
            new QueryParameterSpec("capabilities", capabilities, "form", false, false, null),
            new QueryParameterSpec("categories", categories, "form", false, false, null),
            new QueryParameterSpec("groups", groups, "form", false, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("limit", limit, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/models"), query));
        return client.convertValue(raw, new TypeReference<ModelsListResult>() {});
    }

    /** List providers */
    public ProvidersListResult providersList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/ai/providers"));
        return client.convertValue(raw, new TypeReference<ProvidersListResult>() {});
    }

    /** List API keys */
    public RoutingApiKeysListResult routingApiKeysList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/ai/routing/api_keys"));
        return client.convertValue(raw, new TypeReference<RoutingApiKeysListResult>() {});
    }

    /** List channels */
    public RoutingChannelsListResult routingChannelsList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/ai/routing/channels"));
        return client.convertValue(raw, new TypeReference<RoutingChannelsListResult>() {});
    }

    /** Create channel */
    public RoutingChannelsCreateResult routingChannelsCreate(CreateRoutingChannelRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/ai/routing/channels"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<RoutingChannelsCreateResult>() {});
    }

    /** Delete channel */
    public RoutingChannelsDeleteResult routingChannelsDelete(String channelId) throws Exception {
        Object raw = client.delete(ApiPaths.appPath("/ai/routing/channels/" + serializePathParameter(channelId, new PathParameterSpec("channelId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<RoutingChannelsDeleteResult>() {});
    }

    /** Update channel */
    public RoutingChannelsUpdateResult routingChannelsUpdate(String channelId, UpdateRoutingChannelRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.appPath("/ai/routing/channels/" + serializePathParameter(channelId, new PathParameterSpec("channelId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<RoutingChannelsUpdateResult>() {});
    }

    /** Set channel status */
    public RoutingChannelsStatusUpdateResult routingChannelsStatusUpdate(String channelId, SetRoutingChannelStatusRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.appPath("/ai/routing/channels/" + serializePathParameter(channelId, new PathParameterSpec("channelId", "simple", false)) + "/status"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<RoutingChannelsStatusUpdateResult>() {});
    }

    /** Test channel */
    public RoutingChannelsVerifyResult routingChannelsVerify(String channelId, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.appPath("/ai/routing/channels/" + serializePathParameter(channelId, new PathParameterSpec("channelId", "simple", false)) + "/verify"), null, null, requestHeaders);
        return client.convertValue(raw, new TypeReference<RoutingChannelsVerifyResult>() {});
    }

    /** List request traces */
    public RoutingRequestTracesListResult routingRequestTracesList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/ai/routing/request_traces"));
        return client.convertValue(raw, new TypeReference<RoutingRequestTracesListResult>() {});
    }

    /** List strategy */
    public RoutingStrategyListResult routingStrategyList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/ai/routing/strategy"));
        return client.convertValue(raw, new TypeReference<RoutingStrategyListResult>() {});
    }

    /** Update strategy */
    public RoutingStrategyUpdateResult routingStrategyUpdate(UpdateRoutingStrategyRequest body) throws Exception {
        Object raw = client.put(ApiPaths.appPath("/ai/routing/strategy"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<RoutingStrategyUpdateResult>() {});
    }

    /** List usage data */
    public RoutingUsageListResult routingUsageList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/ai/routing/usage"));
        return client.convertValue(raw, new TypeReference<RoutingUsageListResult>() {});
    }

    /** List logs */
    public UsageLogsListResult usageLogsList(Integer page, Integer pageSize, String q, String status, String startTime, String endTime) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("start_time", startTime, "form", true, false, null),
            new QueryParameterSpec("end_time", endTime, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/usage/logs"), query));
        return client.convertValue(raw, new TypeReference<UsageLogsListResult>() {});
    }

    private record PathParameterSpec(String name, String style, boolean explode) {}

    private static String serializePathParameter(Object value, PathParameterSpec spec) {
        if (value == null) {
            return "";
        }
        String style = spec.style() == null || spec.style().isBlank() ? "simple" : spec.style();
        if (value instanceof Iterable<?> iterable) {
            return serializePathArray(spec.name(), iterable, style, spec.explode());
        }
        if (value instanceof Map<?, ?> map) {
            return serializePathObject(spec.name(), map, style, spec.explode());
        }
        return pathPrimitivePrefix(spec.name(), style) + pathEncode(String.valueOf(value));
    }

    private static String serializePathArray(String name, Iterable<?> values, String style, boolean explode) {
        List<String> serialized = new java.util.ArrayList<>();
        for (Object item : values) {
            if (item != null) {
                serialized.add(pathEncode(String.valueOf(item)));
            }
        }
        if (serialized.isEmpty()) {
            return pathPrefix(name, style);
        }
        if ("matrix".equals(style)) {
            if (explode) {
                List<String> parts = new java.util.ArrayList<>();
                for (String item : serialized) {
                    parts.add(";" + name + "=" + item);
                }
                return String.join("", parts);
            }
            return ";" + name + "=" + String.join(",", serialized);
        }
        String separator = explode ? "." : ",";
        return pathPrefix(name, style) + String.join(separator, serialized);
    }

    private static String serializePathObject(String name, Map<?, ?> values, String style, boolean explode) {
        List<String> entries = new java.util.ArrayList<>();
        List<String> exploded = new java.util.ArrayList<>();
        values.forEach((key, value) -> {
            if (value == null) {
                return;
            }
            String escapedKey = pathEncode(String.valueOf(key));
            String escapedValue = pathEncode(String.valueOf(value));
            if (explode) {
                if ("matrix".equals(style)) {
                    exploded.add(";" + escapedKey + "=" + escapedValue);
                } else {
                    exploded.add(escapedKey + "=" + escapedValue);
                }
            } else {
                entries.add(escapedKey);
                entries.add(escapedValue);
            }
        });
        if ("matrix".equals(style)) {
            if (explode) {
                return String.join("", exploded);
            }
            return ";" + name + "=" + String.join(",", entries);
        }
        if (explode) {
            String separator = "label".equals(style) ? "." : ",";
            return pathPrefix(name, style) + String.join(separator, exploded);
        }
        return pathPrefix(name, style) + String.join(",", entries);
    }

    private static String pathPrefix(String name, String style) {
        if ("label".equals(style)) {
            return ".";
        }
        if ("matrix".equals(style)) {
            return ";" + name;
        }
        return "";
    }

    private static String pathPrimitivePrefix(String name, String style) {
        if ("matrix".equals(style)) {
            return ";" + name + "=";
        }
        return pathPrefix(name, style);
    }

    private static String pathEncode(String value) {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20");
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
