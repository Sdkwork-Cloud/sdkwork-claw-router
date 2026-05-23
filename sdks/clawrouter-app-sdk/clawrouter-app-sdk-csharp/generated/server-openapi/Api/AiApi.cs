using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.App.Models;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;

namespace Sdkwork.ClawRouter.App.Api
{
    public class AiApi
    {
        private readonly SdkHttpClient _client;

        public AiApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// List dashboard overview
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.DashboardOverviewRetrieveResult?> DashboardOverviewRetrieveAsync(string? timeRange = null, string? startTime = null, string? endTime = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("time_range", timeRange, "form", true, false, null),
                new QueryParameterSpec("start_time", startTime, "form", true, false, null),
                new QueryParameterSpec("end_time", endTime, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.DashboardOverviewRetrieveResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/ai/dashboard/overview"), queryString));
        }

        /// <summary>
        /// List traces
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.GatewayTracesListResult?> GatewayTracesListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.GatewayTracesListResult>(ApiPaths.AppPath("/ai/gateway/traces"));
        }

        /// <summary>
        /// List generation history
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.GenerationListResult?> GenerationListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.GenerationListResult>(ApiPaths.AppPath("/ai/generations"));
        }

        /// <summary>
        /// List model rankings
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.ModelRankingsListResult?> ModelRankingsListAsync(string? rankScope = null, string? vendorCode = null, string? modality = null, string? q = null, int? limit = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("rank_scope", rankScope, "form", true, false, null),
                new QueryParameterSpec("vendor_code", vendorCode, "form", true, false, null),
                new QueryParameterSpec("modality", modality, "form", true, false, null),
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("limit", limit, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.ModelRankingsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/ai/model_rankings"), queryString));
        }

        /// <summary>
        /// List ranking vendor filters
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.ModelVendorsListResult?> ModelVendorsListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.ModelVendorsListResult>(ApiPaths.AppPath("/ai/model_vendors"));
        }

        /// <summary>
        /// List models
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.ModelsListResult?> ModelsListAsync(string? billingMeter = null, string? vendorCode = null, List<string>? vendorCodes = null, List<string>? modalities = null, List<string>? capabilities = null, List<string>? categories = null, List<string>? groups = null, string? q = null, int? limit = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("billing_meter", billingMeter, "form", true, false, null),
                new QueryParameterSpec("vendor_code", vendorCode, "form", true, false, null),
                new QueryParameterSpec("vendor_codes", vendorCodes, "form", false, false, null),
                new QueryParameterSpec("modalities", modalities, "form", false, false, null),
                new QueryParameterSpec("capabilities", capabilities, "form", false, false, null),
                new QueryParameterSpec("categories", categories, "form", false, false, null),
                new QueryParameterSpec("groups", groups, "form", false, false, null),
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("limit", limit, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.ModelsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/ai/models"), queryString));
        }

        /// <summary>
        /// List providers
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.ProvidersListResult?> ProvidersListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.ProvidersListResult>(ApiPaths.AppPath("/ai/providers"));
        }

        /// <summary>
        /// List API keys
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingApiKeysListResult?> RoutingApiKeysListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RoutingApiKeysListResult>(ApiPaths.AppPath("/ai/routing/api_keys"));
        }

        /// <summary>
        /// List channels
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingChannelsListResult?> RoutingChannelsListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RoutingChannelsListResult>(ApiPaths.AppPath("/ai/routing/channels"));
        }

        /// <summary>
        /// Create channel
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingChannelsCreateResult?> RoutingChannelsCreateAsync(Sdkwork.ClawRouter.App.Models.CreateRoutingChannelRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.RoutingChannelsCreateResult>(ApiPaths.AppPath("/ai/routing/channels"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Delete channel
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingChannelsDeleteResult?> RoutingChannelsDeleteAsync(string channelId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.App.Models.RoutingChannelsDeleteResult>(ApiPaths.AppPath($"/ai/routing/channels/{SerializePathParameter(channelId, new PathParameterSpec("channelId", "simple", false))}"));
        }

        /// <summary>
        /// Update channel
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingChannelsUpdateResult?> RoutingChannelsUpdateAsync(string channelId, Sdkwork.ClawRouter.App.Models.UpdateRoutingChannelRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.App.Models.RoutingChannelsUpdateResult>(ApiPaths.AppPath($"/ai/routing/channels/{SerializePathParameter(channelId, new PathParameterSpec("channelId", "simple", false))}"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Set channel status
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingChannelsStatusUpdateResult?> RoutingChannelsStatusUpdateAsync(string channelId, Sdkwork.ClawRouter.App.Models.SetRoutingChannelStatusRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PutAsync<Sdkwork.ClawRouter.App.Models.RoutingChannelsStatusUpdateResult>(ApiPaths.AppPath($"/ai/routing/channels/{SerializePathParameter(channelId, new PathParameterSpec("channelId", "simple", false))}/status"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Test channel
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingChannelsVerifyResult?> RoutingChannelsVerifyAsync(string channelId, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.RoutingChannelsVerifyResult>(ApiPaths.AppPath($"/ai/routing/channels/{SerializePathParameter(channelId, new PathParameterSpec("channelId", "simple", false))}/verify"), null, null, requestHeaders);
        }

        /// <summary>
        /// List request traces
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingRequestTracesListResult?> RoutingRequestTracesListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RoutingRequestTracesListResult>(ApiPaths.AppPath("/ai/routing/request_traces"));
        }

        /// <summary>
        /// List strategy
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingStrategyListResult?> RoutingStrategyListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RoutingStrategyListResult>(ApiPaths.AppPath("/ai/routing/strategy"));
        }

        /// <summary>
        /// Update strategy
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingStrategyUpdateResult?> RoutingStrategyUpdateAsync(Sdkwork.ClawRouter.App.Models.UpdateRoutingStrategyRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.App.Models.RoutingStrategyUpdateResult>(ApiPaths.AppPath("/ai/routing/strategy"), body, null, null, "application/json");
        }

        /// <summary>
        /// List usage data
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RoutingUsageListResult?> RoutingUsageListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RoutingUsageListResult>(ApiPaths.AppPath("/ai/routing/usage"));
        }

        /// <summary>
        /// List logs
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.UsageLogsListResult?> UsageLogsListAsync(int? page = null, int? pageSize = null, string? q = null, string? status = null, string? startTime = null, string? endTime = null)
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
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.UsageLogsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/ai/usage/logs"), queryString));
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
