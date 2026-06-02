using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceMembershipEntitlementUsageRecord
    {
        public string? BalanceAfter { get; set; }
        public string? CreatedAt { get; set; }
        public string? EntitlementId { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? MembershipId { get; set; }
        public string? OccurredAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? TenantId { get; set; }
        public string? UsageNo { get; set; }
        public string? UsedAmount { get; set; }
    }
}
