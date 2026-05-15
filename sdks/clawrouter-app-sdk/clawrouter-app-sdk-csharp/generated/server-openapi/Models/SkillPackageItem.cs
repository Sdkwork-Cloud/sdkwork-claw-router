using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SkillPackageItem
    {
        public string? ArtifactRef { get; set; }
        public int? ArtifactSizeBytes { get; set; }
        public List<string>? Frameworks { get; set; }
        public string? Id { get; set; }
        public string? LicenseName { get; set; }
        public string? PublishedAt { get; set; }
        public string? Version { get; set; }
    }
}
