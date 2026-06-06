package com.sdkwork.clawrouter.backend.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.backend.http.HttpClient;
import com.sdkwork.clawrouter.backend.model.*;
import java.util.List;
import java.util.Map;

public class PlatformApi {
    private final HttpClient client;

    public PlatformApi(HttpClient client) {
        this.client = client;
    }

    /** List apps */
    public AppsListResult appsList(String q, String status, String marketStatus, String appType, String categoryId, String page, String pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("market_status", marketStatus, "form", true, false, null),
            new QueryParameterSpec("app_type", appType, "form", true, false, null),
            new QueryParameterSpec("category_id", categoryId, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/platform/apps"), query));
        return client.convertValue(raw, new TypeReference<AppsListResult>() {});
    }

    /** Create app */
    public AppsCreateResult appsCreate(AdminAppCreateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/platform/apps"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<AppsCreateResult>() {});
    }

    /** List app categories */
    public AppsCategoriesListResult appsCategoriesList() throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/platform/apps/categories"));
        return client.convertValue(raw, new TypeReference<AppsCategoriesListResult>() {});
    }

    /** Create app category */
    public AppsCategoriesCreateResult appsCategoriesCreate(AdminAppCategoryCreateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/platform/apps/categories"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<AppsCategoriesCreateResult>() {});
    }

    /** Delete app category */
    public AppsCategoriesDeleteResult appsCategoriesDelete(String categoryId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/platform/apps/categories/" + serializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<AppsCategoriesDeleteResult>() {});
    }

    /** Update app category */
    public AppsCategoriesUpdateResult appsCategoriesUpdate(String categoryId, AdminAppCategoryUpdateRequest body) throws Exception {
        Object raw = client.put(ApiPaths.backendPath("/platform/apps/categories/" + serializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false)) + ""), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<AppsCategoriesUpdateResult>() {});
    }

    /** List app templates */
    public AppsTemplatesListResult appsTemplatesList(String q, String publishStatus, String templateType, String runtime, String categoryId, String page, String pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("publish_status", publishStatus, "form", true, false, null),
            new QueryParameterSpec("template_type", templateType, "form", true, false, null),
            new QueryParameterSpec("runtime", runtime, "form", true, false, null),
            new QueryParameterSpec("category_id", categoryId, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/platform/apps/templates"), query));
        return client.convertValue(raw, new TypeReference<AppsTemplatesListResult>() {});
    }

    /** Create app template */
    public AppsTemplatesCreateResult appsTemplatesCreate(AdminAppTemplateCreateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/platform/apps/templates"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<AppsTemplatesCreateResult>() {});
    }

    /** Delete app template */
    public AppsTemplatesDeleteResult appsTemplatesDelete(String templateId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/platform/apps/templates/" + serializePathParameter(templateId, new PathParameterSpec("templateId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<AppsTemplatesDeleteResult>() {});
    }

    /** List app template */
    public AppsTemplatesRetrieveResult appsTemplatesRetrieve(String templateId) throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/platform/apps/templates/" + serializePathParameter(templateId, new PathParameterSpec("templateId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<AppsTemplatesRetrieveResult>() {});
    }

    /** Update app template */
    public AppsTemplatesUpdateResult appsTemplatesUpdate(String templateId, AdminAppTemplateUpdateRequest body) throws Exception {
        Object raw = client.put(ApiPaths.backendPath("/platform/apps/templates/" + serializePathParameter(templateId, new PathParameterSpec("templateId", "simple", false)) + ""), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<AppsTemplatesUpdateResult>() {});
    }

    /** Publish app template */
    public AppsTemplatesPublishResult appsTemplatesPublish(String templateId) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/platform/apps/templates/" + serializePathParameter(templateId, new PathParameterSpec("templateId", "simple", false)) + "/publish"), null);
        return client.convertValue(raw, new TypeReference<AppsTemplatesPublishResult>() {});
    }

    /** Offline app template */
    public AppsTemplatesUnpublishResult appsTemplatesUnpublish(String templateId) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/platform/apps/templates/" + serializePathParameter(templateId, new PathParameterSpec("templateId", "simple", false)) + "/unpublish"), null);
        return client.convertValue(raw, new TypeReference<AppsTemplatesUnpublishResult>() {});
    }

    /** Delete app */
    public AppsDeleteResult appsDelete(String appId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/platform/apps/" + serializePathParameter(appId, new PathParameterSpec("appId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<AppsDeleteResult>() {});
    }

    /** List app */
    public AppsRetrieveResult appsRetrieve(String appId) throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/platform/apps/" + serializePathParameter(appId, new PathParameterSpec("appId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<AppsRetrieveResult>() {});
    }

    /** Update app */
    public AppsUpdateResult appsUpdate(String appId, AdminAppUpdateRequest body) throws Exception {
        Object raw = client.put(ApiPaths.backendPath("/platform/apps/" + serializePathParameter(appId, new PathParameterSpec("appId", "simple", false)) + ""), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<AppsUpdateResult>() {});
    }

    /** Disable app */
    public AppsDisableResult appsDisable(String appId) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/platform/apps/" + serializePathParameter(appId, new PathParameterSpec("appId", "simple", false)) + "/disable"), null);
        return client.convertValue(raw, new TypeReference<AppsDisableResult>() {});
    }

    /** Enable app */
    public AppsEnableResult appsEnable(String appId) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/platform/apps/" + serializePathParameter(appId, new PathParameterSpec("appId", "simple", false)) + "/enable"), null);
        return client.convertValue(raw, new TypeReference<AppsEnableResult>() {});
    }

    /** Publish app */
    public AppsPublishResult appsPublish(String appId) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/platform/apps/" + serializePathParameter(appId, new PathParameterSpec("appId", "simple", false)) + "/publish"), null);
        return client.convertValue(raw, new TypeReference<AppsPublishResult>() {});
    }

    /** Offline app */
    public AppsUnpublishResult appsUnpublish(String appId) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/platform/apps/" + serializePathParameter(appId, new PathParameterSpec("appId", "simple", false)) + "/unpublish"), null);
        return client.convertValue(raw, new TypeReference<AppsUnpublishResult>() {});
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


    private static String urlEncode(String value) {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8);
    }
}
