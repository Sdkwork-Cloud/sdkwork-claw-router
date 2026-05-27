using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePaymentAttemptItem
    {
        public string? Amount { get; set; }
        public string? AttemptNo { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? ExternalTradeNo { get; set; }
        public string? Id { get; set; }
        public string? IntentId { get; set; }
        public string? MethodCode { get; set; }
        public string? PaidAt { get; set; }
        public string? ProviderCode { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
