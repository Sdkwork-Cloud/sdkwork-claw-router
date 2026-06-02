using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductSkuRecord
    {
        public string? CreatedAt { get; set; }
        public string? DefaultCurrencyCode { get; set; }
        public string? DefaultPriceAmount { get; set; }
        public string? FulfillmentType { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public string? PublishedAt { get; set; }
        public string? SalesUnit { get; set; }
        public string? SkuNo { get; set; }
        public string? SpuId { get; set; }
        public string? Status { get; set; }
        public string? TaxCategory { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
