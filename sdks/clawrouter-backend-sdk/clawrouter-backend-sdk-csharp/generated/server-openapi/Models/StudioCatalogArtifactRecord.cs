using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class StudioCatalogArtifactRecord
    {
        public string? ArtifactRef { get; set; }
        public string? ArtifactSizeBytes { get; set; }
        public string? ArtifactType { get; set; }
        public string? ArtifactUrl { get; set; }
        public string? ChecksumHash { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeprecatedAt { get; set; }
        public Dictionary<string, string>? Frameworks { get; set; }
        public string? Id { get; set; }
        public string? LicenseName { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OsName { get; set; }
        public string? PlatformType { get; set; }
        public string? PublishedAt { get; set; }
        public string? ReleaseNotes { get; set; }
        public string? Runtime { get; set; }
        public string? Status { get; set; }
        public string? TargetId { get; set; }
        public string? TargetType { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
