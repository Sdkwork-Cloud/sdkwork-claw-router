using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceCartItemRecord
    {
        public string? CartId { get; set; }
        public string? CreatedAt { get; set; }
        public Dictionary<string, string>? MetadataJson { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? PriceSnapshotJson { get; set; }
        public string? SkuId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
