using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionOfferRecord
    {
        public string? AudienceScope { get; set; }
        public string? Combinability { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? CurrentOfferVersionId { get; set; }
        public string? Description { get; set; }
        public string? EndsAt { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? OfferCode { get; set; }
        public string? OfferNo { get; set; }
        public string? OfferType { get; set; }
        public string? OrganizationId { get; set; }
        public int? Priority { get; set; }
        public string? StartsAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
