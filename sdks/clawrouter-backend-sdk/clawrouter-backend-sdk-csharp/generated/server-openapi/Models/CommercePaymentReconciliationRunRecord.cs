using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentReconciliationRunRecord
    {
        public string? CompletedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? DifferenceAmount { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? MatchedCount { get; set; }
        public string? MismatchedCount { get; set; }
        public string? MissingInternalCount { get; set; }
        public string? MissingProviderCount { get; set; }
        public string? OrganizationId { get; set; }
        public string? PeriodEnd { get; set; }
        public string? PeriodStart { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? ReportFileRef { get; set; }
        public string? RequestNo { get; set; }
        public string? RunNo { get; set; }
        public string? SettlementCurrency { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TotalInternalAmount { get; set; }
        public string? TotalProviderAmount { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
