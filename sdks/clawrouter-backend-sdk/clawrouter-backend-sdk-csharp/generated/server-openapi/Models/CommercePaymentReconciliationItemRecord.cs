using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentReconciliationItemRecord
    {
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? DifferenceAmount { get; set; }
        public string? DifferenceType { get; set; }
        public string? Id { get; set; }
        public string? InternalAmount { get; set; }
        public string? InternalStatus { get; set; }
        public string? MatchStatus { get; set; }
        public string? OrganizationId { get; set; }
        public string? PaymentAttemptId { get; set; }
        public string? ProviderAmount { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderStatus { get; set; }
        public string? ReconciliationRunId { get; set; }
        public string? RefundAttemptId { get; set; }
        public string? RefundId { get; set; }
        public string? ResolutionNote { get; set; }
        public string? ResolutionStatus { get; set; }
        public string? ResolvedAt { get; set; }
        public string? ResolvedBy { get; set; }
        public string? StatementId { get; set; }
        public string? StatementItemId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
