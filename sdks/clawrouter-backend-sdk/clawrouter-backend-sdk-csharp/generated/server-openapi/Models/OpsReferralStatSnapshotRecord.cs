using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpsReferralStatSnapshotRecord
    {
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? DirectInvitedCount { get; set; }
        public string? Id { get; set; }
        public string? InvitationCode { get; set; }
        public string? InvitationCodeId { get; set; }
        public string? InviteLink { get; set; }
        public string? InviterEmailSnapshot { get; set; }
        public string? InviterNameSnapshot { get; set; }
        public string? InviterUserId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PaidInviteeCount { get; set; }
        public string? PeriodEnd { get; set; }
        public string? PeriodStart { get; set; }
        public string? RebuildVersion { get; set; }
        public string? RewardAwardedAmount { get; set; }
        public string? RewardPendingAmount { get; set; }
        public string? SecondaryInvitedCount { get; set; }
        public string? SnapshotAt { get; set; }
        public string? SnapshotPeriod { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TotalInvitedCount { get; set; }
        public string? TotalRevenueAmount { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
    }
}
