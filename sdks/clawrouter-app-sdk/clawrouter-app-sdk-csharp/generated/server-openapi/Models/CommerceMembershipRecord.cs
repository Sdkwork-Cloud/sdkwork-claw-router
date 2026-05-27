using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceMembershipRecord
    {
        public string? CreatedAt { get; set; }
        public string? ExpiresAt { get; set; }
        public string? GraceUntil { get; set; }
        public string? MembershipNo { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? PlanId { get; set; }
        public string? SourceOrderId { get; set; }
        public string? SourcePaymentIntentId { get; set; }
        public string? StartsAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
