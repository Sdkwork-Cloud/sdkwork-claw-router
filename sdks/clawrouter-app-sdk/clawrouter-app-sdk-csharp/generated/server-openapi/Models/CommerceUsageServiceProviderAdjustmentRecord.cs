using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceUsageServiceProviderAdjustmentRecord
    {
        public string? AdjustmentNo { get; set; }
        public string? AdjustmentType { get; set; }
        public string? Amount { get; set; }
        public string? ApprovalStatus { get; set; }
        public string? ApprovedBy { get; set; }
        public string? BuyerProviderId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? ReasonCode { get; set; }
        public string? ReasonMessage { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? SellerProviderId { get; set; }
        public string? SettledLedgerEntryId { get; set; }
        public string? StatementId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UsageEdgeId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
