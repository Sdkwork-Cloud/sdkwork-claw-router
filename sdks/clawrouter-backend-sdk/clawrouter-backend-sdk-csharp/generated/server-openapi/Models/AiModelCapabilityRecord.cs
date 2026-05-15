using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiModelCapabilityRecord
    {
        public string? Capability { get; set; }
        public string? CapabilityCode { get; set; }
        public string? CatalogKey { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public Dictionary<string, string>? EndpointFormats { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? InputModalities { get; set; }
        public string? LimitUnit { get; set; }
        public string? LimitValue { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Modality { get; set; }
        public string? Model { get; set; }
        public string? ModelId { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? OutputModalities { get; set; }
        public string? ParameterName { get; set; }
        public Dictionary<string, string>? ParameterSchema { get; set; }
        public string? RegionCode { get; set; }
        public string? SchemaVersion { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public bool? Supported { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? Version { get; set; }
    }
}
