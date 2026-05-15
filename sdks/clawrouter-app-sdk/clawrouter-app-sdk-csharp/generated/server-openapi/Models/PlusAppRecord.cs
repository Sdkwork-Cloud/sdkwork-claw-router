using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PlusAppRecord
    {
        public string? AccessUrl { get; set; }
        public string? AppType { get; set; }
        public string? BundleId { get; set; }
        public string? Description { get; set; }
        public string? DownloadUrl { get; set; }
        public Dictionary<string, string>? Icon { get; set; }
        public string? IconUrl { get; set; }
        public Dictionary<string, string>? InstallConfig { get; set; }
        public Dictionary<string, string>? InstallPlatforms { get; set; }
        public Dictionary<string, string>? InstallSkill { get; set; }
        public string? PackageName { get; set; }
        public Dictionary<string, string>? Platforms { get; set; }
        public string? ProjectId { get; set; }
        public Dictionary<string, string>? ReleaseNotes { get; set; }
        public Dictionary<string, string>? ResourceList { get; set; }
        public string? StoreUrl { get; set; }
        public string? UserId { get; set; }
        public string? Version { get; set; }
    }
}
