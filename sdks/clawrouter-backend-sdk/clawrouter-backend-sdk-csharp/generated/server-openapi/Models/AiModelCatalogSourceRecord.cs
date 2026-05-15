using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiModelCatalogSourceRecord
    {
        public string? CatalogVersion { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? ErrorMessageMasked { get; set; }
        public string? Id { get; set; }
        public string? LastObservedAt { get; set; }
        public string? LastSuccessAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? NormalizedPayloadHash { get; set; }
        public string? OrganizationId { get; set; }
        public string? ParserKind { get; set; }
        public string? ProviderCode { get; set; }
        public string? RawPayloadRef { get; set; }
        public string? RefreshIntervalSeconds { get; set; }
        public string? RegionCode { get; set; }
        public string? SchemaVersion { get; set; }
        public string? SourceCode { get; set; }
        public string? SourceHash { get; set; }
        public string? SourceKind { get; set; }
        public string? SourceName { get; set; }
        public string? SourceUrl { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TrustLevel { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? Version { get; set; }
    }
}
