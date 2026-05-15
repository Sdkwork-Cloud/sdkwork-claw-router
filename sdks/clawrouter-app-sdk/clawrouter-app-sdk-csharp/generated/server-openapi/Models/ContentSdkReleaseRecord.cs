using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ContentSdkReleaseRecord
    {
        public string? ApiSystem { get; set; }
        public Dictionary<string, string>? ArtifactManifest { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultBaseUrl { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DocsUrl { get; set; }
        public string? ExampleCode { get; set; }
        public Dictionary<string, string>? ExampleManifest { get; set; }
        public string? GithubUrl { get; set; }
        public string? Id { get; set; }
        public string? ImportCode { get; set; }
        public string? InitCode { get; set; }
        public string? InstallCommand { get; set; }
        public string? Language { get; set; }
        public string? LanguageDescription { get; set; }
        public string? LanguageIcon { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OpenapiSnapshotId { get; set; }
        public string? OrganizationId { get; set; }
        public string? PackageManager { get; set; }
        public string? PackageName { get; set; }
        public string? PublishedAt { get; set; }
        public string? SourceRepo { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
