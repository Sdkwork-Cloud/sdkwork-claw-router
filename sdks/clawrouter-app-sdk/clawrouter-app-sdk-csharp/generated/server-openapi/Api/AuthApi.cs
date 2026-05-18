using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.App.Models;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;

namespace Sdkwork.ClawRouter.App.Api
{
    public class AuthApi
    {
        private readonly SdkHttpClient _client;

        public AuthApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// Retrieve OAuth authorization URL
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.OauthAuthorizationUrlsRetrieveResult?> OauthAuthorizationUrlsRetrieveAsync(string provider, string redirectUri, string? state = null, string? scope = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("provider", provider, "form", true, false, null),
                new QueryParameterSpec("redirect_uri", redirectUri, "form", true, false, null),
                new QueryParameterSpec("state", state, "form", true, false, null),
                new QueryParameterSpec("scope", scope, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.OauthAuthorizationUrlsRetrieveResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/auth/oauth_authorization_urls"), queryString));
        }

        /// <summary>
        /// Create OAuth IAM session
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.OauthSessionsCreateResult?> OauthSessionsCreateAsync(Sdkwork.ClawRouter.App.Models.IamOauthSessionCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.OauthSessionsCreateResult>(ApiPaths.AppPath("/auth/oauth_sessions"), body, null, null, "application/json");
        }

        /// <summary>
        /// Create password reset request
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PasswordResetRequestsCreateResult?> PasswordResetRequestsCreateAsync(Sdkwork.ClawRouter.App.Models.IamPasswordResetRequestCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.PasswordResetRequestsCreateResult>(ApiPaths.AppPath("/auth/password_reset_requests"), body, null, null, "application/json");
        }

        /// <summary>
        /// Create password reset
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.PasswordResetsCreateResult?> PasswordResetsCreateAsync(Sdkwork.ClawRouter.App.Models.IamPasswordResetCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.PasswordResetsCreateResult>(ApiPaths.AppPath("/auth/password_resets"), body, null, null, "application/json");
        }

        /// <summary>
        /// Create QR login code
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.LoginQrCodesCreateResult?> LoginQrCodesCreateAsync()
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.LoginQrCodesCreateResult>(ApiPaths.AppPath("/auth/qr_login_codes"), null);
        }

        /// <summary>
        /// Confirm QR login code
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.LoginQrCodesConfirmResult?> LoginQrCodesConfirmAsync(Sdkwork.ClawRouter.App.Models.IamLoginQrCodeConfirmRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.LoginQrCodesConfirmResult>(ApiPaths.AppPath("/auth/qr_login_codes/confirm"), body, null, null, "application/json");
        }

        /// <summary>
        /// Retrieve QR login status
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.LoginQrCodesRetrieveResult?> LoginQrCodesRetrieveAsync(string qrKey)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.LoginQrCodesRetrieveResult>(ApiPaths.AppPath($"/auth/qr_login_codes/{SerializePathParameter(qrKey, new PathParameterSpec("qrKey", "simple", false))}"));
        }

        /// <summary>
        /// Create IAM registration
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RegistrationsCreateResult?> RegistrationsCreateAsync(Sdkwork.ClawRouter.App.Models.IamRegistrationCreateRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.RegistrationsCreateResult>(ApiPaths.AppPath("/auth/registrations"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Retrieve public IAM auth runtime settings
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RuntimeSettingsRetrieveResult?> RuntimeSettingsRetrieveAsync(string? tenantCode = null, string? organizationCode = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("tenant_code", tenantCode, "form", true, false, null),
                new QueryParameterSpec("organization_code", organizationCode, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RuntimeSettingsRetrieveResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/auth/runtime_settings"), queryString));
        }

        /// <summary>
        /// Create IAM session
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.SessionsCreateResult?> SessionsCreateAsync(Sdkwork.ClawRouter.App.Models.IamSessionCreateRequest body, string? xRequestId = null)
        {
            var requestHeaders = BuildRequestHeaders(
                new Dictionary<string, HeaderParameterSpec>
                {
                    ["X-Request-Id"] = new HeaderParameterSpec(xRequestId, "simple", false, null),
                },
                new Dictionary<string, HeaderParameterSpec>()
            );
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.SessionsCreateResult>(ApiPaths.AppPath("/auth/sessions"), body, null, requestHeaders, "application/json");
        }

        /// <summary>
        /// Delete current IAM session
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.SessionsCurrentDeleteResult?> SessionsCurrentDeleteAsync()
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.App.Models.SessionsCurrentDeleteResult>(ApiPaths.AppPath("/auth/sessions/current"));
        }

        /// <summary>
        /// Retrieve current IAM session
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.SessionsCurrentRetrieveResult?> SessionsCurrentRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.SessionsCurrentRetrieveResult>(ApiPaths.AppPath("/auth/sessions/current"));
        }

        /// <summary>
        /// Update current IAM session
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.SessionsCurrentUpdateResult?> SessionsCurrentUpdateAsync(Sdkwork.ClawRouter.App.Models.IamCurrentSessionUpdateRequest body)
        {
            return await _client.PatchAsync<Sdkwork.ClawRouter.App.Models.SessionsCurrentUpdateResult>(ApiPaths.AppPath("/auth/sessions/current"), body, null, null, "application/json");
        }

        /// <summary>
        /// Refresh IAM session
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.SessionsRefreshResult?> SessionsRefreshAsync(Sdkwork.ClawRouter.App.Models.IamSessionRefreshRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.SessionsRefreshResult>(ApiPaths.AppPath("/auth/sessions/refresh"), body, null, null, "application/json");
        }

        /// <summary>
        /// Create verification code
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.VerificationCodesCreateResult?> VerificationCodesCreateAsync(Sdkwork.ClawRouter.App.Models.IamVerificationCodeCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.VerificationCodesCreateResult>(ApiPaths.AppPath("/auth/verification_codes"), body, null, null, "application/json");
        }

        /// <summary>
        /// Verify verification code
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.VerificationCodesVerifyResult?> VerificationCodesVerifyAsync(Sdkwork.ClawRouter.App.Models.IamVerificationCodeVerifyRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.VerificationCodesVerifyResult>(ApiPaths.AppPath("/auth/verification_codes/verify"), body, null, null, "application/json");
        }

        /// <summary>
        /// Retrieve public IAM verification policy
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.VerificationPolicyRetrieveResult?> VerificationPolicyRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.VerificationPolicyRetrieveResult>(ApiPaths.AppPath("/auth/verification_policy"));
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
