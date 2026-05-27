using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePaymentIntentCreateRequest
    {
        public string? Amount { get; set; }
        public string? CheckoutSessionId { get; set; }
        public string? ClientRequestNo { get; set; }
        public string? CurrencyCode { get; set; }
        public string? MethodCode { get; set; }
        public string? Note { get; set; }
        public string? OrderId { get; set; }
        public string? SubjectType { get; set; }
    }
}
