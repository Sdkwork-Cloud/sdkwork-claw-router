using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamUserSecuritySettingRecord
    {
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public string? LastLoginAt { get; set; }
        public string? LastLoginIpHash { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public bool? MfaEnabled { get; set; }
        public string? MfaMethod { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? PasswordLastChangedAt { get; set; }
        public string? SecurityLevel { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public Dictionary<string, string>? ThirdPartyBoundSnapshot { get; set; }
        public int? TrustedDeviceCount { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
