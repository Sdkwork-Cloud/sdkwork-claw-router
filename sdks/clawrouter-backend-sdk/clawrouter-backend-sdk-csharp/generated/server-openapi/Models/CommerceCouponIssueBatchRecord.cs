using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceCouponIssueBatchRecord
    {
        public string? AudienceFilter { get; set; }
        public string? BatchNo { get; set; }
        public string? CampaignCode { get; set; }
        public string? CodePattern { get; set; }
        public string? CodePrefix { get; set; }
        public string? CouponTemplateId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? GeneratedAt { get; set; }
        public string? GenerationStatus { get; set; }
        public string? OrganizationId { get; set; }
        public string? RequestedQuantity { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
