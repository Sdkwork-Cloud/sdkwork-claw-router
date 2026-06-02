using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceRechargeCheckoutStatusResponse
    {
        public string? Amount { get; set; }
        public string? CashierUrl { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? ExpiresAt { get; set; }
        public string? NextAction { get; set; }
        public string? OrderNo { get; set; }
        public string? OrderStatus { get; set; }
        public string? OutTradeNo { get; set; }
        public string? PaidAt { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PaymentProduct { get; set; }
        public string? PaymentStatus { get; set; }
        public int? Points { get; set; }
        public string? ProviderCode { get; set; }
        public string? QrCodePayload { get; set; }
        public string? RechargeStatus { get; set; }
        public Dictionary<string, string>? RequestPaymentPayload { get; set; }
        public string? Status { get; set; }
    }
}
