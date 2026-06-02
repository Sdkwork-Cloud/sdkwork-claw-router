using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceRechargeOrderCreateResponse
    {
        public string? Amount { get; set; }
        public string? CashierUrl { get; set; }
        public string? CurrencyCode { get; set; }
        public string? NextAction { get; set; }
        public string? OrderNo { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PaymentProduct { get; set; }
        public int? Points { get; set; }
        public string? ProviderCode { get; set; }
        public string? QrCodePayload { get; set; }
        public Dictionary<string, string>? RequestPaymentPayload { get; set; }
        public string? Status { get; set; }
        public bool? Success { get; set; }
    }
}
