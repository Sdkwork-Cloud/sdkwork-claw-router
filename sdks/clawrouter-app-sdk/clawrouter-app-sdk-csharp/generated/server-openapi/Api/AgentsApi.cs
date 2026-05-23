using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.App.Models;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;

namespace Sdkwork.ClawRouter.App.Api
{
    public class AgentsApi
    {
        private readonly SdkHttpClient _client;

        public AgentsApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// List user agents
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentDefinitionsListResult?> AgentDefinitionsListAsync(int? page = null, int? pageSize = null, string? q = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
                new QueryParameterSpec("q", q, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AgentDefinitionsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/agents"), queryString));
        }

        /// <summary>
        /// Create user agent
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentDefinitionsCreateResult?> AgentDefinitionsCreateAsync(Sdkwork.ClawRouter.App.Models.AgentCreateRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AgentDefinitionsCreateResult>(ApiPaths.AppPath("/agents"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Retrieve agent run
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentRunsRetrieveResult?> AgentRunsRetrieveAsync(string runId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AgentRunsRetrieveResult>(ApiPaths.AppPath($"/agents/runs/{SerializePathParameter(runId, new PathParameterSpec("runId", "simple", false))}"));
        }

        /// <summary>
        /// Complete agent run
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentRunsSubmitResult?> AgentRunsSubmitAsync(string runId, Sdkwork.ClawRouter.App.Models.AgentRunCompleteRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AgentRunsSubmitResult>(ApiPaths.AppPath($"/agents/runs/{SerializePathParameter(runId, new PathParameterSpec("runId", "simple", false))}/complete"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// List agent run steps
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentRunStepsListResult?> AgentRunStepsListAsync(string runId, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AgentRunStepsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath($"/agents/runs/{SerializePathParameter(runId, new PathParameterSpec("runId", "simple", false))}/steps"), queryString));
        }

        /// <summary>
        /// Create agent run step
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentRunStepsCreateResult?> AgentRunStepsCreateAsync(string runId, Sdkwork.ClawRouter.App.Models.AgentRunStepCreateRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AgentRunStepsCreateResult>(ApiPaths.AppPath($"/agents/runs/{SerializePathParameter(runId, new PathParameterSpec("runId", "simple", false))}/steps"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Complete agent run step
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentRunStepsSubmitResult?> AgentRunStepsSubmitAsync(string runId, string stepId, Sdkwork.ClawRouter.App.Models.AgentRunStepCompleteRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AgentRunStepsSubmitResult>(ApiPaths.AppPath($"/agents/runs/{SerializePathParameter(runId, new PathParameterSpec("runId", "simple", false))}/steps/{SerializePathParameter(stepId, new PathParameterSpec("stepId", "simple", false))}/complete"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Retrieve agent session
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentSessionsRetrieveResult?> AgentSessionsRetrieveAsync(string sessionId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AgentSessionsRetrieveResult>(ApiPaths.AppPath($"/agents/sessions/{SerializePathParameter(sessionId, new PathParameterSpec("sessionId", "simple", false))}"));
        }

        /// <summary>
        /// List agent session runs
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentRunsListResult?> AgentRunsListAsync(string sessionId, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AgentRunsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath($"/agents/sessions/{SerializePathParameter(sessionId, new PathParameterSpec("sessionId", "simple", false))}/runs"), queryString));
        }

        /// <summary>
        /// Create agent run
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentRunsCreateResult?> AgentRunsCreateAsync(string sessionId, Sdkwork.ClawRouter.App.Models.AgentRunCreateRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AgentRunsCreateResult>(ApiPaths.AppPath($"/agents/sessions/{SerializePathParameter(sessionId, new PathParameterSpec("sessionId", "simple", false))}/runs"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Retrieve user agent
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentDefinitionsRetrieveResult?> AgentDefinitionsRetrieveAsync(string agentId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AgentDefinitionsRetrieveResult>(ApiPaths.AppPath($"/agents/{SerializePathParameter(agentId, new PathParameterSpec("agentId", "simple", false))}"));
        }

        /// <summary>
        /// List agent sessions
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentSessionsListResult?> AgentSessionsListAsync(string agentId, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.AgentSessionsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath($"/agents/{SerializePathParameter(agentId, new PathParameterSpec("agentId", "simple", false))}/sessions"), queryString));
        }

        /// <summary>
        /// Create agent session
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.AgentSessionsCreateResult?> AgentSessionsCreateAsync(string agentId, Sdkwork.ClawRouter.App.Models.AgentSessionCreateRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.AgentSessionsCreateResult>(ApiPaths.AppPath($"/agents/{SerializePathParameter(agentId, new PathParameterSpec("agentId", "simple", false))}/sessions"), body, null, requestHeaders, "application/json");
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
