using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ContentOpenapiSnapshotRecord
    {
        public string? ApiSurface { get; set; }
        public string? ApiSystem { get; set; }
        public Dictionary<string, string>? CategoryTree { get; set; }
        public string? CreatedAt { get; set; }
        public int? EndpointCount { get; set; }
        public Dictionary<string, string>? ExampleManifest { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OpenapiHash { get; set; }
        public string? OrganizationId { get; set; }
        public string? PublishedAt { get; set; }
        public string? RebuildVersion { get; set; }
        public string? SourceId { get; set; }
        public string? SourceRef { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
