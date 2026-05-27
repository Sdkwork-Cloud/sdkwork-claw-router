using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePriceListRecord
    {
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? CustomerSegment { get; set; }
        public string? EndsAt { get; set; }
        public string? MarketCode { get; set; }
        public string? OrganizationId { get; set; }
        public string? PriceListNo { get; set; }
        public string? StartsAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
