using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OpenPlatformQrAuthSessionResponse
    {
        public string? CompletedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? DefaultAccountId { get; set; }
        public string? DefaultAccountType { get; set; }
        public string? DefaultEntryId { get; set; }
        public string? DefaultProvider { get; set; }
        public string? ExpiresAt { get; set; }
        public string? FallbackUrl { get; set; }
        public string? Id { get; set; }
        public string? Purpose { get; set; }
        public Dictionary<string, object>? QrContent { get; set; }
        public string? ScannedAt { get; set; }
        public IamSessionResponse? Session { get; set; }
        public string? SessionKey { get; set; }
        public string? Status { get; set; }
        public IamSessionResponse? Token { get; set; }
        public string? UpdatedAt { get; set; }
        public IamUserResponse? UserInfo { get; set; }
    }
}
