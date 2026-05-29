using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.Backend.Models;
using SdkHttpClient = Sdkwork.ClawRouter.Backend.Http.HttpClient;

namespace Sdkwork.ClawRouter.Backend.Api
{
    public class EcosystemApi
    {
        private readonly SdkHttpClient _client;

        public EcosystemApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// List skills
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsListResult?> SkillsListAsync(string? q = null, string? marketStatus = null, string? reviewStatus = null, string? visibility = null, bool? enabled = null, string? categoryId = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("market_status", marketStatus, "form", true, false, null),
                new QueryParameterSpec("review_status", reviewStatus, "form", true, false, null),
                new QueryParameterSpec("visibility", visibility, "form", true, false, null),
                new QueryParameterSpec("enabled", enabled, "form", true, false, null),
                new QueryParameterSpec("category_id", categoryId, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.SkillsListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/ecosystem/skills"), queryString));
        }

        /// <summary>
        /// Create skill
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsCreateResult?> SkillsCreateAsync(Sdkwork.ClawRouter.Backend.Models.AdminSkillCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsCreateResult>(ApiPaths.BackendPath("/ecosystem/skills"), body, null, null, "application/json");
        }

        /// <summary>
        /// List skill categories
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsCategoriesListResult?> SkillsCategoriesListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.SkillsCategoriesListResult>(ApiPaths.BackendPath("/ecosystem/skills/categories"));
        }

        /// <summary>
        /// Create skill category
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsCategoriesCreateResult?> SkillsCategoriesCreateAsync(Sdkwork.ClawRouter.Backend.Models.AdminSkillCategoryCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsCategoriesCreateResult>(ApiPaths.BackendPath("/ecosystem/skills/categories"), body, null, null, "application/json");
        }

        /// <summary>
        /// Delete skill category
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsCategoriesDeleteResult?> SkillsCategoriesDeleteAsync(string categoryId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.SkillsCategoriesDeleteResult>(ApiPaths.BackendPath($"/ecosystem/skills/categories/{SerializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false))}"));
        }

        /// <summary>
        /// Update skill category
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsCategoriesUpdateResult?> SkillsCategoriesUpdateAsync(string categoryId, Sdkwork.ClawRouter.Backend.Models.AdminSkillCategoryUpdateRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.SkillsCategoriesUpdateResult>(ApiPaths.BackendPath($"/ecosystem/skills/categories/{SerializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false))}"), body, null, null, "application/json");
        }

        /// <summary>
        /// List skill packages
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsPackageListResult?> SkillsPackageListAsync(string? q = null, bool? enabled = null, string? categoryId = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("enabled", enabled, "form", true, false, null),
                new QueryParameterSpec("category_id", categoryId, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.SkillsPackageListResult>(ApiPaths.AppendQueryString(ApiPaths.BackendPath("/ecosystem/skills/package"), queryString));
        }

        /// <summary>
        /// Create skill package
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsPackageCreateResult?> SkillsPackageCreateAsync(Sdkwork.ClawRouter.Backend.Models.AdminSkillPackageCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsPackageCreateResult>(ApiPaths.BackendPath("/ecosystem/skills/package"), body, null, null, "application/json");
        }

        /// <summary>
        /// Delete skill package
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsPackageDeleteResult?> SkillsPackageDeleteAsync(string packageId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.SkillsPackageDeleteResult>(ApiPaths.BackendPath($"/ecosystem/skills/package/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"));
        }

        /// <summary>
        /// Get skill package
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsPackageRetrieveResult?> SkillsPackageRetrieveAsync(string packageId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.SkillsPackageRetrieveResult>(ApiPaths.BackendPath($"/ecosystem/skills/package/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"));
        }

        /// <summary>
        /// Update skill package
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsPackageUpdateResult?> SkillsPackageUpdateAsync(string packageId, Sdkwork.ClawRouter.Backend.Models.AdminSkillPackageUpdateRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.SkillsPackageUpdateResult>(ApiPaths.BackendPath($"/ecosystem/skills/package/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}"), body, null, null, "application/json");
        }

        /// <summary>
        /// Disable skill package
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsPackageDisableResult?> SkillsPackageDisableAsync(string packageId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsPackageDisableResult>(ApiPaths.BackendPath($"/ecosystem/skills/package/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}/disable"), null);
        }

        /// <summary>
        /// Enable skill package
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsPackageEnableResult?> SkillsPackageEnableAsync(string packageId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsPackageEnableResult>(ApiPaths.BackendPath($"/ecosystem/skills/package/{SerializePathParameter(packageId, new PathParameterSpec("packageId", "simple", false))}/enable"), null);
        }

        /// <summary>
        /// Delete skill
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsDeleteResult?> SkillsDeleteAsync(string skillId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.SkillsDeleteResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}"));
        }

        /// <summary>
        /// Get skill
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsRetrieveResult?> SkillsRetrieveAsync(string skillId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.SkillsRetrieveResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}"));
        }

