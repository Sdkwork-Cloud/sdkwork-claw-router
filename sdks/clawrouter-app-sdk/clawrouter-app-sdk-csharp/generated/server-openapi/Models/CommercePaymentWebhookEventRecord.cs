using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePaymentWebhookEventRecord
    {
        public string? CreatedAt { get; set; }
        public string? EventId { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? Message { get; set; }
        public string? Nonce { get; set; }
        public string? OrganizationId { get; set; }
        public string? OutTradeNo { get; set; }
        public string? PayloadDigest { get; set; }
        public string? ProcessedAt { get; set; }
        public string? Provider { get; set; }
        public string? RequestNo { get; set; }
        public string? RequestTimestamp { get; set; }
        public string? Signature { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TransactionId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
