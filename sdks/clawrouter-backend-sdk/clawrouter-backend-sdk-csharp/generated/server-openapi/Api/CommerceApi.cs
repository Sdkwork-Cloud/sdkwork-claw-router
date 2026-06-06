using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.Backend.Models;
using SdkHttpClient = Sdkwork.ClawRouter.Backend.Http.HttpClient;

namespace Sdkwork.ClawRouter.Backend.Api
{
    public class CommerceApi
    {
        private readonly SdkHttpClient _client;

        public CommerceApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// List category attribute bindings
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogCategoryAttributesListResult?> CatalogCategoryAttributesListAsync(string? categoryId = null, string? attributeId = null, string? status = null, string? page = null, string? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("category_id", categoryId, "form", true, false, null),
                new QueryParameterSpec("attribute_id", attributeId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CatalogCategoryAttributesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/catalog/category_attributes"), queryString));
        }

        /// <summary>
        /// Create category attribute binding
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogCategoryAttributesCreateResult?> CatalogCategoryAttributesCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceProductCategoryAttributeMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.CatalogCategoryAttributesCreateResult>(ApiPaths.BackendPath("/catalog/category_attributes"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Delete category attribute binding
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogCategoryAttributesDeleteResult?> CatalogCategoryAttributesDeleteAsync(string bindingId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.CatalogCategoryAttributesDeleteResult>(ApiPaths.BackendPath($"/catalog/category_attributes/{SerializePathParameter(bindingId, new PathParameterSpec("bindingId", "simple", false))}"));
        }

        /// <summary>
        /// Update category attribute binding
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogCategoryAttributesUpdateResult?> CatalogCategoryAttributesUpdateAsync(string bindingId, Sdkwork.ClawRouter.Backend.Models.CommerceProductCategoryAttributeMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.CatalogCategoryAttributesUpdateResult>(ApiPaths.BackendPath($"/catalog/category_attributes/{SerializePathParameter(bindingId, new PathParameterSpec("bindingId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Initialize admin category seed datasets
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogCategorySeedsCreateResult?> CatalogCategorySeedsCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceCategorySeedInitializeRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.CatalogCategorySeedsCreateResult>(ApiPaths.BackendPath("/catalog/category_seeds/initialize"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Delete product SPU
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogProductsDeleteResult?> CatalogProductsDeleteAsync(string productId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.CatalogProductsDeleteResult>(ApiPaths.BackendPath($"/catalog/products/{SerializePathParameter(productId, new PathParameterSpec("productId", "simple", false))}"));
        }

        /// <summary>
        /// Delete product SKU
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CatalogSkusDeleteResult?> CatalogSkusDeleteAsync(string skuId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.CatalogSkusDeleteResult>(ApiPaths.BackendPath($"/catalog/skus/{SerializePathParameter(skuId, new PathParameterSpec("skuId", "simple", false))}"));
        }

        /// <summary>
        /// Update inventory stock
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.InventoryStocksUpdateResult?> InventoryStocksUpdateAsync(string stockId, Sdkwork.ClawRouter.Backend.Models.CommerceInventoryStockUpdateRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.InventoryStocksUpdateResult>(ApiPaths.BackendPath($"/inventory/stocks/{SerializePathParameter(stockId, new PathParameterSpec("stockId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Members Status Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsMembersStatusUpdateResult?> MembershipsMembersStatusUpdateAsync(string membershipId, Sdkwork.ClawRouter.Backend.Models.CommerceMembershipMemberStatusRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsMembersStatusUpdateResult>(ApiPaths.BackendPath($"/memberships/members/{SerializePathParameter(membershipId, new PathParameterSpec("membershipId", "simple", false))}/status"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Package Groups Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPackageGroupsUpdateResult?> MembershipsPackageGroupsUpdateAsync(string packageGroupId, Sdkwork.ClawRouter.Backend.Models.CommerceMembershipPackageGroupMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPackageGroupsUpdateResult>(ApiPaths.BackendPath($"/memberships/package_groups/{SerializePathParameter(packageGroupId, new PathParameterSpec("packageGroupId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Packages Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPackagesUpdateResult?> MembershipsPackagesUpdateAsync(string packageId, Sdkwork.ClawRouter.Backend.Models.CommerceMembershipPackageMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPackagesUpdateResult>(ApiPaths.BackendPath($"/memberships/packages/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Memberships Plans Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.MembershipsPlansUpdateResult?> MembershipsPlansUpdateAsync(string planId, Sdkwork.ClawRouter.Backend.Models.CommerceMembershipPlanMutationRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.MembershipsPlansUpdateResult>(ApiPaths.BackendPath($"/memberships/plans/{SerializePathParameter(planId, new PathParameterSpec("planId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Orders Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.OrdersRetrieveResult?> OrdersRetrieveAsync(string orderId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.OrdersRetrieveResult>(ApiPaths.BackendPath($"/orders/{SerializePathParameter(orderId, new PathParameterSpec("orderId", "simple", false))}"));
        }

        /// <summary>
        /// Payments Provider Accounts Delete
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsDeleteResult?> PaymentsProviderAccountsDeleteAsync(string providerAccountId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsDeleteResult>(ApiPaths.BackendPath($"/payments/provider_accounts/{SerializePathParameter(providerAccountId, new PathParameterSpec("providerAccountId", "simple", false))}"));
        }

        /// <summary>
        /// Payments Provider Accounts Status Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsStatusUpdateResult?> PaymentsProviderAccountsStatusUpdateAsync(string providerAccountId, Sdkwork.ClawRouter.Backend.Models.CommercePaymentProviderAccountStatusUpdateRequest body, string idempotencyKey)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsProviderAccountsStatusUpdateResult>(ApiPaths.BackendPath($"/payments/provider_accounts/{SerializePathParameter(providerAccountId, new PathParameterSpec("providerAccountId", "simple", false))}/status"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Payments Providers List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsProvidersListResult?> PaymentsProvidersListAsync(string? page = null, string? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsProvidersListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/providers"), queryString));
        }

        /// <summary>
        /// Payments Runtime Snapshot Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsRuntimeSnapshotRetrieveResult?> PaymentsRuntimeSnapshotRetrieveAsync(string? environment = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("environment", environment, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsRuntimeSnapshotRetrieveResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/payments/runtime/snapshot"), queryString));
        }

        /// <summary>
        /// Recharges Packages Delete
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesDeleteResult?> RechargesPackagesDeleteAsync(string packageId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesDeleteResult>(ApiPaths.BackendPath($"/recharges/packages/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"));
        }

        /// <summary>
        /// Recharges Settings Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesSettingsRetrieveResult?> RechargesSettingsRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.RechargesSettingsRetrieveResult>(ApiPaths.BackendPath("/recharges/settings"));
        }

        /// <summary>
        /// Recharges Settings Update
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesSettingsUpdateResult?> RechargesSettingsUpdateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceRechargeSettingsUpdateRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.RechargesSettingsUpdateResult>(ApiPaths.BackendPath("/recharges/settings"), body, null, null, "application/json");
        }

        /// <summary>
        /// Shipments Tracking Events List
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.ShipmentsTrackingEventsListResult?> ShipmentsTrackingEventsListAsync(string shipmentId, string? page = null, string? pageSize = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.ShipmentsTrackingEventsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath($"/shipments/{SerializePathParameter(shipmentId, new PathParameterSpec("shipmentId", "simple", false))}/tracking_events"), queryString));
        }

        private sealed record PathParameterSpec(string Name, string Style, bool Explode);

        private static string SerializePathParameter(object? value, PathParameterSpec spec)
        {
            if (value is null)
            {
                return string.Empty;
            }
            var style = string.IsNullOrWhiteSpace(spec.Style) ? "simple" : spec.Style;
            if (value is System.Collections.IDictionary dictionary)
            {
                return SerializePathObject(spec.Name, dictionary, style, spec.Explode);
            }
            if (value is System.Collections.IEnumerable enumerable && value is not string)
            {
                return SerializePathArray(spec.Name, enumerable, style, spec.Explode);
            }
            return PathPrimitivePrefix(spec.Name, style) + Uri.EscapeDataString(value.ToString() ?? string.Empty);
        }

        private static string SerializePathArray(string name, System.Collections.IEnumerable values, string style, bool explode)
        {
            var serialized = new List<string>();
            foreach (var item in values)
            {
                if (item is not null)
                {
                    serialized.Add(Uri.EscapeDataString(item.ToString() ?? string.Empty));
                }
            }
            if (serialized.Count == 0)
            {
                return PathPrefix(name, style);
            }
            if (style == "matrix")
            {
                if (explode)
                {
                    var parts = new List<string>();
                    foreach (var item in serialized)
                    {
                        parts.Add(";" + name + "=" + item);
                    }
                    return string.Join(string.Empty, parts);
                }
                return ";" + name + "=" + string.Join(",", serialized);
            }
            var separator = explode ? "." : ",";
            return PathPrefix(name, style) + string.Join(separator, serialized);
        }

        private static string SerializePathObject(string name, System.Collections.IDictionary values, string style, bool explode)
        {
            var entries = new List<string>();
            var exploded = new List<string>();
            foreach (System.Collections.DictionaryEntry item in values)
            {
                if (item.Value is null)
                {
                    continue;
                }
                var escapedKey = Uri.EscapeDataString(item.Key.ToString() ?? string.Empty);
                var escapedValue = Uri.EscapeDataString(item.Value.ToString() ?? string.Empty);
                if (explode)
                {
                    exploded.Add(style == "matrix" ? ";" + escapedKey + "=" + escapedValue : escapedKey + "=" + escapedValue);
                }
                else
                {
                    entries.Add(escapedKey);
                    entries.Add(escapedValue);
                }
            }
            if (style == "matrix")
            {
                return explode ? string.Join(string.Empty, exploded) : ";" + name + "=" + string.Join(",", entries);
            }
            if (explode)
            {
                var separator = style == "label" ? "." : ",";
                return PathPrefix(name, style) + string.Join(separator, exploded);
            }
            return PathPrefix(name, style) + string.Join(",", entries);
        }

        private static string PathPrefix(string name, string style)
        {
            return style switch
            {
                "label" => ".",
                "matrix" => ";" + name,
                _ => string.Empty,
            };
        }

        private static string PathPrimitivePrefix(string name, string style)
        {
            return style == "matrix" ? ";" + name + "=" : PathPrefix(name, style);
        }

        private sealed record QueryParameterSpec(
            string Name,
            object? Value,
            string Style,
            bool Explode,
            bool AllowReserved,
            string? ContentType);

        private static string BuildQueryString(IEnumerable<QueryParameterSpec> parameters)
        {
            var pairs = new List<string>();
            foreach (var parameter in parameters)
            {
                AppendSerializedParameter(pairs, parameter);
            }
            return string.Join("&", pairs);
        }

        private static void AppendSerializedParameter(List<string> pairs, QueryParameterSpec parameter)
        {
            if (parameter.Value is null)
            {
                return;
            }

            if (!string.IsNullOrWhiteSpace(parameter.ContentType))
            {
                var json = System.Text.Json.JsonSerializer.Serialize(parameter.Value);
                pairs.Add(Uri.EscapeDataString(parameter.Name) + "=" + EncodeQueryValue(json, parameter.AllowReserved));
                return;
            }

            var style = string.IsNullOrWhiteSpace(parameter.Style) ? "form" : parameter.Style;
            if (style == "deepObject" && parameter.Value is System.Collections.IDictionary deepObject)
            {
                AppendDeepObjectParameter(pairs, parameter.Name, deepObject, parameter.AllowReserved);
            }
            else if (parameter.Value is System.Collections.IEnumerable enumerable && parameter.Value is not string && parameter.Value is not System.Collections.IDictionary)
            {
                AppendArrayParameter(pairs, parameter.Name, enumerable, style, parameter.Explode, parameter.AllowReserved);
            }
            else if (parameter.Value is System.Collections.IDictionary dictionary)
            {
                AppendObjectParameter(pairs, parameter.Name, dictionary, style, parameter.Explode, parameter.AllowReserved);
            }
            else
            {
                pairs.Add(Uri.EscapeDataString(parameter.Name) + "=" + EncodeQueryValue(parameter.Value.ToString() ?? string.Empty, parameter.AllowReserved));
            }
        }

        private static void AppendArrayParameter(List<string> pairs, string name, System.Collections.IEnumerable values, string style, bool explode, bool allowReserved)
        {
            var serialized = new List<string>();
            foreach (var item in values)
            {
                if (item is not null)
                {
                    serialized.Add(item.ToString() ?? string.Empty);
                }
            }
            if (serialized.Count == 0)
            {
                return;
            }
            if (style == "form" && explode)
            {
                foreach (var item in serialized)
                {
                    pairs.Add(Uri.EscapeDataString(name) + "=" + EncodeQueryValue(item, allowReserved));
                }
                return;
            }
            pairs.Add(Uri.EscapeDataString(name) + "=" + EncodeQueryValue(string.Join(",", serialized), allowReserved));
        }

        private static void AppendObjectParameter(List<string> pairs, string name, System.Collections.IDictionary values, string style, bool explode, bool allowReserved)
        {
            var serialized = new List<string>();
            foreach (System.Collections.DictionaryEntry item in values)
            {
                if (item.Value is null)
                {
                    continue;
                }
                if (style == "form" && explode)
                {
                    pairs.Add(Uri.EscapeDataString(item.Key.ToString() ?? string.Empty) + "=" + EncodeQueryValue(item.Value.ToString() ?? string.Empty, allowReserved));
                }
                else
                {
                    serialized.Add(item.Key.ToString() ?? string.Empty);
                    serialized.Add(item.Value.ToString() ?? string.Empty);
                }
            }
            if (serialized.Count > 0)
            {
                pairs.Add(Uri.EscapeDataString(name) + "=" + EncodeQueryValue(string.Join(",", serialized), allowReserved));
            }
        }

        private static void AppendDeepObjectParameter(List<string> pairs, string name, System.Collections.IDictionary values, bool allowReserved)
        {
            foreach (System.Collections.DictionaryEntry item in values)
            {
                if (item.Value is not null)
                {
                    pairs.Add(Uri.EscapeDataString(name + "[" + item.Key + "]") + "=" + EncodeQueryValue(item.Value.ToString() ?? string.Empty, allowReserved));
                }
            }
        }

        private static string EncodeQueryValue(string value, bool allowReserved)
        {
            var encoded = Uri.EscapeDataString(value);
            if (!allowReserved)
            {
                return encoded;
            }
            return encoded
                .Replace("%3A", ":").Replace("%2F", "/").Replace("%3F", "?").Replace("%23", "#")
                .Replace("%5B", "[").Replace("%5D", "]").Replace("%40", "@").Replace("%21", "!")
                .Replace("%24", "$").Replace("%26", "&").Replace("%27", "'").Replace("%28", "(")
                .Replace("%29", ")").Replace("%2A", "*").Replace("%2B", "+").Replace("%2C", ",")
                .Replace("%3B", ";").Replace("%3D", "=");
        }

        private sealed record HeaderParameterSpec(object? Value, string Style, bool Explode, string? ContentType);

        private static Dictionary<string, string>? BuildRequestHeaders(
            Dictionary<string, HeaderParameterSpec> headers,
            Dictionary<string, HeaderParameterSpec> cookies)
        {
            var requestHeaders = new Dictionary<string, string>();
            foreach (var item in headers)
            {
                var serialized = SerializeParameterValue(item.Value);
                if (serialized is not null)
                {
                    requestHeaders[item.Key] = serialized;
                }
            }

            var cookieHeader = BuildCookieHeader(cookies);
            if (!string.IsNullOrEmpty(cookieHeader))
            {
                requestHeaders["Cookie"] = requestHeaders.TryGetValue("Cookie", out var existing) && !string.IsNullOrEmpty(existing)
                    ? existing + "; " + cookieHeader
                    : cookieHeader;
            }

            return requestHeaders.Count == 0 ? null : requestHeaders;
        }

        private static string BuildCookieHeader(Dictionary<string, HeaderParameterSpec> cookies)
        {
            var pairs = new List<string>();
            foreach (var item in cookies)
            {
                var serialized = SerializeParameterValue(item.Value);
                if (serialized is not null)
                {
                    pairs.Add(Uri.EscapeDataString(item.Key) + "=" + Uri.EscapeDataString(serialized));
                }
            }
            return string.Join("; ", pairs);
        }

        private static string? SerializeParameterValue(HeaderParameterSpec? parameter)
        {
            var value = parameter?.Value;
            if (value is null)
            {
                return null;
            }
            if (!string.IsNullOrWhiteSpace(parameter!.ContentType))
            {
                return System.Text.Json.JsonSerializer.Serialize(value);
            }
            if (value is System.Collections.IEnumerable enumerable && value is not string)
            {
                var values = new List<string>();
                foreach (var item in enumerable)
                {
                    if (item is not null)
                    {
                        values.Add(item.ToString() ?? string.Empty);
                    }
                }
                return string.Join(",", values);
            }
            if (value is System.Collections.IDictionary dictionary)
            {
                var values = new List<string>();
                foreach (System.Collections.DictionaryEntry item in dictionary)
                {
                    if (item.Value is null)
                    {
                        continue;
                    }
                    if (parameter.Explode)
                    {
                        values.Add((item.Key.ToString() ?? string.Empty) + "=" + (item.Value.ToString() ?? string.Empty));
                    }
                    else
                    {
                        values.Add(item.Key.ToString() ?? string.Empty);
                        values.Add(item.Value.ToString() ?? string.Empty);
                    }
                }
                return string.Join(",", values);
            }
            return value.ToString();
        }
    }
}
