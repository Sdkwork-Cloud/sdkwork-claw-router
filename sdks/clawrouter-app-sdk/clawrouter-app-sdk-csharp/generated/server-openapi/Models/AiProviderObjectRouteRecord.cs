using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiProviderObjectRouteRecord
    {
        public string? ApiCode { get; set; }
        public string? ApiKeyId { get; set; }
        public string? CatalogKey { get; set; }
        public string? ChannelGroupId { get; set; }
        public string? ChannelId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EndpointId { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? LastSeenAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? ObjectId { get; set; }
        public string? ObjectKeyHash { get; set; }
        public string? ObjectType { get; set; }
        public string? OrganizationId { get; set; }
        public string? ParentObjectId { get; set; }
        public string? ParentObjectType { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderModel { get; set; }
        public string? RegionCode { get; set; }
        public string? Status { get; set; }
        public string? StickyScope { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? Version { get; set; }
    }
}
