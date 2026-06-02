using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PlusAppRecord
    {
        public string? AccessUrl { get; set; }
        public string? AppType { get; set; }
        public MediaResource? Artifact { get; set; }
        public string? BundleId { get; set; }
        public Dictionary<string, string>? Config { get; set; }
        public string? CreatedAt { get; set; }
        public int? DataScope { get; set; }
        public string? Description { get; set; }
        public MediaResource? Icon { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? InstallConfig { get; set; }
        public Dictionary<string, string>? InstallPlatforms { get; set; }
        public Dictionary<string, string>? InstallSkill { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? PackageName { get; set; }
        public Dictionary<string, string>? Platforms { get; set; }
        public string? ProjectId { get; set; }
        public Dictionary<string, string>? ReleaseNotes { get; set; }
        public Dictionary<string, string>? ResourceList { get; set; }
        public int? Status { get; set; }
        public string? StoreUrl { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? V { get; set; }
        public string? Version { get; set; }
    }
}
