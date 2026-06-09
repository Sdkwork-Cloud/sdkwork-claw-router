using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillCreateRequest
    {
        public bool? Builtin { get; set; }
        public List<string>? Capabilities { get; set; }
        public string? CategoryId { get; set; }
        public Dictionary<string, string>? ConfigSchema { get; set; }
        public MediaResource? Cover { get; set; }
        public string? Currency { get; set; }
        public Dictionary<string, string>? DefaultConfig { get; set; }
        public string? Description { get; set; }
        public string? DocumentationUrl { get; set; }
        public bool? Enabled { get; set; }
        public string? Entrypoint { get; set; }
        public bool? Featured { get; set; }
        public string? HomepageUrl { get; set; }
        public MediaResource? Icon { get; set; }
        public bool? IsBuiltin { get; set; }
        public string? LicenseName { get; set; }
        public string? ManifestUrl { get; set; }
        public string? MarketStatus { get; set; }
        public string Name { get; set; }
        public string? PackageId { get; set; }
        public string? Price { get; set; }
        public string? Provider { get; set; }
        public int? RecommendWeight { get; set; }
        public string? RepositoryUrl { get; set; }
        public string? ReviewStatus { get; set; }
        public string? Runtime { get; set; }
        public string SkillKey { get; set; }
        public string? SourceType { get; set; }
        public string? Summary { get; set; }
        public List<string>? Tags { get; set; }
        public string? Version { get; set; }
        public string? VersionName { get; set; }
        public string? Visibility { get; set; }
    }
}
