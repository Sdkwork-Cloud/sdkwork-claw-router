using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePriceListMutationRequest
    {
        public string? CurrencyCode { get; set; }
        public string? CustomerSegment { get; set; }
        public string? EndsAt { get; set; }
        public string? MarketCode { get; set; }
        public string? PriceListNo { get; set; }
        public string? StartsAt { get; set; }
        public string? Status { get; set; }
    }
}
