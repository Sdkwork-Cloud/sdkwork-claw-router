using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PlusUserAgentSkillRecord
    {
        public Dictionary<string, string>? Config { get; set; }
        public string? CreatedAt { get; set; }
        public int? DataScope { get; set; }
        public bool? Enabled { get; set; }
        public string? Id { get; set; }
        public string? InstalledAt { get; set; }
        public string? LastEnabledAt { get; set; }
        public string? LastUsedAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? SkillId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UsedCount { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? V { get; set; }
    }
}
