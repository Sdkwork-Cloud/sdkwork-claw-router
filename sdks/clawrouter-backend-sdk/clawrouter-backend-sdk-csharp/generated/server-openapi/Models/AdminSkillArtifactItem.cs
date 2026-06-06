using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillArtifactItem
    {
        public MediaResource? Artifact { get; set; }
        public string? ArtifactRef { get; set; }
        public string? ArtifactSizeBytes { get; set; }
        public int? ArtifactType { get; set; }
        public string? ChecksumHash { get; set; }
        public string? CreatedAt { get; set; }
        public string? DeprecatedAt { get; set; }
        public List<string>? Frameworks { get; set; }
        public string? Id { get; set; }
        public string? LicenseName { get; set; }
        public string? OsName { get; set; }
        public string? PlatformType { get; set; }
        public string? PublishedAt { get; set; }
        public string? ReleaseNotes { get; set; }
        public string? Runtime { get; set; }
        public string? SkillId { get; set; }
        public int? Status { get; set; }
        public string? TargetId { get; set; }
        public int? TargetType { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Version { get; set; }
    }
}
