using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductSkuItem
    {
        public List<CommerceProductSkuAttributeItem>? Attributes { get; set; }
        public string? Barcode { get; set; }
        public string? CreatedAt { get; set; }
        public string? DefaultCurrencyCode { get; set; }
        public string? DefaultPriceAmount { get; set; }
        public string? FulfillmentType { get; set; }
        public string? Id { get; set; }
        public MediaResource? Image { get; set; }
        public string? ProductId { get; set; }
        public string? PublishedAt { get; set; }
        public string? SalesUnit { get; set; }
        public string? SkuNo { get; set; }
        public string? Status { get; set; }
        public string? TaxCategory { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