        /// <summary>
        /// Update skill
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsUpdateResult?> SkillsUpdateAsync(string skillId, Sdkwork.ClawRouter.Backend.Models.AdminSkillUpdateRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.SkillsUpdateResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}"), body, null, null, "application/json");
        }

        /// <summary>
        /// List skill artifacts
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsArtifactsListResult?> SkillsArtifactsListAsync(string skillId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.SkillsArtifactsListResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/artifacts"));
        }

        /// <summary>
        /// Create skill artifact
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsArtifactsCreateResult?> SkillsArtifactsCreateAsync(string skillId, Sdkwork.ClawRouter.Backend.Models.AdminSkillArtifactCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsArtifactsCreateResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/artifacts"), body, null, null, "application/json");
        }

        /// <summary>
        /// Delete skill artifact
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsArtifactsDeleteResult?> SkillsArtifactsDeleteAsync(string skillId, string artifactId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.SkillsArtifactsDeleteResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/artifacts/{SerializePathParameter(artifactId, new PathParameterSpec("artifactId", "simple", false))}"));
        }

        /// <summary>
        /// Get skill artifact
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsArtifactsRetrieveResult?> SkillsArtifactsRetrieveAsync(string skillId, string artifactId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.SkillsArtifactsRetrieveResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/artifacts/{SerializePathParameter(artifactId, new PathParameterSpec("artifactId", "simple", false))}"));
        }

        /// <summary>
        /// Update skill artifact
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsArtifactsUpdateResult?> SkillsArtifactsUpdateAsync(string skillId, string artifactId, Sdkwork.ClawRouter.Backend.Models.AdminSkillArtifactUpdateRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.SkillsArtifactsUpdateResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/artifacts/{SerializePathParameter(artifactId, new PathParameterSpec("artifactId", "simple", false))}"), body, null, null, "application/json");
        }

        /// <summary>
        /// List skill assets
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsAssetsListResult?> SkillsAssetsListAsync(string skillId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.SkillsAssetsListResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/assets"));
        }

        /// <summary>
        /// Create skill asset
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsAssetsCreateResult?> SkillsAssetsCreateAsync(string skillId, Sdkwork.ClawRouter.Backend.Models.AdminSkillAssetCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsAssetsCreateResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/assets"), body, null, null, "application/json");
        }

        /// <summary>
        /// Delete skill asset
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsAssetsDeleteResult?> SkillsAssetsDeleteAsync(string skillId, string assetId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.Backend.Models.SkillsAssetsDeleteResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/assets/{SerializePathParameter(assetId, new PathParameterSpec("assetId", "simple", false))}"));
        }

        /// <summary>
        /// Get skill asset
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsAssetsRetrieveResult?> SkillsAssetsRetrieveAsync(string skillId, string assetId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.Backend.Models.SkillsAssetsRetrieveResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/assets/{SerializePathParameter(assetId, new PathParameterSpec("assetId", "simple", false))}"));
        }

        /// <summary>
        /// Update skill asset
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsAssetsUpdateResult?> SkillsAssetsUpdateAsync(string skillId, string assetId, Sdkwork.ClawRouter.Backend.Models.AdminSkillAssetUpdateRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.Backend.Models.SkillsAssetsUpdateResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/assets/{SerializePathParameter(assetId, new PathParameterSpec("assetId", "simple", false))}"), body, null, null, "application/json");
        }

        /// <summary>
        /// Disable skill
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsDisableResult?> SkillsDisableAsync(string skillId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsDisableResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/disable"), null);
        }

        /// <summary>
        /// Enable skill
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsEnableResult?> SkillsEnableAsync(string skillId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsEnableResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/enable"), null);
        }

        /// <summary>
        /// Publish skill
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsPublishResult?> SkillsPublishAsync(string skillId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsPublishResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/publish"), null);
        }

        /// <summary>
        /// Approve skill
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsReviewApproveResult?> SkillsReviewApproveAsync(string skillId, Sdkwork.ClawRouter.Backend.Models.AdminSkillReviewRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsReviewApproveResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/review/approve"), body, null, null, "application/json");
        }

        /// <summary>
        /// Reject skill
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsReviewRejectResult?> SkillsReviewRejectAsync(string skillId, Sdkwork.ClawRouter.Backend.Models.AdminSkillReviewRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsReviewRejectResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/review/reject"), body, null, null, "application/json");
        }

        /// <summary>
        /// Offline skill
        /// </summary>
        public async Task<Sdkwork.ClawRouter.Backend.Models.SkillsUnpublishResult?> SkillsUnpublishAsync(string skillId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.Backend.Models.SkillsUnpublishResult>(ApiPaths.BackendPath($"/ecosystem/skills/{SerializePathParameter(skillId, new PathParameterSpec("skillId", "simple", false))}/unpublish"), null);
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
