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
        /// Create IAM registration
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RegistrationsCreateResult?> RegistrationsCreateAsync(Sdkwork.ClawRouter.App.Models.IamRegistrationCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.RegistrationsCreateResult>(ApiPaths.AppPath("/auth/registrations"), body, null, null, "application/json");
        }

        /// <summary>
        /// Create IAM session
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.SessionsCreateResult?> SessionsCreateAsync(Sdkwork.ClawRouter.App.Models.IamSessionCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.SessionsCreateResult>(ApiPaths.AppPath("/auth/sessions"), body, null, null, "application/json");
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
