using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiModelVendorRecord
    {
        public Dictionary<string, string>? Capabilities { get; set; }
        public string? ColorToken { get; set; }
        public string? CountryRegion { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? DisplayName { get; set; }
        public string? DocsUrl { get; set; }
        public string? IconUrl { get; set; }
        public string? Id { get; set; }
        public string? LegalName { get; set; }
        public string? LogoUrl { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public Dictionary<string, string>? ModelFamilies { get; set; }
        public bool? OpenSource { get; set; }
        public string? OrganizationId { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? VendorType { get; set; }
        public string? Version { get; set; }
        public string? WebsiteUrl { get; set; }
    }
}
