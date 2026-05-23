using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceSkuRecord
    {
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? OriginalPriceAmount { get; set; }
        public string? PriceAmount { get; set; }
        public string? ProductId { get; set; }
        public string? SkuNo { get; set; }
        public string? SpecJson { get; set; }
        public string? Status { get; set; }
        public string? StockQuantity { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
