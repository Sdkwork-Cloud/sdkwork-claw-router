using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePaymentIntentItem
    {
        public string? Amount { get; set; }
        public string? CheckoutSessionId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? Id { get; set; }
        public string? IntentNo { get; set; }
        public string? MethodCode { get; set; }
        public string? OrderId { get; set; }
        public string? ProviderCode { get; set; }
        public string? Status { get; set; }
        public string? SubjectType { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
