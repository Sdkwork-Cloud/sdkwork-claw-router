using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiProviderRecord
    {
        public string? AuthType { get; set; }
        public string? BaseUrl { get; set; }
        public string? ColorToken { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultVendorCode { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? DisplayName { get; set; }
        public string? DocsUrl { get; set; }
        public MediaResource? Icon { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MetadataSchemaVersion { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProtocolCode { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderType { get; set; }
        public Dictionary<string, string>? ResourceSchema { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? WebsiteUrl { get; set; }
    }
}
