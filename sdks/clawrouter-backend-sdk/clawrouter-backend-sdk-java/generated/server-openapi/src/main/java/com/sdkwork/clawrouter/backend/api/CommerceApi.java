package com.sdkwork.clawrouter.backend.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.backend.http.HttpClient;
import com.sdkwork.clawrouter.backend.model.*;
import java.util.List;
import java.util.Map;

public class CommerceApi {
    private final HttpClient client;

    public CommerceApi(HttpClient client) {
        this.client = client;
    }

    /** List category attribute bindings */
    public CatalogCategoryAttributesListResult catalogCategoryAttributesList(String categoryId, String attributeId, String status, String page, String pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("category_id", categoryId, "form", true, false, null),
            new QueryParameterSpec("attribute_id", attributeId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/category_attributes"), query));
        return client.convertValue(raw, new TypeReference<CatalogCategoryAttributesListResult>() {});
    }

    /** Create category attribute binding */
    public CatalogCategoryAttributesCreateResult catalogCategoryAttributesCreate(CommerceProductCategoryAttributeMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/catalog/category_attributes"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogCategoryAttributesCreateResult>() {});
    }

    /** Delete category attribute binding */
    public CatalogCategoryAttributesDeleteResult catalogCategoryAttributesDelete(String bindingId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/catalog/category_attributes/" + serializePathParameter(bindingId, new PathParameterSpec("bindingId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CatalogCategoryAttributesDeleteResult>() {});
    }

    /** Update category attribute binding */
    public CatalogCategoryAttributesUpdateResult catalogCategoryAttributesUpdate(String bindingId, CommerceProductCategoryAttributeMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/catalog/category_attributes/" + serializePathParameter(bindingId, new PathParameterSpec("bindingId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogCategoryAttributesUpdateResult>() {});
    }

    /** Initialize admin category seed datasets */
    public CatalogCategorySeedsCreateResult catalogCategorySeedsCreate(CommerceCategorySeedInitializeRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/catalog/category_seeds/initialize"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CatalogCategorySeedsCreateResult>() {});
    }

    /** Delete product SPU */
    public CatalogProductsDeleteResult catalogProductsDelete(String productId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/catalog/products/" + serializePathParameter(productId, new PathParameterSpec("productId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CatalogProductsDeleteResult>() {});
    }

    /** Delete product SKU */
    public CatalogSkusDeleteResult catalogSkusDelete(String skuId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/catalog/skus/" + serializePathParameter(skuId, new PathParameterSpec("skuId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CatalogSkusDeleteResult>() {});
    }

    /** Update inventory stock */
    public InventoryStocksUpdateResult inventoryStocksUpdate(String stockId, CommerceInventoryStockUpdateRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/inventory/stocks/" + serializePathParameter(stockId, new PathParameterSpec("stockId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<InventoryStocksUpdateResult>() {});
    }

    /** Memberships Members Status Update */
    public MembershipsMembersStatusUpdateResult membershipsMembersStatusUpdate(String membershipId, CommerceMembershipMemberStatusRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/memberships/members/" + serializePathParameter(membershipId, new PathParameterSpec("membershipId", "simple", false)) + "/status"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsMembersStatusUpdateResult>() {});
    }

    /** Memberships Package Groups Update */
    public MembershipsPackageGroupsUpdateResult membershipsPackageGroupsUpdate(String packageGroupId, CommerceMembershipPackageGroupMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.backendPath("/memberships/package_groups/" + serializePathParameter(packageGroupId, new PathParameterSpec("packageGroupId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPackageGroupsUpdateResult>() {});
    }

    /** Memberships Packages Update */
    public MembershipsPackagesUpdateResult membershipsPackagesUpdate(String packageId, CommerceMembershipPackageMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.backendPath("/memberships/packages/" + serializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPackagesUpdateResult>() {});
    }

    /** Memberships Plans Update */
    public MembershipsPlansUpdateResult membershipsPlansUpdate(String planId, CommerceMembershipPlanMutationRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.backendPath("/memberships/plans/" + serializePathParameter(planId, new PathParameterSpec("planId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<MembershipsPlansUpdateResult>() {});
    }

    /** Orders Retrieve */
    public OrdersRetrieveResult ordersRetrieve(String orderId) throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/orders/" + serializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<OrdersRetrieveResult>() {});
    }

    /** Payments Provider Accounts Delete */
    public PaymentsProviderAccountsDeleteResult paymentsProviderAccountsDelete(String providerAccountId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/payments/provider_accounts/" + serializePathParameter(providerAccountId, new PathParameterSpec("providerAccountId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<PaymentsProviderAccountsDeleteResult>() {});
    }

    /** Payments Provider Accounts Status Update */
    public PaymentsProviderAccountsStatusUpdateResult paymentsProviderAccountsStatusUpdate(String providerAccountId, CommercePaymentProviderAccountStatusUpdateRequest body, String idempotencyKey) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("Idempotency-Key", new HeaderParameterSpec(idempotencyKey, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/payments/provider_accounts/" + serializePathParameter(providerAccountId, new PathParameterSpec("providerAccountId", "simple", false)) + "/status"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<PaymentsProviderAccountsStatusUpdateResult>() {});
    }

    /** Payments Providers List */
    public PaymentsProvidersListResult paymentsProvidersList(String page, String pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/providers"), query));
        return client.convertValue(raw, new TypeReference<PaymentsProvidersListResult>() {});
    }

    /** Payments Runtime Snapshot Retrieve */
    public PaymentsRuntimeSnapshotRetrieveResult paymentsRuntimeSnapshotRetrieve(String environment) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("environment", environment, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/runtime/snapshot"), query));
        return client.convertValue(raw, new TypeReference<PaymentsRuntimeSnapshotRetrieveResult>() {});
    }

    /** Recharges Packages Delete */
    public RechargesPackagesDeleteResult rechargesPackagesDelete(String packageId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/recharges/packages/" + serializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<RechargesPackagesDeleteResult>() {});
    }

    /** Recharges Settings Retrieve */
    public RechargesSettingsRetrieveResult rechargesSettingsRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/recharges/settings"));
        return client.convertValue(raw, new TypeReference<RechargesSettingsRetrieveResult>() {});
    }

    /** Recharges Settings Update */
    public RechargesSettingsUpdateResult rechargesSettingsUpdate(CommerceRechargeSettingsUpdateRequest body) throws Exception {
        Object raw = client.put(ApiPaths.backendPath("/recharges/settings"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<RechargesSettingsUpdateResult>() {});
    }

    /** Shipments Tracking Events List */
    public ShipmentsTrackingEventsListResult shipmentsTrackingEventsList(String shipmentId, String page, String pageSize, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/shipments/" + serializePathParameter(shipmentId, new PathParameterSpec("shipmentId", "simple", false)) + "/tracking_events"), query));
        return client.convertValue(raw, new TypeReference<ShipmentsTrackingEventsListResult>() {});
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
