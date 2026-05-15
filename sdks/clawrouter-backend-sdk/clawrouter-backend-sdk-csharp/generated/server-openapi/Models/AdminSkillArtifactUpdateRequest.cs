using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillArtifactUpdateRequest
    {
        public string? ArtifactRef { get; set; }
        public int? ArtifactSizeBytes { get; set; }
        public int? ArtifactType { get; set; }
        public string? ArtifactUrl { get; set; }
        public string? ChecksumHash { get; set; }
        public string? DeprecatedAt { get; set; }
        public List<string>? Frameworks { get; set; }
        public string? LicenseName { get; set; }
        public string? OsName { get; set; }
        public string? PlatformType { get; set; }
        public string? PublishedAt { get; set; }
        public string? ReleaseNotes { get; set; }
        public string? Runtime { get; set; }
        public int? Status { get; set; }
        public string? Version { get; set; }
    }
}
