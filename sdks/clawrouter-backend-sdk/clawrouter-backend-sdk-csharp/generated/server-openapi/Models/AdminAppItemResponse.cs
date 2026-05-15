using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAppItemResponse
    {
        public string? AccessUrl { get; set; }
        public string? AppKey { get; set; }
        public string? AppType { get; set; }
        public string? BundleId { get; set; }
        public AdminAppConfig? Config { get; set; }
        public string? CreatedAt { get; set; }
        public string? Description { get; set; }
        public string? DownloadUrl { get; set; }
        public Dictionary<string, string>? Icon { get; set; }
        public string? IconUrl { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? InstallConfig { get; set; }
        public Dictionary<string, string>? InstallPlatforms { get; set; }
        public Dictionary<string, string>? InstallSkill { get; set; }
        public string? MarketStatus { get; set; }
        public string? Name { get; set; }
        public string? PackageName { get; set; }
        public Dictionary<string, string>? Platforms { get; set; }
        public string? ProjectId { get; set; }
        public List<Dictionary<string, string>>? ReleaseNotes { get; set; }
        public Dictionary<string, string>? ResourceList { get; set; }
        public string? Status { get; set; }
        public string? StoreUrl { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
