using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.Backend.Models;
using SdkHttpClient = Sdkwork.ClawRouter.Backend.Http.HttpClient;

namespace Sdkwork.ClawRouter.Backend.Api
{
    public class PlatformApi
    {
        private readonly SdkHttpClient _client;

        public PlatformApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// List apps
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsListResult?> AppsListAsync(string? q = null, string? status = null, string? marketStatus = null, string? appType = null, int? categoryId = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("status", status, "form", true, false, null),
                new QueryParameterSpec("market_status", marketStatus, "form", true, false, null),
                new QueryParameterSpec("app_type", appType, "form", true, false, null),
                new QueryParameterSpec("category_id", categoryId, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.AppsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/platform/apps"), queryString));
        }

        /// <summary>
        /// Create app
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsCreateResult?> AppsCreateAsync(Sdkwork.ClawRouter.Backend.Models.AdminAppCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.AppsCreateResult>(ApiPaths.BackendPath("/platform/apps"), body, null, null, "application/json");
        }

        /// <summary>
        /// List app categories
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsCategoriesListResult?> AppsCategoriesListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.AppsCategoriesListResult>(ApiPaths.BackendPath("/platform/apps/categories"));
        }

        /// <summary>
        /// Create app category
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsCategoriesCreateResult?> AppsCategoriesCreateAsync(Sdkwork.ClawRouter.Backend.Models.AdminAppCategoryCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.AppsCategoriesCreateResult>(ApiPaths.BackendPath("/platform/apps/categories"), body, null, null, "application/json");
        }

        /// <summary>
        /// Delete app category
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsCategoriesDeleteResult?> AppsCategoriesDeleteAsync(string categoryId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.AppsCategoriesDeleteResult>(ApiPaths.BackendPath($"/platform/apps/categories/{SerializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false))}"));
        }

        /// <summary>
        /// Update app category
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsCategoriesUpdateResult?> AppsCategoriesUpdateAsync(string categoryId, Sdkwork.ClawRouter.Backend.Models.AdminAppCategoryUpdateRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.AppsCategoriesUpdateResult>(ApiPaths.BackendPath($"/platform/apps/categories/{SerializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false))}"), body, null, null, "application/json");
        }

        /// <summary>
        /// List app templates
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesListResult?> AppsTemplatesListAsync(string? q = null, string? publishStatus = null, string? templateType = null, string? runtime = null, int? categoryId = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("publish_status", publishStatus, "form", true, false, null),
                new QueryParameterSpec("template_type", templateType, "form", true, false, null),
                new QueryParameterSpec("runtime", runtime, "form", true, false, null),
                new QueryParameterSpec("category_id", categoryId, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/platform/apps/templates"), queryString));
        }

        /// <summary>
        /// Create app template
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesCreateResult?> AppsTemplatesCreateAsync(Sdkwork.ClawRouter.Backend.Models.AdminAppTemplateCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesCreateResult>(ApiPaths.BackendPath("/platform/apps/templates"), body, null, null, "application/json");
        }

        /// <summary>
        /// Delete app template
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesDeleteResult?> AppsTemplatesDeleteAsync(string templateId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesDeleteResult>(ApiPaths.BackendPath($"/platform/apps/templates/{SerializePathParameter(templateId, new PathParameterSpec("templateId", "simple", false))}"));
        }

        /// <summary>
        /// List app template
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesRetrieveResult?> AppsTemplatesRetrieveAsync(string templateId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesRetrieveResult>(ApiPaths.BackendPath($"/platform/apps/templates/{SerializePathParameter(templateId, new PathParameterSpec("templateId", "simple", false))}"));
        }

        /// <summary>
        /// Update app template
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesUpdateResult?> AppsTemplatesUpdateAsync(string templateId, Sdkwork.ClawRouter.Backend.Models.AdminAppTemplateUpdateRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesUpdateResult>(ApiPaths.BackendPath($"/platform/apps/templates/{SerializePathParameter(templateId, new PathParameterSpec("templateId", "simple", false))}"), body, null, null, "application/json");
        }

        /// <summary>
        /// Publish app template
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesPublishResult?> AppsTemplatesPublishAsync(string templateId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesPublishResult>(ApiPaths.BackendPath($"/platform/apps/templates/{SerializePathParameter(templateId, new PathParameterSpec("templateId", "simple", false))}/publish"), null);
        }

        /// <summary>
        /// Offline app template
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesUnpublishResult?> AppsTemplatesUnpublishAsync(string templateId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.AppsTemplatesUnpublishResult>(ApiPaths.BackendPath($"/platform/apps/templates/{SerializePathParameter(templateId, new PathParameterSpec("templateId", "simple", false))}/unpublish"), null);
        }

        /// <summary>
        /// Delete app
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsDeleteResult?> AppsDeleteAsync(string appId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.AppsDeleteResult>(ApiPaths.BackendPath($"/platform/apps/{SerializePathParameter(appId, new PathParameterSpec("appId", "simple", false))}"));
        }

        /// <summary>
        /// List app
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsRetrieveResult?> AppsRetrieveAsync(string appId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.AppsRetrieveResult>(ApiPaths.BackendPath($"/platform/apps/{SerializePathParameter(appId, new PathParameterSpec("appId", "simple", false))}"));
        }

        /// <summary>
        /// Update app
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsUpdateResult?> AppsUpdateAsync(string appId, Sdkwork.ClawRouter.Backend.Models.AdminAppUpdateRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.AppsUpdateResult>(ApiPaths.BackendPath($"/platform/apps/{SerializePathParameter(appId, new PathParameterSpec("appId", "simple", false))}"), body, null, null, "application/json");
        }

        /// <summary>
        /// Disable app
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsDisableResult?> AppsDisableAsync(string appId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.AppsDisableResult>(ApiPaths.BackendPath($"/platform/apps/{SerializePathParameter(appId, new PathParameterSpec("appId", "simple", false))}/disable"), null);
        }

        /// <summary>
        /// Enable app
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsEnableResult?> AppsEnableAsync(string appId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.AppsEnableResult>(ApiPaths.BackendPath($"/platform/apps/{SerializePathParameter(appId, new PathParameterSpec("appId", "simple", false))}/enable"), null);
        }

        /// <summary>
        /// Publish app
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsPublishResult?> AppsPublishAsync(string appId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.AppsPublishResult>(ApiPaths.BackendPath($"/platform/apps/{SerializePathParameter(appId, new PathParameterSpec("appId", "simple", false))}/publish"), null);
        }

        /// <summary>
        /// Offline app
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.AppsUnpublishResult?> AppsUnpublishAsync(string appId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.AppsUnpublishResult>(ApiPaths.BackendPath($"/platform/apps/{SerializePathParameter(appId, new PathParameterSpec("appId", "simple", false))}/unpublish"), null);
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

    }
}
