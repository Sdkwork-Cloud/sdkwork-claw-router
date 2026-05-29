using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiRouteCandidateRecord
    {
        public string? ApiCode { get; set; }
        public string? CatalogKey { get; set; }
        public string? ChannelGroupId { get; set; }
        public string? ChannelId { get; set; }
        public string? ChannelType { get; set; }
        public string? ConfigVersion { get; set; }
        public string? CreatedAt { get; set; }
        public string? EndpointId { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? ModelCode { get; set; }
        public string? OrganizationId { get; set; }
        public int? Priority { get; set; }
        public string? ProviderCode { get; set; }
        public string? RebuildVersion { get; set; }
        public string? RefreshedAt { get; set; }
        public string? RegionCode { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public int? Weight { get; set; }
    }
}
