using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamUserPreferenceRecord
    {
        public Dictionary<string, string>? AppearanceConfig { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultConsolePath { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public string? Language { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public Dictionary<string, string>? NotificationPreferences { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? ThemeMode { get; set; }
        public string? Timezone { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
