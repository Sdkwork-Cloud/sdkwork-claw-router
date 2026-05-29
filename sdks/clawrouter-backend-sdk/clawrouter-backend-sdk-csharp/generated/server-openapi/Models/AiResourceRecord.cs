using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiResourceRecord
    {
        public string? ApiCode { get; set; }
        public string? ApiEndpointId { get; set; }
        public string? CatalogKey { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? DisplayName { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public Dictionary<string, string>? MetadataSchema { get; set; }
        public string? ModalityCode { get; set; }
        public string? ModalityId { get; set; }
        public string? Model { get; set; }
        public string? ModelCode { get; set; }
        public string? ModelId { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderNativeModel { get; set; }
        public string? ResourceCode { get; set; }
        public Dictionary<string, string>? ResourceSchema { get; set; }
        public string? ResourceType { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? VendorId { get; set; }
        public string? Version { get; set; }
    }
}
