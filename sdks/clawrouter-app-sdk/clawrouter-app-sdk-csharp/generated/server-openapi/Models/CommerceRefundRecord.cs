using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceRefundRecord
    {
        public string? Amount { get; set; }
        public string? CreatedAt { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? PaymentAttemptId { get; set; }
        public string? RefundNo { get; set; }
        public string? RequestNo { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
