using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.App.Models;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;

namespace Sdkwork.ClawRouter.App.Api
{
    public class IamApi
    {
        private readonly SdkHttpClient _client;

        public IamApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// List keys
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.ApiKeysListResult?> ApiKeysListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.ApiKeysListResult>(ApiPaths.AppPath("/iam/api_keys"));
        }

        /// <summary>
        /// Create key
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.ApiKeysCreateResult?> ApiKeysCreateAsync(Sdkwork.ClawRouter.App.Models.CreateApiKeyRequest body, string idempotencyKey, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["Idempotency-Key"] = new HeaderParameterSpec(idempotencyKey, "simple", false, null),
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.ApiKeysCreateResult>(ApiPaths.AppPath("/iam/api_keys"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Retrieve current IAM user
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.UsersCurrentRetrieveResult?> UsersCurrentRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.UsersCurrentRetrieveResult>(ApiPaths.AppPath("/iam/users/current"));
        }

        /// <summary>
        /// List settings
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.UsersSettingsRetrieveResult?> UsersSettingsRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.UsersSettingsRetrieveResult>(ApiPaths.AppPath("/iam/users/settings"));
        }

        /// <summary>
        /// Update settings
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.UsersSettingsUpdateResult?> UsersSettingsUpdateAsync(Sdkwork.ClawRouter.App.Models.UpdateSettingsRequest body)
        {
            return await _client.PutAsync<Sdkwork.ClawRouter.App.Models.UsersSettingsUpdateResult>(ApiPaths.AppPath("/iam/users/settings"), body, null, null, "application/json");
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
