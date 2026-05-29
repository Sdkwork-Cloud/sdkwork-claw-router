using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiChannelVendorRecord
    {
        public string? ChannelCode { get; set; }
        public string? ChannelId { get; set; }
        public string? ChannelType { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderCode { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public bool? Supported { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? VendorId { get; set; }
        public string? Version { get; set; }
    }
}
