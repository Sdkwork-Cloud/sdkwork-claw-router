using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePaymentAttemptRecord
    {
        public string? Amount { get; set; }
        public string? CallbackPayload { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? OrderId { get; set; }
        public string? OrganizationId { get; set; }
        public string? OutTradeNo { get; set; }
        public string? OwnerUserId { get; set; }
        public string? PaidAt { get; set; }
        public string? PaymentIntentId { get; set; }
        public string? Provider { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
