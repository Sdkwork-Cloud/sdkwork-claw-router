using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionOfferScopeRecord
    {
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? MatchMode { get; set; }
        public string? OfferVersionId { get; set; }
        public string? OrganizationId { get; set; }
        public int? Priority { get; set; }
        public string? ScopeType { get; set; }
        public string? TargetCode { get; set; }
        public string? TargetId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
