using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpsCouponIssueBatchRecord
    {
        public Dictionary<string, string>? AudienceFilter { get; set; }
        public string? AvailableCount { get; set; }
        public string? BatchNo { get; set; }
        public string? CampaignCode { get; set; }
        public string? ClaimedCount { get; set; }
        public string? CodePattern { get; set; }
        public string? CodePrefix { get; set; }
        public string? CouponId { get; set; }
        public string? CouponTemplateId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? ExpireAt { get; set; }
        public string? GeneratedAt { get; set; }
        public string? GeneratedCount { get; set; }
        public string? GenerationStatus { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? RequestedCount { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UsedCount { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? VoidedCount { get; set; }
    }
}
