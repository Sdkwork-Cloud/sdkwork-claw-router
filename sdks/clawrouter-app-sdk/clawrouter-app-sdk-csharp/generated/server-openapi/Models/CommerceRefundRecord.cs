using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceRefundRecord
    {
        public string? Amount { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? PaymentAttemptId { get; set; }
        public string? PaymentIntentId { get; set; }
        public string? ProviderCode { get; set; }
        public string? Reason { get; set; }
        public string? RefundNo { get; set; }
        public string? RequestNo { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
