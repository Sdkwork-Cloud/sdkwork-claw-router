using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceCheckoutQuoteRecord
    {
        public string? CheckoutSessionId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? ExpiresAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? OriginalAmount { get; set; }
        public string? PayableAmount { get; set; }
        public string? QuoteNo { get; set; }
        public string? TenantId { get; set; }
    }
}
