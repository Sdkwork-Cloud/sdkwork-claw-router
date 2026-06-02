using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentIntentRecord
    {
        public string? Amount { get; set; }
        public string? CapturedAmount { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? MerchantOrderNo { get; set; }
        public string? MetadataJson { get; set; }
        public string? NextActionJson { get; set; }
        public string? OrderId { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Provider { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderNativeJson { get; set; }
        public string? RefundedAmount { get; set; }
        public string? RequestNo { get; set; }
        public string? SceneCode { get; set; }
        public string? Status { get; set; }
        public string? Subject { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
