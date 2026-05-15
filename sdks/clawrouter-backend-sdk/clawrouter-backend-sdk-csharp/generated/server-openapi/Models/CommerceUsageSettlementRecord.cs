using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceUsageSettlementRecord
    {
        public string? AccountHistoryId { get; set; }
        public string? AccountId { get; set; }
        public string? Amount { get; set; }
        public string? AssetType { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? Direction { get; set; }
        public string? FailureCode { get; set; }
        public string? FailureMessage { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrderId { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? PaymentId { get; set; }
        public string? Points { get; set; }
        public Dictionary<string, string>? PriceSnapshot { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? SettledAt { get; set; }
        public string? SettlementNo { get; set; }
        public string? SettlementStatus { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Tokens { get; set; }
        public string? TraceId { get; set; }
        public string? UsageFactId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
