using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePaymentDisputeRecord
    {
        public string? Amount { get; set; }
        public string? ClosedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? DisputeNo { get; set; }
        public string? EvidenceDueAt { get; set; }
        public string? Id { get; set; }
        public string? NativeDisputeId { get; set; }
        public string? OpenedAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PaymentAttemptId { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? ReasonCode { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
