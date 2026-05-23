using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePriceListItemRecord
    {
        public string? CompareAtAmount { get; set; }
        public string? CreatedAt { get; set; }
        public string? MaxQuantity { get; set; }
        public string? OrganizationId { get; set; }
        public string? PriceAmount { get; set; }
        public string? PriceListId { get; set; }
        public string? SkuId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
