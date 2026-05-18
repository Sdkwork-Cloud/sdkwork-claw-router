using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.Backend.Models;
using SdkHttpClient = Sdkwork.ClawRouter.Backend.Http.HttpClient;

namespace Sdkwork.ClawRouter.Backend.Api
{
    public class BillingApi
    {
        private readonly SdkHttpClient _client;

        public BillingApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// List batches
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CouponBatchesListResult?> CouponBatchesListAsync(string? couponId = null, string? status = null, int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("coupon_id", couponId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CouponBatchesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/billing/coupon_batches"), queryString));
        }

        /// <summary>
        /// Generate batch
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CouponBatchesCreateResult?> CouponBatchesCreateAsync(Sdkwork.ClawRouter.Backend.Models.AdminCouponBatchGenerateRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.CouponBatchesCreateResult>(ApiPaths.BackendPath("/billing/coupon_batches"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List promo codes
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CouponCodesListResult?> CouponCodesListAsync(string? couponId = null, string? batchId = null, string? status = null, int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("coupon_id", couponId, "form", true, false, null),
                new QueryParameterSpec("batch_id", batchId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CouponCodesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/billing/coupon_codes"), queryString));
        }

        /// <summary>
        /// Update promo code status
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CouponCodesStatusUpdateResult?> CouponCodesStatusUpdateAsync(string codeId, Sdkwork.ClawRouter.Backend.Models.AdminPromoCodeStatusUpdateRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PatchAsync<Sdkwork.ClawRouter.Backend.Models.CouponCodesStatusUpdateResult>(ApiPaths.BackendPath($"/billing/coupon_codes/{SerializePathParameter(codeId, new PathParameterSpec("codeId", "simple", false))}/status"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List coupons
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CouponsListResult?> CouponsListAsync(string? status = null, int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.CouponsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/billing/coupons"), queryString));
        }

        /// <summary>
        /// Create coupon
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CouponsCreateResult?> CouponsCreateAsync(Sdkwork.ClawRouter.Backend.Models.AdminCouponCreateRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.CouponsCreateResult>(ApiPaths.BackendPath("/billing/coupons"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Delete coupon
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CouponsDeleteResult?> CouponsDeleteAsync(string couponId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.CouponsDeleteResult>(ApiPaths.BackendPath($"/billing/coupons/{SerializePathParameter(couponId, new PathParameterSpec("couponId", "simple", false))}"));
        }

        /// <summary>
        /// Update coupon
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.CouponsUpdateResult?> CouponsUpdateAsync(string couponId, Sdkwork.ClawRouter.Backend.Models.AdminCouponCreateRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.CouponsUpdateResult>(ApiPaths.BackendPath($"/billing/coupons/{SerializePathParameter(couponId, new PathParameterSpec("couponId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List exchange rules
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.ExchangeRulesListResult?> ExchangeRulesListAsync(string? sourceAssetType = null, string? targetAssetType = null, string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("source_asset_type", sourceAssetType, "form", true, false, null),
                new QueryParameterSpec("target_asset_type", targetAssetType, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.ExchangeRulesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/billing/exchange_rules"), queryString));
        }

        /// <summary>
        /// Upsert exchange rule
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.ExchangeRulesUpdateResult?> ExchangeRulesUpdateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceExchangeRuleUpsertRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.ExchangeRulesUpdateResult>(ApiPaths.BackendPath("/billing/exchange_rules"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List transactions
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.FinanceLedgerListResult?> FinanceLedgerListAsync(int? page = null, int? pageSize = null, string? q = null, string? status = null, string? startTime = null, string? endTime = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("start_time", startTime, "form", true, false, null),
                new QueryParameterSpec("end_time", endTime, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.FinanceLedgerListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/billing/finance/ledger"), queryString));
        }

        /// <summary>
        /// List billing
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.FinanceUsageStatementsListResult?> FinanceUsageStatementsListAsync(int? page = null, int? pageSize = null, string? q = null, string? status = null, string? startTime = null, string? endTime = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("start_time", startTime, "form", true, false, null),
                new QueryParameterSpec("end_time", endTime, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.FinanceUsageStatementsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/billing/finance/usage_statements"), queryString));
        }

        /// <summary>
        /// List payment attempts
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.PaymentsAttemptsListResult?> PaymentsAttemptsListAsync(string? provider = null, string? status = null, int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("provider", provider, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.PaymentsAttemptsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/billing/payments/attempts"), queryString));
        }

        /// <summary>
        /// List recharge packages
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesListResult?> RechargesPackagesListAsync(string? status = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("status", status, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/billing/recharges/packages"), queryString));
        }

        /// <summary>
        /// Create recharge package
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesCreateResult?> RechargesPackagesCreateAsync(Sdkwork.ClawRouter.Backend.Models.CommerceRechargePackageMutationRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesCreateResult>(ApiPaths.BackendPath("/billing/recharges/packages"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Delete recharge package
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesDeleteResult?> RechargesPackagesDeleteAsync(string packageId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesDeleteResult>(ApiPaths.BackendPath($"/billing/recharges/packages/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"));
        }

        /// <summary>
        /// Update recharge package
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesUpdateResult?> RechargesPackagesUpdateAsync(string packageId, Sdkwork.ClawRouter.Backend.Models.CommerceRechargePackageMutationRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.RechargesPackagesUpdateResult>(ApiPaths.BackendPath($"/billing/recharges/packages/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List recharge records
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesRecordsListResult?> RechargesRecordsListAsync(string? userId = null, string? status = null, int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("user_id", userId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.RechargesRecordsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/billing/recharges/records"), queryString));
        }

        /// <summary>
        /// Retrieve recharge record
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.RechargesRecordsRetrieveResult?> RechargesRecordsRetrieveAsync(string orderNo)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.RechargesRecordsRetrieveResult>(ApiPaths.BackendPath($"/billing/recharges/records/{SerializePathParameter(orderNo, new PathParameterSpec("orderNo", "simple", false))}"));
        }

        /// <summary>
        /// List referral stats
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.ReferralsStatsListResult?> ReferralsStatsListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.ReferralsStatsListResult>(ApiPaths.BackendPath("/billing/referrals/stats"));
        }

        /// <summary>
        /// List redemption records
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.UsersCouponsListResult?> UsersCouponsListAsync(string? userId = null, string? status = null, int? page = null, int? pageSize = null, string? cursor = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("user_id", userId, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("cursor", cursor, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.UsersCouponsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/billing/users/coupons"), queryString));
        }

        /// <summary>
        /// Update balance
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.UsersBalanceAdjustmentsCreateResult?> UsersBalanceAdjustmentsCreateAsync(string userId, Sdkwork.ClawRouter.Backend.Models.AdminUserBalanceAdjustmentRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.UsersBalanceAdjustmentsCreateResult>(ApiPaths.BackendPath($"/billing/users/{SerializePathParameter(userId, new PathParameterSpec("userId", "simple", false))}/balance_adjustments"), body, null, requestHeaders, "application/json");
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
