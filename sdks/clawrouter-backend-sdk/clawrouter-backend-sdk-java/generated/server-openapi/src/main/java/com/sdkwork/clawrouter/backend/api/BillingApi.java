package com.sdkwork.clawrouter.backend.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.backend.http.HttpClient;
import com.sdkwork.clawrouter.backend.model.*;
import java.util.List;
import java.util.Map;

public class BillingApi {
    private final HttpClient client;
    
    public BillingApi(HttpClient client) {
        this.client = client;
    }

    /** List batches */
    public CouponBatchesListResult couponBatchesList(String couponId, String status, Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("coupon_id", couponId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/coupon_batches"), query));
        return client.convertValue(raw, new TypeReference<CouponBatchesListResult>() {});
    }

    /** Generate batch */
    public CouponBatchesCreateResult couponBatchesCreate(AdminCouponBatchGenerateRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/billing/coupon_batches"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CouponBatchesCreateResult>() {});
    }

    /** List promo codes */
    public CouponCodesListResult couponCodesList(String couponId, String batchId, String status, Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("coupon_id", couponId, "form", true, false, null),
            new QueryParameterSpec("batch_id", batchId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/coupon_codes"), query));
        return client.convertValue(raw, new TypeReference<CouponCodesListResult>() {});
    }

    /** Update promo code status */
    public CouponCodesStatusUpdateResult couponCodesStatusUpdate(String codeId, AdminPromoCodeStatusUpdateRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.patch(ApiPaths.backendPath("/billing/coupon_codes/" + serializePathParameter(codeId, new PathParameterSpec("codeId", "simple", false)) + "/status"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CouponCodesStatusUpdateResult>() {});
    }

    /** List coupons */
    public CouponsListResult couponsList(String status, Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/coupons"), query));
        return client.convertValue(raw, new TypeReference<CouponsListResult>() {});
    }

    /** Create coupon */
    public CouponsCreateResult couponsCreate(AdminCouponCreateRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/billing/coupons"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CouponsCreateResult>() {});
    }

    /** Delete coupon */
    public CouponsDeleteResult couponsDelete(String couponId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/billing/coupons/" + serializePathParameter(couponId, new PathParameterSpec("couponId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CouponsDeleteResult>() {});
    }

    /** Update coupon */
    public CouponsUpdateResult couponsUpdate(String couponId, AdminCouponCreateRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.backendPath("/billing/coupons/" + serializePathParameter(couponId, new PathParameterSpec("couponId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<CouponsUpdateResult>() {});
    }

    /** List exchange rules */
    public ExchangeRulesListResult exchangeRulesList(String sourceAssetType, String targetAssetType, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("source_asset_type", sourceAssetType, "form", true, false, null),
            new QueryParameterSpec("target_asset_type", targetAssetType, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/exchange_rules"), query));
        return client.convertValue(raw, new TypeReference<ExchangeRulesListResult>() {});
    }

    /** Upsert exchange rule */
    public ExchangeRulesUpdateResult exchangeRulesUpdate(CommerceExchangeRuleUpsertRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.backendPath("/billing/exchange_rules"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<ExchangeRulesUpdateResult>() {});
    }

    /** List transactions */
    public FinanceLedgerListResult financeLedgerList(Integer page, Integer pageSize, String q, String status, String startTime, String endTime) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("start_time", startTime, "form", true, false, null),
            new QueryParameterSpec("end_time", endTime, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/finance/ledger"), query));
        return client.convertValue(raw, new TypeReference<FinanceLedgerListResult>() {});
    }

    /** List billing */
    public FinanceUsageStatementsListResult financeUsageStatementsList(Integer page, Integer pageSize, String q, String status, String startTime, String endTime) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("start_time", startTime, "form", true, false, null),
            new QueryParameterSpec("end_time", endTime, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/finance/usage_statements"), query));
        return client.convertValue(raw, new TypeReference<FinanceUsageStatementsListResult>() {});
    }

    /** List payment attempts */
    public PaymentsAttemptsListResult paymentsAttemptsList(String provider, String status, Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("provider", provider, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/payments/attempts"), query));
        return client.convertValue(raw, new TypeReference<PaymentsAttemptsListResult>() {});
    }

    /** List recharge packages */
    public RechargesPackagesListResult rechargesPackagesList(String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/recharges/packages"), query));
        return client.convertValue(raw, new TypeReference<RechargesPackagesListResult>() {});
    }

    /** Create recharge package */
    public RechargesPackagesCreateResult rechargesPackagesCreate(CommerceRechargePackageMutationRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/billing/recharges/packages"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<RechargesPackagesCreateResult>() {});
    }

    /** Delete recharge package */
    public RechargesPackagesDeleteResult rechargesPackagesDelete(String packageId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/billing/recharges/packages/" + serializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<RechargesPackagesDeleteResult>() {});
    }

    /** Update recharge package */
    public RechargesPackagesUpdateResult rechargesPackagesUpdate(String packageId, CommerceRechargePackageMutationRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.put(ApiPaths.backendPath("/billing/recharges/packages/" + serializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false)) + ""), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<RechargesPackagesUpdateResult>() {});
    }

    /** List recharge records */
    public RechargesRecordsListResult rechargesRecordsList(String userId, String status, Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("user_id", userId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/recharges/records"), query));
        return client.convertValue(raw, new TypeReference<RechargesRecordsListResult>() {});
    }

    /** Retrieve recharge record */
    public RechargesRecordsRetrieveResult rechargesRecordsRetrieve(String orderNo) throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/billing/recharges/records/" + serializePathParameter(orderNo, new PathParameterSpec("orderNo", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<RechargesRecordsRetrieveResult>() {});
    }

    /** List referral stats */
    public ReferralsStatsListResult referralsStatsList() throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/billing/referrals/stats"));
        return client.convertValue(raw, new TypeReference<ReferralsStatsListResult>() {});
    }

    /** List redemption records */
    public UsersCouponsListResult usersCouponsList(String userId, String status, Integer page, Integer pageSize, String cursor) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("user_id", userId, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/users/coupons"), query));
        return client.convertValue(raw, new TypeReference<UsersCouponsListResult>() {});
    }

    /** Update balance */
    public UsersBalanceAdjustmentsCreateResult usersBalanceAdjustmentsCreate(String userId, AdminUserBalanceAdjustmentRequest body, String xRequestId) throws Exception {
        Map<String, String> requestHeaders = buildRequestHeaders(
                Map.of("X-Request-Id", new HeaderParameterSpec(xRequestId, "simple", false, null)),
                Map.of()
        );
        Object raw = client.post(ApiPaths.backendPath("/billing/users/" + serializePathParameter(userId, new PathParameterSpec("userId", "simple", false)) + "/balance_adjustments"), body, null, requestHeaders, "application/json");
        return client.convertValue(raw, new TypeReference<UsersBalanceAdjustmentsCreateResult>() {});
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
